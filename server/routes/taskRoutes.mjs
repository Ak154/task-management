import express from "express";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskController.mjs";
const router = express.Router();

// router.use(authmiddleware);
router.post("/", createTask);
router.get("/", getTasks);
router.post("/:id", getTaskById)
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
export default router;