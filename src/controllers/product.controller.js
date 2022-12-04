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

    async searchProduct (ownerId, valueToSearch, criteria, lastId, rowCount, biggerThan) {

        const products = await this.getProducts(ownerId, lastId, 0, biggerThan);
        let foundProducts = [];

        for (let i = 0; i < products.length; i++) {
            let product = products[i];

            let match = this.#findMatch(product, criteria, valueToSearch.trim()); // Find match in all products
            
            if (match) {

                foundProducts.push(product);
            }
        }

        let returned = rowCount != 0 ? foundProducts.slice(0, rowCount > foundProducts.length ? foundProducts.length : rowCount) : foundProducts;
        
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

    async delete(ownerId, productId) {
        let result = await this.pool.request()
        .input("op", 4)
        .input("ownerId", ownerId)
        .input("productId", productId)
        .execute("sp_product");
        return result.rowsAffected [0] === 1;
    }

    async add (productData) {
        let { ownerId, productName, description, solutions, unitPrice, stock, expirationDate } = productData;
        let employeeId = null;
        if (productData.employeeId) employeeId = productData.employeeId;

        let result = await this.pool.request()
            .input("op", 1)
            .input("productName", productName)
            .input("description", description)
            .input("solutions", solutions)
            .input("unitPrice", unitPrice)
            .input("stock", stock)
            .input("expirationDate", expirationDate)
            .input("ownerId", ownerId)
            .input("employeeId", employeeId)
            .execute("sp_product");

        return result.recordset;
    }

    async getProductData (productId, ownerId) {
        let result = await this.pool.request()
            .input("op", 2)
            .input("productId", parseInt(productId))
            .input("ownerId", ownerId)
            .execute("sp_product");
        
        
        return result.recordset;
    }

    async updateProductData (productData) {
        let { ownerId, productName, description, solutions, stock, unitPrice, productId, expirationDate } = productData
        let result = await this.pool.request()
            .input("op", 3)
            .input("ownerId", ownerId)
            .input("productId", productId)
            .input("productName", productName)
            .input("description", description)
            .input("solutions", solutions)
            .input("unitPrice", unitPrice)
            .input("expirationDate", expirationDate.split("-").reverse().join("-"))
            .input("stock", stock)
            .execute("sp_product");

        return result.rowsAffected[0] === 1; 
    }
}



export default new Product(await getConnection());
