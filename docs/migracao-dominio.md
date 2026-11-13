# Migração de domínio — La Cave du Conde

## Auditoria e escopo

Auditoria em 13/11/2026. Projeto estático sem configuração de build no repositório: `index.html`, CSS em `css/`, JavaScript em `js/`, imagens em `images/`, favicon e documentos em `docs/`. O script `scripts/gerar-cardapio.mjs` atualiza o cardápio dentro de `index.html`; não é necessário executá-lo nesta migração.

`index.html` é a única página com conteúdo. `cardapio.html` tinha zero bytes e não recebia links internos; foi removido na limpeza autorizada. Verifique no Search Console se essa URL possui histórico antes da publicação: não foi criado redirecionamento arbitrário nem conteúdo novo. O cardápio atual está em `/#menu`.

Na limpeza autorizada também foram removidas dez imagens sem referências no HTML, CSS, JavaScript ou gerador: roupa_lacave.jpg, paisagem.jpg, grelhado.jpg, cuia2.png, cuia.png, chef_aquino2.jpg, chef_aquino.jpg, brasão.png, brasao_novo.png e brasao_lacave.jpg. Os WebP usados, a imagem Open Graph e os favicons permanecem. Os documentos originais e os dados/gerador do cardápio foram preservados como fontes de manutenção. Ausência de referências internas não prova ausência de links externos: antes de publicar, verificar histórico das URLs removidas no Search Console e restaurar do Git qualquer imagem com tráfego relevante, ou definir um 301 apenas quando houver substituto equivalente.

Não havia canonical, og:url, meta robots explícito, robots.txt, sitemap.xml, _redirects ou netlify.toml. A ausência de meta robots não bloqueava indexação. og:image era relativo; o JSON-LD Restaurant não tinha url. Não existem Twitter Cards. Nenhuma URL antiga foi encontrada no HTML/CSS/JS; a referência estava no README. Títulos, descrições, informações comerciais, JSON-LD existente e corpo da página foram preservados. Recursos relativos continuam válidos no domínio novo. Google Fonts, Google Maps, WhatsApp, telefone, schema.org e Instagram do desenvolvedor são referências externas e foram preservados.

## Evidência pública antes das alterações

- DNS Google (8.8.8.8): NS dns1.p01.nsone.net até dns4.p01.nsone.net; apex e www resolviam para 54.232.119.62.
- DNS padrão local: falha de resolução; curl normal retornava erro 6 para os domínios novos.
- Com `--resolve`, sem desativar validação TLS: domínio principal HTTPS 200; HTTP e HTTPS www retornaram 301 para o domínio principal, preservando `/css/style.css?migration=1`.
- HTTPS netlify.app retornou 200 tanto para a raiz quanto para o CSS. A raiz tinha cabeçalho HTTP Link canonical para o domínio novo; esse cabeçalho não substitui o 301 de migração.
- Estes testes públicos não dão acesso às configurações privadas da conta Netlify ou do Search Console. O conteúdo publicado pode divergir do checkout local.

## Alterações preparadas

Canonical, meta robots index/follow, og:url, og:image absoluto e url no JSON-LD da página inicial. Sitemap contém somente a URL canônica inicial, sem datas artificiais. Robots permite rastreamento e informa o sitemap. `_redirects` contém apenas regras de origem absoluta para HTTP/HTTPS do hostname antigo, com 301!, preservando o caminho com :splat e os parâmetros pelo comportamento padrão da Netlify. O ! impede que arquivos existentes sejam servidos em vez de redirecionados. Nenhuma regra tem o domínio novo como origem: não há ciclo entre as regras adicionadas.

## Conferências manuais na Netlify

1. Confirmar em Domain management / Production domains que lacaveduconde.com.br permanece Primary Domain e www está associado ao mesmo projeto. Não duplicar os redirecionamentos automáticos já observados.
2. Confirmar certificado HTTPS válido para apex e www e redirecionamento HTTP ativo. Não trocar NS, registros DNS ou configurações do Windows por causa de uma falha isolada de resolvedor.
3. Confirmar que lacaveduconde.netlify.app é o endereço de produção deste mesmo projeto. As regras funcionam no repositório; não exigem um serviço externo de encaminhamento. Se esse hostname pertencer a outro projeto, as regras precisam ser publicadas no projeto que atende o hostname antigo.
4. Conferir o diretório de publicação configurado na conta. Ele deve conter index.html, css/, js/, images/, favicon.ico, _redirects, robots.txt e sitemap.xml. Neste checkout esses arquivos estão na raiz. Não foi criado netlify.toml para sobrescrever uma configuração de build desconhecida.
5. Somente após autorização, publicar e conferir o resumo de processamento de redirects do deploy. Validar todas as URLs abaixo; se houver regras externas adicionais, revisá-las caso surjam cadeias ou conflitos.

## Diagnóstico PowerShell

```powershell
nslookup -type=NS lacaveduconde.com.br 8.8.8.8
nslookup lacaveduconde.com.br 8.8.8.8
nslookup www.lacaveduconde.com.br 8.8.8.8
nslookup lacaveduconde.com.br
curl.exe -I https://lacaveduconde.com.br
curl.exe -I https://www.lacaveduconde.com.br
curl.exe -I https://lacaveduconde.netlify.app
curl.exe -I http://lacaveduconde.com.br
curl.exe -I http://lacaveduconde.netlify.app
```

O primeiro comando deve listar os quatro NS informados. Os próximos dois devem devolver registros válidos (IPs podem mudar; não fixe o IP desta auditoria). “Resposta não autoritativa” é normal para um resolvedor recursivo. O quarto usa o DNS padrão: se somente ele falhar, existe divergência no caminho de resolução local/provedor ou cache; isso não demonstra falha da hospedagem. Não houve alteração de DNS local.

No curl, o domínio principal deve responder 200. Os demais devem responder 301 com Location no domínio principal HTTPS. Server: Netlify confirma o servidor, não a correção do redirect. Erro 6 significa falha DNS; erros de certificado devem ser investigados sem usar -k. Para separar DNS de hospedagem, substitua o IP abaixo pelo resultado público atual; --resolve mantém hostname, SNI e validação do certificado:

```powershell
$migrationIp = '54.232.119.62' # Exemplo observado; consultar novamente antes de usar.
curl.exe -I --resolve "lacaveduconde.com.br:443:${migrationIp}" https://lacaveduconde.com.br/
curl.exe -I --resolve "www.lacaveduconde.com.br:443:${migrationIp}" https://www.lacaveduconde.com.br/
curl.exe -I --resolve "lacaveduconde.com.br:80:${migrationIp}" http://lacaveduconde.com.br/
```

Após publicação autorizada, testar caminho e query, cadeia completa, conteúdo SEO e 404 real:

```powershell
curl.exe -I 'https://lacaveduconde.netlify.app/css/style.css?migration=1&utm_source=teste'
curl.exe -I 'https://www.lacaveduconde.com.br/css/style.css?migration=1&utm_source=teste'
curl.exe -I -L --max-redirs 5 'https://lacaveduconde.netlify.app/css/style.css?migration=1&utm_source=teste'
curl.exe -sS https://lacaveduconde.com.br/ | Select-String 'canonical|og:url|og:image|robots'
curl.exe -i https://lacaveduconde.com.br/robots.txt
curl.exe -i https://lacaveduconde.com.br/sitemap.xml
curl.exe -I https://lacaveduconde.com.br/js/acordeao.js
curl.exe -I https://lacaveduconde.com.br/images/brasao_invi.png
curl.exe -I https://lacaveduconde.com.br/arquivo-inexistente-migracao-404
```

Location deve manter `/css/style.css` e ambos os parâmetros. A cadeia deve terminar em 200 no novo hostname, sem retorno ao antigo nem erro de excesso de redirects. A URL inexistente deve terminar em 404, sem rewrite genérico para a página inicial. Robots e sitemap devem responder 200 com texto/XML corretos, sem X-Robots-Tag: noindex. Abrir também o site no navegador e verificar menu, âncoras, imagens, mapa, reservas e console/rede. curl não executa JavaScript.

## Google Search Console

- [ ] Criar/verificar propriedade de domínio lacaveduconde.com.br com o TXT fornecido pelo Google na zona DNS da Netlify, que é a autoridade DNS atual. O Registro.br mantém a delegação NS. Não inventar o valor do TXT.
- [ ] Confirmar propriedade e acesso como proprietário ao prefixo https://lacaveduconde.netlify.app/ na mesma conta Google. Preservar tokens existentes; se houver verificação por arquivo HTML, avaliar antes do deploy, pois o redirect amplo também alcança esse arquivo. Se necessário, usar verificação por meta tag fornecida pelo Google, sem criar tokens fictícios.
- [ ] Registrar dados de desempenho e páginas indexadas da propriedade antiga antes da migração; conferir se há URLs relevantes além da raiz, inclusive cardapio.html e /index.html.
- [ ] Após publicar e validar 301/HTTPS, enviar https://lacaveduconde.com.br/sitemap.xml na propriedade nova.
- [ ] Inspecionar a raiz nova e as páginas importantes identificadas no relatório antigo. Conferir teste ao vivo, permissão de indexação, canonical declarado e posteriormente canonical escolhido pelo Google; solicitar indexação das URLs prioritárias.
- [ ] Inspecionar também URLs antigas para confirmar redirecionamento permanente para suas equivalentes, sem caminhos perdidos.
- [ ] A mudança de subdomínio netlify.app para domínio próprio é candidata à ferramenta Mudança de endereço. Na propriedade antiga sem segmento de caminho, abrir Configurações > Mudança de endereço, selecionar a propriedade nova e executar as verificações. Exige propriedade dos dois endereços e redirects funcionando. A ferramenta não é necessária só para HTTP→HTTPS ou www→apex. Se não estiver disponível ou a validação falhar, corrigir o requisito indicado; manter 301, canonical e sitemap independentemente disso.
- [ ] Monitorar diariamente no início e semanalmente depois: indexação, sitemap, páginas com redirecionamento, 404, soft 404, erros de servidor, canonical divergente e desempenho dos dois endereços. Separar queda no antigo do total combinado; manter registros da data de publicação.
- [ ] Manter o hostname antigo e os redirects por pelo menos um ano, preferencialmente permanentemente. Atualizar perfis e links externos sob seu controle quando possível. Podem ocorrer oscilações temporárias; não há garantia de manutenção integral das posições.

## Referências oficiais

- [Netlify: redirecionamentos por domínio, force e query strings](https://docs.netlify.com/manage/routing/redirects/redirect-options/)
- [Google: migração com mudança de URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google: ferramenta Mudança de endereço e requisitos](https://support.google.com/webmasters/answer/9370220)

Nenhum deploy ou alteração de DNS/conta foi realizado nesta tarefa. O comportamento das novas regras na CDN precisa ser confirmado depois da publicação autorizada.
