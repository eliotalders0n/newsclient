import React from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ padding: { xs: "8vh 2vh", sm: "12vh 4vh" }, marginTop: "8vh" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Terms of Use
      </Typography>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome to EATI
        </Typography>
        <Typography variant="body1">
          EATI is a news application owned and operated by AppFusion Studio Limited, designed to provide accurate and timely news sourced from the Ministry of Information and Media as well as independent reporters.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Use of Content
        </Typography>
        <Typography variant="body1">
          All content provided on EATI, including articles, images, and other materials, is intended for informational purposes only. Users are prohibited from reproducing, redistributing, or modifying any content without prior written consent from AppFusion Studio Limited.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          User Responsibilities
        </Typography>
        <Typography variant="body1">
          By using EATI, you agree to:
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Use the app in compliance with all applicable laws in Zambia and any other relevant jurisdiction." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Not post, share, or distribute harmful content that violates the rights of others or is deemed offensive." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Respect the intellectual property rights of all contributors, including the app’s creators and content providers." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Refrain from attempting to reverse-engineer, decompile, or otherwise alter the app’s functionality." />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Privacy and Data Collection
        </Typography>
        <Typography variant="body1">
          We value your privacy. EATI collects and processes personal data in accordance with our privacy policy, which complies with the Google Play Store’s user data policies. By using the app, you consent to the collection and processing of your data as described in our Privacy Policy. You have the right to access, correct, and delete your personal data, as well as control how it is used.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Third-Party Services and Ads
        </Typography>
        <Typography variant="body1">
          EATI may include third-party services or advertisements that could collect personal information. By using the app, you acknowledge and agree to the use of third-party services in accordance with their respective privacy policies. We do not collect sensitive user data for advertising purposes without explicit consent.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Termination of Access
        </Typography>
        <Typography variant="body1">
          AppFusion Studio Limited reserves the right to terminate or suspend your access to EATI at any time, without prior notice, for any conduct that violates these Terms of Use or for any other reason.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Limitation of Liability
        </Typography>
        <Typography variant="body1">
          To the fullest extent permitted by law, AppFusion Studio Limited is not liable for any indirect, incidental, or consequential damages arising out of the use or inability to use EATI, including data loss, service interruptions, or any other issues that may arise.
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Changes to Terms of Use
        </Typography>
        <Typography variant="body1">
          AppFusion Studio Limited reserves the right to modify or update these Terms of Use at any time. Any changes will be communicated to users through the app or by updating the terms on this page. Continued use of the app constitutes acceptance of the updated terms.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsPage;
