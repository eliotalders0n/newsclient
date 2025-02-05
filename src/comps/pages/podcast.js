// App.js
import React from "react";
import QueueComponent from "../template/QueueComponent";
import CategoryComponent from "../template/CategoryComponent";
import PlayerComponent from "../template/PlayerComponent";
import { Container } from "react-bootstrap";
import { useTheme } from "../template/themeContext";

function Podcast() {
  const { theme } = useTheme();
  return (
    <Container
      fluid
      style={{
        backgroundColor: theme === "light" ? "white" : "#111111",
        color: theme === "light" ? "#111111" : "white",
        minHeight: "100vh",
        padding: "10vh 0",
        marginTop: "1vh",
      }}
    >
      <div>
        <CategoryComponent />
      </div>
    </Container>
  );
}

export default Podcast;
