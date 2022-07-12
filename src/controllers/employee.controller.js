import getConnection from '../database/conection.js';
import Cipher from '../utils/Cipher.js';

// let result = await pool.request().query('SELECT 1');
// console.log(result);

/* 
 * sp_jefe options
 * 1 = Create (C)
 * 2 = Read (R)
 * 3 = Update (U)
 * 4 = Delete (D)
 * 5 = Login
 * 6 = Set session id
 */ 

class Employee {
    constructor (pool) {
        this.pool = pool;
    }
    
    async login (userName, plainPassword) {
        const result = await this.pool.request() // obtain the user data
        .input('userName', userName)
        .input('op', 5)
        .execute("sp_employee");
            
        if (result.rowsAffected == 1) { 
            
            const { employeeId, password } = result.recordset[0];
            let match = await Cipher.compareHashes(plainPassword, password); // compares the plainPassword with database password
            
            if (match) {
                const sessid = await this.setSessId(employeeId, userName, password); // Set sessid
                return {status: match, cookieData: sessid};
            }
        }
        
        // if not found the user in database or password is wrong then return status = false
        return {status: false, data: {}};
    }

    async setSessId (employeeId, userName, password) {
        
        let dataSessid = {userName, password, userType: "employee"}
        let sessid = Cipher.encrypt(JSON.stringify(dataSessid)); // session id creation for the cookie data
        console.log(sessid);
        await this.pool.request() // set session id in the database
        .input('id', employeeId)
        .input('sessId', sessid)
        .input('op', 6)
        .execute('sp_employee');
        
        return sessid;
    }
    
    async signup (signupName, signupLastName, signupSecondLastN, signupUserName, signupEmail, signupPasswd) {
        const hashedPassword = await Cipher.hash(signupPasswd);
        const result = await this.pool.request()
        .input('op', 1)
        .input('name', signupName)
        .input('lastName', signupLastName)
        .input('secondLastName', signupSecondLastN)
        .input('userName', signupUserName)
        .input('password', hashedPassword)
        .input('email', signupEmail)
        .execute('sp_employee')
        
        if (result.rowsAffected[0] == 1) {
            return true;
        }

        return false;
    }

    // async getProducts() {
        
    // }
}


export default new Employee(await getConnection());