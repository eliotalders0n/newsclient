import React, { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Container,
  Button,
  Form,
  InputGroup,
  Modal,
  Row,
  Badge,
  Col,
} from "react-bootstrap";
import {
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton,
  TelegramShareButton,
} from "react-share";
import { Skeleton, Typography } from "@mui/material";
import "./reels.css";
import { useTheme } from "../template/themeContext";
import useGetReels from "../hooks/useGetReels";
import firebase from "../../firebase";

const ReelCard = () => {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState({});
  const Reel = useGetReels().docs;

  useEffect(() => {
    const unsubscribeAuthors = firebase
      .firestore()
      .collection("Users")
      .onSnapshot((snapshot) => {
        const authorsData = {};
        snapshot.docs.forEach((doc) => {
          authorsData[doc.id] = doc.data();
        });
        setAuthors(authorsData);
        setLoading(false);
      });

    return () => {
      unsubscribeAuthors();
    };
  }, []);

  const { theme } = useTheme();

  const [shareArticleId, setShareArticleId] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const handleShareClose = () => setShowShare(false);
  const handleShareShow = (id) => {
    setShareArticleId(id);
    setShowShare(true);
  };

  return (
    <Container
      fluid
      className="reels-container"
      style={{
        backgroundColor: theme === "light" ? "white" : "#111111",
        color: theme === "light" ? "#111111" : "white",
        minHeight: "100vh",
        padding: "10vh 3vh 10vh 3vh",
        marginTop: "8vh",
      }}
    >
      <h2
        style={{
          fontFamily: "Roboto Condensed",
          fontStyle: "normal",
          marginLeft: "7vh",
          textAlign: "center",
        }}
      >
        Videos
      </h2>
      {loading ? (
        <Stack spacing={1}>
          <Skeleton
            variant="rounded"
            sx={{ fontSize: "3rem", bgcolor: "grey" }}
            style={{ width: "100%", height: "60vh" }}
          />
          <br />
          <Skeleton
            variant="circular"
            sx={{ bgcolor: "grey" }}
            width={40}
            height={40}
          />
          <br />
          <Skeleton
            variant="rectangular"
            sx={{ bgcolor: "grey" }}
            style={{ width: "100%", height: "5vh" }}
          />
        </Stack>
      ) : Reel.length === 0 ? (
        <>
          <br />
          <h3 className="display-3 text-center">
            {" "}
            <b>Oops!</b> <br />
            No news yet.
          </h3>
          <p className="lead text-center">Try again later</p>
        </>
      ) : (
        Reel.map((article) => (
          <Card
            key={article.id}
            className="reels-card"
            style={{
              backgroundColor: theme === "light" ? "white" : "#111111",
              color: theme === "light" ? "#111111" : "white",
              boxShadow: "0px 10px 10px rgba(0,0,0,0.9)",
              paddingBottom: "10px",
            }}
          >
            <Card.Body
              className="reels-card-body"
              style={{
                backgroundColor: theme === "light" ? "white" : "#111111",
                color: theme === "light" ? "#111111" : "white",
              }}
            >
              <Card.Title
                style={{
                  backgroundColor: theme === "light" ? "white" : "#111111",
                  color: theme === "light" ? "#111111" : "white",
                }}
              ></Card.Title>
              <video
                src={article.imagesUrls}
                style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                controls
              />
            </Card.Body>
            <Card.Text
              className="reels-card-text"
              style={{
                backgroundColor: theme === "light" ? "white" : "#111111",
                color: theme === "light" ? "#111111" : "white",
              }}
            >
              {article.title} <br />
              <Badge bg="danger">{article.ministry}</Badge>
              <i
                className="bi bi-share h4"
                style={{ marginLeft: "20px" }}
                onClick={() => handleShareShow(article.id)}
              ></i>
            </Card.Text>
            <Card.Text
              className="reels-card-text"
              style={{
                backgroundColor: theme === "light" ? "white" : "#111111",
                color: theme === "light" ? "#111111" : "white",
              }}
            >
              <Stack
                direction="horizontal"
                gap={2}
                style={{
                  backgroundColor: theme === "light" ? "white" : "#111111",
                  color: theme === "light" ? "#111111" : "white",
                }}
              >
                <img
                  src={authors[article.author]?.photoURL}
                  alt=""
                  style={{ width: "3vh", height: "3vh" }}
                  roundedCircle
                />
                {authors[article.author]?.firstName}{" "}
                {authors[article.author]?.lastName}
              </Stack>
            </Card.Text>
          </Card>
        ))
      )}

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
                  url={`https://zanis-pro.web.app/reels/${shareArticleId}`}
                  quote="Ministry of Information and Media. To Inform, Educate and Entertain the Nation!"
                >
                  <i className="bi bi-facebook"></i>
                </FacebookShareButton>
              </Col>
              <Col>
                <WhatsappShareButton
                  url={`https://zanis-pro.web.app/reels/${shareArticleId}`}
                  title="Ministry of Information and Media. "
                  separator="To Inform, Educate and Entertain the Nation! "
                >
                  <i className="bi bi-whatsapp"></i>
                </WhatsappShareButton>
              </Col>
              <Col>
                <TwitterShareButton
                  title="Ministry of Information and Media"
                  url={`https://zanis-pro.web.app/reels/${shareArticleId}`}
                  via={
                    "Ministry of Information and Media. To Inform, Educate and Entertain the Nation"
                  }
                >
                  <i className="bi bi-twitter"></i>
                </TwitterShareButton>
              </Col>
              <Col>
                <TelegramShareButton
                  url={`https://zanis-pro.web.app/reels/${shareArticleId}`}
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
              placeholder={`https://zanis-pro.web.app/reels/${shareArticleId}`}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <Button
              variant="outline-success"
              id="button-addon2"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `https://zanis-pro.web.app/reels/${shareArticleId}`
                  )
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
    </Container>
  );
};

export default ReelCard;
