# Cobrinhas do Jardim

Jogo infantil para DinoPlay (5+), com adversárias do computador e personalização da cobrinha. Código e ilustrações SVG locais sob licença MIT, criados para esta contribuição. Os emojis são apresentados pela fonte do sistema.

## Jogar

Instalar pela biblioteca DinoPlay, categoria Explorar. Usa o rato, arrasta no ecrã, utiliza o joystick ou as setas/WASD. Espaço ou botão ⚡ acelera.

Apanha comida para crescer. Quando uma cabeça bate noutra cobrinha, o corpo deixa pontos recolhíveis. Bater na borda elimina a cobrinha; para o jogador, a partida termina e permite recomeçar. O editor 🎨 permite mudar cores, padrões, olhos, bocas, bochechas, acessórios, rastos e bandeiras.

## Integração

- Runtime sandbox com SDK DinoPlay, capacidade storage e recursos locais declarados em manifest.json.
- Recorde e visual guardados exclusivamente através do SDK dentro da app. Abrir o HTML diretamente permite jogar sem persistência após fechar a página.
- Sem multiplayer online: 12 adversárias do computador.
- Pausa ao suspender ou abrir o editor; movimento reduzido respeitado.
- Arena 4800 × 4800 com 1000 peças de comida e quatro zonas.

## Verificação

Na raiz DinoPlay:

```sh
node scripts/validate-catalog.mjs
node scripts/test-cobrinhas.cjs
node scripts/test-cobrinhas-ui.cjs
```

O teste de UI usa DOM/canvas simulados. Não substitui testar toque, instalação offline e layout num navegador/telemóvel real; essas verificações manuais estão pendentes.

## Versão 1.4.0

Movimento interpolado, segmentos do corpo em cache, desenho limitado à área visível e arena sem redesenho contínuo nos menus. Editor dividido em Corpo, Cara, Magia e Bandeira; menus adaptados a PC e telemóvel, pausa compacta e classificação recolhível.

Verificado no navegador em 320 × 568, 390 × 844, 844 × 390 e PC. Testes de regras e interface simulada passaram. Toque físico e modo avião continuam pendentes.

## Aventuras e recompensas (1.5.0)

Oito tarefas finitas e sem prazo, estrelas, níveis, álbum de autocolantes e quatro skins especiais. As recompensas são fixas e só podem ser recebidas uma vez. Não existem sequências diárias, contagens decrescentes, compras, roletas ou sorteios. O editor base continua disponível.

As tarefas contam fruta recolhida, zonas exploradas e padrões guardados na oficina. O progresso é preservado entre partidas.

Teste adicional: node scripts/test-cobrinhas-progress.cjs (na versão autónoma, node test-cobrinhas-progress.cjs).
