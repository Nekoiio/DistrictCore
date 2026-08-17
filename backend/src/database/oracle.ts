import oracledb from "oracledb";
import "dotenv/config";

const pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,

    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1
});

export default pool;