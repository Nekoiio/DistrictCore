import { Router } from "express";

import { createDepartment, getDepartments, getDepartmentById } from "../controllers/departmentController.js";

const router = Router();

router.post("/", createDepartment);
router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
export default router;