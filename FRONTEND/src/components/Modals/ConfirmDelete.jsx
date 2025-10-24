import { Button, Col, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../data/axios";
import { useAuthContext } from "../../contexts/authContext";

function ConfirmDelete({ showConfirmDelete, setShowConfirmDelete, what }) {
  const {commId, postId, commentId} = useParams();
  const {logout} = useAuthContext(); 
  const navigate = useNavigate();

  const handleClose = ()=>{
    setShowConfirmDelete(false);
  };

  const handleDelete = async(e) => {
    let ep; 
    let afterwards = () =>{}; 
    switch (what) {
      case 'account':
        ep = '/me';
        afterwards = logout; 
        break;
      case 'post':
        ep = `/communities/${commId}/posts/${postId}`;
        afterwards = ()=>navigate(`/communities/${commId}`,{replace: true}); 
        break;
      case 'comment':
        ep = `/posts/${postId}/comments/${commentId}`;
        break;
      case 'community':
        ep = `/communities/${commId}`;
        afterwards = ()=>navigate('/communities', {replace: true}); 
        break;
      default:
        break;
    }
    console.log('ep for delete', ep); 
    console.log('params:', 'commId', commId, 'postId', postId); 
    try{  
      const res = await axiosInstance.delete(ep); 
      afterwards(); 
    }catch(err){
      console.log(err);
    }

  };

  return (
    <Modal show={showConfirmDelete} onHide={handleClose} centered id='deleteModal' className="bg-danger-opacity">
      <Modal.Header closeButton className="border-0" />
      <Modal.Body className="d-flex flex-column justify-content-center align-items-center text-center">
        <p>
          Are you sure you want to delete your {what}? It won't be possible to
          recover {what === 'account' ? 'your' : 'this'} data afterwards.
        </p>
        <Row className="align-items-center">
          <Col xs={6}>
            <Button variant="danger" onClick={handleDelete}>
              Delete my {what} <strong>irreversibly</strong>
            </Button>
          </Col>
          <Col xs={6}>
            <Button variant="secondary" onClick={handleClose}>
              I changed my mind
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmDelete;
