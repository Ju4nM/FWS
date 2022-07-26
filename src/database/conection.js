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
        
        return pool;        
    } catch (error) {
        console.log(error);
    }
} 