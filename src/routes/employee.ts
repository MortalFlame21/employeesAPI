import express from "express";
import { PrismaClient, type salary } from "@prisma/client";
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

// update employee salary, typically this route will update the to_date.
// POST will update the amount
router.put("/salary", async (req, res) => {
  const { employeeID, fromDate, toDate } = req.body;

  const data = {
    employee_id: BigInt(employeeID),
    from_date: new Date(fromDate),
    to_date: new Date(toDate),
  };

  const oldSalary = await prisma.salary.findFirst({
    where: {
      employee_id: data.employee_id,
      from_date: data.from_date,
    },
  });
  const parsedOldSalary = jsonParseBigInt(oldSalary);

  const newSalary = await prisma.salary.update({
    where: {
      employee_id_from_date: {
        employee_id: data.employee_id,
        from_date: data.from_date,
      },
    },
    data: data,
  });
  const parsedNewSalary = jsonParseBigInt(newSalary);

  res.json({
    old_salary: parsedOldSalary,
    new_salary: parsedNewSalary,
  });
});

// create new salary, this route will update the amount
// and update the old to_date
router.post("/salary", async (req, res) => {
  const { employeeID, amount, fromDate, toDate } = req.body;

  const data: salary = {
    employee_id: BigInt(employeeID),
    amount: BigInt(amount),
    from_date: new Date(fromDate),
    to_date: new Date(toDate),
  };

  const oldSalary = await prisma.salary.findFirst({
    where: { employee_id: data.employee_id },
    orderBy: { from_date: "asc" },
  });
  const parsedOldSalary = jsonParseBigInt(oldSalary);

  if (oldSalary) {
    await prisma.salary.update({
      where: {
        employee_id_from_date: {
          employee_id: data.employee_id,
          from_date: oldSalary.from_date,
        },
      },
      data: {
        to_date: data.from_date,
      },
    });
  }

  const newSalary = await prisma.salary.upsert({
    where: {
      employee_id_from_date: {
        employee_id: data.employee_id,
        from_date: data.from_date,
      },
    },
    update: data,
    create: data,
  });
  const parsedNewSalary = jsonParseBigInt(newSalary);

  res.json({
    old_salary: parsedOldSalary,
    new_salary: parsedNewSalary,
  });
});

// update employee title
router.put("/title", async (req, res) => {
  const { employeeID, title, fromDate, toDate } = req.body;

  const data = {
    employee_id: parseInt(employeeID),
    title: title,
    from_date: new Date(fromDate),
    to_date: new Date(toDate),
  };

  const oldTitle = await prisma.title.findFirst({
    where: { employee_id: data.employee_id },
    orderBy: { from_date: "desc" },
  });

  if (!oldTitle)
    throw `employee_id: ${data.employee_id} does
    not exist in Title table. Nothing to update.`;

  await prisma.title.update({
    where: {
      employee_id_title_from_date: {
        title: oldTitle.title,
        employee_id: data.employee_id,
        from_date: oldTitle.from_date,
      },
    },
    data: data,
  });

  const newTitle = await prisma.title.create({ data: data });

  res.json({
    old_title: oldTitle,
    new_title: newTitle,
  });
});

// update employee department
router.put("/department", async (req, res) => {
  const { employeeID, departmentID, fromDate, toDate } = req.body;

  // check if existing
  // edit current row (to be old) and edit to_date to fromDate

  const newEmployeeDepartment = await prisma.department_employee.create({
    data: {
      employee_id: parseInt(employeeID),
      department_id: departmentID,
      from_date: new Date(fromDate),
      to_date: new Date(toDate),
    },
  });

  res.json({
    old_department: "oldDepartment",
    new_department: newEmployeeDepartment,
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
router.delete("/", async (req, res) => {
  const employee = await prisma.employee.delete({
    where: {
      id: parseInt(req.body.id),
    },
  });
  const parsedEmployee = jsonParseBigInt(employee);
  res.json({
    deletedUser: parsedEmployee,
  });
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
  res.json(parsedEmployee);
});

// get salary of employee by id
router.get("/salary/:id", async (req, res) => {
  const employeeSalary = await prisma.salary.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  const parsedSalary = jsonParseBigInt(employeeSalary);
  res.json(parsedSalary);
});

// get title of employee by id
router.get("/title/:id", async (req, res) => {
  const employeeTitle = await prisma.title.findFirst({
    where: { employee_id: parseInt(req.params.id) },
  });
  const parsedTitle = jsonParseBigInt(employeeTitle);
  res.json(parsedTitle);
});

export default router;
