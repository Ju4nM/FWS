
export default class ButtonAdd {

    constructor (shoppingCart, productData) {
        this.productData = productData;
        this.shoppingCart = shoppingCart;
        this.stockElement = null;
        this.realStock = productData.stock;
        this.stock = productData.stock;
        this.button;
    }

    update() {
        if (this.stockElement !== null) this.stockElement.textContent = this.stock;

        if (this.stock === 0) {
            this.button.setAttribute("disabled", "");
        } else if (this.stock > 0) {
            this.button.removeAttribute("disabled");
        }
    }

    createButton () {

        // Create a new add button for the cardProduct
        const button = document.createElement("button");
        button.setAttribute("class", "btn btn-primary");
        button.textContent = "Agregar";
        
        // event listener for button, update product view and shopping cart view
        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (this.stockElement == null) this.stockElement = button.parentElement.parentElement.firstElementChild.lastElementChild;
            this.shoppingCart.addProduct(this.productData);
            this.addOne();
        });

        this.button = button;
        this.update();

        return button;
    }

    addOne() {
        this.stock--;
        this.update();
    }

    remove (amount) {
        this.stock += amount;
        this.update();
    }
}
