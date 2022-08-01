import Message from "../message.js"
import ModalInput from "../modalInput.js";

export default class ListEmployees {

    constructor (tableId) {
        this.table = document.getElementById(tableId);
        this.tableBody = this.table.querySelector("tbody");
        this.modalInput = new ModalInput("modalInput", "modalField", "modalButton", "closeModal")
        this.message = new Message("message", "closeMsg");
        this.loadData();
    }

    loadData () {

        fetch ("/dashboard/getEmployeeData")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw "Error: " + response;
                }
            })
            .then(res => {
                this.showRows(res);
            });
    }

    showRows (data) {
        let fragment = document.createDocumentFragment(); 
        
        for (let i = 0; i < data.length; i++) {
            let currentData = data[i];
            let button = this.createUncoupleButton(currentData["Nombre empleado"], currentData["Id de empleado"]);
            let tr = document.createElement("tr");
            tr.innerHTML = tr.innerHTML + `
                <td  class = "data-employee">${currentData["Id de empleado"]}</td>
                <td  class = "data-employee">${currentData["Nombre empleado"]} </td>
                <td  class = "data-employee">${currentData["Apellido Paterno Empleado"]} </td>
                <td  class = "data-employee">${currentData["Apellido Materno Empleado"]} </td>
                <td  class = "data-employee">${currentData["Correo electronico de empleado"]} </td>
            `;
            let td = document.createElement("td");
            td.setAttribute("class", "data-employee");
            td.appendChild(button);
            tr.appendChild(td);
            fragment.appendChild(tr);
        }
        this.tableBody.appendChild(fragment);
    }

    createUncoupleButton (employeeName, employeeId) {
        
        const button = document.createElement("button");

        button.setAttribute("class", "btn btn-danger");
        button.setAttribute("type", "button");
        button.textContent = "Desacoplar";

        button.addEventListener("click", () => {
            let row = button.parentElement.parentElement;
            let msg = "Mensaje";
            this.modalInput.confirm(`¿Esta segur@ de que desea desacoplar a ${employeeName}?`)
                .then(() => {
                    let isUncoupled = this.uncoupleEmployee(employeeId, row);
                });
        });

        return button;
    }

    uncoupleEmployee (employeeId, row) {
        
        fetch("/dashboard/uncoupleEmployee", {
            method: "POST",
            body: new URLSearchParams({ employeeId })
        })
            .then(response => {

                if (response.ok) {
                    return response.json();
                } else {
                    throw "Error: " + response;
                }
            })
            .then(res => {
                
                if (res.status) {
                    this.message.show(res.msg);
                    row.remove();
                } else {
                    this.message.showErrors([ res.msg ]);
                }
            })
            .catch(error => console.log(error));
    }
}