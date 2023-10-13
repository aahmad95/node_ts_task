import { param, body } from "express-validator";

// create Task
console.log('body', body);
const ValidateTask = [
  body("title")
    .isString()
    .withMessage("The title is must and should be a string."),
  body("description")
    .isString()
    .withMessage("The description is must and should be a string."),
  body("creation_date")
    .isString()
    .withMessage("The creation_date is must and should be a string."),
  body("due_date")
    .isString()
    .withMessage("The due_date is must and should be a string."),
  body("assigned_to")
    .isString()
    .withMessage("The assigned_to is must and should be a string."),
  body("category")
    .isString()
    .withMessage("The category is must and should be a string."),
  body("status")
    .isString()
    .withMessage("The status is must and should be a string"),
];

// update User
const ValidateIdInt = [
  param("id").isInt().withMessage("The id should be a number."),
];

// get task

export const dataValidation = { ValidateTask, ValidateIdInt };
