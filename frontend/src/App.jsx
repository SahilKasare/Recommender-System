import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LikedProducts from "./pages/LikedProducts";
import MyReviews from "./pages/MyReviews";
import ProductDetail from "./pages/ProductDetail";
import Recommendations from "./pages/Recommendations";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function App() {
  const { user_id } = useUser();
  return (
    <>
      {user_id && <Navbar />}
      <div className="page-container">
        <Routes>
          <Route
            path="/signup"
            element={!user_id ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user_id ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user_id ? <Home /> : <Navigate to="/signup" />}
          />
          <Route
            path="/liked"
            element={user_id ? <LikedProducts /> : <Navigate to="/signup" />}
          />
          <Route
            path="/reviews"
            element={user_id ? <MyReviews /> : <Navigate to="/signup" />}
          />
          <Route
            path="/recommendations"
            element={user_id ? <Recommendations /> : <Navigate to="/signup" />}
          />
          <Route
            path="/product/:asin"
            element={user_id ? <ProductDetail /> : <Navigate to="/signup" />}
          />
          <Route
            path="/cart"
            element={user_id ? <Cart /> : <Navigate to="/signup" />}
          />
          <Route
            path="/checkout"
            element={user_id ? <Checkout /> : <Navigate to="/signup" />}
          />
          <Route
            path="/orders"
            element={user_id ? <Orders /> : <Navigate to="/signup" />}
          />
          <Route
            path="*"
            element={<Navigate to={user_id ? "/" : "/signup"} />}
          />
        </Routes>
      </div>
    </>
  );
}
export default App;
