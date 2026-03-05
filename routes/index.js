import e from "express";
import { CreateTask, FetchTask } from "../controller/index.js";

const route = e.Router();

route.post('/CreateTask',CreateTask)
route.get('/FetchTask',FetchTask)

export default route