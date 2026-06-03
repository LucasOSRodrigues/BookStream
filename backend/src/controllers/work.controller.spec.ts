import { Request, Response, NextFunction } from "express"
import { WorkController } from "../controllers/work.controller"
import { WorkService } from "../services/work.service"
import { Work } from "../shared/types/Work"

const NANO_ID_1 = "V1StGXR8_Z5jdHi6B-myT"
const NANO_ID_2 = "V1StGXR8_Z5jdHi6B-myy"

const mockWork: Work = {
  work_id: NANO_ID_1,
  title: "Default Title",
  author_id: NANO_ID_2,
  description: null,
  cover_image_url: null,
  published_date: null,
}

const makeMockService = (): jest.Mocked<WorkService> =>
  ({
    createWork: jest.fn(),
    getWorkById: jest.fn(),
    updateWork: jest.fn(),
    deleteWork: jest.fn(),
    getWorksByGenre: jest.fn(),
  }) as unknown as jest.Mocked<WorkService>

const makeMockRequest = (
  overrides: Partial<Request> = {},
): Partial<Request> => ({
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

describe("WorkController", () => {
  let controller: WorkController
  let service: jest.Mocked<WorkService>

  beforeEach(() => {
    service = makeMockService()
    controller = new WorkController(service)
  })

  // ------------------------------------------------------------------ createWork

  describe("createWork", () => {
    it("should return 201 and the created work on success", async () => {
      const req = makeMockRequest({
        body: {
          title: mockWork.title,
          author_id: mockWork.author_id,
          genres: ["Romance"],
        },
      })

      console.log("Request body:", req.body)

      const res = makeMockResponse()
      const next = makeMockNext()

      service.createWork.mockResolvedValue(mockWork)

      await controller.createWork(req as Request, res as Response, next)

      expect(service.createWork).toHaveBeenCalledWith(
        expect.objectContaining({ title: mockWork.title }),
        ["Romance"],
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockWork)
    })

    it("should return 400 if validation fails", async () => {
      const req = makeMockRequest({
        body: { title: "", genres: [] },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.createWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(Array) }),
      )
      expect(service.createWork).not.toHaveBeenCalled()
    })

    it("should call next on service error", async () => {
      const req = makeMockRequest({
        body: { ...mockWork, genres: ["Romance"] },
      })
      const res = makeMockResponse()
      const next = makeMockNext()
      const error = new Error("Service error")

      service.createWork.mockRejectedValue(error)

      await controller.createWork(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // ------------------------------------------------------------------ getWorkById

  describe("getWorkById", () => {
    it("should return the work when found", async () => {
      const req = makeMockRequest({
        params: { work_id: mockWork.work_id },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      service.getWorkById.mockResolvedValue(mockWork)

      await controller.getWorkById(req as Request, res as Response, next)

      expect(service.getWorkById).toHaveBeenCalledWith(mockWork.work_id)
      expect(res.json).toHaveBeenCalledWith(mockWork)
    })

    it("should return 404 when work is not found", async () => {
      const req = makeMockRequest({
        params: { work_id: NANO_ID_1 },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      service.getWorkById.mockResolvedValue(null)

      await controller.getWorkById(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: "Work not found" })
    })

    it("should return 400 for invalid work_id format", async () => {
      const req = makeMockRequest({
        params: { work_id: "invalid-id" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.getWorkById(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid work ID" })
      expect(service.getWorkById).not.toHaveBeenCalled()
    })

    it("should call next on service error", async () => {
      const req = makeMockRequest({
        params: { work_id: NANO_ID_1 },
      })
      const res = makeMockResponse()
      const next = makeMockNext()
      const error = new Error("Service error")

      service.getWorkById.mockRejectedValue(error)

      await controller.getWorkById(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // ------------------------------------------------------------------ updateWork

  describe("updateWork", () => {
    it("should return the updated work on success", async () => {
      const updatedWork = { ...mockWork, title: "Updated Title" }
      const req = makeMockRequest({
        params: { work_id: mockWork.work_id },
        body: { title: "Updated Title" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      service.updateWork.mockResolvedValue(updatedWork)

      await controller.updateWork(req as Request, res as Response, next)

      expect(service.updateWork).toHaveBeenCalledWith(mockWork.work_id, {
        title: "Updated Title",
      })
      expect(res.json).toHaveBeenCalledWith(updatedWork)
    })

    it("should return 400 for invalid work_id format", async () => {
      const req = makeMockRequest({
        params: { work_id: "invalid-id" },
        body: { title: "Updated Title" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.updateWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid work ID" })
      expect(service.updateWork).not.toHaveBeenCalled()
    })

    it("should call next on service error", async () => {
      const req = makeMockRequest({
        params: { work_id: NANO_ID_1 },
        body: { title: "Updated Title" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()
      const error = new Error("Service error")

      service.updateWork.mockRejectedValue(error)

      await controller.updateWork(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // ------------------------------------------------------------------ deleteWork

  describe("deleteWork", () => {
    it("should return the deleted work on success", async () => {
      const req = makeMockRequest({
        params: { work_id: mockWork.work_id },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      service.deleteWork.mockResolvedValue(mockWork)

      await controller.deleteWork(req as Request, res as Response, next)

      expect(service.deleteWork).toHaveBeenCalledWith(mockWork.work_id)
      expect(res.json).toHaveBeenCalledWith(mockWork)
    })

    it("should return 400 for invalid work_id format", async () => {
      const req = makeMockRequest({
        params: { work_id: "invalid-id" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.deleteWork(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid work ID" })
      expect(service.deleteWork).not.toHaveBeenCalled()
    })

    it("should call next on service error", async () => {
      const req = makeMockRequest({
        params: { work_id: NANO_ID_1 },
      })
      const res = makeMockResponse()
      const next = makeMockNext()
      const error = new Error("Service error")

      service.deleteWork.mockRejectedValue(error)

      await controller.deleteWork(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  // ------------------------------------------------------------------ getWorksByGenre

  describe("getWorksByGenre", () => {
    it("should return works for a valid genre", async () => {
      const works = [mockWork]
      const req = makeMockRequest({
        params: { genre: "Romance" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      service.getWorksByGenre.mockResolvedValue(works)

      await controller.getWorksByGenre(req as Request, res as Response, next)

      expect(service.getWorksByGenre).toHaveBeenCalledWith("Romance")
      expect(res.json).toHaveBeenCalledWith(works)
    })

    it("should return 400 if genre is empty", async () => {
      const req = makeMockRequest({
        params: { genre: "   " },
      })
      const res = makeMockResponse()
      const next = makeMockNext()

      await controller.getWorksByGenre(req as Request, res as Response, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Genre is required" })
      expect(service.getWorksByGenre).not.toHaveBeenCalled()
    })

    it("should call next on service error", async () => {
      const req = makeMockRequest({
        params: { genre: "Romance" },
      })
      const res = makeMockResponse()
      const next = makeMockNext()
      const error = new Error("Service error")

      service.getWorksByGenre.mockRejectedValue(error)

      await controller.getWorksByGenre(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
