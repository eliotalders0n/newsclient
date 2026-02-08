import React from "react";

const StoryComments = ({
  comments,
  isLoggedIn,
  newComment,
  onNewCommentChange,
  onSubmitComment,
  inputRef,
  fg,
  bg,
  cardBg,
  secondaryText,
  isDark,
}) => (
  <>
    {/* Section header */}
    <h5
      style={{
        fontWeight: 700,
        color: "#f76f25",
        marginBottom: "16px",
        fontSize: "16px",
      }}
    >
      Comments
    </h5>

    {/* Comments list */}
    {comments.length === 0 ? (
      <p
        style={{
          fontSize: "14px",
          color: secondaryText,
          marginBottom: "24px",
        }}
      >
        No comments yet.
      </p>
    ) : (
      <div style={{ marginBottom: "24px" }}>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "14px",
              alignItems: "flex-start",
            }}
          >
            {comment.authorDetails?.photoURL ? (
              <img
                src={comment.authorDetails.photoURL}
                alt=""
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: cardBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className="bi bi-person-fill"
                  style={{ fontSize: "14px", color: secondaryText }}
                />
              </div>
            )}
            <div
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: "14px",
                padding: "10px 14px",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  margin: "0 0 2px 0",
                  color: fg,
                }}
              >
                {comment.author || "Unknown user"}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  margin: 0,
                  color: fg,
                  lineHeight: "1.4",
                }}
              >
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Fixed bottom input */}
    {isLoggedIn && (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 16px",
          backgroundColor: bg,
          borderTop: `1px solid ${isDark ? "#2a2a2a" : "#eee"}`,
          zIndex: 100,
        }}
      >
        <form
          onSubmit={onSubmitComment}
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: cardBg,
              color: fg,
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: newComment.trim() ? "#f76f25" : cardBg,
              color: newComment.trim() ? "#fff" : secondaryText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: newComment.trim() ? "pointer" : "default",
              flexShrink: 0,
            }}
          >
            <i className="bi bi-send-fill" style={{ fontSize: "14px" }} />
          </button>
        </form>
      </div>
    )}
  </>
);

export default StoryComments;
