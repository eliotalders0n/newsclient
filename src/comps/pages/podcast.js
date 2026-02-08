import CategoryComponent from "../template/CategoryComponent";
import { Container } from "react-bootstrap";
import { useTheme } from "../template/themeContext";

function Podcast() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Container
      fluid
      style={{
        backgroundColor: isDark ? "#111111" : "#ffffff",
        color: isDark ? "#ffffff" : "#111111",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "80px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <CategoryComponent />
    </Container>
  );
}

export default Podcast;
