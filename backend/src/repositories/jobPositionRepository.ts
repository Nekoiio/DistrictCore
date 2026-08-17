import oracledb from "oracledb"
import pool from "../database/oracle.js";

export interface CreateJobPositionData {
    departmentId: number;
    name: string;
    description?: string;
}
export interface UpdateJobPositionData {
    departmentId?: number;
    name?: string;
    description?: string | null;
}

export interface JobPosition {
    JOB_POSITION_ID: number;
    DEPARTMENT_ID: number;
    NAME: string;
    DESCRIPTION: string | null;
}

export async function createJobPosition(
    data: CreateJobPositionData
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            INSERT INTO job_positions (
                department_id,
                name,
                description
            )
            VALUES (
                :departmentId,
                :name,
                :description
            )
            `,
            {
                departmentId: data.departmentId,
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

export async function findAll() {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            SELECT
                job_position_id,
                department_id,
                name,
                description
            FROM job_positions
            ORDER BY job_position_id
            `
        );

        return result.rows;
    } finally {
        await connection.close();
    }
}

export async function updateJobPosition(
    jobPositionId: number,
    data: UpdateJobPositionData
) {
    const connection = await pool.getConnection();

    try {
        const fields: string[] = [];
        const binds: Record<string, string | number | null> = {
            jobPositionId
        };

        if (data.departmentId !== undefined) {
            fields.push("department_id = :departmentId");
            binds.departmentId = data.departmentId;
        }

        if (data.name !== undefined) {
            fields.push("name = :name");
            binds.name = data.name;
        }

        if (data.description !== undefined) {
            fields.push("description = :description");
            binds.description = data.description;
        }

        if (fields.length === 0) {
            return null;
        }

        const result = await connection.execute(
            `
            UPDATE job_positions
            SET ${fields.join(", ")}
            WHERE job_position_id = :jobPositionId
            `,
            binds
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}


export async function findById(
    jobPositionId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute<JobPosition>(
            `
            SELECT
                job_position_id,
                department_id,
                name,
                description
            FROM job_positions
            WHERE job_position_id = :jobPositionId
            `,
            {
                jobPositionId
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
export async function findByDepartment(
    departmentId: number
) 
{
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            SELECT
                job_position_id,
                department_id,
                name,
                description
            FROM job_positions
            WHERE department_id = :departmentId
            ORDER BY job_position_id
            `,
            {
                departmentId
            }
        );

        return result.rows;
    } finally {
        await connection.close();
    }
}

export async function deleteJobPosition(
    jobPositionId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            DELETE FROM job_positions
            WHERE job_position_id = :jobPositionId
            `,
            {
                jobPositionId
            }
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}