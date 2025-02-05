import type { Response, Request, NextFunction } from "express";
import { ZodError, type AnyZodObject, type ZodIssue } from "zod";

type z_Request = {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

type z_RequestError = {
  type: keyof Required<z_Request>;
  errors: ZodError;
};

function fmtRequestErrors(errors: z_RequestError[]) {
  return errors.map((e) => {
    return { type: `${e.type} Error.`, issues: fmtZodIssues(e.errors.issues) };
  });
}

function fmtZodIssues(issues: ZodIssue[]) {
  return issues.map((i) => {
    return `${i.path.join(", ")} ${i.message}, ${i.code}.`;
  });
}

function parseRequestData(
  schema: z_Request,
  key: keyof z_Request,
  req: Request
): z_RequestError | undefined {
  if (!schema[key]) return;

  const data = req[key];
  const parsed = schema[key].safeParse(data);

  if (parsed.error) return { type: key, errors: parsed.error };

  req[key] = parsed.data;
}

export function validateRequest(schema: z_Request) {
  return (req: Request, res: Response, next: NextFunction): void => {
    let errors: z_RequestError[] = [];
    try {
      const bodyErr = parseRequestData(schema, "body", req);
      if (bodyErr) errors.push(bodyErr);

      const paramsErr = parseRequestData(schema, "params", req);
      if (paramsErr) errors.push(paramsErr);

      const queryErr = parseRequestData(schema, "query", req);
      if (queryErr) errors.push(queryErr);

      if (errors.length == 0) return next();
      res.status(400).json(fmtRequestErrors(errors));
    } catch (e) {
      console.log(e);
      res.status(400).json("some error");
    }
  };
}
