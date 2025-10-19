import { PacmanLoader } from "react-spinners";

function MyLoader() {
  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <PacmanLoader />
    </div>
  );
}

export default MyLoader;
