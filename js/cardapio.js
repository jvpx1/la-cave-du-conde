import { precoDoPrato, formatarPreco } from "./precos.js";
import { adicionarItem } from "./comanda.js";

// Categorias com `clicavel: true` entram na comanda.
// Drinks e Variedades ficam só informativos (sem clique).
export const cardapio = [
  {
    categoria: "Entradas",
    clicavel: true,
    itens: [
      { nome: "Salada Wirá-mirí", descricao: "Cubiu, Palmito e camarão seco. Uma salada saborosa para saborear" },
      { nome: "Carpaccio de Cubiu", descricao: "Cubiu, limão pimenta, ervas frescas e queijo de coalho. Uma combinação contemporânea feita pelo chef" },
      { nome: "Queijo Coalho com aioli de umarí", descricao: "Delicioso Queijo de coalho grelhado acompanhado com um molho especial de umarí" },
      { nome: "Vatapá de palmito e castanha", descricao: "Vatapá de dar água na boca, feito especialmente com iguarias regionais" },
    ],
  },
  {
    categoria: "Pratos Principais",
    clicavel: true,
    itens: [
      { nome: "Pexe com Banana e Maracujá", descricao: "Peixe grelhado com molho e queijo, levado ao forno para gratinar. O mais pedido da casa" },
      { nome: "Peixe Grelhado", descricao: "Pexe, molho de limão, batata e ervas." },
      { nome: "Moqueca Kabary", descricao: "Peixe, banana, cará, araçá e ervas." },
      { nome: "Peixe com jambu e tapioca", descricao: "Peixe, Arroz com jambu e tucupi amarelo" },
      { nome: "Ralo Baniwa", descricao: "Peixe purê de banana, tucupi preto e formiga saúva" },
      { nome: "Bubury", descricao: "Peixe, tártara de macaxeira e creme de tucumã" },
      { nome: "Medalhão com redução em açaí", descricao: "Alcatra grelhada, risoto de palmito e ervas" },
      { nome: "Medalhão com purê de tucumã", descricao: "Alcatra grelhada, molho veloutê com cogumelos" },
      { nome: "Medalhão com purê de macaxeira", descricao: "Alcatra grelhada, molho de beterraba e vinho tinto acompanhado de uma farofa de alho" },
    ],
  },
  {
    categoria: "Sobremesas",
    clicavel: true,
    itens: [
      { nome: "Banana Caramelizada", descricao: "Sorvete e calda cítrica" },
      { nome: "Sorvete com geleia de cubiu", descricao: "Crispes de tapioca e puxurí" },
    ],
  },
  {
    categoria: "Drinks",
    clicavel: false,
    itens: [
      { nome: "Manhã", descricao: "Manga, limão, xarope cítrico e água com gás", semAlcool: true },
      { nome: "Margarida", descricao: "Limão, licor de laranja e cachaça" },
      { nome: "Remanso", descricao: "Whisky, Campari, Limão groselha e água com gás" },
      { nome: "Por do Sol", descricao: "Gim, Martini Rosso, limão e tônica" },
      { nome: "Canoa", descricao: "Whisky 12 anos (Tenesse), mel e laranja" },
      { nome: "Gim-Tônica", descricao: "Gim, limão e tônica" },
    ],
  },
  {
    categoria: "Variedades",
    clicavel: false,
    itens: [
      { nome: "Caripirinha", descricao: "" },
      { nome: "Caipiroska", descricao: "" },
      { nome: "Corona", descricao: "" },
      { nome: "Heineken", descricao: "" },
      { nome: "Tônica", descricao: "" },
      { nome: "Água", descricao: "Com e sem gás" },
      { nome: "Refrigerantes", descricao: "" },
      { nome: "Suco de frutas regionais", descricao: "Consultar o garçom" },
      { nome: "Vinhos", descricao: "Solicite ao garçom a carta de vinhos da casa" }
    ],
  },
];

export function renderizarCardapio() {
  const container = document.getElementById("cardapio-container");
  if (!container) return;

  container.innerHTML = "";

  cardapio.forEach((grupo) => {
    const titulo = document.createElement("h2");
    titulo.className = "categoria-titulo";
    titulo.textContent = grupo.categoria;
    container.appendChild(titulo);

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    grupo.itens.forEach((item) => {
      const card = grupo.clicavel
        ? criarCardClicavel(item)
        : criarCardInformativo(item);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });
}

/* Card que vai pra comanda: <button> com "+" sempre visível e flutuando */
function criarCardClicavel(item) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "prato-card prato-card-clicavel";
  card.setAttribute("aria-label", `Adicionar ${item.nome} à comanda`);

  const preco = precoDoPrato(item.nome);
  const precoTexto = preco > 0 ? formatarPreco(preco) : "";

  card.innerHTML = `
    <span class="prato-add" aria-hidden="true">+</span>
    <h3>${item.nome}${item.semAlcool ? " <i>- sem álcool</i>" : ""}</h3>
    <p class="color-default">${item.descricao}</p>
    
  `;

  /*
   * TODO (futuro): Exibir preços ao lado dos pratos no cardápio público.
   * Hoje os valores só aparecem na comanda (js/comanda.js).
   *
   * Para ativar:
   *   1. Preencha os valores reais em js/precos.js (hoje todos estão em 0).
   *   2. Substitua a linha:
   *        ${precoTexto ? `<span class="prato-preco">${precoTexto}</span>` : ""}
   *      por:
   *        <span class="prato-preco">${precoTexto}</span>
   *   3. O estilo .prato-preco já existe no css/style.css.
   */

  card.addEventListener("click", () => adicionarItem(item.nome));
  return card;
}

/* Card apenas informativo (drinks e variedades): <div> sem clique */
function criarCardInformativo(item) {
  const card = document.createElement("div");
  card.className = "prato-card prato-card-informativo";

  card.innerHTML = `
    <h3>${item.nome}${item.semAlcool ? " <i>- sem álcool</i>" : ""}</h3>
    <p class="color-default">${item.descricao}</p>
  `;

  return card;
}