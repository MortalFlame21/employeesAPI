import { type Request, type Response } from "express";
import { PrismaClient, type department_manager } from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";
import { reportErrors } from "@/utils/errors.js";
import { paginationPageOffset } from "@/utils/routes.js";

const prisma = new PrismaClient();

const ManagerController = {
  getManagers: async (req: Request, res: Response) => {
    try {
      const pgn = paginationPageOffset(req.query.offset, req.query.limit);
      const managers = await prisma.department_manager.findMany({
        take: pgn.limit,
        skip: pgn.offset,
      });
      const nextPage = `${req.baseUrl}/?offset=${pgn.end}&limit=${pgn.limit}`;
      res.send({
        offset: pgn.offset,
        limit: pgn.limit,
        results: jsonParseBigInt(managers),
        next_page: nextPage,
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  upsertManager: async (req: Request, res: Response) => {
    try {
      const { employee_id, department_id, from_date, to_date } = req.body;

      const data: department_manager = {
        employee_id: BigInt(employee_id),
        department_id: department_id,
        from_date: new Date(from_date),
        to_date: new Date(to_date),
      };

      const oldManager = await prisma.department_manager.findFirst({
        where: { employee_id: data.employee_id },
        orderBy: { from_date: "desc" },
      });

      if (!oldManager)
        throw `employee_id: ${data.employee_id}
      does not exist in Manager table. Nothing to update.`;

      await prisma.department_manager.update({
        where: {
          employee_id_department_id: {
            employee_id: data.employee_id,
            department_id: oldManager.department_id,
          },
          from_date: oldManager.from_date,
        },
        data: { to_date: data.from_date },
      });

      const newManager = await prisma.department_manager.create({ data: data });

      res.json({
        new_manager: jsonParseBigInt(newManager),
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  insertManager: async (req: Request, res: Response) => {
    try {
      const { employee_id, department_id, from_date, to_date } = req.body;

      const newManager = await prisma.department_manager.create({
        data: {
          employee_id: BigInt(employee_id),
          department_id: department_id,
          from_date: new Date(from_date),
          to_date: new Date(to_date),
        },
      });

      res.json({
        new_manager: jsonParseBigInt(newManager),
      });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },

  deleteManager: async (req: Request, res: Response) => {
    try {
      const manager = await prisma.department_manager.delete({
        where: {
          employee_id_department_id: {
            employee_id: req.body.employee_id,
            department_id: req.body.department_id,
          },
        },
      });
      res.json({ deleted_manager: jsonParseBigInt(manager) });
    } catch (e) {
      res.status(400).json(reportErrors(e));
    }
  },
};

export default ManagerController;
