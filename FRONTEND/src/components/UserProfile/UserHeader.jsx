import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DetailsModal from "./DetailsModal";
import { useAuthContext } from "../../contexts/authContext";
import axiosInstance from "../../../data/axios";

function UserHeader({
  isMe,
  user,
  followers = [],
  following = [],
  posts = [],
  communities = [],
  setFollowers
}) {

  const { loggedUser } = useAuthContext();
  const [showDetails, setShowDetails] = useState(false);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);
  
  const [activeAsModerator, setActiveAsModerator] = useState([]);
  const [activeAsMember, setActiveAsMember] = useState([]);
  const [totalCommunities, setTotalCommunities] = useState(null);
 
  useEffect(() => {
    if (!loggedUser) return;
    if (isMe) {
      setAlreadyFollowing(true); 
      return; 
    } 
    const already = followers.some((f) => 
        f.follower?._id?.toString() === loggedUser._id?.toString()
    );
    setAlreadyFollowing(already);
  }, [followers, loggedUser, isMe]);

  useEffect(()=>{
    // 1. Filtra i dati direttamente dalla prop 'communities'
    const moderatingActive = communities.moderatorOf?.filter(c => c.active) || []; 
    const memberActive = communities.memberOf?.filter(c=>c.active) || []; 

    // 2. Aggiorna gli stati per la modale
    setActiveAsModerator(moderatingActive); 
    setActiveAsMember(memberActive); 
    
    // 3. Calcola e imposta il totale usando i nuovi array filtrati (che sono immediatamente disponibili qui)
    const newTotal = moderatingActive.length + memberActive.length;
    setTotalCommunities(newTotal); 
    
    // Dipendenza corretta: solo la prop 'communities'
  },[communities] );

  const handleFollowToggle = async () => {
    if (!loggedUser) return;
    const loggedUserIdString = loggedUser._id?.toString();

    try {
      if (alreadyFollowing) {
        await axiosInstance.delete(`/follow-list/remove/${user._id}`); 
        setFollowers(prev => prev.filter(f => 
            f.follower?._id?.toString() !== loggedUserIdString
        ));
        setAlreadyFollowing(false);  
      } else {
        await axiosInstance.post(`/follow-list/add/${user._id}`);
        const newFollowerObject = { follower: loggedUser, _id: 'temp_id_' + Date.now() }; 
        setFollowers(prev => [...prev, newFollowerObject]); 
        setAlreadyFollowing(true);
      }
    } catch (err) {
      console.error("Follow/unfollow error:", err);
    }
  };

  return (
    <>
      <Row className="pb-4 border-bottom border-secondary">
        <Col sm={3} className="">
          <img
            src={user.profilePic}
            alt="profile picture"
            className="profileImg"
          />
        </Col>
        <Col sm={9} className="">
          <Row className="justify-content-between">
            <Col sm={4} className="fw-bold fs-2">
              {user.username}
            </Col>
            {isMe ? (
              <Col sm={4}>
                <Button variant="outline-secondary" className="button">
                  Edit
                </Button>
              </Col>
            ) : (
              <Col sm={4}>
                <Col sm={4}>
                  <Button
                    variant='outline-secondary'
                    onClick={handleFollowToggle}
                  >
                    {alreadyFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </Col>
              </Col>
            )}
          </Row>
          <Row
            className="my-4 fs-6 justify-content-start cursorPointer"
            onClick={() => setShowDetails(true)}
          >
            <Col className="d-flex flex-grow-0 me-3">
              {posts?.length || 0} <span className="fw-bold ms-1">posts</span>
            </Col>
            <Col className="d-flex flex-grow-0 me-3">
              {totalCommunities}{" "}
              <span className="fw-bold ms-1">communities</span>
            </Col>
            <Col className="d-flex flex-grow-0 me-3">
              {followers?.length || 0}{" "}
              <span className="fw-bold ms-1">followers</span>
            </Col>
            <Col className="d-flex flex-grow-0">
              {following?.length || 0}{" "}
              <span className="fw-bold ms-1">following</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <DetailsModal
        followers={followers}
        following={following}
        activeAsModerator={activeAsModerator}
        activeAsMember={activeAsMember}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
    </>
  );
}

export default UserHeader;