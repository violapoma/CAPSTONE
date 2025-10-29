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
import MyLoader from "../components/Helpers/MyLoader";

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
                <Row className="mb-3 signUpRow mx-auto gy-4 align-items-center">
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

