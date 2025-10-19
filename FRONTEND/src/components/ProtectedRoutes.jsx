import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function ProtectedRoutes() {
  const { token } = useAuthContext();

  return (
    <>
      {token ? <Outlet /> : <Navigate to="/login" replace />}
    
    </>
  );
}

export default ProtectedRoutes;