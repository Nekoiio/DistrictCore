import * as departmentRepo from "../repositories/departmentRepository.js"

export async function createDepartment(
    name: string,
    description?: string 
)
{
    if (!name || name.trim().length == 0) {
        throw new Error("Department name is required.")
    }

    return departmentRepo.createDepartment({
        name: name.trim(),
        ...(description !== undefined && {
            description: description.trim()
        })
    });
}

export async function getDepartments()
{
    return departmentRepo.findAll();
}

export async function getDepartmentById(
    departmentId: number
) {
    if (!Number.isInteger(departmentId) || departmentId <= 0) {
        throw new Error("Invalid department ID");
    }

    const department =
        await departmentRepo.findById(departmentId);

    if (!department) {
        throw new Error("Department not found");
    }

    return department;
}