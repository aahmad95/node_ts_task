//- Design the task model with the following attributes:
// - ID (Unique Identifier)
// - Title
// - Description
// - Creation Date
// - Due Date
// - Assigned To
// - Category
// - Status (Pending/Completed)

import { Task } from "../types/taskTypes";
import tasks from "../db/taskData";

export const insertTask = (taskData: Task): boolean => {

  const indexes: number[] =
    tasks &&
    tasks.map((task) => {
      return task.id ? task.id : 0;
    });

  let maxIndex: number = 0;
  if (indexes.length > 0) {
    maxIndex = Math.max(...indexes);
  }

  taskData.id = maxIndex + 1;
  const index = tasks.push(taskData);
  if (index === tasks.length) {
    return true;
  } else {
    return false;
  }
};

export const fetchTasks = (): Array<Task> | [] => {
  if (tasks?.length > 0) {
    return tasks;
  } else {
    return [];
  }
};

export const fetchTaskById = (id: number): any => {

  return tasks.filter((task) => task.id === id);
};

export const modifyTask = (id: number, taskData: Task): boolean => {
  let index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...taskData };
    return true;
  } else {
    return false;
  }
};

export const removeTask = (id: number): boolean => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

export const getTasksByUsername = (username: string): Array<Task> => {
  if (!username) {
    throw new Error("Requsted Data not found");
  }

  return tasks.filter((task) => task.assigned_to === username);
};

export const getTasksByCategory = (category: string): Array<Task> => {
  if (!category) {
    throw new Error("Requsted Data not found");
  }

  return tasks.filter((task) => task.category === category);
};
