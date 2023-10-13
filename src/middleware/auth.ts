import { Request, Response, NextFunction } from "express";

const authToken = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export { authToken };
