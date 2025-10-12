import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import GuestsRoutes from "./components/GuestRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { SignUpProvider } from "./contexts/signUpContext";
import { LoaderSignUpProvider } from "./contexts/loaderSignUpContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            element={
              <LoaderSignUpProvider>
                <GuestsRoutes />
              </LoaderSignUpProvider>
            }
          >
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={
                <SignUpProvider>
                  <SignUp />
                </SignUpProvider>
              }
            />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
