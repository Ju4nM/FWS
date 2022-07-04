import sql from 'mssql';
import config from '../config.js';

const sqlConfig = {
    user: config.dbUser,
    password: config.dbPassword,
    server: 'localhost',
    database: config.dbName,
    options: {
        trustServerCertificate: true
    }
} 

export default async function getConnection () {
    
    try {
        const pool = await sql.connect(sqlConfig);
        // let result = await pool.request().query('SELECT 1');
        // console.log(result);
        return pool;        
    } catch (error) {
        console.log(error);
    }
} 