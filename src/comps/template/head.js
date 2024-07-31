import React from "react";
import { Container, Image } from "react-bootstrap";
import { useTheme } from "../template/themeContext";

const Header = () => {
  const { theme } = useTheme();

  return (
    <Container
      fluid
      className="fixed-top d-flex justify-content-between align-items-center"
      style={{
        backgroundColor: theme === "light" ? "white" : "#111111",
        color: theme === "light" ? "#111111" : "white",
      }}
    >
      <Image style={flagStyle} src="/assets/Flag_of_Zambia.png" />
      <div className="text-center">
        <Image style={logoStyle} src="/assets/LOG.png" />
        <h3 style={sloganStyle}>One Government One Voice</h3>
      </div>
      <Image style={coaStyle} src="/assets/COA.png" />
    </Container>
  );
};

const flagStyle = {
  width: "5vh",
  padding: "2px",
  resizeMode: "contain",
};

const logoStyle = {
  width: "15vh",
  padding: "2px",
  resizeMode: "contain",
};

const coaStyle = {
  width: "5vh",
  padding: "2px",
  resizeMode: "contain",
};

const sloganStyle = {
  color: "orange",
  marginTop: "5px",
  fontSize: "14px",
};

export default Header;
