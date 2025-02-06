import type { Request } from "express";
import { z } from "zod";

// **
// Some helper for route validation
// **

// ** helper **
// would like not to rely of Request
export function paginationPageOffset(req: Request) {
  const offset = parseInt(req.query.offset as string) ?? 0;
  const limit = parseInt(req.query.limit as string) ?? 10;
  const end = offset * limit;

  return {
    offset: offset,
    limit: limit,
    end: end,
    nextPage: `${req.baseUrl}/?offset=${end}&limit=${limit}`,
  };
}

// ** zod types **
export const z_paginationPageOffset = z.object({
  offset: z.coerce.number().gte(0).int().safe().optional().default(0),
  limit: z.coerce.number().gte(0).int().safe().optional().default(10),
});
