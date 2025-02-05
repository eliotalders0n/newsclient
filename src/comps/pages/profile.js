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
} from "@mui/material";
import { UserFeedbackList, FeedbackModal } from "../template/FeedbackForm";

const Profile = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [userPic, setUserPic] = useState(null);
  const [user, setUser] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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
              setUser(doc.data());
              setUserPic(doc.data()?.photoURL);
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
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`profile_pictures/${file.name}`);
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading profile picture:", error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          // Update the profile picture immediately after upload
          setUserPic(url); // Set the URL as the new profile picture
          setUploading(false);
          updateProfilePicture(url); // Optionally, update Firestore with the new picture URL
        });
      }
    );
    setUploading(true);
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
                  src={userPic || "/default-avatar.png"} // Use the updated userPic state
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
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button
            variant="contained"
            onClick={() => setFeedbackOpen(true)}
            sx={{ mt: 2, width: "100%" }}
          >
            Submit Feedback
          </Button>
        </Grid>

        <Grid item xs={12} sm={12}>
          {user && <UserFeedbackList user={user} />}
        </Grid>

        <Grid item xs={12} sm={12}>
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
                backgroundColor:
                  theme === "light" ? "rgb(200,200,200)" : "white",
                color: theme === "light" ? "white" : "#111111",
              }}
            >
              Logout
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        user={user && user}
      />
    </Box>
  );
};

export default Profile;
