import { Alert, Button, Col, Image, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../data/axios";
import parse from "html-react-parser"; //per quill
import ErrorModal from "../Modals/ErrorModal";
import ReactionRow from "../Helpers/ReactionRow";
import { communityCSSVars } from "../../utils/communityCssVars";

function SingleComment({
  comment,
  postId,
  setCommentToEdit,
  setParentComment,
  successDel,
  setSuccessDel,
  scrollToThis,
  setIsAccordionOpen,
  communityStyle,
  depth = 0, //fake, just for render comment answers
}) {
  const { loggedUser } = useAuthContext();
  const date = new Date(comment.updatedAt);
  //modale di cancellazione
  const [show, setShow] = useState(false);

  const commentRef = useRef(null);

  //messaggio di errore per lo user
  const [consoleMsg, setConsoleMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [isMine, setIsMine] = useState(false);

  const formatted = date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    setIsMine(comment.author._id === loggedUser._id);
  }, [comment]);
  // const isMine = comment.author._id === loggedUser._id; //va bene anche senza stato credo

  useEffect(() => {
    if (scrollToThis && commentRef.current) {
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [scrollToThis]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteComment = async () => {
    try {
      const deleting = await axiosInstance.delete(
        `/posts/${postId}/comments/${comment._id}`
      );
      setSuccessDel(true);
      setTimeout(() => {
        handleClose();
        setSuccessDel(false);
      }, 1000);
    } catch (error) {
      console.log("errore cancellazione commento", error);
      setConsoleMsg(
        "An error occurred while deleting your comment, try again later"
      );
      setShowError(true);
    }
  };

  const editComment = () => {
    //console.log("setCommentToEdit in singlecomment", comment);
    setCommentToEdit(comment);
    setIsAccordionOpen(true);
  };

  const replyToComment = () => {
    //console.log("setParentComment in singleComment", comment);
    setParentComment(comment);
    setIsAccordionOpen(true);
  };

  return (
    <>
      <Row
        className={`${!comment.parent && "mb-1 mx-1 py-3 commentChain"}`}
        ref={commentRef}
        style={communityStyle ? { ...communityCSSVars(communityStyle) } : {}}      >
        <Col sm={1}>
          <Image
            src={comment.author.usesAvatar ? comment.author.avatarRPM : comment.author.profilePic}
            roundedCircle
            className="dropdownAvatar"
          />
        </Col>
        <Col sm={11}>
          <Row>
            <Col sm={5}>
              <Link
                to={
                  comment.author._id === loggedUser._id
                    ? "/"
                    : `/authors/${comment.author._id}`
                }
                className="authorLink"
              >
                {comment.author.username}
              </Link>

              <div className="d-inline mx-3">
                {isMine && (
                  <>
                    <Button
                      variant="outline-secondary"
                      onClick={editComment}
                      className="border-0 text-dark button me-2"
                    >
                      <i className="bi bi-pencil-square" />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={handleShow}
                      className="border-0 text-dark button me-2"
                    >
                      <i className="bi bi-trash" />
                    </Button>
                  </>
                )}
                {!comment.child && depth < 2 && (
                  <Button
                    variant="outline-secondary"
                    onClick={replyToComment}
                    className="border-0 text-dark button me-2"
                  >
                    <i className="bi bi-reply" />
                  </Button>
                )}
              </div>
            </Col>
            <Col sm={7} className="text-end px-0">
              {/* date */}
              {formatted}
              <ReactionRow
                type="comment"
                ids={{ postId, commentId: comment._id }}
                initialLikes={comment.likes}
                initialDislikes={comment.initialDislikes}
                loggedUser={loggedUser}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12} className="fw-light">
          {parse(comment.content)}
        </Col>
        {comment.child && (
          <Row className="mx-0">
            <Col
              sm={{ span: 11, offset: 1 }}
              className="ps-3 px-0"
              style={{ borderLeft: "1px solid grey" }}
            >
              <SingleComment
                key={comment.child._id}
                comment={comment.child}
                postId={postId}
                setCommentToEdit={setCommentToEdit}
                setParentComment={setParentComment}
                successDel={successDel}
                setSuccessDel={setSuccessDel}
                scrollToThis={scrollToThis}
                setIsAccordionOpen={setIsAccordionOpen}
                depth={depth + 1}
              />
            </Col>
          </Row>
        )}
      </Row>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          {successDel ? (
            <Alert variant="success">Comment deleted successfully!</Alert>
          ) : (
            <>
              Are you sure you want to delete this comment{" "}
              <strong>permanently</strong>? This action is irreversible!
            </>
          )}
          {consoleMsg && <Alert variant="danger">{consoleMsg}</Alert>}
        </Modal.Body>
        {!successDel && (
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleClose}>
              Go back
            </Button>
            <Button variant="danger" onClick={deleteComment}>
              Delete this comment <strong>permanently</strong>
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      <ErrorModal
        consoleMsg={consoleMsg}
        show={showError}
        setShow={setShowError}
      />
    </>
  );
}
export default SingleComment;
