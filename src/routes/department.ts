import express from "express";

const router = express.Router();

// get employee by department
router.get("/:department", (req, res) => {
  res.send("get employee by department");
});

// update employee department
router.put("/department", (req, res) => {
  res.send("update employee department");
});

// add a department
router.post("/", (req, res) => {
  res.send("add a department");
});

// delete a department, consequently updating all employees in that department
router.delete("/:department", (req, res) => {
  res.send("delete a department");
});

export default router;
