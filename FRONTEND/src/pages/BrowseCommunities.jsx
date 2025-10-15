import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";
import { Button, Col, ListGroup, Nav, Row, Tab } from "react-bootstrap";
import CommunityPreview from "../components/Communities/CommunityPreview";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import CommunityDetails from "../components/Modals/CommunityDetails";
import CommunityProposal from "../components/Modals/CommunityProposal";

function BrowseCommunities() {
  const { loggedUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [activeCommunities, setActiveCommunities] = useState([]);
  const [notActiveCommunities, setNotActiveCommunities] = useState([]);
  const [myNotActiveCommunities, setMyNotActiveCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [joinableCommunities, setJoinableCommunities] = useState([]);

  const [showCommDetails, setShowCommDetails] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);

  const [showCommProposal, setShowCommProposal] = useState(false);

  const [rerender, setRerender] = useState(false);

  const handleCommDetails = (commId) => {
    setSelectedComm(commId);
    setShowCommDetails(true);
  };

  const handleUpdateCommunity = (updatedComm) => {
    setActiveCommunities((prev) =>
      prev.map((c) => (c._id === updatedComm._id ? updatedComm : c))
    );
    setNotActiveCommunities((prev) =>
      prev.map((c) => (c._id === updatedComm._id ? updatedComm : c))
    );
    setMyNotActiveCommunities((prev) =>
      prev.map((c) => (c._id === updatedComm._id ? updatedComm : c))
    );
    setUserCommunities((prev) =>
      prev.map((c) => (c._id === updatedComm._id ? updatedComm : c))
    );
    setJoinableCommunities((prev) =>
      prev.map((c) => (c._id === updatedComm._id ? updatedComm : c))
    );
  };

  const fetchCommunities = async () => {
    if (!loggedUser?._id) return;
    try {
      const res = await axiosInstance.get("/communities");
      console.log("communities:", res.data);
      const active = res.data.filter((comm) => comm.active === true);
      const notActive = res.data.filter((comm) => !comm.active); //waitlist
      const myNotActive = notActive.filter((comm) =>
        comm.members.find((m) => m._id === loggedUser._id)
      );
      const alreadyMember = active.filter(
        (
          comm //std communities
        ) => comm.members?.some((m) => m._id === loggedUser._id)
      );
      const notJoinedActive = active.filter(
        //comm tbj
        (comm) => !comm.members?.some((m) => m._id === loggedUser._id)
      );
      console.log("loggedUser", loggedUser);
      console.log("Active:", active);
      console.log("Not Active:", notActive);
      console.log("My notactive", myNotActive);
      console.log("AlreadyMember:", alreadyMember);
      console.log("NotJoinedActive", notJoinedActive);
      setActiveCommunities(active);
      setNotActiveCommunities(notActive);
      setUserCommunities(alreadyMember);
      setJoinableCommunities(notJoinedActive);
      setMyNotActiveCommunities(myNotActive);
    } catch (err) {
      console.log("error fetching all communitites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [loggedUser, rerender]);

  return (
    <Row className="mw-80 mx-auto mt-4">
      <Col sm={9}>
        <Tab.Container defaultActiveKey="member" className="mb-4">
          <Nav variant="underline">
            <Nav.Item>
              <Nav.Link eventKey="member">Your communities</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="notActive">Your waitlist</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="other">Browse other communities</Nav.Link>
            </Nav.Item>
            <Button
              variant="outline-secondaty"
              onClick={() => setShowCommProposal(true)}
            >
              Add community
            </Button>
          </Nav>

          <Tab.Content className="mt-4">
            <Tab.Pane eventKey="member">
              <ListGroup>
                {userCommunities?.length > 0 ? (
                  userCommunities.map((comm) => (
                    <Link to={`/communities/${comm._id}`} key={comm._id}>
                      <Col sm={4}>
                        <ListGroup.Item className="hovering ps-0">
                          <CommunityPreview community={comm} />
                        </ListGroup.Item>
                      </Col>
                    </Link>
                  ))
                ) : (
                  <p> No communities yet </p>
                )}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="notActive">
              <ListGroup>
                {myNotActiveCommunities?.length > 0 ? (
                  myNotActiveCommunities.map((comm) => (
                    <Col sm={4} key={comm._id} onClick={handleCommDetails}>
                      <ListGroup.Item className="hovering ps-0">
                        <CommunityPreview community={comm} />
                      </ListGroup.Item>
                    </Col>
                  ))
                ) : (
                  <p>You are not waiting for any community to become active.</p>
                )}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="other">
              <ListGroup>
                {joinableCommunities?.length > 0 ? (
                  joinableCommunities.map((comm) => (
                    <Link to={`/communities/${comm._id}`}>
                      <Col sm={4} key={comm._id}>
                        <ListGroup.Item className="hovering ps-0">
                          <CommunityPreview community={comm} />
                        </ListGroup.Item>
                      </Col>
                    </Link>
                  ))
                ) : (
                  <p>No more communities to browse</p>
                )}
              </ListGroup>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Col>

      <Col sm={3}>
        <Col sm={12}>
          <h3 className="text-end">
            Help other users to build their communities!
          </h3>
          <Row>
            {notActiveCommunities?.length > 0 ? (
              notActiveCommunities.map((comm) => (
                <Col
                  sm={12}
                  key={comm._id}
                  className="cursorPointer"
                  onClick={() => handleCommDetails(comm._id)}
                >
                  <CommunityPreview community={comm} />
                </Col>
              ))
            ) : (
              <p> No communities yet </p>
            )}
          </Row>
        </Col>
      </Col>
      <CommunityDetails
        commId={selectedComm}
        showCommDetails={showCommDetails}
        setShowCommDetails={setShowCommDetails}
        handleUpdateCommunity={handleUpdateCommunity}
        setRerender={setRerender}
      />

      <CommunityProposal
        showCommProposal={showCommProposal}
        setShowCommProposal={setShowCommProposal}
      />
    </Row>
  );
}

export default BrowseCommunities;
