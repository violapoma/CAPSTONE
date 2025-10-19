import { Alert, Button, Card, Col, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import axiosInstance from "../../../data/axios";
import { communityCSSVars } from "../../utils/communityCssVars";
import { useAuthContext } from "../../contexts/authContext";

function CommunityDetails({ commId, showCommDetails, setShowCommDetails, handleUpdateCommunity, setRerender }) {
  const { loggedUser } = useAuthContext();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEnlistBanner, setShowEnlistBanner] = useState(false);
  const [showLeaveBanner, setShowLeaveBanner] = useState(false);
  const [loadingEnlist, setLoadingEnlist] = useState(null);

  const [alreadyMember, setAlreadymember] = useState(false);
  const [isMine, setIsMine] = useState(false); 

  const handleClose = () => {
    setShowCommDetails(false);
    setShowLeaveBanner(false);
    setShowEnlistBanner(false);
  };

  const handleEnlist = async () => {
    setLoadingEnlist(true);
    try {
      const res = alreadyMember
        ? await axiosInstance.patch(`/communities/${commId}/leave`)
        : await axiosInstance.patch(`/communities/${commId}/join`);

      console.log('handleEnlist res.data', res.data);
  
      setAlreadymember(!alreadyMember);
      setShowEnlistBanner(!alreadyMember);
      setShowLeaveBanner(alreadyMember);
  
      if (handleUpdateCommunity) handleUpdateCommunity(res.data);
      setRerender(prev => !prev);
  
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingEnlist(false);
    }
  };
  useEffect(() => {
    const fetchComm = async () => {
      if (!commId) return;
      console.log('fetching community'); 
      try {
        const res = await axiosInstance.get(`/communities/${commId}`);
        console.log("modal communilty", res.data);
        const isMember = !!res.data.members.find((m) => m._id === loggedUser._id)
        setAlreadymember(
          isMember
        );
        const mine = !!res.data.moderator._id === loggedUser._id; 
        console.log("isMember", isMember);
        console.log('mine', mine); 
        console.log("altreadyMember", alreadyMember);
        setCommunity(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComm();
  }, [commId, alreadyMember]);
  return (
    <>
      {!loading && (
        <Modal
          show={showCommDetails}
          onHide={handleClose}
          centered
          className="min-vh50"
        >
          <Modal.Header closeButton className="border-0" />
          <Modal.Body className="scrollmodal">
            <Card className="border-0">
              <Card.Img src={community?.cover} />
              <Card.Body
                className="community-banner rounded"
                style={{ ...communityCSSVars(community?.style) }}
              >
                <Card.Title>{community?.name}</Card.Title>
                <Card.Text>
                  {community?.members.length} /{" "}
                  {import.meta.env.VITE_MIN_MEMBERS}
                </Card.Text>
                <Card.Text>{community?.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="border-0 bg-transparent">
                <Row className="align-items-center">
                  <Col sm={3} className="p-0">
                    <Button
                      variant="outline-secondary"
                      onClick={handleEnlist}
                      disabled={loadingEnlist}
                    >
                      {alreadyMember ? (
                        <>
                          <i className="bi bi-dash-square me-2" />
                          Leave
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-square me-2" />
                          Enlist
                        </>
                      )}
                    </Button>
                  </Col>

                  <Col sm={9}>
                    {showEnlistBanner && (
                      <Alert variant="success" className="mb-0">
                        Thanks! You’ll receive a notification once the community
                        becomes active.
                      </Alert>
                    )}
                    {showLeaveBanner && (
                      <Alert variant="warning" className="mb-0">
                        You’ve been removed from the waitlist, but you’re
                        welcome anytime in the future!
                      </Alert>
                    )}
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default CommunityDetails;
