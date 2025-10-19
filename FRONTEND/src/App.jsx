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
import CommunityPage from "./pages/CommunityPage";
import Footer from "./components/Footer";
import PostDetails from "./pages/PostDetails";
import AddPost from "./pages/AddPost";
import CommunityMember from "./components/CommunityMember";

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
                <Route path="/users/:userId" element={<UserProfile isMe={false} />} />
                <Route path="/communities" element={<BrowseCommunities />} />
                <Route element={<CommunityMember />}>
                  <Route
                    path="/communities/:commId"
                    element={<CommunityPage />}
                  />
                  <Route
                    path="/communities/:commId/posts/:postId"
                    element={<PostDetails />}
                  />
                  <Route
                    path="/communities/:commId/posts/add-post"
                    element={<AddPost />}
                  />
                  <Route
                    path="/communities/:commId/posts/:postId/edit-post"
                    element={<AddPost />}
                  />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {/* <Footer /> */}
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
