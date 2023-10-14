import express from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controller/taskController';
import authToken from "../middleware/auth";
import { ValidateIdInt, ValidateTask } from "../middleware/dataValidation";

const Route = express.Router();

// Create a new Task
Route.post(
  "/task",
  authToken,
  ValidateTask,
  createTask
);
// Retrieve a task by its ID
Route.get(
  "/task/:id",
  authToken,
  ValidateIdInt,
  getTaskById
);
// // Update a specific task
Route.put(
  "/task/:id",
  authToken,
  ValidateIdInt,
  ValidateTask,
  updateTask
);
// // Delete a specific task
Route.delete(
  "/task/:id",
  authToken,
  ValidateIdInt,
  deleteTask
);
// Retrieve all tasks
Route.get("/tasks", authToken, getAllTasks);

export default Route;
