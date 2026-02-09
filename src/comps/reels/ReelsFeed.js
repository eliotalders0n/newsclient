import React, { useState, useEffect } from "react";
import "./reels.css";
import useGetReels from "../hooks/useGetReels";
import firebase from "../../firebase";
import ReelItem from "./ReelItem";
import ShareSheet from "./ShareSheet";

function ReelsFeed() {
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

export default ReelsFeed;
