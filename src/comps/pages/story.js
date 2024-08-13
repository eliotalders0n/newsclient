import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Card,
  Stack,
  Image,
  Button,
  Form,
  InputGroup,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  TelegramShareButton,
} from "react-share";
import useGetUser from "../hooks/useGetUser";
import firebase from "../../firebase";
import { useTheme } from "../template/themeContext";
import getTimeSincePostCreation from "../template/getTimeSincePostCreation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  ArrowBackIosOutlined,
  ArrowRightAltRounded,
  Brightness1,
  ModeCommentOutlined,
  Outbound,
  ThumbDown,
  ThumbDownOffAlt,
  ThumbUpOffAlt,
} from "@mui/icons-material";
// import useFetchRelatedArticles from "../hooks/useFetchRelatedArticles";

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
  const inputRef = useRef(null);

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

  // console.log("user: " + user);
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
        await fetchAuthorsDetails(commentsData);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    const fetchAuthorsDetails = async (commentsData) => {
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
    };

    loadComments();
  }, [data.id]);

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
        setNewComment("");
        // Update comments state without fetching from Firestore again
        setComments((prevComments) => [
          ...prevComments,
          {
            id: Math.random().toString(36).substr(2, 9), // Generate temporary ID
            article_id: data.id,
            authorId: firebase.auth().currentUser.uid,
            content: newComment,
            author: user.firstName,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleFocusComment = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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

        // Check if the current user has already liked/disliked the article
        const currentUserLike = likeSnapshot.docs.find(
          (doc) => doc.data().user_id === firebase.auth().currentUser.uid
        );
        setLiked(!!currentUserLike);

        const currentUserDislike = dislikeSnapshot.docs.find(
          (doc) => doc.data().user_id === firebase.auth().currentUser.uid
        );
        setDisliked(!!currentUserDislike);
      } catch (error) {
        console.error("Error checking like/dislike status:", error);
      }
    };

    checkLikeStatus();
  }, [data.id]);

  const handleLike = async () => {
    setLoading(true); // Set loading to true
    try {
      const reactionsRef = firebase.firestore().collection("Reactions");
      const reactionSnapshot = await reactionsRef
        .where("article_id", "==", data.id)
        .where("user_id", "==", firebase.auth().currentUser.uid)
        .get();

      if (!reactionSnapshot.empty) {
        const reactionDoc = reactionSnapshot.docs[0];
        const currentReaction = reactionDoc.data();

        if (currentReaction.liked) {
          // Already liked, do nothing
          return;
        } else {
          // Previously disliked, update to liked
          await reactionsRef.doc(reactionDoc.id).update({ liked: true });
          setLiked(true);
          setDisliked(false);
          setLikesCount((prev) => prev + 1);
          setDislikesCount((prev) => prev - 1);
        }
      } else {
        // No reaction yet, add new like
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
      alert("Failed to like article. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleDislike = async () => {
    setLoading(true); // Set loading to true
    try {
      const reactionsRef = firebase.firestore().collection("Reactions");
      const reactionSnapshot = await reactionsRef
        .where("article_id", "==", data.id)
        .where("user_id", "==", firebase.auth().currentUser.uid)
        .get();

      if (!reactionSnapshot.empty) {
        const reactionDoc = reactionSnapshot.docs[0];
        const currentReaction = reactionDoc.data();

        if (currentReaction.liked === false) {
          // Already disliked, do nothing
          return;
        } else {
          // Previously liked, update to disliked
          await reactionsRef.doc(reactionDoc.id).update({ liked: false });
          setDisliked(true);
          setLiked(false);
          setDislikesCount((prev) => prev + 1);
          setLikesCount((prev) => prev - 1);
        }
      } else {
        // No reaction yet, add new dislike
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
      alert("Failed to dislike article. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const [showShare, setShowShare] = useState(false);

  const handleShareClose = () => setShowShare(false);
  const handleShareShow = () => setShowShare(true);

  const createdAt = getTimeSincePostCreation(data.createdAt.seconds);
  const [open, setOpen] = React.useState(false);

  const imageData = data.imagesUrls.map((imageUrl) => ({
    src: imageUrl,
    alt: "",
  }));

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const relatedArticlesQuery = firebase
          .firestore()
          .collection("Articles")
          .where("ministry", "==", data.ministry)
          .where("id", "!=", data.id)
          .where("video", "==", "false")
          .limit(5);

        const relatedArticlesSnapshot = await relatedArticlesQuery.get();
        const relatedArticles = relatedArticlesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRelatedArticles(relatedArticles);
      } catch (error) {
        console.error("Error fetching related articles:", error);
      }
    };

    fetchRelatedArticles();
  }, [data.id, data.ministry, data.title]);

  return (
    <div
      style={{
        backgroundColor: theme === "light" ? "white" : "#111111",
        color: theme === "light" ? "#111111" : "white",
        minHeight: "100vh",
        padding: "12vh 0",
        marginTop: "8vh",
      }}
    >
      <div>
        <Stack
          style={{
            backgroundColor: theme === "light" ? "white" : "#111111",
            color: theme === "light" ? "#111111" : "white",
            margin: "1vh 3vh",
          }}
        >
          <h2 className="display-5">{data.title}</h2>
          <Stack
            direction="horizontal"
            className="align-items-center" // Center items vertically
            style={{
              position: "fixed", // Fix the position to the top
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: "black", // Optional: background color for visibility
              padding: "3vh", // Optional: padding for spacing
              zIndex: 1000, // Ensure it appears above other content
              borderBottom: "1px solid #ddd",
              borderBottomColor: "grey", // Optional: border for separation
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            <Link
              to={"/"}
              style={{
                width: "3vh",
                height: "3vh",
                marginRight: "5vh",
                color: "white",
                marginLeft: "-10px",
                marginTop: "-7px",
                textAlign: "center",
              }}
            >
              <ArrowBackIosOutlined />
            </Link>
            <Image
              src={author.photoURL || "assets/profile.png"}
              alt=""
              style={{ width: "3vh", height: "3vh", marginRight: "10px" }}
              roundedCircle
            />
            {author?.firstName || "user"} {author?.lastName || ""}'s post
          </Stack>
          <Card.Text
            style={{
              backgroundColor: theme === "light" ? "white" : "#111111",
              color: theme === "light" ? "#111111" : "white",
              fontSize: "14px",
              margin: "1px 5px",
            }}
          >
            <span style={{ fontSize: "12px" }}>Posted </span>
            {createdAt}
          </Card.Text>
          <br />
          {/* <ImageGallery items={data.imagesUrls} /> */}
          <Stack
            style={{
              position: "relative",
              width: "100%",
              height: "45vh",
              borderRadius: "5%",
              overflow: "hidden",
              margin: "0",
            }}
          >
            <Image
              onClick={() => setOpen(true)}
              src={data.imagesUrls[0]}
              alt={data.ministry}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              rounded
            />
          </Stack>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={imageData}
          />
          <Card.Text
            style={{
              backgroundColor: theme === "light" ? "white" : "#111111",
              color: theme === "light" ? "#111111" : "white",
              fontSize: "16px",
              margin: "1px 5px",
            }}
          >
            <br />
            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html: expanded ? data.content : data.content.slice(0, 200),
                }}
              />
              {data.content.length > 200 && (
                <Button
                  size="sm"
                  style={{ marginLeft: "3vh" }}
                  variant="outline-primary"
                  onClick={handleClick}
                >
                  {expanded ? "Click to Collapse" : "Click to Expand"}
                </Button>
              )}
            </div>
          </Card.Text>
          <hr />
          {isLoggedIn ? (
            <div>
              <Stack direction="horizontal" gap={3}>
                <i className="bi bi-share" onClick={handleShareShow}></i>
                <Button
                  onClick={handleFocusComment}
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                  }}
                >
                  <ModeCommentOutlined fontSize="medium" />
                </Button>
                <Stack
                  direction="horizontal"
                  gap={3}
                  className="justify-content-center p-2 ms-auto"
                >
                  {liked ? (
                    <ThumbUpIcon onClick={handleLike} />
                  ) : (
                    <ThumbUpOffAlt onClick={handleLike} />
                  )}
                  <span>{loading && liked ? <Brightness1 /> : likesCount}</span>
                  {disliked ? (
                    <ThumbDown onClick={handleDislike} />
                  ) : (
                    <ThumbDownOffAlt onClick={handleDislike} />
                  )}
                  <span>
                    {loading && disliked ? <Brightness1 /> : dislikesCount}
                  </span>
                </Stack>
              </Stack>
              <div
                style={{
                  position: "fixed",
                  bottom: "0",
                  left: "3px",
                  width: "calc(100% - 5px)",
                  backgroundColor: "#333333",
                  borderRadius: "10px",
                  paddingLeft: "3px",
                }}
              >
                <Form onSubmit={handleComment}>
                  <InputGroup className="mb-1 my-1">
                    <Form.Control
                      ref={inputRef}
                      aria-label="user comment"
                      type="text"
                      placeholder="your comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      autoFocus
                      style={{
                        backgroundColor: "#222222",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                      }}
                    />
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "black",
                        border: "none",
                        borderRadius: "10px",
                        marginLeft: "5px",
                      }}
                    >
                      <ModeCommentOutlined fontSize="medium" />
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </div>
          ) : (
            <div>
              <p>Please login to like, comment and share.</p>
            </div>
          )}
          <br />
          <h2 className="text-center">Comments</h2>
          {comments.map((comment, index) => (
            <Stack
              key={index}
              direction="horizontal"
              style={{
                padding: "5px 12px 5px 5px",
                backgroundColor: theme === "light" ? "white" : "#111111",
                color: theme === "light" ? "#111111" : "white",
              }}
            >
              <Image
                src={comment.authorDetails?.photoURL || "assets/profile.png"}
                style={{
                  width: "4vh",
                  height: "4vh",
                  marginRight: "5px",
                }}
                roundedCircle
              />
              <Stack
                style={{
                  padding: "6px",
                  width: "80%",
                  backgroundColor:
                    theme === "light"
                      ? "rgba(150,200,200,0.3)"
                      : "rgba(50,50,50,0.5)",
                  borderRadius: "10px",
                }}
              >
                <h5>{comment.author || "unknown user"}</h5>
                <p>{comment.content}</p>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <div>
          <h2 className="text-center mb-4">Related Articles</h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {relatedArticles.map((article) => (
              <Col key={article.id}>
                <Card
                  bg={theme === "light" ? "light" : "dark"}
                  text={theme === "dark" ? "light" : "dark"}
                >
                  <Card.Img variant="top" src={article.imagesUrls[0]} />
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.content.slice(0, 100)}...</Card.Text>
                    <Button
                      variant={
                        theme === "light" ? "primary" : "outline-primary"
                      }
                      href={`/story/${article.id}`}
                    >
                      Read More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Modal show={showShare} onHide={handleShareClose}>
        <Modal.Body
          style={{
            backgroundColor: theme === "light" ? "white" : "#111111",
            color: theme === "light" ? "#111111" : "white",
          }}
        >
          {/* Share buttons */}
          <h4 className="display-6 text-center">
            Share this with your social Community!
            <br />
            <br />
            <Row>
              <Col>
                <FacebookShareButton
                  url={`https://zanis-pro.web.app/story/${data.id}`}
                  quote="Ministry of Information and Media. To Inform, Educate and Entertain the Nation!"
                >
                  <i className="bi bi-facebook"></i>
                </FacebookShareButton>
              </Col>
              <Col>
                <WhatsappShareButton
                  url={`https://zanis-pro.web.app/story/${data.id}`}
                  title="Ministry of Information and Media. "
                  separator="To Inform, Educate and Entertain the Nation! "
                >
                  <i className="bi bi-whatsapp"></i>
                </WhatsappShareButton>
              </Col>
              <Col>
                <TwitterShareButton
                  title="Ministry of Information and Media"
                  url={`https://zanis-pro.web.app/story/${data.id}`}
                  via={
                    "Ministry of Information and Media. To Inform, Educate and Entertain the Nation"
                  }
                >
                  <i className="bi bi-twitter"></i>
                </TwitterShareButton>
              </Col>
              <Col>
                <TelegramShareButton
                  url={`https://zanis-pro.web.app/story/${data.id}`}
                  title="Ministry of Information and Media"
                  description="Ministry of Information and Media. To Inform, Educate and Entertain the Nation"
                >
                  <i className="bi bi-telegram"></i>
                </TelegramShareButton>
              </Col>
            </Row>
          </h4>
          <br />
          <br />
          <p className="lead">or copy link</p>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder={`https://zanis-pro.web.app/story/${data.id}`}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <Button
              variant="outline-success"
              id="button-addon2"
              onClick={() => {
                navigator.clipboard
                  .writeText(`https://zanis-pro.web.app/story/${data.id}`)
                  .then(() => {
                    console.log("Text copied to clipboard");
                  })
                  .catch((error) => {
                    console.error("Error copying text to clipboard:", error);
                  });
              }}
            >
              Copy
            </Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: theme === "light" ? "white" : "#111111",
            color: theme === "light" ? "#111111" : "white",
          }}
        >
          <Button variant="dark" onClick={handleShareClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Story;
