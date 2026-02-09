import React from "react";

const ReelOverlay = ({ author, title, ministry }) => (
  <>
    {/* Top gradient */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
        pointerEvents: "none",
      }}
    />

    {/* Bottom gradient */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "300px",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
        pointerEvents: "none",
      }}
    />

    {/* Bottom info */}
    <div
      style={{
        position: "absolute",
        bottom: "100px",
        left: "16px",
        right: "70px",
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      {/* Author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        {author?.photoURL ? (
          <img
            src={author.photoURL}
            alt=""
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="bi bi-person-fill"
              style={{ color: "#fff", fontSize: "16px" }}
            />
          </div>
        )}
        <span
          style={{
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          {author?.firstName} {author?.lastName}
        </span>
      </div>

      {/* Title */}
      <p
        style={{
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          margin: "0 0 8px 0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: "1.4",
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        {title}
      </p>

      {/* Ministry badge */}
      {ministry && (
        <span
          style={{
            display: "inline-block",
            padding: "4px 10px",
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 500,
            backdropFilter: "blur(10px)",
          }}
        >
          {ministry}
        </span>
      )}
    </div>
  </>
);

export default ReelOverlay;
