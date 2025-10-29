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
import ConfirmDelete from "../components/Modals/ConfirmDelete";

function PostDetails() {
  const navigate = useNavigate();
  const defaultCover =
    "https://res.cloudinary.com/dm9gnud6j/image/upload/v1759786199/noimgPost_npspix.webp";
  const { postId, commId } = useParams(); //id del post
  const { loggedUser } = useAuthContext();
  const userId = loggedUser?._id;

  const [post, setPost] = useState(null);
  const [dateToShow, setDateToShow] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [successDel, setSuccessDel] = useState(false);
  const [isMine, setIsMine] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showError, setShowError] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState("");

  const handleClose = () => setShowConfirmDelete(false);
  const handleShow = () => setShowConfirmDelete(true);

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
      if (e.response && (e.response.status === 404 || e.response.status === 403)) {
        navigate('/non-existing');
      } else{
        setConsoleMsg(
          "An error occurred while fetching your post 😿 try again later"
        );
        setShowError(true);
        console.log("errore nel recupero del post", e);
      }
    } finally {
      setLoading(false);
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
                  <div className="w-auto d-flex justify-content-around align-items-center">
                    by{" "}
                    <Link
                      to={isMine ? "/" : `/users/${post.author?._id}`}
                      className="fw-bold mx-2"
                    >
                      {post.author?.username}
                    </Link>{" "}
                    in{" "}
                    <Link
                      to={`/communities/${commId}`}
                      className="fw-bold mx-2"
                    >
                      {post.inCommunity?.name}
                    </Link>
                    <span className="mx-1">·</span>
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
              {post.cover !== defaultCover && (
                <div className="py-3">
                  <img src={post.cover} alt="post cover" className="postImg" />
                </div>
              )}
              {post.content && typeof post.content === "string" ? (
                parse(post.content)
              ) : (
                <p>No content.</p>
              )}
            </div>
            <ReactionRow
              type="post"
              ids={{ commId, postId }}
              initialLikes={post.likes}
              initialDislikes={post.dislikes}
              loggedUser={loggedUser}
            />
            <CommentArea />
          </Container>
        )
      )}

      <ConfirmDelete
        showConfirmDelete={showConfirmDelete}
        setShowConfirmDelete={setShowConfirmDelete}
        what="post"
      />

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
