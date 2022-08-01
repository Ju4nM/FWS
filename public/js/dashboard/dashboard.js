import SideButton from "./sideButton.js";
import HamburgerMenu from "./navbarMenu.js";
import ListProducts from "./listProducts.js";
import ListEmployees from "./listEmployees.js";
import ProductFinder from "./productFinder.js";
import Spinner from "./spinner.js";


document.addEventListener("DOMContentLoaded", () => {
    
    const userType = document.getElementById("userType").value;
    
    let sectionProducts = document.getElementById("products");
    let spinner = new Spinner("spinner", "spinnerText");

    let listProducts = new ListProducts("listProducts", sectionProducts, spinner);
    new ProductFinder("toSearch", "searchCriteria", "btnFinder", sectionProducts, listProducts, spinner);
    let currentActive;
    
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
    
    currentActive = btnProducts;

    if (userType === "boss") {
        let sectionEmployees = document.getElementById("employees");
        const btnEmployees = new SideButton("btnEmployees", title, "Empleados", sectionEmployees, () => {
            currentActive.hideContent();
            currentActive = btnEmployees;
        });

        let listEmployees = new ListEmployees ("employeeTable");
    }
    
    function btnAccountHandler () {
        let windowStatus = windowAccount.style.display == "none";
        
        windowAccount.parentElement.style.display = windowStatus ? "grid" : "none";
        windowAccount.style.display = windowStatus ? "block" : "none";
    }
    
});