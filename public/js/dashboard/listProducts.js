import Product from "./product.js";

export default class ListProducts extends Product {
    
    constructor (listProductsId, sectionProducts, spinner) {
        super();
        this.listProducts = document.getElementById(listProductsId);
        this.spinner = spinner;
        this.sectionProducts = sectionProducts;
        this.dataProducts = [];
        this.rowCount = 54;
        this.requestConfig = {
            rowCount: this.rowCount,
            lastProductId: 0
        };
        this.isRendered = false;

        this.getData(true);
        this.#eventListeners();
    }

    #eventListeners () {
        let content = this.sectionProducts.parentElement.parentElement;
        
        content.onscroll = () => {
            let isTheEnd = content.offsetHeight + content.scrollTop >= content.scrollHeight;
            let productsIsActive = this.sectionProducts.style.display != "none";
            let isDisplayingProducts = this.listProducts.style.display != "none";
            
            if (isTheEnd && this.isRendered && productsIsActive && isDisplayingProducts) {
                this.isRendered = false;
                this.getData();
            }
            // this.spinner.setText("No hay m&aacute;s productos para mostrar");
        }
    }

    getData (biggerThan = false, all = false) {

        this.spinner.showSpinner();
        this.requestConfig.rowCount = all ? 0 : this.rowCount;
        
        fetch("/product/list", {
            method: "POST",
            body: new URLSearchParams({biggerThan: biggerThan, ...this.requestConfig})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw "Error: " + response;
                }
            })
            .then (res => {
                
                if (res.length > 0) {

                    if (!biggerThan || (biggerThan && this.requestConfig.lastProductId == 0)) {
                        this.dataProducts = this.dataProducts.concat(res);
                        let lastId = this.dataProducts[this.dataProducts.length - 1].productId;
                        this.requestConfig.lastProductId = lastId;
                    }
                    
                    this.renderProducts(res);
                } else {
                    
                    this.spinner.setText(this.listProducts.childElementCount > 0 ? "No hay m&aacute;s productos para mostrar" : "No hay productos para mostrar");
                    this.spinner.showText();
                }
            })
    }

    renderProducts (dataProducts) {

        dataProducts.forEach(product => {
            let {productName, stock, description, solutions} = product;
            
            const card = this.createCard(product);

            this.listProducts.appendChild(card);
        });
        this.spinner.hide();
        this.isRendered = true;
    }
}