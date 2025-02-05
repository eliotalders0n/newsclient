import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Switch,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Custom hook to fetch articles
const useGetArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Articles")
      .where("status", "==", "approved")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(data);
      });

    return () => unsubscribe();
  }, []);

  return { articles };
};

// Custom hook to fetch resources
const useGetResources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Resources")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(data);
      });

    return () => unsubscribe();
  }, []);

  return { resources };
};

// Search Component
const SearchComponent = () => {
  const { articles } = useGetArticles();
  const { resources } = useGetResources();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVideo, setFilterVideo] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Filtered data
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!filterVideo || article.video === true)
  );

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Theme for light/dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        {/* Search Bar */}
        <TextField
          fullWidth
          label="Search Articles & Resources"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ my: 3 }}
        />

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterVideo}
                  onChange={(e) => setFilterVideo(e.target.checked)}
                />
              }
              label="Show Only Videos"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </Grid>
        </Grid>

        {/* Results */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Articles
        </Typography>
        <Grid container spacing={3}>
          {filteredArticles.map((article) => (
            <Grid item key={article.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{article.title}</Typography>
                  <Typography variant="body2">{article.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Resources
        </Typography>
        <Grid container spacing={3}>
          {filteredResources.map((resource) => (
            <Grid item key={resource.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{resource.title}</Typography>
                  <Typography variant="body2">
                    {resource.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default SearchComponent;