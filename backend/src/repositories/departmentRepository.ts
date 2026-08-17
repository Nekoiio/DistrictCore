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