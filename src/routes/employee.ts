import express from "express";
import { PrismaClient } from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";

const router = express.Router();
const prisma = new PrismaClient();

// get all employees
router.get("/", async (req, res) => {
  let offset = parseInt(req.query.offset as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  if (limit > 100) limit = 100;

  const end = offset * limit;
  const nextPage = `${req.baseUrl}/?offset=${end}&limit=${limit}`;

  const employees = await prisma.employee.findMany({
    skip: offset,
    take: limit,
  });
  const parsedEmployees = jsonParseBigInt(employees);

  res.json({
    offset: offset,
    limit: limit,
    nextPage: nextPage,
    results: parsedEmployees,
  });
});

// create employee
router.post("/", async (req, res) => {
  const { birthDate, firstName, lastName, gender, hireDate } = req.body;

  const newEmployee = await prisma.employee.create({
    data: {
      birth_date: new Date(birthDate),
      first_name: firstName,
      last_name: lastName,
      gender: gender,
      hire_date: new Date(hireDate),
    },
  });

  res.json({ new_employee: newEmployee });
});

router.put("/salary", async (req, res) => {
  const { employeeID, amount, fromDate, toDate } = req.body;

  // check if existing
  // edit current row (to be old) and edit to_date to fromDate

  const newSalary = await prisma.salary.create({
    data: {
      employee_id: employeeID,
      amount: amount,
      from_date: new Date(fromDate),
      to_date: new Date(toDate),
    },
  });

  res.json({
    old_salary: "oldSalary",
    new_salary: newSalary,
  });
});

router.put("/title", async (req, res) => {
  const { employeeID, title, fromDate, toDate } = req.body;

  // check if existing
  // edit current row (to be old) and edit to_date to fromDate

  const newTitle = await prisma.title.create({
    data: {
      employee_id: employeeID,
      title: title,
      from_date: new Date(fromDate),
      to_date: new Date(toDate),
    },
  });

  res.json({
    old_title: "oldTitle",
    new_title: newTitle,
  });
});

// get employee by id
router.get("/:id", async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: { id: parseInt(req.params.id) },
  });
  const parsedEmployee = jsonParseBigInt(employee);
  res.json(parsedEmployee);
});

// delete employee
router.delete("/:id", (req, res) => {
  res.send("delete employee");
});

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
  const parsedEmployee = jsonParseBigInt(employee);
  res.send(parsedEmployee);
});

// get salary of employee by id
router.get("/:id/salary", async (req, res) => {
  const employeeSalary = await prisma.salary.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  const parsedSalary = jsonParseBigInt(employeeSalary);
  res.json(parsedSalary);
});

// get title of employee by id
router.get("/:id/title", async (req, res) => {
  const employeeTitle = await prisma.title.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  const parsedTitle = jsonParseBigInt(employeeTitle);
  res.json(parsedTitle);
});

export default router;
