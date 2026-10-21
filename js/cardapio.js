export const cardapio = [
  {
    categoria: "Entradas",
    itens: [
      { nome: "Salada Wirá-mirí", descricao: "Cubiu, Palmito e camarão seco. Uma salada saborosa para saborear" },
      { nome: "Carpaccio de Cubiu", descricao: "Cubiu, limão pimenta, ervas frescas e queijo de coalho. Uma combinação contemporânea feita pelo chef" },
      { nome: "Queijo Coalho com aioli de umarí", descricao: "Delicioso Queijo de coalho grelhado acompanhado com um molho especial de umarí" },
      { nome: "Vatapá de palmito e castanha", descricao: "Vatapá de dar água na boca, feito especialmente com iguarias regionais" },
    ],
  },
  {
    categoria: "Pratos Principais",
    itens: [
      { nome: "Pexe com Banana e Maracujá", descricao: "Peixe grelhado com molho e queijo, levado ao forno para gratinar. O mais pedido da casa" },
      { nome: "Peixe Grelhado", descricao: "Peixe, molho de limão, batata e ervas." },
      { nome: "Moqueca Kabary", descricao: "Peixe, banana, cará, araçá e ervas." },
      { nome: "Peixe com jambu e tapioca", descricao: "Peixe, Arroz com jambu e tucupi amarelo" },
      { nome: "Ralo Baniwa", descricao: "Peixe, purê de banana, tucupi preto e formiga saúva" },
      { nome: "Bubury", descricao: "Peixe, tártara de macaxeira e creme de tucumã" },
      { nome: "Medalhão com redução em açaí", descricao: "Alcatra grelhada, risoto de palmito e ervas" },
      { nome: "Medalhão com purê de tucumã", descricao: "Alcatra grelhada, molho veloutê com cogumelos" },
      { nome: "Medalhão com purê de macaxeira", descricao: "Alcatra grelhada, molho de beterraba e vinho tinto acompanhado de uma farofa de alho" },
    ],
  },
  {
    categoria: "Sobremesas",
    itens: [
      { nome: "Banana Caramelizada", descricao: "Sorvete e calda cítrica" },
      { nome: "Sorvete com geleia de cubiu", descricao: "Crispes de tapioca e puxurí" },
    ],
  },
  {
    categoria: "Drinks",
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
    itens: [
      { nome: "Caripirinha", descricao: "" },
      { nome: "Caipiroska", descricao: "" },
      { nome: "Corona", descricao: "" },
      { nome: "Heineken", descricao: "" },
      { nome: "Tônica", descricao: "" },
      { nome: "Água", descricao: "Com e sem gás" },
      { nome: "Refrigerantes", descricao: "" },
      { nome: "Suco de frutas regionais", descricao: "" },
      { nome: "Vinhos", descricao: "Solicite a carta de vinhos" }
    ],
  },
];

export function renderizarCardapio() {
  const container = document.getElementById("cardapio-container");
  if (!container) return;

  container.innerHTML = "";

  cardapio.forEach((grupo, index) => {
    // Cria a estrutura do acordeão para cada categoria
    const section = document.createElement("div");
    section.className = "acordeao-item";

    // O botão que abre/fecha
    const botao = document.createElement("button");
    botao.className = "acordeao-header";
    botao.setAttribute("aria-expanded", "false");
    botao.innerHTML = `
      <h2 class="categoria-titulo">${grupo.categoria}</h2>
      <span class="icone-seta">↓</span>
    `;

    // O conteúdo (lista de pratos)
    const conteudo = document.createElement("div");
    conteudo.className = "acordeao-conteudo";
    
    const grid = document.createElement("div");
    grid.className = "menu-grid";

    grupo.itens.forEach((item) => {
      const card = document.createElement("div");
      card.className = "prato-card";
      card.innerHTML = `
        <h3>${item.nome}${item.semAlcool ? " <i>- sem álcool</i>" : ""}</h3>
        <p class="color-default">${item.descricao}</p>
      `;
      grid.appendChild(card);
    });

    conteudo.appendChild(grid);

    // Lógica de clique para abrir/fechar
    botao.addEventListener("click", () => {
      const isExpanded = botao.getAttribute("aria-expanded") === "true";
      
      // Fecha todos os outros (opcional, para ficar mais limpo)
      document.querySelectorAll('.acordeao-header').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.nextElementSibling.style.maxHeight = null;
      });

      // Abre o atual se não estava aberto
      if (!isExpanded) {
        botao.setAttribute("aria-expanded", "true");
        conteudo.style.maxHeight = conteudo.scrollHeight + "px";
      }
    });

    section.appendChild(botao);
    section.appendChild(conteudo);
    container.appendChild(section);
  });
}