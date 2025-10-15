import { useState } from "react";

function CommunityPostList({commId}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async() => {
    try{
      
    } catch(err){
      console.log(err);
    } finally{
      setLoading(false);
    }
  }

}
export default CommunityPostList;