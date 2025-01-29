import express from "express";
import { PrismaClient } from "@prisma/client";
import { jsonParseBigInt } from "@/utils/jsonUtils.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const departments = await prisma.department.findMany({
    take: 10,
    skip: 1,
  });
  res.send(departments);
});

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
    skip: 1,
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
router.put("/", async (req, res) => {
  const { department_name } = req.body;

  const latestDepartment = await prisma.department.findFirst({
    orderBy: { id: "desc" },
  });

  const idNum = parseInt(latestDepartment!.id.replace("d", "")) + 1;

  const newDepartment = await prisma.department.create({
    data: {
      id: `d${String(idNum).padStart(3, "0")}`,
      dept_name: department_name,
    },
  });

  res.send({ new_department: newDepartment });
});

// delete a department
// do later: consequently updating all employees in that department
router.delete("/:department_id", async (req, res) => {
  const department_id = req.params.department_id;
  const deletedDepartment = await prisma.department.delete({
    where: { id: department_id },
  });
  res.send({ deleted_department: deletedDepartment });
});

export default router;
