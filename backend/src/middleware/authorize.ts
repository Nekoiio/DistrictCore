import type {
    NextFunction,
    Request,
    Response
} from "express";

import * as permissionRepository
    from "../repositories/permissionRepository.js";

export function requirePermission(permission: string) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Authentication required."
                });

                return;
            }
            console.log(
                "AUTHZ:",
                req.user.userId,
                req.user.username,
                permission
            );
            const allowed =
                await permissionRepository.userHasPermission(
                    req.user.userId,
                    permission
                );

            if (!allowed) {
                res.status(403).json({
                    error: "Forbidden."
                });

                return;
            }

            next();
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Authorization check failed."
            });
        }
    };
}