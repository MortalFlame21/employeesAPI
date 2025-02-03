import { type Request, type Response } from "express";
import {
  PrismaClient,
  type department_employee,
  type department_manager,
  type salary,
} from "@prisma/client";
import { jsonParseBigInt } from "../utils/jsonUtils.js";

const prisma = new PrismaClient();

const ManagerController = {
  getManagers: async (req: Request, res: Response) => {
    const managers = await prisma.department_manager.findMany({
      take: 10,
      skip: 0,
    });
    res.send(jsonParseBigInt(managers));
  },

  upsertManager: async (req: Request, res: Response) => {
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
      old_manager: jsonParseBigInt(oldManager),
      new_manager: jsonParseBigInt(newManager),
    });
  },

  insertManager: async (req: Request, res: Response) => {
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
      old_manager: jsonParseBigInt(oldManager),
      new_manager: jsonParseBigInt(newManager),
    });
  },

  deleteManager: async (req: Request, res: Response) => {
    const { employee_id } = req.params;

    const deletedManager = await prisma.department_manager.findFirst({
      where: { employee_id: BigInt(employee_id ?? "0") },
      orderBy: { from_date: "desc" },
    });

    if (!deletedManager)
      throw `employee_id: ${BigInt(
        employee_id ?? "0"
      )} does not exist in Manager table`;

    const deletedManager_ = await prisma.department_manager.delete({
      where: {
        employee_id_department_id: {
          employee_id: BigInt(employee_id ?? "0"),
          department_id: deletedManager.department_id,
        },
      },
    });
    res.json({ deleted_manager: jsonParseBigInt(deletedManager_) });
  },
};

export default ManagerController;
