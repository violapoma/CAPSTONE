import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound(){
  return (
    <Container className="text-center mt-5 vh50">
      <h1 className="display-4">404</h1>
      <p className="lead">Oops! This page does not exist.</p>
      <Link to="/" className="btn btn-secondary">
        Return to homepage
      </Link>
    </Container>
  );
}

export default NotFound; 