import express from "express";

const router = express.Router();

// get employee by id
router.get("/:id", (req, res) => {
  res.send("get employee by id");
});

// get employee by name
router.get("/name/:name", (req, res) => {
  res.send("get employee by name");
});

// get all employees
router.get("/", (req, res) => {
  res.send("get all employees");
});

// create employee
router.post("/", (req, res) => {
  res.send("create employee");
});

// update employee
router.put("/:id", (req, res) => {
  res.send("update employee");
});

// delete employee
router.delete("/:id", (req, res) => {
  res.send("delete employee");
});

// get salary of employee by id
router.get("/:id/salary", (req, res) => {
  res.send("get salary of employee by id");
});

// update salary
router.put("/:id/salary", (req, res) => {
  res.send("update salary");
});

// get title of employee by id
router.get("/:id/title", (req, res) => {
  res.send("get title of employee by id");
});

// update title
router.put("/:id/title", (req, res) => {
  res.send("update title");
});

// get normal employees
router.get("/normal", (req, res) => {
  res.send("get normal employees");
});

export default router;
