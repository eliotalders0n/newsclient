import React, { useCallback, useRef, useEffect } from "react";
import { getPreloadStrategy } from "./videoUtils";

/**
 * Optimised video element for a single reel.
 *
 * Uses the original video URL directly via the src attribute for maximum
 * compatibility. When server-side transcoding is set up and variant URLs
 * (e.g. _720p.mp4, _480p.webm) exist in Storage, switch to <source>
 * elements using buildVideoSources() from videoUtils.js.
 *
 * Current optimizations:
 * - Network-aware preload strategy (auto for active, metadata/none for others).
 * - Callback ref that aborts in-flight downloads when the element unmounts,
 *   preventing wasted bandwidth on off-screen reels.
 * - Only the active reel mounts a <video> element (one video at a time).
 */
const ReelVideo = ({
  videoUrl,
  isActive,
  isMuted,
  onPlay,
  onPause,
  onTimeUpdate,
  onWaiting,
  onCanPlay,
  videoRef,
}) => {
  const internalRef = useRef(null);
  const preload = getPreloadStrategy(isActive);

  // Callback ref — abort in-flight downloads when the old <video> unmounts
  const setVideoElement = useCallback(
    (el) => {
      if (internalRef.current && internalRef.current !== el) {
        internalRef.current.pause();
        internalRef.current.removeAttribute("src");
        internalRef.current.load();
      }
      internalRef.current = el;
      if (videoRef) videoRef.current = el;
      if (el) {
        el.muted = true;
      }
    },
    [videoRef]
  );

  // Sync muted state when isMuted prop changes
  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!isActive) {
    return (
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
    );
  }

  return (
    <video
      ref={setVideoElement}
      src={videoUrl}
      loop
      playsInline
      webkit-playsinline=""
      preload={preload}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onWaiting={onWaiting}
      onCanPlay={onCanPlay}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        backgroundColor: "#000",
      }}
    />
  );
};

export default ReelVideo;
