import * as employeeRepository from "../repositories/employeeRepository.js";
import * as departmentRepository from "../repositories/departmentRepository.js";
import * as jobPositionRepository from "../repositories/jobPositionRepository.js";


    
export async function getEmployees() {
    return await employeeRepository.findAll();
}

export async function getEmployee(
    employeeId: number
) {
    return await employeeRepository.findById(
        employeeId
    );
}

export async function createEmployee(
    data: employeeRepository.CreateEmployeeData
) {
    const department = await departmentRepository.findById(data.departmentId);

    if (!department) {
        throw new Error("Department not found.");
    }

    const jobPosition = await jobPositionRepository.findById(data.jobPositionId);

    if (!jobPosition) {
        throw new Error("Job position not found.");
    }

    if (jobPosition.DEPARTMENT_ID !== data.departmentId) 
    {
        throw new Error(
            "Job position does not belong to department."
        );
    }

    return await employeeRepository.createEmployee(
        data
    );
}

export async function updateEmployee(
    employeeId: number,
    data: employeeRepository.UpdateEmployeeData
) {
    const existingEmployee =
        await employeeRepository.findById(employeeId);

    if (!existingEmployee) {
        return null;
    }

    const departmentId =
        data.departmentId ??
        existingEmployee.DEPARTMENT_ID;

    const jobPositionId =
        data.jobPositionId ??
        existingEmployee.JOB_POSITION_ID;

    const department =
        await departmentRepository.findById(
            departmentId
        );

    if (!department) {
        throw new Error("Department not found.");
    }

    const jobPosition =
        await jobPositionRepository.findById(
            jobPositionId
        );

    if (!jobPosition) {
        throw new Error("Job position not found.");
    }

    if (
        jobPosition.DEPARTMENT_ID !== departmentId
    ) {
        throw new Error(
            "Job position does not belong to department."
        );
    }

    return await employeeRepository.updateEmployee(
        employeeId,
        data
    );
}

export async function deleteEmployee(
    employeeId: number
) {
    const existingEmployee =
        await employeeRepository.findById(employeeId);

    if (!existingEmployee) {
        return null;
    }

    return await employeeRepository.deleteEmployee(
        employeeId
    );
}