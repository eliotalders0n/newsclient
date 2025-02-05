import React from "react";
import {
  Grid,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme as useCustomTheme } from "../template/themeContext";
import useGetMinistries from "../hooks/useGetMinistries";

const CategoryComponent = () => {
  const Documents = useGetMinistries().docs;
  const { theme: appTheme } = useCustomTheme();

  // Theme-aware styles
  const cardStyles = (theme) => ({
    backgroundColor: theme === "light" ? "white" : "black",
    color: theme === "light" ? "#111111" : "white",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    textAlign: "center",
    transition: "transform 0.2s ease-in-out",
    "&:hover": { transform: "scale(1.05)" },
  });

  const cardMediaStyles = {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    margin: "16px auto 8px",
  };

  const textStyles = {
    fontFamily: "Roboto Condensed",
    fontWeight: "bold",
    color: appTheme === "light" ? "#111111" : "white",
  };

  return (
    <Box
      sx={{
        padding: "2vh 0",
        backgroundColor: appTheme === "light" ? "whitesmoke" : "#2C2C2C",
        minHeight: "100vh",
        color: appTheme === "light" ? "#111111" : "white",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          align="center"
          sx={{
            fontFamily: "Roboto Condensed",
            fontStyle: "normal",
            paddingBottom: "10px",
          }}
        >
          Podcasts
        </Typography>

        <Grid container spacing={3}>
          {Documents.map((resource) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
              <Link
                to={`/podcastList/${resource.id}`}
                state={{ data: resource }}
                style={{ textDecoration: "none" }}
              >
                <Card sx={cardStyles(appTheme)}>
                  <CardMedia
                    component="img"
                    image={resource.img}
                    alt={resource.name}
                    sx={cardMediaStyles}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={textStyles} noWrap>
                      {resource.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoryComponent;
