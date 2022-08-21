import SideButton from "./sideButton.js";
import HamburgerMenu from "./navbarMenu.js";
import ListProducts from "./listProducts.js";
import ListEmployees from "./listEmployees.js";
import ProductFinder from "./productFinder.js";
import ShoppingCart from "./shoppingCart.js";
import Spinner from "./spinner.js";
import Product from "./product.js";
import ModalForm from "./modalForm.js";
import FormAddProduct from "./formAddProduct.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const userType = document.getElementById("userType").value;
    const modalForm = new ModalForm("FormAgregarProducto");

    const shoppingCart = new ShoppingCart("cartList");
    const product = new Product(shoppingCart, userType);
    let sectionProducts = document.getElementById("products");
    let sectionCart = document.getElementById("shoppingCart");
    let btnAddProduct = document.getElementById("btnAddProduct");
    let spinner = new Spinner("spinner", "spinnerText");

    let listProducts = new ListProducts("listProducts", sectionProducts, spinner, product, shoppingCart);
    new ProductFinder("toSearch", "searchCriteria", "btnFinder", sectionProducts, listProducts, spinner, product, shoppingCart);
    new FormAddProduct("FormAgregarProducto", listProducts, modalForm);
    let currentActive;

    btnAddProduct.addEventListener("click",()=> modalForm.show());
    const title = document.getElementById("title");
    const windowAccount = document.getElementById("windowAccount");
    const closeWindowAccount = document.getElementById("closeWindow");
    const btnAccount = document.getElementById("btnAccount");

    btnAccount.onclick = btnAccountHandler;
    closeWindowAccount.onclick = btnAccountHandler;

    new HamburgerMenu("hamburgerMenu", "sideBar", "overlay");

    const btnProducts = new SideButton("btnProducts", title, "Productos", sectionProducts, () => {
        currentActive.hideContent();
        currentActive = btnProducts;
    });
    
    const btnCart = new SideButton("btnShoppingCart", title, "Carrito", sectionCart, () => {
        currentActive.hideContent();
        currentActive = btnCart;
    });

    currentActive = btnProducts;

    if (userType === "boss") {
        let sectionEmployees = document.getElementById("employees");
        const btnEmployees = new SideButton("btnEmployees", title, "Empleados", sectionEmployees, () => {
            currentActive.hideContent();
            currentActive = btnEmployees;
        });

        new ListEmployees ("employeeTable");
    } else if (userType === "employee") {
        let { value } = document.getElementById("hasJob");
        value = value === "true";
        if (!value) btnAddProduct.style.display = "none";
    }
    
    function btnAccountHandler () {
        let windowStatus = windowAccount.style.display == "none";
        
        windowAccount.parentElement.style.display = windowStatus ? "grid" : "none";
        windowAccount.style.display = windowStatus ? "block" : "none";
    }
    
});