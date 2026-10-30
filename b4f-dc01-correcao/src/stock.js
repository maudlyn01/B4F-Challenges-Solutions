// Mercearia Xiluva — módulo de gestão de stock (Desafio de Código I · correcção)
// Regras: só métodos de array (sem for/while) e sem alterar os dados recebidos.
import { TAXA_IVA } from "../dados/produtos.js";

// ---------- Auxiliares (não exportadas) ----------

// Arredonda a 2 casas decimais: 985.9999999999999 → 986
const arredondar = (valor) => Math.round(valor * 100) / 100;

// "Água Mineral" → "agua mineral" (usada na pesquisa sem acentos — tarefa 17)
const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// Comparação de nomes com a ordem alfabética portuguesa (Á, Ç, Ó no sítio certo)
const porNome = (a, b) => a.nome.localeCompare(b.nome, "pt");

// =====================================================================
// Nível 1 · Essencial
// =====================================================================

// Tarefa 1 — preço unitário com IVA
export const precoComIva = (produto, taxa = TAXA_IVA) =>
  arredondar(produto.precoBase * (1 + taxa));

// Tarefa 2 — só os produtos activos
export const listarActivos = (produtos) => produtos.filter((p) => p.activo);

// Tarefa 3 — valor do stock dos produtos activos
export function valorDoStock(produtos) {
  const semIva = arredondar(
    listarActivos(produtos).reduce((soma, p) => soma + p.precoBase * p.stock, 0),
  );
  const iva = arredondar(semIva * TAXA_IVA);
  return { semIva, iva, comIva: arredondar(semIva + iva) };
}

// Tarefa 4 — activos abaixo do stock mínimo, do mais urgente ao menos urgente
export const abaixoDoMinimo = (produtos) =>
  listarActivos(produtos)
    .filter((p) => p.stock < p.stockMinimo)
    .map(({ id, nome, stock, stockMinimo }) => ({
      id,
      nome,
      stock,
      emFalta: stockMinimo - stock,
    }))
    .toSorted((a, b) => b.emFalta - a.emFalta || porNome(a, b));

// Tarefa 5 — um produto pelo id (ou undefined)
export const obterPorId = (produtos, id) => produtos.find((p) => p.id === id);

// Tarefas 6 e 17 — pesquisa sem distinguir maiúsculas nem acentos
export function pesquisar(produtos, termo) {
  const procurado = normalizar(termo.trim());
  return listarActivos(produtos).filter((p) =>
    normalizar(p.nome).includes(procurado),
  );
}

// Tarefa 7 — cópia ordenada por nome, preço ou stock
const COMPARADORES = {
  nome: porNome,
  preco: (a, b) => a.precoBase - b.precoBase,
  stock: (a, b) => b.stock - a.stock,
};

export function ordenar(produtos, criterio) {
  const comparar = COMPARADORES[criterio];
  if (!comparar)
    throw new RangeError(`Critério de ordenação inválido: ${criterio}`);
  // toSorted devolve uma cópia; sort alteraria o array original
  return produtos.toSorted(comparar);
}

// =====================================================================
// Nível 2 · Intermédio
// =====================================================================

const inteiroNaoNegativo = (n) => Number.isInteger(n) && n >= 0;

// Cada regra: [função que detecta o problema, mensagem]
const REGRAS = [
  [(p) => !/^P\d{3}$/.test(p.id ?? ""), "id inválido"],// id ausente ou não, no formato P123, de 000-999
  [(p) => typeof p.nome !== "string" || p.nome.trim() === "", "nome em falta"],// nome ausente ou vazio 
  [(p) => !Number.isFinite(p.precoBase) || p.precoBase <= 0, "preço inválido"],// preço ausente, não numérico ou não positivo
  [(p) => !inteiroNaoNegativo(p.stock), "stock inválido"],// se o stock não for inteiro ou for negativo
  [(p) => !inteiroNaoNegativo(p.stockMinimo), "stock mínimo inválido"],//se o stock mínimo não for inteiro ou for negativo
];

// Tarefa 8 — validação do inventário
export function validar(produtos) {
  const erros = produtos.flatMap((p, i) => {
    const ref = p.id ?? `#${i}`;
    const problemas = REGRAS.filter(([temProblema]) => temProblema(p)).map(
      ([, mensagem]) => mensagem,
    );
    // duplicado = já existe um produto com o mesmo id numa posição anterior
    const duplicado = produtos.findIndex((q) => q.id === p.id) !== i;
    return [...problemas, ...(duplicado ? ["id duplicado"] : [])].map(
      (problema) => `${ref}: ${problema}`,
    );
  });
  return { valido: erros.length === 0, erros };
}

// Tarefa 9 — devolve um NOVO array com o stock actualizado
export function registarVenda(produtos, { produtoId, quantidade }) {
  const indice = produtos.findIndex((p) => p.id === produtoId); 
  if (indice === -1) throw new Error(`Produto inexistente: ${produtoId}`); //error é mais apropriado que RangeError para id inexistente

  const produto = produtos[indice];
  if (!produto.activo) throw new Error(`Produto inactivo: ${produtoId}`);
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new RangeError(`Quantidade inválida: ${quantidade}`); //rangeError é mais apropriado que Error para valores fora do intervalo esperado
  }
  if (quantidade > produto.stock) {
    throw new Error(
      `Stock insuficiente para ${produto.nome}: ` +
        `pedido ${quantidade}, disponível ${produto.stock}`,
    );
  }
  // with (ES2023) devolve uma cópia do array com a posição substituída
  return produtos.with(indice, { ...produto, stock: produto.stock - quantidade });
}

// Tarefa 10 — vendas agregadas por produto, receita total e vendas ignoradas
export function resumoVendas(produtos, vendas) {
  const existe = (venda) => obterPorId(produtos, venda.produtoId) !== undefined;
  const validas = vendas.filter(existe);
  const ignoradas = vendas.filter((v) => !existe(v)).map((v) => v.id);

  const porProduto = produtos
    .map((p) => {
      const quantidade = validas
        .filter((v) => v.produtoId === p.id)
        .reduce((soma, v) => soma + v.quantidade, 0);
      return {
        id: p.id,
        nome: p.nome,
        quantidade,
        receita: arredondar(quantidade * precoComIva(p)),
      };
    })
    .filter((linha) => linha.quantidade > 0)
    .toSorted((a, b) => b.quantidade - a.quantidade || porNome(a, b));

  const receitaTotal = arredondar(
    porProduto.reduce((soma, l) => soma + l.receita, 0),
  );
  return { porProduto, receitaTotal, ignoradas };
}

// Tarefa 11 — receita (com IVA) por categoria, só com reduce
export const receitaPorCategoria = (produtos, vendas) =>
  vendas.reduce((totais, venda) => {
    const produto = obterPorId(produtos, venda.produtoId);
    if (!produto) return totais; // venda de produto inexistente: ignorar
    const anterior = totais[produto.categoria] ?? 0;
    return {
      ...totais,
      [produto.categoria]: arredondar(
        anterior + venda.quantidade * precoComIva(produto),
      ),
    };
  }, {});

// Tarefa 12 — nomes dos n produtos mais vendidos
export const maisVendidos = (produtos, vendas, n = 3) =>
  resumoVendas(produtos, vendas)
    .porProduto.slice(0, n)
    .map((linha) => linha.nome);

// Tarefa 13 — valor em meticais, no formato de Moçambique
const MT = new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" });
export const formatarMT = (valor) => MT.format(valor);

// =====================================================================
// Nível 3 · Bónus
// =====================================================================

// Tarefa 15 — uma página da lista
export function paginar(lista, pagina = 1, porPagina = 5) {
  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  if (!Number.isInteger(pagina) || pagina < 1 || pagina > totalPaginas) {
    throw new RangeError(`Página inválida: ${pagina}`);
  }
  const inicio = (pagina - 1) * porPagina;
  return {
    itens: lista.slice(inicio, inicio + porPagina),
    pagina,
    totalPaginas,
    temSeguinte: pagina < totalPaginas,
  };
}

// Tarefa 16 — encomenda para repor o dobro do stock mínimo (custo sem IVA)
export function sugerirEncomenda(produtos) {
  // flatMap: [] descarta o produto e [linha] mantém-no (filtra e transforma)
  const linhas = listarActivos(produtos).flatMap((p) => {
    if (p.stock >= p.stockMinimo) return [];
    const quantidade = p.stockMinimo * 2 - p.stock;
    return [
      { id: p.id, nome: p.nome, quantidade, custo: quantidade * p.precoBase },
    ];
  });
  return { linhas, custoTotal: linhas.reduce((soma, l) => soma + l.custo, 0) };
}
