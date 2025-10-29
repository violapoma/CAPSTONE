import { communityCSSVars } from "../../utils/communityCssVars";

function CommunityPost({ post, commStyle }) {

  return (
    <div
      className={`community-post-item hovering shadow-lg community-banner`}
      style={commStyle ? {...communityCSSVars(commStyle) } : {}}
    >
      <h3>{post.title}</h3>
      {post.subtitle && <h4 className="fw-normal fs-5">{post.subtitle}</h4>}
      {post.cover && (
        <div className="post-media-wrapper">
          <img src={post.cover} alt="Post media" />
        </div>
      )}
    </div>
  );
}

export default CommunityPost;
