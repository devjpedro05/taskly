import express from "express";
import { healthRouter } from "./routes/healthRoutes";

export const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(healthRouter);
