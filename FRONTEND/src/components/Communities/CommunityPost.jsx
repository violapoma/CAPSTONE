function CommunityPost({ post }) {
  function decodeHtmlEntities(encodedStr) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(encodedStr, "text/html");
    return dom.documentElement.textContent;
  }

  function getTextPreview(html, maxLength = 200) {
  // Decodifica se serve
  const decoded = decodeHtmlEntities(html);

  // Crea un elemento temporaneo e ottieni il testo visibile
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = decoded;
  const text = tempDiv.textContent || tempDiv.innerText || "";

  // Rimuove spazi multipli e tronca
  const cleanText = text.replace(/\s+/g, " ").trim();

  return cleanText.length > maxLength
    ? cleanText.slice(0, maxLength) + "..."
    : cleanText;
}
  return (
    <div className={`community-post-item `}>
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
