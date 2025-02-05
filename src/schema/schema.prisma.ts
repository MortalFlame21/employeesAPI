import { z } from "zod";

// **
// Prisma models translated into zod schemas/objects
// **

export const z_employeeSchema = z.object({
  id: z.coerce.bigint().nonnegative(),
  birth_date: z.date(),
  first_name: z.string().min(1).trim(),
  last_name: z.string().min(1).trim(),
  gender: z.enum(["M", "F"]),
  hire_date: z.date(),
});

export const z_salarySchema = z.object({
  employee_id: z.coerce.bigint().nonnegative(),
  amount: z.coerce.bigint(),
  from_date: z.date(),
  to_date: z.date(),
});
