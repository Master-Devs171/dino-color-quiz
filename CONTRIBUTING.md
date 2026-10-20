# Contribuir com jogos para DinoPlay

Obrigado por ajudar a construir uma biblioteca infantil segura.

1. Crie uma pasta `games/community/<id>/` usando apenas HTML, CSS, JavaScript e recursos locais.
2. Crie o manifesto e valide-o contra `games/game.schema.json`.
3. Use `runtime: "sandbox"` e o SDK em `sdk/dinoplay-game-sdk.js`.
4. Adicione o jogo a `games/catalog.json`.
5. Teste em telemóvel, modo avião, ecrã pequeno e após suspender/retomar a app.
6. Abra um pull request preenchendo a lista de verificação.

## Atualizações automáticas

Sempre que alterar ficheiros de um jogo já publicado, aumente obrigatoriamente o campo `version` do jogo em `games/catalog.json` seguindo `MAJOR.MINOR.PATCH`. Depois de o pull request ser aprovado e publicado, o DinoPlay deteta essa versão e atualiza automaticamente todas as instalações desse jogo. Se algum download falhar, a versão anterior continua disponível e a app volta a tentar mais tarde.

Ao contribuir, confirma que possui direitos sobre todo o código e recursos, indica uma licença e aceita as regras de `docs/CHILD-SAFETY.md`, `docs/GAME-SPEC.md` e `docs/MULTIPLAYER.md`.

Não inclua segredos, serviços pagos, dependências remotas, anúncios, rastreadores ou conteúdo gerado a partir de dados pessoais de crianças.
