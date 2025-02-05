import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Stack,
  Badge,
  Card,
  Container,
  InputGroup,
  Form,
  Button,
} from "react-bootstrap";
import {
  Avatar,
  Skeleton,
  Typography,
  TextField,
  Checkbox,
  CardMedia,
  CardContent,
  FormControlLabel,
  Button as MuiButton,
} from "@mui/material";
import firebase from "../../firebase";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../template/themeContext";
import useGetMinistries from "../hooks/useGetMinistries";
import { Clear } from "@mui/icons-material";

const VideoCard = ({ article, authors, ministries, theme }) => {
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) {
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.msRequestFullscreen) {
      videoRef.current.msRequestFullscreen();
    }
  };

  return (
    <Col md={4} sm={6} xs={12} className="mb-4">
      <Card
        className="h-100 shadow-sm"
        style={{
          backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
          color: theme === "light" ? "#111" : "#fff",
          borderRadius: "10px",
        }}
      >
        <CardMedia
          component="video"
          src={article.imagesUrls}
          controls
          sx={{
            borderRadius: "8px 8px 0 0",
            height: 200,
          }}
        />
        <Card.Body>
          <Card.Title className="text-truncate">{article.title}</Card.Title>
          <Badge bg="danger">
            {ministries.find((m) => m.id === article.ministry)?.name ||
              article.ministry}
          </Badge>
        </Card.Body>
        <Card.Footer className="d-flex align-items-center">
          <Image
            src={authors[article.author]?.photoURL || "assets/profile.png"}
            alt="Author"
            roundedCircle
            style={{ width: "30px", height: "30px" }}
          />
          <small className="ms-2">
            {authors[article.author]?.firstName || "Reporter"}{" "}
            {authors[article.author]?.lastName || ""}
          </small>
          <small className="ms-auto">
            {article.createdAt?.toDate().toLocaleDateString()}
          </small>
        </Card.Footer>
      </Card>
    </Col>
  );
};

// Reusable Article Card Component
const ArticleCard = ({ article, authors, ministries, theme }) => (
  <Col md={4} sm={6} xs={12} className="mb-4">
    <Link
      to={`/story/${article.id}`}
      state={{ data: article }}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card
        className="h-100 shadow-sm"
        style={{
          backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
          color: theme === "light" ? "#111" : "#fff",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            height: "200px",
            background: `url(${article.imagesUrls[0]}) center/cover`,
            borderRadius: "10px 10px 0 0",
          }}
        />
        <Card.Body>
          <Card.Title className="text-truncate">{article.title}</Card.Title>
          <Badge bg="danger">
            {ministries.find((m) => m.id === article.ministry)?.name ||
              article.ministry}
          </Badge>
        </Card.Body>
        <Card.Footer className="d-flex align-items-center">
          <Image
            src={authors[article.author]?.photoURL || "assets/profile.png"}
            alt="Author"
            roundedCircle
            style={{ width: "30px", height: "30px" }}
          />
          <small className="ms-2">
            {authors[article.author]?.firstName || "Reporter"}{" "}
            {authors[article.author]?.lastName || ""}
          </small>
          <small className="ms-auto">
            {article.createdAt?.toDate().toLocaleDateString()}
          </small>
        </Card.Footer>
      </Card>
    </Link>
  </Col>
);

function Landing() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVideo, setFilterVideo] = useState(false);
  const { theme: appTheme } = useCustomTheme();
  const { docs: ministries } = useGetMinistries();

  // MUI Theme integration with your app's theme
  const muiTheme = createTheme({
    palette: {
      mode: appTheme === "light" ? "light" : "dark",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesSnapshot = await firebase
          .firestore()
          .collection("Articles")
          .where("status", "==", "approved")
          .orderBy("createdAt", "desc")
          .get();

        const articlesData = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
        setFilteredArticles(articlesData);

        const authorsSnapshot = await firebase
          .firestore()
          .collection("Users")
          .get();
        const authorsData = {};
        authorsSnapshot.docs.forEach((doc) => {
          authorsData[doc.id] = doc.data();
        });
        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const matchesSearch =
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.ministry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVideo = filterVideo ? article.video === true : true;

      return matchesSearch && matchesVideo;
    });

    setFilteredArticles(filtered);
  }, [articles, searchTerm, filterVideo]);

  const resetFilters = () => {
    setSearchTerm("");
    setFilterVideo(false);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <Container
        fluid
        className="py-5"
        style={{
          backgroundColor: appTheme === "light" ? "#f9fafc" : "#121212",
          color: appTheme === "light" ? "#111" : "#fff",
          minHeight: "100vh",
          margin: "70px 0",
        }}
      >
        {/* Enhanced Search Section */}
        <div className="d-flex flex-column flex-md-row gap-3 mb-4">
          <TextField
            fullWidth
            label="Search Articles"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: appTheme === "light" ? "#fff" : "#333",
              borderRadius: "4px",
            }}
            InputProps={{
              endAdornment: (
                <Clear
                  onClick={resetFilters}
                  sx={{
                    color: appTheme === "light" ? "text.primary" : "#fff",
                  }}
                />
              ),
            }}
          />

          <div className="d-flex gap-2 align-items-center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterVideo}
                  onChange={(e) => setFilterVideo(e.target.checked)}
                  sx={{
                    color: appTheme === "light" ? "#000" : "#fff",
                    "&.Mui-checked": {
                      color: appTheme === "light" ? "#000" : "#fff",
                    },
                  }}
                />
              }
              label="Show Videos Only"
              sx={{ color: appTheme === "light" ? "#000" : "#fff" }}
            />
          </div>
        </div>

        {/* Existing Ministries Filter */}
        <Stack direction="horizontal" gap={4} className="overflow-auto mb-4">
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => setFilteredArticles(articles)}
          >
            All
          </Button>
          {ministries.map((ministry) => (
            <div
              key={ministry.id}
              onClick={() =>
                setFilteredArticles(
                  articles.filter((article) => article.ministry === ministry.id)
                )
              }
            >
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1} // Space between Avatar and Typography
              >
                <Avatar src={ministry.img} sx={{ width: 56, height: 56 }} />{" "}
                {/* Adjust size as needed */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-truncate"
                >
                  {ministry.name}
                </Typography>
              </Stack>
            </div>
          ))}
        </Stack>

        {/* Articles Section */}
        <Row>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={200} />
          ) : filteredArticles.length === 0 ? (
            <p>No articles found.</p>
          ) : (
            filteredArticles.map((article) =>
              article.video ? (
                <VideoCard
                  key={article.id}
                  article={article}
                  authors={authors}
                  ministries={ministries}
                  theme={appTheme}
                />
              ) : (
                <ArticleCard
                  key={article.id}
                  article={article}
                  authors={authors}
                  ministries={ministries}
                  theme={appTheme}
                />
              )
            )
          )}
        </Row>
      </Container>
    </ThemeProvider>
  );
}

export default Landing;
