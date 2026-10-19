# DinoPlay Multiplayer

Servidor de sinalização para salas privadas DinoPlay. Usa Cloudflare Workers e Durable Objects no plano gratuito.

- máximo de 5 jogadores;
- convite com identificador e segredo aleatórios;
- anfitrião aprova cada convidado;
- sem pesquisa de salas, chat ou perfis;
- a sala termina quando o anfitrião sai.

O segredo do convite nunca deve ser guardado no repositório.
