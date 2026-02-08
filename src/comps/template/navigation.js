import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./themeContext";
import { usePlayer } from "./PlayerContext";

const navItems = [
  {
    path: "/home",
    icon: "bi-house-door",
    iconActive: "bi-house-door-fill",
    label: "Home",
  },
  {
    path: "/podcast",
    icon: "bi-headphones",
    iconActive: "bi-headphones",
    label: "Podcast",
  },
  {
    path: "/reels",
    icon: "bi-play-btn",
    iconActive: "bi-play-btn-fill",
    label: "Reels",
  },
  {
    path: "/resources",
    icon: "bi-grid",
    iconActive: "bi-grid-fill",
    label: "Resources",
  },
  {
    path: "/profile",
    icon: "bi-person",
    iconActive: "bi-person-fill",
    label: "Profile",
  },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const player = usePlayer();

  const active = location.pathname === "/" ? "/home" : location.pathname;
  const hasAudio = !!player.currentSong;
  const showPlayer = hasAudio && player.showMiniPlayer;

  const pillBg = isDark ? "#1a1a1a" : "#111111";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "16px",
        right: "16px",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          backgroundColor: pillBg,
          transition: "all 0.3s ease",
        }}
      >
        {/* Mini Player */}
        {showPlayer && <MiniPlayer player={player} />}

        {/* Nav Bar - show when no audio, or when mini-player is dismissed */}
        {!showPlayer && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "8px 10px",
            }}
          >
            {navItems.map((item) => {
              const isActive = active === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: isActive ? "10px 14px" : "10px 12px",
                    borderRadius: "30px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                    color: isActive ? "#111111" : "#888888",
                    fontSize: "18px",
                    transition: "all 0.25s ease",
                  }}
                >
                  <i
                    className={`bi ${isActive ? item.iconActive : item.icon}`}
                  />
                  {isActive && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Now Playing indicator */}
            {hasAudio && (
              <button
                onClick={() => player.setShowMiniPlayer(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontSize: "14px",
                  flexShrink: 0,
                  animation: "pulse-glow 2s ease-in-out infinite",
                }}
              >
                <i className="bi bi-music-note-beamed" />
              </button>
            )}
          </nav>
        )}
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(37, 99, 235, 0); }
        }
      `}</style>
    </div>
  );
};

const MiniPlayer = ({ player }) => {
  const {
    currentSong,
    isPlaying,
    isReady,
    togglePlayPause,
    elapsedDisplay,
    durationDisplay,
    progressPercent,
    setShowMiniPlayer,
  } = player;

  return (
    <div style={{ position: "relative" }}>
      {/* Progress bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "3px 3px 0 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressPercent}%`,
            backgroundColor: "#2563eb",
            transition: "width 0.3s linear",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 14px",
          paddingTop: "15px",
        }}
      >
        {/* Back/close — reveals nav */}
        <button
          onClick={() => setShowMiniPlayer(false)}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            fontSize: "16px",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <i className="bi bi-chevron-down" />
        </button>

        {/* Song title */}
        <p
          style={{
            margin: 0,
            flex: 1,
            fontWeight: 600,
            fontSize: "13px",
            color: "#ffffff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minWidth: 0,
          }}
        >
          {currentSong?.title || "No track"}
        </p>

        {/* Time */}
        <span
          style={{
            fontSize: "11px",
            color: "#888",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {elapsedDisplay} / {durationDisplay}
        </span>

        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          disabled={!isReady && !!currentSong}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <i
            className={`bi ${
              !isReady && currentSong
                ? "bi-arrow-repeat"
                : isPlaying
                  ? "bi-pause-fill"
                  : "bi-play-fill"
            }`}
            style={
              !isReady && currentSong
                ? { animation: "spin 1s linear infinite" }
                : {}
            }
          />
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Navigation;
