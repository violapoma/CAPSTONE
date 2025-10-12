import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import Footer from "./Footer";

function ProtectedRoutes() {
  const { token } = useAuthContext();

  return (
    <>
      {token ? <Outlet /> : <Navigate to="/login" replace />}
      <Footer />
    </>
  );
}

export default ProtectedRoutes;