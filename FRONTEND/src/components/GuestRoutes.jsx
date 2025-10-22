import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useSignUpLoaderProvider } from "../contexts/loaderSignUpContext";

function GuestsRoutes(){
  const {token} = useAuthContext(); 
  const {signUpLoader} = useSignUpLoaderProvider();
  const location = useLocation();

  const EXCLUDED_PATH = '/auth/google-callback';
  const shouldRedirect = !signUpLoader && token && !location.pathname.startsWith(EXCLUDED_PATH);

  console.log('should redirect?', shouldRedirect); 
  
  return shouldRedirect ? <Navigate to='/' replace/> :<Outlet />
}

export default GuestsRoutes;