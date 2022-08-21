import express from "express";
import CookieAuth from "../utils/cookieAuth.js";
import Product from "../controllers/product.controller.js";
import Employee from "../controllers/employee.controller.js"
import Validation from "../utils/fieldValidation.js";
// import Boss from "../controllers/boss.controller.js";

const router = express.Router();

router.post("/product/list", async(req, res) => {
    
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        
        let { lastProductId, rowCount, biggerThan } = req.body;
        const cookieData = cookieAuth.getData();
        const { userId, userType } = cookieData;

        if (userType === "boss") {

            let products = await Product.getProducts(userId, lastProductId, rowCount, biggerThan);
            res.json(products);
        } else if (userType === "employee") {
            
            const { bossId } = cookieData;
            let products = {};
            let [ employeeData ] = await Employee.getEmployeeData(userId);
            console.log(employeeData);
            if (employeeData.bossId !== null) {

                products = await Product.getProducts(employeeData.bossId, lastProductId, rowCount, biggerThan);
            }

            res.json(products)
        }

    } else {

        res.sendStatus(404);
    }
});

router.post("/product/find", async (req, res) => {

    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        
        let { valueToSearch, criteria, lastId, rowCount, biggerThan } = req.body;
        const { userId } = cookieAuth.getData();

        let foundProducts = await Product.searchProduct(userId, valueToSearch, criteria, lastId, rowCount, biggerThan);
        res.json(foundProducts);
    } else {

        res.sendStatus(404);
    }
});

router.post("/product/delete", async (req, res) =>{
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    if (cookieIsExist) {
       let {productId} = req.body   
        const cookieData = cookieAuth.getData();
        if (cookieData.userType === "boss") {
            let {userId} = cookieData
            let result = await Product.delete(userId, productId);
        if (result){
            res.json({status:true, msg:"Se a borrado correctamente"});
        }else{
            res.json({status:false, msg:"Ha ocurrido un error al borrarlo"});
        }
        }
        else {
            res.json({status:false, msg:"No se puede borrar el Producto"});

        }
    }
});

router.post("/product/add", async (req, res) => {
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();

    if (cookieIsExist) {
        const cookieData = cookieAuth.getData();
        let { userId, userType } = cookieData;
        let validation = new Validation(userType);
        let productData = {};
        for (const key in req.body) productData[key] = req.body[key].trimEnd();
        console.log(productData);
        let response = {status: false, msg: "Ha habido un error"};
        validation.validateAllProductFields(productData);

        if (validation.isValid()) {

            let result;
            if (userType == "boss") {
                result = await Product.add({ ownerId: userId, ...productData });
    
            } else if (userType === "employee") {
                let [ employeeData ] = await Employee.getEmployeeData(userId);
                result = await Product.add({ ownerId: employeeData.bossId, employeeId: userId, ...productData });
            }
    
            if (result.length === 1) {
                response = {status: true, msg: "Se ha registrado correctamente", productData: result[0]};
            } else {
                response = {status: false, msg: "No se ha podido registrar"};
            }
    
        } else {
            response = {status: false, errors: validation.getErrors()};
        }
        
        res.json(response);
    }
});

router.get("/product/:id", async (req, res) => {

    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        let { id } = req.params;
        const cookieData = cookieAuth.getData();
        let { userId, userType } = cookieData;
        let ownerId = null;

        if (userType === "boss") {
            ownerId = userId;

        } else if (userType === "employee") {
            
            let employeeData = await Employee.getEmployeeData(userId);
            let { bossId } = employeeData[0]; 
            
            if (bossId !== null) {
                ownerId = bossId;
            } else {
                res.sendStatus(404);
                return;
            }
        }

        if (ownerId !== null) {
            
            let productData = await Product.getProductData(id, ownerId);
            console.log(productData);
            if (productData.length === 1) {
                res.render("product", productData[0]);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }
});

export default router;