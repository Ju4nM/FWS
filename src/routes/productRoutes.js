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
        const { userId } = cookieAuth.getData();

        let products = await Product.getProducts(userId, lastProductId, rowCount, biggerThan);
        res.json(products);
    } else {

        res.sendStatus(404);
    }
});

router.post("/product/find", async (req, res) => {

    const cookieAuth = new CookieAuth(req.cookies);
    const cookieIsExist = await cookieAuth.auth();
    
    if (cookieIsExist) {
        
        let { valueToSearch, criteria } = req.body;
        const { userId } = cookieAuth.getData();

        let foundProducts = await Product.searchProduct(userId, valueToSearch, criteria);
        res.json(foundProducts);
    } else {

        res.sendStatus(404);
    }
});

export default router;