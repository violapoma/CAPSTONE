import { useState, useEffect } from "react";
import { useParams,  useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import MyLoader from "../components/Helpers/MyLoader";
import axiosInstance from "../../data/axios";
import { useFollowers } from "../hooks/useFollowers";
import { useFollowing } from "../hooks/useFollowing";
import { useCommunities } from "../hooks/useCommunities";
import { usePosts } from "../hooks/usePosts";
import { Col, Row } from "react-bootstrap";
import UserHeader from "../components/UserProfile/UserHeader";
import UserPosts from "../components/UserProfile/UserPosts";
import UserCommunityPreview from "../components/UserProfile/UserCommunityPreview";

function UserProfile({ isMe }) {

  const { userId } = useParams();
  const { token, loggedUser, login } = useAuthContext();

  const actualId = isMe ? loggedUser?._id : userId;

  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [loadingUser, setLoadingUser] = useState(true);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState("");

  const { followers, setFollowers, loadingFollowers, errorFollowers } =
    useFollowers(actualId);
  const { following, loadingFollowing, errorFollowing } =
    useFollowing(actualId);
  const { posts, loadingPosts, errorPosts } = usePosts(actualId);
  const { communities, stillNotActive, loadingCommunities, errorCommunities } =
    useCommunities(actualId);

  const fetchUser = async () => {
    try {
      if (isMe) {
        const res = await axiosInstance.get(`/me`);
        setUser(res.data);
      } else {
        const res = await axiosInstance.get(`/users/${userId}`);
        setUser(res.data);
      }
    } catch (err) {
      setConsoleMsg(
        "An error occurred while fetching the profile 😿 try again later"
      );
      setShowErrorModal(true);
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };
 

  useEffect(() => {
    if (!token) return;
    console.log('useEffect triggered', refreshTrigger, 'isMe', isMe);
    setLoadingUser(true);
    if (!isMe && userId) {
      fetchUser();
    } else if (isMe) {
      fetchUser();
    }
  }, [token, userId, isMe, loggedUser, refreshTrigger]);

  return (
    <div>
      {loadingUser &&
      loadingUser &&
      loadingPosts &&
      loadingCommunities &&
      loadingFollowers &&
      loadingFollowing ? (
        <div className="d-flex vh-100 justify-content-center align-items-center">
          <MyLoader />
        </div>
      ) : (
        user && (
          <Row className="mw-75 mx-auto my-4 gy-5">
            <Col xs={12} md={9} className="mx-auto">
              <UserHeader
                isMe={isMe}
                user={user}
                followers={followers}
                following={following}
                communities={communities}
                posts={posts}
                setFollowers={setFollowers}
                setRefreshTrigger={setRefreshTrigger}
              />
            </Col>
            <Col xs={12} md={stillNotActive.length > 0 ? 9 : 12}>
              <h3 className="mb-3">Posts</h3>

              <UserPosts posts={posts} forProfile={true}/>
            </Col>
            {stillNotActive.length > 0 && (
              <Col xs={12} md={3}>
                <h3> Help me create these communitites!</h3>
                <UserCommunityPreview communities={communities} />
              </Col>
            )}
          </Row>
        )
      )}

      {showErrorModal && <div>{consoleMsg}</div>}
    </div>
  );
}

export default UserProfile;
