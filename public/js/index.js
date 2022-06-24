document.addEventListener("DOMContentLoaded", () => {
    
    const btnLogin = document.getElementById("btnLogin");
    const loginForm = document.getElementById("loginForm");

    btnLogin.onclick = () => {
        const data = new FormData(loginForm);
        // const request = new Request("/login", {method: "POST", msg: "Hola mundo"})

        // Prueba fetch
        fetch('/login', {
            method: "POST",
            body: new URLSearchParams(data)
        })
            .then(res => {
                // console.log(res);
                if (res.ok) {
                    return res.json();
                } else { 
                    throw 'Error alv';
                }
            })
            .then(response => {
                console.log(response);
            })
            .catch (err => console.log(err));
    };
});