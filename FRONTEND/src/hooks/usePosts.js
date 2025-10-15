import { useEffect, useState } from "react";
import axiosInstance from "../../data/axios";

export function usePosts(userId){
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState([]); 
  const [errorPosts, setErrorPosts] = useState(null);

  useEffect(()=>{
    if(!userId) return; 
    const fetchPosts = async() => {
      try{
        const res = await axiosInstance.get(`/users/${userId}/posts`);
        setPosts(res.data);
      }catch (err) {
        setErrorPosts(err);
        console.error("Error fetching followers:", err);
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchPosts();
  }, [userId]);

  return {posts, loadingPosts, errorPosts}; 
}