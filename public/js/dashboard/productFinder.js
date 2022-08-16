
export default class ProductFinder {

    constructor (inputId, criteriaId, btnFinderId, sectionProducts, listProducts, spinner, productObject) {
        this.input = document.getElementById(inputId);
        this.sectionProducts = sectionProducts;
        this.criteria = document.getElementById(criteriaId);
        this.btnFinder = document.getElementById(btnFinderId);
        this.endSearching = document.getElementById("endSearching");
        this.spinner = spinner;
        // this.productsSearched = document.getElementById(productsSearchedId);
        this.productsSearched = document.getElementById("listProducts");        
        this.listProducts = listProducts;
        this.searchStarted = false;
        this.isRendered = true;
        this.rowCount = 12;
        this.lastId = 0;

        this.product = productObject;
        this.#eventListeners();
    }

    #eventListeners () {

        this.input.parentElement.oninput = e => e.preventDefault();
        let content = this.sectionProducts.parentElement.parentElement;

        this.btnFinder.onclick = e => {

            this.searchStarted = true;
            this.listProducts.searchStarted = true;
            content.addEventListener("scroll", () => this.#eventForContent(content));
            this.lastId = 0;
            e.preventDefault();
            if (!this.input.value == "") {
                this.productsSearched.innerHTML = "";
                this.#searchValue();
            }
        }

        this.criteria.addEventListener("input", () => {
            if (this.input.value !== "") {
                this.lastId = 0;
                this.#searchValue();
                this.searchStarted = true;
                this.listProducts.searchStarted = true;
                content.addEventListener("scroll", () => this.#eventForContent(content));
            }
        });

        this.endSearching.onclick = (e) => {

            e.preventDefault();
            if (this.searchStarted) {
                this.listProducts.searchStarted = false;
                this.searchStarted = false;
                this.input.value = "";
                this.productsSearched.innerHTML = "";
                this.listProducts.getData(true, true);
            }
            content.removeEventListener("scroll", () => this.#eventForContent(content));
        }
        
    }

    #eventForContent (content) {
        let isTheEnd = content.offsetHeight + content.scrollTop >= content.scrollHeight;
        let productsIsActive = this.sectionProducts.style.display != "none";
        let isDisplayingProducts = this.productsSearched.style.display != "none";
        if (isTheEnd && this.isRendered && productsIsActive && isDisplayingProducts && this.searchStarted) {
            this.isRendered = false;
            this.#searchValue();
        }
    }

    #searchValue () {
        
        let bodyParams = {
            valueToSearch: this.input.value,
            criteria: this.criteria.value,
            lastId: this.lastId,
            rowCount: this.rowCount,
            biggerThan: this.productsSearched.childElementCount == 0
        };

        this.spinner.showSpinner();
        // this.productsSearched.innerHTML = "";
        fetch("/dashboard/product/find", {
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
                this.lastId = res[res.length - 1].productId;
            } else {
                this.spinner.setText("No se encontraron coincidencias");
                this.spinner.showText();
            }
        })
        .catch (error => console.log(error));
    }
    
    renderProducts (dataProducts) {

        dataProducts.forEach(product => {
            // let {productName, stock, description, solutions} = product;
            
            const card = this.product.createCard(product);
            
            this.productsSearched.appendChild(card);
        });
        this.spinner.hide();
        this.isRendered = true;
    }
}