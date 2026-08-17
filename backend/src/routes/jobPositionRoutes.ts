import { Router } from "express";

import {
    getJobPositions,
    getJobPosition,
    createJobPosition,
    updateJobPosition,
    deleteJobPosition
} from "../controllers/jobPositionController.js";

import { requirePermission } from "../middleware/authorize.js";
import { authenticate } from "../middleware/authenticate.js"

const router = Router();
router.use(authenticate);

router.get(
    "/",
    requirePermission("job_position.read"),
    getJobPositions
);

router.get(
    "/:id",
    requirePermission("job_position.read"),
    getJobPosition
);

router.post(
    "/",
    requirePermission("job_position.manage"),
    createJobPosition
);

router.patch(
    "/:id",
    requirePermission("job_position.manage"),
    updateJobPosition
);

router.delete(
    "/:id",
    requirePermission("job_position.manage"),
    deleteJobPosition
);

export default router;