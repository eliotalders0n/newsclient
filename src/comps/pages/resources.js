import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Typography,
  Grid,
  TextField,
  Chip,
  useTheme,
  Fade,
} from "@mui/material";
import { Search as SearchIcon, Download } from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../template/themeContext";
import useGetResources from "../hooks/useGetResources";
import { format } from "date-fns";

const Resources = () => {
  const { docs } = useGetResources();
  const [searchTerm, setSearchTerm] = useState("");
  const { theme: appTheme } = useCustomTheme();
  const muiTheme = useTheme();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocs = docs.filter((doc) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      doc.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      doc.ministry?.toLowerCase().includes(lowerCaseSearchTerm) ||
      doc.type?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const handleDownload = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        paddingTop: "13vh",
        backgroundColor: appTheme === "light" ? "#f8f9fa" : "#1a1a1a",
        minHeight: "100vh",
        transition: "background-color 0.3s ease",
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
          Resources Hub
        </Typography>

        <TextField
          fullWidth
          variant="filled"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: appTheme === "light" ? "text.primary" : "#fff", mr: 1 }} />
            ),
            disableUnderline: true,
            sx: {
              borderRadius: "12px",
              backgroundColor: appTheme === "light" ? "#fff" : "#333",
              color: appTheme === "light" ? "text.primary" : "#fff",
              padding: "8px 16px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: appTheme === "light" ? "#f5f5f5" : "#404040",
              },
            },
          }}
          sx={{ mb: 4 }}
        />

        <Grid container spacing={3} sx={{ pb: 4 }}>
          {filteredDocs.map((resource) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    p: 2.5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: "16px",
                    backgroundColor: appTheme === "light" ? "#fff" : "#2d2d2d",
                    boxShadow: muiTheme.shadows[2],
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: muiTheme.shadows[6],
                    },
                  }}
                >
                  <div>
                    <Chip
                      label={resource.type}
                      size="small"
                      sx={{
                        mb: 2,
                        bgcolor: muiTheme.palette.secondary.light,
                        color: muiTheme.palette.primary.contrastText,
                        fontWeight: 600,
                      }}
                    />
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                        color: appTheme === "light" ? "text.primary" : "#fff",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {resource.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1.5,
                        color: appTheme === "light" ? "text.primary" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>Ministry:</span>
                      {resource.ministry}
                    </Typography>
                  </div>

                  <div>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 2,
                        color: appTheme === "light" ? "text.primary" : "#fff",
                      }}
                    >
                      {format(
                        new Date(
                          resource.createdAt.seconds * 1000 +
                            resource.createdAt.nanoseconds / 1000000
                        ),
                        "dd MMM yyyy"
                      )}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() =>
                        handleDownload(resource.url, resource.name)
                      }
                      sx={{
                        py: 1,
                        fontWeight: 600,
                        borderRadius: "8px",
                        textTransform: "none",
                        bgcolor: appTheme === "light" ? "#f9fafc" : "#121212",
                        color: appTheme === "light" ? "text.primary" : "#fff",
                        "&:hover": {
                          bgcolor: appTheme === "light" ? "#f9fafc" : "#121212",
                        },
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Resources;
