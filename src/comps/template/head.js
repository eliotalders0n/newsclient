import React from "react";
import { Container, Image } from "react-bootstrap";

const Header = () => {
  return (
    <Container
      fluid
      className="fixed-top d-flex align-items-center"
      style={{ backgroundColor: "green" }}
    >
      <Image style={flagStyle} src="/assets/Flag_of_Zambia.png" />
      <div style={spacerStyle}></div>
      <Image style={logoStyle} src="/assets/LOG.png" />
      <div style={spacerStyle}></div>
      <Image style={coaStyle} src="/assets/COA.png" />
    </Container>
  );
};

const flagStyle = {
  width: "5vh",
  padding: "5px",
  resizeMode: "contain",
};

const logoStyle = {
  width: "25vh",
  padding: "5px",
  resizeMode: "contain",
};

const coaStyle = {
  width: "4vh",
  padding: "5px",
  resizeMode: "contain",
};

const spacerStyle = {
  flex: 1,
};

export default Header;
