// Tarefa 14 — relatório semanal da Mercearia Xiluva (npm start)
import { produtos } from "../dados/produtos.js";
import { vendas } from "../dados/vendas.js";
import * as S from "./stock.js";

const linha = (rotulo, valor) => `  ${rotulo.padEnd(28, ".")} ${valor}`;
const stock = S.valorDoStock(produtos);
const resumo = S.resumoVendas(produtos, vendas);

console.log("MERCEARIA XILUVA · RELATÓRIO SEMANAL\n");
console.log(
  linha(
    "Produtos activos",
    `${S.listarActivos(produtos).length} de ${produtos.length}`,
  ),
);
console.log(linha("Valor do stock (sem IVA)", S.formatarMT(stock.semIva)));
console.log(linha("Valor do stock (com IVA)", S.formatarMT(stock.comIva)));

console.log("\nALERTAS DE STOCK");
S.abaixoDoMinimo(produtos).forEach((p) =>
  console.log(
    linha(`${p.id} ${p.nome}`, `stock ${p.stock}, faltam ${p.emFalta}`),
  ),
);

console.log("\nVENDAS DA SEMANA");
console.log(linha("Receita total (com IVA)", S.formatarMT(resumo.receitaTotal)));
S.maisVendidos(produtos, vendas).forEach((nome, i) =>
  console.log(linha(`Top ${i + 1}`, nome)),
);

console.log("\nRECEITA POR CATEGORIA (com IVA)");
Object.entries(S.receitaPorCategoria(produtos, vendas))
  .toSorted(([, a], [, b]) => b - a)
  .forEach(([categoria, receita]) =>
    console.log(linha(categoria, S.formatarMT(receita))),
  );
console.log(`\nVendas ignoradas: ${resumo.ignoradas.join(", ") || "nenhuma"}`);
