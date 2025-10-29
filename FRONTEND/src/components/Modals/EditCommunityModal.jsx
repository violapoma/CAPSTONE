import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import ColorPicker from "../Helpers/ColorPicker";
import CustomFileInput from "../Helpers/CustomFileInput";
import axiosInstance from "../../../data/axios";

function EditComminityModal({
  showEditModal,
  setShowEditModal,
  community,
  onUpdateCommunity,
}) {
  const maxChars = 600;

  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    guidelines: "",
    style: {
      backgroundColor: "#ffffff",
      titleColor: "#000000",
      secondaryColor: "#cccccc",
    },
  });

  const [descrLength, setDescrLength] = useState(0);
  const [guidelinesLength, setGuidelinesLength] = useState(0);

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
    (newStyle) => setFormData((prev) => ({ ...prev, style: newStyle })),
    []
  );

  const addCover = (e) => {
    const file = e.target.files[0];
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setShowEditModal(false);
    setCover(null);
    setCoverPreview(null);
    setSuccess(false);
    setValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setLoading(true);
    try {
      let updatedCommunity = (
        await axiosInstance.put(`/communities/${community._id}`, formData)
      ).data;

      if (cover) {
        const coverFD = new FormData();
        coverFD.append("cover", cover);
        updatedCommunity = (
          await axiosInstance.patch(
            `/communities/${community._id}/cover`,
            coverFD,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
        ).data;
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        onUpdateCommunity(updatedCommunity);
      }, 2000);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (community) {
      setFormData({
        description: community.description || "",
        guidelines: community.guidelines || "",
        style: {
          backgroundColor: community.style?.backgroundColor || "#ffffff",
          titleColor: community.style?.titleColor || "#000000",
          secondaryColor: community.style?.secondaryColor || "#cccccc",
        },
      });
      setDescrLength(community.description?.length || 0);
      setGuidelinesLength(community.guidelines?.length || 0);
    }
  }, [community]);

  return (
    <>
    <Modal
      size="lg"
      show={showEditModal}
      onHide={handleClose}
      scrollable
      centered
    >
      <Modal.Header closeButton className="border-0">
        <h2 className="ms-4">Edit your community</h2>
      </Modal.Header>

      {success ? (
        <Modal.Body>
          <Alert variant="success">Your changes have been applied</Alert>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <Form
            id="editCommunityForm"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Row className="mb-3 gy-4 align-items-center">
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
                  style={{ resize: "none" }}
                  onChange={handleDescrChange}
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
          <Button variant="outline-danger" disabled={loading}>
            DELETE THIS COMMUNITY
          </Button>
          <Button
            form="editCommunityForm"
            type="submit"
            variant="outline-secondary"
            disabled={loading}
          >
            {loading && (
              <Spinner
                animation="border"
                role="status"
                size="sm"
                className="me-2"
              />
            )}
            APPLY
          </Button>
        </Modal.Footer>
      )}
    </Modal>
    
    </>
  );
}

export default EditComminityModal;
