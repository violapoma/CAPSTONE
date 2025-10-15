import {useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoginModal } from "../components/Modals/LoginModal";

function Login() {

  const [showLogin, setShowLogin] = useState(false); //login modal


  return (
    <Container className="w-25 vh50 my-4 d-flex flex-column justify-content-center align-items-center bg-light rounded ">
      <h2 className="fs-1">Welcome!</h2>
      <div className="py-4 w-50 d-flex justify-content-between">
        <Button
          className="bgEmph borderEmph"
          onClick={() => setShowLogin(true)}
        >
          Sign in
        </Button>

        <Link to="/register">
          <Button className="bgEmph borderEmph">Sign Up</Button>
        </Link>
      </div>

      {showLogin && (
        <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
      )}
    </Container>
  );
}

export default Login;