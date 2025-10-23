import { Alert, Button, Modal } from "react-bootstrap";

function ErrorModal({ consoleMsg, show, setShow }) {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered >
      <Modal.Header closeButton />
      <Modal.Body className="d-flex align-items-center justify-content-center">
        <Alert variant="danger" className="text-center w-100">{consoleMsg}</Alert>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorModal;