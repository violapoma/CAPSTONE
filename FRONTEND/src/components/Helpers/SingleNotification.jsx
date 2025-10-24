import { Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../../../data/axios";
import { useState } from "react";

function SingleNotification({ notification, setNotifications }) {
  if (!notification || !notification.from) return null;

  const fromAdmin = notification.from.username === 'superadmin'; 

  const [notif, setNotif] = useState(notification);

  const { from, category, sourceModel, source, meta } = notification;
  const needPic = category !== "community";

  const categoryConfig = {
    like: {
      text: `liked your ${sourceModel?.toLowerCase()}`,
      link: `/communities/${meta?.communityId}/posts/${sourceModel === 'Post'? source : meta?.postId}`,
    },
    dislike: {
      text: `didn't like your ${sourceModel?.toLowerCase()}`,
      link: `/communities/${meta?.communityId}/posts/${sourceModel === 'Post'? source : meta?.postId}`,
    },
    comment: {
      text: "commented on your ",
      link: `communities/${meta?.communityId}/posts/${source}`,
    },
    reply: {
      text: "replied to your ",
      link: `communities/${meta?.communityId}/posts/${source}`,
    },
    follow: {
      text: "started following you",
      link: `/users/${from._id}`,
    },
    unfollow: {
      text: "stopped following you",
      link: `/users/${from._id}`,
    },
    community: {
      text: `your community is now ${meta?.details || "updated"}`,
      link: `/communities/${source}`,
    },
  };

  const config = categoryConfig[category] || {
    text: "sent you a notification",
    link: "#",
  };

 const handleRead = async () => {
    if (notif.read) return;
    try {
      await axiosInstance.patch(`/notifications/${notification._id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notification._id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  return (
    <Row className={`align-items-center py-1 ${notification.read ? "text-secondary" : "fw-bold"}`} onClick={handleRead}>
      {needPic && notification.from ? (
        <Col sm={2}>
          <Image
            src={notification.from.profilePic}
            roundedCircle
            style={{ width: "2em", height: "2em" }}
          />
        </Col>
      ) : (
        <Col sm={2}>
          <i className="bi bi-exclamation-octagon fs-3" />
        </Col>
      )
      }
      <Col sm={10} className={`ps-0 `}>
        {!fromAdmin && (
          <Link to={`/users/${notification.from._id}`} className="fw-bold">
            {notification.from.username}
          </Link>
        ) }{" "}
        {config.text}{" "}
        {notification.source && notification.category !== 'community' &&(
          <Link to={config.link} className="fw-bold">
            {notification.sourceModel.toLowerCase()}
          </Link>
        )}
      </Col>
    </Row>
  );
}

export default SingleNotification;
