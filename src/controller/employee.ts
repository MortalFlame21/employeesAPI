import { type Request, type Response } from "express";
import {
  PrismaClient,
  type department_employee,
  type salary,
} from "@prisma/client";

import { jsonParseBigInt } from "../utils/jsonUtils.js";
import { reportErrors } from "@/utils/errors.js";
import { paginationPageOffset } from "@/utils/routes.js";

const prisma = new PrismaClient();

const EmployeeController = {
  getEmployee: async (req: Request, res: Response) => {
    try {
      const employee = await prisma.employee.findFirst({
        where: { id: parseInt(req.params.id ?? "0") },
      });
      res.json(jsonParseBigInt(employee));
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  getEmployeeSalary: async (req: Request, res: Response) => {
    try {
      const employeeSalary = await prisma.salary.findFirst({
        where: { employee_id: parseInt(req.params.id ?? "0") },
      });
      res.json(jsonParseBigInt(employeeSalary));
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  getEmployeeTitle: async (req: Request, res: Response) => {
    try {
      const employeeTitle = await prisma.title.findFirst({
        where: { employee_id: parseInt(req.params.id ?? "0") },
      });
      res.json(jsonParseBigInt(employeeTitle));
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  createEmployee: async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  deleteEmployee: async (req: Request, res: Response) => {
    try {
      const employee = await prisma.employee.delete({
        where: {
          id: parseInt(req.body.id),
        },
      });
      res.json({ deletedUser: jsonParseBigInt(employee) });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  findByFirstName: async (req: Request, res: Response) => {
    try {
      const employee = await prisma.employee.findFirst({
        where: {
          first_name: {
            equals: req.params.first_name,
            mode: "insensitive",
          },
        },
      });
      res.json(jsonParseBigInt(employee));
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  getEmployees: async (req: Request, res: Response) => {
    try {
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const nextPage = `${req.baseUrl}/?offset=${pgn.end}&limit=${pgn.limit}`;

      const employees = await prisma.employee.findMany({
        skip: pgn.offset,
        take: pgn.limit,
      });

      res.json({
        offset: pgn.offset,
        limit: pgn.limit,
        next_page: nextPage,
        results: jsonParseBigInt(employees),
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  findByTitle: async (req: Request, res: Response) => {
    try {
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const nextPage = `${req.baseUrl}/?offset=${pgn.end}&limit=${pgn.limit}`;

      const employees = await prisma.title.findMany({
        where: {
          title: {
            equals: req.params.title,
            mode: "insensitive",
          },
        },
        take: pgn.limit,
        skip: pgn.offset,
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
      res.json({
        offset: pgn.offset,
        limit: pgn.limit,
        results: jsonParseBigInt(employees_),
        next_page: nextPage,
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  findBySalary: async (req: Request, res: Response) => {
    try {
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const min_salary = BigInt((req.query.min_salary as string) ?? 1);
      const max_salary = BigInt((req.query.max_salary as string) ?? 999999);
      const nextPage = `${req.baseUrl}/?offset=${pgn.end}&limit=${pgn.limit}\
&min_salary=${min_salary}&max_salary=${max_salary}`;
      const employees = await prisma.salary.findMany({
        where: {
          amount: {
            gte: min_salary,
            lte: max_salary,
          },
        },
        take: pgn.limit,
        skip: pgn.offset,
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
      res.json({
        offset: pgn.offset,
        limit: pgn.limit,
        employees: jsonParseBigInt(employees_),
        next_page: nextPage,
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  findByHireDate: async (req: Request, res: Response) => {
    try {
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const start_hire_date = new Date(req.query.start_hire_date as string);
      const end_hire_date = new Date(req.query.end_hire_date as string);
      const nextPage = `${req.baseUrl}/?offset=${pgn.end}&limit=${pgn.limit}\
&min_salary=${start_hire_date.toISOString().split("T")[0]}&\
end_hire_date=${end_hire_date.toISOString().split("T")[0]}`;
      const employees = await prisma.employee.findMany({
        where: {
          hire_date: {
            gte: start_hire_date,
            lte: end_hire_date,
          },
        },
        take: pgn.limit,
        skip: pgn.offset,
        distinct: ["id"],
      });
      res.json({
        offset: pgn.offset,
        limit: pgn.limit,
        employees: jsonParseBigInt(employees),
        next_page: nextPage,
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  findByDepartment: async (req: Request, res: Response) => {
    try {
      // if i want to use "joins"
      // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const department_id = (req.query.department_id as string) ?? "";
      const nextPage = `${req.baseUrl}/?offset=${pgn.end}&limit=${pgn.limit}&department_id=${department_id}`;
      const employees = await prisma.department_employee.findMany({
        where: { department_id: department_id },
        take: pgn.limit,
        skip: pgn.offset,
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
      res.json({
        offset: pgn.offset,
        limit: pgn.limit,
        employees: jsonParseBigInt(employees_),
        next_page: nextPage,
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  upsertSalary: async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  insertSalary: async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  deleteSalary: async (req: Request, res: Response) => {
    try {
      const { employee_id, from_date } = req.body;
      const salary = await prisma.salary.delete({
        where: {
          employee_id_from_date: {
            employee_id: BigInt(employee_id),
            from_date: new Date(from_date),
          },
        },
      });
      res.json({ deleted_salary: jsonParseBigInt(salary) });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  upsertTitle: async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  insertTitle: async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  upsertDepartment: async (req: Request, res: Response) => {
    try {
      const { employee_id, department_id, from_date, to_date } = req.body;

      const data: department_employee = {
        employee_id: BigInt(employee_id),
        department_id: department_id,
        from_date: new Date(from_date),
        to_date: new Date(to_date),
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

      const newDepartment = await prisma.department_employee.create({
        data: data,
      });

      res.json({
        old_department: jsonParseBigInt(oldDepartment),
        new_department: jsonParseBigInt(newDepartment),
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  insertDepartment: async (req: Request, res: Response) => {
    try {
      const { employee_id, department_id, from_date, to_date } = req.body;

      const newDepartment = await prisma.department_employee.create({
        data: {
          employee_id: BigInt(employee_id),
          department_id: department_id,
          from_date: new Date(from_date),
          to_date: new Date(to_date),
        },
      });

      res.json({ new_employee_department: jsonParseBigInt(newDepartment) });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },
};

export default EmployeeController;
