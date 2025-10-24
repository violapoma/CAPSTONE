# <img src="FRONTEND/public/imgs/chitchat-logo.png" alt="Logo Chitchat" width="20%" style="vertical-align: middle; margin-right: 0.5em"/> CHITCHAT

# Frontend and Backend

## Table of contents

- [Models](#models)
- [External Libraries](#external-libraries)
- [App](#app)

## Models

- **User** {<br>
  email: { type: String, required: true, unique: true, lowercase: true }, <br />
  password: { type: String, match: [ /^(?=._[a-z])(?=._[A-Z])(?=._\d)(?=._[@$!%*?&]).{8,}$/, "invalid password"], select: false }, <br/>
  role: { type: String, enum: ["user", "moderator", "admin"], default: "user" }, <br />
  firstName: { type: String, required: true, trim: true }, <br />
  lastName: { type: String, trim: true }, <br />
  dateOfBirth: { type: Date }, <br />
  username: { type: String, required: true, unique: true }, <br />
  bio: { type: String, trim: true },<br />
  profilePic: { type: String, default: "https://res.cloudinary.com/dm9gnud6j/image/upload/v1759652432/nopicuser_wgqx0d.png" }, <br />
  avatarRPM: String, <br />
  usesAvatar: { type: Boolean, default: false }, <br />
  googleId: { type: String }, <br />
  notifications: { type: [NotificationSchema], default: [] },<br />
  }<br>

- **FollowConnection** 
- {<br />
  follower: {type: Schema.Types.ObjectId, ref: 'User', required:true}, <br />
  following: {type: Schema.Types.ObjectId, ref: 'User', required:true}, <br />
  }, {timestamps: true} <br />

- **Community** {<br>
  name: { type: String, lowercase: true, required: true, immutable: true, unique: true},<br />
  topic: [{ type: String, required: true, immutable: true }], <br />
  cover: { type: String, default: "https://res.cloudinary.com/dm9gnud6j/image/upload/v1759663013/nocover_d78avw.jpg" }, <br />
  description: { type: String, required: true, max: 600},<br />
  guidelines: {type: String, max: 600}, <br />
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },<br />
  active: {type: Boolean, default: false}, <br />
  style: { backgroundColor: { type: String, default: "#f7f3f2" }, titleColor: { type: String default: "#000000" },secondaryColor: { type: String, default: "#d5c9c9" } },<br />
  moderator: { type: Schema.Types.ObjectId, ref: "User", required: true }, <br />
  members: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], required: true } <br />
  }

- **Post** {<br>
  title: {type: String, required: true, unique: true}, <br />
  subtitle: String, <br />
  content: {type: String, required: true},<br />
  cover: {type: String, default:"https://res.cloudinary.com/dm9gnud6j/image/upload/v1759786199/noimgPost_npspix.webp"}, <br />
  inCommunity: {type: Schema.Types.ObjectId, ref:'Community', required: true}, <br />
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true},<br />
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}], <br />
  dislikes: [{type: Schema.Types.ObjectId, ref: 'User'}], <br />
  }, {timestamps: true} <br>

- **Comment** {<br />
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, <br />
  parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, <br />
  child: { type: Schema.Types.ObjectId, ref: "Comment", default: null,
    <p style="margin-left: 2em;">
    child: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
    autopopulate: {
    populate: {
    path: "author",
    select: "username profilePic",
    },
    },
    },
    },
  </p>
  author: { type: Schema.Types.ObjectId, ref: "User", required: true }, <br />
  content: { type: String, required: true }, <br />
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], <br />
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }], <br />
  },
  { timestamps: true }

- **Notification** { <br />
  from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      populate: {
        populate: {
          path: "author",
          select: "username profilePic",
        },
      },
    }, <br />
    targetUser: {type: Schema.Types.ObjectId, ref: "User"}, <Br />
    category: {
      type: String,
      enum: ["like", "dislike", "comment", "reply", "community", "follow", "unfollow"],
      required: true,
    }, <br />
    sourceModel: {
      type: String,
      enum: ["Post", "Comment", "Community", "User", "FollowConnection"],
      required: function() {
        return this.category !== "follow" && this.category !== "unfollow";
      },
    }, <br />
    source: {
      type: Schema.Types.ObjectId,
      refPath: "sourceModel",
      autopopulate: true,
      required: function() {
        return this.category !== "follow" && this.category !== "unfollow";
      }
    }, <br />
    meta: {
      commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
      communityName: String,
      communityId: {type: Schema.Types.ObjectId, ref: "Community"},
      postId: {type: Schema.Types.ObjectId, ref: "Post"},
      details: String,
    }, <br />
    read: { type: Boolean, default: false }, <br />
  }, { timestamps: true }
 

## External libraries 
- **BACKEND**
  - **bycript** - to hash user's password
  - **cloudinary** - to store images in the cloud 
  - **joi** - to validate data before before arriving to Mongoose validation
- **FRONTEND**
  - **@readyplayerme/react-avatar-creator** - to allow users to create their avatar <br>
  - **cleave** - to create a mask for birth date input <br>
  - **dompurify** - to clean post and comment text before sending it to database, for safety reasons <br>
  - **react-colorful** - to add a custom color picker <br>
  - **react-quill** - to add a _rich text editor_

## App 
**[Back up](#frontend-and-backend)**
  ![structure](/structure.png)


