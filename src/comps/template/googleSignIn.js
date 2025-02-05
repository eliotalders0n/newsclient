import React, { useEffect } from "react";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import firebase from "../../firebase";
import { Container, Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GoogleSignInButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize GoogleAuth when the app loads
    GoogleAuth.initialize({
      clientId:
        "141780524287-h5683vclg63h0e6ndma1947vuvsod3tp.apps.googleusercontent.com",
      scopes: ["profile", "email"],
      grantOfflineAccess: true,
    });
  });
  
  const handleUserLogin = async (user) => {
    const { familyName, givenName, name, imageUrl, email, id } = user;

    try {
      const uid = id; // Use the id from GoogleAuth as the user identifier
      console.log("User UID:", uid);

      const userDoc = firebase.firestore().collection("Users").doc(uid);
      const doc = await userDoc.get();

      if (doc.exists) {
        // Update existing user details
        await userDoc.update({
          familyName,
          givenName,
          name,
          imageUrl,
          email,
        });
      } else {
        // Create a new user document
        await userDoc.set({
          givenName,
          familyName,
          name,
          imageUrl,
          email,
          role: "user",
          age: "",
          contact: "",
          gender: "",
          address: "",
          status: "Approved",
          admin: false,
        });
      }

      // Log the auth code for additional authentication if needed
      const authCode = await GoogleAuth.refresh();
      console.log("User Auth Code:", authCode);

      // Navigate to the home page
      navigate("/profile");
    } catch (error) {
      console.error("Error accessing Firestore:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Sign in with Google using the Capacitor Google Auth plugin
      const googleUser = await GoogleAuth.signIn();

      // Extract the ID token from the Google user's authentication details
      const idToken = googleUser.authentication.idToken;

      // Create Firebase credentials using the extracted ID token
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

      // Sign in with Firebase using the credentials
      const result = await firebase.auth().signInWithCredential(credential);

      // Extract the Firebase user object
      const user = result.user;

      // Handle further user login logic
      handleUserLogin(user);
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        padding: "12vh 2vh",
      }}
    >
      <Stack
        className="text-center"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          color: "white",
          marginTop: "30vh",
          borderRadius: "10px",
        }}
      >
        <h2 className="display-4" style={{ marginBottom: "30px" }}>
          <i className="bi bi-google"></i>
        </h2>
        <Button
          onClick={signInWithGoogle}
          variant="success"
          size="lg"
          style={{ width: "100%" }}
        >
          Sign in with Google
        </Button>
      </Stack>
    </Container>
  );
};

export default GoogleSignInButton;
