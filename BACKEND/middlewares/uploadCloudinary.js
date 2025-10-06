import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid"; // genera UUID univoci


// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage per profilePic utenti
const userpicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Capstone/Users",
    format: "png",
    public_id: () => uuidv4(), 
  },
});

// Storage per cover community
const communityStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Capstone/Community",
    format: "jpg",
    public_id: () => uuidv4(),
  },
});

// Storage per cover post
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Capstone/Posts",
    format: "png",
    public_id: () => uuidv4(), 
  },
});


// Middleware multer
export const uploadProfilePic = multer({ storage: userpicStorage });
export const uploadCommunityCover = multer({ storage: communityStorage });
export const uploadPostCover = multer({ storage: postStorage });