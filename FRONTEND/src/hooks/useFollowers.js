import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";

export function useFollowers(userId) {
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [errorFollowers, setErrorFollowers] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchFollowers = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}/followers`);
        setFollowers(res.data);
      } catch (err) {
        setErrorFollowers(err);
        console.error("Error fetching followers:", err);
      } finally {
        setLoadingFollowers(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  return { followers, setFollowers, loadingFollowers, errorFollowers };
}