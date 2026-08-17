import * as jobPositionRepository from "../repositories/jobPositionRepository.js";
import type { CreateJobPositionData, UpdateJobPositionData } from "../repositories/jobPositionRepository.js"

import * as departmentRepo from "../repositories/departmentRepository.js"

export async function getJobPositions() {
    return await jobPositionRepository.findAll();
}

export async function getJobPosition(
    jobPositionId: number
) {
    return await jobPositionRepository.findById(
        jobPositionId
    );
}

export async function getJobPositionsByDepartment(
    departmentId: number
) {
    return await jobPositionRepository.findByDepartment(
        departmentId
    );
}

export async function createJobPosition(
    data: CreateJobPositionData
) {
    const department =
        await departmentRepo.findById(
            data.departmentId
        );

    if (!department) {
        throw new Error("Department not found.");
    }

    return await jobPositionRepository.createJobPosition(data);
}

export async function updateJobPosition(
    jobPositionId: number,
    data: UpdateJobPositionData
) {
    const existing =
        await jobPositionRepository.findById(
            jobPositionId
        );

    if (!existing) {
        throw new Error("Job position not found.");
    }

    if (data.departmentId !== undefined) {
        const department =
            await departmentRepo.findById(
                data.departmentId
            );

        if (!department) {
            throw new Error("Department not found.");
        }
    }

    return await jobPositionRepository.updateJobPosition(
        jobPositionId,
        data
    );
}

export async function deleteJobPosition(
    jobPositionId: number
) {
    const existing =
        await jobPositionRepository.findById(
            jobPositionId
        );

    if (!existing) {
        throw new Error("Job position not found.");
    }

    return await jobPositionRepository.deleteJobPosition(
        jobPositionId
    );
}