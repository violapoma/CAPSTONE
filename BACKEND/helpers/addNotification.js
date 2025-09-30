import User from "../models/User.js";

/**
 * Adds one notification to userId, keeps 50 notification top
 * @param {String} userId - reciving user
 * @param {Object} notification - notification object
 */
export async function addNotification(userId, notification) {
  return User.updateOne(
    { _id: userId },
    {
      $push: {
        notifications: {
          $each: [notification],
          $position: 0,
          $slice: 50
        }
      }
    }
  );
}

// HOWTO:await Promise.all(members.map(user => addNotification(user._id, notification)));