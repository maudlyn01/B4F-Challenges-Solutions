// ============================================================
//  legado.js — Relatório de encomendas da "Loja do Bairro"
//  Refactoracao de legado
// ============================================================

let STORE_NAME = "Loja do Bairro";
let TAX_IVA = 0.17;
let CURRENCY = "MT";

const produts = [
  { code: "P01", name: "Arroz 5kg", price: 450, category: "Mercearia" },
  { code: "P02", name: "Óleo 1L", price: 180, category: "Mercearia" },
  { code: "P03", name: "Sabão em barra", price: 60, category: "Limpeza" },
  { code: "P04", name: "Caderno A4", price: 95, category: "Papelaria" },
  { code: "P05", name: "Caneta azul", price: 25 }

];

const clients = [
  { id: 1, name: "Ana Macuácua", city: "Maputo" },
  { id: 2, name: "Carlos Nhantumbo", city: "Matola" },
  { id: 3, name: "Fátima Sitoe" }
];

const orders = [
  {
    number: 101,
    clientId: 1,
    items: [
      { code: "P01", quantity: 2 },
      { code: "P02", quantity: 3 }
    ],
    discount: 50
  },
  {
    number: 102,
    clientId: 3,
    items: [
      { code: "P04", quantity: 5 },
      { code: "P05" },
      { code: "P03", quantity: 4 }
    ]
  },
  {
    number: 103,
    clientId: 2,
    items: [
      { code: "P03", quantity: 10 },
      { code: "P01", quantity: 1 }
    ],
    discount: 100
  }
];

export {
  STORE_NAME,
  TAX_IVA,
  CURRENCY,
  produts,
  clients,
  orders
};