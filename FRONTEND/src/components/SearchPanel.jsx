import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";
import { ListGroup, Offcanvas, Spinner, Tab, Tabs, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function SearchPanel({ show, handleClose, searchTerm }) {
  const [results, setResults] = useState({ users: [], communities: [] });
  const [loading, setLoading] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm);

  const {loggedUser} = useAuthContext();

  useEffect(() => {
    if (show && searchTerm) {
      setCurrentSearchTerm(searchTerm);
      fetchResults(searchTerm);
    }
  }, [show, searchTerm]);

  const fetchResults = async (term) => {
    if (term.length < 2) {
      setResults({ users: [], communities: [] });
      return;
    }
    setLoading(true);
    try {
      const res = (
        await axiosInstance.get(`/search?q=${encodeURIComponent(searchTerm)}`)
      ).data;
      setResults({
        users: res.users || [],
        communities: res.communities || [],
      });
    } catch (err) {
      console.log(err);
      setResults({ users: [], communities: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    handleClose();
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Results for `{currentSearchTerm}`</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* <Form onSubmit={(e) => e.preventDefault()} className="mb-3">
          <Form.Control
            type="search"
            placeholder="Refine search..."
            value={currentSearchTerm}
            onChange={handleLocalSearchChange}
          />
        </Form> */}

        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && currentSearchTerm.length > 0 && (
          <Tabs defaultActiveKey={`${results.communities.length>0 ? 'communities' : 'users'}`} className="mb-3" variant="underline" >
            <Tab.Container
              eventKey="communities"
              title={`Communities`}
            >
              <ListGroup onClick={handleLinkClick}>
                {results.communities.map((comm) => (
                  <ListGroup.Item
                    action
                    as={Link}
                    to={`/communities/${comm._id}`}
                    key={comm._id}
                  >
                    {/* <i className="bi bi-layout-wtf me-2" /> */}
                    <img src={comm?.cover} alt="profilePic" style={{width:'2em', height:'2em', borderRadius:'50%', marginRight: '0.5em'}} />
                    {comm.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Container>
            <Tab eventKey="users" title={`Users`}>
              <ListGroup onClick={handleLinkClick}>
                {results.users.map((user) => (
                  <ListGroup.Item
                    action
                    as={Link}
                    to={`${user._id === loggedUser._id ? '/' : `/users/${user._id}`}`}
                    key={user._id}
                  >
                    {/* <i className="bi bi-person me-2" /> */}
                    <img src={user?.profilePic} alt="profilePic" style={{width:'2em', height:'2em', borderRadius:'50%', marginRight: '0.5em'}} />
                    {user.username}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>
          </Tabs>
        )}

        {!loading &&
          currentSearchTerm.length > 0 &&
          results.users.length + results.communities.length === 0 && (
            <Alert variant="info">
              No results found for "{currentSearchTerm}".
            </Alert>
          )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default SearchPanel;
