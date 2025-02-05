import type { Response } from "express";
import { ZodError } from "zod";

import { fmtZodIssues } from "@/middleware/validateRequest.js";

export function resReportErrors(e: unknown, res: Response) {
  let error, type;

  console.log(e);

  if (e instanceof ZodError) {
    error = fmtZodIssues(e.issues);
    type = "ZodError";
  } else if (e instanceof Error) {
    error = e.message;
    type = e.name;
  } else {
    error = String(e);
    type = "UnknownError";
  }

  res.status(400).json({
    error_type: type,
    error: error,
  });
}
