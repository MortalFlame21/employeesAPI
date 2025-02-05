import { z } from "zod";

// **
// Prisma models translated into zod schemas/objects
// **

const z_dateMessage = "Please enter a valid date! See: \
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format for more information" as const;

const z_date = z.coerce.date({
  // https://github.com/colinhacks/zod/discussions/1851
  errorMap: ({ code }, { defaultError }) => {
    if (code == "invalid_date") return { message: z_dateMessage };
    return { message: defaultError };
  },
});

export const z_employeeSchema = z.object({
  id: z.coerce.bigint().nonnegative(),
  birth_date: z_date.max(new Date()),
  first_name: z.string().min(1).trim(),
  last_name: z.string().min(1).trim(),
  gender: z.enum(["M", "F"]),
  hire_date: z_date.max(new Date()),
});

export const z_salarySchema = z.object({
  employee_id: z.coerce.bigint().nonnegative(),
  amount: z.coerce.bigint(),
  from_date: z.date(),
  to_date: z.date(),
});
