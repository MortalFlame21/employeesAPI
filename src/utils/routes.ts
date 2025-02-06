import { z } from "zod";
import type { ParsedQs } from "qs";

// **
// Some helper for route validation
// **

type reqQuery = undefined | string | ParsedQs | string[] | ParsedQs[];

// ** helper **
export function paginationPageOffset(offset: reqQuery, limit: reqQuery) {
  const offset_ = parseInt(offset as string) ?? 0;
  const limit_ = parseInt(limit as string) ?? 10;
  const end = offset_ * limit_;

  return {
    offset: offset_,
    limit: limit_,
    end: end,
  };
}

// ** zod types **
export const z_paginationPageOffset = z.object({
  offset: z.coerce.number().gte(0).int().safe().optional().default(0),
  limit: z.coerce.number().gte(0).int().safe().optional().default(10),
});
