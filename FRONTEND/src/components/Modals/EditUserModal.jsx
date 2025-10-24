import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Image,
  Modal,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import CustomFileInput from "../Helpers/CustomFileInput";
import MyLoader from "../Helpers/MyLoader";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";
import axiosInstance from "../../../data/axios";
import { updateUserAvatar } from "../../utils/updateUserAvatar";
import ConfirmDelete from "./ConfirmDelete";

function EditUserModal({ showEditUserModal, setShowEditUserModal, setRefreshTrigger }) {
  const maxChars = 300;
  const navigate = useNavigate();

  const { loggedUser, setLoggedUser } = useAuthContext();

  const [success, setSuccess] = useState(false);
  //const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); 

  const [bioLength, setBioLength] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [picPreview, setPicPreview] = useState(null); //profile pic
  const [useAvatar, setUseAvatar] = useState(true); //true: avatar (user.avatar) ; false: upload (addProfilePic)
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatarRPM: "",
    usesAvatar: ""
  });

  useEffect(() => {
    if (loggedUser) {
      setFormData({ 
        username: loggedUser.username, 
        bio: loggedUser.bio, 
        avatarRPM: loggedUser.avatarRPM,
        usesAvatar: loggedUser.usesAvatar || false 
      });
      setUseAvatar(loggedUser.usesAvatar || false);
      setPicPreview(loggedUser.profilePic); 
    }
  }, [loggedUser]);

  // useEffect(() => {
  //   if (loggedUser?.avatarRPM) {
  //     setPicPreview(loggedUser.avatarRPM);
  //     setUseAvatar(true);
  //   }
  //   //updateAvatar();
  //   setRefreshTrigger(prev=>prev+1);
  // }, [loggedUser?.avatarRPM]);

  const updateAvatar = async()=>{
    await updateUserAvatar();
  };

  const addProfilePic = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPicPreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setShowEditUserModal(false);
    setProfilePic(null);
    setPicPreview(null);
    setSuccess(false);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleBioChange = (e) => {
    handleChanges(e);
    setBioLength(e.target.value.length);
  };

  // const handleSwitch = (e) => {
  //   const checked = e.target.checked;
  //   setIsSwitchOn(checked);
  //   console.log("switch: ", checked);
  // };

  const handleToggle = (e) => {
    const checked = e.target.checked;
    setUseAvatar(checked);
    setFormData((prev) => ({ ...prev, usesAvatar: checked })); 
    console.log("setUserAvatar", checked);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip-danger" {...props}>
      Change avatar <br /> <u>CAUTION:</u> you will loose your progress
    </Tooltip>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    console.log('FD: ', formData);
    try {
      let res = (await axiosInstance.put("/me", formData)).data;
      if (!useAvatar && profilePic) {
        const picFD = new FormData();
        picFD.append("profilePic", profilePic);
        res = (
          await axiosInstance.patch("/me/profile-pic", picFD, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        ).data;
        console.log("updated profilePic");
      } 
      setSuccess(true);
      console.log("⭐ Incremento refreshTrigger in corso...");
      setLoggedUser(res); 
      setRefreshTrigger((prev) => prev + 1);
      setTimeout(() => {
        handleClose();
      }, 2000);    
    } catch (err) {
       if (err.response) {
        console.log("ERRORE RISPOSTA API - Stato:", err.response.status);
        console.log("Dati errore:", err.response.data);
      } else if (err.request) {
        console.log("ERRORE DI RETE/SERVER IRREAGIBILE:", err.message);
      } else {
        console.log("ERRORE GENERALE:", err.message);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
    <Modal
      scrollable
      centered
      size="lg"
      show={showEditUserModal}
      onHide={handleClose}
    >
      <Modal.Header closeButton className="border-0">
        Edit Profile infos
      </Modal.Header>
      <Modal.Body className="d-flex align-items-center">
        {success ? (
          <Alert variant="success">Your changes have been applied</Alert>
        ) : (
          <>
            <Form
              id="editUserForm"
              noValidate
              onSubmit={handleSubmit}
              className="w-100"
            >
              <Row className="mb-3 gy-4 align-items-center">
                <Form.Group as={Col} sm={12} controlId="usernameCtrl">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    placeholder="username here"
                    value={formData.username}
                    onChange={handleChanges}
                  />
                </Form.Group>
                <Form.Group as={Col} sm={12} controlId="bioCtrl">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="bio"
                    rows={4}
                    maxLength={maxChars}
                    placeholder="Something about you..."
                    style={{ resize: "none" }}
                    value={formData.bio}
                    onChange={handleBioChange}
                  />
                  <span
                    className={`${
                      bioLength > 280 ? "asterisk" : "text-secondary"
                    }`}
                  >
                    {bioLength} / {maxChars}
                  </span>
                </Form.Group>
                <Form.Group
                  as={Row}
                  controlId="profilePicCtrl"
                  className="align-items-start"
                >
                  <Col sm={12}>
                    <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
                      <span
                        style={{
                          opacity: useAvatar ? 1 : 0.4,
                          transition: "opacity 0.3s",
                          fontWeight: useAvatar ? "bold" : "normal",
                        }}
                      >
                        Avatar
                      </span>

                      <Form.Check
                        type="switch"
                        id="toggle-avatar-upload"
                        checked={!useAvatar ? false : true}
                        onChange={handleToggle}
                        style={{ transform: "scale(1.4)" }}
                      />

                      <span
                        style={{
                          opacity: !useAvatar ? 1 : 0.4,
                          transition: "opacity 0.3s",
                          fontWeight: !useAvatar ? "bold" : "normal",
                        }}
                      >
                        Upload
                      </span>
                    </div>
                  </Col>

                  <Col sm={12} lg={6} className="text-center">
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <div
                        className={`d-flex justify-content-center align-items-center ${useAvatar ? 'cursorPointer' : 'pointerEvtsNone'}`}
                        onClick={() => {
                          navigate("/avatar", { state: { fromEdit: true } });
                          sessionStorage.setItem("reopenEditModal", "true");
                        }}
                      >
                        {loggedUser ? (
                          <Image
                            roundedCircle
                            src={
                              loggedUser?.avatarRPM
                                ? loggedUser.avatarRPM
                                : "/imgs/RPM-logo.png"
                            }
                            style={{
                              width: "16em",
                              height: "16em",
                              border: useAvatar
                                ? "2px solid black"
                                : "1px solid gray",
                              opacity: useAvatar ? 1 : 0.4,
                              transition: "all 0.3s ease",
                              backgroundColor: "var(--primary-color)",
                            }}
                          />
                        ) : (
                          <MyLoader />
                        )}
                      </div>
                    </OverlayTrigger>
                  </Col>

                  <Col sm={12} lg={6} className="text-center mt-3 mt-lg-0">
                    <CustomFileInput
                      rounded
                      addPic={addProfilePic}
                      disabled={useAvatar}
                    />
                  </Col>
                </Form.Group>

                <Button
                  as={Col}
                  sm={2}
                  variant="outline-secondary"
                  className="mx-auto"
                  onClick={handleSubmit}
                >
                  {updateLoading && (
                    <Spinner
                      animation="border"
                      role="status"
                      size="sm"
                      className="me-2"
                    />
                  )}
                  UPDATE
                </Button>

                <Button as={Col} sm={2} variant="outline-danger" className="mx-auto" onClick={()=>setShowConfirmDelete(true)}>
                  DELETE YOUR ACCOUNT PERMANENTLY
                </Button>
              </Row>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
    <ConfirmDelete showConfirmDelete={showConfirmDelete} setShowConfirmDelete={setShowConfirmDelete} what='account' />
    </>
  );
}

export default EditUserModal;
