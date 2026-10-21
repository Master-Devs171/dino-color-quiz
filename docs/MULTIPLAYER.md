# Multiplayer DinoPlay

O multiplayer é um serviço da plataforma, não uma funcionalidade independente de cada jogo.

## Garantias comuns

- Bloqueado por predefinição na Área dos Pais.
- Perfil infantil mínimo com apelido escolhido pelo responsável.
- Amizade criada por código de utilização única com validade de dois minutos.
- Aprovação bilateral dos responsáveis e remoção possível em ambos os lados.
- Apenas amigos autorizados e online aparecem dentro dos jogos.
- Máximo de cinco participantes.
- Sem chat, salas públicas, pesquisa ou QR Code.
- Sessões não continuam quando a aplicação está fechada.
- A presença usa heartbeat e, ao restabelecer uma ligação, o fecho atrasado da ligação anterior não pode marcar a nova sessão como offline.

## Integração

Jogos oficiais usam `DinoPlayMultiplayer.game(gameId)`. Jogos comunitários usam exclusivamente `DinoPlay.multiplayer` através do SDK isolado. O servidor de presença, convites e sinalização é partilhado; um jogo não pode ligar-se diretamente ao registo de amizades.

O protocolo de dados específico do jogo deve validar tipos, tamanhos e frequência das mensagens, tolerar desconexões e nunca aceitar HTML, código executável ou URLs enviados por outro jogador.
