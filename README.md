# Recommender System Website

A full-stack e-commerce recommendation system website built with React and Node.js, featuring personalized product recommendations based on user reviews and interactions.

## 🚀 Features

- **User Authentication**: Sign up and login system with unique user ID generation
- **Product Browsing**: Browse and search through smartphone products
- **Personalized Recommendations**: AI-powered product recommendations based on user preferences
- **Product Reviews**: Users can add and view product reviews
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Management**: Place orders and track order history
- **Product Likes**: Like/favorite products for personalized recommendations
- **User Profile**: Manage user information including name, age, gender, and address

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or Atlas)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd RecommenderSystem_Website
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional for local development):

```env
VITE_API_URL=http://localhost:5001/api
```

Or:

```env
VITE_BACKEND_URL=http://localhost:5001
```

### 4. Seed the Database (Optional)

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5001`

2. **Start the frontend (in a new terminal):**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

**Frontend:**

```bash
cd frontend
npm run build
```

**Backend:**

```bash
cd backend
npm start
```

## 🔐 Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/recommender_db
PORT=5001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5001/api
# OR
VITE_BACKEND_URL=http://localhost:5001
```

## 🚢 Deployment

The application is deployed on:

- **Frontend**: [Vercel](https://recommender-system-seven.vercel.app)
- **Backend**: [Render](https://recommender-system-kk8n.onrender.com)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 Key Features Explained

### User Signup

- Users can sign up with reviewer name, age, gender, and address
- System automatically generates a unique 26-character user ID
- Users are automatically logged in after signup

### Recommendations

- Recommendations are based on user reviews and aspect-based sentiment analysis
- System uses cosine similarity to match user preferences with products
- Recommendations consider product ratings and popularity

### Model Retraining

The system includes a function to check if the recommendation model needs retraining:

- Triggers when total reviews reach 2,500 OR
- Triggers when total interactions (likes + orders) reach 3,000
