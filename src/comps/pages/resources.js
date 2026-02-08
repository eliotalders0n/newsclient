import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useGetResources from "../hooks/useGetResources";
import { useTheme } from "../template/themeContext";
import firebase from "../../firebase";

const Resources = () => {
  const navigate = useNavigate();
  const { docs: documents } = useGetResources();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  const loading = documents.length === 0;

  const formatDate = (createdAt) => {
    if (!createdAt) return "";
    return new Date(
      createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
    ).toLocaleDateString();
  };

  // Extract storage path from a Firebase Storage URL
  const getStoragePath = (url) => {
    try {
      const match = url.match(/\/o\/(.+?)(\?|$)/);
      if (match) return decodeURIComponent(match[1]);
    } catch {}
    return null;
  };

  const handleOpenDocument = async (doc) => {
    setOpening(true);
    setOpenError(null);
    try {
      // Try extracting path and getting a fresh download URL
      const path = getStoragePath(doc.url);
      if (path) {
        const freshUrl = await firebase.storage().ref(path).getDownloadURL();
        window.open(freshUrl, "_blank", "noopener,noreferrer");
      } else {
        // Fallback: try the stored URL directly
        window.open(doc.url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Download error:", err);
      if (err.code === "storage/unauthorized" || err.code === "storage/unauthenticated") {
        setOpenError("Sign in to access this document.");
      } else {
        setOpenError("Unable to open document. Please try again.");
      }
    } finally {
      setOpening(false);
    }
  };

  const getFileIcon = (type) => {
    if (!type) return "bi-file-earmark";
    const t = type.toLowerCase();
    if (t.includes("pdf")) return "bi-file-earmark-pdf-fill";
    if (t.includes("word") || t.includes("doc")) return "bi-file-earmark-word-fill";
    if (t.includes("excel") || t.includes("sheet") || t.includes("xls"))
      return "bi-file-earmark-excel-fill";
    if (t.includes("image") || t.includes("png") || t.includes("jpg"))
      return "bi-file-earmark-image-fill";
    return "bi-file-earmark-fill";
  };

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
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
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
          Resources
        </h5>
        <button
          onClick={() => navigate("/access-request")}
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#f76f25",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <i className="bi bi-pencil-square" />
          Request Access
        </button>
      </div>

      {loading ? (
        <div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "16px",
                alignItems: "center",
              }}
            >
              <Skeleton
                variant="rounded"
                sx={{
                  bgcolor: isDark ? "#333" : "#ddd",
                  borderRadius: "12px",
                  flexShrink: 0,
                }}
                width={48}
                height={48}
              />
              <div style={{ flex: 1 }}>
                <Skeleton
                  sx={{ bgcolor: isDark ? "#333" : "#ddd" }}
                  width="80%"
                  height={20}
                />
                <Skeleton
                  sx={{ bgcolor: isDark ? "#333" : "#ddd", mt: 1 }}
                  width="50%"
                  height={16}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {documents.map((resource, index) => (
            <div
              key={resource.id}
              onClick={() => { setOpenError(null); setSelectedDocument(resource); }}
              style={{
                display: "flex",
                gap: "14px",
                paddingBottom: "14px",
                marginBottom: "14px",
                borderBottom:
                  index < documents.length - 1
                    ? `1px solid ${isDark ? "#2a2a2a" : "#eee"}`
                    : "none",
                alignItems: "flex-start",
                cursor: "pointer",
              }}
            >
              {/* File icon */}
              <div
                style={{
                  flexShrink: 0,
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: cardBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className={`bi ${getFileIcon(resource.type)}`}
                  style={{ fontSize: "20px", color: "#f76f25" }}
                />
              </div>

              {/* Text content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h6
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "1.4",
                    margin: "0 0 4px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: fg,
                  }}
                >
                  {resource.name}
                </h6>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  {resource.ministry && (
                    <span style={{ fontSize: "12px", color: secondaryText }}>
                      {resource.ministry}
                    </span>
                  )}
                  {resource.ministry && resource.type && (
                    <span style={{ color: secondaryText, fontSize: "12px" }}>
                      &middot;
                    </span>
                  )}
                  {resource.type && (
                    <span style={{ fontSize: "12px", color: secondaryText }}>
                      {resource.type}
                    </span>
                  )}
                  {resource.createdAt && (
                    <>
                      <span style={{ color: secondaryText, fontSize: "12px" }}>
                        &middot;
                      </span>
                      <span style={{ fontSize: "12px", color: secondaryText }}>
                        {formatDate(resource.createdAt)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Chevron */}
              <i
                className="bi bi-chevron-right"
                style={{
                  fontSize: "14px",
                  color: secondaryText,
                  flexShrink: 0,
                  marginTop: "4px",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Document action sheet */}
      {selectedDocument && (
        <div
          onClick={() => setSelectedDocument(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
              borderRadius: "20px 20px 0 0",
              padding: "16px 20px 32px 20px",
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: "36px",
                height: "4px",
                borderRadius: "2px",
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.15)",
                margin: "0 auto 16px auto",
              }}
            />

            {/* Document info */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: cardBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className={`bi ${getFileIcon(selectedDocument.type)}`}
                  style={{ fontSize: "20px", color: "#f76f25" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h6
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    margin: "0 0 4px 0",
                    color: fg,
                    lineHeight: "1.3",
                  }}
                >
                  {selectedDocument.name}
                </h6>
                <p
                  style={{
                    fontSize: "12px",
                    color: secondaryText,
                    margin: 0,
                  }}
                >
                  {[selectedDocument.ministry, selectedDocument.type]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>

            {/* Error message */}
            {openError && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="bi bi-exclamation-circle" />
                {openError}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                disabled={opening}
                onClick={() => handleOpenDocument(selectedDocument)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  backgroundColor: "#f76f25",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: opening ? "wait" : "pointer",
                  opacity: opening ? 0.7 : 1,
                }}
              >
                {opening ? (
                  <>Opening...</>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-up-right" style={{ fontSize: "16px" }} />
                    Open Document
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedDocument(null)}
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
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Resources;
