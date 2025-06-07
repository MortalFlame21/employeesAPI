import express from "express";

import ManagerController from "@/controller/manager.js";
import validateRequest from "@/middleware/validateRequest.js";
import { z_paginationPageOffset } from "@/utils/routes.js";
import { z_departmentManagerSchema } from "@/schema/schema.prisma.js";

const router = express.Router();

// get managers
router.get(
  "/",
  validateRequest({
    query: z_paginationPageOffset,
  }),
  ManagerController.getManagers
);

// only for existing employee_managers
// if existing edit old and make new
router.put(
  "/",
  validateRequest({ body: z_departmentManagerSchema }),
  ManagerController.upsertManager
);

// for newly added managers, creating a new row
router.post(
  "/",
  validateRequest({ body: z_departmentManagerSchema }),
  ManagerController.insertManager
);

// delete manager
router.delete(
  "/",
  validateRequest({
    body: z_departmentManagerSchema.pick({
      employee_id: true,
      department_id: true,
    }),
  }),
  ManagerController.deleteManager
);

export default router;
