import { ZodError } from "zod";

import { fmtZodIssues } from "@/middleware/validateRequest.js";

export function reportErrors(e: unknown) {
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
  return { error_type: type, error: error };
}
