# Formato de jogos DinoPlay v1

Cada jogo comunitário vive numa pasta própria em `games/community/<id>/` e fornece um manifesto compatível com `games/game.schema.json`.

O campo `version` é também o sinal de atualização. Qualquer alteração publicada ao jogo deve aumentar a versão; o catálogo é consultado ao abrir a app, ao regressar ao primeiro plano, quando a Internet volta e de 15 em 15 minutos. Jogos já instalados são atualizados automaticamente através de uma área temporária, para que uma falha não substitua a versão funcional.

## Execução

- `runtime: "native"` é reservado aos jogos oficiais revistos juntamente com a plataforma.
- Contribuições da comunidade usam `runtime: "sandbox"` e são abertas num `iframe` isolado, sem acesso direto ao armazenamento, perfis, amizades ou código interno da aplicação.
- `entry` aponta para o HTML inicial dentro do repositório.
- Todos os caminhos são locais e relativos. Recursos, bibliotecas, telemetria e scripts remotos são proibidos.
- `offline` tem obrigatoriamente o valor `true`; todos os ficheiros necessários devem constar em `assets`.

## SDK

O jogo inclui `sdk/dinoplay-game-sdk.js`, chama `await DinoPlay.ready()` e recebe apenas contexto aprovado: idioma, identificador do jogo e capacidades disponíveis. Dados persistentes usam `DinoPlay.storage`; nunca `localStorage` como contrato público.

### Idioma do jogo

Cada jogo mantém as suas próprias traduções. A DinoPlay comunica a preferência do utilizador para o jogo abrir logo no idioma certo:

```js
const context = await DinoPlay.ready();
const language = context.language; // por exemplo: pt-PT, pt-BR, en, fr, de, es ou pl
const pack = translations[language] || translations.en;
```

O mesmo valor fica disponível em `DinoPlay.language` depois de `ready()`. A plataforma não traduz textos do jogo: o autor controla integralmente o vocabulário, áudio e conteúdo de cada idioma. Todos os jogos com vários idiomas devem incluir inglês e usá-lo como fallback quando ainda não existir uma tradução para o idioma escolhido.

O armazenamento é isolado por jogo, limitado a 256 KB e deve conter apenas progresso do jogo. Não pode guardar nome, contactos, localização, identificadores publicitários ou qualquer dado pessoal.

## Multiplayer

O manifesto declara `multiplayer: true` e a permissão `multiplayer`. O jogo consulta `DinoPlay.multiplayer.status()` e pede a interface da plataforma com `DinoPlay.multiplayer.open()`.

O jogo nunca implementa contas, códigos de partida, listas públicas, chat, descoberta de pessoas ou servidores próprios. O anfitrião DinoPlay aplica o bloqueio parental, amizades aprovadas pelos dois responsáveis, limite de cinco jogadores e revogação imediata. Uma contribuição multiplayer exige revisão adicional do protocolo de sincronização antes de ser publicada.

`DinoPlay.multiplayer.open()` pede uma sessão à plataforma, mas não dá acesso à lista de amigos nem a identificadores pessoais. Cada género de jogo pode precisar de um adaptador de sincronização próprio; esse adaptador é revisto e mantido pela plataforma, enquanto as regras de autorização permanecem iguais para todos os jogos.

## Ciclo de vida

1. `DinoPlay.ready()` após carregar.
2. O jogo funciona com toque, rato e teclado sem bloquear a navegação do sistema.
3. `DinoPlay.close()` regressa à biblioteca.
4. Pausar animação, áudio e temporizadores quando `document.hidden` for verdadeiro.
