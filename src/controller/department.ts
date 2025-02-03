import { type Request, type Response } from "express";
import {
  PrismaClient,
  type department_employee,
  type salary,
} from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";

const prisma = new PrismaClient();

const DepartmentController = {
  getDepartments: async (req: Request, res: Response) => {
    const departments = await prisma.department.findMany({
      take: 10,
      skip: 0,
    });
    res.send(departments);
  },

  createDepartment: async (req: Request, res: Response) => {
    const { department_name } = req.body;

    const latestDepartment = await prisma.department.findFirst({
      orderBy: { id: "desc" },
    });

    const idNum = parseInt(latestDepartment!.id.replace("d", "")) + 1;

    const newDepartment = await prisma.department.create({
      data: {
        id: `d${String(idNum).padStart(3, "0")}`,
        dept_name: department_name,
      },
    });

    res.send({ new_department: newDepartment });
  },

  deleteDepartment: async (req: Request, res: Response) => {
    const department_id = req.params.department_id;
    const deletedDepartment = await prisma.department.delete({
      where: { id: department_id },
    });
    res.send({ deleted_department: deletedDepartment });
  },
};

export default DepartmentController;
