import { Router } from "express";

import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} from "../controllers/departmentController.js";

import { authenticate }
    from "../middleware/authenticate.js";

import { requirePermission }
    from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("department.read"),
    getDepartments
);

router.get(
    "/:id",
    requirePermission("department.read"),
    getDepartmentById
);

router.post(
    "/",
    requirePermission("department.manage"),
    createDepartment
);

router.patch(
    "/:id",
    requirePermission("department.manage"),
    updateDepartment
);

router.delete(
    "/:id",
    requirePermission("department.manage"),
    deleteDepartment
);

export default router;