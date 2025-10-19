import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../data/axios";
import parse from "html-react-parser"; //per quill
import { Alert, Button, Col, Container, Modal, Row } from "react-bootstrap";
import MyLoader from "../components/Helpers/MyLoader";
import CommentArea from "../components/Comments/CommentArea";
import ErrorModal from "../components/Modals/ErrorModal";
import { useAuthContext } from "../contexts/authContext";
import ReactionRow from "../components/Helpers/ReactionRow";

function PostDetails() {
  const navigate = useNavigate();
  const { postId, commId } = useParams(); //id del post
  const { loggedUser } = useAuthContext();
  const userId = loggedUser?._id;

  const [post, setPost] = useState(null);
  const [dateToShow, setDateToShow] = useState("");
  const [show, setShow] = useState(false);
  const [successDel, setSuccessDel] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showError, setShowError] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getPost = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/communities/${commId}/posts/${postId}`
      );
      const fetchedPost = res.data;

      console.log("post fetched successfully", fetchedPost);

      let postIsMine = false;
      if (
        fetchedPost.author?._id &&
        userId &&
        fetchedPost.author._id === userId
      ) {
        postIsMine = true;
      }
      setIsMine(postIsMine);

      if (fetchedPost.createdAt) {
        setDateToShow(getDate(fetchedPost.createdAt));
      }

      setPost(fetchedPost);
    } catch (e) {
      setConsoleMsg(
        "An error occurred while fetching your post 😿 try again later"
      );
      setShowError(true);
      console.log("errore nel recupero del post", e);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    try {
      const res = axiosInstance.delete(
        `/communities/${commId}/posts/${postId}`
      );
      console.log("deleted successfully");
      setSuccessDel(true);

      setTimeout(() => {
        handleClose();
        navigate(`/communities/${commId}`);
      }, 1000);
    } catch (e) {
      setConsoleMsg(
        "An error occurred while deleting your post 😿 try again later"
      );
      setShowError(true);
      console.log("errore nella delete", e);
    }
  };

  useEffect(() => {
    getPost();
  }, [postId, userId]);

  return (
    <>
      {loading ? (
        <MyLoader />
      ) : (
        post && (
          <Container>
            <div id="postContent">
              <div className="border-bottom my-3 pb-3">
                <h1 className="fw-bold">{post.title}</h1>
                {post.subtitle && <h3>{post.subtitle}</h3>}
                <div className="d-flex align-items-center justify-content-between">
                  <div className="w-50 d-flex justify-content-evenly align-items-center">
                    <Link
                      to={isMine ? "/" : `/users/${post.author?._id}`}
                      className="authorLink"
                    >
                      {post.author?.username}
                    </Link>
                    <span className="mx-3">·</span>
                    <span>{dateToShow}</span>
                  </div>
                  {isMine && (
                    <div>
                      <Link
                        to={`/communities/${commId}/posts/${postId}/edit-post`}
                      >
                        <Button
                          variant="outline-secondary"
                          className="border-0"
                        >
                          <i className="bi bi-pencil-square" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline-secondary"
                        className="border-0"
                        onClick={handleShow}
                      >
                        <i className="bi bi-trash" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="py-3">
                <img src={post.cover} alt="post cover" className="postImg" />
              </div>
              {post.content && typeof post.content === "string" ? (
                parse(post.content)
              ) : (
                <p>No content.</p>
              )}
            </div>
            <ReactionRow
              type="post"
              ids={{ commId, postId}}
              initialLikes={post.likes}
              initialDislikes={post.dislikes}
              loggedUser={loggedUser}
            />
            <CommentArea />
          </Container>
        )
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          {successDel ? (
            <Alert variant="success">Post deleted successfully!</Alert>
          ) : (
            <>
              Are you sure you want to delete <strong>permanently</strong> this
              post? This action is irreversible!
            </>
          )}
        </Modal.Body>
        {!successDel && (
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleClose}>
              Go back
            </Button>
            <Button variant="danger" onClick={deletePost}>
              Delete this post <strong>permanently</strong>
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

function getDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

export default PostDetails;
