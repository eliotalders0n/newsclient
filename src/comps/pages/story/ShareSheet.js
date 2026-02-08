import React, { useState } from "react";

const ShareSheet = ({ shareUrl, onClose, isDark, fg, cardBg, secondaryText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const shareOptions = [
    {
      icon: "bi-whatsapp",
      label: "WhatsApp",
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    },
    {
      icon: "bi-facebook",
      label: "Facebook",
      color: "#1877F2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      icon: "bi-twitter",
      label: "Twitter",
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      icon: "bi-telegram",
      label: "Telegram",
      color: "#0088CC",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        backgroundColor: "rgba(0,0,0,0.5)",
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
        <div
          style={{
            width: "36px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: isDark
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.15)",
            margin: "0 auto 20px auto",
          }}
        />

        <p
          style={{
            color: fg,
            fontWeight: 700,
            fontSize: "16px",
            margin: "0 0 20px 0",
            textAlign: "center",
          }}
        >
          Share
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {shareOptions.map((opt) => (
            <a
              key={opt.label}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "6px",
                }}
              >
                <i
                  className={`bi ${opt.icon}`}
                  style={{ fontSize: "22px", color: opt.color }}
                />
              </div>
              <span style={{ color: secondaryText, fontSize: "11px" }}>
                {opt.label}
              </span>
            </a>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: cardBg,
            borderRadius: "12px",
            padding: "12px 14px",
          }}
        >
          <i
            className="bi bi-link-45deg"
            style={{ color: secondaryText, fontSize: "16px", flexShrink: 0 }}
          />
          <span
            style={{
              flex: 1,
              color: secondaryText,
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            style={{
              background: "none",
              border: "none",
              color: copied ? "#4ade80" : "#f76f25",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSheet;
