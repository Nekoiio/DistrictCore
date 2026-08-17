import { Router } from "express";

import {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";

import { authenticate } from "../middleware/authenticate.js";

import { requirePermission } from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("employee.read"),
    getEmployees
);

router.get(
    "/:id",
    requirePermission("employee.read"),
    getEmployee
);

router.post(
    "/",
    requirePermission("employee.create"),
    createEmployee
);

router.patch(
    "/:id",
    requirePermission("employee.update"),
    updateEmployee
);

router.delete(
    "/:id",
    requirePermission("employee.delete"),
    deleteEmployee
);
export default router;