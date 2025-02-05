import type { Response, Request, NextFunction } from "express";
import { ZodError, type AnyZodObject, type ZodIssue } from "zod";

type z_Request = {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

type z_RequestErrors = {
  type: keyof Required<z_Request>;
  errors: ZodError;
};

function fmtRequestErrors(errors: z_RequestErrors[]) {
  return errors.map((e) => {
    return { type: `${e.type} Error.`, issues: fmtZodIssues(e.errors.issues) };
  });
}

function fmtZodIssues(issues: ZodIssue[]) {
  return issues.map((i) => {
    return `${i.path.join(", ")} ${i.message}, ${i.code}.`;
  });
}

export function validateRequest(schema: z_Request) {
  return (req: Request, res: Response, next: NextFunction): void => {
    let errors: z_RequestErrors[] = [];
    try {
      if (schema.body) {
        const parsedBody = schema.body.safeParse(req.body);

        if (parsedBody.error) {
          errors.push({ type: "body", errors: parsedBody.error });
        } else {
          req.params = parsedBody.data;
        }
      }
      if (schema.params) {
        const parsedParams = schema.params.safeParse(req.params);

        if (parsedParams.error) {
          errors.push({ type: "params", errors: parsedParams.error });
        } else {
          req.params = parsedParams.data;
        }
      }
      if (schema.query) {
        const parsedQuery = schema.query.safeParse(req.query);

        if (parsedQuery.error) {
          errors.push({ type: "query", errors: parsedQuery.error });
        } else {
          req.query = parsedQuery.data;
        }
      }
      if (errors.length > 0) {
        res.status(400).json(fmtRequestErrors(errors));
        return;
      }
      next();
    } catch (e) {
      console.log(e);
      res.status(400).json("some error");
    }
  };
}
