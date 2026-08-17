import express from "express";
import cors from "cors";
import "dotenv/config";

import pool from "./database/oracle.js"

import departmentRoutes from "./routes/departmentRoutes.js";
import jobPositionRoutes from "./routes/jobPositionRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1/departments", departmentRoutes);
app.use("/v1/job-positions", jobPositionRoutes);
app.use("/v1/employees", employeeRoutes);
app.use("/v1/users", userRoutes);
const PORT = process.env.PORT || 30001;




app.get("/v1/health" , async(_req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        
        const result = await connection.execute("SELECT 1 FROM DUAL");
        
        res.status(200).json({ status: "healthy" , database: "Connected", result: result.rows});
    } catch(error) {
        console.log("Error connecting to the database: ", error);

        res.status(500).json({ status: "Unhealthy", database: "Disconnected"});
        
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});