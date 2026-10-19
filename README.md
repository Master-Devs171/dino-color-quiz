# DinoPlay

DinoPlay é uma plataforma infantil instalável: uma biblioteca segura onde cada família escolhe os jogos que quer instalar. Os jogos oficiais e os futuros jogos da comunidade partilham instalação offline, atualizações, idiomas, progresso isolado, controlo parental e o modelo multiplayer DinoPlay.

## Contribuir com um jogo

As contribuições são feitas por pull request e revistas antes de entrarem na biblioteca. Comece em [CONTRIBUTING.md](CONTRIBUTING.md) e consulte:

- [Formato e SDK dos jogos](docs/GAME-SPEC.md)
- [Regras de segurança infantil](docs/CHILD-SAFETY.md)
- [Modelo multiplayer obrigatório](docs/MULTIPLAYER.md)
- [Esquema do manifesto](games/game.schema.json)

Execute `node scripts/validate-catalog.mjs` antes de enviar a contribuição. O GitHub repete automaticamente essa validação em cada pull request.

## Arquitetura de segurança

- Jogos comunitários funcionam num `iframe` isolado, sem acesso direto aos dados da plataforma.
- Recursos remotos, anúncios, rastreadores, chat, compras e autenticação própria são proibidos.
- Cada jogo recebe apenas as capacidades declaradas e aprovadas.
- O armazenamento é separado por jogo e limitado a 256 KB.
- O multiplayer fica bloqueado por predefinição e só funciona com amizades aprovadas pelos dois responsáveis, até cinco jogadores e sem salas públicas.
- A biblioteca continua a funcionar offline depois de cada jogo ser instalado.

## Jogar e instalar

Abra [DinoPlay](https://rjcferreira.github.io/dino-color-quiz/) no Chrome do Android e escolha **Instalar aplicação**. A PWA verifica atualizações ao abrir e através do botão de atualização.
