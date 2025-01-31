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
  - change body req params use snake_case
*/

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

  res.json({
    offset: offset,
    limit: limit,
    nextPage: nextPage,
    results: jsonParseBigInt(employees),
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

// changes salary, if employee_id exists in the table
// it then updates old_to_date to new_from_date

// would like to redirect to POST instead???

router.put("/salary", async (req, res) => {
  const { employeeID, amount, fromDate, toDate } = req.body;

  const data: salary = {
    employee_id: BigInt(employeeID),
    amount: BigInt(amount),
    from_date: new Date(fromDate),
    to_date: new Date(toDate),
  };

  const oldSalary = await prisma.salary.findFirst({
    where: { employee_id: data.employee_id },
    orderBy: { from_date: "desc" },
  });

  if (!oldSalary)
    throw `employee_id: ${data.employee_id}\n
    from_date: ${data.from_date}\n
    does not exist in Salary table. Nothing to update.`;

  await prisma.salary.update({
    where: {
      employee_id_from_date: {
        employee_id: data.employee_id,
        from_date: oldSalary.from_date,
      },
    },
    data: { to_date: data.from_date },
  });

  const newSalary = await prisma.salary.create({ data: data });

  res.json({
    old_salary: jsonParseBigInt(oldSalary),
    new_salary: jsonParseBigInt(newSalary),
  });
});

// adds salary to employee
router.post("/salary", async (req, res) => {
  const { employeeID, amount, fromDate, toDate } = req.body;

  const newEmployeeSalary = await prisma.salary.create({
    data: {
      employee_id: BigInt(employeeID),
      amount: BigInt(amount),
      from_date: new Date(fromDate),
      to_date: new Date(toDate),
    },
  });

  res.json({ new_employee_salary: jsonParseBigInt(newEmployeeSalary) });
});

// changes title, if employee_id exists in the table
// it then updates old_to_date to new_from_date
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
    data: { to_date: data.from_date },
  });

  const newTitle = await prisma.title.create({ data: data });

  res.json({
    old_title: jsonParseBigInt(oldTitle),
    new_title: jsonParseBigInt(newTitle),
  });
});

router.post("/title", async (req, res) => {
  const { employeeID, title, fromDate, toDate } = req.body;

  const newTitle = await prisma.title.create({
    data: {
      employee_id: parseInt(employeeID),
      title: title,
      from_date: new Date(fromDate),
      to_date: new Date(toDate),
    },
  });

  res.json({ new_employee_title: jsonParseBigInt(newTitle) });
});

// update employee department
router.put("/department", async (req, res) => {
  const { employeeID, departmentID, fromDate, toDate } = req.body;

  const data: department_employee = {
    employee_id: BigInt(employeeID),
    department_id: departmentID,
    from_date: new Date(fromDate),
    to_date: new Date(toDate),
  };

  const oldDepartment = await prisma.department_employee.findFirst({
    where: { employee_id: data.employee_id },
    orderBy: { from_date: "desc" },
  });

  if (!oldDepartment)
    throw `employee_id: ${data.employee_id} does not exist
    in Department table. Nothing to update.`;

  await prisma.department_employee.update({
    where: {
      employee_id_department_id: {
        employee_id: data.employee_id,
        department_id: oldDepartment.department_id,
      },
    },
    data: { to_date: data.from_date },
  });

  const newDepartment = await prisma.department_employee.create({ data: data });

  res.json({
    old_department: jsonParseBigInt(oldDepartment),
    new_department: jsonParseBigInt(newDepartment),
  });
});

router.post("/department", async (req, res) => {
  const { employeeID, departmentID, fromDate, toDate } = req.body;

  const newDepartment = await prisma.department_employee.create({
    data: {
      employee_id: BigInt(employeeID),
      department_id: departmentID,
      from_date: new Date(fromDate),
      to_date: new Date(toDate),
    },
  });

  res.json({ new_employee_department: jsonParseBigInt(newDepartment) });
});

// get employee by id
router.get("/:id", async (req, res) => {
  const employee = await prisma.employee.findFirst({
    where: { id: parseInt(req.params.id) },
  });
  res.json(jsonParseBigInt(employee));
});

// delete employee
router.delete("/", async (req, res) => {
  const employee = await prisma.employee.delete({
    where: {
      id: parseInt(req.body.id),
    },
  });
  res.json({ deletedUser: jsonParseBigInt(employee) });
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

// get employees by hire_date range

export default router;
