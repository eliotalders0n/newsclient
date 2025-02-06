import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardContent,
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Box,
  FormControl,
  Chip,
  LinearProgress,
  InputAdornment,
  Grid,
  Card,
  Typography,
  Avatar,
  Alert,
  FormHelperText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "../template/themeContext";
import {
  Check,
  Close,
  Delete,
  Search,
  FilterList,
  Visibility,
  Loop,
  DoneAll,
  RemoveDone,
  Reorder,
} from "@mui/icons-material";
import firebase from "./../../firebase";
import useGetMinistries from "../hooks/useGetMinistries";
import Categories from "./categories";

// Improved Feedback Modal
const FeedbackModal = ({ open, onClose, user }) => {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
    phone: "",
    assignedTo: "",
  });
  const { docs: ministries } = useGetMinistries();
  // const categories = ["Infrastructure", "Health", "Education", "Transport", "Utilities"];

  // const ministries = ["Ministry of Infrastructure", "Ministry of Health", "Ministry of Education"];

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.assignedTo)
      errors.assignedTo = "Ministry assignment is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = async (file) => {
    if (attachments.length >= 5) {
      alert("Maximum 5 attachments allowed");
      return;
    }

    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(
      `feedback_attachments/${Date.now()}_${file.name}`
    );
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        setAttachments((prev) => [
          ...prev,
          {
            url: downloadURL,
            name: file.name,
            type: file.type.split("/")[0],
          },
        ]);
        setUploading(false);
      }
    );
    setUploading(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const feedbackData = {
      ...formData,
      contactInfo: {
        name: user.name,
        email: user.email,
        phone: formData.phone,
      },
      status: "open",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      reportedBy: "Citizen",
      attachments,
      assignedTo: formData.assignedTo,
    };

    try {
      await firebase.firestore().collection("Feedback").add(feedbackData);
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setFormData({
          name: "",
          description: "",
          category: "",
          priority: "medium",
          location: "",
          phone: "",
          assignedTo: "",
        });
        setAttachments([]);
      }, 1500);
    } catch (error) {
      setSubmitError(error.message);
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: theme === "light" ? "#fff" : "#121212",
          color: theme === "light" ? "#000" : "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Submit New Feedback</Typography>
        <IconButton
          onClick={onClose}
          sx={{ color: theme === "light" ? "#000" : "#fff" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: theme === "light" ? "#fff" : "#121212",
          color: theme === "light" ? "#000" : "#fff",
          py: 3,
        }}
      >
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Feedback submitted successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!formErrors.name}
              helperText={formErrors.name}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  color: theme === "light" ? "#000" : "#fff",
                },
                "& .MuiInputLabel-root": {
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.23)"
                      : "rgba(255, 255, 255, 0.23)",
                },
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.category}>
              <InputLabel
                sx={{
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                }}
              >
                Category *
              </InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                label="Category *"
                sx={{
                  color: theme === "light" ? "#000" : "#fff",
                  "& .MuiSvgIcon-root": {
                    color: theme === "light" ? "#000" : "#fff",
                  },
                }}
              >
                {Categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category && (
                <FormHelperText>{formErrors.category}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel
                sx={{
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                }}
              >
                Priority
              </InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                label="Priority"
                sx={{
                  color: theme === "light" ? "#000" : "#fff",
                  "& .MuiSvgIcon-root": {
                    color: theme === "light" ? "#000" : "#fff",
                  },
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  color: theme === "light" ? "#000" : "#fff",
                },
                "& .MuiInputLabel-root": {
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description *"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  color: theme === "light" ? "#000" : "#fff",
                },
                "& .MuiInputLabel-root": {
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                },
              }}
              inputProps={{ maxLength: 500 }}
            />
            <Typography
              variant="caption"
              sx={{
                color:
                  theme === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
              }}
            >
              {formData.description.length}/500 characters
            </Typography>

            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              sx={{
                mb: 2,
                "& .MuiInputBase-input": {
                  color: theme === "light" ? "#000" : "#fff",
                },
                "& .MuiInputLabel-root": {
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                },
              }}
            />

            <FormControl
              fullWidth
              sx={{ mb: 2 }}
              error={!!formErrors.assignedTo}
            >
              <InputLabel
                sx={{
                  color:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                }}
              >
                Assign to Ministry *
              </InputLabel>
              <Select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                label="Assign to Ministry *"
                sx={{
                  color: theme === "light" ? "#000" : "#fff",
                  "& .MuiSvgIcon-root": {
                    color: theme === "light" ? "#000" : "#fff",
                  },
                }}
              >
                {ministries.map((min) => (
                  <MenuItem key={min.id} value={min.name}>
                    {min.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.assignedTo && (
                <FormHelperText>{formErrors.assignedTo}</FormHelperText>
              )}
            </FormControl>

            <input
              accept="image/*,video/*,application/pdf"
              style={{ display: "none" }}
              id="attachment-upload"
              type="file"
              multiple
              onChange={(e) =>
                Array.from(e.target.files).forEach(handleFileUpload)
              }
            />
            <label htmlFor="attachment-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{
                  color: theme === "light" ? "#000" : "#fff",
                  borderColor:
                    theme === "light"
                      ? "rgba(0, 0, 0, 0.23)"
                      : "rgba(255, 255, 255, 0.23)",
                  "&:hover": {
                    borderColor: theme === "light" ? "#000" : "#fff",
                  },
                }}
              >
                Add Attachments (Max 5)
              </Button>
            </label>

            {uploading && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ mt: 1 }}
              />
            )}
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {attachments.map((file, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  {file.type === "image" && (
                    <Avatar
                      src={file.url}
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                  )}
                  <Chip
                    label={file.name}
                    onDelete={() =>
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    deleteIcon={<Delete />}
                    sx={{
                      maxWidth: 120,
                      backgroundColor:
                        theme === "light" ? "#f5f5f5" : "#424242",
                      "& .MuiChip-label": {
                        color: theme === "light" ? "#000" : "#fff",
                      },
                      "& .MuiSvgIcon-root": {
                        color: theme === "light" ? "#000" : "#fff",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: theme === "light" ? "#fff" : "#121212",
          borderTop: `1px solid ${
            theme === "light"
              ? "rgba(0, 0, 0, 0.12)"
              : "rgba(255, 255, 255, 0.12)"
          }`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{ color: theme === "light" ? "#000" : "#fff" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || submitSuccess}
          startIcon={submitSuccess ? <Check /> : null}
        >
          {submitSuccess ? "Submitted!" : "Submit Feedback"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// User Feedback List Component
const UserFeedbackList = ({ user, isMobile }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    ministry: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Feedback")
      .where("contactInfo.email", "==", user.email)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dateReported: doc.data().dateReported?.toDate(),
        }));
        setFeedback(data);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user.email]);

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedTab === "all" ? true : item.status === selectedTab;

    const matchesFilters =
      (!filters.category || item.category === filters.category) &&
      (!filters.priority || item.priority === filters.priority) &&
      (!filters.ministry || item.assignedTo === filters.ministry);

    return matchesSearch && matchesStatus && matchesFilters;
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: "", priority: "", ministry: "" });
    setShowFilters(false);
  };

  return (
    <Box
      sx={{
        bgcolor: theme === "light" ? "#f8f9fa" : "#1a1a1a",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          variant="filled"
          placeholder="Search feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <Search
                sx={{
                  color: theme === "light" ? "text.primary" : "#fff",
                  mr: 1,
                }}
              />
            ),
            disableUnderline: true,
            sx: {
              borderRadius: "12px",
              backgroundColor: theme === "light" ? "#fff" : "#333",
              color: theme === "light" ? "text.primary" : "#fff",
              padding: "2px 16px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme === "light" ? "#f5f5f5" : "#404040",
              },
            },
          }}
          sx={{ mb: 4 }}
        />

        <FilterList onClick={() => setShowFilters(true)} />
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
        sx={{ mt: "-30px" }}
      >
        <Tab
          icon={<Reorder />}
          value="all"
          sx={{
            color: theme === "light" ? "text.primary" : "#fff",
            fontSize: "12px",
          }}
        />
        <Tab
          icon={<RemoveDone />}
          value="open"
          sx={{
            color: theme === "light" ? "text.primary" : "#fff",
            fontSize: "12px",
          }}
        />
        <Tab
          icon={<Loop />}
          value="in-progress"
          sx={{
            color: theme === "light" ? "text.primary" : "#fff",
            fontSize: "12px",
          }}
        />
        <Tab
          icon={<DoneAll />}
          value="closed"
          sx={{
            color: theme === "light" ? "text.primary" : "#fff",
            fontSize: "12px",
          }}
        />
      </Tabs>

      <FilterDialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={handleFilterChange}
        resetFilters={resetFilters}
        isMobile={isMobile}
      />

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
      ) : filteredFeedback.length === 0 ? (
        <Alert severity="info" sx={{ m: 2 }}>
          No feedback found matching criteria
        </Alert>
      ) : (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          {filteredFeedback.map((item) => (
            <FeedbackCard
              key={item.id}
              item={item}
              theme={theme}
              isMobile={isMobile}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// New Filter Dialog Component
const FilterDialog = ({ open, onClose, filters, setFilters, resetFilters }) => {
  const { docs: ministries } = useGetMinistries();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        Filter Feedback
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          select
          fullWidth
          label="Category"
          value={filters.category}
          onChange={(e) => setFilters("category", e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {Categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Priority"
          value={filters.priority}
          onChange={(e) => setFilters("priority", e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="">All Priorities</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Ministry"
          value={filters.ministry}
          onChange={(e) => setFilters("ministry", e.target.value)}
        >
          <MenuItem value="">All Ministries</MenuItem>
          {ministries.map((min) => (
            <MenuItem key={min.id} value={min.name}>
              {min.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetFilters}>Reset</Button>
        <Button onClick={onClose} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Optimized Feedback Card Component for Mobile
const FeedbackCard = ({ item, theme }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "warning";
      case "in-progress":
        return "info";
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: theme === "light" ? "white" : "black",
        borderRadius: "16px",
        color: theme === "light" ? "#111111" : "white",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 3 },
        my: "20px",
      }}
    >
      <CardContent
        sx={{
          backgroundColor: theme === "light" ? "white" : "black",
          color: theme === "light" ? "#111111" : "white",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{item.name}</Typography>
          <Chip
            label={item.status}
            color={getStatusColor(item.status)}
            variant="outlined"
          />
        </Box>

        <Box sx={{ width: 200, pl: 2, borderLeft: `1px solid` }}>
          <Typography variant="caption" display="block" gutterBottom>
            Priority: <Chip label={item.priority} size="small" />
          </Typography>
          <Typography variant="caption" display="block">
            Assigned to: {item.assignedTo}
          </Typography>
        </Box>

        <Typography variant="body2" style={{ color: "white" }} gutterBottom>
          {item.dateReported?.toLocaleDateString()}
        </Typography>

        <Typography paragraph>{item.description}</Typography>

        {item.governmentResponse && (
          <Box
            sx={{
              bgcolor: theme === "dark" ? "#2d2d2d" : "#f5f5f5",
              p: 2,
              borderRadius: 1,
              mt: 2,
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Government Response:
            </Typography>
            <Typography>{item.governmentResponse}</Typography>
          </Box>
        )}

        {item.attachments?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Attachments:
            </Typography>
            <Box gap={1}>
              {item.attachments.map((file, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<Visibility />}
                  sx={{ mt: "5px", mx: "5px" }}
                  onClick={() => window.open(file.url, "_blank")}
                >
                  View File {index + 1}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export { FeedbackModal, UserFeedbackList };
