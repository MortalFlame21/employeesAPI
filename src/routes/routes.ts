import deptController from "./department.js";
import employeeRouter from "./employee.js";
import managerRouter from "./manager.js";

import express from "express";

const router = express.Router();

router.use("/manager", managerRouter);
router.use("/department", deptController);
router.use("/", employeeRouter);

export default router;
