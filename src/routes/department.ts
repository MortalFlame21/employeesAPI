import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// get employee by department
router.get("/:department", (req, res) => {
  res.send("get employee by department");
});

// update employee department
router.put("/department", (req, res) => {
  res.send("update employee department");
});

// add department
router.put("/", async (req, res) => {
  const { deptName } = req.body;

  const newDepartment = await prisma.department.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  const idNum = parseInt(newDepartment!.id.replace("d", "")) + 1;

  prisma.department.create({
    data: {
      id: `d${String(idNum).padStart(3, "0")}`,
      dept_name: deptName,
    },
  });

  res.send({
    new_department: newDepartment,
  });
});

// delete a department, consequently updating all employees in that department
router.delete("/:department", (req, res) => {
  res.send("delete a department");
});

export default router;
