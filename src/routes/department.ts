import express from "express";
import { PrismaClient } from "@prisma/client";
import { jsonParseBigInt } from "@/utils/jsonUtils.js";
import DepartmentController from "@/controller/department.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", DepartmentController.getDepartments);

// add department
router.put("/", DepartmentController.createDepartment);

// delete a department
// do later: consequently updating all employees in that department
router.delete("/:department_id", DepartmentController.deleteDepartment);

export default router;
