import type {
    Request,
    Response
} from "express";

import * as userService
    from "../services/userService.js";

export async function getUsers(
    _req: Request,
    res: Response
) {
    try {
        const users =
            await userService.getUsers();

        res.status(200).json({
            data: users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve users."
        });
    }
}

export async function getUser(
    req: Request,
    res: Response
) {
    try {
        const userId =
            Number(req.params.id);

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            res.status(400).json({
                error: "Invalid user ID."
            });

            return;
        }

        const user =
            await userService.getUser(
                userId
            );

        if (!user) {
            res.status(404).json({
                error: "User not found."
            });

            return;
        }

        res.status(200).json({
            data: user
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve user."
        });
    }
}

export async function updateUser(
    req: Request,
    res: Response
) {
    try {
        const userId =
            Number(req.params.id);

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            res.status(400).json({
                error: "Invalid user ID."
            });

            return;
        }

        const user =
            await userService.updateUser(
                userId,
                req.body
            );

        if (!user) {
            res.status(404).json({
                error: "User not found."
            });

            return;
        }

        res.status(200).json({
            data: user
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Role not found."
        ) {
            res.status(400).json({
                error: "Role not found."
            });

            return;
        }

        res.status(500).json({
            error: "Failed to update user."
        });
    }
}