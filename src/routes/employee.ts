import express from "express";

import EmployeeController from "@/controller/employee.js";

const router = express.Router();

/*
  todo:
  - add delete for:
    title, salary, department
*/

// create employee
router.post("/", EmployeeController.createEmployee);
// delete employee
router.delete("/", EmployeeController.deleteEmployee);

// get employee by first name
router.get("/firstName/:name", EmployeeController.findByFirstName);

// for below I would like to combine, the following 3 into a query
// for the GET request
// get all employees
router.get("/", EmployeeController.getEmployees);
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
router.get("/:id", EmployeeController.getEmployee);
// get salary of employee by id
router.get("/:id/salary", EmployeeController.getEmployeeSalary);
// get title of employee by id
router.get("/:id/title", EmployeeController.getEmployeeTitle);

export default router;
