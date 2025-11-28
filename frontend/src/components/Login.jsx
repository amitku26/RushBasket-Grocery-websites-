import React, { useEffect, useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
} from "react-icons/fa";
import Logout from "./Logout";

const Login = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync authentication when token updates
  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
    };
    window.addEventListener("authStateChanged", handler);
    return () => window.removeEventListener("authStateChanged", handler);
  }, []);

  if (isAuthenticated) return <Logout />;

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.remember) {
      return setError("You must agree to Terms and Conditions");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // Save user data
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        // Show success toast
        setShowToast(true);
        window.dispatchEvent(new Event("authStateChanged"));

        // Redirect
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError(response.data.message || "Invalid Credentials");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid Credentials");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to reach server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.page}>
      {/* Back Link */}
      <Link to="/" className={loginStyles.backLink}>
        <FaArrowLeft className="mr-2" />
        Back to Home
      </Link>

      {/* Toast Notification */}
      {showToast && (
        <div className={loginStyles.toast}>
          <FaCheck className="mr-2" />
          Login Successful!
        </div>
      )}

      {/* Login Card */}
      <div className={loginStyles.loginCard}>
        <div className={loginStyles.logoContainer}>
          <div className={loginStyles.logoOuter}>
            <div className={loginStyles.logoInner}>
              <FaUser className={loginStyles.logoIcon} />
            </div>
          </div>
        </div>

        <h2 className={loginStyles.title}>Welcome Back</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className={loginStyles.form}>
          {/* Email */}
          <div className={loginStyles.inputContainer}>
            <FaUser className={loginStyles.inputIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className={loginStyles.input}
            />
          </div>

          {/* Password */}
          <div className={loginStyles.inputContainer}>
            <FaLock className={loginStyles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={loginStyles.passwordInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={loginStyles.toggleButton}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Remember Me */}
          <div
            className={`${loginStyles.rememberContainer} flex items-center justify-between mt-3 mb-4`}
          >
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className={`${loginStyles.rememberCheckbox} mr-2`}
              />
              <span>Remember me</span>
            </label>

            <Link to="#" className={loginStyles.forgotLink}>
              Forgot?
            </Link>
          </div>

          {/* Error */}
          {error && <div className={loginStyles.errorMessage}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className={loginStyles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Signup Redirect */}
        <p className={loginStyles.signupText}>
          Don’t have an account?{" "}
          <Link to="/signup" className={loginStyles.signupLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
