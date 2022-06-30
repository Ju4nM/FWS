import { config } from 'dotenv';
config();

// configuraciones 
export default {
    port: process.env.PORT || 3000,
    dbUser: process.env.DBUSER || 'sa',
    dbPassword: process.env.DBPASSWORD,
    dbPort: process.env.DBPORT || '1433',
    dbName: process.env.DBNAME
}
