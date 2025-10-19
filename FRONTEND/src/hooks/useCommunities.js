import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";

export function useCommunities(userId) {
  const [communities, setCommunities] = useState([]); 
  const [stillNotActive, setStillNotActive] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true); 
  const [errorCommunities, setErrorCommunities] = useState(null); 

  useEffect(()=>{
    if(!userId) return; 
    const fetchCommunities = async () => {
      try{
        const res = await axiosInstance.get(`/users/${userId}/communities`); //moderatorOf memberOf
        console.log('communityHook, communities', res.data);
        setCommunities(res.data);
        setStillNotActive( res.data.moderatorOf?.filter(c =>c.status === 'approved' && !c.active) );
        console.log('communityHook, stillNotActive', res.data.moderatorOf?.filter(c => !c.active));
      }catch (err) {
        setErrorCommunities(err);
        console.error("Error fetching communities:", err);
      } finally {
        setLoadingCommunities(false);
      }
    }

    fetchCommunities()
  }, [userId]);

  return {communities, stillNotActive, loadingCommunities, errorCommunities} ; 
}