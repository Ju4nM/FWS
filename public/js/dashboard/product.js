import ButtonAdd from "./addProduct.js";
import ButtonDelete from "./buttonDelete.js";

export default class Product {

    constructor (shoppingCart, userType) {
        this.shoppingCart = shoppingCart;
        this.userType = userType;
        this.products = {};
    }

    createCard (productData) {
        let { productId, productName, stock, description, solutions, unitPrice, expirationDate } = productData;

        if (this.products[productId]) {
            return this.products[productId];
        }
        const card = document.createElement("div");
        card.setAttribute("class", "productCard");
        
        // Title and stock
        let div = document.createElement("div");
        div.setAttribute("class", "d-flex justify-content-between gap-2 align-items-center px-2");

        const link = document.createElement("a");
        link.setAttribute("href", `/dashboard/product/${productId}`);
        link.setAttribute("class", "productLink");
        // link.setAttribute("target", "_blank");
        link.textContent = productName;
        
        const tagTitle = document.createElement("h3"); // Title
        tagTitle.appendChild(link);

        const tagStock = document.createElement("span"); //Stock
        tagStock.setAttribute("class", "text-primary fw-bold");
        tagStock.textContent = stock

        div.appendChild(tagTitle);
        div.appendChild(tagStock);

        card.appendChild(div);

        // Description and solutions
        div = document.createElement("div");

        let firstInnerDiv = div.cloneNode(false);
        let secondInnerDiv = div.cloneNode(false);
        secondInnerDiv.setAttribute("class", "d-flex flex-column align-items-end text-end");

        div.setAttribute("class", "d-flex justify-content-between");
        const tagDescription = document.createElement("p"); // Description
        const tagSolutions = tagDescription.cloneNode(false); // Solutions

        secondInnerDiv.innerHTML = `
            <p><span class = "text-warning fw-bold">Expira: </span> ${expirationDate}</p>
            <p><span class = "text-success fw-bold">Precio: </span>$${unitPrice}</p>
        `;
        tagDescription.innerHTML = description;
        tagSolutions.textContent = solutions;
        
        firstInnerDiv.appendChild(tagDescription);
        firstInnerDiv.appendChild(tagSolutions);

        div.appendChild(firstInnerDiv);
        div.appendChild(secondInnerDiv);
        card.appendChild(div);

        // Buttons
        div = document.createElement("div");
        div.setAttribute("class", "d-flex justify-content-end gap-2");
        // div.innerHTML = '<button class="btn btn-primary">Agregar</button><button class="btn btn-danger">Borrar</button>'
        if (this.userType === "boss") {
            const buttonDelete = new ButtonDelete(productId, card);
            div.appendChild(buttonDelete.createButton());
        }
        const buttonAdd = new ButtonAdd(this.shoppingCart, productData);
        this.shoppingCart.addCardButton(productId, buttonAdd); // Save all add buttons in shoppingCart Object
        div.appendChild(buttonAdd.createButton());
        card.appendChild(div);
        
        this.products[productId] = card;
        return card;
    }

}
