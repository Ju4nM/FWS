import getConnection from "../database/conection.js";
class Product {

    constructor (pool) {
        this.pool = pool;
    }

    async getProducts (ownerId, limit = 0, rowCount = 0, biggerThan = true) {
        
        let isBiggerThan = biggerThan == "true" || biggerThan == true ? 1 : 0
        // console.log("Valor de bigger than: " + isBiggerThan);
        // console.log("limit " + limit);
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

    async searchProduct (ownerId, valueToSearch, criteria, lastId, rowCount, biggerThan) {

        const products = await this.getProducts(ownerId, lastId, 0, biggerThan);
        // console.log("Productos:");
        // console.log(products);
        let foundProducts = [];

        products.forEach(product => {
            
            let match = this.#findMatch(product, criteria, valueToSearch.trim());
            
            if (match) foundProducts.push(product);
        });
        // console.log("Productos encontrados: ");
        // console.log(foundProducts);
        let returned = rowCount != 0 ? foundProducts.slice(0, rowCount > foundProducts.length ? foundProducts.length : rowCount) : foundProducts;
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n");
        console.log(returned);
        return returned;
    }


    #findMatch (data, criteria, value) {
        
        const regex = new RegExp(value, "gi");
        let keys = ["productName", "description", "solutions", "stock", "unitPrice"]; // Keys of which find data
        if (criteria != "any") return regex.test(data[criteria]);

        for (let key of keys) {
            if (regex.test(data[key])) return true;
        }
        
        return false;
    }
}

export default new Product(await getConnection());