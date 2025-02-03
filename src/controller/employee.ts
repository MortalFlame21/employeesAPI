import { type Request, type Response } from "express";
import {
  PrismaClient,
  type department_employee,
  type salary,
} from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";

const prisma = new PrismaClient();

const EmployeeController = {
  getEmployees: async (req: Request, res: Response) => {
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
  },

  createEmployee: async (req: Request, res: Response) => {
    const { id, birth_date, first_name, last_name, gender, hire_date } =
      req.body;

    const newEmployee = await prisma.employee.create({
      data: {
        id: BigInt(id),
        birth_date: new Date(birth_date),
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        hire_date: new Date(hire_date),
      },
    });

    res.json({ new_employee: jsonParseBigInt(newEmployee) });
  },

  upsertSalary: async (req: Request, res: Response) => {
    const { employee_id, amount, from_date, to_date } = req.body;

    const data: salary = {
      employee_id: BigInt(employee_id),
      amount: BigInt(amount),
      from_date: new Date(from_date),
      to_date: new Date(to_date),
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
  },

  insertSalary: async (req: Request, res: Response) => {
    const { employee_id, amount, from_date, to_date } = req.body;

    const newEmployeeSalary = await prisma.salary.create({
      data: {
        employee_id: BigInt(employee_id),
        amount: BigInt(amount),
        from_date: new Date(from_date),
        to_date: new Date(to_date),
      },
    });

    res.json({ new_employee_salary: jsonParseBigInt(newEmployeeSalary) });
  },

  upsertTitle: async (req: Request, res: Response) => {
    const { employee_id, title, from_date, to_date } = req.body;

    const data = {
      employee_id: parseInt(employee_id),
      title: title,
      from_date: new Date(from_date),
      to_date: new Date(to_date),
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
  },

  insertTitle: async (req: Request, res: Response) => {
    const { employee_id, title, from_date, to_date } = req.body;

    const newTitle = await prisma.title.create({
      data: {
        employee_id: parseInt(employee_id),
        title: title,
        from_date: new Date(from_date),
        to_date: new Date(to_date),
      },
    });

    res.json({ new_employee_title: jsonParseBigInt(newTitle) });
  },
};

export default EmployeeController;
