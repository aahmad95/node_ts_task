import { Response, Request } from "express";
import { Task } from "../types/taskTypes";
import { fetchTaskById, fetchTasks, getTasksByCategory, getTasksByUsername, insertTask, modifyTask, removeTask } from '../utils/task';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const create = insertTask(body as Task);
    if (create) {
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
    const { id } = req.params;
    
    const getTask = fetchTaskById(parseInt(id));
    
    if (getTask.length === 0) {
      return res
        .status(404)
        .json({ msg: "Requested Task is not present in the table.", data: [] });
    } else {
      return res
        .status(200)
        .json({ msg: "Task successfully retrieved.", data: getTask });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
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
        .json({ msg: "Something went wrong"});
    }
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const parseId = parseInt(id);

    const update = modifyTask(parseId, body);

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
