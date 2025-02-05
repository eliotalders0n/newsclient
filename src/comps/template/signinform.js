import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Box,
  Link,
} from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";
import firebase from "../../firebase";
import { useTheme } from "./themeContext";
import Intro from "./intro";

export default function Login() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleIntroFinish = () => {
    setShowIntro(false); // Hide the intro and show login
  };

  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);
      navigate("/profile"); // Redirect to profile page after login
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      sx={{
        color: "white",
        bgcolor: "#1E1E1E",
        minHeight: "100vh",
      }}
    >
      {showIntro ? (
        <Intro onFinish={handleIntroFinish} /> // Show Intro first
      ) : (
        <>
          {/* Header Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            pt={10}
            pb={4}
          >
            <Box
              component="img"
              src="./assets/LOG.png"
              alt="Logo"
              width={150}
              mb={2}
            />
            <Typography variant="h5" align="center" fontWeight="bold">
              Welcome to E-ATI
            </Typography>
            <Typography variant="body2" align="center">
              Please log in to continue.
            </Typography>
          </Box>

          {/* Login Card */}
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: "#1E1E1E",
              color: "white",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              maxWidth: 400,
              mx: "auto",
            }}
          >
            <Typography variant="h4" align="center" fontWeight="medium" mb={3}>
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  required
                  variant="outlined"
                  InputLabelProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#2A2A2A",
                      borderRadius: 2,
                      color: "white",
                      "& fieldset": { borderColor: "#444" },
                      "&:hover fieldset": { borderColor: "#666" },
                      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "white", mr: 1 }} />
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
                  autoComplete="new-password"
                  required
                  variant="outlined"
                  InputLabelProps={{ style: { color: "white" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#2A2A2A",
                      borderRadius: 2,
                      color: "white",
                      "& fieldset": { borderColor: "#444" },
                      "&:hover fieldset": { borderColor: "#666" },
                      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "white", mr: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                  sx={{
                    bgcolor: "#1976d2",
                    textTransform: "none",
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#1565c0" },
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" align="center" mt={3}>
              New here?{" "}
              <Link
                href="/register"
                underline="hover"
                sx={{ color: "#1976d2" }}
              >
                Create an account
              </Link>
            </Typography>
          </Card>
        </>
      )}
    </Container>
  );
}
