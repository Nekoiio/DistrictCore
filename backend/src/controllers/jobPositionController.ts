import type {
    Request,
    Response
} from "express";

import * as jobPositionService
    from "../services/jobPositionService.js";

export async function getJobPositions(
    _req: Request,
    res: Response
) {
    try {
        const jobPositions =
            await jobPositionService.getJobPositions();

        res.status(200).json({
            data: jobPositions
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve job positions."
        });
    }
}

export async function getJobPosition(
    req: Request,
    res: Response
) {
    try {
        const jobPositionId =
            Number(req.params.id);

        if (
            !Number.isInteger(jobPositionId) ||
            jobPositionId <= 0
        ) {
            res.status(400).json({
                error: "Invalid job position ID."
            });

            return;
        }

        const jobPosition =
            await jobPositionService.getJobPosition(
                jobPositionId
            );

        if (!jobPosition) {
            res.status(404).json({
                error: "Job position not found."
            });

            return;
        }

        res.status(200).json({
            data: jobPosition
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve job position."
        });
    }
}

export async function getJobPositionsByDepartment(
    req: Request,
    res: Response
) {
    try {
        const departmentId =
            Number(req.params.departmentId);

        if (
            !Number.isInteger(departmentId) ||
            departmentId <= 0
        ) {
            res.status(400).json({
                error: "Invalid department ID."
            });

            return;
        }

        const jobPositions =
            await jobPositionService
                .getJobPositionsByDepartment(
                    departmentId
                );

        res.status(200).json({
            data: jobPositions
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve job positions."
        });
    }
}

export async function createJobPosition(
    req: Request,
    res: Response
) {
    try {
        const {
            departmentId,
            name,
            description
        } = req.body;

        const jobPosition =
            await jobPositionService.createJobPosition({
                departmentId,
                name,
                description
            });

        res.status(201).json({
            data: jobPosition
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
            error: "Failed to create job position."
        });
    }
}

export async function updateJobPosition(
    req: Request,
    res: Response
) {
    try {
        const jobPositionId =
            Number(req.params.id);

        if (
            !Number.isInteger(jobPositionId) ||
            jobPositionId <= 0
        ) {
            res.status(400).json({
                error: "Invalid job position ID."
            });

            return;
        }

        const {
            departmentId,
            name,
            description
        } = req.body;

        const result =
            await jobPositionService.updateJobPosition(
                jobPositionId,
                {
                    departmentId,
                    name,
                    description
                }
            );

        if (!result) {
            res.status(400).json({
                error: "No fields provided for update."
            });

            return;
        }

        res.status(200).json({
            data: result
        });
    } catch (error) {
        console.error(error);

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
            error.message === "Department not found."
        ) {
            res.status(404).json({
                error: "Department not found."
            });

            return;
        }

        res.status(500).json({
            error: "Failed to update job position."
        });
    }
}

export async function deleteJobPosition(
    req: Request,
    res: Response
) {
    try {
        const jobPositionId =
            Number(req.params.id);

        if (
            !Number.isInteger(jobPositionId) ||
            jobPositionId <= 0
        ) {
            res.status(400).json({
                error: "Invalid job position ID."
            });

            return;
        }

        await jobPositionService.deleteJobPosition(
            jobPositionId
        );

        res.status(204).send();
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Job position not found."
        ) {
            res.status(404).json({
                error: "Job position not found."
            });

            return;
        }

        res.status(500).json({
            error: "Failed to delete job position."
        });
    }
}