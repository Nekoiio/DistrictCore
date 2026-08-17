import type {
    Request,
    Response
} from "express";

import * as employeeService
    from "../services/employeeService.js";

export async function getEmployees(
    _req: Request,
    res: Response
) {
    try {
        const employees =
            await employeeService.getEmployees();

        res.status(200).json({
            data: employees
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve employees."
        });
    }
}

export async function getEmployee(
    req: Request,
    res: Response
) {
    try {
        const employeeId =
            Number(req.params.id);

        if (
            !Number.isInteger(employeeId) ||
            employeeId <= 0
        ) {
            res.status(400).json({
                error: "Invalid employee ID."
            });

            return;
        }

        const employee =
            await employeeService.getEmployee(
                employeeId
            );

        if (!employee) {
            res.status(404).json({
                error: "Employee not found."
            });

            return;
        }

        res.status(200).json({
            data: employee
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve employee."
        });
    }
}

export async function createEmployee(
    req: Request,
    res: Response
) {
    try {
        const {
            userId,
            firstName,
            lastName,
            departmentId,
            jobPositionId,
            hireDate,
            status
        } = req.body;

        const employee =
            await employeeService.createEmployee({
                userId,
                firstName,
                lastName,
                departmentId,
                jobPositionId,
                hireDate,
                status
            });

        res.status(201).json({
            data: employee
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Department not found."
        ) {
            res.status(404).json({
                error: "Department not found."
            });

            return;
        }

        if (
            error instanceof Error &&
            error.message === "Job position not found."
        ) {
            res.status(404).json({
                error: "Job position not found."
            });

            return;
        }

        if (
            error instanceof Error &&
            error.message ===
                "Job position does not belong to department."
        ) {
            res.status(400).json({
                error:
                    "Job position does not belong to department."
            });

            return;
        }

        res.status(500).json({
            error: "Failed to create employee."
        });
    }
}

export async function updateEmployee(
    req: Request,
    res: Response
) {
    try {
        const employeeId =
            Number(req.params.id);

        if (
            !Number.isInteger(employeeId) ||
            employeeId <= 0
        ) {
            res.status(400).json({
                error: "Invalid employee ID."
            });

            return;
        }

        const employee =
            await employeeService.updateEmployee(
                employeeId,
                req.body
            );

        if (!employee) {
            res.status(404).json({
                error: "Employee not found."
            });

            return;
        }

        res.status(200).json({
            data: employee
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            if (
                error.message === "Department not found."
            ) {
                res.status(404).json({
                    error: "Department not found."
                });

                return;
            }

            if (
                error.message === "Job position not found."
            ) {
                res.status(404).json({
                    error: "Job position not found."
                });

                return;
            }

            if (
                error.message === "Job position does not belong to department."
            ) {
                res.status(400).json({
                    error:
                        "Job position does not belong to department."
                });

                return;
            }
        }

        res.status(500).json({
            error: "Failed to update employee."
        });
    }
}

export async function deleteEmployee(
    req: Request,
    res: Response
) {
    try {
        const employeeId =
            Number(req.params.id);

        if (
            !Number.isInteger(employeeId) ||
            employeeId <= 0
        ) {
            res.status(400).json({
                error: "Invalid employee ID."
            });

            return;
        }

        const employee =
            await employeeService.deleteEmployee(
                employeeId
            );

        if (!employee) {
            res.status(404).json({
                error: "Employee not found."
            });

            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete employee."
        });
    }
}