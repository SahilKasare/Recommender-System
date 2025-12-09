import React, { useEffect, useState } from "react";
import { getRecommendations } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Recommendations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ userId: "", recommendations: [] });
  const { addItemToCart } = useCart();
  const navigate = useNavigate();

  const fetchRecs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getRecommendations(30);
      setData(res.data);
    } catch (e) {
      setError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Top Recommendations</h2>
        {/* <button onClick={fetchRecs}>Refresh (random user)</button> */}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <>
          {/* {data.userId && <p>Demo user: {data.userId}</p>} */}
          <div className="product-grid">
            {data.recommendations.map((rec) => (
              <div key={rec.asin} className="product-card">
                {rec.images && rec.images[0] && (
                  <img
                    src={rec.images[0].large || rec.images[0].thumb}
                    alt={rec.title}
                    style={{ maxHeight: 160, objectFit: "contain" }}
                  />
                )}
                <h4 title={rec.title}>{rec.title || `Product ${rec.asin}`}</h4>
                {rec.price !== null && <p className="price">$ {String(rec.price)}</p>}
                {rec.avg_rating > 0 && <p>Avg. Rating: {rec.avg_rating}/5</p>}
                {rec.category && <p>Category: {rec.category}</p>}
                {rec.top_aspects && rec.top_aspects.length > 0 && (
                  <p>Strengths: {rec.top_aspects.join(", ")}</p>
                )}

                <div className="product-card-actions">
                  <Link to={`/product/${rec.asin}`}>View details</Link>
                </div>

                <div style={{ marginTop: 8 }} className="product-card-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const product = {
                        asin: rec.asin,
                        title: rec.title,
                        brand: rec.brand || rec.manufacturer || "",
                        price: rec.price ? String(rec.price) : "0",
                        imageURLHighRes: rec.images ? [rec.images[0].large || rec.images[0].thumb] : [],
                      };
                      try {
                        await addItemToCart(rec.asin, product, 1);
                        alert("Added to cart");
                      } catch (err) {
                        alert("Failed to add to cart");
                      }
                    }}
                  >
                    🛒 Add
                  </button>

                  <button
                    className="add-to-cart-btn-detail"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const product = {
                        asin: rec.asin,
                        title: rec.title,
                        brand: rec.brand || rec.manufacturer || "",
                        price: rec.price ? String(rec.price) : "0",
                        imageURLHighRes: rec.images ? [rec.images[0].large || rec.images[0].thumb] : [],
                      };
                      try {
                        await addItemToCart(rec.asin, product, 1);
                        navigate("/checkout");
                      } catch (err) {
                        alert("Failed to order now");
                      }
                    }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;
