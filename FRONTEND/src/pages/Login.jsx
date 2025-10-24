import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoginModal } from "../components/Modals/LoginModal";

function Login() {
  const [showLogin, setShowLogin] = useState(false); //login modal

  return (
    <Container className={`loginContainer vh60 my-5 d-flex flex-column justify-content-center align-items-center bg-light rounded shadow-lg `}>
      <h2 className="fs-1">Welcome!</h2>
      <Row className="py-4 w-100 justify-content-between g-3">
        <Col xs={12} md={6}>
          <Button
            className="w-100 bgEmph borderEmph"
            onClick={() => setShowLogin(true)}
          >
            Sign in
          </Button>
        </Col>

        <Col xs={12} md={6}>
          <Link to="/register" className="w-100">
            <Button className="w-100 bgEmph borderEmph">Sign Up</Button>
          </Link>
        </Col>
      </Row>

      {showLogin && (
        <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
      )}
    </Container>
  );
}

export default Login;
