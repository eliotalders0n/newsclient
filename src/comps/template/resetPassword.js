import { useState } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { TextField, Alert, Container, Typography, Box, Button, CircularProgress } from "@mui/material";
import firebase from "../firebase";

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setLoading(true);
      try {
        await firebase.auth().sendPasswordResetEmail(values.email);
        alert(`Reset link sent to ${values.email}`);
        if (onSent) onSent();
        if (onGetEmail) onGetEmail(values.email);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    },
  });

  return (
    <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your email and we will send you a reset link.
        </Typography>
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ height: 50 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
        </Button>
      </Box>
    </Container>
  );
}

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func,
};
