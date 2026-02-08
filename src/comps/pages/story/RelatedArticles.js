import React from "react";
import { Link } from "react-router-dom";

const RelatedArticles = ({ articles, isDark, fg, secondaryText }) => {
  if (articles.length === 0) return null;

  return (
    <>
      <h5
        style={{
          fontWeight: 700,
          color: "#f76f25",
          marginBottom: "16px",
          fontSize: "16px",
        }}
      >
        Related Articles
      </h5>
      <div>
        {articles.map((article, index) => (
          <Link
            key={article.id}
            to={"/story/" + article.id}
            state={{ data: article }}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "flex",
                gap: "14px",
                paddingBottom: "14px",
                marginBottom: "14px",
                borderBottom:
                  index < articles.length - 1
                    ? `1px solid ${isDark ? "#2a2a2a" : "#eee"}`
                    : "none",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h6
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    lineHeight: "1.4",
                    margin: "0 0 6px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: fg,
                  }}
                >
                  {article.title}
                </h6>
                <p
                  style={{
                    fontSize: "13px",
                    color: secondaryText,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {article.content?.replace(/<[^>]*>/g, "").slice(0, 100)}
                </p>
              </div>
              {article.imagesUrls?.[0] && (
                <div
                  style={{
                    flexShrink: 0,
                    width: "85px",
                    height: "85px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundImage: `url("${article.imagesUrls[0]}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default RelatedArticles;
