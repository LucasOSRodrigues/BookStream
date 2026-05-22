import { IWorkRepository } from "../repositories/interfaces/IWorkRepository"
import { Work } from "../generated/prisma"

export class WorkService {
  constructor(private workRepository: IWorkRepository) {}

  async createWork(work: Work, genres: string[]): Promise<Work> {
    return await this.workRepository.createWork(work, genres)
  }

  async getWorkById(work_id: string): Promise<Work | null> {
    return await this.workRepository.getWorkById(work_id)
  }

  async updateWork(work_id: string, work: Partial<Work>): Promise<Work> {
    return await this.workRepository.updateWork(work_id, work)
  }

  async deleteWork(work_id: string): Promise<Work> {
    return await this.workRepository.deleteWork(work_id)
  }

  public async getWorksByGenre(genre: string): Promise<Work[]> {
    return await this.workRepository.getWorksByGenre(genre)
  }
}
