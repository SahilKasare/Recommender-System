# Recommender System Using Aspect-Based Sentiment Analysis

This repository contains the implementation of a **hybrid personalized recommender system** using **Aspect-Based Sentiment Analysis (ABSA)** and hybrid recommendation techniques. The system is developed as part of a **Bachelor Thesis Project (BTP)**.

---

## Files Description

### 1. `Hybrid_Recommender_System.ipynb`

This notebook contains the **complete end-to-end pipeline**, including:

* Exploratory Data Analysis (EDA)
* Data preprocessing and cleaning
* Aspect extraction and sentiment classification using a fine-tuned **DeBERTa-based ABSA model**
* Hyperparameter tuning using grid-based cross-validation
* Construction of user and product aspect profiles
* Feature engineering (aspect sentiment, metadata, behavioral features)
* Training of the **LightFM-based hybrid recommender model**
* Evaluation and result analysis

### 2. `ProductRecommendations.ipynb`

This notebook contains **only the inference and recommendation logic** used by the deployed web application.

Key functionalities:

* Loads the trained model file (`hybrid_model.pkl`)
* Loads the processed reviews and product metadata datasets
* Accepts a user identifier (ASIN-based mapping)
* Computes similarity scores between user and product representations
* Returns a ranked list of recommended products for the user

### 3. `hybrid_model.pkl`

This file contains the **final trained hybrid recommender model**, generated after:

* Training and fine-tuning multiple models
* Integrating aspect-level sentiment features
* Incorporating collaborative, content-based, and demographic signals

### 4. `Recommender-System-main.zip`

This archive contains the **complete full-stack web application**, which:

* Allows users to register and log in
* Displays products and recommendations
* Enables users to like and comment on products
* Dynamically updates recommendations based on user interactions
* Uses the trained hybrid recommender model for personalized suggestions

---

## Web Application

* **GitHub Repository**:
  [https://github.com/SahilKasare/Recommender-System](https://github.com/SahilKasare/Recommender-System)

* **Hosted Website**:
  [https://recommender-system-seven.vercel.app/signup](https://recommender-system-seven.vercel.app/signup)

---

## Datasets Used

* SemEval-2014 ABSA Laptop Reviews Dataset
* Amazon Reviews 2023 Dataset (Cell Phones and Accessories)

## Technologies Used

* Python
* PyTorch
* Hugging Face Transformers
* LightFM
* Pandas, NumPy, Scikit-learn
* Flask / Node.js (Web Backend)
* React (Frontend)
* MongoDB / JSON-based storage
* Vercel (Deployment)

---
