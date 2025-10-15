import { useEffect } from "react";
import { Badge, Card, CardBody, CardImg, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function PostPreview({ post }) {
  useEffect(() => {
    console.log(post);
  }, []);

  function getTextPreview(html, maxLength = 200) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..." //200 chars preview
      : text;
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
