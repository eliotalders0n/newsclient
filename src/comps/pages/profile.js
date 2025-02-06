import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "./../../firebase";
import { useTheme } from "../template/themeContext";
import {
  Box,
  Stack,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    nrc: "",
  });

  useEffect(() => {
    const unsubscribeAuth = firebase
      .auth()
      .onAuthStateChanged((currentUser) => {
        if (currentUser) {
          const userDocRef = firebase
            .firestore()
            .collection("app_users")
            .doc(currentUser.uid);
          const unsubscribeSnapshot = userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setUser(userData);
              setUserPic(userData?.photoURL);
              setFormData({
                name: userData.name || "",
                email: userData.email || "",
                age: userData.age || "",
                nrc: userData.nrc || "",
              });
            } else {
              console.error("User document does not exist");
            }
          });
          return () => unsubscribeSnapshot();
        } else {
          console.log("No authenticated user found");
          setUser(null);
        }
      });
    return () => unsubscribeAuth();
  }, []);

  const Logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/", { replace: true });
        window.location.reload(false);
      });
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];

    // Check if a file was selected
    if (!file) return;

    // Define the maximum allowed file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    // Check if the file exceeds the maximum allowed size
    if (file.size > maxSize) {
      toast.error("File is too large. Please upload a file smaller than 5MB.");
      return;
    }

    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`profile_pictures/${file.name}`);
    const uploadTask = fileRef.put(file);

    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading profile picture:", error);
        toast.error("There was an error uploading your profile picture.");
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setUserPic(url);
          setUploading(false);
          updateProfilePicture(url);
          toast.success("Profile picture updated successfully!");
        });
      }
    );
  };

  const updateProfilePicture = (url) => {
    const currentUser = firebase.auth().currentUser;
    const userId = currentUser.uid;

    firebase
      .firestore()
      .collection("app_users")
      .doc(userId)
      .update({
        photoURL: url,
      })
      .then(() => {
        console.log("Profile picture updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile picture:", error);
      });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    const currentUser = firebase.auth().currentUser;
    const userId = currentUser.uid;

    firebase
      .firestore()
      .collection("app_users")
      .doc(userId)
      .update(formData)
      .then(() => {
        console.log("Profile updated successfully");
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      age: user.age || "",
      nrc: user.nrc || "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme === "light" ? "whitesmoke" : "#2C2C2C",
        color: theme === "light" ? "#111111" : "white",
        minHeight: "100vh",
        padding: { xs: "8vh 2vh", sm: "12vh 4vh" },
        marginTop: "8vh",
      }}
    >
      <Grid container spacing={3}>
        {/* Profile Picture */}
        <Grid item xs={12} sm={4} container justifyContent="center">
          <Button
            sx={{
              color: theme === "light" ? "black" : "white",
              fontSize: "18px",
            }}
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙" : "🌞"}
          </Button>
          <Card
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme === "light" ? "white" : "black",
              color: theme === "light" ? "#111111" : "white",
            }}
          >
            <CardContent
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: theme === "light" ? "white" : "black",
                  color: theme === "light" ? "#111111" : "white",
                }}
              >
                <img
                  src={userPic || "/default-avatar.png"}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
                <label
                  htmlFor="profilePictureInput"
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    cursor: "pointer",
                    backgroundColor: "rgb(255, 255, 255)",
                    color: "black",
                    borderRadius: "50%",
                    padding: "5px",
                  }}
                >
                  <i className="bi bi-pencil-fill"></i>
                </label>
                <input
                  id="profilePictureInput"
                  type="file"
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </Box>
              {uploading && (
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ width: "100%", marginTop: 2 }}
                />
              )}
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {user?.email}
              </Typography>
              <Button
                variant="outlined"
                sx={{ marginTop: 2 }}
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Card
            sx={{
              padding: 3,
              marginTop: 3,
              backgroundColor: theme === "light" ? "white" : "black",
              color: theme === "light" ? "#111111" : "white",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              About
            </Typography>
            <Typography>
              <strong>Address:</strong> New Government Complex, 5th & 6th Floors{" "}
              <br />
              <strong>P.O. Box:</strong> 51025, Lusaka, Zambia. <br />
              <strong>Contact:</strong> +260 211 237150 | +260 211 220749 <br />
              <strong>Email:</strong> eatiapp.mim@gmail.com
            </Typography>

            <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
              Useful Links
            </Typography>
            <Typography>
              <a
                href="https://www.mim.gov.zm/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: theme === "light" ? "#0066cc" : "#66ccff",
                  textDecoration: "none",
                }}
              >
                Ministry of Information and Media
              </a>
              <br />
              <a
                href="https://portal.citizensupport.gov.zm/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: theme === "light" ? "#0066cc" : "#66ccff",
                  textDecoration: "none",
                }}
              >
                Citizen Support Portal
              </a>
              <br />
              <a
                href="/terms"
                style={{
                  color: theme === "light" ? "#0066cc" : "#66ccff",
                  textDecoration: "none",
                }}
              >
                Terms of Use
              </a>
              <br />
              <a
                href="/privacy"
                style={{
                  color: theme === "light" ? "#0066cc" : "#66ccff",
                  textDecoration: "none",
                }}
              >
                Privacy Policy
              </a>
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editMode} onClose={handleCancelClick}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="NRC"
            name="nrc"
            value={formData.nrc}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClick}>Cancel</Button>
          <Button onClick={handleSaveClick} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Button */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: 2 }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={Logout}
          sx={{
            backgroundColor: theme === "light" ? "rgb(200,200,200)" : "white",
            color: theme === "light" ? "white" : "#111111",
          }}
        >
          Logout
        </Button>
      </Stack>
      <ToastContainer />
    </Box>
  );
};

export default Profile;
