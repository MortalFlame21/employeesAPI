import express from "express";
import DepartmentController from "@/controller/department.js";

const router = express.Router();

// get departments
router.get("/", DepartmentController.getDepartments);

// add department
router.put("/", DepartmentController.createDepartment);

// delete a department
// do later: consequently updating all employees in that department
router.delete("/:department_id", DepartmentController.deleteDepartment);

export default router;
