import pool from "../database/oracle.js"


export async function userHasPermission(
    userId: number,
    permissionName: string
): Promise<boolean> 
{
    let connection;

    try
    {
        connection = await pool.getConnection()

        const result = await connection.execute(
            `
            SELECT 1
            FROM users u
            JOIN roles r
                ON r.role_id = u.role_id
            JOIN role_permissions rp
                ON rp.role_id = r.role_id
            JOIN permissions p
                ON p.permission_id = rp.permission_id
            WHERE u.user_id = :userId
                AND p.name = :permissionName
            `,
            {
                userId,
                permissionName
            }
        );
        return (result.rows?.length ?? 0) > 0;
    }
    finally
    {
        if (connection)
        {
            await connection.close();
        }
    }
}