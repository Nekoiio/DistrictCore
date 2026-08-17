import { Router } from "express";

import {
    getUsers,
    getUser,
    updateUser
} from "../controllers/userController.js";

import { authenticate } from "../middleware/authenticate.js";

import { requirePermission } from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);

router.get(
    "/",
    requirePermission("user.read"),
    getUsers
);

router.get(
    "/:id",
    requirePermission("user.read"),
    getUser
);

router.patch(
    "/:id",
    requirePermission("user.manage"),
    updateUser
);

export default router;