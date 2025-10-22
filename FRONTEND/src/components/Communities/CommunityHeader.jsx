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
}) {
  const [showMembers, setShowMembers] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [loadingJoin, setLoadingJoin] = useState(false); 

  const handleOpen = () => {
    setShowEditModal(true);
  };

  const handleJoinCommunity = ()=>{
    setLoadingJoin(true); 
    try{
      const path = `/communities/${community?._id}/${(amIMember || amIModerator) ? 'join' : 'leave'}`; 
      console.log(path); 
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
      }, 3000);
      // return () => clearTimeout(timer);
    }
  }, [community]);

  console.log("amIModerator in header", amIModerator);

  return (
    <>
      {community && (
        <Row
          className="mw-75 mx-auto g-5 mt-3 position-relative rounded"
          style={{
            overflow: "hidden",
          }}
        >
          <Col sm={12} className="p-0 ">
            <Image
              src={community.cover}
              fluid
              className="w-100 h-400 rounded-top"
            />
          </Col>
          <Col
            sm={12}
            className="position-absolute w-100 d-flex justify-content-between align-items-end community-banner"
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
                className="d-flex gap-3 align-items-center"
                style={{
                  opacity: isReady ? 1 : 0,
                  transition: "opacity 0.1s ease-in-out",
                }}
              >
                {amIMember && (
                  <Link to={`/communities/${community._id}/posts/add-post`}>
                    <Button variant="outline-secondary" className="rounded-2">
                      <i className="bi bi-plus-square me-2" />
                      Add post
                    </Button>
                  </Link>
                )}

                <Button variant="outline-secondary" className="rounded-2" onClick={handleJoinCommunity}>
                  {amIMember ? (
                    <i className="bi bi-dash-square me-2"></i>
                  ) : (
                    <i className="bi bi-plus-square me-2"></i>
                  )}
                  {/* TODO: HELL BUTTON */}
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
