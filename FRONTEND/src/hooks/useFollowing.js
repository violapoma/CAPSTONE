import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";

export function useFollowing(userId) {
  const [following, setFollowing] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [errorFollowing, setErrorFollowing] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchFollowing = async () => {
      try {
        const res = await axiosInstance.get(`/users/${userId}/following`);
        setFollowing(res.data);
      } catch (err) {
        setErrorFollowing(err);
        console.error("Error fetching followers:", err);
      } finally {
        setLoadingFollowing(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return { following, loadingFollowing, errorFollowing };
}