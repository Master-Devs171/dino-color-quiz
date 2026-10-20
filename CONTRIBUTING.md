# Contribuir com jogos para DinoPlay

Este guia descreve o processo completo. Um visto verde do GitHub significa apenas que os testes automáticos passaram; o jogo só fica disponível depois de revisão humana, merge na `main` e publicação do GitHub Pages.

## 1. Ficheiros permitidos

Uma contribuição de jogo novo pode alterar exclusivamente:

- `games/community/<id>/**` — todos os ficheiros do jogo;
- `games/catalog.json` — uma única entrada para o jogo;
- `scripts/test-<id>*.cjs` — testes opcionais do próprio jogo.

Não altere `platform.js`, `app.js`, `sw.js`, `index.html`, o SDK, o controlo parental, o sistema de atualizações, o multiplayer, jogos oficiais ou as versões do DinoPlay. Se o jogo precisar de uma nova capacidade da plataforma, descreva-a no pull request; o mantenedor implementa-a separadamente.

Uma atualização de jogo existente segue a mesma regra e só pode alterar a pasta, a entrada de catálogo e os testes desse jogo.

## 2. Estrutura obrigatória

Crie `games/community/<id>/`, usando um identificador em minúsculas, sem espaços, por exemplo `cobrinhas-do-jardim`. A pasta deve conter:

- `index.html` como entrada;
- `manifest.json` compatível com `games/game.schema.json`;
- código e recursos locais;
- `LICENSE` com a licença do código e dos recursos;
- `README.md` com controlos, objetivo, autoria e origem dos recursos;
- uma capa horizontal legível na biblioteca.

Use apenas HTML, CSS, JavaScript e recursos auditáveis. Binários executáveis, código ofuscado, dependências remotas e ficheiros sem licença são recusados.

## 3. Manifesto e catálogo

- Use sempre `runtime: "sandbox"` e `offline: true`.
- `entry`, `cover` e cada item de `assets` devem estar dentro de `games/community/<id>/`, exceto o SDK oficial.
- Inclua todos os ficheiros necessários em `assets`.
- Declare apenas `storage` e, quando aprovado, `multiplayer` em `permissions`.
- Copie para `games/catalog.json` exatamente os mesmos dados públicos do `manifest.json`.
- Num jogo novo, comece em `1.0.0`. Numa atualização, aumente `MAJOR.MINOR.PATCH`.

Nunca aumente a versão da app nem altere parâmetros de cache. A plataforma deteta o catálogo automaticamente.

## 4. Integração com DinoPlay

Inclua `/sdk/dinoplay-game-sdk.js` no HTML e execute `await DinoPlay.ready()` antes de usar capacidades da plataforma. Use `DinoPlay.storage` para progresso e `DinoPlay.close()` para regressar à biblioteca. Não use `localStorage`, contas próprias ou acesso direto a dados do dispositivo.

Multiplayer só pode usar `DinoPlay.multiplayer`; servidores, códigos, salas, chat ou listas de jogadores próprios são proibidos. Uma contribuição multiplayer exige revisão adicional do protocolo.

## 5. Testes antes do envio

Execute:

```text
node scripts/validate-catalog.mjs
```

Teste também instalação, modo avião depois de instalado, toque, ecrã pequeno, rotação, suspensão/regresso, botão de fechar, áudio e preservação do progresso. O jogo não pode continuar a gastar CPU ou reproduzir áudio quando estiver oculto.

## 6. Pull request e publicação

1. Atualize a sua branch com a `main` antes de abrir ou concluir o pull request.
2. Abra o pull request e preencha toda a lista de verificação.
3. O GitHub valida caminhos, manifesto, recursos e catálogo. Verde significa apenas “tecnicamente válido”.
4. Um mantenedor revê segurança infantil, licenças, funcionamento e conteúdo.
5. Só o merge na `main` significa “aceite”.
6. O GitHub Pages publica o merge. Depois disso, jogos novos aparecem na biblioteca; versões superiores de jogos instalados são atualizadas automaticamente.

Se houver conflitos, o pull request não está aprovado para publicação. Atualize a branch sem substituir ficheiros atuais da plataforma.

Ao contribuir, confirma que possui direitos sobre todo o conteúdo e aceita `docs/CHILD-SAFETY.md`, `docs/GAME-SPEC.md`, `docs/MULTIPLAYER.md` e `docs/REVIEW-PUBLISHING.md`.
