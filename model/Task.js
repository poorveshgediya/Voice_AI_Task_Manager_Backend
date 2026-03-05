import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
});

export const Task = mongoose.model("task", taskSchema);
