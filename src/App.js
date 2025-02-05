import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import Typography from "@mui/material/Typography";
import firebase from "./firebase";
import LoginRoutes from "./loginroutes";
import Routers from "./routes";
import { ThemeProvider } from "./comps/template/themeContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <Typography align="center" sx={{ mt: 4 }}>
          Loading...
        </Typography>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {error && (
        <Typography
          variant="body2"
          color="error"
          style={{
            backgroundColor: "rgb(0,70,0)",
            fontSize: "14px",
            color: "lightgrey",
            padding: "6px",
          }}
          align="center"
        >
          {error}
        </Typography>
      )}
      <Router>
        {isLoggedIn ? <LoginRoutes /> : <Routers />}
      </Router>
    </ThemeProvider>
  );
};

export default App;
