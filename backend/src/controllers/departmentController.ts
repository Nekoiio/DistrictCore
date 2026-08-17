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
) {
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