import getConnection from '../database/conection.js';
import Cipher from '../utils/Cipher.js';

// let result = await pool.request().query('SELECT 1');
// console.log(result);

/* 
 * sp_employee options
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
    
    async getAllEmployees (bossId) {
        let employeesResult = await this.pool.request()
        .input("op", 7)
        .input("bossId", bossId)
        .execute("sp_employee");

        return employeesResult.recordset;
    }
    
    async getEmployeeData (employeeId) {
        let employeeData = await this.pool.request()
            .input("op", 2)
            .input("id", employeeId)
            .execute("sp_employee");

        return employeeData.recordset;
    }
    
    async login (userName, plainPassword) {
        const result = await this.pool.request() // obtain the user data
        .input('userName', userName)
        .input('op', 5)
        .execute("sp_employee");
            
        if (result.rowsAffected == 1) { 
            
            const { employeeId, password, bossId } = result.recordset[0];
            let match = await Cipher.compareHashes(plainPassword, password); // compares the plainPassword with database password
            
            if (match) {
                const sessid = await this.setSessId(employeeId, userName, bossId); // Set sessid
                return { status: match, cookieData: sessid };
            }
        }
        
        // if not found the user in database or password is wrong then return status = false
        return {status: false, data: {}};
    }

    async setSessId (employeeId, userName, bossId) {
        
        let dataSessid = {userId: employeeId, userName, bossId, userType: "employee"}
        let sessid = Cipher.encrypt(JSON.stringify(dataSessid)); // session id creation for the cookie data
        
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
        
        // if (result.rowsAffected[0] == 1) {
        //     return true;
        // }

        // return false;

        return result.rowsAffected[0] == 1;
    }

    async emailExist (email) {
        let result = await this.pool.request()
            .input("email", email)
            .query("SELECT * FROM employee WHERE email = @email");

        return result.rowsAffected[0] == 1;
    }    

    async userNameExist (userName) {
        let result = await this.pool.request()
            .input("userName", userName)
            .query("SELECT * FROM employee WHERE userName = @userName");

        return result.rowsAffected[0] == 1;
    }    

    async updateData (data) {
        
        let { userId, name, lastName, secondLastName, userName, password, email } = data;
        password = await Cipher.hash(password);
        let result = await this.pool.request()
            .input("name", name)
            .input("lastName", lastName)
            .input("secondLastName", secondLastName)
            .input("userName", userName)
            .input("password", password)
            .input("email", email)  
            .input("op", 3)
            .input("id", userId)
            .execute("sp_employee");

        if (result.rowsAffected[0] === 1) {
            let sessid = await this.setSessId(userId, userName);
            return { status: true, sessid }
        } else {
            
            return { status: false }
        }
    }

    async uncouple (employeeId, bossId) {
        const isUncoupled = await this.pool.request()
            .input("bossId", bossId)
            .input("employeeId", employeeId)
            .execute("sp_uncoupleEmployee");
        console.log(isUncoupled);
        return isUncoupled.rowsAffected[1] === 1;
    }

    async addEmployee (employeeId, bossId) {
        
        let employeeData = await this.getEmployeeData(employeeId);
        if (employeeData[0].bossId != null) return [];

        const added = await this.pool.request()
            .input("bossId", bossId)
            .input("employeeId", employeeId)
            .execute("sp_addEmployee")

        return added.recordset;
    }

    async leaveJob (employeeId, bossId) {
        let result = await this.pool.request()
            .input("bossId", bossId)
            .input("employeeId", employeeId)
            .execute("sp_uncoupleEmployee");
        
        return result.rowsAffected[1] === 1;
    }
}


export default new Employee(await getConnection());