import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import NotificationSchema from "./Notification.js";

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "invalid password",
    ],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  dateOfBirth: { type: Date },
  username: { type: String, required: true, unique: true },
  bio: { type: String, trim: true },

  profilePic: {
    type: String,
    default:
      "https://res.cloudinary.com/dm9gnud6j/image/upload/v1759652432/nopicuser_wgqx0d.png",
  },
  avatarRPM: String,
  usesAvatar: { type: Boolean, default: false },

  googleId: { type: String },

  notifications: { type: [NotificationSchema], default: [] },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // if (!this.username) {
    //   let baseUsername = this.firstName
    //     ? this.firstName.toLowerCase().replace(/\s+/g, "")
    //     : "user";

    //   let candidate = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
    //   let existingUser = await mongoose.models.User.findOne({ username: candidate });

    //   while (existingUser) {
    //     candidate = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
    //     existingUser = await mongoose.models.User.findOne({ username: candidate });
    //   }

    //   this.username = candidate;
    // }

    next();
  } catch (err) {
    next(err);
  }
});


UserSchema.methods.comparePassword = async function (givenPw) {
  if (!this.password)
    throw new Error("This user does not have a saved password");

  return await bcrypt.compare(givenPw, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
