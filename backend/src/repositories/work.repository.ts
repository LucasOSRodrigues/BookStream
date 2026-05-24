import { prisma } from "../shared/prisma"
// import { Work as work } from "../generated/prisma"
import {Work, WorkEntity} from "../shared/types/Work"
import { IWorkRepository } from "./interfaces/IWorkRepository"

export class WorkRepository implements IWorkRepository {
  async createWork(work: Work, genres: string[]): Promise<Work> {
    const result : WorkEntity = await prisma.work.create({
      data: {
        ...work,
        genres: { connect: genres.map((genre_name) => ({ name: genre_name })) },
      },
    })
    return result
  }

  async getWorkById(work_id: string): Promise<Work | null> {
    return await prisma.work.findUnique({ where: { work_id } }) as WorkEntity | null
  }

  async updateWork(work_id: string, work: Partial<Work>): Promise<Work> {
    return await prisma.work.update({ where: { work_id }, data: work }) as WorkEntity
  }

  async deleteWork(work_id: string): Promise<Work> {
    const work: WorkEntity = await prisma.work.delete({ where: { work_id } })
    return work
  }

  public async getWorksByGenre(genre: string): Promise<Work[]> {
    return await prisma.work.findMany({
      where: {
        genres: {
          some: {
            name: genre
          }
        }
      }
    })
  }
}
