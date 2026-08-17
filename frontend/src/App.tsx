import { useEffect, useState } from "react";
import "./App.css"

import {
    getDepartments,
    type Department
} from "./api/departments";

function App() {
    const [departments, setDepartments] =
        useState<Department[]>([]);

    useEffect(() => {
        getDepartments()
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>DistrictCore</h1>

            <h2>Departments</h2>

            <ul>
                {departments.map(department => (
                    <li key={department.DEPARTMENT_ID}>
                        <strong>{department.NAME}</strong>

                        <p>{department.DESCRIPTION}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;