import { useOutletContext, useParams } from "react-router-dom";
import CommunityPostContainer from "../components/Communities/CommunityPostContainer";

function CommunityPage() {
  const { commId } = useParams();

  const { community, isMember, isModerator } = useOutletContext();


  return (
    <>
     
        <CommunityPostContainer
          communityId={commId}
          commStyle={community?.style}
        />
   
    </>
  );
}

export default CommunityPage;
