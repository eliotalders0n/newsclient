import React, { useRef, useState, useEffect } from "react";
import AudioProgressBar from "./audioProgressBar.js";

function formatDurationDisplay(duration) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  return [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":");
}

export default function AudioPlayer({
  currentSong,
  songCount,
  songIndex,
  onNext,
  onPrev,
}) {
  const audioRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [isPlaying, setIsPlaying] = useState(false);

  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currentProgress);

  useEffect(() => {
    audioRef.current?.pause();
    const timeout = setTimeout(() => {
      audioRef.current?.play();
    }, 500);
    return () => clearTimeout(timeout);
  }, [songIndex]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleBufferProgress = (e) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          setBuffered(audio.buffered.end(audio.buffered.length - 1 - i));
          break;
        }
      }
    }
  };

  const controlBtn = (icon, onClick, disabled, size = "24px") => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
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
      }}
    >
      <i className={`bi ${icon}`} />
    </button>
  );

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "20px",
        padding: "16px 20px",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {currentSong && (
        <audio
          ref={audioRef}
          preload="metadata"
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={onNext}
          onCanPlay={(e) => {
            e.currentTarget.volume = volume;
            setIsReady(true);
          }}
          onTimeUpdate={(e) => {
            setCurrentProgress(e.currentTarget.currentTime);
            handleBufferProgress(e);
          }}
          onProgress={handleBufferProgress}
          onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        >
          <source type="audio/mpeg" src={currentSong.src} />
        </audio>
      )}

      {/* Song info */}
      <p
        style={{
          margin: "0 0 2px 0",
          fontWeight: 700,
          fontSize: "14px",
          color: "#ffffff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {currentSong?.title ?? "Select a podcast"}
      </p>
      <p
        style={{
          margin: "0 0 10px 0",
          fontSize: "11px",
          color: "#888",
        }}
      >
        {currentSong?.createdAt
          ? new Date(
              currentSong.createdAt.seconds * 1000 +
                currentSong.createdAt.nanoseconds / 1000000
            ).toLocaleDateString()
          : ""}
      </p>

      {/* Progress bar */}
      <AudioProgressBar
        duration={duration}
        currentProgress={currentProgress}
        buffered={buffered}
        onChange={(e, value) => {
          if (!audioRef.current) return;
          audioRef.current.currentTime = value;
          setCurrentProgress(value);
        }}
      />

      {/* Time + Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "8px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#888" }}>
          {elapsedDisplay}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {controlBtn(
            "bi-skip-backward-fill",
            onPrev,
            songIndex === 0
          )}
          <button
            disabled={!isReady && !!currentSong}
            onClick={togglePlayPause}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          {controlBtn(
            "bi-skip-forward-fill",
            onNext,
            songIndex === songCount - 1
          )}
        </div>
        <span style={{ fontSize: "11px", color: "#888" }}>
          {durationDisplay}
        </span>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
