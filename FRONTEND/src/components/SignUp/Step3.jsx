import { Button, Col, Form } from "react-bootstrap";
import { useSignUpProvider } from "../../contexts/signUpContext";
import CustomFileInput from "../CustomFileInput";

function Step3() {
  const { formData, handleBioChange, maxChars, bioLength, addProfilePic, nextHover, setNextHover, handleNextStep, profilePic, setProfilePic } =
    useSignUpProvider();

  return (
    <>
      <div className="position-relative">
        <Form.Group as={Col} sm={12} controlId="validationBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            maxLength={maxChars}
            placeholder="Write a short bio..."
            name="bio"
            value={formData.bio}
            onChange={handleBioChange}
            required
            className="bioTextArea"
          />
          <span
            className={`charCounter ${
              bioLength > 280 ? "asterisk" : "text-secondary"
            }`}
          >
            {maxChars - bioLength} / {maxChars}
          </span>
        </Form.Group>
      </div>
      <Form.Group as={Col} sm="12" controlId="validationImage">
        <CustomFileInput addProfilePic={addProfilePic} />
      </Form.Group>
      <Button
        type="button"
        variant="outline-light"
        onMouseEnter={() => setNextHover(true)}
        onMouseLeave={() => setNextHover(false)}
        className="button "
        onClick={handleNextStep}
      >
        Skip for now{" "}
        <i
          className={`bi ${
            nextHover ? "bi-skip-end-circle-fill" : "bi-skip-end-circle"
          }`}
        />
      </Button>
    </>
  );
}

export default Step3;
