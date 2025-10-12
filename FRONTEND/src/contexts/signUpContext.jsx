import { createContext, useContext, useState } from "react";
import {
  validateBirthDate,
  validateEmail,
  validateFirstName,
  validatePassword,
  validateUsername,
} from "../components/SignUp/validations";
import axios from "../../data/axios";
import { useAuthContext } from "./authContext";
import { useSignUpLoaderProvider } from "./loaderSignUpContext";

const SignUpContext = createContext();

export function SignUpProvider({ children }) {
  const { login, setLoggedUser } = useAuthContext();
  
  const STEP_NUMBER = 4;
  const [repeatPw, setRepeatPw] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    bio: "",
    //profilePic: "",
  });
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [chosenCommunity, setChosenCommunity] = useState(""); //step4

  //error modal
  const [consoleMsg, setConsoleMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [nextHover, setNextHover] = useState(false);
  const [prevHover, setPrevHover] = useState(false);

  const maxChars = 300;
  const [bioLength, setBioLength] = useState(formData.bio?.length || 0);

  // handlers
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBioChange = (e) => {
    handleChanges(e);
    setBioLength(e.target.value.length);
  };

  const addProfilePic = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file)); //preview
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    setConsoleMsg("");
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setConsoleMsg("");
  };

  // validations
  const validateStep = async () => {
    let valid = true;

    if (currentStep === 1) {
      const { valid: pwValid } = validatePassword(formData.password);
      const { valid: emailValid } = validateEmail(formData.email);
      const { valid: usernameValid } = validateUsername(formData.username);

      if (!pwValid || !emailValid || !usernameValid || formData.password !== repeatPw) {
        valid = false;
      }

      const existing = await checkExisting();
      if (existing){
        valid = false;
        formData.email = '';
        formData.username = '';
      } 
    }

    if (currentStep === 2) {
      const { valid: firstNameValid } = validateFirstName(formData.firstName);
      const { valid: birthValid } = validateBirthDate(formData.dateOfBirth);
      if (!firstNameValid || !birthValid) valid = false;
    }

    return valid;
  };

  const handleNextStep = async () => {
    const valid = await validateStep();
    if (valid) {
      if (currentStep === 4) {
        await createUser();
      }
      nextStep();
    } else {
      setShowErrorModal(true);
    }
  };

  /**
   * @returns false if username and email are not found in db
   */
  const checkExisting = async () => {
    try {
      console.log("entering checkExisting");
      const res = await axios.get("/auth/check", {
        params: { email: formData.email, username: formData.username },
      });
      console.log("res", res);
      console.log("res.data.exists", res.data.exists);
      if (!res.data.exists) {
        //ok
        return false;
      } else {
        //not ok
        setConsoleMsg(res.data.message);
        return true;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setConsoleMsg(error.response.data.message);
          console.log("consoleMsg", consoleMsg);
          return true;
        } else if (error.response.status === 500) {
          setConsoleMsg("Internal server error, try again later");
        } else {
          setConsoleMsg(`${error.response.data.message}`);
        }
      }
    }
  };

  // user creation - in handlesubmit
  const createUser = async () => {
    console.log("Form data before registration:", formData);

    try {
      // sign up wth/ profilePic
      const res = await axios.post("/auth/register", formData);
      const { user, jwt } = res.data;

      login(jwt);
      setLoggedUser(user);

      // update profilePic if existing 
      if (profilePic) {
        const fd = new FormData();
        fd.append("profilePic", profilePic);

        const resPic = await axios.patch("/me/profile-pic", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Profile picture updated:", resPic.data);

        setLoggedUser((prev) => ({ ...prev, profilePic: resPic.data.profilePic }));
      }

      // join first community
      if (chosenCommunity) {
        const resJoin = await axios.patch(`/communities/${chosenCommunity}/join`);
        console.log(`Joined community ${chosenCommunity}:`, resJoin.data);

        setLoggedUser((prev) => ({
          ...prev,
          communities: [...(prev.communities || []), resJoin.data.community],
        }));
      }
    } catch (error) {
      console.error("Error in createUser:", error.response || error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 500) setConsoleMsg("Internal server error, try again later");
        else if (status === 400) setConsoleMsg("Invalid request");
        else setConsoleMsg(data.message || "Unknown error");
      } else {
        setConsoleMsg("Network error or server unreachable");
      }
      setShowErrorModal(true);
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        STEP_NUMBER,
        currentStep,
        formData,
        consoleMsg,
        showErrorModal,
        repeatPw,
        maxChars,
        bioLength,
        nextHover,
        prevHover,
        profilePic,
        chosenCommunity,
        setChosenCommunity,
        setProfilePic,
        setPrevHover,
        setNextHover,
        setRepeatPw,
        addProfilePic,
        handleBioChange,
        setConsoleMsg,
        handleChanges,
        handleNextStep,
        prevStep,
        setShowErrorModal,
        createUser,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

export function useSignUpProvider() {
  return useContext(SignUpContext);
}
