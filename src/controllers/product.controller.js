import getConnection from "../database/conection.js";
class Product {

    constructor (pool) {
        this.pool = pool;
    }

    async getProducts (ownerId, limit = 0, rowCount = 0, biggerThan = true) {
        
        let isBiggerThan = biggerThan == "true" || biggerThan == true ? 1 : 0

        let products = await this.pool.request()
            .input("op", 5)
            .input("ownerId", ownerId)
            .input("limit", limit)
            .input("biggerThan", isBiggerThan)
            .execute("sp_product");

        products = products.recordset;
        
        if (products == undefined) return [];
        // If rowCount is equals to zero so returns all product data
        return rowCount != 0 ? products.slice(0, rowCount > products.length ? products.length : rowCount) : products;
    }

    async searchProduct (ownerId, valueToSearch, criteria) {

        const products = await this.getProducts(ownerId, 0);

        let foundProducts = [];

        products.forEach(product => {
            
            let match = this.#findMatch(product, criteria, valueToSearch.trim());
            
            if (match) foundProducts.push(product);
        });
        
        return foundProducts;
    }


    #findMatch (data, criteria, value) {
        
        const regex = new RegExp(value, "gi");
        let keys = ["productName", "description", "solutions", "stock"]; // Keys of which find data

        if (criteria != "any") return regex.test(data[criteria]);

        for (let key of keys) {
            if (regex.test(data[key])) return true;
        }
        
        return false;
    }
}

export default new Product(await getConnection());