import express from "express";
import { PrismaClient } from "@prisma/client";
import { jsonParseBigInt } from "@/utils/jsonUtils.js";

const router = express.Router();
const prisma = new PrismaClient();

// get managers
router.get("/", async (req, res) => {
  const managers = await prisma.department_manager.findMany({
    take: 10,
    skip: 1,
  });
  res.send(jsonParseBigInt(managers));
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
