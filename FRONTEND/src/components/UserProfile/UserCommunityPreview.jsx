import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import CommunityDetails from "../Modals/CommunityDetails";

function UserCommunityPreview({ communities }) {
  const [showCommDetails, setShowCommDetails] = useState(false); //join not active community modal
  const [selectedId, setSelectedId] = useState(null);
  const handleOpen = ()=>{
    setShowCommDetails(true);
  }
  const handleClose = ()=>{
    setShowCommDetails(false); 
    setSelectedId(null); 
  }

  const handleSelected = (commId)=>{
    setSelectedId(commId); 
    handleOpen();
  }

  return (
    <>
      {communities.moderatorOf ? (
        <Row className="g-3">
          {communities.moderatorOf
            ?.filter((c) => !c.active)
            .map((c) => {
              return (
                  <Col sm={12} key={c._id} className="fs-3 cursorPointer " onClick={()=>handleSelected(c._id)}>
                    <img
                      src={c.cover}
                      alt="cover prw"
                      className="profilePicList me-3"
                    />
                    {c.name}
                  </Col>
              );
            })}
        </Row>
      ) : (
        <p> No communities yet </p>
      )}
      <CommunityDetails commId={selectedId} showCommDetails={showCommDetails} setShowCommDetails={setShowCommDetails} />
    </>
  );
}

export default UserCommunityPreview;
