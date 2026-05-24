import { Work } from "../../shared/types/Work"

export interface IWorkRepository {
  createWork(work: Work, genres: string[]): Promise<Work>
  getWorkById(work_id: string): Promise<Work | null>
  updateWork(work_id: string, work: Partial<Work>): Promise<Work>
  deleteWork(work_id: string): Promise<Work>
  getWorksByGenre(genre: string): Promise<Work[]>
}
