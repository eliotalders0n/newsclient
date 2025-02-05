import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      navigate("/profile"); // Redirect to profile page after registration
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="full"
      sx={{
        paddingTop: "100px",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-pic-upload"
            type="file"
            onChange={handleProfilePicUpload}
            disabled={uploading}
          />
          <label htmlFor="profile-pic-upload">
            <Avatar
              src={profilePic}
              sx={{ width: 100, height: 100, cursor: "pointer" }}
            >
              {!profilePic && <CloudUploadIcon fontSize="large" />}
            </Avatar>
          </label>
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
      </Card>
    </Container>
  );
}
