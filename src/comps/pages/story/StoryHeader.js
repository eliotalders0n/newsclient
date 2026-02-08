import { Link } from "react-router-dom";

const StoryHeader = ({ author, bg, fg, cardBg, secondaryText }) => (
  <div
    style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      backgroundColor: bg,
      borderBottom: `1px solid ${bg === "#111111" ? "#2a2a2a" : "#eee"}`,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }}
  >
    <Link
      to="/"
      style={{
        color: fg,
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
      }}
    >
      <i className="bi bi-chevron-left" style={{ fontSize: "20px" }} />
    </Link>
    {author?.photoURL ? (
      <img
        src={author.photoURL}
        alt=""
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: cardBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className="bi bi-person-fill"
          style={{ fontSize: "14px", color: secondaryText }}
        />
      </div>
    )}
    <span
      style={{
        fontSize: "14px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {author?.firstName || "User"} {author?.lastName || ""}
    </span>
  </div>
);

export default StoryHeader;
