import type { Request, Response } from "express"

import * as departmentService from "../services/departmentService.js"

export async function createDepartment(
    req: Request,
    res: Response
)
{
    try
    {
        const {name, description} = req.body;

        const department = await departmentService.createDepartment(
            name,
            description
        );

        res.status(201).json({
            data: department
        });
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({
            error: "Failed to create department."
        });
    }

}

export async function getDepartments(
    _req: Request,
    res: Response
)
{
    try
    {
        const departments = await departmentService.getDepartments();

        res.status(201).json({
            data: departments
        });
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({
            error: "Failed while fetching department data."
        });
    }
}

export async function getDepartmentById(
    req: Request,
    res: Response
) 
{
    try {
        const departmentId = Number(req.params.id);

        const department =
            await departmentService.getDepartmentById(
                departmentId
            );

        res.status(200).json({
            data: department
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve department."
        });
    }
}

export async function updateDepartment(
    req: Request,
    res: Response
) 
{
    try {
        const departmentId = Number(req.params.id);

        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            res.status(400).json({
                error: "Invalid department ID."
            });

            return;
        }

        const { name, description } = req.body;

        const department =
            await departmentService.updateDepartment(
                departmentId,
                {
                    name,
                    description
                }
            );

        if (!department) {
            res.status(400).json({
                error: "No fields provided for update."
            });

            return;
        }

        res.status(200).json({
            data: department
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

        res.status(500).json({
            error: "Failed to update department."
        });
    }
}

export async function deleteDepartment(
    req: Request,
    res: Response
) 
{
    try {
        const departmentId = Number(req.params.id);

        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            res.status(400).json({
                error: "Invalid department ID."
            });

            return;
        }

        await departmentService.deleteDepartment(
            departmentId
        );

        res.status(204).send();
    } catch (error) {
        // Litle makeshift error handling while i decide to implement a centralized systm
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

        res.status(500).json({
            error: "Failed to delete department."
        });
    }
}