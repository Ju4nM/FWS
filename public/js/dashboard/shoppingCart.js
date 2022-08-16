
export default class ShoppingCart {

    constructor (listId) {
        this.list = document.getElementById(listId);
        this.addedProducts = {};
        this.buttons = {};
    }

    addProduct (productData) {
        let { productId} = productData;
        
        if (this.addedProducts[productId]) {
            this.addOne(productId);
        } else {
            let product = this.createElement(productData);
            this.addedProducts[productId] = product;
            console.log(this.addedProducts);
        }
    }

    createElement (productData) {
        let { productId, productName, description, stock, unitPrice } = productData;
        const cartCard = document.createElement("div");
        let data = {
            ...productData,
            stockLimit: stock,
            stock: 1
        };

        cartCard.setAttribute("class", "cartCard align-items-start");
        cartCard.innerHTML = `
            <div class="dataCard align-items-start">
                    <div class = "d-flex flex-column align-items-end">
                    <h5 class = "text-primary fw-bold">Producto</h5>
                    <span>${productName}</span>
                </div>
                    <div class = "d-flex flex-column align-items-end">
                    <h5 class = "text-dark fw-bold">Descripcion</h5>
                    <span>${description}</span>
                </div>
                    <div class = "d-flex flex-column align-items-end">
                    <h5 class = "text-warning fw-bold">Cantidad</h5>
                    <span>1</span>
                </div>
                <div class="d-flex flex-column align-items-end">
                    <h5 class = "text-success fw-bold">Precio</h5>
                    <span>$${unitPrice}</span>
                </div>
            </div>
        `;

        const controls = document.createElement("div");
        controls.setAttribute("class", "cardControls");
        controls.appendChild(this.createControls(productId));
        cartCard.appendChild(controls);
        data.stockTag = cartCard.firstElementChild.lastElementChild.previousElementSibling.lastElementChild;
        data.cartCard = cartCard;
        
        this.list.appendChild(cartCard);
        return data;
    }

    createControls (productId) {
        
        const controls = document.createDocumentFragment();
        
        // Button delete
        const buttonDelete = document.createElement("button");
        buttonDelete.setAttribute("class", "btn btn-danger");
        buttonDelete.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";

        // Button remove one 
        const buttonRemove = document.createElement("button");
        buttonRemove.setAttribute("class", "btn btn-warning");
        buttonRemove.textContent = "-1";

        // Button add one
        const buttonAdd = document.createElement("button");
        buttonAdd.setAttribute("class", "btn btn-success");
        buttonAdd.textContent = "+1";

        // Event listeners
        buttonAdd.addEventListener("click", () => this.addOne(productId, true));
        buttonRemove.addEventListener("click", () => this.removeOne(productId));
        buttonDelete.addEventListener("click", () => this.deleteProduct(productId));

        controls.appendChild(buttonDelete);
        controls.appendChild(buttonRemove);
        controls.appendChild(buttonAdd);

        return controls;
    }

    addOne (productId, fromCart = false) {
        this.addedProducts[productId].stock++;
        if (fromCart) this.buttons[productId].addOne();
        this.addedProducts[productId].stockTag.textContent = this.addedProducts[productId].stock;
    }
    
    removeOne (productId) {
        if (this.addedProducts[productId].stock == 1) {
            this.deleteProduct(productId);
            return;
        }
        this.addedProducts[productId].stock--;
        this.buttons[productId].remove(1);
        this.addedProducts[productId].stockTag.textContent = this.addedProducts[productId].stock;
    }

    deleteProduct (productId) {
        let { stock, cartCard  } = this.addedProducts[productId];
        cartCard.remove();
        delete this.addedProducts[productId];
        this.buttons[productId].remove(stock);
        console.log(this.addedProducts);
    }

    addCardButton (productId, button) {
        this.buttons[productId] = button;
    }
}