import { PacmanLoader } from "react-spinners";

function MyLoader(){
  return(
    <div>
      <PacmanLoader />
      <p className="fs-6">Just a moment please...</p>
    </div>
  )
}

export default MyLoader;