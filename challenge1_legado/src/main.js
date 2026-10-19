import { orders,STORE_NAME } from './dados.js';
import { searchProduct, searchClient, formatValue, calculateIVA } from './calculos.js';

function printReport() {
    let totalGeneral = 0;
    let totalIVA = 0;

    console.log(`\n
      ========================================
      ${STORE_NAME} - Relatório de encomendas
      ========================================`);
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let client = searchClient(order.clientId);
        let city = client?.city ?? "Cidade não indicada";
        let discount = order.discount ?? 0;
        let subtotal = 0;

        console.log(`\nEncomenda nº: ${order.number} - ${client?.name ?? "Cliente não encontrado"} - (${city})`);

        for (let j = 0; j < order.items.length; j++) {
            const item = order.items[j];
            let product = searchProduct(item.code);
            let quantity = item.quantity ?? 1;
            let category = product?.category ?? "Diversos";
            let itemTotal = (product?.price ?? 0) * quantity;
            subtotal += itemTotal;
            console.log(`- ${quantity} x ${product?.name ?? "Produto não encontrado"} - [${category}] = ${formatValue(itemTotal)}`);
        }

        let base = subtotal - discount;
        let iva = calculateIVA(base);
        let total = base + iva;

        console.log(` 
        Subtotal: ${formatValue(subtotal)}
        Desconto: ${formatValue(discount)}
        IVA: ${formatValue(iva)}
        Total: ${formatValue(total)}`);

        totalGeneral += total;
        totalIVA += iva;
    }

    console.log(`\n
        ----------------------------------------
        Encomendas processadas: ${orders.length}
        IVA total cobrado: ${formatValue(totalIVA)}
        Facturação total: ${formatValue(totalGeneral)}
        ----------------------------------------`);
};

printReport();