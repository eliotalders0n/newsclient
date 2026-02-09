import React, { useState, useEffect, useRef, useCallback } from "react";
import ReelOverlay from "./ReelOverlay";
import ActionBar from "./ActionBar";
import ProgressBar from "./ProgressBar";

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
  const videoSrc = Array.isArray(reel.videosUrls)
    ? reel.videosUrls[0]
    : reel.videosUrls;

  // Callback ref — aborts downloads when the old video unmounts
  const setVideoElement = useCallback((el) => {
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

      <ReelOverlay
        author={author}
        title={reel.title}
        ministry={reel.ministry}
      />

      <ActionBar
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onShare={(e) => {
          e.stopPropagation();
          onShare();
        }}
        index={index}
        total={total}
      />

      <ProgressBar progress={progress} />
    </div>
  );
};

export default ReelItem;
