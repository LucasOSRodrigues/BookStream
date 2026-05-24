import { Request, Response, NextFunction } from "express"
import { WorkService } from "../services/work.service"
import { Work } from "../shared/types/Work"

type CreateWorkRequest = Work & { genres: string[] }

export class WorkController {
  constructor(private workService: WorkService) {}

  createWork = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const work: CreateWorkRequest = req.body

      if (!work.title) {
        res.status(400).json({ error: "Title is required" })
        return
      }
      if (!work.author_id) {
        res.status(400).json({ error: "Author is required" })
        return
      }
      if (!work.genres || work.genres.length < 1) {
        res.status(400).json({ error: "At least 1 genre is required" })
        return
      }

      const createdWork = await this.workService.createWork(work, work.genres)
      res.status(201).json(createdWork)
    } catch (error) {
      next(error)
    }
  }

  getWorkById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const work_id = req.params.work_id?.toString()

      if (!work_id) {
        res.status(400).json({ error: "Invalid work ID" })
        return
      }

      const work: Work | null = await this.workService.getWorkById(work_id)
      if (!work) {
        res.status(404).json({ error: "Work not found" })
        return
      }
      res.json(work)
    } catch (error) {
      next(error)
    }
  }

  updateWork = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const work_id = req.params.work_id?.toString()
      const work: Partial<Work> = req.body

      if (!work_id) {
        res.status(400).json({ error: "Invalid work ID" })
        return
      }

      const updatedWork: Work = await this.workService.updateWork(work_id, work)
      res.json(updatedWork)
    } catch (error) {
      next(error)
    }
  }

  deleteWork = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const work_id = req.params.work_id?.toString()

      if (!work_id) {
        res.status(400).json({ error: "Invalid work ID" })
        return
      }

      const deletedWork: Work = await this.workService.deleteWork(work_id)

      if (!deletedWork) {
        res.status(404).json({ error: "Work not found" })
        return
      }

      res.json(deletedWork)
    } catch (error) {
      next(error)
    }
  }

  getWorksByGenre = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const genre = req.params.genre?.toString()

      if (!genre) {
        res.status(400).json({ error: "Genre is required" })
        return
      }

      const works: Work[] = await this.workService.getWorksByGenre(genre)
      res.json(works)
    } catch (error) {
      next(error)
    }
  }
}
