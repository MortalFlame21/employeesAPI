import express from "express";

const router = express.Router();

// get managers
router.get("/", (req, res) => {
  res.send("get managers");
});

// create manager
router.post("/", (req, res) => {
  res.send("create manager");
});

// delete manager
router.delete("/:id", (req, res) => {
  res.send("delete manager");
});

export default router;
