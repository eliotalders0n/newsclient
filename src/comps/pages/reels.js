import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme as useCustomTheme } from "../template/themeContext";
import firebase from "../../firebase";
import { UserFeedbackList, FeedbackModal } from "../template/FeedbackForm";

const ReelCard = () => {
  const { theme: appTheme } = useCustomTheme();
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

  return (
    <Box
      sx={{
        backgroundColor: appTheme === "light" ? "whitesmoke" : "#2C2C2C",
        color: appTheme === "light" ? "#111111" : "white",
        minHeight: "100vh",
        padding: "10vh 2vh",
        mt: 4,
      }}
    >
      <Typography
        align="center"
        sx={{
          fontFamily: "Roboto Condensed",
          fontStyle: "normal",
          paddingBottom: "10px",
        }}
      >
        Feedback and Queries
      </Typography>
      
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        user={user && user}
      />
      <Button variant="contained" fullWidth sx={{mb: 1}} onClick={() => setFeedbackOpen(true)}>
        Submit Query
      </Button>
      {user && <UserFeedbackList user={user} />}
    </Box>
  );
};

export default ReelCard;
