import LeaveJob from "./leaveJob.js";
import SaveButton from "./saveButton.js";

document.addEventListener("DOMContentLoaded", () => {

    const isBoss = document.getElementById("isBoss").value === "true";
    const hasJob = !isBoss ? document.getElementById("hasJob").value === "true" : null;
    const saveButton = new SaveButton("saveButton");
    
    const formUserData = document.getElementById("formUserData");
    
    formUserData.onsubmit = e => {
        e.preventDefault;
    }
    
    if (!hasJob && !isBoss) {
        const employeeId = parseInt(document.getElementById("employeeId").value);
        document.getElementById("copyId").onclick = () => navigator.clipboard.writeText(employeeId).then(() => console.log("Id copied"));
    }

    if (hasJob && !isBoss) {
        new LeaveJob("leaveJob");
    }
});