import Cleave from "cleave.js/react";
import { Col, Form } from "react-bootstrap";
import { useSignUpProvider } from "../../contexts/signUpContext";
import { validateBirthDate, validateFirstName } from "./validations";

function Step2() {
  const { formData, handleChanges } = useSignUpProvider();

  const { errors: firstNameErrors } = validateFirstName(
    formData.firstName || ""
  );
  const { valid: dateValid, errors: dateErrors } = validateBirthDate(
    formData.dateOfBirth || ""
  );
  return (
    <>
      <Form.Group as={Col} sm={12} controlId="validationName">
        <Form.Label>
          First name <span className="asterisk">*</span>
        </Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="First name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChanges}
          isInvalid={firstNameErrors.length > 0}
          isValid={formData.firstName && firstNameErrors.length === 0}
        />
        <Form.Control.Feedback type="invalid">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {firstNameErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm={12} controlId="validationLastname">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChanges}
        />
      </Form.Group>
      <Form.Group as={Col} sm="6" controlId="validationBirthday">
        <Form.Label>
          Date of birth <span className="asterisk">*</span>
        </Form.Label>

        <Cleave
          className={`form-control ${
            dateErrors.length > 0
              ? "is-invalid"
              : formData.dateOfBirth && dateErrors.length === 0
              ? "is-valid"
              : ""
          }`}
          options={{ date: true, datePattern: ["d", "m", "Y"] }}
          value={formData.dateOfBirth}
          name="dateOfBirth"
          onChange={handleChanges}
          placeholder="dd/mm/yyyy"
          required
        />
        <Form.Control.Feedback type="invalid">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {dateErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
}

export default Step2;
