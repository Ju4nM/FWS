import SideButton from "./sideButton.js";

document.addEventListener("DOMContentLoaded", () => {

    let currentActive;

    const title = document.getElementById("title");
    const btnProducts = new SideButton("btnProducts", title, "Productos", "products", () => {
        currentActive.hideContent();
        currentActive = btnProducts;
    });
    
    currentActive = btnProducts;

    const btnEmployees = new SideButton("btnEmployees", title, "Empleados", "employees", () => {
        currentActive.hideContent();
        currentActive = btnEmployees;
    });
    
    
});