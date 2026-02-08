import React, { useState, useEffect, useRef, useCallback } from "react";
import "./reels.css";
import useGetReels from "../hooks/useGetReels";
import firebase from "../../firebase";

function ReelCard() {
  const { docs: reels } = useGetReels();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});
  const [shareReelId, setShareReelId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection("Users")
      .onSnapshot((snapshot) => {
        const data = {};
        snapshot.docs.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setAuthors(data);
        setLoading(false);
      });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <i
            className="bi bi-play-btn"
            style={{ fontSize: "48px", color: "#fff", opacity: 0.3 }}
          />
          <p style={{ marginTop: "12px", color: "#888", fontSize: "14px" }}>
            Loading reels...
          </p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className="bi bi-camera-reels"
          style={{ fontSize: "48px", color: "#fff", opacity: 0.3 }}
        />
        <h3 style={{ fontWeight: 700, marginTop: "16px", color: "#fff" }}>
          No reels yet
        </h3>
        <p style={{ color: "#888", fontSize: "14px" }}>
          Check back later for new videos
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="reels-feed">
        {reels.map((reel, index) => (
          <ReelItem
            key={reel.id}
            reel={reel}
            author={authors[reel.author]}
            index={index}
            total={reels.length}
            isActive={index === activeIndex}
            onShare={() => setShareReelId(reel.id)}
            onBecomeActive={setActiveIndex}
          />
        ))}
      </div>

      {shareReelId && (
        <ShareSheet
          reelId={shareReelId}
          onClose={() => setShareReelId(null)}
        />
      )}
    </>
  );
}

const ReelItem = ({
  reel,
  author,
  index,
  total,
  isActive,
  onShare,
  onBecomeActive,
}) => {
  const videoRef = useRef(null);
  const itemRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [progress, setProgress] = useState(0);
  const hideTimeout = useRef(null);
  const playTimeout = useRef(null);
  const indexRef = useRef(index);
  const onBecomeActiveRef = useRef(onBecomeActive);
  onBecomeActiveRef.current = onBecomeActive;

  // Resolve video src — handle both string and array
  const videoSrc = Array.isArray(reel.imagesUrls)
    ? reel.imagesUrls[0]
    : reel.imagesUrls;

  // Callback ref — also aborts downloads when the old video unmounts
  const setVideoElement = useCallback((el) => {
    // When React unmounts the <video> (el=null), videoRef.current is the OLD
    // element. Force the browser to abort its in-flight range requests.
    if (videoRef.current && videoRef.current !== el) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
    videoRef.current = el;
    if (el) {
      el.muted = true;
    }
  }, []);

  // IntersectionObserver: detect when this reel scrolls into view
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onBecomeActiveRef.current(indexRef.current);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-play when this reel becomes active
  useEffect(() => {
    if (!isActive) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    playTimeout.current = setTimeout(() => {
      video.play().catch(() => {});
    }, 100);

    return () => {
      if (playTimeout.current) clearTimeout(playTimeout.current);
    };
  }, [isActive]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = isMuted;
      video.play().catch(() => {});
      setShowPauseIcon(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      hideTimeout.current = setTimeout(() => setShowPauseIcon(false), 600);
    } else {
      video.pause();
      setShowPauseIcon(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    }
  }, [isMuted]);

  const toggleMute = useCallback(
    (e) => {
      e.stopPropagation();
      if (videoRef.current) {
        const newMuted = !isMuted;
        videoRef.current.muted = newMuted;
        setIsMuted(newMuted);
      }
    },
    [isMuted]
  );

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <div ref={itemRef} className="reel-item" onClick={togglePlay}>
      {/* Only mount <video> for the active reel — 1 video at a time */}
      {isActive ? (
        <video
          ref={setVideoElement}
          src={videoSrc}
          loop
          playsInline
          webkit-playsinline=""
          preload="auto"
          onPlay={() => {
            setIsPlaying(true);
            setIsBuffering(false);
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
            hideTimeout.current = setTimeout(
              () => setShowPauseIcon(false),
              400
            );
          }}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => setIsBuffering(true)}
          onCanPlay={() => setIsBuffering(false)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: "#000",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className="bi bi-play-btn-fill"
            style={{ fontSize: "40px", color: "rgba(255,255,255,0.15)" }}
          />
        </div>
      )}

      {/* Buffering spinner */}
      {isActive && isBuffering && (
        <div className="reel-buffering-indicator">
          <div className="reel-spinner" />
        </div>
      )}

      {/* Play icon — persistent when paused, brief flash on resume */}
      {isActive && !isBuffering && (showPauseIcon || !isPlaying) && (
        <div className={`reel-play-indicator ${isPlaying ? "hiding" : ""}`}>
          <i className="bi bi-play-fill" />
        </div>
      )}

      {/* Top gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100px",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
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

      {/* Bottom info overlay */}
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
          {reel.title}
        </p>

        {/* Ministry badge */}
        {reel.ministry && (
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
            {reel.ministry}
          </span>
        )}
      </div>

      {/* Right action bar */}
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          right: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          zIndex: 5,
        }}
      >
        <ActionButton
          icon={isMuted ? "bi-volume-mute-fill" : "bi-volume-up-fill"}
          onClick={toggleMute}
        />
        <ActionButton
          icon="bi-share-fill"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {index + 1}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: "82px",
          left: "16px",
          right: "16px",
          height: "2px",
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: "1px",
          zIndex: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "#fff",
            borderRadius: "1px",
            transition: "width 0.3s linear",
          }}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ icon, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      border: "none",
      backgroundColor: "rgba(255,255,255,0.15)",
      color: "#fff",
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backdropFilter: "blur(10px)",
      flexDirection: "column",
      gap: "2px",
    }}
  >
    <i className={`bi ${icon}`} />
    {label && (
      <span style={{ fontSize: "10px", fontWeight: 600 }}>{label}</span>
    )}
  </button>
);

const ShareSheet = ({ reelId, onClose }) => {
  const shareUrl = `https://zanis-pro.web.app/reels/${reelId}`;
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
      className="share-backdrop"
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
        className="share-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1a1a1a",
          borderRadius: "20px 20px 0 0",
          padding: "16px 20px 32px 20px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: "rgba(255,255,255,0.2)",
            margin: "0 auto 20px auto",
          }}
        />

        <p
          style={{
            color: "#fff",
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
                  backgroundColor: "rgba(255,255,255,0.1)",
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
              <span style={{ color: "#888", fontSize: "11px" }}>
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
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "12px 14px",
          }}
        >
          <i
            className="bi bi-link-45deg"
            style={{ color: "#888", fontSize: "16px", flexShrink: 0 }}
          />
          <span
            style={{
              flex: 1,
              color: "#888",
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
              color: copied ? "#4ade80" : "#2563eb",
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

export default ReelCard;
