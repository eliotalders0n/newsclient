import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";

const PrivacyPage = () => {
  return (
    <Box sx={{ padding: { xs: "12vh 2vh", sm: "12vh 4vh" }, fontFamily: "Arial, sans-serif" }}>
      <Paper sx={{ padding: "2rem" }} elevation={3}>
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>

        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h5" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1">
            At AppFusion Studio Limited, we value your privacy. This privacy policy outlines how we collect, use, and protect your personal information while using EATI. We are committed to adhering to the Google Play Store's Developer Policies and respecting user privacy and data protection.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h5" gutterBottom>
            Information Collection
          </Typography>
          <Typography variant="body1">
            We may collect personal details, such as name, email address, and usage data to improve user experience. We are committed to transparent data practices, and any data collected is done so with user consent.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h5" gutterBottom>
            Use of Information
          </Typography>
          <Typography variant="body1">
            The information we collect is used to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Provide and improve EATI's services." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Communicate with users about updates and features." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ensure compliance with legal obligations." />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h5" gutterBottom>
            Google Play Store Policy Compliance
          </Typography>
          <Typography variant="body1">
            As an app available on the Google Play Store, EATI complies with the following policies to ensure full adherence to Google's restrictions:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Privacy and Data Security: We do not collect any personally identifiable information (PII) without user consent. Any data collected is stored securely and used solely for improving the user experience." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Data Usage Disclosure: We clearly disclose how we use the collected data within the app, in compliance with Google Play's policies." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Permission Requests: We ask for permissions only when necessary, and users are informed of why we need them. Permissions such as location or camera access are only used with explicit consent." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Ads and Third-Party Services: If the app includes ads or third-party services, we comply with Google's ad policies. We do not collect sensitive user data without explicit consent for advertising purposes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Child-Directed Apps: If the app targets children, we follow additional guidelines for data collection and protection, in accordance with the Children's Online Privacy Protection Act (COPPA)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Data Retention: We retain personal data only for as long as necessary to fulfill the purpose for which it was collected, in compliance with Google Play's data retention policies." />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h5" gutterBottom>
            User Rights and Control
          </Typography>
          <Typography variant="body1">
            Users have the right to access, correct, and delete their personal information. If you wish to revoke any permissions or request that your data be deleted, you can do so through the app settings or by contacting us directly.
          </Typography>
        </Box>

        <Box sx={{ marginBottom: "1.5rem" }}>
          <Typography variant="h5" gutterBottom>
            Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1">
            We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify users of any material changes through the app.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PrivacyPage;
