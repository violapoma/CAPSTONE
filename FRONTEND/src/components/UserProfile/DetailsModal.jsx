import { ListGroup, Modal, Nav, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";

function DetailsModal({
  followers = [],
  following = [],
  communities = [],
  showDetails,
  setShowDetails,
}) {
  const handleClose = () => {
    setShowDetails(false);
  };
  console.log("followers:", followers);

  return (
    <Modal
      show={showDetails}
      onHide={handleClose}
      centered
      className="min-vh50"
    >
      <Modal.Header closeButton className="border-0" />
      <Modal.Body className="scrollmodal">
        <Tab.Container defaultActiveKey="followers">
          {/* Nav sopra */}
          <Nav variant="underline" justify>
            <Nav.Item>
              <Nav.Link eventKey="followers">Followers</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="following">Following</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="communities">Communities</Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Contenuto tab */}
          <Tab.Content>
            <Tab.Pane eventKey="followers">
              <ListGroup>
                {followers?.length > 0 ? (
                  followers.map((f) => {
                    console.log("f.follower.username", f.follower.username);
                    return (
                      <ListGroup.Item key={f._id} className="listing">
                        <Link to={`/users/${f.follower._id}`}>
                          <img
                            src={f.follower.profilePic}
                            className="profilePicList me-3"
                            alt="profilePic"
                          />
                          {f.follower.username}
                        </Link>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <p className="fs-6">Still no followers</p>
                )}
              </ListGroup>
            </Tab.Pane>

            <Tab.Pane eventKey="following">
              <ListGroup>
                {following?.length ? (
                  following.map((f) => (
                    <ListGroup.Item key={f._id} className="listing">
                      <Link to={`/users/${f.following._id}`}>
                        <img
                          src={f.following.profilePic}
                          className="profilePicList me-3"
                          alt="profilePic"
                        />
                        {f.following.username}
                      </Link>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="fs-6">Still not following anyone</p>
                )}
              </ListGroup>
            </Tab.Pane>

            <Tab.Pane eventKey="communities">
              <ListGroup>
                {communities?.moderatorOf?.length ||
                communities?.memberOf?.length ? (
                  <Tab.Container defaultActiveKey="member">
                    <Nav variant="underline" justify>
                      <Nav.Item>
                        <Nav.Link eventKey="moderator">Moderator of</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="member">Member of</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="moderator">
                        <ListGroup>
                          {communities?.moderatorOf?.length ? (
                            communities?.moderatorOf?.map((c) => (
                              <Link to={`/communities/${c._id}`}>
                                <ListGroup.Item key={c._id} className="listing">
                                  {c.name}
                                </ListGroup.Item>
                              </Link>
                            ))
                          ) : (
                            <p className="fs-6 text-lightGrey">
                              Currently not moderating anything
                            </p>
                          )}
                        </ListGroup>
                      </Tab.Pane>
                      <Tab.Pane eventKey="member">
                        <ListGroup>
                          {communities?.memberOf?.length ? (
                            communities?.memberOf?.map((c) => (
                              <Link to={`/communities/${c._id}`}>
                                <ListGroup.Item key={c._id} className="listing">
                                  {c.name}
                                </ListGroup.Item>
                              </Link>
                            ))
                          ) : (
                            <p className="fs-6 fw-light text-lightGrey">
                              Currently not member of anything
                            </p>
                          )}
                        </ListGroup>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                ) : (
                  <p className="fs-6">No communities yet</p>
                )}
              </ListGroup>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}

export default DetailsModal;
