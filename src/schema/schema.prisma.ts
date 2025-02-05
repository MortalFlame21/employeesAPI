import { z } from "zod";

// **
// Prisma models translated into zod schemas/objects
// **

export const z_employeeSchema = z.object({
  id: z.coerce.bigint(),
  birth_date: z.date(),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.enum(["M", "F"]),
  hire_date: z.date(),
});
