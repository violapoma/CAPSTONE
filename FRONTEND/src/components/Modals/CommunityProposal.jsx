import { useState } from "react";
import { useAuthContext } from "../../contexts/authContext";
import axiosInstance from "../../../data/axios";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import ColorPicker from "../ColorPicker";
import CustomFileInput from "../CustomFileInput";

function CommunityProposal({ showCommProposal, setShowCommProposal }) {
  const { loggedUser } = useAuthContext();
  const maxChars = 600;

  const [formData, setFormData] = useState({
    name: "",
    topic: [],
    description: "",
    style: {
      backgroundColor: "#f7f3f2",
      titleColor: "#000000",
      secondaryColor: "#d5c9c9",
    },
  });
  const [cover, setCover] = useState(null);
  const [descrLength, setDescrLength] = useState(
    formData.description?.length || 0
  );
  const [consoleMsg, setConsoleMsg] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setShowCommProposal(false);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescrChange = (e) => {
    handleChanges(e);
    setDescrLength(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/communities", formData);
      console.log("creating community", res.data);
      if (cover) {
        const coverFD = new FormData();
        coverFD.append(cover);
        const resPic = await axiosInstance.patch(
          `/communities/${res.data._id}/cover`,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("adding cover", resPic.data);
      }
      console.log("all Good");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal size="lg" show={showCommProposal} onHide={handleClose} centered scrollable>
        <Modal.Header closeButton className="border-0"><h2 className="ms-4">Create a new communtiy</h2></Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
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
                  isInvalid={formData.name?.length === 0}
                />
                <Form.Control.Feedback type="invalid">
                  This field is mandatory
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
                  isInvalid={formData.description?.length === 0}
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
              <Form.Group as={Col} sm={12} controlId="commStyle">
                <ColorPicker />
              </Form.Group>
              <Form.Group as={Col} sm={12} controlId="commCover">
                <Form.Label>Community cover</Form.Label>
                <CustomFileInput addPic={setCover} />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary">SUBMIT PROPOSAL</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommunityProposal;
