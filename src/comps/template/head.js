import React from "react";
import { Container, Image } from "react-bootstrap";
import { useTheme } from "../template/themeContext";

const Header = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Container
      fluid
      className="fixed-top d-flex justify-content-between align-items-center"
      style={{
        backgroundColor: isDark ? "#111111" : "#ffffff",
        padding: "8px 16px",
        zIndex: 1000,
      }}
    >
      <div style={{ width: 36 }} />
      <div className="text-center">
        <Image
          src="/assets/LOG.png"
          style={{ height: "36px", objectFit: "contain" }}
        />
        <p
          style={{
            color: "orange",
            fontSize: "10px",
            margin: 0,
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          One Government One Voice
        </p>
      </div>
      <div style={{ width: 36 }} />
    </Container>
  );
};

export default Header;
