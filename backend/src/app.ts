import express from "express";
import workRouter from "./routes/work.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/works", workRouter);
app.use(errorHandler)

export default app;
