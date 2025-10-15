import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DetailsModal from "./DetailsModal";

function UserHeader({
  isMe,
  user,
  followers = [],
  following = [],
  posts = [],
  communities = [],
}) {
  const totalCommunities =
    (communities?.moderating?.length || 0) +
    (communities?.memberOf?.length || 0);

  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <Row className="pb-4 border-bottom border-secondary">
        <Col sm={3} className="">
          <img
            src={user.profilePic}
            alt="profile picture"
            className="profileImg"
          />
        </Col>
        <Col sm={9} className="">
          <Row className="justify-content-between">
            <Col sm={4} className="fw-bold fs-2">
              {user.username}
            </Col>
            {isMe && (
              <Col sm={4}>
                <Button variant="outline-secondary" className="button">
                  Edit
                </Button>
              </Col>
            )}
          </Row>
          <Row
            className="my-4 fs-6 justify-content-start cursorPointer"
            onClick={() => setShowDetails(true)}
          >
            <Col className="d-flex flex-grow-0 me-3">
              {posts?.length || 0} <span className="fw-bold ms-1">posts</span>
            </Col>
            <Col className="d-flex flex-grow-0 me-3">
              {totalCommunities}{" "}
              <span className="fw-bold ms-1">communities</span>
            </Col>
            <Col className="d-flex flex-grow-0 me-3">
              {followers?.length || 0}{" "}
              <span className="fw-bold ms-1">followers</span>
            </Col>
            <Col className="d-flex flex-grow-0">
              {following?.length || 0}{" "}
              <span className="fw-bold ms-1">following</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <DetailsModal followers={followers} following={following} communities={communities} showDetails={showDetails} setShowDetails={setShowDetails} />
    </>
  );
}

export default UserHeader;
