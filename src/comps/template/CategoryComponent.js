import React from "react";
import { useTheme } from "../template/themeContext";
import { Link } from "react-router-dom";
import useGetMinistries from "../hooks/useGetMinistries";


const CategoryComponent = () => {
  const { docs: ministries } = useGetMinistries();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";

  return (
    <div>
      <h5
        style={{
          fontWeight: 700,
          color: "#f76f25",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      >
        Browse by Ministry
      </h5>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {ministries.map((ministry) => (
          <Link
            key={ministry.id}
            to={"/podcastList/" + ministry.id}
            state={{ data: ministry }}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: cardBg,
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: isDark
                    ? "rgba(247,111,37,0.15)"
                    : "rgba(247,111,37,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className="bi bi-headphones"
                  style={{ fontSize: "20px", color: "#f76f25" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    fontSize: "15px",
                    color: fg,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {ministry.name}
                </p>
                <p
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "12px",
                    color: secondaryText,
                  }}
                >
                  Podcasts
                </p>
              </div>
              <i
                className="bi bi-chevron-right"
                style={{
                  fontSize: "16px",
                  color: secondaryText,
                  flexShrink: 0,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryComponent;
