# Mercearia Xiluva — Gestão de Stock

Desafio de Código I (DC-01) do Bootcamp Bytes4Future · Módulo JavaScript Avançado.

Módulo JavaScript que, a partir do inventário e das vendas da semana da Mercearia Xiluva (Malhangalene, Maputo), calcula o valor do stock, identifica os produtos a encomendar, resume as vendas e imprime um relatório semanal na consola.

## Requisitos

- Node.js LTS, versão 22 ou superior (`node --version`)
- Sem dependências externas: não é preciso `npm install`

## Como executar

```bash
npm start                   # imprime o relatório semanal
node --watch src/index.js   # volta a executar sempre que um ficheiro é gravado
```

## Estrutura

```
dados/
  produtos.js    inventário (15 produtos) e TAXA_IVA = 0.16
  vendas.js      vendas da semana (dia 1 = segunda … dia 6 = sábado)
src/
  stock.js       as 15 funções do desafio
  index.js       relatório semanal (npm start)
```

## Funções e estado das tarefas

| Tarefa | Função | Nível | Estado |
|---|---|---|---|
| 1 | `precoComIva(produto, taxa)` | Essencial | ✔ |
| 2 | `listarActivos(produtos)` | Essencial | ✔ |
| 3 | `valorDoStock(produtos)` | Essencial | ✔ |
| 4 | `abaixoDoMinimo(produtos)` | Essencial | ✔ |
| 5 | `obterPorId(produtos, id)` | Essencial | ✔ |
| 6 | `pesquisar(produtos, termo)` | Essencial | ✔ |
| 7 | `ordenar(produtos, criterio)` | Essencial | ✔ |
| 8 | `validar(produtos)` | Intermédio | ✔ |
| 9 | `registarVenda(produtos, venda)` | Intermédio | ✔ |
| 10 | `resumoVendas(produtos, vendas)` | Intermédio | ✔ |
| 11 | `receitaPorCategoria(produtos, vendas)` | Intermédio | ✔ |
| 12 | `maisVendidos(produtos, vendas, n)` | Intermédio | ✔ |
| 13 | `formatarMT(valor)` | Intermédio | ✔ |
| 14 | Relatório em `src/index.js` | Intermédio | ✔ |
| 15 | `paginar(lista, pagina, porPagina)` | Bónus | ✔ |
| 16 | `sugerirEncomenda(produtos)` | Bónus | ✔ |
| 17 | Pesquisa sem acentos (em `pesquisar`) | Bónus | ✔ |

## Exemplo de utilização

```js
import { produtos } from "./dados/produtos.js";
import { abaixoDoMinimo, precoComIva, registarVenda } from "./src/stock.js";

precoComIva(produtos[0]); // 986
abaixoDoMinimo(produtos).map((p) => p.id); // ["P009", "P005", "P002", "P012"]

const depois = registarVenda(produtos, { produtoId: "P001", quantidade: 3 });
depois[0].stock; // 39 — produtos[0].stock continua a ser 42
```

## Resultado de `npm start`

```
MERCEARIA XILUVA · RELATÓRIO SEMANAL

  Produtos activos............ 14 de 15
  Valor do stock (sem IVA).... 102 460,00 MTn
  Valor do stock (com IVA).... 118 853,60 MTn

ALERTAS DE STOCK
  P009 Refrigerante 2 L....... stock 4, faltam 20
  P005 Feijão manteiga 1 kg... stock 0, faltam 10
  P002 Farinha de milho 25 kg. stock 8, faltam 2
  P012 Pasta de dentes 100 ml. stock 9, faltam 1

VENDAS DA SEMANA
  Receita total (com IVA)..... 30 107,80 MTn
  Top 1....................... Refrigerante 2 L
  Top 2....................... Açúcar castanho 2 kg
  Top 3....................... Arroz agulha 10 kg

RECEITA POR CATEGORIA (com IVA)
  Mercearia................... 23 223,20 MTn
  Bebidas..................... 4912,60 MTn
  Higiene..................... 1171,60 MTn
  Limpeza..................... 452,40 MTn
  Casa........................ 348,00 MTn

Vendas ignoradas: V006
```

## Decisões tomadas

- **Sem ciclos.** Todas as funções usam métodos de array (`map`, `filter`, `reduce`, `flatMap`, `find`, `findIndex`, `toSorted`, `with`, `slice`). O `forEach` só aparece em `index.js`, para imprimir.
- **Sem alterar os dados recebidos.** Ordenações com `toSorted` (e não `sort`); a venda devolve um novo array com `with` e um novo objecto com spread.
- **Um só sítio para cada regra.** O IVA é sempre calculado por `precoComIva`, com a constante `TAXA_IVA`; o arredondamento está numa única função auxiliar.
- **Arredondamento a 2 casas** no fim de cada cálculo monetário, para evitar resultados como `985.9999999999999`.
- **Ordem alfabética portuguesa** com `localeCompare(b, "pt")`, para «Açúcar» e «Água» aparecerem no início e não no fim.
- **Erros claros:** `RangeError` para valores fora do intervalo (critério, quantidade, página) e `Error` com mensagem explicativa para produtos inexistentes, inactivos ou sem stock.
- **Validação legível:** as regras de `validar` estão numa lista `[detecta o problema, mensagem]`, fácil de ler e de alargar.

## Dificuldades e como foram resolvidas

- `sort()` sem comparador pôs «Água mineral» e «Óleo de cozinha» no fim da lista — resolvido com `localeCompare`.
- `850 * 1.16` dá `985.9999999999999` — resolvido com `Math.round(valor * 100) / 100`.
- A venda V006 refere o produto P099, que não existe — as vendas de produtos inexistentes são ignoradas e listadas no relatório.
- O separador dos milhares do `Intl.NumberFormat` é um espaço não separável, por isso não se deve comparar o texto formatado com um espaço normal.
