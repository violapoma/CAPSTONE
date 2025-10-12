import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function Footer() {
  const { logout } = useAuthContext();
  return (
    <footer className="mt-4 p-3 rounded">
      <Row className="h-100 align-items-stretch">
        <Col
          sm={3}
          className="h-100 d-flex flex-column align-items-around justify-content-around"
        >
          <h2>StriveBlog</h2>
          <p>Copyright © 2025 StriveBlog</p>
          <p>All rights reserved</p>
        </Col>
        <Col sm={6} className="text-center">
          <iframe
            src="https://giphy.com/embed/dCjgjlXrflbRFqNiRL"
          />
        </Col>
        <Col sm={3} className="text-end">
          <h2 className="browseH2">Browse</h2>
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/me"}>Your profile</Link>
            </li>
            <li>
              <Link to={"/me/edit"}>Edit your account</Link>
            </li>
            <li>
              <Link to={"/posts/add-post"}>Add a new post</Link>
            </li>
          </ul>
          <hr />
          <Button
            variant="outline-dark"
            className="border-0 button"
            onClick={logout}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;