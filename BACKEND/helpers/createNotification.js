// helpers/notificationHelper.js
import User from "../models/User.js";

  /**
   * targetUserId = who recives the notification
   * payload = {
   *   from: ObjectId of the user who triggers the notif
   *   category: "like" | "dislike" | "comment" | "reply" | "community" | "follow" | "unfollow"
   *   source: optional, ObjectId of post/comment/community
   *   sourceModel: optional, "Post"|"Comment"|...
   *   meta: opzionale { commentId, details }
   * }
   */
export async function createNotification(targetUserId, payload) {
  try {
    const user = await User.findById(targetUserId);
    if (!user) throw new Error(`User ${targetUserId} NOT FOUND`);

    const notif = {
      from: payload.from,
      category: payload.category,
      read: false,
    };

    if (["like", "dislike", "comment", "reply", "community"].includes(payload.category)) {
      notif.source = payload.source;
      notif.sourceModel = payload.sourceModel;
    }

    if (payload.meta) notif.meta = payload.meta;

    user.notifications.unshift(notif);

    const maxNotifications = Number(process.env.MAX_NOTIFICATIONS || 50);
    if (user.notifications.length > maxNotifications) user.notifications.pop();

    await user.save();
    return notif;
  } catch (err) {
    console.error("Error adding notification:", err);
    throw err;
  }
}
