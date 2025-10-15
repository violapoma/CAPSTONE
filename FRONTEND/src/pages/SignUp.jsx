import { useSignUpProvider } from "../contexts/signUpContext";
import StepRenderer from "../components/SignUp/StepRenderer";
import ErrorModal from "../components/Modals/ErrorModal";
import {
  Button,
  Card,
  Container,
  Form,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import { useSignUpLoaderProvider } from "../contexts/loaderSignUpContext";
import MyLoader from "../components/MyLoader";

function SignUp() {
  const {
    STEP_NUMBER,
    currentStep,
    handleNextStep,
    prevStep,
    formData,
    consoleMsg,
    setConsoleMsg,
    showErrorModal,
    setShowErrorModal,
    nextHover,
    setNextHover,
    prevHover,
    setPrevHover,
    createUser,
  } = useSignUpProvider();

  const { signUpLoader, setSignUpLoader } = useSignUpLoaderProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Final data:", formData);
    setSignUpLoader(true);
    try {
      await createUser();
      //TODO: MIGLIORA
      alert("Registrazione completata!");
    } catch (err) {
      setConsoleMsg("Error during account creation");
      setShowErrorModal(true);
    } finally {
      setSignUpLoader(false);
    }
  };
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      {signUpLoader ? (
        <MyLoader />
      ) : (
        <Container>
          <ProgressBar
            now={(currentStep / STEP_NUMBER) * 100}
            label={`${currentStep} / ${STEP_NUMBER}`}
            className="mw-70 mx-auto mb-5"
          />
          <Card className="shadow-sm mx-auto mw-75 h80pc">
            <Card.Body>
              <h3 className="text-center mb-4">
                Sign up - step {currentStep}/{STEP_NUMBER}
              </h3>
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3 w-50 mx-auto gy-4 align-items-center">
                  <StepRenderer />

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-secondary"
                      onMouseEnter={() => setPrevHover(true)}
                      onMouseLeave={() => setPrevHover(false)}
                      className={`button ${currentStep === 1 && "invisible"}`}
                      onClick={prevStep}
                    >
                      <i
                        className={`bi ${
                          prevHover
                            ? "bi-arrow-left-circle-fill"
                            : "bi-arrow-left-circle"
                        }`}
                      />{" "}
                      Prev
                    </Button>

                    <Button
                      type="button"
                      variant="outline-secondary"
                      onMouseEnter={() => setNextHover(true)}
                      onMouseLeave={() => setNextHover(false)}
                      className={`button ${currentStep === 4 && "d-none"}`}
                      onClick={handleNextStep}
                    >
                      Next{" "}
                      <i
                        className={`bi ${
                          nextHover
                            ? "bi-arrow-right-circle-fill"
                            : "bi-arrow-right-circle"
                        }`}
                      />
                    </Button>

                    {currentStep === 4 && (
                      <Button
                        type="submit"
                        variant="success"
                        className="button"
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      )}
      <ErrorModal
        consoleMsg={consoleMsg}
        show={showErrorModal}
        setShow={setShowErrorModal}
      />
    </div>
  );
}
export default SignUp;
// import Cleave from "cleave.js/react";
// import { useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Col,
//   Container,
//   Form,
//   ProgressBar,
//   Row,
// } from "react-bootstrap";
// import CustomFileInput from "../components/CustomFileInput";
// import AllCommunitiesPreview from "../components/AllCommunitiesPreview";
// import axios from "../../data/axios";
// import ErrorModal from "../components/ErrorModal";
// function SignUp() {
//   const STEP_NUMBER = 4;

//   const [step, setStep] = useState(1);
//   const [repeatPw, setRepeatPw] = useState("");
//   const [profilePic, setProfilePic] = useState("");
//   const [consoleMsg, setConsoleMsg] = useState("");
//   const [show, setShow] = useState(false);
//   const [nextHover, setNextHover] = useState(false);
//   const [prevHover, setPrevHover] = useState(false);
//   const [validated, setValidated] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "", //step1 *
//     password: "", //step1 *
//     username: "", //step1 *
//     firstName: "", //step2 *
//     lastName: "", //step2
//     dateOfBirth: "", //step2 *
//     bio: "", //step3
//     profilePic: "", //step3
//     community: "", //step 4 *
//   });

//   const nextStep = () => {
//     setStep((prev) => prev + 1);
//     setValidated(false);
//     setConsoleMsg("");
//   };

//   const prevStep = () => {
//     setStep((prev) => prev - 1);
//     setValidated(false);
//     setConsoleMsg("");
//   };

// function validateEmail(email = "") {
//   const errors = [];

//   if (!email) {
//     errors.push("Email is required");
//     return { valid: false, errors };
//   }

//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!regex.test(email)) {
//     errors.push("Email format not valid (example@smth.com)");
//   }

//   return { valid: errors.length === 0, errors };
// }

// function validatePassword(password = "") {
//   const errors = [];

//   if (!password) {
//     errors.push("Password is required");
//     return { valid: false, errors };
//   }

//   if (password.length < 8) {
//     errors.push("Password must be at least 8 characters long");
//   }

//   if (!/[a-z]/.test(password)) {
//     errors.push("Password must contain at least 1 lowercase letter");
//   }

//   if (!/[A-Z]/.test(password)) {
//     errors.push("Password must contain at least 1 uppercase letter");
//   }

//   if (!/\d/.test(password)) {
//     errors.push("Password must contain at least 1 number");
//   }

//   if (!/[@$!%*?&]/.test(password)) {
//     errors.push("Password must contain at least 1 symbol (@$!%*?&)");
//   }
//   return { valid: errors.length === 0, errors };
// }

// function validateUsername(username = "") {
//   const errors = [];

//   if (!username) {
//     errors.push("Username is required");
//     return { valid: false, errors };
//   }

//   const regex = /^(?![_.])[A-Za-z0-9._]+(?<![_.])$/;
//   if (!regex.test(username)) {
//     errors.push(
//       "Username can only contain letters, numbers and symbols . or -, but it cannot start or end with said symbols"
//     );
//   }

//   if (username.length < 3) errors.push("Username too short (3 char at least)");
//   if (username.length > 20) errors.push("Username too long (20 char tops)");

//   return { valid: errors.length === 0, errors };
// }

//   const gotoStep2 = async () => {
//     setValidated(true);
//     setConsoleMsg("");

//     if (!formData.email || !formData.username || !formData.password) return;

//     if (formData.password !== repeatPw) {
//       setConsoleMsg("Password mismatch");
//       return;
//     }
//     const { valid: validPw } = validatePassword(formData.password);
//     const { valid: emailValid } = validateEmail(formData.email);

//     if (!validPw || !emailValid) {
//       setValidated(false);
//       return;
//     }

// try {
//   const res = await axios.get("/auth/check", {
//     params: { email: formData.email, username: formData.username },
//   });
//   console.log("res", res);
//   console.log("res.data.exists", res.data.exists);
//   if (!res.data.exists) {
//     nextStep();
//   } else {
//     setConsoleMsg(res.data.message || "Email or username already in use");
//   }
// } catch (error) {
//   if (error.response) {
//     if (error.response.status === 409) {
//       setConsoleMsg(
//         error.response.data.message || "Email or username already taken"
//       );
//     } else if (error.response.status === 500) {
//       setConsoleMsg("Internal server error, try again later");
//     } else {
//       setConsoleMsg(`Unexpected error: ${error.response.status}`);
//     }
//   }
// } finally {
//   setValidated(false);
// }
//   };

//   useEffect(() => {
//     setPrevHover(false);
//     setNextHover(false);
//   }, [prevHover, nextHover]);

//   useEffect(() => {
//     if (consoleMsg) {
//       setShow(true);
//       setValidated(false);
//     } else {
//       setShow(false);
//     }
//   }, [consoleMsg]);

//   const maxChars = 300;
//   const [bioLength, setBioLength] = useState(formData.bio?.length || 0);

//   const handleBioChange = (e) => {
//     handleChanges(e);
//     setBioLength(e.target.value.length);
//   };

// function validateBirthDate(dateStr) {
//   const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/; //controllo formato && recupero cifre
//   const match = dateStr.match(regex); //array [dateStr, dd, mm, yyyy]
//   if (!match)
//     return { valid: false, message: "Formato non valido (dd/mm/yyyy)" };

//   const day = parseInt(match[1], 10);
//   const month = parseInt(match[2], 10);
//   const year = parseInt(match[3], 10);

//   const dateObj = new Date(`${year}-${month}-${day}`);
//   console.log("[validateBirthDate] dateObj", dateObj);
//   if (
//     dateObj.getFullYear() !== year ||
//     dateObj.getMonth() + 1 !== month ||
//     dateObj.getDate() !== day
//   ) {
//     return { valid: false, message: "Data inesistente" };
//   }

//     const today = new Date();
//     let age = today.getFullYear() - year;
//     if (
//       today.getMonth() + 1 < month ||
//       (today.getMonth() + 1 === month && today.getDate() < day)
//     ) {
//       age--;
//     }
//     if (age < 18) return { valid: false, message: "Devi essere maggiorenne" };

//     return { valid: true, message: "" };
//   }
// const addProfilePic = async (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setProfilePic(file);
//     setFormData({
//       ...formData,
//       avatar: URL.createObjectURL(file), //genera preview
//     });
//   }
// };

//   const handleChanges = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Dati finali:", formData);
//     alert("Registrazione completata!");
//   };

// //check for validity
// const { valid: emailValid, errors: emailErrors } = validateEmail(
//   formData.email || ""
// );
// const { valid: usernameValid, errors: usernameErrors } = validateUsername(
//   formData.username || ""
// );
// const { valid: pwValid, errors: pwErrors } = validatePassword(
//   formData.password || ""
// );
// const repeatErrors =
//   formData.password !== repeatPw && repeatPw ? ["Password mismatch"] : [];

//   return (
//     <Container className="mt-5">
//       <ProgressBar
//         now={(step / STEP_NUMBER) * 100}
//         label={`${step} / ${STEP_NUMBER}`}
//         className="mw-70 mx-auto mb-5"
//       />
//       <Card className="shadow-sm mx-auto mw-75 h80pc">
//         <Card.Body>
//           <h3 className="text-center mb-4">
//             Sign up - step {step}/{STEP_NUMBER}
//           </h3>
//           <Form
//             noValidate
//             //validated={validated}
//             onSubmit={handleSubmit}
//           >
//             <Row className="mb-3 w-50 mx-auto gy-4 align-items-center">
//               {step === 1 && (
//                 <>
//                   <Form.Group as={Col} sm="12" controlId="validationEmail">
//                     <Form.Label>
//                       Email <span className="asterisk">*</span>
//                     </Form.Label>
//                     <Form.Control
//                       required
//                       type="text"
//                       placeholder="email@example.com"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChanges}
//                       isInvalid={emailErrors.length > 0}
//                       isValid={formData.email && emailErrors.length === 0}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       <ul style={{ margin: 0, paddingLeft: "20px" }}>
//                         {emailErrors.map((err, index) => (
//                           <li key={index}>{err}</li>
//                         ))}
//                       </ul>
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                   <Form.Group as={Col} sm="12" controlId="validationUsername">
//                     <Form.Label>
//                       Username <span className="asterisk">*</span>
//                     </Form.Label>
//                     <Form.Control
//                       required
//                       type="text"
//                       placeholder="Username"
//                       name="username"
//                       value={formData.username}
//                       onChange={handleChanges}
//                       isInvalid={usernameErrors.length > 0}
//                       isValid={formData.username && usernameErrors.length === 0}
//                     />
//                      <Form.Control.Feedback type="invalid">
//                       <ul style={{ margin: 0, paddingLeft: "20px" }}>
//                         {usernameErrors.map((err, index) => (
//                           <li key={index}>{err}</li>
//                         ))}
//                       </ul>
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                   <Form.Group as={Col} sm="12" controlId="validationPw">
//                     <Form.Label>
//                       Password <span className="asterisk">*</span>
//                     </Form.Label>
//                     <Form.Control
//                       required
//                       type="password"
//                       placeholder="Password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChanges}
//                       isInvalid={pwErrors.length > 0}
//                       isValid={formData.password && pwErrors.length === 0}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                       <ul style={{ margin: 0, paddingLeft: "20px" }}>
//                         {pwErrors.map((err, index) => (
//                           <li key={index}>{err}</li>
//                         ))}
//                       </ul>
//                     </Form.Control.Feedback>
//                   </Form.Group>
//                   <Form.Group as={Col} sm="12" controlId="validationRPw">
//                     <Form.Label>
//                       Repeat password <span className="asterisk">*</span>
//                     </Form.Label>
//                     <Form.Control
//                       required
//                       type="password"
//                       placeholder="Password"
//                       name="password"
//                       value={repeatPw}
//                       onChange={(e) => setRepeatPw(e.target.value)}
//                       isInvalid={repeatErrors.length > 0}
//                       isValid={repeatPw && repeatErrors.length === 0}
//                     />
//                   </Form.Group>
//                   <Col sm={12} className="d-flex justify-content-end">
//   <Button
//     type="button"
//     variant="outline-secondary"
//     onMouseEnter={() => setNextHover(true)}
//     onMouseLeave={() => setNextHover(false)}
//     className="button"
//     onClick={gotoStep2} //TODO: SAME PW AND VALIDATION DB, THEN CALL NEXTSTEP
//   >
//     Next{" "}
//     <i
//       className={`bi ${
//         nextHover
//           ? "bi-arrow-right-circle-fill"
//           : "bi-arrow-right-circle"
//       }`}
//     />
//   </Button>
// </Col>
//                 </>
//               )}
//               {step === 2 && (
//                 <>
//                   <Form.Group as={Col} sm={12} controlId="validationName">
//                     <Form.Label>
//                       First name <span className="asterisk">*</span>
//                     </Form.Label>
//                     <Form.Control
//                       required
//                       type="text"
//                       placeholder="First name"
//                       name="firstName"
//                       value={formData.name}
//                       onChange={handleChanges}
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} sm={12} controlId="validationLastname">
//                     <Form.Label>Last Name</Form.Label>
//                     <Form.Control
//                       required
//                       type="text"
//                       placeholder="Last Name"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChanges}
//                     />
//                   </Form.Group>
//                   <Form.Group as={Col} sm="6" controlId="validationBirthday">
//                     <Form.Label>
//                       Date of birth <span className="asterisk">*</span>
//                     </Form.Label>
//                     <Cleave
//                       className="form-control"
//                       options={{ date: true, datePattern: ["d", "m", "Y"] }}
//                       value={formData.dateOfBirth}
//                       name="dateOfBirth"
//                       onChange={handleChanges}
//                       placeholder="dd/mm/yyyy"
//                       required
//                     />
//                   </Form.Group>

//                   <Col sm={12} className="d-flex justify-content-between">
// <Button
//   variant="outline-secondary"
//   onMouseEnter={() => setNextHover(true)}
//   onMouseLeave={() => setNextHover(false)}
//   className="button"
//   onClick={prevStep} //TODO: age validation then next
// >
//   <i
//     className={`bi ${
//       nextHover
//         ? "bi-arrow-left-circle-fill"
//         : "bi-arrow-left-circle"
//     }`}
//   />{" "}
//   Prev
// </Button>
//                     <Button
//                       variant="outline-secondary"
//                       onMouseEnter={() => setNextHover(true)}
//                       onMouseLeave={() => setNextHover(false)}
//                       className="button"
//                       onClick={nextStep}
//                     >
//                       Next{" "}
//                       <i
//                         className={`bi ${
//                           nextHover
//                             ? "bi-arrow-right-circle-fill"
//                             : "bi-arrow-right-circle"
//                         }`}
//                       />
//                     </Button>
//                   </Col>
//                 </>
//               )}
//               {step === 3 && (
// <>
//   <div className="position-relative">
//     <Form.Group as={Col} sm={12} controlId="validationBio">
//       <Form.Label>Bio</Form.Label>
//       <Form.Control
//         as="textarea"
//         rows={4}
//         maxLength={maxChars}
//         placeholder="Write a short bio..."
//         name="bio"
//         value={formData.bio}
//         onChange={handleBioChange}
//         required
//         className="bioTextArea"
//       />
//       <span
//         className={`charCounter ${
//           bioLength > 280 ? "asterisk" : "text-secondary"
//         }`}
//       >
//         {maxChars - bioLength} / {maxChars}
//       </span>
//     </Form.Group>
//   </div>
//   <Form.Group as={Col} sm="12" controlId="validationImage">
//     <CustomFileInput addProfilePic={addProfilePic} />
//   </Form.Group>

//   <Col sm={12} className="d-flex justify-content-between">
//     <Button
//       variant="outline-secondary"
//       onMouseEnter={() => setNextHover(true)}
//       onMouseLeave={() => setNextHover(false)}
//       className="button"
//       onClick={prevStep}
//     >
//       <i
//         className={`bi ${
//           nextHover
//             ? "bi-arrow-left-circle-fill"
//             : "bi-arrow-left-circle"
//         }`}
//       />{" "}
//       Prev
//     </Button>
//     <Button
//       variant="outline-secondary"
//       onMouseEnter={() => setNextHover(true)}
//       onMouseLeave={() => setNextHover(false)}
//       className="button"
//       onClick={nextStep} //todo: log the user otherwise error 401
//     >
//       Next{" "}
//       <i
//         className={`bi ${
//           nextHover
//             ? "bi-arrow-right-circle-fill"
//             : "bi-arrow-right-circle"
//         }`}
//       />
//     </Button>
//   </Col>
// </>
//               )}
//               {step === 4 && (
//                 <>
//                   <h3>Choose your first comunity!</h3>
//                   {/* <AllCommunitiesPreview /> */}
//                 </>
//               )}
//             </Row>
//           </Form>
//         </Card.Body>
//       </Card>

//       <ErrorModal consoleMsg={consoleMsg} show={show} setShow={setShow} />
//     </Container>
//   );
// }

// export default SignUp;
