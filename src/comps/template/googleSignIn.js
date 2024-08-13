import React from "react";
import firebase from "./../../firebase";
import Button from "@mui/material/Button";
import { Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GoogleSignInButton = () => {
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        const { displayName, photoURL, email, uid } = user;
        const firstName = displayName.split(" ")[0]; // Assuming the first word is the first name

        // Check if the user exists in Firestore
        firebase
          .firestore()
          .collection("Users")
          .doc(uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // User exists, update the user document
              firebase
                .firestore()
                .collection("Users")
                .doc(uid)
                .update({
                  firstName: firstName,
                  lastName: displayName.replace(firstName, "").trim(), // Remaining part as last name
                  photoUrl: photoURL,
                  email: email,
                });
            } else {
              // User doesn't exist, create a new user document
              firebase
                .firestore()
                .collection("Users")
                .doc(uid)
                .set({
                  firstName: firstName,
                  lastName: displayName.replace(firstName, "").trim(), // Remaining part as last name
                  photoURL: photoURL,
                  email: email,
                  role: "user",
                  age: "",
                  contact: "",
                  gender: "",
                  address: "",
                  status: "Approved",
                  admin: false,
                });
            }
            navigate("/home");
          })
          .catch((error) => {
            console.error("Error checking Firestore:", error);
          });
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        padding: "12vh 2vh 12vh 2vh",
      }}
    >
      <Stack
        style={{
          padding: "12px",
          color: "white",
          borderRadius: "10px",
          height: "50vh",
        }}
      >
        <Stack style={{ marginTop: "30vh" }}>
          <h2 className="display-2 text-center">
            <i className="bi bi-google"></i>
          </h2>
          <br />
          <Button
            onClick={signInWithGoogle}
            fullWidth
            variant="contained"
            color="success"
          >
            Sign in with Google
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default GoogleSignInButton;
