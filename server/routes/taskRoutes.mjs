import express from "express";
import { createTask, deleteTask, getTaskById, getTasksAssignedBy, getTasksAssignedTo, updateStatus, updateTask } from "../controllers/taskController.mjs";
import { authmiddleware } from "../middlewares/auth.mjs";
const router = express.Router();

// router.use(authmiddleware);
router.post("/create", authmiddleware, createTask);
router.post("/", authmiddleware, getTasksAssignedBy);
router.post("/:id", authmiddleware, getTasksAssignedTo)
router.post("/get-task/:id", authmiddleware, getTaskById)
router.put("/:id", authmiddleware, updateTask);
router.delete("/:id", authmiddleware, deleteTask);
router.put("/status/:id", authmiddleware, updateStatus);
export default router;