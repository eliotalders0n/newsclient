import { useState, useEffect } from "react";
import firebase from "../../firebase";

const useGetReels = (id) => {
  const [docs, setdocs] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("Articles")
      .where("video", "==", true)
      .where("status", "==", "approved")
      .orderBy("createdAt", "desc")
      .onSnapshot((doc) => {
        const quotes = [];
        doc.docs.forEach((document) => {
          const nb = {
            id: document.id,
            ...document.data(),
          };
          quotes.push(nb);
        });
        setdocs(quotes);
      });
  }, []);
  return { docs };
};

export default useGetReels;
