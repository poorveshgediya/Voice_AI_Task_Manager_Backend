import e from "express";
import { DBConnect } from "./DBConnection/db.js";
import taskRoute from "./routes/index.js";
import cors from "cors";
import "dotenv/config"

const app = e();
app.use(e.json())
app.use(cors())
DBConnect();
app.use('/task',taskRoute);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running and up on PORT: ${process.env.PORT}`)
})