import { api } from "./client";

export interface Department {
    DEPARTMENT_ID: number;
    NAME: string;
    DESCRIPTION: string | null;
}

export async function getDepartments() {
    return api.get<{
        data: Department[];
    }>("/departments");
}