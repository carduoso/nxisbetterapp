# Nexxa: landing page
Site estático (HTML, CSS e JS puros). Não precisa instalar nada.

## Estrutura
- `index.html`: conteúdo e estrutura (a logo e os ícones estão dentro do HTML)
- `css/style.css`: visual
- `js/config.js`: **contatos (edite aqui)**
- `js/main.js`: interações (demonstração, menu, formulário)

## Rodar
Abra `index.html` no navegador, ou no VS Code use a extensão Live Server.

## Conectar o formulário (obrigatório antes de publicar)
Edite `js/config.js`:
- `formEndpoint`: URL de um serviço de formulários (ex.: Formspree), ou
- `whatsappNumber`: número do WhatsApp comercial (DDI + DDD + número, só dígitos).
Sem nenhum dos dois, o formulário avisa que não está conectado e não finge enviar.

## Publicar na Vercel
1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: Add New > Project > importe o repositório. Framework: Other. Sem comando de build.
3. Deploy. Depois, aponte o domínio em Settings > Domains.
