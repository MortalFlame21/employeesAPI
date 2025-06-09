import express from "express";
import DepartmentController from "@/controller/department.js";
import validateRequest from "@/middleware/validateRequest.js";
import { z_paginationPageOffset } from "@/utils/routes.js";
import { z_department } from "@/schema/schema.prisma.js";

const router = express.Router();

// get departments
router.get(
  "/",
  validateRequest({ query: z_paginationPageOffset }),
  DepartmentController.getDepartments
);

// add department
router.post(
  "/",
  validateRequest({
    body: z_department.pick({ department_name: true }),
  }),
  DepartmentController.createDepartment
);

// delete a department
// do later: consequently updating all employees in that department
router.delete(
  "/:id",
  validateRequest({
    params: z_department.pick({ id: true }),
  }),
  DepartmentController.deleteDepartment
);

export default router;
