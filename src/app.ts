import express from "express";
import Router from "./routes/taskRoute";

const app = express();

app.use(express.json());

app.use("/api/v1", Router);

export default app;
