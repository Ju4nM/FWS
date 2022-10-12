
export default class ShoppingCart {

    constructor (listId) {
        this.list = document.getElementById(listId);
        this.addedProducts = {}; // All products added to cart
        this.buttons = {}; // All buttons from product view
        this.btnBuy = document.getElementById("btnBuy");
        this.btnClearCart = document.getElementById("btnClearCart");
        this.totalPriceTag = document.getElementById("totalPrice");
        this.totalPrice = 0; // Sum of all prducts's prices added
        this.eventListeners();
    }

    eventListeners () {
        
        this.btnBuy.addEventListener("click", () => {
            console.log(this.addedProducts);
            this.buy();
        });

        this.btnClearCart.addEventListener("click", () => this.clearCartHandler());
    }

    addProduct (productData) {
        let { productId } = productData;
        
        if (this.addedProducts[productId]) { // if product exists in the addedProducts
            this.addOne(productId); // doesn't create a card for the shopping cart
        } else {
            let product = this.createElement(productData); // Create a card for the shopping cart
            this.addedProducts[productId] = product; // Add product to list of all products added
            this.totalPrice += product.unitPrice;
            this.updatePrices()
            this.updateView();
        }
    }

    createElement (productData) {
        let { productId, productName, description, stock, unitPrice } = productData;
        const cartCard = document.createElement("div");
        let data = {
            ...productData, // copy of product's data
            stockLimit: stock, // Set stock limit
            stock: 1 // initial stock value
        };

        // create a card's structure
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
        data.buttonAdd = controls.lastElementChild;
        cartCard.appendChild(controls);
        data.stockTag = cartCard.firstElementChild.lastElementChild.previousElementSibling.lastElementChild; // Save stock tag
        data.priceTag = cartCard.firstElementChild.lastElementChild.lastElementChild; // save price tag
        data.cartCard = cartCard; // Save card element
        
        this.list.appendChild(cartCard); // Display card
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
        buttonRemove.addEventListener("click", () => this.removeOne(buttonAdd, productId));
        buttonDelete.addEventListener("click", () => this.deleteProduct(productId));

        controls.appendChild(buttonDelete);
        controls.appendChild(buttonRemove);
        controls.appendChild(buttonAdd);

        return controls; // All buttons in a document fragment
    }

    addOne (productId, fromCart = false) {
        this.addedProducts[productId].stock++;

        // Disable add button if there aren't stock
        if (this.addedProducts[productId].stock === this.addedProducts[productId].stockLimit)
            this.addedProducts[productId].buttonAdd.setAttribute("disabled", "true");
        
        // if the adding is from the cart view then will use the card button method
        if (fromCart) this.buttons[productId].addOne();

        this.totalPrice += this.addedProducts[productId].unitPrice; // Increase the total price

        // Update view with new values
        this.updatePrices(productId);
    }
    
    removeOne (buttonAdd, productId) {
        // if the stock is equal to 1 and the removeOne button is clicked, then the card will be removed from shopping cart view
        if (this.addedProducts[productId].stock == 1) { 
            this.deleteProduct(productId);
            return; // function's ending
        }

        this.addedProducts[productId].stock--; // remove one
        // if stock limit is bigger than the stock added the button will be enable
        if (this.addedProducts[productId].stock < this.addedProducts[productId].stockLimit) buttonAdd.removeAttribute("disabled");
        this.buttons[productId].remove(1); // Remove 1 in the product view

        this.totalPrice -= this.addedProducts[productId].unitPrice; // Decrease the total price
        
        // Update view with new values
        this.updatePrices(productId);
    }

    deleteProduct (productId) {
        let { stock, cartCard, unitPrice  } = this.addedProducts[productId];

        cartCard.remove(); // Remove card from view
        delete this.addedProducts[productId]; // Delete product's data from the list added products
        this.buttons[productId].remove(stock); // Return the stock to the products view

        this.totalPrice -= stock * unitPrice;
        this.updatePrices();
        this.updateView(); // if the added products finish then hidden the view
    }

    addCardButton (productId, button) {
        this.buttons[productId] = button;
    }

    clearCartHandler () {
        let keys = Object.keys(this.addedProducts); // Extract products's keys (prduct's ids) added
        for (let key of keys) this.deleteProduct(key);
    }

    updatePrices (productId) {
        
        // Update price and stock in the view
        if (productId) {
            let { stockTag, stock, unitPrice, priceTag } = this.addedProducts[productId];
            stockTag.textContent = stock;
            let currentPrice = stock * unitPrice;
            priceTag.textContent = `$${currentPrice}`;
        }
        
        // Update total price
        this.totalPriceTag.textContent = `$${ this.totalPrice }`;
    }

    updateView () { // Show or hidden view when the array addedProducts isn't empty
        let keys = Object.keys(this.addedProducts);
        let messageElement = document.getElementById("cartMessage");
        let cartElement = this.list.parentElement;

        if (keys.length == 0) {
            // Hidden view and show message trola
            messageElement.style.display = "";
            cartElement.style.display = "none";
        } else {
            // Show view
            cartElement.style.display = "";
            messageElement.style.display = "none";
        }
    }

    buy () {

        let data = {};
        
        for (let [key, productData] of Object.entries(this.addedProducts)) data[key] = productData.stock; // extract only id and stock that to be a sold

        fetch("dashboard/shopping/createSale", {
            method: "POST",
            body: new URLSearchParams(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw "Error: " + res;
                }
            })
            .then(res => {
                console.log(res);
            })
            .catch(error => console.log(error));
    }
}
