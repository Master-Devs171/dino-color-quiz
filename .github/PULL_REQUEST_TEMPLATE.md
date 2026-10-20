## Identificação

- Nome do jogo:
- ID e versão:
- Jogo novo ou atualização:
- Faixa etária:
- Autor e licença:

## Conteúdo e recursos

- Objetivo e controlos:
- Origem dos gráficos, áudio e fontes:
- Ficheiros de terceiros e respetivas licenças:
- Funciona totalmente offline depois de instalado? Sim/Não
- Usa armazenamento? O que guarda?
- Usa multiplayer? Se sim, explique o protocolo solicitado à plataforma:

## Verificações obrigatórias

- [ ] Li integralmente `CONTRIBUTING.md` e as regras em `docs/`.
- [ ] Alterei apenas `games/community/<id>/**`, a minha entrada em `games/catalog.json` e testes `scripts/test-<id>*`.
- [ ] Não alterei `platform.js`, `app.js`, `sw.js`, `index.html`, SDK, controlo parental, atualização ou versões da app.
- [ ] O `manifest.json` e a entrada no catálogo são equivalentes e cumprem o esquema.
- [ ] Todos os caminhos e recursos são locais, declarados e licenciados.
- [ ] Mantive a política CSP do modelo e executei `node scripts/scan-community-security.mjs`.
- [ ] Não existem anúncios, compras, links externos, telemetria, chat, contas próprias ou recolha de dados.
- [ ] Uso `runtime: "sandbox"`, `DinoPlay.storage` e `DinoPlay.close()`.
- [ ] Testei instalação, modo avião, toque, ecrã pequeno, suspensão/regresso e preservação do progresso.
- [ ] Aumentei a versão do jogo se esta for uma atualização.
- [ ] Compreendo que testes verdes não significam aprovação; apenas o merge na `main` publica o jogo.

## Evidência de teste

Descreva os dispositivos/navegadores testados e anexe imagens ou vídeo sem dados pessoais.
