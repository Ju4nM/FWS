// import sql from 'mssql';
import getConnection from './../database/conection.js';
import Cipher from '../utils/Cipher.js';

// let result = await pool.request().query('SELECT 1');
// console.log(result);

/* 
 * Opciones para SP_Jefe
 * 1 = Create (C)
 * 2 = Read (R)
 * 3 = Update (U)
 * 4 = Delete (D)
 * 5 = Login
 * 
 */ 

class Boss {
    constructor (getConnection) {
        this.pool = getConnection;
    }
    
    async login (userName, plainPassword) {
        const { recordset } = await this.pool.request()
            .input('userName', userName)
            .input('op', 5)
            .execute("sp_boss");
        
        const { password } = recordset[0];

        return await Cipher.compareHashes(plainPassword, password);
    }

}

export default new Boss(await getConnection());