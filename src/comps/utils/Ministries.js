import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Stack,
  Badge,
  Card,
  Container,
  InputGroup,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { Skeleton } from "@mui/material";
import firebase from "../../firebase";
import DOMPurify from "dompurify";
import { useTheme } from "../template/themeContext";
import useGetMinistries from "../hooks/useGetMinistries";

function Ministries( articles ){
    const { docs: ministries } = useGetMinistries();
    const [filteredArticles, setFilteredArticles] = useState([]);


    const filterArticlesByMinistry = (ministryId) => {
        if (ministryId === "all") {
          setFilteredArticles(articles);
        } else {
          const filtered = articles.filter(
            (article) => article.ministry === ministryId
          );
          setFilteredArticles(filtered);
        }
      };

    return (
        <Stack
        direction="horizontal"
        gap={2}
        style={{
          overflowX: "scroll",
          fontSize: "12px",
          overflowY: "hidden",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "1px",
            backgroundColor: "#F5F5F5",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ddd",
            borderRadius: "3px",
          },
        }}
      >
        {ministries.map((ministry) => (
          <Stack
            key={ministry.id}
            onClick={() => filterArticlesByMinistry(ministry.id)}
            style={{ cursor: "pointer", fontFamily: "Martel Sans" }}
          >
            <Image
              src={ministry.img}
              alt=""
              style={{ width: "6vh", display: "block", margin: "auto" }}
              roundedCircle
            />
            <p style={{ width: "80px", textAlign: "center" }}>
              {ministry.name.substring(0, 10)}
            </p>
          </Stack>
        ))}
      </Stack>

    );
}

export default Ministries;