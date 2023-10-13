import express from "express";
// import { taskController } from "../controller/taskController";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controller/taskController';
import { authToken } from "../middleware/auth";
import { dataValidation } from "../middleware/dataValidation";

const task = express.Router();

// Create a new Task
task.post(
  "/task",
  authToken,
  dataValidation.ValidateTask,
  createTask
);
// Retrieve a task by its ID
task.get(
  "/task/:id",
  authToken,
  dataValidation.ValidateIdInt,
  getTaskById
);
// // Update a specific task
task.put(
  "/task/:id",
  authToken,
  dataValidation.ValidateIdInt,
  dataValidation.ValidateTask,
  updateTask
);
// // Delete a specific task
task.delete(
  "/task/:id",
  authToken,
  dataValidation.ValidateIdInt,
  deleteTask
);
// Retrieve all tasks
task.get("/tasks", authToken, getAllTasks);

export { task };
