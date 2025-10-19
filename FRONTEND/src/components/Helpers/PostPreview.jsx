import parse from "html-react-parser";
import { useEffect } from "react";
import { Badge, Card, CardBody, CardImg, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function PostPreview({ post }) {
  useEffect(() => {
    console.log(post);
  }, []);

  
  function decodeHtmlEntities(encodedStr) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(encodedStr, "text/html");
    return dom.documentElement.textContent;
  }

  function getTextPreview(html, maxLength = 200) {
  // Decodifica se serve
  const decoded = decodeHtmlEntities(html);

  // Crea un elemento temporaneo e ottieni il testo visibile
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = decoded;
  const text = tempDiv.textContent || tempDiv.innerText || "";

  // Rimuove spazi multipli e tronca
  const cleanText = text.replace(/\s+/g, " ").trim();

  return cleanText.length > maxLength
    ? cleanText.slice(0, maxLength) + "..."
    : cleanText;
}

  
  return (
    <Card className="shadow-sm hovering">
      <Card.Img variant="top" src={post.cover} alt="postCover" />
      <Card.Body>
        <Card.Title className="fw-bold">{post.title}</Card.Title>
        {post.subtitle && <Card.Subtitle>{post.subtitle}</Card.Subtitle>}
        <Card.Subtitle>{post.inCommunity.name}</Card.Subtitle>
        <Card.Text className="fs-6">{getTextPreview(post.content)}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PostPreview;
