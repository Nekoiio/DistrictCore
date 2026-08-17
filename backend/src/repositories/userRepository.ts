import oracledb from "oracledb";
import pool from "../database/oracle.js";

export interface User {
    USER_ID: number;
    IDENTITY_ID: string;
    USERNAME: string;
    ROLE_ID: number;
}
export interface UpdateUserData {
    roleId?: number;
    username?: string;
}
export interface Role {
    ROLE_ID: number;
    NAME: string;
}

export async function roleExists(
    roleId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute<Role>(
            `
            SELECT
                role_id,
                name
            FROM roles
            WHERE role_id = :roleId
            `,
            { roleId },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows?.[0] ?? null;
    } finally {
        await connection.close();
    }
}

export async function findAll() {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute<User>(
            `
            SELECT
                user_id,
                identity_id,
                username,
                role_id
            FROM users
            ORDER BY user_id
            `,
            {},
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows ?? [];
    } finally {
        await connection.close();
    }
}


export async function findById(
    userId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute<User>(
            `
            SELECT
                user_id,
                identity_id,
                username,
                role_id
            FROM users
            WHERE user_id = :userId
            `,
            {
                userId
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows?.[0] ?? null;
    } finally {
        await connection.close();
    }
}

export async function findByIdentityId(
    identityId: string
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute<User>(
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
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows?.[0] ?? null;
    } finally {
        await connection.close();
    }
}

export async function updateUser(
    userId: number,
    data: UpdateUserData
) {
    const connection = await pool.getConnection();

    try {
        const fields: string[] = [];

        const binds: Record<string, string | number> = {
            userId: userId
        };

        if (data.roleId !== undefined) {
            fields.push("role_id = :roleId");
            binds.roleId = data.roleId;
        }

        if (data.username !== undefined) {
            fields.push("username = :username");
            binds.username = data.username;
        }

        if (fields.length === 0) {
            return null;
        }

        const sql = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE user_id = :userId
        `;

        const result = await connection.execute(
            sql,
            binds
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}