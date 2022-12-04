import getConnection from '../database/conection.js';
import Product from "./product.controller.js";

class Sale {

    constructor (pool) {
        this.pool = pool;
    }

    async createSale (bossId, sellerId = null, products) {
        let areSaleables = this.verifyAllProducts(bossId, products); // NOTE: Can I sell these products?
        if (!areSaleables) return;

        let result = await this.pool.request()
            .input("op", 1)
            .input("bossId", bossId)
            .input("sellerId", sellerId)
            .execute("sp_sale");

        let [ saleId ] = result.recordset[0];
        // TODO: add sale details

        console.log(result);
    }

    async addSaleDetail (saleId, productId) {
        // TODO:
    }

    async verifyProduct (bossId, productId) {
        let result = await Product.getProductData(productId, bossId);
        return result.length == 1; // exist a one product?
    }

    async verifyAllProducts (bossId, products) {
        for (let id in products) {
            let isValid = await this.verifyProduct(bossId, id);
            if (!isValid) return false;
        }
        return true;
    }
}

export default new Sale (await getConnection());
