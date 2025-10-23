import { useEffect, useState } from "react";
import axios from "../../../data/axios";
import { useAuthContext } from "../../contexts/authContext";
import { Col, Row, Spinner } from "react-bootstrap";
import CommunityPreview from "./CommunityPreview";
import { useSignUpProvider } from "../../contexts/signUpContext";
import ErrorModal from "../Modals/ErrorModal";

function AllCommunitiesPreview({ fromRegister }) {
  const {
    consoleMsg,
    setConsoleMsg,
    showErrorModal,
    setShowErrorModal,
    chosenCommunity,
    setChosenCommunity,
  } = useSignUpProvider();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    setLoading(true);
    setConsoleMsg("");
    try {
      const res = await axios.get("/communities/approved");
      if (!Array.isArray(res.data)) {
        throw new Error("Expected an array from backend");
      }
      setCommunities(res.data);
      console.log("communityList:", res.data);
      console.log("communities: ", communities);
    } catch (err) {
      setConsoleMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (consoleMsg) setShowErrorModal(true);
  }, [consoleMsg]);

  useEffect(() => {
    console.log("chosen community", chosenCommunity);
  }, [chosenCommunity]);

  //conditional returns
  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!communities.length) {
    return <p className="text-center my-4">No communities available</p>;
  }

  return (
    <>
     <h3 className="text-center">Choose your first community </h3>
      <Row className="my-5 scrollModdal">
        {communities.map((comm) => (
          <Col
            xs={12}
            md={6}
            className="hovering"
            onClick={() => setChosenCommunity(comm._id)}
          >
            <CommunityPreview key={comm._id} community={comm} chosenCommunity={chosenCommunity}/>
          </Col>
        ))}
      </Row>
      {showErrorModal && (
        <ErrorModal
          consoleMsg={consoleMsg}
          show={showErrorModal}
          setShow={setShowErrorModal}
        />
      )}
    </>
  );
}

export default AllCommunitiesPreview;
