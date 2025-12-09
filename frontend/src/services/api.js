import axios from "axios";

// Use environment variable for API URL, fallback to Render backend or localhost
// In Vite, environment variables are accessed via import.meta.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : null) ||
  (import.meta.env.PROD
    ? "https://recommender-system-kk8n.onrender.com/api"
    : "/api");

const api = axios.create({ baseURL: API_BASE_URL });
export const getProducts = () => api.get("/products");
export const getProductByAsin = (asin) => api.get(`/products/${asin}`);
export const signup = (userData) => api.post("/user/signup", userData);
export const getUser = (reviewerID) => api.get(`/user/${reviewerID}`);
export const toggleLike = (reviewerID, asin) =>
  api.put(`/user/${reviewerID}/like`, { asin });
export const getUserReviews = (reviewerID) => api.get(`/reviews/${reviewerID}`);
export const getReviewsForProduct = (asin) =>
  api.get(`/reviews/product/${asin}`);
export const addReview = (reviewData) => api.post("/reviews", reviewData);
export const getRecommendations = (top_n = 10) =>
  api.get(`/recommendations?top_n=${top_n}`);

// Cart APIs
export const fetchCart = (user_id) => api.get(`/cart/${user_id}`);
export const addToCart = (user_id, asin, quantity, product) =>
  api.post(`/cart/${user_id}`, { asin, quantity, product });
export const removeFromCart = (user_id, asin) =>
  api.delete(`/cart/${user_id}/${asin}`);
export const updateQuantity = (user_id, asin, quantity) =>
  api.put(`/cart/${user_id}/${asin}`, { quantity });

// Order APIs
export const createOrder = (user_id, orderData) =>
  api.post(`/orders/${user_id}`, orderData);
export const getUserOrders = (user_id) => api.get(`/orders/${user_id}`);
export const getOrderById = (user_id, orderId) =>
  api.get(`/orders/${user_id}/order/${orderId}`);
export const getOrderByNumber = (user_id, orderNumber) =>
  api.get(`/orders/${user_id}/number/${orderNumber}`);
export const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, { status });
export const cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`);
export const getOrderStats = (user_id) => api.get(`/orders/${user_id}/stats`);

export default api;
