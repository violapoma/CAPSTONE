import { useSignUpProvider } from "../../contexts/signUpContext";
import AllCommunitiesPreview from "../AllCommunitiesPreview";

function Step4() {
  const { formData, profilePic } = useSignUpProvider();
  console.log("entering step4, formData: ", formData);
  console.log('entering step4, profilePic', profilePic );

  return (
    <>
      <AllCommunitiesPreview />
    </>
  );
}

export default Step4;
