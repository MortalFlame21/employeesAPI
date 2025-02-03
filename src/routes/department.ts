import express from "express";
import { PrismaClient } from "@prisma/client";
import { jsonParseBigInt } from "@/utils/jsonUtils.js";
import DepartmentController from "@/controller/department.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", DepartmentController.getDepartments);

// get employee by department
// probs put in employees
// remember id can only be char(4)
router.get("/:department_id", async (req, res) => {
  // if i want to use "joins"
  // https://www.prisma.io/blog/prisma-orm-now-lets-you-choose-the-best-join-strategy-preview
  const department_id = req.params.department_id;
  console.log(department_id);
  const employees = await prisma.department_employee.findMany({
    where: { department_id: department_id },
    take: 10,
    skip: 0,
  });
  const employees_ = await prisma.employee.findMany({
    where: {
      id: {
        in: employees.map(({ employee_id }) => {
          return employee_id;
        }),
      },
    },
  });
  res.json({ employees: jsonParseBigInt(employees_) });
});

// add department
router.put("/", DepartmentController.createDepartment);

// delete a department
// do later: consequently updating all employees in that department
router.delete("/:department_id", DepartmentController.deleteDepartment);

export default router;
