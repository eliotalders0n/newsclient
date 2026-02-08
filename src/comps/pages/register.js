import React, { useState } from "react";
import firebase from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../template/themeContext";

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: cardBg,
    color: fg,
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: secondaryText,
    marginBottom: "6px",
    display: "block",
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await firebase
        .firestore()
        .collection("Users")
        .doc(result.user.uid)
        .set({
          firstName,
          lastName,
          email,
          photoURL: "",
          role: "user",
          age: "",
          contact: "",
          gender: "",
          address: "",
          status: "Approved",
          admin: false,
        });

      navigate("/home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
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
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
          Create your account
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
        <form onSubmit={handleRegister}>
          {/* Name row */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="John"
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Doe"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
              style={inputStyle}
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
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: secondaryText,
            margin: 0,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/profile"
            style={{ color: "#f76f25", fontWeight: 600, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
