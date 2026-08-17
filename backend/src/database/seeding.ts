import oracledb from "oracledb";
import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedingsDirectory = path.resolve(
    __dirname,
    "../../../database/seed"
);

const connectionConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
};

async function seed() {
    let connection: oracledb.Connection | undefined;

    try {
        connection = await oracledb.getConnection(connectionConfig);

        console.log("Connected to OracleDB");

        const sql = await fs.readFile(
            path.join(seedingsDirectory, "development.sql"),
            "utf-8"
        );

        const statements = sql
            .split(";")
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0);

        console.log(`Found ${statements.length} seed statements.`);

        for (const statement of statements) {
            await connection.execute(statement);
        }

        await connection.commit();

        console.log("Development seed completed.");
    }
    catch (error) {
        console.error("Could not complete development seeding:", error);

        if (connection) {
            await connection.rollback();
        }
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
}

seed();