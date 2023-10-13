//- Design the task model with the following attributes:
// - ID (Unique Identifier)
// - Title
// - Description
// - Creation Date
// - Due Date
// - Assigned To
// - Category
// - Status (Pending/Completed)

import { task } from "../types/taskTypes";
const tasks: Array<task> = [];

export const insertTask = (taskData: task): boolean => {
//   if(Object.keys(taskData)){
//     return false;
//   }
  let indexes: number[] = tasks.map((task) => {
    return task.id ? task.id : 0;
  });
  let maxIndex: number = 0;
  if (indexes.length > 0) {
    maxIndex = Math.max(...indexes);
  }

  taskData.id = maxIndex + 1;
  let index = tasks.push(taskData);
  if (index === tasks.length) {
    return true;
  } else {
    return false;
  }
};
export const fetchTasks = (): Array<task> => {
  return tasks;
};
export const fetchTaskById = (id: number): Array<task> => {
  return tasks.filter((task) => task.id === id);
};
export const modifyTask = (id: number, taskData: task): boolean => {
  let index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...taskData };
    return true;
  } else {
    return false;
  }
};
export const removeTask = (id: number): boolean => {
  let index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    return true;
  } else {
    return false;
  }
};
export const getTasksByUsername = (username: string): Array<task> => {
  return tasks.filter((task) => task.assigned_to === username);
};
export const getTasksByCategory = (category: string): Array<task> => {
  return tasks.filter((task) => task.category === category);
};

// module.exports = {
//     createTask,
//     getAllTasks,
//     getTaskById,
//     updateTask,
//     deleteTask,
//     getTasksByUsername,
//     getTasksByCategory,
// }

