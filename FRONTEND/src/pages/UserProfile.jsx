import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { token, loggedUser } = useAuthContext();

  const actualId = isMe ? loggedUser?._id : userId;

  const [user, setUser] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [consoleMsg, setConsoleMsg] = useState("");

  // Fetch user data
  const getUser = async () => {
    setLoadingUser(true);
    try {
      if (isMe) {
        setUser(loggedUser);
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

  const { followers, setFollowers, loadingFollowers, errorFollowers } =
    useFollowers(actualId);
  const { following, loadingFollowing, errorFollowing } =
    useFollowing(actualId);
  const { posts, loadingPosts, errorPosts } = usePosts(actualId);
  const { communities, stillNotActive, loadingCommunities, errorCommunities } =
    useCommunities(actualId);

    useEffect(() => {
      if (!token || (isMe && !loggedUser)) return;
  
      setLoadingUser(true);
      setUser(null); // Reset dello stato
  
      const fetchUser = async () => {
        try {
          if (isMe) {
            setUser(loggedUser);
          } else {
            const res = await axiosInstance.get(`/users/${userId}`);
            setUser(res.data);
          }
        } catch (err) {
          setConsoleMsg("An error occurred while fetching the profile 😿 try again later");
          setShowErrorModal(true);
          console.error(err);
        } finally {
          setLoadingUser(false);
        }
      };
      
      // Chiama il fetch solo se userId è disponibile (per i visitatori)
      if (!isMe && userId) {
        fetchUser();
      } else if (isMe && loggedUser) {
          // Chiama il fetch per il mio profilo se sono loggato
          fetchUser();
      }
      
    }, [token, userId, isMe, loggedUser]);

  // Effect to log other infos once user is available
  useEffect(() => {
    if (
      user &&
      !loadingPosts &&
      !loadingCommunities &&
      !loadingFollowers &&
      !loadingFollowing
    ) {
      console.log("--------------------------------------------");
      console.log("User:", user);
      console.log("Posts:", posts);
      console.log("Communities:", communities);
      console.log("Followers:", followers);
      console.log("Following:", following);
      console.log("--------------------------------------------");
    }
  }, [
    user,
    posts,
    communities,
    followers,
    following,
    loadingPosts,
    loadingCommunities,
    loadingFollowers,
    loadingFollowing,
  ]);

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
            <Col sm={9} className="mx-auto">
              <UserHeader
                isMe={isMe}
                user={user}
                followers={followers}
                following={following}
                communities={communities}
                posts={posts}
                setFollowers={setFollowers}
              />
            </Col>
            <Col sm={stillNotActive.length > 0 ? 9 : 12}>
              <h3 className="mb-3">Posts</h3>

              <UserPosts posts={posts} />
            </Col>
            {stillNotActive.length > 0 && (
              <Col sm={3}>
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
