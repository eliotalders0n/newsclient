import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import useGetPodcasts from "../hooks/useGetPodcasts";
import { useTheme } from "../template/themeContext";
import { usePlayer } from "../template/PlayerContext";
import AudioProgressBar from "../template/audioProgressBar";

function PodcastList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};
  const { audioData } = useGetPodcasts();
  const { theme } = useTheme();
  const player = usePlayer();
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  const filteredAudioData = audioData.filter(
    (song) => song.ministry === data?.id
  );

  useEffect(() => {
    if (filteredAudioData.length > 0 && player.playlist !== filteredAudioData) {
      player.setPlaylist(filteredAudioData);
    }
  }, [filteredAudioData.length]);

  const currentSong = player.currentSong;
  const currentIndex = player.currentIndex;

  const formatDate = (createdAt) => {
    if (!createdAt) return "";
    return new Date(
      createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
    ).toLocaleDateString();
  };

  const handleSelectSong = (index) => {
    player.selectSong(index);
    setShowFullPlayer(true);
  };

  // Full-Screen Player Overlay
  if (showFullPlayer && currentSong) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2000,
          backgroundColor: bg,
          color: fg,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setShowFullPlayer(false)}
            style={{
              background: "none",
              border: "none",
              color: fg,
              fontSize: "22px",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <i className="bi bi-chevron-down" />
          </button>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: secondaryText,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Now Playing
          </span>
          <div style={{ width: "30px" }} />
        </div>

        {/* Artwork area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 32px",
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: "min(260px, 60vw)",
              height: "min(260px, 60vw)",
              borderRadius: "24px",
              backgroundColor: cardBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "32px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <i
              className="bi bi-headphones"
              style={{ fontSize: "64px", color: "#2563eb", opacity: 0.6 }}
            />
          </div>

          {/* Song info */}
          <h4
            style={{
              fontWeight: 700,
              fontSize: "20px",
              textAlign: "center",
              margin: "0 0 6px 0",
              color: fg,
            }}
          >
            {currentSong.title}
          </h4>
          <p
            style={{
              fontSize: "13px",
              color: secondaryText,
              margin: 0,
              textAlign: "center",
            }}
          >
            {formatDate(currentSong.createdAt)}
          </p>
        </div>

        {/* Controls area */}
        <div
          style={{
            flexShrink: 0,
            padding: "0 28px 48px 28px",
          }}
        >
          {/* Progress bar */}
          <AudioProgressBar
            duration={player.duration}
            currentProgress={player.progress}
            buffered={0}
            onChange={(e, value) => player.seek(value)}
          />

          {/* Time labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "11px", color: secondaryText }}>
              {player.elapsedDisplay}
            </span>
            <span style={{ fontSize: "11px", color: secondaryText }}>
              {player.durationDisplay}
            </span>
          </div>

          {/* Playback controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
            }}
          >
            <button
              onClick={player.prev}
              disabled={currentIndex === 0}
              style={controlStyle(currentIndex === 0, "28px")}
            >
              <i className="bi bi-skip-backward-fill" />
            </button>
            <button
              onClick={player.togglePlayPause}
              disabled={!player.isReady && !!currentSong}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "28px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.4)",
              }}
            >
              <i
                className={`bi ${
                  !player.isReady && currentSong
                    ? "bi-arrow-repeat"
                    : player.isPlaying
                      ? "bi-pause-fill"
                      : "bi-play-fill"
                }`}
                style={
                  !player.isReady && currentSong
                    ? { animation: "spin 1s linear infinite" }
                    : {}
                }
              />
            </button>
            <button
              onClick={player.next}
              disabled={currentIndex === filteredAudioData.length - 1}
              style={controlStyle(
                currentIndex === filteredAudioData.length - 1,
                "28px"
              )}
            >
              <i className="bi bi-skip-forward-fill" />
            </button>
          </div>

          {/* Track indicator */}
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: secondaryText,
              marginTop: "16px",
            }}
          >
            {currentIndex + 1} of {filteredAudioData.length}
          </p>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Episode List View
  return (
    <Container
      fluid
      style={{
        backgroundColor: bg,
        color: fg,
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "100px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {/* Back + Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
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
        <h5 style={{ margin: 0, fontWeight: 700, fontSize: "18px" }}>
          {data?.name}
        </h5>
      </div>

      {/* Now playing banner — tap to reopen full player */}
      {currentSong && (
        <button
          onClick={() => setShowFullPlayer(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "12px 16px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          <i
            className={`bi ${player.isPlaying ? "bi-pause-circle-fill" : "bi-play-circle-fill"}`}
            style={{ fontSize: "24px", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: "13px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentSong.title}
            </p>
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: "11px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {player.elapsedDisplay} / {player.durationDisplay}
            </p>
          </div>
          <i
            className="bi bi-chevron-up"
            style={{ fontSize: "16px", flexShrink: 0 }}
          />
        </button>
      )}

      {/* Episode List */}
      {filteredAudioData.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "60px" }}>
          <h3 style={{ fontWeight: 700 }}>No podcasts yet</h3>
          <p style={{ color: secondaryText }}>
            Check back later for new episodes
          </p>
        </div>
      ) : (
        <>
          <h6
            style={{
              fontWeight: 700,
              color: "#f76f25",
              marginBottom: "12px",
              fontSize: "14px",
            }}
          >
            Episodes
          </h6>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredAudioData.map((song, index) => {
              const isActive = currentIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectSong(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: "14px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: isActive ? "rgba(37,99,235,0.15)" : cardBg,
                    color: isActive ? "#2563eb" : fg,
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    width: "100%",
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isActive ? "#2563eb" : secondaryText,
                      flexShrink: 0,
                      textAlign: "center",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {song.title}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "11px",
                        color: isActive ? "rgba(37,99,235,0.6)" : secondaryText,
                      }}
                    >
                      {formatDate(song.createdAt)}
                    </p>
                  </div>
                  <i
                    className={`bi ${isActive ? "bi-soundwave" : "bi-play-circle-fill"}`}
                    style={{
                      fontSize: "24px",
                      flexShrink: 0,
                      color: "#2563eb",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </Container>
  );
}

const controlStyle = (disabled, size = "22px") => ({
  background: "none",
  border: "none",
  color: disabled ? "#555" : "#ffffff",
  fontSize: size,
  cursor: disabled ? "default" : "pointer",
  padding: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: disabled ? 0.4 : 1,
});

export default PodcastList;
