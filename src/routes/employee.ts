import express from "express";
import { PrismaClient } from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";

const router = express.Router();
const prisma = new PrismaClient();

// get all employees
router.get("/", (req, res) => {
  res.send("get all employees");
});

// create employee
router.post("/", (req, res) => {
  res.send("create employee");
});

// get normal employees, non-managers
router.get("/normal", async (req, res) => {
  // const titles = await prisma.title.findMany({
  //   distinct: ["title"],
  //   select: { title: true },
  // });
  // const parsedTitle = jsonParseBigInt(titles);
  // res.send(parsedTitle);
});

// get employee by id
router.get("/:id", async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: { id: parseInt(req.params.id) },
  });
  const parsedEmployee = jsonParseBigInt(employee);
  res.json(parsedEmployee);
});

// update employee
router.put("/:id", (req, res) => {
  res.send("update employee");
});

// delete employee
router.delete("/:id", (req, res) => {
  res.send("delete employee");
});

// get employee by first name
router.get("/firstName/:name", async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: { first_name: req.params.name },
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

// update salary
router.put("/:id/salary", (req, res) => {
  res.send("update salary");
});

// get title of employee by id
router.get("/:id/title", async (req, res) => {
  const employeeTitle = await prisma.title.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  const parsedTitle = jsonParseBigInt(employeeTitle);
  res.json(parsedTitle);
});

// update title
router.put("/:id/title", (req, res) => {
  res.send("update title");
});

export default router;
