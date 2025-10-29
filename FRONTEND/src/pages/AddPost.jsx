import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ContentPreview from "../components/Helpers/ContentPreview";
import axiosInstance from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import ErrorModal from "../components/Modals/ErrorModal";
import MyLoader from "../components/Helpers/MyLoader";

function AddPost() {
  const { commId, postId } = useParams();
  const isEdit = !!postId;

  const [validated, setValidated] = useState(false); //validazione form
  const [cover, setCover] = useState(); //gestione coverImg
  const [coverPreview, setCoverPreview] = useState();

  const [showError, setShowError] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState("");

  const [show, setShow] = useState(false);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const fdModel = {
    title: "",
    subtitle: "",
    content: "",
  };

  const [formData, setFormData] = useState(fdModel);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchPost = async () => {
    try {
      const post = await axiosInstance.get(
        `/communities/${commId}/posts/${postId}`
      );
      console.log("editing", post.data);
      setFormData({ author: post.data.author, ...post.data });
      setCoverPreview(post.data.cover); 
    } catch (e) {
      setConsoleMsg(
        "An error occurred while fetching your post 😿 try again later"
      );
      setShowError(true);
      console.log("erore fetch post da modificare", e);
    }
  };

  useEffect(() => {
    if (isEdit && postId) {
      fetchPost();
    } else {
      setFormData(fdModel);
    }
  }, [isEdit, postId]);

  // quill-react
  const quillModules = {
    toolbar: [
      [{ header: [2, 3, false] }], // Solo H2, H3 e paragrafo, no H1 perché il titolo non è nella preview
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      ["blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  function handleChanges(evt) {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleContentChanges(value) {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  }

  const addCover = (e) => {
    const file = e.target.files[0];
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // SUBMIT
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAdding(true);
    const cleanContent = DOMPurify.sanitize(formData.content);
    const finalData = {
      ...formData,
      content: cleanContent,
    };
    setValidated(true);
    try {
      let response;
      let idForPatch;
      if (isEdit) {
        response = await axiosInstance.patch(
          `/communities/${commId}/posts/${postId}`,
          finalData
        );
        idForPatch = postId;
      } else {
        response = await axiosInstance.post(
          `/communities/${commId}/posts`,
          finalData
        );
        const postObject = response.data.post || response.data;
        idForPatch = postObject._id || postObject.id;
      }
      if (!idForPatch) {
        throw new Error("ID del post non trovato nella risposta del server.");
      }
      if (cover) {
        const patchUrl = `/communities/${commId}/posts/${idForPatch}/cover`;
        console.log("URL PATCH:", patchUrl);
        const fData = new FormData();
        fData.append("cover", cover);
        //log debug
        for (const pair of fData.entries()) {
          console.log(pair[0], pair[1]);
        }
        const resCover = await axiosInstance.patch(
          patchUrl,
          fData,
          {
            headers: {
              'Content-Type': 'multipart/form-data' 
            }
          }
        );
        console.log("resCover", resCover.data);
      }
      console.log("Post creato/modificato con successo:", response.data);
      handleShow();
      setTimeout(() => {
        handleClose();
        navigate(`/communities/${commId}/posts/${idForPatch}`);
      }, 1000);
    } catch (error) {
      setConsoleMsg(
        "An error occurred while fetching your post 😿 try again later"
      );
      setShowError(true);
      console.error("Errore durante la creazione/modifica del post", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Container className="mt-3 px-3">
      {adding ? (
        <MyLoader />
      ) : (
        <>
          <h2 className="mt-3 pb-3">Write your post!</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={9}>
                <Row>
                  <Form.Group as={Col} md="12" controlId="validationTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChanges}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="12" controlId="validationSubtitle">
                    <Form.Label>Subtitle</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Quick infos"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChanges}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="12" controlId="validationImage">
                    <Form.Label>Cover image</Form.Label>
                    <Form.Control
                      required={!isEdit}
                      type="file"
                      name="cover"
                      onChange={addCover}
                    />
                  </Form.Group>
                </Row>
              </Col>
              <Col
                md={3}
                className="d-flex align-items-center justify-content-center"
              >
                <img
                  src={
                    coverPreview
                      ? coverPreview
                      : "/imgs/placeholder-add-post.png"
                  }
                  alt="cover preview"
                  className="coverPreview"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} lg={6}>
                <Form.Group className="mb-3" controlId="validationContent">
                  <Form.Label>Content</Form.Label>
                  <ReactQuill
                    className="my-editor"
                    value={formData.content}
                    name="content"
                    modules={quillModules}
                    formats={quillFormats}
                    onChange={handleContentChanges}
                    theme="snow"
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <ContentPreview content={formData.content} />
              </Col>
            </Row>

            <Button type="submit" variant="outline-secondary">
              {isEdit ? 'APPLY' : 'CREATE POST'}
            </Button>
          </Form>
        </>
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center">
          <Alert variant="success">Post created successfully!</Alert>
        </Modal.Body>
      </Modal>

      <ErrorModal
        consoleMsg={consoleMsg}
        show={showError}
        setShow={setShowError}
      />
    </Container>
  );
}

export default AddPost;
