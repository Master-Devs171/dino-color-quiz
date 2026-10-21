# Início rápido para programadores

## Preparar

1. Faça fork do repositório e crie uma branch `community/<id-do-jogo>` a partir da `main` atual.
2. Copie `contributor-kit/game-template` para `games/community/<id-do-jogo>`.
3. Substitua `example-game` no manifesto pelo mesmo nome da pasta.
4. Desenvolva apenas dentro dessa pasta.
5. Acrescente ao fim de `games/catalog.json` uma cópia dos campos públicos do `manifest.json`.

O anfitrião disponibiliza `window.DinoPlay`:

```js
const context = await DinoPlay.ready();
const progress = await DinoPlay.storage.get('progress');
await DinoPlay.storage.set('progress', { level: 2 });
await DinoPlay.close();
```

Nunca utilize `localStorage`, `fetch`, WebSocket, cookies, formulários, links externos ou APIs do dispositivo. O jogo deve funcionar sem Internet e usar apenas recursos declarados no manifesto.

## Validar

```text
node scripts/validate-catalog.mjs
node scripts/scan-community-security.mjs
node scripts/test-platform-contracts.mjs
node scripts/test-i18n.mjs
node scripts/run-community-tests.mjs
```

Abra a raiz do DinoPlay através de um servidor HTTP local, instale o jogo pela biblioteca e teste-o dentro do sandbox. Abrir diretamente o `index.html` não testa a integração.

## Atualizar um jogo

Altere apenas a pasta do jogo, a respetiva entrada do catálogo e os testes. Aumente `version` no manifesto e no catálogo. Não altere versões, cache ou ficheiros da plataforma.

## Estados no GitHub

- Visto verde: validação técnica concluída.
- Revisão aprovada: conteúdo e segurança revistos por uma pessoa.
- Merge: contribuição aceite.
- Pages concluído: jogo publicado e disponível na app.
