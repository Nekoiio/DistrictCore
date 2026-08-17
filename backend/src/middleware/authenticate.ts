import "dotenv/config";
import type {
    NextFunction,
    Request,
    Response
} from "express";

import { createRemoteJWKSet, jwtVerify } from "jose";

import pool from "../database/oracle.js";


function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `${name} is not configured.`
        );
    }

    return value;
}

const KEYCLOAK_ISSUER =
    requireEnv("KEYCLOAK_ISSUER");

const KEYCLOAK_AUDIENCE =
    requireEnv("KEYCLOAK_AUDIENCE");

if (!KEYCLOAK_ISSUER) {
    throw new Error(
        "KEYCLOAK_ISSUER is not configured."
    );
}

if (!KEYCLOAK_AUDIENCE) {
    throw new Error(
        "KEYCLOAK_AUDIENCE is not configured."
    );
}

const JWKS = createRemoteJWKSet(
    new URL(
        `${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`
    )
);



export async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authorization =
            req.header("Authorization");

        if (!authorization) {
            res.status(401).json({
                error: "Authentication required."
            });

            return;
        }

        const [scheme, token] =
            authorization.split(" ");

        if (scheme !== "Bearer" || !token) {
            res.status(401).json({
                error: "Invalid authentication token."
            });

            return;
        }

        const { payload } = await jwtVerify(
            token,
            JWKS,
            {
                issuer: KEYCLOAK_ISSUER,
                audience: KEYCLOAK_AUDIENCE
            }
        );
        const identityId = payload.sub;

        if (!identityId) {
            res.status(401).json({
                error: "Authentication identity missing."
            });

            return;
        }

        let connection;

        try {
            connection =
                await pool.getConnection();

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

            //console.log(
              //  "AUTH USER FROM DB:",
                //user
            //);

            if (!user) {
                res.status(401).json({
                    error: "Authenticated identity is not registered."
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
        console.error(
            "Authentication error:",
            error
        );

        res.status(401).json({
            error: "Invalid authentication token."
        });
    }
}