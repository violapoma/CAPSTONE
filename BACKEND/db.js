import mongoose from "mongoose";
import 'dotenv/config'; 

export async function connectDB(){
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI); 
    console.log('_____________connessione db avvenuta con successo_____________'); 
  } catch (error){
    console.log(error)
  }
}