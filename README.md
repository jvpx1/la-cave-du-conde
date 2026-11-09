Site do restaurante La Cave du Conde, desenvolvido com HTML e CSS.

Para visualizar, abra `index.html` no navegador ou use um servidor estático.

O cardápio usa `details` e `summary` nativos. O arquivo `js/acordeao.js` mantém
uma categoria aberta por vez, anima a troca e acompanha a posição do título
selecionado para evitar o salto para o rodapé ao fechar uma lista acima.
Respeita a preferência por menos movimento. Sem JavaScript, as categorias
continuam funcionando de forma independente com o comportamento nativo.

Para editar os pratos, altere `js/cardapio.js` e execute com Node.js:

```sh
node scripts/gerar-cardapio.mjs
```

O comando atualiza apenas o trecho do cardápio em `index.html`. Publique o HTML
atualizado junto dos arquivos CSS e das imagens; o servidor não precisa de Node.js.

Os dados estruturados em `index.html` refletem o endereço, telefone e horários
exibidos na página. Mantenha ambos atualizados quando essas informações mudarem.
Após definir o domínio público, configure a URL canônica, `og:url`, uma URL absoluta
para `og:image` e um sitemap com o endereço real do site.
