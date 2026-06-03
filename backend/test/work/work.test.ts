import { Request, Response, NextFunction } from "express"
import { WorkController } from "../../src/controllers/work.controller"
import { WorkService } from "../../src/services/work.service"
import { WorkRepository } from "../../src/repositories/work.repository"
import { prisma } from "../../src/shared/prisma"
import { Work } from "../../src/shared/types/Work"

const NANO_ID_1 = "V1StGXR8_Z5jdHi6B-myT"
const NANO_ID_2 = "V1StGXR8_Z5jdHi6B-myy"
const NANO_ID_3 = "V1StGXR8_Z5jdHi6B-myz"

const mockAuthor = {
  user_id: NANO_ID_2,
  name: "Test Author",
  email: "author@test.com",
  password_hash: "hashed_password",
}

const mockWork: Work = {
  work_id: NANO_ID_1,
  title: "Default Title",
  author_id: NANO_ID_2,
  description: null,
  cover_image_url: null,
  published_date: null,
}

const makeMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  params: {},
  ...overrides,
})

const makeMockResponse = (): jest.Mocked<Partial<Response>> => {
  const res: Partial<Response> = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as jest.Mocked<Partial<Response>>
}

const makeMockNext = (): jest.MockedFunction<NextFunction> => jest.fn()

// ---

describe("WorkController (integration)", () => {
  let controller: WorkController
  let service: WorkService
  let repository: WorkRepository

  beforeAll(async () => {
    repository = new WorkRepository()
    service = new WorkService(repository)
    controller = new WorkController(service)

    // Create test author
    await prisma.user.create({ data: mockAuthor })

    // Create test genre
    await prisma.genre.create({ data: { name: "Fiction" } })
  })

  beforeEach(async () => {
    await prisma.work.deleteMany()
  })

  afterAll(async () => {
    await prisma.work.deleteMany()
    await prisma.genre.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  // --- createWork ---

  describe("createWork", () => {
    it("should return 201 and the created work on success", async () => {
      const req = makeMockRequest({
        body: { title: mockWork.title, author_id: mockWork.author_id, genres: ["Fiction"] },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.createWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: mockWork.title, author_id: mockWork.author_id }),
      )
    })

    it("should return 400 if body is invalid", async () => {
      const req = makeMockRequest({ body: {} })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.createWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it("should return 400 if genres is missing", async () => {
      const req = makeMockRequest({
        body: { title: mockWork.title, author_id: mockWork.author_id },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.createWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it("should call next with error if work_id already exists", async () => {
      await prisma.work.create({ data: { ...mockWork } })

      const req = makeMockRequest({
        body: {
          ...mockWork,
          work_id: mockWork.work_id,
          genres: ["Fiction"],
        },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.createWork(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  // --- getWorkById ---

  describe("getWorkById", () => {
    it("should return 200 and the work if it exists", async () => {
      await prisma.work.create({ data: { ...mockWork } })

      const req = makeMockRequest({ params: { work_id: mockWork.work_id } })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.getWorkById(req as Request, res as Response, next)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ work_id: mockWork.work_id }),
      )
    })

    it("should return 404 if work does not exist", async () => {
      const req = makeMockRequest({ params: { work_id: NANO_ID_3 } })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.getWorkById(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(404)
    })

    it("should return 400 if work_id is invalid", async () => {
      const req = makeMockRequest({ params: { work_id: "invalid-id" } })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.getWorkById(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  // --- updateWork ---

  describe("updateWork", () => {
    it("should return 200 and the updated work", async () => {
      await prisma.work.create({ data: { ...mockWork } })

      const req = makeMockRequest({
        params: { work_id: mockWork.work_id },
        body: { title: "Updated Title" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.updateWork(req as Request, res as Response, next)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Updated Title" }),
      )
    })

    it("should return 400 if work_id is invalid", async () => {
      const req = makeMockRequest({
        params: { work_id: "invalid-id" },
        body: { title: "Updated Title" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.updateWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it("should call next with error if work does not exist", async () => {
      const req = makeMockRequest({
        params: { work_id: NANO_ID_3 },
        body: { title: "Updated Title" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.updateWork(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  // --- deleteWork ---

  describe("deleteWork", () => {
    it("should return 200 and the deleted work", async () => {
      await prisma.work.create({ data: { ...mockWork } })

      const req = makeMockRequest({ params: { work_id: mockWork.work_id } })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.deleteWork(req as Request, res as Response, next)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ work_id: mockWork.work_id }),
      )

      const deleted = await prisma.work.findUnique({ where: { work_id: mockWork.work_id } })
      expect(deleted).toBeNull()
    })

    it("should return 400 if work_id is invalid", async () => {
      const req = makeMockRequest({ params: { work_id: "invalid-id" } })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.deleteWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it("should call next with error if work does not exist", async () => {
      const req = makeMockRequest({ params: { work_id: NANO_ID_3 } })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.deleteWork(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })
})