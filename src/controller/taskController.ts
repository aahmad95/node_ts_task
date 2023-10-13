import { Response, Request } from "express";
import { validationResult } from "express-validator";
import { task } from "../types/taskTypes";
import { fetchTaskById, fetchTasks, getTasksByCategory, getTasksByUsername, insertTask, modifyTask, removeTask } from '../utils/task';

export const createTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid Input Data", error: errors.array() });
    }

    const create = insertTask(req.body as task);
    if (!!create) {
      return res.status(200).json({
        msg: "Task created successfully",
      });
    }
    return res.status(500).json({
      msg: "Something went wrong",
    });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    let tasks;
    const {
      query: { assignedTo, category },
    } = req;

    if (assignedTo) {
      tasks = getTasksByUsername(assignedTo as string);
    } else if (category) {
      tasks = getTasksByCategory(category as string);
    } else {
      tasks = fetchTasks();
    }
    
    if(Array.isArray(tasks)) {
        return res.status(200).json({
            msg: "Successfully fetched all tasks.",
            data: tasks,
        });
    } else {
        throw new Error('Something Went wrong!')
    }
    
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid Input Data", errors: errors.array() });
    }

    const { id } = req.params;
    let task = fetchTaskById(parseInt(id));
    if (task.length === 0) {
      return res
        .status(404)
        .json({ msg: "Requested Task is not present in the table." });
    } else {
      return res
        .status(200)
        .json({ msg: "Task successfully retrieved.", data: task });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid Input Data", data: [], errors: errors.array() });
    }

    const id = parseInt(req.params.id);

    const task = removeTask(id);
    if (!task) {
      return res
        .status(404)
        .json({ msg: "Requested Task is not present in the table." });
    }

    return res
      .status(200)
      .json({ msg: "Requested Task is deleted successfully." });
  } catch (err) {
    if (!err) {
      //
      return res
        .status(500)
        .json({ msg: "Something went wrong", data: [], errors: [] });
    }
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: "Invalid Input Data", error: errors.array() });
    }

    const {
      params: { id },
      body,
    } = req;

    const parseId = parseInt(id);

    let update = modifyTask(parseId, body);
    if (update) {
      return res.status(200).json({
        msg: "Task updated successfully",
      });
    }
    return res.status(500).json({
      msg: "Task does not updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
};
