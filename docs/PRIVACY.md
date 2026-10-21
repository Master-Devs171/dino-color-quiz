# Informação de privacidade para responsáveis

DinoPlay foi desenhado para crianças e evita recolher dados pessoais.

## Dados guardados no dispositivo

- jogos instalados e respetivas versões;
- progresso, recordes e personalização, isolados por jogo;
- PIN parental protegido por hash, código de recuperação protegido por hash e preferências parentais;
- apelido escolhido pelo responsável e amizades autorizadas, quando o multiplayer é ativado.

O PIN e o código de recuperação não são enviados para o servidor. Limpar os dados da aplicação elimina o progresso e as definições locais.

A versão pública desta informação está em `privacy.html` e deve ser usada como URL da política de privacidade na Google Play.

## Multiplayer

O multiplayer vem bloqueado. Quando um responsável o ativa, o serviço processa identificadores técnicos aleatórios, apelidos escolhidos pelos responsáveis, amizades autorizadas e estado temporário das partidas. Não existe chat, localização, pesquisa pública, anúncios ou perfis públicos. Os códigos de autorização expiram em dois minutos e são de utilização única.

As partidas usam WebRTC. A Cloudflare e os fornecedores de rede podem processar endereços IP e informação técnica necessária para estabelecer e proteger a ligação. Estes dados não são usados para publicidade, localização da criança ou criação de perfis.

O responsável pode apagar o perfil multiplayer e todas as amizades em **Área dos Pais → Privacidade**. O serviço elimina o apelido, a identificação técnica e as relações de amizade associadas ao dispositivo.

## Jogos comunitários

Jogos comunitários funcionam isolados, sem acesso direto às amizades, PIN, perfil global ou Internet. Recebem apenas as capacidades aprovadas pela plataforma. O armazenamento de cada jogo tem limite e destina-se exclusivamente ao progresso.

## Relatórios

Não coloque dados pessoais de crianças em issues, pull requests ou relatórios. Vulnerabilidades sensíveis devem ser comunicadas de forma privada conforme `SECURITY.md`.
