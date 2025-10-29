import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";
import { useEffect, useState } from "react";
import LazyLoadedAvatar from "../Helpers/LazyLoadedListItem";

function CommunityMembersModal({
  showMembers,
  setShowMembers,
  memberList = [],
}) {
  const { loggedUser } = useAuthContext();
  const SKELETON_COUNT = memberList?.length > 0 ? memberList.length : 5;
  const [showSkeleton, setShowSkeleton] = useState(true);

  const handleClose = () => {
    setShowMembers(false);
    setShowSkeleton(true);
  };

  //fake delay
  useEffect(() => {
    if (showMembers) {
      setShowSkeleton(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showMembers]);
  return (
    <Modal centered scrollable show={showMembers} onHide={handleClose}>
      <Modal.Header closeButton className="border-0">
        Members
      </Modal.Header>
      <Modal.Body className="d-flex flex-column px-5">
        
        {memberList?.length > 0 ? (
          memberList.map((m) => (
            <Link
              to={m._id === loggedUser._id ? "/" : `/users/${m._id}`}
              key={m._id}
              className="mb-3 hovering d-flex align-items-center" 
              onClick={handleClose}
            >
              <LazyLoadedAvatar 
                src={m.usesAvatar ? m.avatarRPM : m.profilePic} 
                username={m.username}
                className="profilePicList" 
              />

              {m.username}
            </Link>
          ))
        ) : (
          <p>Still no members</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
export default CommunityMembersModal;
