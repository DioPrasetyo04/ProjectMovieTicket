import type { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((err) => err.message);

        return res
          .status(500)
          .json({ error: "Invalid request", details: errorMessages });
      }
    }
  };
