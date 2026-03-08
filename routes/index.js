import e from "express";
import { CreateTask, DeleteTask, FetchTask } from "../controller/index.js";

const route = e.Router();

route.post('/CreateTask',CreateTask)
route.get('/FetchTask',FetchTask)
route.delete('/DeleteTask/:id',DeleteTask)

export default route