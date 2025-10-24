import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";
import CommunityNewMember from "./Communities/CommunityNewMember";
import CommunityHeader from "./Communities/CommunityHeader";
import MyLoader from "./Helpers/MyLoader";
import CommunityPostContainer from "./Communities/CommunityPostContainer";

function CommunityMember() {
  const { commId } = useParams();
  const { loggedUser } = useAuthContext();
  const location = useLocation();
  const userId = loggedUser?._id;

  const navigate = useNavigate(); 

  const isCommunityHome = location.pathname === `/communities/${commId}`;

  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSetIsMember = (status) => {
    setIsMember(status);
  };

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    const fetchCommunityAndCheckIfMember = async () => {
      setIsLoading(true);
      try {
        const comm = (await axiosInstance.get(`/communities/${commId}`)).data;
        console.log("comm.data", comm);
        const foundMember = !!comm.members?.find(
          (m) => m?._id.toString() === userId.toString()
        );
        const mod = comm.moderator._id.toString() === userId.toString();
        console.log("member of community", foundMember);
        console.log("moderator of community", mod);
        setCommunity(comm);
        setIsMember(foundMember);
        setIsModerator(mod);
      } catch (err) {
        if (err.response && (err.response.status === 404 || err.response.status === 403)) {
          navigate('/non-existing');
        } 
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommunityAndCheckIfMember();
  }, [commId, userId]);

  
  //new
  const isMemberContext = {
    community,
    isMember,
    isModerator,
    handleSetIsMember,
  };

  const handleUpdateCommunity = (updatedCommunity) => {
    setCommunity(updatedCommunity); // setCommunity appartiene a questo componente
  }; 

  //new
  if (isLoading || !userId) {
    return <MyLoader />;
  }

  console.log('iscommunityhome', isCommunityHome);
  //TODO: CHECK IF THIS WORKS -> NO
  //return new
  return (
    <>
      <CommunityHeader
        community={community}
        amIMember={isMember}
        amIModerator={isModerator}
        onSetIsMember={handleSetIsMember}
        onUpdateCommunity={handleUpdateCommunity}
        showFullImage={isCommunityHome}
      />
      {isMember || isModerator ? (
        <>
          {/* <CommunityPostContainer
            communityId={commId}
            commStyle={community?.style}
          /> */}
          <Outlet context={isMemberContext} />
        </>
      ) : (
        <CommunityNewMember
          community={community}
          isMember={isMember}
          isModerator={isModerator}
        />
      )}
    </>
  );
  /*return (
    <>
      {isMember || isModerator ? (
        <Outlet /> //communityPage
      ) : (
        <CommunityNewMember
          community={community}
          isMember={isMember}
          isModerator={isModerator}
        />
      )}
    </>
  );*/
}

export default CommunityMember;
