import { useEffect, useState } from "react";
import { Button, Offcanvas, ListGroup, Badge } from "react-bootstrap";
import SingleNotification from "./Helpers/SingleNotification";
import { useAuthContext } from "../contexts/authContext";
import axiosInstance from "../../data/axios";

function NotificationPanel() {
  const { loggedUser } = useAuthContext();
  const [show, setShow] = useState(false); //offcanvas

  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false); 

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling ogni 15s, opzionale
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [loggedUser]);

  const hasUnread = notifications.some(n => !n.read);


  return (
    <>
      <div
        className="position-relative cursorPointer d-flex align-items-center me-2"
        onClick={handleShow}
      >
        <i className="bi bi-bell fs-3 text-dark" />
        {hasUnread && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "0.5em",
              height: "0.5em",
              borderRadius: "50%",
              backgroundColor: "red",
            }}
          />
        )}
      </div>

      {/* Offcanvas laterale */}
      <Offcanvas show={show} onHide={handleClose} onClick={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {
            //{user: userid, notifications:[]}
            notifications.length > 0 ? (
              <ListGroup variant="flush">
                {notifications.map((n) => (
                  <ListGroup.Item action key={n._id}>
                    <SingleNotification notification={n} setNotifications={setNotifications} />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted text-center mt-3">
                No notifications yet
              </p>
            )
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NotificationPanel;
