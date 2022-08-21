import Message from "../message.js"

export default class ButtonDelete {

    constructor (productId, card) {
        this.productId = productId;
        this.card = card;
        this.message = new Message ("message","closeMsg");
    }

    createButton () {

        let button = document.createElement("button");
        button.setAttribute("class", "btn btn-danger");
        button.textContent = "Borrar";
        button.addEventListener("click", ()=> this.deleteProduct() )
        return button;
    }

    deleteProduct() {
        fetch("/dashboard/product/delete", {
            method:"post", 
            body: new URLSearchParams({productId:this.productId}) 
        })
        .then(res=>{ 
            if (res.ok){
                return res.json();
            }
            else{
                throw "Error "+ res;
            }
        })
        .then(res=>{
            if(res.status){
                this.card.remove();
                this.message.show(res.msg);
            }
        })
    }
}