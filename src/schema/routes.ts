import { z } from "zod";

// **
// Some helper for route validation
// **

export const z_pageOffset = z.object({
  offset: z.coerce.number().gte(0).int().safe().optional().default(0),
  limit: z.coerce.number().gte(0).int().safe().optional().default(10),
});
