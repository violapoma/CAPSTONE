import { useEffect, useState } from "react";
import axiosInstance from "../../../data/axios";
import CommunityPost from "./CommunityPost";
import { Link } from "react-router-dom";

function CommunityPostContainer({ communityId, commStyle }) {
  const [posts, setPosts] = useState([]);
  const bentoboxClasses = [
    "post-small",
    "post-medium",
    "post-tall",
    // "post-large",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await axiosInstance.get(
        `/communities/${communityId}/posts`
      );
      setPosts(posts.data);
      console.log("posts", posts.data);
    };
    fetchPosts();
  }, [communityId]);

  return (
    <div className="mw-80 mx-auto my-4 gy-5 community-posts-container">
      {posts &&
        posts?.map((post, index) => {
          const boxClass = bentoboxClasses[index % bentoboxClasses.length];
          return (
            <Link to={`/communities/${communityId}/posts/${post._id}`} key={post._id} className={`community-post-link ${boxClass}`}>
              <CommunityPost post={post} commStyle={commStyle}/>
            </Link>
          );
        })}
    </div>
  );
}

export default CommunityPostContainer;
