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
};

export default EmployeeController;
