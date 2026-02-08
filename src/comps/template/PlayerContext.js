import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds - min * 60);
  return [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":");
}

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [playlist, setPlaylistState] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);

  const currentSong = currentIndex >= 0 ? playlist[currentIndex] || null : null;

  const setPlaylist = useCallback((songs, startIndex = -1) => {
    setPlaylistState(songs);
    setCurrentIndex(startIndex);
    setIsReady(false);
    setProgress(0);
    setDuration(0);
    setShowMiniPlayer(true);
  }, []);

  const selectSong = useCallback((index) => {
    setCurrentIndex(index);
    setIsReady(false);
    setProgress(0);
    setDuration(0);
    setShowMiniPlayer(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [isPlaying]);

  const next = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      selectSong(currentIndex + 1);
    }
  }, [currentIndex, playlist.length, selectSong]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      selectSong(currentIndex - 1);
    }
  }, [currentIndex, selectSong]);

  const seek = useCallback((time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlaylistState([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setIsReady(false);
    setProgress(0);
    setDuration(0);
  }, []);

  // Auto-play when song changes
  useEffect(() => {
    if (!audioRef.current || currentIndex < 0) return;
    audioRef.current.pause();
    setIsReady(false);
    const timeout = setTimeout(() => {
      audioRef.current?.play();
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const elapsedDisplay = formatTime(progress);
  const durationDisplay = formatTime(duration);
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        currentIndex,
        playlist,
        isPlaying,
        isReady,
        duration,
        progress,
        elapsedDisplay,
        durationDisplay,
        progressPercent,
        showMiniPlayer,
        setShowMiniPlayer,
        setPlaylist,
        selectSong,
        togglePlayPause,
        next,
        prev,
        seek,
        stop,
      }}
    >
      {/* Persistent audio element */}
      {currentSong && (
        <audio
          ref={audioRef}
          preload="metadata"
          src={currentSong.src}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={next}
          onCanPlay={(e) => {
            e.currentTarget.volume = volume;
            setIsReady(true);
          }}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
          onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        />
      )}
      {children}
    </PlayerContext.Provider>
  );
};
