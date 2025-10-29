import DOMPurify from "dompurify";

function ContentPreview({content}) {
  const cleanHtml = DOMPurify.sanitize(content);

  return (
    <>
    <label>Preview</label>
    <div className="preview-box mt-2 p-3 border rounded" style={{maxHeight: '433px'}}>
      <div
        className="preview-content h-100"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
    </>
  );
}
export default ContentPreview; 