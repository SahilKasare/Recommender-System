import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { signup } from "../services/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    reviewerName: "",
    age: "",
    gender: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (
      !formData.reviewerName ||
      !formData.age ||
      !formData.gender ||
      !formData.address
    ) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.age < 1 || formData.age > 120) {
      setError("Age must be between 1 and 120.");
      setLoading(false);
      return;
    }

    try {
      const response = await signup(formData);
      if (response.data && response.data.user) {
        const { user_id, reviewerName } = response.data.user;

        // Persist to localStorage to ensure availability across refreshes
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("reviewerName", reviewerName || "");

        // Auto-login after successful signup
        login(user_id, reviewerName);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Create Account</h2>

        <input
          type="text"
          name="reviewerName"
          placeholder="Reviewer Name"
          value={formData.reviewerName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          min="1"
          max="120"
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          style={{
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #555",
            backgroundColor: "#242424",
            color: "white",
          }}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "1rem", color: "#aaa" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#646cff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              fontSize: "inherit",
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
