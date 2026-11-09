import { readFile, writeFile } from 'node:fs/promises';
import { cardapio } from '../js/cardapio.js';

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const categorias = cardapio.map((grupo) => `
          <details class="acordeao-item">
            <summary class="acordeao-header">
              <h3 class="categoria-titulo">${escapeHtml(grupo.categoria)}</h3>
              <span class="icone-seta" aria-hidden="true">↓</span>
            </summary>
            <div class="acordeao-conteudo">
              <ul class="menu-grid" aria-label="${escapeHtml(grupo.categoria)}">
${grupo.itens.map((item) => `                <li class="prato-card">
                  <h4>${escapeHtml(item.nome)}${item.semAlcool ? ' <em>— sem álcool</em>' : ''}</h4>${item.descricao ? `
                  <p class="color-default">${escapeHtml(item.descricao)}</p>` : ''}
                </li>`).join('\n')}
              </ul>
            </div>
          </details>`).join('\n');

const path = new URL('../index.html', import.meta.url);
const html = await readFile(path, 'utf8');
const start = '<!-- CARDAPIO:INICIO -->';
const end = '<!-- CARDAPIO:FIM -->';
if (!html.includes(start) || !html.includes(end)) throw new Error('Marcadores do cardápio não encontrados.');
await writeFile(path, html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}${categorias}\n          ${end}`));
console.log(`${cardapio.length} categorias e ${cardapio.reduce((total, grupo) => total + grupo.itens.length, 0)} itens gerados.`);
