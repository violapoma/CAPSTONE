import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../data/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  /**
   * @param {*} jwt user token
   * @param {*} fromRegister true if login is called during the register process
   */
  const login = (jwt) => {
    console.log('login without navigate -> coming from register')
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const loginWithNavigate = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    navigate("/", { replace: true });
  };

  const logout = () => {
    console.log('logout called'); 
    localStorage.removeItem("token");
    setToken(null);
    setLoggedUser(null);
    navigate("/login", { replace: true });
  };

  const fetchLoggedUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoggedUser(res.data);
    } catch (err) {
      console.error("fetchLoggedUser error:", err);
      if (err.response?.status === 401) {
        console.warn("Token invalid or expired, clearing session silently");
        localStorage.removeItem("token");
        setToken(null);
        setLoggedUser(null);
      }
    }
  };
  
  //saves loggedUser
  useEffect(() => {
    if (token) {
      console.log("authContext token", token);
      fetchLoggedUser()
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, loggedUser, setToken, setLoggedUser, login, loginWithNavigate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
