import express from "express";

import EmployeeController from "@/controller/employee.js";
import validateRequest from "@/middleware/validateRequest.js";

import { z_employeeSchema } from "@/schema/schema.prisma.js";
import { z_pageOffset } from "@/schema/routes.js";

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
  validateRequest({ query: z_pageOffset }),
  EmployeeController.getEmployees
);
// get employees by title
router.get("/title/:title", EmployeeController.findByTitle);
// get employees by salary range
router.get("/salary", EmployeeController.findBySalary);
// get employees by hire_date range
router.get("/hired", EmployeeController.findByHireDate);
// get employees by department
// remember id can only be char(4)
router.get("/department", EmployeeController.findByDepartment);

// /salary, /title, /department do the same
// changes salary, if employee_id exists in the table
// it then updates old_to_date to new_from_date
// would like to redirect to POST instead???
router.put("/salary", EmployeeController.upsertSalary);
// adds salary to employee not in the table
router.post("/salary", EmployeeController.insertSalary);

router.put("/title", EmployeeController.upsertTitle);
router.post("/title", EmployeeController.insertTitle);

router.put("/department", EmployeeController.upsertDepartment);
router.post("/department", EmployeeController.insertDepartment);

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
