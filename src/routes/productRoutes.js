import express from 'express';
import CookieAuth from "../utils/cookieAuth.js";
import Product from "../controllers/product.controller.js";
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
            if (bossId !== null) {
                products = await Product.getProducts(bossId, lastProductId, rowCount, biggerThan);
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
            res.json({status:false, msg:"A ocurrido un error al borrarlo"});
        }
        }
        else {
            res.json({status:false, msg:"No se puede borrar el Producto"});

        }
    }
})

export default router;