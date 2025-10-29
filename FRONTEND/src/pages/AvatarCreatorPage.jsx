import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarCreator} from "@readyplayerme/react-avatar-creator";
import { useAuthContext } from "../contexts/authContext";
import { updateUserAvatar } from "../utils/updateUserAvatar";

const AvatarCreatorPage = () => {

  const {loggedUser, setLoggedUser} = useAuthContext();

  const navigate = useNavigate();
  const avatarKey = useRef(Date.now());
  const [avatarPNG, setAvatarPNG] = useState(null); 


  const handleOnAvatarExport = async (evt) => {
    try {
      const avatarURL = evt.data?.url;
      if (!avatarURL) throw new Error("Avatar URL missing");
  
      console.log("Avatar 3D URL .glb:", avatarURL);
      const pngURL = avatarURL.replace(".glb", ".png");
      setAvatarPNG(pngURL);
      console.log("Avatar PNG URL:", pngURL);
  
      const updated = await updateUserAvatar(pngURL); 
      setLoggedUser(updated); 
      console.log('avatarPNG', pngURL);
      
      navigate('/', { state: { fromEdit: true } });
    } catch (err) {
      console.error("Error exporting avatar:", err);
      alert("Non è stato possibile salvare l'avatar, riprova.");
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.data?.source === "readyplayerme" && event.data?.type === "avatar_exported") {
        console.log("Message from RPM:", event.data);
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Bottone "Chiudi" */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10000,
          background: "rgba(255,255,255,0.15)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "18px",
          cursor: "pointer",
          backdropFilter: "blur(5px)",
          pointerEvents: "auto",
        }}
        title="Chiudi"
      >
        ✕
      </button>

      <AvatarCreator
        key={avatarKey.current }
        subdomain="chitchat-fb4pnw"
        config={{clearCache: true}}
        onAvatarExported={handleOnAvatarExport}
        onLoaded={() => console.log("🎨 Avatar Creator loaded")}
      />
    </div>
  );
};

export default AvatarCreatorPage;
