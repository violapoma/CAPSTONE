import DOMPurify from "dompurify";

function ContentPreview({content}) {
  const cleanHtml = DOMPurify.sanitize(content);

  return (
    <>
    <label>Preview</label>
    <div className="preview-box mt-2 p-3 border rounded">
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
    </>
  );
}
export default ContentPreview; 