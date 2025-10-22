import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";
import CommunityNewMember from "./Communities/CommunityNewMember";

function CommunityMember() {
  const { commId } = useParams();
  const { loggedUser } = useAuthContext();
  const userId = loggedUser?._id;

  const [community, setCommunity] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfMember = async () => {
      setIsLoading(true);
      try {
        const comm = await axiosInstance.get(`/communities/${commId}`);
        const member = comm.data.members.find(
          (m) => m._id.toString() === userId.toString()
        );
        const mod = comm.data.moderator._id.toString() === userId.toString();
        console.log("member of community", member);
        console.log("moderator of community", mod);
        setCommunity(comm.data);
        setIsMember(!!member);
        setIsModerator(!!mod);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    checkIfMember();
  }, [commId, userId]);

  //TODO: CHECK IF THIS WORKS -> NO
  return (
    <>
      {isMember || isModerator ? (
        <Outlet />
      ) : (
        <CommunityNewMember
          community={community}
          isMember={isMember}
          isModerator={isModerator}
        />
      )}
    </>
  );
}

export default CommunityMember;
