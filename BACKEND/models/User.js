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
    required: true,
  },
  firstName: {type: String, required: true, trim: true},
  lastName: {type: String, required: true, trim: true},
  dateOfBirth: {type: Date, required:true},
  username: {type: String, required:true, unique:true},
  bio: {type:String, trim:true},
  profilePic: {type: String, default: "TODO: metti-default-profile-pic"},
  googleId: {type: String},
  
  notification:[NotificationSchema]
});

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next(); 

  try{
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch(err){
    next(err); 
  }
}); 

UserSchema.methods.comparePassword = async function(givenPw){
  if(!this.password) throw new Error('This user does not have a saved password'); 

  return await bcrypt.compare(givenPw, this.password); 
}; 

const User = mongoose.model('User', UserSchema); 
export default User;