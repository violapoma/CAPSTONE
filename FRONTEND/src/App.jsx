import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import GuestsRoutes from "./components/GuestRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { SignUpProvider } from "./contexts/signUpContext";
import { LoaderSignUpProvider } from "./contexts/loaderSignUpContext";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import BrowseCommunities from "./pages/BrowseCommunities";
import CommunityPage from "./components/Communities/CommunityPage";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <main className="flex-fill">
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
                <Route path="/" element={<UserProfile isMe={true} />} />
                <Route path="/communities" element={<BrowseCommunities />} />
                <Route
                  path="/communities/:commId"
                  element={<CommunityPage />}
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
