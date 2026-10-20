// Tabela central de preços. Edite aqui quando tiver os valores reais.
// Chave = nome exato do prato como aparece no cardápio.
export const precos = {
  // Entradas
  "Salada Wirá-mirí": 0,
  "Carpaccio de Cubiu": 0,
  "Queijo Coalho com aioli de umarí": 0,
  "Vatapá de palmito e castanha": 0,

  // Pratos Principais
  "Pexe com Banana e Maracujá": 0,
  "Peixe Grelhado": 0,
  "Moqueca Kabary": 0,
  "Peixe com jambu e tapioca": 0,
  "Ralo Baniwa": 0,
  "Bubury": 0,
  "Medalhão com redução em açaí": 0,
  "Medalhão com purê de tucumã": 0,
  "Medalhão com purê de macaxeira": 0,

  // Sobremesas
  "Banana Caramelizada": 0,
  "Sorvete com geleia de cubiu": 0,

  // Drinks
  "Manhã": 0,
  "Margarida": 0,
  "Remanso": 0,
  "Por do Sol": 0,
  "Canoa": 0,
  "Gim-Tônica": 0,

  // Variedades (sem preço fixo — ficam como "sob consulta" na comanda)
  "Caripirinha": 0,
  "Caipiroska": 0,
  "Corona": 0,
  "Heineken": 0,
  "Tônica": 0,
  "Água": 0,
  "Refrigerantes": 0,
  "Suco de frutas regionais": 0,
};

export function precoDoPrato(nome) {
  return precos[nome] ?? 0;
}

export function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}