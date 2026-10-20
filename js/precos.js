// Tabela central de preços. Edite aqui quando tiver os valores reais.
// Chave = nome exato do prato como aparece no cardápio.
export const precos = {
  // Entradas
  "Salada Wirá-mirí": 45,
  "Carpaccio de Cubiu": 38,
  "Queijo Coalho com aioli de umarí": 40,
  "Vatapá de palmito e castanha": 42,

  // Pratos Principais
  "Pexe com Banana e Maracujá": 147,
  "Peixe Grelhado": 145,
  "Moqueca Kabary": 146,
  "Peixe com jambu e tapioca": 70,
  "Ralo Baniwa": 70,
  "Bubury": 70,
  "Medalhão com redução em açaí": 75,
  "Medalhão com purê de tucumã": 72,
  "Medalhão com purê de macaxeira": 75,

  // Sobremesas
  "Banana Caramelizada": 28,
  "Sorvete com geleia de cubiu": 28,

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