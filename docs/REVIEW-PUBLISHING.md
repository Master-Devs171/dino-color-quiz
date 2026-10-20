# Revisão e publicação de contribuições

## Estados oficiais

1. **Validação aprovada** — os testes automáticos passaram. Ainda não é aprovação nem publicação.
2. **Revisão aprovada** — um mantenedor verificou código, conteúdo, licenças, segurança e funcionamento.
3. **Integrado** — o pull request foi unido à branch `main`. Só este passo aceita a contribuição.
4. **Publicado** — o GitHub Pages terminou com sucesso e o manifesto aparece no catálogo público.

Um pull request aberto, com conflitos ou apenas com visto verde não está disponível na app.

## Revisão do mantenedor

O mantenedor confirma:

- alterações limitadas aos caminhos permitidos;
- manifesto, catálogo e lista de recursos coerentes;
- ausência de rede externa, telemetria, publicidade e recolha de dados;
- licenças e autoria de todos os recursos;
- interface adequada à idade e sem padrões manipuladores;
- funcionamento offline, suspensão correta e consumo razoável;
- armazenamento apenas através do SDK;
- multiplayer exclusivamente pela plataforma e sujeito ao controlo parental;
- testes em Android/PWA e ausência de erros graves.

## Integração segura

Nunca se devem aceitar alterações antigas a `platform.js`, `sw.js`, `app.js` ou `index.html` vindas de uma contribuição de jogo. Quando um pull request antigo tiver esses conflitos, integram-se apenas a pasta do jogo, a entrada do catálogo e os testes, todos sobre a versão atual da `main`.

Após o merge, confirme que a ação de publicação terminou, que o manifesto responde no endereço público e que o número de jogos do catálogo aumentou. Para atualizações, confirme que a versão publicada é superior à anterior.
