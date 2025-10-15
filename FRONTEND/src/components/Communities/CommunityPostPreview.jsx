import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function CommunityPostPreview({ post, commId }) {

  function getTextPreview(html, maxLength = 200) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || ""; //prendo solo la parte leggibile, senza tag
    return text.length > maxLength
      ? text.slice(0, maxLength).trim() + "..." // tronco a 200 caratteri
      : text;
  };

  return (
    <Link to={`/communities/${commId}/posts/${post._id}`}>
      <Row className="mb-3 align-items-center rounded-2 postPreview">
        <Col sm={9}>
          <p className="fw-bold">
            {post.author.username}
          </p>
          <h2 className="fw-bolder">{post.title}</h2>
          {post.subtitle &&  <h3 className="fw-bold"></h3>}
          <p>{getTextPreview(post.content)}</p>
        </Col>
        <Col sm={3}>
          <img src={post.cover} alt="post cover" className="postPreviewImg" />
        </Col>
      </Row>
    </Link>
  );
}

export default CommunityPostPreview;