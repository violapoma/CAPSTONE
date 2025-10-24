import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useAuthContext } from "../../contexts/authContext";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../data/axios";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ErrorModal from "../Modals/ErrorModal";

function AddComment({
  commentToEdit,
  setCommentToEdit,
  parentComment, //valorizzato solo se lo passa singlecomment
  setParentComment,
  isAccordionOpen,
  containerRef,
  refreshComments,
  setScrollCommentId,
  setIsAccordionOpen,
}) {
  const { loggedUser } = useAuthContext();
  const { postId } = useParams(); // id post
  const isEdit = commentToEdit && commentToEdit._id ? true : false; // true se sto editando
  const isReplying = parentComment && parentComment._id; //true if replyng

  const quillRef = useRef(null);

  const [consoleMsg, setConsoleMsg] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    author: loggedUser._id,
    content: "",
  });

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "link",
  ];

  // Aggiorna testo del form o commentToEdit a seconda del caso
  const handleContentChanges = (value) => {
    if (isEdit) {
      setCommentToEdit((prev) => ({
        ...prev,
        content: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, content: value }));
    }
  };

  const handleDismiss = () => {
    setIsAccordionOpen(false);
    setCommentToEdit({});
    setParentComment({});
    setFormData((prev) => ({
      ...prev,
      content: "", 
    }));
  };

  // Focus automatico e scroll quando l'Accordion si apre
  useEffect(() => {
    if (isAccordionOpen && containerRef.current) {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        const bottom = container.offsetTop + container.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollPos = bottom - viewportHeight + 20;
        window.scrollTo({ top: scrollPos, behavior: "smooth" });

        if (quillRef.current) {
          quillRef.current.getEditor().focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
    console.log("isEdit", isEdit);
  }, [isAccordionOpen, containerRef]);

  /////////////////////////// SUBIT //////////////////////////////////
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const contentValue = isEdit ? commentToEdit.content : formData.content;
    const cleanContent = DOMPurify.sanitize(contentValue);
    const finalData = isEdit
      ? { ...commentToEdit, content: cleanContent }
      : { ...formData, content: cleanContent };

    setValidated(true);
    setIsLoading(true);

    try {
      if (isEdit) {
        console.log("idCommento", commentToEdit._id);
        await axiosInstance.patch(
          `/posts/${postId}/comments/${commentToEdit._id}`,
          {
            content: DOMPurify.sanitize(commentToEdit.content),
            author: commentToEdit.author._id || commentToEdit.author,
          }
        );
        setScrollCommentId(commentToEdit._id);
        setCommentToEdit(null); //reset
      } else if (isReplying) {
        const replyPayload = { ...formData, parent: parentComment._id };
        // console.log(
        //   "reply url:",
        //   `/posts/${postId}/comments/${parentComment._id}`
        // );
        const reply = await axiosInstance.post(
          `/posts/${postId}/comments/${parentComment._id}`, replyPayload
        );
        const newReply = reply.data;
        setScrollCommentId(newReply._id);
        setParentComment(null); 
        setFormData((prev) => ({ ...prev, content: "" }));
      } else {
        const toAdd = await axiosInstance.post(
          `/posts/${postId}/comments`,
          finalData
        );
        const newComment = toAdd.data;
        setScrollCommentId(newComment._id);
        setFormData({ ...formData, content: "" });
      }
      refreshComments();
      setIsAccordionOpen(false);
    } catch (err) {
      setConsoleMsg(
        "An error occurred while deleting your comment 😿 try again later"
      );
      setShow(true);
      console.error("Errore durante il salvataggio del commento", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container ref={containerRef}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="gy-4">
          <Col sm={12}>
            <ReactQuill
              ref={quillRef}
              className="my-editor commentEditor"
              value={isEdit ? commentToEdit.content : formData.content}
              modules={quillModules}
              formats={quillFormats}
              onChange={handleContentChanges}
              theme="snow"
            />
          </Col>
          <Col xs={6} ls={3}>
            <Button
              type="submit"
              variant="outline-secondary"
              className="mt-4 w-100"
            >
              {isLoading && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              {isEdit ? "Update Comment" : "Add Comment"}
            </Button>
          </Col>
          {isEdit && (
            <Col sm={3}>
              <Button
                variant="outline-danger"
                className="mt-4 w-100"
                onClick={handleDismiss}
              >
                Dismiss
              </Button>
            </Col>
          )}
        </Row>
      </Form>
      <ErrorModal consoleMsg={consoleMsg} show={show} setShow={setShow} />
    </Container>
  );
}

export default AddComment;
