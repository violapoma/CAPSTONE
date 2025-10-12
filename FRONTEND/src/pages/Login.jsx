import {useState } from "react";
import { Button, Form, Container, Modal, Accordion } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../data/axios";
import { useAuthContext } from "../contexts/authContext";
import ErrorModal from "../components/ErrorModal";
import { LoginModal } from "../components/LoginModal";

function Login() {

  const [showError, setShowError] = useState(false); 
  const [consoleMsg, setConsoleMsg] = useState('');

  const [showLogin, setShowLogin] = useState(false); //login modal
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });

  // const { login } = useAuthContext();
  // const navigate = useNavigate();

  // const googleLogInPath = `${import.meta.env.VITE_BACKEND_HOST}${import.meta.env.VITE_GOOGLE_PATH}`;
  // const showPath = () => console.log('googleLoginPath ',googleLogInPath);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleLogin = async (evt) => {
  //   evt.preventDefault();
  //   try {
  //     console.log("Login con:", formData.email, formData.password);
  //     const res = await axios.post("/auth/login", formData);
  //     if (res.status == 200) {
  //       console.log(res.data);
  //       login(res.data.jwt);
  //       console.log("token settato", localStorage.getItem("token"));
  //       navigate("/");
  //     }
  //   } catch (err) {
  //     setConsoleMsg("Your logging credentials are wrong, please check again");
  //     setShowError(true); 
  //     console.log("errore di login", err);
  //   }
  //   setShowLogin(false);
  // };

  return (
    <Container className="w-50 vh85 my-4 d-flex flex-column justify-content-center align-items-center bg-light rounded ">
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
      <ErrorModal consoleMsg={consoleMsg} show={showError} setShow={setShowError} />
    </Container>
  );
}

export default Login;