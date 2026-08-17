import type {
    NextFunction,
    Request,
    Response
} from "express";

import pool from "../database/oracle.js";

export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const identityId = req.header("X-Dev-Identity-Id");

        if (!identityId) {
            res.status(401).json({
                error: "Authentication required."
            });

            return;
        }

        let connection;

        try {
            connection = await pool.getConnection();

            const result = await connection.execute<
                [number, string, string, number]
            >(
                `
                SELECT
                    user_id,
                    identity_id,
                    username,
                    role_id
                FROM users
                WHERE identity_id = :identityId
                `,
                {
                    identityId
                }
            );

            const user = result.rows?.[0];

            console.log("AUTH USER FROM DB:", user);

            if (!user) {
                res.status(401).json({
                    error: "Invalid authentication."
                });

                return;
            }

            req.user = {
                userId: user[0],
                identityId: user[1],
                username: user[2],
                roleId: user[3]
            };

            next();
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Authentication failed."
        });
    }
}