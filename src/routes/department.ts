import express from "express";
import DepartmentController from "@/controller/department.js";
import validateRequest from "@/middleware/validateRequest.js";
import { z_paginationPageOffset } from "@/utils/routes.js";

const router = express.Router();

// get departments
router.get(
  "/",
  validateRequest({ query: z_paginationPageOffset }),
  DepartmentController.getDepartments
);

// add department
router.put("/", validateRequest({}), DepartmentController.createDepartment);

// delete a department
// do later: consequently updating all employees in that department
router.delete(
  "/:department_id",
  validateRequest({}),
  DepartmentController.deleteDepartment
);

export default router;
