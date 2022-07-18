export default class Finder {

    constructor (inputId, criteriaId, listProductsId) {
        this.input = document.getElementById(inputId);
        this.criteria = document.getElementById(criteriaId);
        this.listProducts = document.getElementById(listProductsId);
        this.dataProducts = [];
        this.mapListProducts();
        this.#eventListeners();
    }

    #eventListeners () {
        console.log(this.dataProducts.length)
        this.criteria.addEventListener("input", () => this.#updateListProducts(this.input.value));
        this.input.addEventListener("keyup", () => this.#updateListProducts(this.input.value));
    }

    mapListProducts () {
        let children = Array.from(this.listProducts.children);

        children.forEach(child => this.dataProducts.push(this.#getData(child)));
    }

    #getData (proudctCard) {
        let tags = Array.from(proudctCard.firstElementChild.children);
        tags = tags.concat(Array.from(proudctCard.lastElementChild.firstElementChild.children));
        let data = {};

        tags.forEach(tag => {
            data[tag.getAttribute("data-name")] = tag.innerHTML;
            data.proudctCard = proudctCard.getAttribute("data-card");
            data.tag = proudctCard;
        });
        return data;
    }
    
    #findMatch (data, criteria, value) {
        
        const regex = new RegExp(value, "gi");

        if (criteria != "any") return regex.test(data[criteria]);
        for (let key in data) {
            if (regex.test(data[key])) return true;
        }
        return false;
    }

    #updateListProducts (wordToFind) {
        
        let criteria = this.criteria.value;

        this.dataProducts.forEach(product => {

            let match = !this.#findMatch(product, criteria, wordToFind);
            product.tag.style.display = match ? "none" : "block";
        });
    }
}