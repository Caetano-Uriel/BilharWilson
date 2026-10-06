# Wilson Sinucas

Site estático em português com catálogo de mesas e contato pelo WhatsApp. Atendimento em Almenara e região.

## Arquivos

- `dist/index.html`: conteúdo e estrutura.
- `dist/data.js`: catálogo, fotos, fontes das referências e contato.
- `dist/app.js`: galerias e links de WhatsApp.
- `dist/style.css`, `dist/hero.css` e `dist/polish.css`: visual responsivo e animações.
- `dist/assets/`: imagens e fontes locais.

## Prévia local

Com Python instalado, execute na pasta do projeto:

```sh
python -m http.server 4173 --directory dist
```

Abra http://localhost:4173.

## Publicação na Vercel

Importe este repositório, selecione o preset Other e mantenha a raiz do projeto. O arquivo `vercel.json` define `dist` como pasta publicada. Não há dependências nem etapa de compilação.

## Atualizações

Edite os produtos e o número em `dist/data.js`. Ao alterar o contato, atualize também os links de fallback e telefone em `dist/index.html`. Os valores de catálogo são descritivos e os preços são sob consulta.

A imagem da abertura é uma ilustração gerada por IA para o protótipo e está identificada na página. As imagens dos produtos vieram das publicações do fabricante, referenciadas em `dist/data.js`.

O site respeita a preferência por movimento reduzido. Os botões preparam uma mensagem no WhatsApp; o visitante decide enviá-la.

As galerias aceitam botões, setas do teclado e gestos horizontais no celular. A foto atual permanece visível durante o carregamento da próxima. O catálogo usa uma coluna no celular, duas nas telas intermediárias e três no computador.
