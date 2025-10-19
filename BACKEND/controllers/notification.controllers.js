import User from "../models/User.js";

/**
 * user.notification can contain (MAX_NOTIFICATION) notificaiotn, this function add a new one and pops the oldest if needed.
 * @param {*} request
 * @param {*} response
 * @returns the new notification
 */
export async function createNotification(request, response) {
  // const { userId } = request.params;
  const userId = request.loggedUser._id; 
  const payload = request.body;
  let notif = {
    from: payload.from,
    category: payload.category,
    sourceModel: payload.sourceModel,
    read: false,
  };
  
  switch(payload.category) {
    case 'follow':
    case 'unfollow':
      break;
    case 'like':
    case 'dislike':
    case 'comment':
    case 'reply':
      notif.source = payload.source; // postId or commentId
      break;
    case 'community':
      notif.source = payload.source; // communityId
      break;
    default:
      break;
  }
  try {
    const user = await User.findById(userId);
    if (!user)
      return response.status(404).json({ message: `User ${userId} NOT FOUND` });

    if(payload.category != 'community'){ //verifying sender
      const sender = await User.findById(payload.from);
      if (!sender)
      return response.status(404).json({ message: `Sender ${payload.from} NOT FOUND` });
    }

    user.notifications.unshift(notif);
    if (user.notifications.length > Number(process.env.MAX_NOTIFICATIONS))
      user.notifications.pop();

    await user.save();
    return response.status(201).json(user.notifications);
  } catch (err) {
    return response.status(500).json({
      message: `Error adding a notification for user with id: ${userId}`,
      error: err.message,
    });
  }
}

/**
 *
 * @param {*} request
 * @param {*} response
 * @returns all notification for a specified user
 */
export async function getAllNotifications(request, response) {
  const userId = request.loggedUser.id; 
  try {
    const user = await User.findById(userId).populate([
      { path: "notifications.from", select: "username profilePic" },
      { path: "notifications.source" } 
    ]);
    if (!user)
      return response.status(404).json({ message: `User ${userId} NOT FOUND` });
    return response
      .status(200)
      .json({ user: userId, notifications: user.notifications });
  } catch (err) {
    return response.status(500).json({
      message: `Error fetching notifications for user with id: ${userId}`,
      error: err.message,
    });
  }
}

/**
 * changes the satus of read from false to true
 * @param {*} request 
 * @param {*} response 
 * @returns status 204 if the update is successful
 */
export async function changeNotificationStatus(request, response) {
  const { notificationId } = request.params;
  const userId = request.loggedUser.id; 

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, "notifications._id": notificationId },
      { $set: { "notifications.$.read": true } },
      { new: true }
    );
    if (!user)
      return response.status(404).json({ message: `Notification ${notificationId} not found for user ${userId}` });
    return response.status(200).json({message: `Notification ${notificationId} marked as read`}); 
  } catch (err) {
    return response.status(500).json({
      message: `Error changing notifications status for notification id: ${notificationId}`,
      error: err.message,
    });
  }
}
