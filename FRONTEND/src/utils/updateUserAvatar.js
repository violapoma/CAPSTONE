import axiosInstance from "../../data/axios";

export async function updateUserAvatar(avatarURL){
  try{
    const res = await axiosInstance.patch('/me/avatarRPM', {avatarURL: avatarURL} ); 
    console.log('updating avatar', res.data); 
    return res.data;
  } catch(err){
    console.log(err.message);
  }
}