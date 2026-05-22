import { Request, Response, NextFunction } from "express"

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error("Error: ", err)
  res
    .status(500)
    .json({ error: "An internal server error occurred: " + err.message })
}
