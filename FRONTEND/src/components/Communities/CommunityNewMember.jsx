import { Button } from "react-bootstrap";
import CommunityHeader from "./CommunityHeader";

function CommunityNewMember({ community, isMember, isModerator }) {
  console.log("[commNewMember]: isMember", isMember);

  return (
    <>
      {/* <CommunityHeader
        community={community}
        amIMember={isMember}
        amIModerator={isModerator}
      /> */}

      <div className="notMemberInfo join-pulse">
        Hit join to see <i>{community?.name}</i>'s content!
        
      </div>
    </>
  );
}

export default CommunityNewMember;
