// import sql from 'mssql';
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

class Boss {
    constructor (pool) {
        this.pool = pool;
    }
    
    async getBossData (bossId) {
        let bossData = await this.pool.request()
            .input("op", 2)
            .input("id", bossId)
            .execute("sp_boss");

        return bossData.recordset;
    }

    async login (userName, plainPassword) {
        const result = await this.pool.request() // obtain the user data
        .input('userName', userName)
        .input('op', 5)
        .execute("sp_boss");
            
        if (result.rowsAffected == 1) { 
            
            const { bossId, password } = result.recordset[0];
            let match = await Cipher.compareHashes(plainPassword, password); // compares the plainPassword with database password
            
            if (match) {
                const sessid = await this.setSessId(bossId, userName, password); // Set sessid
                return { status: match, cookieData: sessid };
            }
        }
        
        // if not found the user in database or password is wrong then return status = false
        return {status: false, data: {}};
    }

    async setSessId (bossId, userName) {
        
        let dataSessid = {userId: bossId, userName, userType: "boss"}
        let sessid = Cipher.encrypt(JSON.stringify(dataSessid)); // session id creation for the cookie data
        // console.log(sessid);
        await this.pool.request() // set session id in the database
        .input('id', bossId)
        .input('sessId', sessid)
        .input('op', 6)
        .execute('sp_boss');
        
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
        .execute('sp_boss')
        
        // if (result.rowsAffected[0] == 1) {
        //     return true;
        // }

        // return false;
        return result.rowsAffected[0] == 1;
    }

    async getAllEmployees (bossId) {
        let employeesResult = await this.pool.request()
        .input("op", 7)
        .input("bossId", bossId)
        .execute("sp_employee");

        return employeesResult.recordset;
    }

    async emailExist (email) {
        let result = await this.pool.request()
            .input("email", email)
            .query("SELECT * FROM boss WHERE email = @email");

        return result.rowsAffected[0] == 1;
    }    

    async userNameExist (userName) {
        let result = await this.pool.request()
            .input("userName", userName)
            .query("SELECT * FROM boss WHERE userName = @userName");

        return result.rowsAffected[0] == 1;
    }    

    async updateData (data) {
        
        const { userId, name, lastName, secondLastName, userName, password, email } = data;
        let result = await this.pool.request()
            .input("name", name)
            .input("lastName", lastName)
            .input("secondLastName", secondLastName)
            .input("userName", userName)
            .input("password", password)
            .input("email", email)  
            .input("op", 3)
            .input("id", userId)
            .execute("sp_boss");

        if (result.rowsAffected[0] === 1) {
            let sessid = await this.setSessId(userId, userName);
            return { status: true, sessid }
        } else {
            
            return { status: false }
        }
    }
}


export default new Boss(await getConnection());