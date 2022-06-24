import sql from 'mssql';
import getConnection from './../database/conection.js';

// let result = await pool.request().query('SELECT 1');
// console.log(result);

/* Opciones para SP_Jefe
 * 1 = Create (C)
 * 2 = Read (R)
 * 3 = Update (U)
 * 4 = Delete (D)
 * 5 = Login
 */ 

class Jefe {
    constructor (getConnection) {
        this.pool = getConnection;
    }
    
    async login (userName, password) {
        return await this.pool.request()
            .input('nombreUsuario', userName)
            .input('contrasena', password)
            .input('opcion', 5)
            .execute("SP_Jefe");
    }

}

export default new Jefe(await getConnection());