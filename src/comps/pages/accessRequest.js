import { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../template/themeContext";
import useGetMinistries from "../hooks/useGetMinistries";
import firebase from "../../firebase";

const AccessRequest = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { docs: ministries } = useGetMinistries();

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";
  const inputBg = isDark ? "#222222" : "#f0f0f0";
  const borderColor = isDark ? "#333333" : "#dddddd";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    requesterName: "",
    email: "",
    phone: "",
    address: "",
    identityNumber: "",
    identificationDetails: "",
    disability: "",
    infoName: "",
    infoHolder: "",
    infoContent: "",
    recordType: "written",
    requiredForm: "",
    notificationPreference: "",
    otherDetails: "",
    recordOptions: {
      copy: false,
      inspection: false,
      transcription: false,
    },
  });

  const [file, setFile] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRecordOption = (option) => {
    setForm((prev) => ({
      ...prev,
      recordOptions: {
        ...prev.recordOptions,
        [option]: !prev.recordOptions[option],
      },
    }));
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${borderColor}`,
    backgroundColor: inputBg,
    color: fg,
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: fg,
    marginBottom: "6px",
  };

  const fieldGroup = {
    marginBottom: "16px",
  };

  const canProceedStep1 =
    form.requesterName.trim() &&
    form.email.trim() &&
    form.phone.trim();

  const canProceedStep2 =
    form.infoName.trim() && form.infoHolder.trim() && form.infoContent.trim();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.size > 10 * 1024 * 1024) {
      setError("File must be less than 10MB.");
      return;
    }
    setFile(selected || null);
  };

  const uploadFile = async (docId) => {
    if (!file) return "";
    const ref = firebase
      .storage()
      .ref()
      .child(`access_requests/${docId}/${Date.now()}_${file.name}`);
    const task = ref.put(file);

    return new Promise((resolve, reject) => {
      setUploading(true);
      task.on(
        "state_changed",
        (snap) => {
          setUploadProgress(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
        },
        (err) => {
          setUploading(false);
          reject(err);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            setUploading(false);
            resolve(url);
          });
        }
      );
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const user = firebase.auth().currentUser;

      const docRef = firebase
        .firestore()
        .collection("access_requests")
        .doc();

      let uploadedFileUrl = "";
      if (file) {
        uploadedFileUrl = await uploadFile(docRef.id);
      }

      const payload = {
        data: {
          requesterName: form.requesterName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          identityNumber: form.identityNumber,
          identificationDetails: form.identificationDetails,
          disability: form.disability,
          infoName: form.infoName,
          infoHolder: form.infoHolder,
          infoContent: form.infoContent,
          notificationPreference: form.notificationPreference,
          otherDetails: form.otherDetails,
          recordOptions: form.recordOptions,
        },
        recordType: form.recordType,
        requiredForm: form.requiredForm,
        formType: "RequestForAccess",
        status: "pending",
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        user: user ? user.uid : null,
      };

      if (uploadedFileUrl) {
        payload.uploadedFileUrl = uploadedFileUrl;
      }

      await docRef.set(payload);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting access request:", err);
      setError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Container
        fluid
        style={{
          backgroundColor: bg,
          color: fg,
          minHeight: "100vh",
          paddingTop: "80px",
          paddingBottom: "80px",
          paddingLeft: "16px",
          paddingRight: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(34,197,94,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <i
            className="bi bi-check-lg"
            style={{ fontSize: "36px", color: "#22c55e" }}
          />
        </div>
        <h5 style={{ fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>
          Request Submitted
        </h5>
        <p
          style={{
            fontSize: "14px",
            color: secondaryText,
            textAlign: "center",
            maxWidth: "300px",
            marginBottom: "24px",
          }}
        >
          Your request for access to information has been submitted. You will be
          notified of the outcome.
        </p>
        <button
          onClick={() => navigate("/resources")}
          style={{
            padding: "14px 32px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#f76f25",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Back to Resources
        </button>
      </Container>
    );
  }

  return (
    <Container
      fluid
      style={{
        backgroundColor: bg,
        color: fg,
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "160px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/resources")}
          style={{
            background: "none",
            border: "none",
            color: fg,
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <i className="bi bi-arrow-left" />
        </button>
        <h5
          style={{
            fontWeight: 700,
            color: "#f76f25",
            fontSize: "16px",
            margin: 0,
          }}
        >
          Request Access to Information
        </h5>
      </div>

      {/* Progress indicator */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              backgroundColor: s <= step ? "#f76f25" : cardBg,
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>

      {/* Step labels */}
      <p
        style={{
          fontSize: "12px",
          color: secondaryText,
          marginBottom: "20px",
          fontWeight: 500,
        }}
      >
        Step {step} of 3 &mdash;{" "}
        {step === 1
          ? "Personal Details"
          : step === 2
          ? "Information Requested"
          : "Record & Upload"}
      </p>

      {error && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            backgroundColor: isDark
              ? "rgba(239,68,68,0.15)"
              : "rgba(239,68,68,0.1)",
            color: "#ef4444",
            fontSize: "13px",
            fontWeight: 500,
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="bi bi-exclamation-circle" />
          {error}
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {step === 1 && (
        <div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Full Name *</label>
            <input
              style={inputStyle}
              placeholder="Enter your full name"
              value={form.requesterName}
              onChange={(e) => updateField("requesterName", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Email Address *</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Phone Number *</label>
            <input
              style={inputStyle}
              type="tel"
              placeholder="e.g. 0974755027"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Address</label>
            <input
              style={inputStyle}
              placeholder="Enter your address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>NRC / Passport Number</label>
            <input
              style={inputStyle}
              placeholder="e.g. 412706/10/1"
              value={form.identityNumber}
              onChange={(e) => updateField("identityNumber", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Identification Details</label>
            <input
              style={inputStyle}
              placeholder="Additional ID details"
              value={form.identificationDetails}
              onChange={(e) =>
                updateField("identificationDetails", e.target.value)
              }
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Disability (if any)</label>
            <input
              style={inputStyle}
              placeholder="e.g. none"
              value={form.disability}
              onChange={(e) => updateField("disability", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Information Requested */}
      {step === 2 && (
        <div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Information Name *</label>
            <input
              style={inputStyle}
              placeholder="What information are you requesting?"
              value={form.infoName}
              onChange={(e) => updateField("infoName", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Information Holder *</label>
            <select
              style={inputStyle}
              value={form.infoHolder}
              onChange={(e) => updateField("infoHolder", e.target.value)}
            >
              <option value="">Select ministry or institution</option>
              {ministries.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Description of Information *</label>
            <textarea
              style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              placeholder="Describe the information you need access to..."
              value={form.infoContent}
              onChange={(e) => updateField("infoContent", e.target.value)}
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Notification Preference</label>
            <input
              style={inputStyle}
              placeholder="Email or phone to receive updates"
              value={form.notificationPreference}
              onChange={(e) =>
                updateField("notificationPreference", e.target.value)
              }
            />
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Other Details</label>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              placeholder="Any additional details..."
              value={form.otherDetails}
              onChange={(e) => updateField("otherDetails", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* STEP 3: Record options & upload */}
      {step === 3 && (
        <div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Record Type</label>
            <select
              style={inputStyle}
              value={form.recordType}
              onChange={(e) => updateField("recordType", e.target.value)}
            >
              <option value="written">Written</option>
              <option value="visual">Visual</option>
              <option value="audio">Audio</option>
              <option value="electronic">Electronic</option>
            </select>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Form Required</label>
            <select
              style={inputStyle}
              value={form.requiredForm}
              onChange={(e) => updateField("requiredForm", e.target.value)}
            >
              <option value="">Select form</option>
              <option value="form 1">Form 1 - Request for Access</option>
              <option value="form 2">Form 2 - Request for Correction</option>
            </select>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>How would you like the record?</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              {[
                { key: "copy", label: "Copy of the record", icon: "bi-files" },
                {
                  key: "inspection",
                  label: "Inspection of the record",
                  icon: "bi-eye",
                },
                {
                  key: "transcription",
                  label: "Transcription of the record",
                  icon: "bi-journal-text",
                },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => updateRecordOption(opt.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "12px",
                    border: `1px solid ${
                      form.recordOptions[opt.key] ? "#f76f25" : borderColor
                    }`,
                    backgroundColor: form.recordOptions[opt.key]
                      ? isDark
                        ? "rgba(247,111,37,0.1)"
                        : "rgba(247,111,37,0.05)"
                      : inputBg,
                    color: fg,
                    fontSize: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <i
                    className={`bi ${opt.icon}`}
                    style={{
                      fontSize: "18px",
                      color: form.recordOptions[opt.key]
                        ? "#f76f25"
                        : secondaryText,
                    }}
                  />
                  <span style={{ flex: 1 }}>{opt.label}</span>
                  <i
                    className={`bi ${
                      form.recordOptions[opt.key]
                        ? "bi-check-circle-fill"
                        : "bi-circle"
                    }`}
                    style={{
                      fontSize: "18px",
                      color: form.recordOptions[opt.key]
                        ? "#f76f25"
                        : secondaryText,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={labelStyle}>Supporting Document (optional)</label>
            <p
              style={{
                fontSize: "12px",
                color: secondaryText,
                margin: "0 0 8px 0",
              }}
            >
              Upload any relevant supporting documents (max 10MB)
            </p>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "16px",
                borderRadius: "12px",
                border: `2px dashed ${borderColor}`,
                backgroundColor: inputBg,
                cursor: "pointer",
                fontSize: "14px",
                color: secondaryText,
              }}
            >
              <i className="bi bi-cloud-arrow-up" style={{ fontSize: "20px" }} />
              {file ? file.name : "Tap to select a file"}
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "12px",
                  cursor: "pointer",
                  marginTop: "6px",
                }}
              >
                Remove file
              </button>
            )}
            {uploading && (
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: cardBg,
                  overflow: "hidden",
                  marginTop: "8px",
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
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div
        style={{
          position: "fixed",
          bottom: "80px",
          left: 0,
          right: 0,
          padding: "16px",
          backgroundColor: bg,
          borderTop: `1px solid ${isDark ? "#222" : "#eee"}`,
          display: "flex",
          gap: "10px",
          maxWidth: "100%",
        }}
      >
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: cardBg,
              color: fg,
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2)
            }
            onClick={() => {
              setError("");
              setStep(step + 1);
            }}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "#f76f25",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor:
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
                  ? "not-allowed"
                  : "pointer",
              opacity:
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
                  ? 0.5
                  : 1,
            }}
          >
            Next
          </button>
        ) : (
          <button
            disabled={submitting || uploading}
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "#f76f25",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: submitting || uploading ? "wait" : "pointer",
              opacity: submitting || uploading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <>
                <i className="bi bi-send" />
                Submit Request
              </>
            )}
          </button>
        )}
      </div>
    </Container>
  );
};

export default AccessRequest;
