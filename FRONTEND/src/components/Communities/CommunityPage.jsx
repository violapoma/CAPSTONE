import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../data/axios";
import CommunityHeader from "./CommunityHeader";
import { useAuthContext } from "../../contexts/authContext";

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

  useEffect(() => {
    if (commId && loggedUser?._id) {
      fetchCommunity();
    }
  }, [commId, loggedUser]);

  return (
    <>
      {!loading && community && (
        <CommunityHeader
          community={community}
          amIMember={amIMember}
          amIModerator={amIModerator}
        />
      )}
      {amIMember ? (<p>contenuto community</p>):(<p>devi essere membro per veder ei contenuti</p>)}

    </>
  );
}

export default CommunityPage;
