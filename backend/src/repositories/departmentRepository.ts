import OracleDB from "oracledb";
import pool from "../database/oracle.js";

export interface CreateDepartmentData {
    name: string;
    description?: string;
}
export interface Department {
    DEPARTMENT_ID: number;
    NAME: string;
    DESCRIPTION: string | null;
}

export async function createDepartment(
    data: CreateDepartmentData
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            INSERT INTO departments (
                name,
                description
            )
            VALUES (
                :name,
                :description
            )
            `,
            {
                name: data.name,
                description: data.description ?? null
            }
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}

export async function findAll()
{
    let connection = await pool.getConnection();
    try 
    {
        

        const result = await connection.execute(
            `
            SELECT 
                department_id,
                name,
                description
            FROM departments
            ORDER BY department_id
            `
        );

        return result.rows;
    }
    finally
    {
        if (connection)
        {
            await connection.close();
        }
    }
}

export async function findById(
    departmentId: number
) {
    let connection;

    try {
        connection = await pool.getConnection();

        const result = await connection.execute<Department>(
            `
            SELECT
                department_id,
                name,
                description
            FROM departments
            WHERE department_id = :departmentId
            `,
            {
                departmentId
            }
        );

        return result.rows?.[0] ?? null;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

export interface UpdateDepartmentData {
    name?: string;
    description?: string | null;
}

export async function updateDepartment(
    departmentId: number,
    data: UpdateDepartmentData
) {
    const connection = await pool.getConnection();

    try {
        const fields: string[] = [];

        const result = await connection.execute(
            `
            UPDATE departments
            SET
                name = CASE
                    WHEN :nameProvided = 1 THEN :name
                    ELSE name
                END,
                description = CASE
                    WHEN :descriptionProvided = 1 THEN :description
                    ELSE description
                END
            WHERE department_id = :departmentId
            `,
            {
                departmentId,
                name: data.name ?? null,
                nameProvided: data.name !== undefined ? 1 : 0,
                description: data.description ?? null,
                descriptionProvided: data.description !== undefined ? 1 : 0
            }
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}

export async function deleteDepartment(
    departmentId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            DELETE FROM departments
            WHERE department_id = :departmentId
            `,
            {
                departmentId
            }
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}