import express from "express";
import { task } from "./routes/taskRoute";
const app = express();

app.use(express.json());

app.use("/api/v1", task);

export default app;
