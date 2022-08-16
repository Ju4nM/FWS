export default class ListProducts {
    
    constructor (listProductsId, sectionProducts, spinner, productObject) {
        this.listProducts = document.getElementById(listProductsId);
        this.spinner = spinner;
        this.sectionProducts = sectionProducts;
        this.dataProducts = [];
        this.rowCount = 12;
        this.product = productObject;
        this.requestConfig = {
            rowCount: this.rowCount,
            lastProductId: 0
        };
        this.isRendered = false;
        this.searchStarted = false;

        this.getData(true);
        this.#eventListeners();
    }

    #eventListeners () {
        let content = this.sectionProducts.parentElement.parentElement;
        content.onscroll = () => {
            let isTheEnd = content.offsetHeight + content.scrollTop >= content.scrollHeight;
            let productsIsActive = this.sectionProducts.style.display != "none";
            let isDisplayingProducts = this.listProducts.style.display != "none";
            
            if (isTheEnd && this.isRendered && productsIsActive && isDisplayingProducts && !this.searchStarted) {
                this.isRendered = false;
                this.getData();
            }
            // this.spinner.setText("No hay m&aacute;s productos para mostrar");
        }
    }

    getData (biggerThan = false, all = false) {

        this.spinner.showSpinner();
        this.requestConfig.rowCount = all ? 0 : this.rowCount;
        
        fetch("/dashboard/product/list", {
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
                    // console.log(this.requestConfig.lastProductId);
                    this.renderProducts(res);
                } 
                
                if (!res.length > 0 || res.length < this.rowCount) {
                    
                    this.spinner.setText(this.listProducts.childElementCount > 0 ? "No hay m&aacute;s productos para mostrar" : "No hay productos para mostrar");
                    this.spinner.showText();
                    this.isRendered = false;
                }
            })
    }

    renderProducts (dataProducts) {

        dataProducts.forEach(product => {
            // let {productName, stock, description, solutions} = product;
            
            const card = this.product.createCard(product);

            this.listProducts.appendChild(card);
        });
        this.spinner.hide();
        this.isRendered = true;
    }
}