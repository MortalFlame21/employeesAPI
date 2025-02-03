import express from "express";
import {
  PrismaClient,
  type department_employee,
  type salary,
} from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";

const router = express.Router();
const prisma = new PrismaClient();

/*
  todo:
  - add delete for:
    title, salary, department
*/

import EmployeeController from "@/controller/employee.js";

// get all employees
router.get("/", EmployeeController.getEmployees);

// create employee
router.post("/", EmployeeController.createEmployee);

// changes salary, if employee_id exists in the table
// it then updates old_to_date to new_from_date
// would like to redirect to POST instead???
router.put("/salary", EmployeeController.upsertSalary);
// adds salary to employee
router.post("/salary", EmployeeController.insertSalary);

// changes title, if employee_id exists in the table
// it then updates old_to_date to new_from_date
router.put("/title", EmployeeController.upsertTitle);
router.post("/title", EmployeeController.insertTitle);

router.put("/department", EmployeeController.upsertDepartment);
router.post("/department", EmployeeController.insertDepartment);

// delete employee
router.delete("/", EmployeeController.deleteEmployee);

// get employee by first name
router.get("/firstName/:name", async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: {
      first_name: {
        equals: req.params.name,
        mode: "insensitive",
      },
    },
  });
  res.json(jsonParseBigInt(employee));
});

// for below I would like to combine, the following 3 into a query
// for the GET request

// get employees by title
router.get("/title/:title", async (req, res) => {
  const employees = await prisma.title.findMany({
    where: {
      title: {
        equals: req.params.title,
        mode: "insensitive",
      },
    },
    take: 10,
    skip: 1,
  });
  const employees_ = await prisma.employee.findMany({
    where: {
      id: {
        in: employees.map(({ employee_id }) => {
          return employee_id;
        }),
      },
    },
  });
  res.send({ employees: jsonParseBigInt(employees_) });
});

// get employees by salary range
router.get("/salary", async (req, res) => {
  const min_salary = BigInt((req.query.min_salary as string) || 1);
  const max_salary = BigInt((req.query.max_salary as string) || 999999);
  const employees = await prisma.salary.findMany({
    where: {
      amount: {
        gte: min_salary,
        lte: max_salary,
      },
    },
    take: 10,
    skip: 0,
    distinct: ["employee_id"],
  });
  const employees_ = await prisma.employee.findMany({
    where: {
      id: {
        in: employees.map(({ employee_id }) => {
          return employee_id;
        }),
      },
    },
  });
  res.send({ employees: jsonParseBigInt(employees_) });
});

// get employees by hire_date range
router.get("/hired", async (req, res) => {
  const start_hire_date = new Date(req.query.start_hire_date as string);
  const end_hire_date = new Date(req.query.end_hire_date as string);
  const employees = await prisma.employee.findMany({
    where: {
      hire_date: {
        gte: start_hire_date,
        lte: end_hire_date,
      },
    },
    take: 10,
    skip: 0,
    distinct: ["id"],
  });
  res.send({ employees: jsonParseBigInt(employees) });
});

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
