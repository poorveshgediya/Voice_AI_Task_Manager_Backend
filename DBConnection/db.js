import mongoose from "mongoose";
import "dotenv/config"

export async function DBConnect() {
  try {
    // await mongoose.connect("mongodb://localhost:27017/Voice_AI_Task_Manager");
    await mongoose.connect(process.env.MONGODB_URI,{
      dbName:'Voice_AI_Task_Manager'
    });
    console.log("DB Connected");
  } catch (err) {
    console.error("Error DBConnect ==> ", err);
  }
}
