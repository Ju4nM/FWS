import EditButton from "../account/editButton.js";
import SaveButton from "./saveButton.js";

document.addEventListener("DOMContentLoaded", () => {

    let productId = document.getElementById("productId").value;
    const btnSave = document.getElementById("btnSave");
    const saveButton = new SaveButton("productForm", productId, btnSave);

    let generalData = new EditButton ("generalData", "input[type=text], textarea", btnEditHandler);
    let variableData = new EditButton ("variableData", "input", btnEditHandler);

    saveButton.addEditButton(generalData);
    saveButton.addEditButton(variableData);

    function btnEditHandler (_, isEditing) {
        if (isEditing) btnSave.removeAttribute("disabled");
        saveButton.toggleEdit();
    }
});