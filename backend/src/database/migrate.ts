import oracledb from "oracledb";
import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resourceLimits } from "node:worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDirectory = path.resolve(
    __dirname,
    "../../../database/migrations"
);

const connectionConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
};

async function migrate() {
    let connection: oracledb.Connection | undefined;

    try {
        connection = await oracledb.getConnection(connectionConfig);

        console.log("Connected to OracleDB");

        const files = (await fs.readdir(migrationsDirectory))
        .filter(file => file.endsWith(".sql"))
        .sort();

        console.log(`Found ${files.length} migrations.`);

        for (const file of files) {
            const result = await connection.execute(
                `
                SELECT filename
                FROM schema_migrations
                WHERE filename = :filename
                `,
                { filename: file }
            );

            if (result.rows && result.rows.length > 0) {
                console.log(`Skipping ${file} (already applied).`);
                continue;
            }

            console.log(`Applying ${file}...`);

            const sql = await fs.readFile(
                path.join(migrationsDirectory, file),
                "utf8"
            );

            await connection.execute(sql);

            await connection.execute(
                `
                INSERT INTO schema_migrations (filename)
                VALUES (:filename)
                `,
                { filename: file }
            );

            await connection.commit();

            console.log(`Applied ${file}.`);
        }
    } catch(error) {
        console.log(`Error migrating database: ${error}`);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.close()
        }
    }
}

migrate();