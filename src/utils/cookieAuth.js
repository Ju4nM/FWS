import Cipher from "./Cipher.js";
import getConnection from "../database/conection.js";


export default class CookieAuth {
    
    constructor (cookies) {
        this.cookies = cookies;
        this.sessid = cookies.sessid;
        // console.log("La cookie de session: " + this.sessid);
    }
    
    async searchForSessid (table) {
        
        const pool = await getConnection();
        
        const result = await pool.request()
            .input("sessid", this.sessid)
            .query(`SELECT * FROM ${table} WHERE sessid LIKE @sessid`);
    
        return result; 
    }
    
    async auth () {
    
        if (this.sessid == undefined) return false;
    
        const { userType } = JSON.parse(Cipher.decrypt(this.sessid));
    
        let result;
        
        if (userType == "boss") {
            // Buscar en tabla de jefes
            result = await this.searchForSessid("boss", this.sessid);
        } else if (userType == "employee") {
            // Buscar en tabla de empleados
            result = await this.searchForSessid("employee", this.sessid);
        }
        
        return result.rowsAffected[0] == 1;   
    }

    getUserType () {
        if (this.sessid == undefined) return "";
        const { userType } = JSON.parse(Cipher.decrypt(this.sessid));
        return userType;
    }
}