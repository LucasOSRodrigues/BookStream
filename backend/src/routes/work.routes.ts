import { Router } from "express";
import { WorkController } from "../controllers/work.controller";
import { WorkService } from "../services/work.service";
import { IWorkRepository } from "../repositories/interfaces/IWorkRepository";

const workRouter = Router();
const workService = new WorkService({} as IWorkRepository);
const workController = new WorkController(workService);

workRouter.post("/", workController.createWork);
workRouter.get("/:work_id", workController.getWorkById);
workRouter.get("/genre/:genre", workController.getWorksByGenre);
workRouter.put("/:work_id", workController.updateWork);
workRouter.delete("/:work_id", workController.deleteWork);

export default workRouter;