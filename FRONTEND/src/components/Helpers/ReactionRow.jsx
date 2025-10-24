import { Col, Row } from "react-bootstrap";
import axiosInstance from "../../../data/axios";
import { useState } from "react";

function ReactionRow({
  type,
  ids,
  initialLikes = [],
  initialDislikes = [],
  loggedUser,
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);

  const endpoint =
    type === "post"
      ? `/communities/${ids.commId}/posts/${ids.postId}`
      : `/posts/${ids.postId}/comments/${ids.commentId}`;

  const handleReaction = async (reaction) => {
    try {
      await axiosInstance.patch(`${endpoint}/${reaction}`);
      if (reaction === "like") {
        if (likes.includes(loggedUser._id)) { //remove like
          setLikes(likes.filter((id) => id !== loggedUser._id));
        } else { //add like and removes a dislike if present
          setLikes([...likes, loggedUser._id]);
          setDislikes(dislikes.filter((id) => id !== loggedUser._id));
        }
      } else { //reaction == dislike
        if (dislikes.includes(loggedUser._id)) {
          setDislikes(dislikes.filter((id) => id !== loggedUser._id));
        } else {
          setDislikes([...dislikes, loggedUser._id]);
          setLikes(likes.filter((id) => id !== loggedUser._id));
        }
      }
    } catch (err) {
      console.error("Error toggling like/dislike:", err);
    }
  };

  return (
    <Row className={`w-75 ${type==='post' ? 'm-auto' : ' ms-auto'} px-0 mb-3 justify-content-end`}>
      <Col xs={type==='post' ? 6 : 2} lg={type==='post' ? 1 : 2} className="cursorPointer hovering d-flex align-items-center justify-content-end gap-1">
        <i
          className={`bi bi-hand-thumbs-up${likes.includes(loggedUser._id) ? "-fill" : ""} me-2`}
          onClick={() => handleReaction("like")}
        />
        {likes.length}
      </Col>
      <Col xs={type==='post' ? 6 : 2} lg={type==='post' ? 1 : 2} className="cursorPointer hovering d-flex align-items-center gap-1">
        <i
          className={`bi bi-hand-thumbs-down${dislikes.includes(loggedUser._id) ? "-fill" : ""} me-2`}
          onClick={() => handleReaction("dislike")}
        />
        {dislikes.length}
      </Col>
    </Row>
  );
}

export default ReactionRow;
