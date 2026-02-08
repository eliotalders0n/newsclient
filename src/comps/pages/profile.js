import React, { useEffect, useState } from "react";
import firebase from "./../../firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../template/themeContext";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [userpic, setUserPic] = useState(null);
  const [userData, setUserData] = useState({});
  const [expandedSection, setExpandedSection] = useState(null);

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((doc) => {
        setUserData(doc.data() || {});
      });
    return () => unsub();
  }, []);

  const handleLogout = () => {
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
    if (!file) return;
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`profile_pictures/${file.name}`);
    const uploadTask = fileRef.put(file);

    setUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.error("Error uploading profile picture:", error);
        setUploading(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setUserPic(url);
          setUploading(false);
        });
      }
    );
  };

  const updateProfilePicture = () => {
    if (!userpic) return;
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({ photoURL: userpic })
      .then(() => setUserPic(null))
      .catch((error) =>
        console.error("Error updating profile picture:", error)
      );
  };

  const removeProfilePicture = () => {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .update({ photoURL: firebase.firestore.FieldValue.delete() })
      .then(() => setUserPic(""))
      .catch((error) =>
        console.error("Error removing profile picture:", error)
      );
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const avatarSrc = userpic || userData.photoURL;

  return (
    <div
      style={{
        backgroundColor: bg,
        color: fg,
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "80px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h5
          style={{
            fontWeight: 700,
            color: "#f76f25",
            fontSize: "16px",
            margin: 0,
          }}
        >
          Profile
        </h5>
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: cardBg,
            color: fg,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <i className={`bi ${isDark ? "bi-sun" : "bi-moon"}`} />
          {isDark ? "Light" : "Dark"}
        </button>
      </div>

      {/* Avatar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div style={{ position: "relative", marginBottom: "12px" }}>
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt=""
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${cardBg}`,
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: cardBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-person-fill"
                style={{ fontSize: "40px", color: secondaryText }}
              />
            </div>
          )}

          {/* Edit badge */}
          <label
            htmlFor="profilePictureInput"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#f76f25",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <i className="bi bi-pencil-fill" />
          </label>
          <input
            id="profilePictureInput"
            type="file"
            onChange={handleProfilePictureChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {/* Upload progress */}
        {uploading && (
          <div
            style={{
              width: "120px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: cardBg,
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${uploadProgress}%`,
                backgroundColor: "#f76f25",
                borderRadius: "2px",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Picture actions (only show when new pic selected) */}
        {userpic && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <button
              onClick={updateProfilePicture}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#f76f25",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setUserPic(null)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: cardBg,
                color: fg,
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Remove picture */}
        {userData.photoURL && !userpic && (
          <button
            onClick={removeProfilePicture}
            style={{
              background: "none",
              border: "none",
              color: secondaryText,
              fontSize: "12px",
              cursor: "pointer",
              marginBottom: "4px",
            }}
          >
            Remove photo
          </button>
        )}

        {/* Name & email */}
        <p
          style={{
            fontWeight: 700,
            fontSize: "18px",
            margin: "0 0 2px 0",
            textAlign: "center",
          }}
        >
          {userData.firstName} {userData.lastName}
        </p>
        <p
          style={{
            fontSize: "13px",
            color: secondaryText,
            margin: 0,
            textAlign: "center",
          }}
        >
          {userData.email}
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "none",
          backgroundColor: cardBg,
          color: fg,
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <i className="bi bi-box-arrow-right" />
        Sign Out
      </button>

      {/* About */}
      <h5
        style={{
          fontWeight: 700,
          color: "#f76f25",
          marginBottom: "14px",
          fontSize: "16px",
        }}
      >
        About
      </h5>
      <div
        style={{
          backgroundColor: cardBg,
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "24px",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          <strong>Address:</strong> New Government Complex, 5th &amp; 6th Floors
        </p>
        <p style={{ margin: "0 0 8px 0" }}>
          <strong>P.O. Box:</strong> 51025, Lusaka, Zambia.
        </p>
        <p style={{ margin: "0 0 8px 0" }}>
          <strong>Contact:</strong> +260 211 237150 | +260 211 220749
        </p>
        <p style={{ margin: 0 }}>
          <strong>Email:</strong> eatiapp.mim@gmail.com
        </p>
      </div>

      {/* Useful Links */}
      <h5
        style={{
          fontWeight: 700,
          color: "#f76f25",
          marginBottom: "14px",
          fontSize: "16px",
        }}
      >
        Useful Links
      </h5>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            icon: "bi-globe",
            label: "Ministry of Information and Media",
            url: "https://www.mim.gov.zm/",
          },
          {
            icon: "bi-headset",
            label: "Citizen Support Portal",
            url: "https://portal.citizensupport.gov.zm/",
          },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "14px",
              backgroundColor: cardBg,
              textDecoration: "none",
              color: fg,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <i
              className={`bi ${link.icon}`}
              style={{ fontSize: "18px", color: "#f76f25" }}
            />
            <span style={{ flex: 1 }}>{link.label}</span>
            <i
              className="bi bi-box-arrow-up-right"
              style={{ fontSize: "14px", color: secondaryText }}
            />
          </a>
        ))}
      </div>

      {/* Terms of Use */}
      <div style={{ marginBottom: "2px" }}>
        <button
          onClick={() => toggleSection("terms")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderRadius: expandedSection === "terms" ? "14px 14px 0 0" : "14px",
            border: "none",
            backgroundColor: cardBg,
            color: fg,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <i className="bi bi-file-text" style={{ fontSize: "18px", color: "#f76f25" }} />
            Terms of Use
          </span>
          <i
            className={`bi ${expandedSection === "terms" ? "bi-chevron-up" : "bi-chevron-down"}`}
            style={{ fontSize: "14px", color: secondaryText }}
          />
        </button>
        {expandedSection === "terms" && (
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: "0 0 14px 14px",
              padding: "0 16px 16px 16px",
              fontSize: "13px",
              lineHeight: "1.7",
              color: secondaryText,
            }}
          >
            <p><strong style={{ color: fg }}>Welcome to EATI</strong><br />
            EATI is a news application owned and operated by AppFusion Studio Limited, designed to provide accurate and timely news sourced from the Ministry of Information and Media as well as independent reporters.</p>

            <p><strong style={{ color: fg }}>Use of Content</strong><br />
            All content provided on EATI, including articles, images, and other materials, is intended for informational purposes only. Users are prohibited from reproducing, redistributing, or modifying any content without prior written consent from AppFusion Studio Limited.</p>

            <p><strong style={{ color: fg }}>User Responsibilities</strong><br />
            By using EATI, you agree to: use the app in compliance with all applicable laws in Zambia and any other relevant jurisdiction; not post, share, or distribute harmful content that violates the rights of others or is deemed offensive; respect the intellectual property rights of all contributors; and refrain from attempting to reverse-engineer, decompile, or otherwise alter the app's functionality.</p>

            <p><strong style={{ color: fg }}>Privacy and Data Collection</strong><br />
            We value your privacy. EATI collects and processes personal data in accordance with our privacy policy, which complies with the Google Play Store's user data policies. By using the app, you consent to the collection and processing of your data as described in our Privacy Policy. You have the right to access, correct, and delete your personal data.</p>

            <p><strong style={{ color: fg }}>Third-Party Services and Ads</strong><br />
            EATI may include third-party services or advertisements that could collect personal information. By using the app, you acknowledge and agree to the use of third-party services in accordance with their respective privacy policies.</p>

            <p><strong style={{ color: fg }}>Termination of Access</strong><br />
            AppFusion Studio Limited reserves the right to terminate or suspend your access to EATI at any time, without prior notice, for any conduct that violates these Terms of Use.</p>

            <p><strong style={{ color: fg }}>Limitation of Liability</strong><br />
            To the fullest extent permitted by law, AppFusion Studio Limited is not liable for any indirect, incidental, or consequential damages arising out of the use or inability to use EATI.</p>

            <p style={{ margin: 0 }}><strong style={{ color: fg }}>Changes to Terms of Use</strong><br />
            AppFusion Studio Limited reserves the right to modify or update these Terms of Use at any time. Continued use of the app constitutes acceptance of the updated terms.</p>
          </div>
        )}
      </div>

      {/* Privacy Policy */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => toggleSection("privacy")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderRadius: expandedSection === "privacy" ? "14px 14px 0 0" : "14px",
            border: "none",
            backgroundColor: cardBg,
            color: fg,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <i className="bi bi-shield-check" style={{ fontSize: "18px", color: "#f76f25" }} />
            Privacy Policy
          </span>
          <i
            className={`bi ${expandedSection === "privacy" ? "bi-chevron-up" : "bi-chevron-down"}`}
            style={{ fontSize: "14px", color: secondaryText }}
          />
        </button>
        {expandedSection === "privacy" && (
          <div
            style={{
              backgroundColor: cardBg,
              borderRadius: "0 0 14px 14px",
              padding: "0 16px 16px 16px",
              fontSize: "13px",
              lineHeight: "1.7",
              color: secondaryText,
            }}
          >
            <p><strong style={{ color: fg }}>Introduction</strong><br />
            At AppFusion Studio Limited, we value your privacy. This privacy policy outlines how we collect, use, and protect your personal information while using EATI.</p>

            <p><strong style={{ color: fg }}>Information Collection</strong><br />
            We may collect personal details, such as name, email address, and usage data to improve user experience. Any data collected is done so with user consent.</p>

            <p><strong style={{ color: fg }}>Use of Information</strong><br />
            The information we collect is used to: provide and improve EATI's services; communicate with users about updates and features; and ensure compliance with legal obligations.</p>

            <p><strong style={{ color: fg }}>Google Play Store Policy Compliance</strong><br />
            We do not collect any personally identifiable information without user consent. Any data collected is stored securely. We ask for permissions only when necessary. If the app includes ads or third-party services, we comply with Google's ad policies. We retain personal data only for as long as necessary.</p>

            <p><strong style={{ color: fg }}>User Rights and Control</strong><br />
            Users have the right to access, correct, and delete their personal information. If you wish to revoke any permissions or request that your data be deleted, you can do so through the app settings or by contacting us directly.</p>

            <p style={{ margin: 0 }}><strong style={{ color: fg }}>Changes to This Privacy Policy</strong><br />
            We may update this privacy policy from time to time. We will notify users of any material changes through the app.</p>
          </div>
        )}
      </div>

      {/* App info */}
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: secondaryText,
          margin: 0,
        }}
      >
        EATI v1.0 &middot; AppFusion Studio Limited
      </p>
    </div>
  );
};

export default Profile;
