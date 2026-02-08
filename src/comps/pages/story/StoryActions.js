import React from "react";

const StoryActions = ({
  isLoggedIn,
  liked,
  disliked,
  likesCount,
  dislikesCount,
  commentsCount,
  loading,
  onLike,
  onDislike,
  onCommentFocus,
  onShare,
  isDark,
  fg,
  cardBg,
  secondaryText,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      paddingBottom: "16px",
      marginBottom: "24px",
      borderBottom: `1px solid ${isDark ? "#2a2a2a" : "#eee"}`,
    }}
  >
    {isLoggedIn ? (
      <>
        <button
          onClick={onLike}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: liked
              ? isDark
                ? "rgba(247,111,37,0.2)"
                : "rgba(247,111,37,0.1)"
              : cardBg,
            color: liked ? "#f76f25" : fg,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <i
            className={`bi ${liked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}`}
          />
          {likesCount > 0 && <span>{likesCount}</span>}
        </button>

        <button
          onClick={onDislike}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: disliked
              ? isDark
                ? "rgba(239,68,68,0.2)"
                : "rgba(239,68,68,0.1)"
              : cardBg,
            color: disliked ? "#ef4444" : fg,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <i
            className={`bi ${disliked ? "bi-hand-thumbs-down-fill" : "bi-hand-thumbs-down"}`}
          />
          {dislikesCount > 0 && <span>{dislikesCount}</span>}
        </button>

        <button
          onClick={onCommentFocus}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: cardBg,
            color: fg,
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <i className="bi bi-chat" />
          {commentsCount > 0 && <span>{commentsCount}</span>}
        </button>

        <button
          onClick={onShare}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: cardBg,
            color: fg,
            fontSize: "14px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <i className="bi bi-share" />
        </button>
      </>
    ) : (
      <p style={{ fontSize: "13px", color: secondaryText, margin: 0 }}>
        Sign in to like, comment and share.
      </p>
    )}
  </div>
);

export default StoryActions;
