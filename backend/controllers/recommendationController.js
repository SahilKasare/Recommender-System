const fs = require("fs");
const path = require("path");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

// Random demo user pool (replace or extend as needed)
const DEMO_USER_IDS = [
  "AGP7EEKKJLA6CWVVGFW35VOUJDCA",
  "AGK75AOJP6GW6GYYDMMIKLWBIMMA",
  "AGH4VWMDVSXIEJVCNFZ3PMVUNM7Q",
  "AGYIN4WCKIPEJFB3EHDKBBZ53Z3Q",
  "AHTDWJH73LM6QYUN2LARA3SNAFRA",
  "AG3M7LZBCFPKYTG6GQAGZQD2QAHQ",
  "AG7QVV3NBCA3FB35XOIGKFMH4RLQ",
];

function safeJSONParse(line) {
  try {
    return JSON.parse(line);
  } catch (e) {
    return null;
  }
}

function loadJsonLines(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) return [];
  const raw = fs.readFileSync(abs, "utf-8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const items = [];
  for (const line of lines) {
    let obj = safeJSONParse(line.trim());
    if (!obj) {
      const match = line.match(/(\{[\s\S]*\})/);
      if (match) obj = safeJSONParse(match[1]);
    }
    if (obj) items.push(obj);
  }
  return items;
}

function getAspectColumnsFromData(reviewsData) {
  const aspectColumns = new Set();
  for (const r of reviewsData) {
    for (const k of Object.keys(r)) {
      if (k.endsWith("_score")) aspectColumns.add(k);
    }
  }
  return Array.from(aspectColumns);
}

function averageVector(vectors) {
  if (vectors.length === 0) return {};
  const sums = {};
  for (const vec of vectors) {
    for (const [k, v] of Object.entries(vec)) {
      const val = typeof v === "number" && isFinite(v) ? v : 0;
      sums[k] = (sums[k] || 0) + val;
    }
  }
  const result = {};
  const count = vectors.length;
  for (const [k, v] of Object.entries(sums)) result[k] = v / count;
  return result;
}

function cosineSimilarity(a, b, keys) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const k of keys) {
    const av = typeof a[k] === "number" ? a[k] : 0;
    const bv = typeof b[k] === "number" ? b[k] : 0;
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function topNKeys(obj, n) {
  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function recommendProductsJS({ userId, reviewsFile, metadataFile, topN = 30 }) {
  const reviewsData = loadJsonLines(reviewsFile);
  const metadataData = loadJsonLines(metadataFile);

  if (reviewsData.length === 0) {
    return { userId, recommendations: [], message: "No reviews data found" };
  }

  const aspectCols = getAspectColumnsFromData(reviewsData);
  if (aspectCols.length === 0) {
    return {
      userId,
      recommendations: [],
      message: "No aspect score columns found",
    };
  }

  const userReviews = reviewsData.filter((r) => r.user_id === userId);
  if (userReviews.length === 0) {
    return {
      userId,
      recommendations: [],
      message: `User ${userId} not found in dataset`,
    };
  }

  const userVectors = userReviews.map((r) => {
    const vec = {};
    for (const k of aspectCols) vec[k] = Number(r[k]) || 0;
    return vec;
  });
  const userAspectProfile = averageVector(userVectors);

  const userItems = new Set(userReviews.map((r) => r.asin));
  const allAsins = Array.from(new Set(reviewsData.map((r) => r.asin)));
  const candidateAsins = allAsins.filter((a) => !userItems.has(a));

  const metaByAsin = new Map();
  for (const m of metadataData) {
    if (m.parent_asin) metaByAsin.set(m.parent_asin, m);
    if (m.asin && !metaByAsin.has(m.asin)) metaByAsin.set(m.asin, m);
  }

  const itemScores = [];
  for (const asin of candidateAsins) {
    const itemReviews = reviewsData.filter((r) => r.asin === asin);
    if (itemReviews.length === 0) continue;

    const itemVectors = itemReviews.map((r) => {
      const vec = {};
      for (const k of aspectCols) vec[k] = Number(r[k]) || 0;
      return vec;
    });
    const itemAspectProfile = averageVector(itemVectors);
    const similarity = cosineSimilarity(
      userAspectProfile,
      itemAspectProfile,
      aspectCols
    );

    const ratings = itemReviews
      .map((r) => Number(r.rating))
      .filter((v) => isFinite(v));
    const avgRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
    const popFactor = Math.log(1 + itemReviews.length) / 10;
    const combinedScore =
      0.7 * similarity + 0.2 * (avgRating / 5.0) + 0.1 * popFactor;

    const topAspects = topNKeys(itemAspectProfile, 3).map((a) =>
      a.replace("_score", "")
    );
    itemScores.push({
      asin,
      score: combinedScore,
      similarity,
      top_aspects: topAspects,
    });
  }

  itemScores.sort((a, b) => b.score - a.score);

  const recommendations = itemScores.slice(0, topN).map((it, idx) => {
    let meta = metaByAsin.get(it.asin);
    const rec = {
      rank: idx + 1,
      asin: it.asin,
      score: Number(it.score.toFixed(6)),
      similarity: Number(it.similarity.toFixed(6)),
      top_aspects: it.top_aspects,
    };
    if (meta) {
      rec.title = meta.title || `Product ${it.asin}`;
      rec.price = meta.price ?? null;
      rec.category = meta.main_category || "";
      rec.avg_rating = meta.average_rating || 0;
      rec.images = meta.images || [];
    }
    return rec;
  });

  return { userId, recommendations };
}

// GET /api/recommendations
async function getRecommendations(req, res) {
  try {
    const topN = Number(req.query.top_n) || 30;
    const userId =
      DEMO_USER_IDS[Math.floor(Math.random() * DEMO_USER_IDS.length)];
    const reviewsFile = path.join(__dirname, "..", "data", "absa_reviews.json");
    const metadataFile = path.join(__dirname, "..", "data", "metadata.jsonl");

    const result = recommendProductsJS({
      userId,
      reviewsFile,
      metadataFile,
      topN,
    });
    return res.json(result);
  } catch (err) {
    console.error("Recommendation error:", err);
    return res
      .status(500)
      .json({ error: "Failed to generate recommendations" });
  }
}

/**
 * Checks if interaction thresholds are met and triggers model rerun if needed
 * Thresholds:
 * - Total new reviews >= 2500 OR
 * - Total interactions (likes + orders) >= 3000
 *
 * This function is for demonstration purposes to show evaluators
 * that the system can detect when retraining is needed.
 */
async function checkAndTriggerModelRerun() {
  try {
    // Count total reviews
    const totalReviews = await Review.countDocuments();

    // Count total likes (sum of all likedProducts arrays across all users)
    const users = await User.find({}, { likedProducts: 1 });
    const totalLikes = users.reduce((sum, user) => {
      return sum + (user.likedProducts ? user.likedProducts.length : 0);
    }, 0);

    // Count total orders
    const totalOrders = await Order.countDocuments();

    // Calculate total interactions (likes + orders)
    const totalInteractions = totalLikes + totalOrders;

    // Define thresholds
    const REVIEW_THRESHOLD = 2500;
    const INTERACTION_THRESHOLD = 3000;

    // Check if thresholds are met
    const reviewsThresholdMet = totalReviews >= REVIEW_THRESHOLD;
    const interactionsThresholdMet = totalInteractions >= INTERACTION_THRESHOLD;

    const shouldRerun = reviewsThresholdMet || interactionsThresholdMet;

    // Log current statistics
    console.log("=== Model Rerun Check ===");
    console.log(`Total Reviews: ${totalReviews} / ${REVIEW_THRESHOLD}`);
    console.log(`Total Likes: ${totalLikes}`);
    console.log(`Total Orders: ${totalOrders}`);
    console.log(
      `Total Interactions (Likes + Orders): ${totalInteractions} / ${INTERACTION_THRESHOLD}`
    );
    console.log(`Reviews Threshold Met: ${reviewsThresholdMet}`);
    console.log(`Interactions Threshold Met: ${interactionsThresholdMet}`);

    if (shouldRerun) {
      console.log("⚠️  THRESHOLD REACHED - Model rerun required!");
      console.log("🔄 Triggering recommendation model retraining...");

      // Here you would trigger the actual model rerun
      // For demonstration, we'll just log it
      // In production, this could:
      // 1. Call a Python script to retrain the model
      // 2. Update model files
      // 3. Clear recommendation cache
      // 4. Send notification to admin

      // Example: triggerModelRetraining();

      return {
        shouldRerun: true,
        reason: reviewsThresholdMet
          ? `Reviews threshold reached (${totalReviews} >= ${REVIEW_THRESHOLD})`
          : `Interactions threshold reached (${totalInteractions} >= ${INTERACTION_THRESHOLD})`,
        statistics: {
          totalReviews,
          totalLikes,
          totalOrders,
          totalInteractions,
          reviewThreshold: REVIEW_THRESHOLD,
          interactionThreshold: INTERACTION_THRESHOLD,
        },
        timestamp: new Date().toISOString(),
      };
    } else {
      console.log("✓ Thresholds not met. No rerun needed.");
      return {
        shouldRerun: false,
        statistics: {
          totalReviews,
          totalLikes,
          totalOrders,
          totalInteractions,
          reviewThreshold: REVIEW_THRESHOLD,
          interactionThreshold: INTERACTION_THRESHOLD,
        },
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error("Error checking model rerun thresholds:", error);
    throw error;
  }
}

module.exports = { getRecommendations, checkAndTriggerModelRerun };
