import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useSignUpLoaderProvider } from "../contexts/loaderSignUpContext";

function GuestsRoutes(){
  const {token} = useAuthContext(); 
  const {signUpLoader} = useSignUpLoaderProvider();
  
  return !signUpLoader && token ? <Navigate to='/' replace/> :<Outlet />
}
export default GuestsRoutes;