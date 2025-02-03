import express from "express";
import { PrismaClient } from "@prisma/client";

import EmployeeController from "@/controller/employee.js";

import { jsonParseBigInt } from "../utils/jsonUtils.js";

const router = express.Router();
const prisma = new PrismaClient();

/*
  todo:
  - add delete for:
    title, salary, department
*/

// get all employees
router.get("/", EmployeeController.getEmployees);

// create employee
router.post("/", EmployeeController.createEmployee);

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

// delete employee
router.delete("/", EmployeeController.deleteEmployee);

// get employee by first name
router.get("/firstName/:name", EmployeeController.findByFirstName);

// for below I would like to combine, the following 3 into a query
// for the GET request

// get employees by title
router.get("/title/:title", EmployeeController.findByTitle);

// get employees by salary range
router.get("/salary", EmployeeController.findBySalary);

// get employees by hire_date range
router.get("/hired", EmployeeController.findByHireDate);

// get employee by id
router.get("/:id", async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: { id: parseInt(req.params.id) },
  });
  res.json(jsonParseBigInt(employee));
});

// get salary of employee by id
router.get("/:id/salary", async (req, res) => {
  const employeeSalary = await prisma.salary.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  res.json(jsonParseBigInt(employeeSalary));
});

// get title of employee by id
router.get("/:id/title", async (req, res) => {
  const employeeTitle = await prisma.title.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  res.json(jsonParseBigInt(employeeTitle));
});

export default router;
