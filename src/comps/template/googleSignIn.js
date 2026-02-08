import React, { useState } from "react";
import firebase from "./../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./themeContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate("/home");
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: bg,
        color: fg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <img
            src="/assets/LOG.png"
            alt="EATI"
            style={{ height: "56px", objectFit: "contain", marginBottom: "8px" }}
          />
          <p
            style={{
              color: "#f76f25",
              fontSize: "12px",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "0.5px",
            }}
          >
            One Government One Voice
          </p>
        </div>

        {/* Title */}
        <h5
          style={{
            fontWeight: 700,
            fontSize: "20px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Sign in to your account
        </h5>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              backgroundColor: isDark
                ? "rgba(239,68,68,0.15)"
                : "rgba(239,68,68,0.1)",
              color: "#ef4444",
              fontSize: "13px",
              fontWeight: 500,
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="bi bi-exclamation-circle" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: secondaryText,
                marginBottom: "6px",
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: cardBg,
                color: fg,
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: secondaryText,
                marginBottom: "6px",
                display: "block",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "14px",
                border: "none",
                backgroundColor: cardBg,
                color: fg,
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "#f76f25",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: submitting ? "wait" : "pointer",
              opacity: submitting ? 0.7 : 1,
              marginBottom: "16px",
            }}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: secondaryText,
            margin: 0,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#f76f25", fontWeight: 600, textDecoration: "none" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
