import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { reportErrors } from "@/utils/errors.js";
import { paginationPageOffset } from "@/utils/routes.js";

const prisma = new PrismaClient();

const DepartmentController = {
  getDepartments: async (req: Request, res: Response) => {
    try {
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const nextPage = `${req.baseUrl}/&offset=${pgn.end}&limit=${pgn.limit}`;
      const departments = await prisma.department.findMany({
        take: pgn.limit,
        skip: pgn.offset,
      });
      res.send({
        offset: pgn.offset,
        limit: pgn.limit,
        results: departments,
        next_page: nextPage,
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  createDepartment: async (req: Request, res: Response) => {
    try {
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
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  deleteDepartment: async (req: Request, res: Response) => {
    try {
      const department_id = req.params.id;
      const deletedDepartment = await prisma.department.delete({
        where: { id: department_id },
      });
      res.send({ deleted_department: deletedDepartment });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },
};

export default DepartmentController;
