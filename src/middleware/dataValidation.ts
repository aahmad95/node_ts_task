import { body, param, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";


// create Task
export const ValidateTask = [
    body("title")
      .isString()
      .withMessage("The description is must and should be a string."),
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

    function(req: Request, res: Response, next: NextFunction) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ msg: "Invalid Input Data", error: errors.array() });
      }
      next();
    },
];

// update User
export const ValidateIdInt = [
    param("id").isInt().withMessage("The id should be a number."),

    function(req: Request, res: Response, next: NextFunction) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ msg: "Invalid Input Data", error: errors.array() });
      }
      next();
    },
];


