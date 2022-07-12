import SideButton from "./sideButton.js";
import HamburgerMenu from "./navbarMenu.js";

document.addEventListener("DOMContentLoaded", () => {
    
    let currentActive;
    const title = document.getElementById("title");
    const windowAccount = document.getElementById("windowAccount");
    const closeWindowAccount = document.getElementById("closeWindow");
    const btnAccount = document.getElementById("btnAccount");

    btnAccount.onclick = btnAccountHandler;
    closeWindowAccount.onclick = btnAccountHandler;

    const navMenu = new HamburgerMenu("hamburgerMenu", "sideBar", "overlay");

    const btnProducts = new SideButton("btnProducts", title, "Productos", "products", () => {
        currentActive.hideContent();
        currentActive = btnProducts;
    });
    
    currentActive = btnProducts;

    const btnEmployees = new SideButton("btnEmployees", title, "Empleados", "employees", () => {
        currentActive.hideContent();
        currentActive = btnEmployees;
    });
    
    function btnAccountHandler () {
        let windowStatus = windowAccount.parentElement.style.display == "none";
        
        windowAccount.parentElement.style.display = windowStatus ? "grid" : "none";
        windowAccount.style.display = windowStatus ? "block" : "none";
    }
    
});
