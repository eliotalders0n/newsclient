import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import useGetUser from "../hooks/useGetUser";
import firebase from "../../firebase";
import { useTheme } from "../template/themeContext";
import getTimeSincePostCreation from "../template/getTimeSincePostCreation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import DOMPurify from "dompurify";

import StoryHeader from "./story/StoryHeader";
import StoryActions from "./story/StoryActions";
import StoryComments from "./story/StoryComments";
import ShareSheet from "./story/ShareSheet";
import RelatedArticles from "./story/RelatedArticles";

function Story() {
  const location = useLocation();
  const { data } = location.state || {};
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const author = useGetUser(data.author).docs;
  const { theme } = useTheme();
  const [user, setUser] = useState({});
  const memoizedUser = useMemo(() => user, [user]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const inputRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isDark = theme === "dark";
  const bg = isDark ? "#111111" : "#ffffff";
  const fg = isDark ? "#ffffff" : "#111111";
  const secondaryText = isDark ? "#999999" : "#666666";
  const cardBg = isDark ? "#1a1a1a" : "#f5f5f5";

  const shareUrl = `https://zanis-pro.web.app/story/${data.id}`;
  const createdAt = getTimeSincePostCreation(data.createdAt.seconds);

  const imageData = data.imagesUrls.map((imageUrl) => ({
    src: imageUrl,
    alt: "",
  }));

  // Auth listener
  useEffect(() => {
    const authUnsubscribe = firebase
      .auth()
      .onAuthStateChanged((loggedInUser) => {
        if (loggedInUser) {
          setIsLoggedIn(true);
          const userDocRef = firebase
            .firestore()
            .collection("Users")
            .doc(loggedInUser.uid);
          const unsubscribe = userDocRef.onSnapshot((doc) => {
            setUser(doc.data());
          });
          return () => unsubscribe();
        } else {
          setIsLoggedIn(false);
          setUser({});
        }
      });
    return () => authUnsubscribe();
  }, []);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const commentsSnapshot = await firebase
          .firestore()
          .collection("Comments")
          .orderBy("timestamp", "asc")
          .where("article_id", "==", data.id)
          .get();
        const commentsData = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const authorsDetails = {};
        for (const comment of commentsData) {
          if (!authorsDetails[comment.authorId]) {
            const userDoc = await firebase
              .firestore()
              .collection("Users")
              .doc(comment.authorId)
              .get();
            authorsDetails[comment.authorId] = userDoc.data();
          }
          comment.authorDetails = authorsDetails[comment.authorId];
        }
        setComments(commentsData);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };
    loadComments();
  }, [data.id]);

  // Check like/dislike status
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const likeSnapshot = await firebase
          .firestore()
          .collection("Reactions")
          .where("article_id", "==", data.id)
          .where("liked", "==", true)
          .get();
        setLikesCount(likeSnapshot.size);

        const dislikeSnapshot = await firebase
          .firestore()
          .collection("Reactions")
          .where("article_id", "==", data.id)
          .where("liked", "==", false)
          .get();
        setDislikesCount(dislikeSnapshot.size);

        const currentUserLike = likeSnapshot.docs.find(
          (doc) => doc.data().user_id === firebase.auth().currentUser?.uid
        );
        setLiked(!!currentUserLike);

        const currentUserDislike = dislikeSnapshot.docs.find(
          (doc) => doc.data().user_id === firebase.auth().currentUser?.uid
        );
        setDisliked(!!currentUserDislike);
      } catch (error) {
        console.error("Error checking like/dislike status:", error);
      }
    };
    checkLikeStatus();
  }, [data.id]);

  // Fetch related articles
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection("Articles")
          .where("ministry", "==", data.ministry)
          .where("id", "!=", data.id)
          .where("video", "==", "false")
          .limit(5)
          .get();
        setRelatedArticles(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching related articles:", error);
      }
    };
    fetchRelatedArticles();
  }, [data.id, data.ministry, data.title]);

  const handleComment = async (event) => {
    event.preventDefault();
    try {
      if (newComment.trim() !== "") {
        await firebase.firestore().collection("Comments").add({
          article_id: data.id,
          authorId: firebase.auth().currentUser.uid,
          content: newComment,
          author: user.firstName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComments((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            article_id: data.id,
            authorId: firebase.auth().currentUser.uid,
            content: newComment,
            author: user.firstName,
            timestamp: new Date(),
          },
        ]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const reactionsRef = firebase.firestore().collection("Reactions");
      const reactionSnapshot = await reactionsRef
        .where("article_id", "==", data.id)
        .where("user_id", "==", firebase.auth().currentUser.uid)
        .get();

      if (!reactionSnapshot.empty) {
        const reactionDoc = reactionSnapshot.docs[0];
        if (reactionDoc.data().liked) return;
        await reactionsRef.doc(reactionDoc.id).update({ liked: true });
        setLiked(true);
        setDisliked(false);
        setLikesCount((prev) => prev + 1);
        setDislikesCount((prev) => prev - 1);
      } else {
        await reactionsRef.add({
          article_id: data.id,
          user_id: firebase.auth().currentUser.uid,
          liked: true,
        });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error liking article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    setLoading(true);
    try {
      const reactionsRef = firebase.firestore().collection("Reactions");
      const reactionSnapshot = await reactionsRef
        .where("article_id", "==", data.id)
        .where("user_id", "==", firebase.auth().currentUser.uid)
        .get();

      if (!reactionSnapshot.empty) {
        const reactionDoc = reactionSnapshot.docs[0];
        if (reactionDoc.data().liked === false) return;
        await reactionsRef.doc(reactionDoc.id).update({ liked: false });
        setDisliked(true);
        setLiked(false);
        setDislikesCount((prev) => prev + 1);
        setLikesCount((prev) => prev - 1);
      } else {
        await reactionsRef.add({
          article_id: data.id,
          user_id: firebase.auth().currentUser.uid,
          liked: false,
        });
        setDisliked(true);
        setDislikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error disliking article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: bg,
        color: fg,
        minHeight: "100vh",
        paddingBottom: isLoggedIn ? "80px" : "40px",
      }}
    >
      <StoryHeader
        author={author}
        bg={bg}
        fg={fg}
        cardBg={cardBg}
        secondaryText={secondaryText}
      />

      <div style={{ padding: "20px 16px" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "1.3",
            margin: "0 0 8px 0",
          }}
        >
          {data.title}
        </h1>

        {/* Timestamp */}
        <p
          style={{
            fontSize: "13px",
            color: secondaryText,
            margin: "0 0 20px 0",
          }}
        >
          {createdAt}
        </p>

        {/* Hero image */}
        {data.imagesUrls?.[0] && (
          <div
            onClick={() => setLightboxOpen(true)}
            style={{
              width: "100%",
              height: "280px",
              borderRadius: "16px",
              overflow: "hidden",
              marginBottom: "20px",
              cursor: "pointer",
            }}
          >
            <img
              src={data.imagesUrls[0]}
              alt={data.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={imageData}
        />

        {/* Article body */}
        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.7",
            marginBottom: "20px",
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                expanded ? data.content : data.content.slice(0, 300)
              ),
            }}
          />
          {data.content.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: "none",
                border: "none",
                color: "#f76f25",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                marginTop: "8px",
              }}
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>

        <StoryActions
          isLoggedIn={isLoggedIn}
          liked={liked}
          disliked={disliked}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          commentsCount={comments.length}
          loading={loading}
          onLike={handleLike}
          onDislike={handleDislike}
          onCommentFocus={() => inputRef.current?.focus()}
          onShare={() => setShowShare(true)}
          isDark={isDark}
          fg={fg}
          cardBg={cardBg}
          secondaryText={secondaryText}
        />

        <StoryComments
          comments={comments}
          isLoggedIn={isLoggedIn}
          newComment={newComment}
          onNewCommentChange={setNewComment}
          onSubmitComment={handleComment}
          inputRef={inputRef}
          fg={fg}
          bg={bg}
          cardBg={cardBg}
          secondaryText={secondaryText}
          isDark={isDark}
        />

        <RelatedArticles
          articles={relatedArticles}
          isDark={isDark}
          fg={fg}
          secondaryText={secondaryText}
        />
      </div>

      {showShare && (
        <ShareSheet
          shareUrl={shareUrl}
          onClose={() => setShowShare(false)}
          isDark={isDark}
          fg={fg}
          cardBg={cardBg}
          secondaryText={secondaryText}
        />
      )}
    </div>
  );
}

export default Story;
