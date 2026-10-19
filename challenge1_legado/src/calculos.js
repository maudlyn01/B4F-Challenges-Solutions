import {CURRENCY,TAX_IVA,clients,produts} from "./dados.js";

function searchProduct(code) {
    for(let i=0; i< produts.length;i++){
        if(produts[i].code===code){
            return produts[i]; // product found
        }
    }
    return null??"Product not found"; // product not found
}

function searchClient(id) {
    for(let i=0; i< clients.length;i++){
        if(clients[i].id===id){
            return clients[i]; // client found
        }
    }
    return null??"Client not found"; // client not found
}

function formatValue(value) {
    return `${value.toFixed(2)} ${CURRENCY}`;
}

function calculateIVA(value) {
    return value * TAX_IVA;
}



export {searchProduct, searchClient, formatValue, calculateIVA};