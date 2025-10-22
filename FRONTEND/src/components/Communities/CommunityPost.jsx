import { communityCSSVars } from "../../utils/communityCssVars";

function CommunityPost({ post, commStyle }) {
  function getTextPreview(html, maxLength = 200) {
    const decoded = decodeHtmlEntities(html);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = decoded;
    const text = tempDiv.textContent || tempDiv.innerText || "";

    const cleanText = text.replace(/\s+/g, " ").trim();

    return cleanText.length > maxLength
      ? cleanText.slice(0, maxLength) + "..."
      : cleanText;
  }
  return (
    <div
      className={`community-post-item hovering shadow-lg community-banner`}
      style={commStyle ? {...communityCSSVars(commStyle) } : {}}
    >
      <h3>{post.title}</h3>
      <p>{getTextPreview(post.content)}</p>
      {post.cover && (
        <div className="post-media-wrapper">
          <img src={post.cover} alt="Post media" />
        </div>
      )}
    </div>
  );
}

export default CommunityPost;

function decodeHtmlEntities(encodedStr) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(encodedStr, "text/html");
  return dom.documentElement.textContent;
}
