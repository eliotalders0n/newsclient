import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Container } from "react-bootstrap";
import { Skeleton } from "@mui/material";
import firebase from "../../firebase";
import { useTheme } from "../template/themeContext";
import useGetMinistries from "../hooks/useGetMinistries";
import getTimeSincePostCreation from "../template/getTimeSincePostCreation";

function Landing() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMinistry, setActiveMinistry] = useState("all");
  const { theme } = useTheme();
  const { docs: ministries } = useGetMinistries();

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesSnapshot = await firebase
          .firestore()
          .collection("Articles")
          .where("status", "==", "approved")
          .where("video", "==", false)
          .orderBy("createdAt", "desc")
          .get();

        const articlesData = articlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
        setFilteredArticles(articlesData);

        const authorsSnapshot = await firebase
          .firestore()
          .collection("Users")
          .get();

        const authorsData = {};
        authorsSnapshot.docs.forEach((doc) => {
          authorsData[doc.id] = doc.data();
        });
        setAuthors(authorsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = articles;
    if (activeMinistry !== "all") {
      filtered = filtered.filter((a) => a.ministry === activeMinistry);
    }
    if (searchTerm) {
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredArticles(filtered);
  }, [articles, searchTerm, activeMinistry]);

  const handleMinistryFilter = (ministryId) => {
    setActiveMinistry(ministryId);
  };

  const getMinistryName = (ministryId) => {
    return ministries.find((m) => m.id === ministryId)?.name || "";
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return "";
    return getTimeSincePostCreation(createdAt.seconds);
  };

  const heroArticle = filteredArticles[0];
  const listArticles = filteredArticles.slice(1);

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
      {/* Search Bar */}
      <div
        style={{
          position: "relative",
          marginBottom: "20px",
        }}
      >
        <i
          className="bi bi-search"
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: secondaryText,
            fontSize: "14px",
            zIndex: 1,
          }}
        />
        <input
          type="text"
          placeholder="Search for news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 40px 12px 38px",
            borderRadius: "25px",
            border: "none",
            backgroundColor: cardBg,
            color: fg,
            fontSize: "14px",
            outline: "none",
          }}
        />
        {searchTerm && (
          <i
            className="bi bi-x-circle-fill"
            onClick={() => setSearchTerm("")}
            style={{
              position: "absolute",
              right: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: secondaryText,
              fontSize: "16px",
              cursor: "pointer",
            }}
          />
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div>
          <Skeleton
            variant="rounded"
            sx={{ bgcolor: isDark ? "#333" : "#ddd", borderRadius: "16px" }}
            width="100%"
            height={220}
          />
          <div style={{ marginTop: 20 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <Skeleton
                    sx={{ bgcolor: isDark ? "#333" : "#ddd" }}
                    width="80%"
                    height={20}
                  />
                  <Skeleton
                    sx={{ bgcolor: isDark ? "#333" : "#ddd", mt: 1 }}
                    width="60%"
                    height={16}
                  />
                </div>
                <Skeleton
                  variant="rounded"
                  sx={{
                    bgcolor: isDark ? "#333" : "#ddd",
                    borderRadius: "10px",
                  }}
                  width={80}
                  height={80}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Ministry Filter Pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              marginBottom: "24px",
              paddingBottom: "4px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
              .ministry-pills::-webkit-scrollbar { display: none; }
            `}</style>
            <div
              className="ministry-pills"
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                width: "100%",
              }}
            >
              <button
                onClick={() => handleMinistryFilter("all")}
                style={{
                  flexShrink: 0,
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  backgroundColor:
                    activeMinistry === "all"
                      ? isDark
                        ? "#ffffff"
                        : "#111111"
                      : cardBg,
                  color:
                    activeMinistry === "all"
                      ? isDark
                        ? "#111111"
                        : "#ffffff"
                      : fg,
                  transition: "all 0.2s ease",
                }}
              >
                All
              </button>
              {ministries.map((ministry) => (
                <button
                  key={ministry.id}
                  onClick={() => handleMinistryFilter(ministry.id)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    backgroundColor:
                      activeMinistry === ministry.id
                        ? isDark
                          ? "#ffffff"
                          : "#111111"
                        : cardBg,
                    color:
                      activeMinistry === ministry.id
                        ? isDark
                          ? "#111111"
                          : "#ffffff"
                        : fg,
                    transition: "all 0.2s ease",
                  }}
                >
                  {ministry.name}
                </button>
              ))}
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "40px" }}>
              <h3 style={{ fontWeight: 700 }}>No articles found</h3>
              <p style={{ color: secondaryText }}>
                Try a different search or ministry filter
              </p>
            </div>
          ) : (
            <>
              {/* Hero Card */}
          {heroArticle && (
            <Link
              to={"/story/" + heroArticle.id}
              state={{ data: heroArticle }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "250px",
                  marginBottom: "24px",
                  backgroundImage: `url("${heroArticle.imagesUrls?.[0] || ""}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)",
                  }}
                />
                {/* Ministry badge */}
                {/* <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 600,
                    zIndex: 1,
                  }}
                >
                  {getMinistryName(heroArticle.ministry)}
                </span> */}
                {/* Title */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    zIndex: 1,
                  }}
                >
                  <h4
                    style={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "18px",
                      lineHeight: "1.3",
                      margin: 0,
                    }}
                  >
                    {heroArticle.title}
                  </h4>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    {getTimeAgo(heroArticle.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Latest News Section */}
          <h5
            style={{
              fontWeight: 700,
              color: "#f76f25",
              marginBottom: "16px",
              fontSize: "16px",
            }}
          >
            Latest News
          </h5>

          {/* Article List */}
          <div>
            {listArticles.map((article, index) => (
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
                      index < listArticles.length - 1
                        ? `1px solid ${isDark ? "#2a2a2a" : "#eee"}`
                        : "none",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Text content */}
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: secondaryText,
                        }}
                      >
                        {getTimeAgo(article.createdAt)}
                      </span>
                      {getMinistryName(article.ministry) && (
                        <>
                          <span
                            style={{ color: secondaryText, fontSize: "12px" }}
                          >
                            &middot;
                          </span>
                          {/* <span
                            style={{
                              fontSize: "11px",
                              color: "#2563eb",
                              fontWeight: 600,
                            }}
                          >
                            {getMinistryName(article.ministry)}
                          </span> */}
                        </>
                      )}
                    </div>
                    {/* Author */}
                    {authors[article.author] && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px",
                        }}
                      >
                        <Image
                          src={
                            authors[article.author]?.photoURL ||
                            "assets/profile.png"
                          }
                          alt=""
                          style={{ width: "16px", height: "16px" }}
                          roundedCircle
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            color: secondaryText,
                          }}
                        >
                          {authors[article.author]?.firstName}{" "}
                          {authors[article.author]?.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Thumbnail */}
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
          )}
        </>
      )}
    </Container>
  );
}

export default Landing;
