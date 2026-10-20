import { precoDoPrato, formatarPreco } from "./precos.js";

const WHATSAPP_NUMERO = "5597984592502";

// Estado da comanda: Map<nome, {nome, quantidade, preco}>
const itens = new Map();

// ---------- Toast ----------
let toastTimer = null;

function mostrarToast(mensagem, onDesfazer) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span>${mensagem}</span>
    ${onDesfazer ? '<button type="button" class="toast-desfazer">Desfazer</button>' : ""}
  `;
  toast.classList.add("toast-visivel");

  const btn = toast.querySelector(".toast-desfazer");
  if (btn && onDesfazer) {
    btn.addEventListener("click", () => {
      onDesfazer();
      esconderToast();
    });
  }

  clearTimeout(toastTimer);
  toastTimer = setTimeout(esconderToast, 3500);
}

function esconderToast() {
  const toast = document.getElementById("toast");
  if (toast) toast.classList.remove("toast-visivel");
}

// ---------- Ações ----------
export function adicionarItem(nome) {
  const existente = itens.get(nome);
  if (existente) {
    existente.quantidade += 1;
  } else {
    itens.set(nome, { nome, quantidade: 1, preco: precoDoPrato(nome) });
  }
  atualizarComanda();

  mostrarToast(`"${nome}" adicionado à comanda ✓`, () => {
    removerUm(nome);
  });
}

function removerUm(nome) {
  const item = itens.get(nome);
  if (!item) return;
  item.quantidade -= 1;
  if (item.quantidade <= 0) itens.delete(nome);
  atualizarComanda();
}

function removerTudo(nome) {
  itens.delete(nome);
  atualizarComanda();
}

function limparComanda() {
  itens.clear();
  atualizarComanda();
}

// ---------- Render ----------
function totalComanda() {
  let total = 0;
  let quantidade = 0;
  itens.forEach((item) => {
    total += item.preco * item.quantidade;
    quantidade += item.quantidade;
  });
  return { total, quantidade };
}

function atualizarComanda() {
  const { total, quantidade } = totalComanda();

  // Botão flutuante
  const btn = document.getElementById("comanda-btn");
  if (btn) {
    btn.textContent = quantidade > 0 ? `🛒 Comanda (${quantidade})` : "🛒 Comanda";
    btn.classList.toggle("comanda-btn-ativa", quantidade > 0);
  }

  // Lista dentro do modal
  const lista = document.getElementById("comanda-lista");
  const totalEl = document.getElementById("comanda-total");
  const vazio = document.getElementById("comanda-vazio");
  const enviarBtn = document.getElementById("comanda-enviar");

  if (!lista) return;

  lista.innerHTML = "";

  if (itens.size === 0) {
    vazio.style.display = "block";
    if (enviarBtn) enviarBtn.disabled = true;
    if (totalEl) totalEl.textContent = formatarPreco(0);
    return;
  }

  vazio.style.display = "none";
  if (enviarBtn) enviarBtn.disabled = false;

  itens.forEach((item) => {
    const li = document.createElement("li");
    li.className = "comanda-item";
    li.innerHTML = `
      <div class="comanda-item-info">
        <strong>${item.nome}</strong>
        <span>${item.quantidade} × ${formatarPreco(item.preco)}</span>
      </div>
      <div class="comanda-item-acoes">
        <button type="button" data-acao="menos" aria-label="Remover um">−</button>
        <span class="comanda-qtd">${item.quantidade}</span>
        <button type="button" data-acao="mais" aria-label="Adicionar um">+</button>
        <button type="button" data-acao="remover" aria-label="Remover tudo">🗑</button>
      </div>
    `;

    li.querySelector('[data-acao="mais"]').addEventListener("click", () => {
      adicionarItem(item.nome);
    });
    li.querySelector('[data-acao="menos"]').addEventListener("click", () => {
      removerUm(item.nome);
    });
    li.querySelector('[data-acao="remover"]').addEventListener("click", () => {
      removerTudo(item.nome);
    });

    lista.appendChild(li);
  });

  if (totalEl) totalEl.textContent = formatarPreco(total);
}

// ---------- Modal ----------
function abrirModal() {
  const modal = document.getElementById("comanda-modal");
  if (modal) {
    modal.classList.add("comanda-modal-aberto");
    modal.setAttribute("aria-hidden", "false");
  }
}

function fecharModal() {
  const modal = document.getElementById("comanda-modal");
  if (modal) {
    modal.classList.remove("comanda-modal-aberto");
    modal.setAttribute("aria-hidden", "true");
  }
}

// ---------- Enviar WhatsApp ----------
function enviarPedido() {
  if (itens.size === 0) return;

  const nome = document.getElementById("cliente-nome")?.value.trim() || "";
  const pessoas = document.getElementById("cliente-pessoas")?.value || "";
  const data = document.getElementById("cliente-data")?.value || "";
  const hora = document.getElementById("cliente-hora")?.value || "";

  if (!nome || !pessoas || !data || !hora) {
    mostrarToast("Preencha nome, pessoas, data e horário antes de enviar.");
    return;
  }

  const linhas = [];
  linhas.push("*Pedido — La Cave du Conde*");
  linhas.push("");
  linhas.push(`*Nome:* ${nome}`);
  linhas.push(`*Pessoas:* ${pessoas}`);
  linhas.push(`*Data:* ${formatarDataBR(data)}`);
  linhas.push(`*Horário:* ${hora}`);
  linhas.push("");
  linhas.push("*Itens:*");

  let total = 0;
  itens.forEach((item) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    linhas.push(`• ${item.quantidade}× ${item.nome} — ${formatarPreco(subtotal)}`);
  });

  linhas.push("");
  linhas.push(`*Total:* ${formatarPreco(total)}`);

  const texto = encodeURIComponent(linhas.join("\n"));
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function formatarDataBR(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ---------- Inicialização ----------
export function inicializarComanda() {
  const btn = document.getElementById("comanda-btn");
  const fechar = document.getElementById("comanda-fechar");
  const overlay = document.getElementById("comanda-modal");
  const limpar = document.getElementById("comanda-limpar");
  const enviar = document.getElementById("comanda-enviar");

  btn?.addEventListener("click", abrirModal);
  fechar?.addEventListener("click", fecharModal);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) fecharModal();
  });
  limpar?.addEventListener("click", limparComanda);
  enviar?.addEventListener("click", enviarPedido);

  // Data mínima = hoje
  const dataInput = document.getElementById("cliente-data");
  if (dataInput) {
    const hoje = new Date().toISOString().split("T")[0];
    dataInput.min = hoje;
    dataInput.value = hoje;
  }

  atualizarComanda();
}