import express from "express";
import { PrismaClient, type department_manager } from "@prisma/client";
import { jsonParseBigInt } from "@/utils/jsonUtils.js";
import { request } from "http";

const router = express.Router();
const prisma = new PrismaClient();

// get managers
router.get("/", async (req, res) => {
  const managers = await prisma.department_manager.findMany({
    take: 10,
    skip: 1,
  });
  res.send(jsonParseBigInt(managers));
});

// create manager
router.put("/", async (req, res) => {
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
    does not exist in Department table. Nothing to update.`;

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
});

router.post("/", async (req, res) => {
  const { employee_id, department_id, from_date, to_date } = req.body;

  const newManager = await prisma.department_manager.create({
    data: {
      employee_id: BigInt(employee_id),
      department_id: department_id,
      from_date: new Date(from_date),
      to_date: new Date(to_date),
    },
  });

  res.send({ new_manager: jsonParseBigInt(newManager) });
});

// delete manager
router.delete("/:id", (req, res) => {
  res.send("delete manager");
});

export default router;
