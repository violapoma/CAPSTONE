import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [params] = useSearchParams();

  useEffect(() => {
    const jwt = params.get("jwt");
    const isNewUserParam = params.get("isNewUser");
    const isNewUser = params.get("isNewUser") === "true";

    console.log('Raw isNewUserParam:', isNewUserParam);
    console.log('isNewUser bool', isNewUser);

    if (jwt) {
      login(jwt);

      if (isNewUser) {
        console.log('NAVIGATING TO /first-community');
        navigate("/first-community");
      } else {
        console.log('NAVIGATING TO /');
        navigate("/"); 
      }
    } else {
      navigate("/login");
    }
  }, [params, navigate, login]);

  return <p>Logging in with Google...</p>;
}

export default GoogleCallback;
