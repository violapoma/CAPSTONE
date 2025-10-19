import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../data/axios";
import CommunityHeader from "../components/Communities/CommunityHeader";
import { useAuthContext } from "../contexts/authContext";
import CommunityPostContainer from "../components/Communities/CommunitypostContainer";
import { Container } from "react-bootstrap";
import MyLoader from "../components/Helpers/MyLoader";

function CommunityPage() {
  const { commId } = useParams();
  const { loggedUser } = useAuthContext();

  const [amIMember, setAmIMember] = useState(false);
  const [amIModerator, setAmIModerator] = useState(false);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consoleMsg, setConsoleMsg] = useState("");

  const fetchCommunity = async () => {
    if (!commId) {
      setConsoleMsg("Invalid request, community id was not recived");
      return;
    }
    try {
      const res = await axiosInstance.get(`/communities/${commId}`);
      console.log("fetched community", res.data);
      setCommunity(res.data);
      const foundMember = !!res.data.members.find(
        (m) => m._id === loggedUser._id
      );
      const foundModerator = res.data.moderator._id === loggedUser._id;
      setAmIMember(foundMember);
      console.log("amImember", foundMember);
      setAmIModerator(foundModerator);
      console.log("amIModerator", foundModerator);
    } catch (err) {
      setConsoleMsg("Something wen wrong while fetching community");
      console.log("error fetching community", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCommunity = (updatedCommunity) => {
    setCommunity(updatedCommunity);
  };

  useEffect(() => {
    if (commId && loggedUser?._id) {
      fetchCommunity();
    }
  }, [commId, loggedUser]);

  return (
    <>
      {loading ? (
          <MyLoader />
      ) : community ? (
        <>
          <CommunityHeader
            community={community}
            amIMember={amIMember}
            amIModerator={amIModerator}
            onUpdateCommunity={handleUpdateCommunity}
          />
          
          {amIMember ? (
            <CommunityPostContainer communityId={commId} />
          ) : (
            <p className="text-center mt-5">devi essere membro per vedere i contenuti</p>
          )}
        </>
      ) : (
        <p className="text-center mt-5">
          {consoleMsg || "There was a problem while loading community"}
        </p>
      )}
    </>
  );
}

export default CommunityPage;
