import Product from "./product.js";

export default class ProductFinder extends Product {

    constructor (inputId, criteriaId, btnFinderId, listProducts, spinner) {
        super();
        this.input = document.getElementById(inputId);
        this.criteria = document.getElementById(criteriaId);
        this.btnFinder = document.getElementById(btnFinderId);
        this.endSearching = document.getElementById("endSearching");
        this.spinner = spinner;
        // this.productsSearched = document.getElementById(productsSearchedId);
        this.productsSearched = document.getElementById("listProducts");        
        this.listProducts = listProducts;
        this.searchStarted = false;

        this.#eventListeners();
    }

    #eventListeners () {

        this.input.parentElement.oninput = e => e.preventDefault();

        this.btnFinder.onclick = e => {

            e.preventDefault();
            if (!this.input.value == "") {
                this.productsSearched.innerHTML = "";
                this.#searchValue();
                this.searchStarted = true;
            }
        }

        this.criteria.oninput = () => {
            if (this.input.value !== "")
                this.#searchValue();
        }

        this.endSearching.onclick = (e) => {

            e.preventDefault();
            if (this.searchStarted) {
                this.searchStarted = false;
                this.input.value = "";
                this.productsSearched.innerHTML = "";
                this.listProducts.getData(true, true);
            }
        }
    }

    #searchValue () {
        
        let bodyParams = {
            valueToSearch: this.input.value,
            criteria: this.criteria.value
        };
        
        this.spinner.showSpinner();
        this.productsSearched.innerHTML = "";
        fetch("/product/find", {
            method: "POST",
            body: new URLSearchParams(bodyParams)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw "Error" + response;
            }
        })
        .then (res => {
            
            if (res.length > 0) {
                this.renderProducts(res);
            } else {
                console.log("NO hay nada");
                this.spinner.setText("No se encontraron coincidencias");
                this.spinner.showText();
            }
        })
        .catch (error => console.log(error));
    }
    
    renderProducts (dataProducts) {

        dataProducts.forEach(product => {
            let {productName, stock, description, solutions} = product;
            
            const card = this.createCard(product);
            
            this.productsSearched.appendChild(card);
        });
        this.spinner.hide();
    }
}