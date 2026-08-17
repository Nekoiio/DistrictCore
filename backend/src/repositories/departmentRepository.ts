import OracleDB from "oracledb";
import pool from "../database/oracle.js";

export interface CreateDepartmentData {
    name: string;
    description?: string;
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

        const result = await connection.execute(
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

        const department = result.rows?.[0];

        return department ?? null;
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
        const result = await connection.execute(
            `
            UPDATE departments
            SET
                name = COALESCE(:name, name),
                description = COALESCE(:description, description)
            WHERE department_id = :departmentId
            `,
            {
                departmentId,
                name: data.name ?? null,
                description: data.description ?? null
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