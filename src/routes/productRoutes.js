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
    
    if (!cookieIsExist) {
        res.sendStatus(401);
        return;
    }

    let { valueToSearch, criteria, lastId, rowCount, biggerThan } = req.body;
    
    let validator = new Validation();
    validator.validateSearchInput(valueToSearch);

    if (!validator.isValid()) {
        res.json({ errors: validator.getErrors() });
        return;
    }

    const { userId } = cookieAuth.getData();

    let foundProducts = await Product.searchProduct(userId, valueToSearch, criteria, lastId, rowCount, biggerThan);
    res.json(foundProducts);
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

    if (!cookieIsExist) {
        res.sendStatus(401);
        return
    }
    
    const cookieData = cookieAuth.getData();
    let { userId, userType } = cookieData;
    let validation = new Validation(userType);
    let productData = {};
    for (const key in req.body) productData[key] = req.body[key].trim();

    let response = {status: false, msg: "Ha habido un error"};
    validation.validateAllProductFields(productData);

    if (!validation.isValid()) {
        res.json({ status: false, errors: validation.getErrors() });
        return;
    }
    
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

    res.json(response);
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
            
            if (productData.length === 1) {
                res.render("product", { productId: id, ...productData[0] });
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

router.post("/product/edit", async (req, res) => {
    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();

    if (cookieIsExist) {
        let cookieData = cookieAuth.getData();
        let { userType, userId } = cookieData;
        let data = {};
        for (const key in req.body) data[key] = req.body[key].trimEnd();

        let validation = new Validation(userType);
        let ownerId = null;

        if (userType === "boss") {
            ownerId = userId;
        } else if (userType === "employee") {
            let [ employeeData ] = await Employee.getEmployeeData(userId);
            
            if (employeeData.bossId !== null) {
                ownerId = employeeData.bossId;
            } else {
                res.sendStatus(404);
                return;
            }
        }
        
        let [ productData ] = await Product.getProductData(data.productId, ownerId);
        console.log(productData);

        if (data.hasOwnProperty("productName")) {
            validation.productName(data.productName);
            productData.productName = data.productName;
        }

        if (data.hasOwnProperty("description")) {
            validation.productDescription(data.description);
            productData.description = data.description;
        }

        if (data.hasOwnProperty("solutions")) {
            validation.productSolutions(data.solutions);
            productData.solutions = data.solutions;
        }

        if (data.hasOwnProperty("unitPrice")) {
            validation.productStockAndPrice(data.unitPrice, "El valor del precio no es correcto");
            productData.unitPrice = data.unitPrice;
        }

        if (data.hasOwnProperty("stock")) {
            validation.productStockAndPrice(data.stock, "El valor de las existencias no es correcto");
            productData.stock = data.stock;
        }

        if (data.hasOwnProperty("expirationDate")) {
            let { expirationDate } = data;
            expirationDate = expirationDate.split(/-|\//).reverse().join("-");
            validation.expirationDate(expirationDate);
            productData.expirationDate = expirationDate;
        }

        if (validation.isValid()) {
            let result = await Product.updateProductData({ownerId, productId: data.productId, ...productData });
            if (result) {
                productData.expirationDate = productData.expirationDate.split("-").reverse().join("-");
                res.json({ status: true, msg: "Se ha actualizado correctamente", productData });
            } else {
                res.json({ status: false, msg: [ "Ha ocurrido un error" ] });
            }
        } else {
            let errors = validation.getErrors();
            res.json({status: false, errors});
        }
    }
});

export default router;
