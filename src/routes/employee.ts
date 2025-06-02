import express from "express";

import EmployeeController from "@/controller/employee.js";
import validateRequest from "@/middleware/validateRequest.js";

import {
  z_date,
  z_employeeDepartmentSchema,
  z_employeeSchema,
  z_salarySchema,
  z_titleSchema,
} from "@/schema/schema.prisma.js";
import { z_paginationPageOffset } from "@/utils/routes.js";
import { z } from "zod";

const router = express.Router();

/*
  todo:
  - add delete for:
    title, salary, department
*/

// create employee
router.post(
  "/",
  validateRequest({ body: z_employeeSchema }),
  EmployeeController.createEmployee
);
// delete employee
router.delete(
  "/",
  validateRequest({ body: z_employeeSchema.pick({ id: true }) }),
  EmployeeController.deleteEmployee
);

// get employee by first name
router.get(
  "/firstName/:first_name",
  validateRequest({ params: z_employeeSchema.pick({ first_name: true }) }),
  EmployeeController.findByFirstName
);

// for below I would like to combine, the following 3 into a query
// for the GET request
// get all employees
router.get(
  "/",
  validateRequest({ query: z_paginationPageOffset }),
  EmployeeController.getEmployees
);
// get employees by title
router.get(
  "/title/:title",
  validateRequest({ query: z_paginationPageOffset }),
  EmployeeController.findByTitle
);
// get employees by salary range
router.get(
  "/salary",
  validateRequest({
    query: z_paginationPageOffset.extend({
      min_salary: z.coerce.number().gte(0).safe().optional().default(0),
      max_salary: z.coerce.number().gte(0).safe().optional().default(999999),
    }),
  }),
  EmployeeController.findBySalary
);
// get employees by hire_date range
router.get(
  "/hired",
  validateRequest({
    query: z_paginationPageOffset.extend({
      start_hire_date: z_date,
      end_hire_date: z_date.max(new Date("9999-01-01")),
    }),
  }),
  EmployeeController.findByHireDate
);
// get employees by department
// remember id can only be char(4)
router.get(
  "/department",
  validateRequest({
    query: z_paginationPageOffset.extend({
      department_id: z.string().min(4).max(4),
    }),
  }),
  EmployeeController.findByDepartment
);

// /salary, /title, /department do the same
// changes salary, if employee_id exists in the table
// it then updates old_to_date to new_from_date
// would like to redirect to POST instead???
router.put(
  "/salary",
  validateRequest({
    body: z_salarySchema,
  }),
  EmployeeController.upsertSalary
);
// adds salary to employee not in the table
router.post(
  "/salary",
  validateRequest({
    body: z_salarySchema,
  }),
  EmployeeController.insertSalary
);
// delete salary from employee
router.delete(
  "/salary",
  validateRequest({
    body: z_salarySchema.pick({
      employee_id: true,
      from_date: true,
    }),
  }),
  EmployeeController.deleteSalary
);

router.put(
  "/title",
  validateRequest({
    body: z_titleSchema,
  }),
  EmployeeController.upsertTitle
);
router.post(
  "/title",
  validateRequest({
    body: z_titleSchema,
  }),
  EmployeeController.insertTitle
);
router.delete(
  "/title",
  validateRequest({
    body: z_titleSchema.pick({
      employee_id: true,
      title: true,
      from_date: true,
    }),
  }),
  EmployeeController.deleteTitle
);

router.put(
  "/department",
  validateRequest({
    body: z_employeeDepartmentSchema,
  }),
  EmployeeController.upsertDepartment
);
router.post(
  "/department",
  validateRequest({
    body: z_employeeDepartmentSchema,
  }),
  EmployeeController.insertDepartment
);
router.delete(
  "/department",
  validateRequest({
    body: z_employeeDepartmentSchema.pick({
      employee_id: true,
      department_id: true,
    }),
  }),
  EmployeeController.deleteEmployeeDepartment
);

// would like the following 3 to conjoin into 1 route
// get employee by id
router.get(
  "/:id",
  validateRequest({ params: z_employeeSchema.pick({ id: true }) }),
  EmployeeController.getEmployee
);
// get salary of employee by id
router.get(
  "/:id/salary",
  validateRequest({ params: z_employeeSchema.pick({ id: true }) }),
  EmployeeController.getEmployeeSalary
);
// get title of employee by id
router.get(
  "/:id/title",
  validateRequest({ params: z_employeeSchema.pick({ id: true }) }),
  EmployeeController.getEmployeeTitle
);

export default router;
