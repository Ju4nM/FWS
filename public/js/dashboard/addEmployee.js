import Message from "../message.js";

export default class AddEmployee {

    constructor (formId, employeeTableId, listEmployees) {
        this.form = document.getElementById(formId);
        this.table = document.getElementById(employeeTableId);
        this.message = new Message("message", "closeMsg");
        this.listEmployees = listEmployees;
        this.eventListeners();
    }

    eventListeners () {
        this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.addEmployee();
        });
    }

    addEmployee () {
        let data = new FormData(this.form);

        fetch("/dashboard/addEmployee", {
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
            .then (res => {
                if (res.status) {
                    this.message.show(res.msg);
                    console.log(res.employeeData);
                    this.showNewEmployee(res.employeeData);
                } else {
                    if (res.errors) {
                        console.log("errores");
                        this.message.showErrors(res.errors);
                    }
                    else this.message.show(res.msg);
                }
            })
            .catch(error => console.log(error));
    }

    showNewEmployee (employeeData) {
        let { employeeId, name, lastName, secondLastName, email } = employeeData;
        let tr = document.createElement("tr");
        let template = `
            <td class = "data-employee">${employeeId}</td>
            <td class = "data-employee">${name}</td>
            <td class = "data-employee">${lastName}</td>
            <td class = "data-employee">${secondLastName}</td>
            <td class = "data-employee">${email}</td>
        `;
        tr.innerHTML = template;
        let uncoupleButton = this.listEmployees.createUncoupleButton(name, employeeId);
        let td = document.createElement("td");
        td.setAttribute("class", "data-employee");
        td.appendChild(uncoupleButton);
        tr.appendChild(td);

        this.table.querySelector("tbody").appendChild(tr);
        if (this.table.style.display !== "") {
            this.table.nextElementSibling.style.display = "none";
        }
        this.table.style.display = "";
        this.form.reset();
    }
}
