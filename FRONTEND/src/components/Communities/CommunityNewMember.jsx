import { Button } from "react-bootstrap";
import CommunityHeader from "./CommunityHeader";

function CommunityNewMember({community, isMember, isModerator}){

  return(
    <>
    <CommunityHeader community={community} amIMember={isMember} amIModerator={isModerator} />
    {/* <Button variant="outline-secondary">
      <i className="bi bi-plus-square me-3" />
      Join
    </Button> */}
    </>
  )

}

export default CommunityNewMember;