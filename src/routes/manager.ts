import express from "express";
import { PrismaClient, type department_manager } from "@prisma/client";
import { jsonParseBigInt } from "@/utils/jsonUtils.js";
import ManagerController from "@/controller/manager.js";

const router = express.Router();
const prisma = new PrismaClient();

// get managers
router.get("/", ManagerController.getManagers);

// only for existing employee_managers
// if existing edit old and make new
router.put("/", ManagerController.upsertManager);

// for newly added managers, creating a new row
router.post("/", ManagerController.insertManager);

// delete manager
router.delete("/:employee_id", ManagerController.deleteManager);

export default router;
