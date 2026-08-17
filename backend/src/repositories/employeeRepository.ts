import oracledb from "oracledb";
import pool from "../database/oracle.js";


export interface CreateEmployeeData {
    userId?: number;
    firstName: string;
    lastName: string;
    departmentId: number;
    jobPositionId: number;
    hireDate?: Date;
    status?: string;
}

export interface UpdateEmployeeData {
    userId?: number | null;
    firstName?: string;
    lastName?: string;
    departmentId?: number;
    jobPositionId?: number;
    hireDate?: Date | null;
    status?: string;
}

export interface Employee {
    EMPLOYEE_ID: number;
    USER_ID: number | null;
    FIRST_NAME: string;
    LAST_NAME: string;
    DEPARTMENT_ID: number;
    JOB_POSITION_ID: number;
    HIRE_DATE: Date | null;
    STATUS: string;
}
export async function findAll() {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            SELECT
                employee_id,
                user_id,
                first_name,
                last_name,
                department_id,
                job_position_id,
                hire_date,
                status
            FROM employees
            ORDER BY employee_id
            `
        );

        return result.rows ?? [];
    } finally {
        await connection.close();
    }
}

export async function findById(
    employeeId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute<Employee>(
            `
            SELECT
                employee_id,
                user_id,
                first_name,
                last_name,
                department_id,
                job_position_id,
                hire_date,
                status
            FROM employees
            WHERE employee_id = :employeeId
            `,
            {
                employeeId
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

export async function createEmployee(
    data: CreateEmployeeData
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            INSERT INTO employees (
                user_id,
                first_name,
                last_name,
                department_id,
                job_position_id,
                hire_date,
                status
            )
            VALUES (
                :userId,
                :firstName,
                :lastName,
                :departmentId,
                :jobPositionId,
                :hireDate,
                :status
            )
            `,
            {
                userId: data.userId ?? null,
                firstName: data.firstName,
                lastName: data.lastName,
                departmentId: data.departmentId,
                jobPositionId: data.jobPositionId,
                hireDate: data.hireDate ?? null,
                status: data.status ?? "ACTIVE"
            }
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}


export async function updateEmployee(
    employeeId: number,
    data: UpdateEmployeeData
) {
    const connection = await pool.getConnection();

    try {
        const fields: string[] = [];

        const binds: Record<
            string,
            string | number | Date | null
        > = {
            employeeId
        };

        if (data.userId !== undefined) {
            fields.push("user_id = :userId");
            binds.userId = data.userId;
        }

        if (data.firstName !== undefined) {
            fields.push("first_name = :firstName");
            binds.firstName = data.firstName;
        }

        if (data.lastName !== undefined) {
            fields.push("last_name = :lastName");
            binds.lastName = data.lastName;
        }

        if (data.departmentId !== undefined) {
            fields.push("department_id = :departmentId");
            binds.departmentId = data.departmentId;
        }

        if (data.jobPositionId !== undefined) {
            fields.push("job_position_id = :jobPositionId");
            binds.jobPositionId = data.jobPositionId;
        }

        if (data.hireDate !== undefined) {
            fields.push("hire_date = :hireDate");
            binds.hireDate = data.hireDate;
        }

        if (data.status !== undefined) {
            fields.push("status = :status");
            binds.status = data.status;
        }

        if (fields.length === 0) {
            return null;
        }

        const result = await connection.execute(
            `
            UPDATE employees
            SET ${fields.join(", ")}
            WHERE employee_id = :employeeId
            `,
            binds
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}

export async function deleteEmployee(
    employeeId: number
) {
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(
            `
            DELETE FROM employees
            WHERE employee_id = :employeeId
            `,
            {
                employeeId
            }
        );

        await connection.commit();

        return result;
    } finally {
        await connection.close();
    }
}