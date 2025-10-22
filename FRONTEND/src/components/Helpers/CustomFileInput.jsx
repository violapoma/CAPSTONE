import { useRef, useState } from "react";
import { Form, Col, Button, Row } from "react-bootstrap";

function CustomFileInput({ addPic, rounded, disabled }) {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  //drag & drop
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);

    //preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    addPic({ target: { files } });
  };

  //to open file picker
  const handleClick = () => fileRef.current.click();

  //drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <Form.Group
      as={Row}
      controlId="validationImage"
      className="flex-column align-items-center "
      style={{ pointerEvents: `${disabled ? "none" : "all"}` }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`dragAndDrop d-flex align-items-center justify-content-center text-secondary ${
          rounded ? "rounded-circle" : "w-100"
        } ${isDragging && "bg-dragging"}`}
      >
        {!fileName && "Drag & drop a file here or click to select"}
        {preview && (
          <div className="imgpreview">
            <img
              src={preview}
              alt="Preview"
              className={rounded ? "avatarPreview" : "coverPreview"}
            />
          </div>
        )}
      </div>

      <Form.Control
        type="file"
        name="profilePic"
        onChange={(e) => handleFiles(e.target.files)}
        ref={fileRef}
        style={{ display: "none" }}
      />
    </Form.Group>
  );
}

export default CustomFileInput;
