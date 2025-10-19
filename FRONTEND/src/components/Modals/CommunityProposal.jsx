import { useCallback, useState } from "react";
import { useAuthContext } from "../../contexts/authContext";
import axiosInstance from "../../../data/axios";
import { Alert, Badge, Button, Col, Form, Modal, Row } from "react-bootstrap";
import ColorPicker from "../Helpers/ColorPicker";
import CustomFileInput from "../Helpers/CustomFileInput";

function CommunityProposal({ showCommProposal, setShowCommProposal }) {
  const { loggedUser } = useAuthContext();
  const maxChars = 600;
  const defaultFormData = {
    name: "",
    topic: [],
    description: "",
    guidelines: "",
    style: {
      backgroundColor: "#f7f3f2",
      titleColor: "#000000",
      secondaryColor: "#d5c9c9",
    },
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [descrLength, setDescrLength] = useState(
    formData.description?.length || 0
  );
  const [guidelinesLength, setGuidelinesLength] = useState(
    formData.guidelines?.length || 0
  ); 
  const [consoleMsg, setConsoleMsg] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setShowCommProposal(false);
    setSuccess(false);
  };

  const handleClear = () => {
    setFormData(defaultFormData);
    setCurrentTopic("");
    setCover(null);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescrChange = (e) => {
    handleChanges(e);
    setDescrLength(e.target.value.length);
  };

  const handleGLChange = (e) => {
    handleChanges(e);
    setGuidelinesLength(e.target.value.length);
  };

  const handleStyleChange = useCallback(
    (newStyle) => {
      setFormData((prev) => ({
        ...prev,
        style: newStyle,
      }));
    },
    [setFormData]
  );

  const handleAddTopic = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const topicToAdd = currentTopic.trim();
      if (topicToAdd && !formData.topic.includes(topicToAdd)) {
        setFormData((prev) => ({
          ...prev,
          topic: [...prev.topic, topicToAdd],
        }));
        setCurrentTopic("");
      }
    }
  };
  const handleRemoveTopic = (topicToRemove) => {
    setFormData((prev) => ({
      ...prev,
      topic: prev.topic.filter((topic) => topic !== topicToRemove),
    }));
  };

  const addCover = (e) => {
    const file = e.target.files[0];
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setLoading(true);
    console.log("[addCommunity]: formData", formData);
    console.log("[addCommunity]: cover", cover);
    try {
      const res = await axiosInstance.post("/communities", formData);
      console.log("creating community", res.data);
      const commId = res.data._id; 
      if (cover) {
        const patchUrl = `/communities/${commId}/cover`
        console.log("URL PATCH:", patchUrl);
        const coverFD = new FormData();
        coverFD.append('cover', cover);
        const resPic = await axiosInstance.patch(
          patchUrl,
          coverFD,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("adding cover", resPic.data);
      }
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
      console.log("all Good");
    } catch (err) {
      setSuccess(false); 
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal
        size="lg"
        show={showCommProposal}
        onHide={handleClose}
        centered
        scrollable
      >
        <Modal.Header closeButton className="border-0">
          <h2 className="ms-4">Create a new communtiy</h2>
        </Modal.Header>

        {success ? (
          <Modal.Body>
            <Alert variant="success">
              Thanks! We will review your proposal and let you know asap!
            </Alert>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <Form
              id="communityProposalForm"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <Row className="mb-3 gy-4 align-items-center">
                <Form.Group as={Col} sm={12} controlId="validationName">
                  <Form.Label>
                    Name <span className="asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="name"
                    type="text"
                    placeholder="What would be your community name?"
                    value={formData.name}
                    onChange={handleChanges}
                    //                  isInvalid={formData.name?.length === 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is mandatory
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={12} controlId="validationTopic">
                  <Form.Label>Topics (hit enter to add)</Form.Label>
                  <Form.Control
                    // required
                    name="topicInput"
                    type="text"
                    placeholder="gaming, coding, healty food..."
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    onKeyDown={handleAddTopic}
                  />
                  <div className="mt-2">
                    {formData.topic.map((topic, index) => (
                      <Badge
                        key={index}
                        bg="secondary"
                        className="me-2 d-inline-flex align-items-center fs-6 fw-light"
                      >
                        {topic}
                        <span
                          onClick={() => handleRemoveTopic(topic)}
                          style={{
                            cursor: "pointer",
                            marginLeft: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          <i className="bi bi-x-circle-fill" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                  {/* TODO: validazioni singole, non con validated */}
                  <Form.Control.Feedback type="invalid">
                    You need at least ONE topic
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={12} controlId="validationDescr">
                  <Form.Label>
                    Description <span className="asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="description"
                    as="textarea"
                    rows={4}
                    maxLength={maxChars}
                    placeholder="Write something about your community"
                    value={formData.description}
                    onChange={handleDescrChange}
                    //                  isInvalid={formData.description?.length === 0}
                  />
                  <span
                    className={`${
                      descrLength > 580 ? "asterisk" : "text-secondary"
                    }`}
                  >
                    {descrLength} / {maxChars}
                  </span>
                  <Form.Control.Feedback type="invalid">
                    This field is mandatory
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={12} controlId="validationGL">
                  <Form.Label>
                    Guidelines <span className="asterisk">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    name="guidelines"
                    as="textarea"
                    rows={4}
                    maxLength={maxChars}
                    placeholder="Write something about your community"
                    value={formData.guidelines}
                    onChange={handleGLChange}
                    //                  isInvalid={formData.description?.length === 0}
                  />
                  <span
                    className={`${
                      guidelinesLength > 580 ? "asterisk" : "text-secondary"
                    }`}
                  >
                    {guidelinesLength} / {maxChars}
                  </span>
                  <Form.Control.Feedback type="invalid">
                    This field is mandatory
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} sm={12} controlId="commStyle">
                  {/* new props here */}
                  <ColorPicker
                    initialColors={formData.style}
                    onStyleChange={handleStyleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} sm={12} controlId="commCover">
                  <Form.Label>Community cover</Form.Label>
                  <CustomFileInput addPic={addCover} />
                </Form.Group>
              </Row>
            </Form>
          </Modal.Body>
        )}

        {!success && (
          <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClear}>
            CLEAR
          </Button>
          <Button
            form="communityProposalForm"
            type="submit"
            variant="outline-secondary"
          >
            SUBMIT PROPOSAL
          </Button>
        </Modal.Footer>
        )}
        
      </Modal>
    </>
  );
}

export default CommunityProposal;
