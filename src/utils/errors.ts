import { ZodError } from "zod";

import { fmtZodIssues } from "@/middleware/validateRequest.js";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

// todo
// export function fmtRecord(r: Record<string, unknown>)

export function reportErrors(e: unknown) {
  let error, type;

  console.log(e);

  if (e instanceof ZodError) {
    error = fmtZodIssues(e.issues);
    type = "ZodError";
  } else if (e instanceof PrismaClientValidationError) {
    error = `${e.message} : [Cause?]${e.cause}`;
    type = `${e.clientVersion} : PrismaClientValidationError`;
  } else if (e instanceof PrismaClientInitializationError) {
    error = `${e.message} : [Cause?]${e.cause}`;
    type = `${e.clientVersion} : PrismaClientInitializationError : ${e.errorCode}`;
  } else if (e instanceof PrismaClientRustPanicError) {
    error = `${e.message} : [Cause?]${e.cause}`;
    type = `${e.clientVersion} : PrismaClientRustPanicError`;
  } else if (e instanceof PrismaClientKnownRequestError) {
    error = `${e.message} : [Cause?]${e.cause} : [Meta]${e.meta}`;
    type = `${e.clientVersion} : PrismaClientKnownRequestError : ${e.code}`;
  } else if (e instanceof PrismaClientUnknownRequestError) {
    error = `${e.message} : [Cause?]${e.cause}`;
    type = `${e.clientVersion} : PrismaClientUnknownRequestError`;
  } else if (e instanceof Error) {
    error = e.message;
    type = e.name;
  } else {
    error = String(e);
    type = "UnknownError";
  }
  return { error_type: type, error: error };
}
