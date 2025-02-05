import React from "react";
import { Stack, Container } from "react-bootstrap";

import { useTheme } from "../template/themeContext";

const PrivacyPolicy = () => {
  const { theme } = useTheme();

  return (
    <Container
      fluid
      className="reels-container"
      style={{
        backgroundColor: theme === "light" ? "white" : "#111111",
        color: theme === "light" ? "#111111" : "white",
        minHeight: "100vh",
        padding: "10vh 1vh 10vh 1vh",
        marginTop: "8vh",
      }}
    >
      <h2
        style={{
          fontFamily: "Roboto Condensed",
          fontStyle: "normal",
          textAlign: "center",
        }}
      >
        Resources
      </h2>

      <Stack gap={4} style={{ padding: "10px 20px" }}>
        <p
          style={{
            fontFamily: "Roboto Condensed",
            fontStyle: "normal",
            textAlign: "left",
            backgroundColor: theme === "light" ? "white" : "#111111",
            color: theme === "light" ? "#111111" : "white",
          }}
        >
          <div>
            <h1>Privacy Policy for E-ATI</h1>
            <p>
              <strong>Effective Date: [9-24-2024]</strong>
            </p>
            <p>
              E-ATI (“we,” “us,” or “our”) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, and
              share information when you use our mobile application, E-ATI (the
              “App”).
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              E-ATI does not collect personal data such as names, email
              addresses, or location information. The App is designed to provide
              a seamless user experience without requiring any personal
              information from the user.
            </p>

            <h3>1.1 Automatically Collected Information</h3>
            <p>
              The App may collect certain non-personal information
              automatically, including but not limited to the type of mobile
              device you use, your device’s operating system version, and other
              diagnostic data to ensure the App functions properly.
            </p>

            <h2>2. Use of Information</h2>
            <p>
              The information we collect is used solely to improve the App’s
              functionality and to ensure its compatibility with various devices
              and operating systems. We do not collect, use, or share any
              personally identifiable information (PII).
            </p>

            <h2>3. No Ads or In-App Purchases</h2>
            <p>
              E-ATI does not display any ads, and there are no in-app purchases.
              We aim to provide a distraction-free experience for our users.
            </p>

            <h2>4. Sharing of Information</h2>
            <p>
              We do not share any information collected with third parties.
              Since we do not collect personal information, there is no data to
              share with advertisers, partners, or third-party services.
            </p>

            <h2>5. Target Audience</h2>
            <p>
              E-ATI is designed for users aged 13 and above. The App complies
              with Google Play’s policies regarding apps intended for a mature
              audience. No content within the App is specifically targeted at
              children under the age of 13, and we do not knowingly collect any
              information from users under the age of 13.
            </p>

            <h2>6. Permissions</h2>
            <p>
              E-ATI may request access to certain device features (such as
              storage, camera, or network access) to enhance the user
              experience. These permissions are only used for the intended
              functionality of the App and are not used to collect personal
              data.
            </p>

            <ul>
              <li>
                <strong>Internet Access:</strong> This permission is used to
                provide real-time updates and synchronize content within the
                App.
              </li>
              <li>
                <strong>Storage Access:</strong> This permission may be required
                to save or retrieve data files locally on your device.
              </li>
            </ul>

            <p>
              We do not use any sensitive or high-risk permissions that require
              additional declarations or approval by Google Play.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We do not retain any personal data, as none is collected. Any
              non-personal information collected (such as diagnostic data) is
              used solely for improving the performance of the App and is not
              retained once its purpose has been fulfilled.
            </p>

            <h2>8. Security</h2>
            <p>
              We take security seriously. While we do not collect personal data,
              we have implemented technical measures to protect the App from
              potential threats or unauthorized access.
            </p>

            <h2>9. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will revise the “Effective Date” at the top of this page. We
              encourage you to review this Privacy Policy periodically to stay
              informed about how we are protecting your information.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how E-ATI
              handles your data, feel free to contact us at:
            </p>

            <p>
              <strong>[Appfusion Studio Limited]</strong>
            </p>
            <p>
              <strong>Email:</strong> [pukutam@live.com]
            </p>
            <p>
              <strong>Address:</strong> [Lusaka , Lusaka, Zambia]
            </p>
          </div>
          <br />
        </p>
      </Stack>
    </Container>
  );
};

export default PrivacyPolicy;
