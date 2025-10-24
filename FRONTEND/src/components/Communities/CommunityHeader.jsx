import { useEffect, useState } from "react";
import { Badge, Button, Col, Image, Row } from "react-bootstrap";
import { communityCSSVars } from "../../utils/communityCssVars";
import { Link } from "react-router-dom";
import EditComminityModal from "../Modals/EditCommunityModal";
import CommunityMembersModal from "../Modals/CommunityMembersModal";
import axiosInstance from "../../../data/axios";

function CommunityHeader({
  community,
  amIMember,
  amIModerator,
  onUpdateCommunity,
  onSetIsMember,
  showFullImage
}) {
  const [showMembers, setShowMembers] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [loadingJoin, setLoadingJoin] = useState(false); 

  const imageHeightClass = showFullImage ? "h-400" : "h-100px";

  const handleOpen = () => {
    setShowEditModal(true);
  };

  const handleJoinCommunity = async()=>{
    setLoadingJoin(true); 
    const isJoining = !amIMember && !amIModerator; 
    try{
      const path = `/communities/${community?._id}/${isJoining ? 'join' : 'leave'}`; 
      console.log(path); 
      const res = await axiosInstance.patch(path);
      onSetIsMember(isJoining)
    }catch(err){
      console.log(err); 
    } finally{
      setLoadingJoin(false); 
    }
  }

  //delay
  useEffect(() => {
    if (community) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 30);
      // return () => clearTimeout(timer);
    }
  }, [community]);

  console.log('img')

  return (
    <>
      {community && (
        <Row
          className="mx-auto g-0 mt-3 rounded shadow-lg"
          style={{
            overflow: "hidden",
            maxWidth: '75%',
          }}
        >
          <Col sm={12} className="p-0 order-0">
            <Image
              src={community.cover}
              fluid
              className={`w-100 ${imageHeightClass} rounded-top`}
              style={{
                minHeight: showFullImage ? '400px' : '100px', 
                objectFit: 'cover'
              }}
            />
          </Col>
          <Col
            sm={12}
            className="p-3 d-flex flex-column flex-lg-row justify-content-between align-items-lg-end community-banner"
            style={{ ...communityCSSVars(community.style) }}
          >
            <div>
              <h1>{community.name}</h1>
              <p onClick={() => setShowMembers(true)} className="cursorPointer">
                {community.members?.length || 0} members
              </p>
              <div>
                {community.topic?.map((t, idx) => (
                  <Badge
                    key={idx}
                    pill
                    style={{
                      marginRight: "5px",
                      fontSize: "1em",
                      fontWeight: "semibold",
                      "--badge-color": community.style?.secondaryColor,
                      "--text-color": community.style?.titleColor,
                    }}
                    className="topic-badge"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            {isReady && (
              <div
                className="d-flex gap-3 align-items-center mt-3 mt-lg-0"
                style={{
                  opacity: isReady ? 1 : 0,
                  transition: "opacity 0.1s ease-in-out",
                }}
              >
                {amIMember && (
                  <Link to={`/communities/${community._id}/posts/add-post`}>
                    <Button variant="secondary" className="rounded-2">
                      <i className="bi bi-plus-square me-2" />
                      Add post
                    </Button>
                  </Link>
                )}

                <Button variant={`${amIMember ? 'secondary' : 'success'}`} className={`rounded-2 ${!amIMember && 'join-pulse'}`} onClick={handleJoinCommunity}>
                  {amIMember ? (
                    <i className="bi bi-dash-square me-2"></i>
                  ) : (
                    <i className="bi bi-plus-square me-2"></i>
                  )}
                  {isReady && amIMember ? "Leave" : "Join"} 
                </Button>

                {amIModerator && (
                  <Button
                    variant="outline-secondary"
                    className="rounded-2"
                    onClick={handleOpen}
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
      )}
      <EditComminityModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        community={community}
        onUpdateCommunity={onUpdateCommunity}
      />
      <CommunityMembersModal
        showMembers={showMembers}
        setShowMembers={setShowMembers}
        memberList={community?.members}
      />
    </>
  );
}

export default CommunityHeader;
