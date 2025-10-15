import { Alert, Button, Modal } from "react-bootstrap";

function ErrorModal({ consoleMsg, show, setShow }) {
  const handleClose = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton />
      <Modal.Body>
        <Alert variant="danger" className="text-center">{consoleMsg}</Alert>
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