import { Col, Form } from "react-bootstrap";
import { useSignUpProvider } from "../../contexts/signUpContext";
import { validateEmail, validatePassword, validateUsername } from "./validations";

function Step1() {
  const { formData, repeatPw, setRepeatPw, handleChanges } = useSignUpProvider();

  //check for form.controls validity
  const { valid: emailValid, errors: emailErrors } = validateEmail(
    formData.email || ""
  );
  const { valid: usernameValid, errors: usernameErrors } = validateUsername(
    formData.username || ""
  );
  const { valid: pwValid, errors: pwErrors } = validatePassword(
    formData.password || ""
  );
  const repeatErrors =
    formData.password !== repeatPw && repeatPw ? ["Password mismatch"] : [];
    
  return (
    <>
      <Form.Group as={Col} sm="12" controlId="validationEmail">
        <Form.Label>
          Email <span className="asterisk">*</span>
        </Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="email@example.com"
          name="email"
          value={formData.email}
          onChange={handleChanges}
          isInvalid={emailErrors.length > 0}
          isValid={formData.email && emailErrors.length === 0}
        />
        <Form.Control.Feedback type="invalid">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {emailErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm="12" controlId="validationUsername">
        <Form.Label>
          Username <span className="asterisk">*</span>
        </Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChanges}
          isInvalid={usernameErrors.length > 0}
          isValid={formData.username && usernameErrors.length === 0}
        />
        <Form.Control.Feedback type="invalid">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {usernameErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm="12" controlId="validationPw">
        <Form.Label>
          Password <span className="asterisk">*</span>
        </Form.Label>
        <Form.Control
          required
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChanges}
          isInvalid={pwErrors.length > 0}
          isValid={formData.password && pwErrors.length === 0}
        />
        <Form.Control.Feedback type="invalid">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {pwErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group as={Col} sm="12" controlId="validationRPw">
        <Form.Label>
          Repeat password <span className="asterisk">*</span>
        </Form.Label>
        <Form.Control
          required
          type="password"
          placeholder="Password"
          name="password"
          value={repeatPw}
          onChange={(e) => setRepeatPw(e.target.value)}
          isInvalid={repeatErrors.length > 0}
          isValid={repeatPw && repeatErrors.length === 0}
        />
         <Form.Control.Feedback type="invalid">
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            {repeatErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </Form.Control.Feedback>
      </Form.Group>
    </>
  );
}

export default Step1;
