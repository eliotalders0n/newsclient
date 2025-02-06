import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Box,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  CloudUpload as CloudUploadIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
} from "@mui/icons-material";
import firebase from "../../firebase";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    nrc: "",
    profilePicUrl: "",
  });

  // Snackbar state for toast notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error", // "error", "success", "info", "warning"
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`profile-pictures/${file.name}`);
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      setValues({ ...values, profilePicUrl: downloadURL });
      setProfilePic(downloadURL);
      setSnackbar({
        open: true,
        message: "Profile picture uploaded successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setSnackbar({
        open: true,
        message: "Error uploading profile picture. Please try again.",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check that a profile picture has been uploaded
    if (!values.profilePicUrl) {
      setSnackbar({
        open: true,
        message: "Please upload a profile picture.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Create user with Firebase Authentication
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);

      // Save additional user data to Firestore
      await firebase.firestore().collection("app_users").doc(user.uid).set({
        name: values.name,
        age: values.age,
        nrc: values.nrc,
        photoURL: values.profilePicUrl,
        email: values.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setSnackbar({
        open: true,
        message: "Registration successful!",
        severity: "success",
      });
      navigate("/home");
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setSnackbar({
          open: true,
          message: "The email address is already in use.",
          severity: "error",
        });
      } else if (error.code === "auth/weak-password") {
        setSnackbar({
          open: true,
          message: "The password is too weak.",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Registration failed. Please try again.",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        paddingTop: "100px",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create Your Account
        </Typography>

        {/* Profile Picture Upload Section */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Upload Profile Picture *
          </Typography>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-pic-upload"
            type="file"
            required
            onChange={handleProfilePicUpload}
            disabled={uploading}
          />
          <label htmlFor="profile-pic-upload">
            <Avatar
              src={profilePic}
              sx={{
                width: 100,
                height: 100,
                cursor: "pointer",
                border: "2px dashed #1976d2",
              }}
            >
              {!profilePic && <CloudUploadIcon fontSize="large" />}
            </Avatar>
          </label>
          <Typography variant="caption" display="block" color="textSecondary">
            Click the image to upload
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Name"
              value={values.name}
              onChange={handleChange("name")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange("email")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange("password")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Password must be at least 6 characters."
            />

            <TextField
              fullWidth
              label="Age"
              type="number"
              value={values.age}
              onChange={handleChange("age")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CakeIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="NRC"
              value={values.nrc}
              onChange={handleChange("nrc")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || uploading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Register
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" align="center" mt={3}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </Card>

      {/* Snackbar for Toast Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
