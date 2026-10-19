# Cobrinhas do Jardim

![Capa de Cobrinhas do Jardim](cover.jpg)

Jogo infantil (5+) para DinoPlay, versão 2.1.0, com 12 adversárias do computador. Arena azul, cobrinhas curtas e gordinhas, crescimento em comprimento e grossura, câmara progressiva e comida grande. Bater na borda termina a partida.

## Jogar

Rato, toque/joystick ou setas/WASD para virar. Espaço ou botão de raio para acelerar. Apanha frutas e os pontos deixados por outras cobras. Ajudas temporárias: íman (12 s), binóculos (12 s) e sapatos velozes (8 s).

## Personalizar e descobrir

Oficina com cartões, cores, padrões, olhos, bocas, acessórios, bandeiras e rastos. Oito aventuras finitas, níveis e álbum de autocolantes. Loja de quatro skins por estrelas virtuais obtidas nas aventuras. Roda gratuita com quatro skins, sem repetições, apostas, anúncios ou pagamentos. As opções base do editor estão sempre disponíveis. Sem prazos nem sequências diárias.

## Integração e privacidade

- Runtime sandbox; recorde, visual e progresso usam apenas DinoPlay.storage na app.
- Todos os recursos são locais e constam do manifesto; nenhuma dependência remota.
- Sem multiplayer online, contas próprias, publicidade, pagamentos, chat ou telemetria.
- Pausa ao suspender ou abrir painéis; respeita movimento reduzido.
- A versão autónoma usa um adaptador local próprio, excluído desta contribuição.

## Capa e licença

Capa local cover.jpg: 640 × 400, preparada para o cartão do catálogo. Ilustração criada para este projeto com a ferramenta de geração de imagens da OpenAI; sem utilização de fotografias ou dados pessoais. Código e SVG do projeto disponibilizados sob MIT; a capa é incluída para distribuição com o jogo. Os emojis são apresentados pela fonte do sistema.

## Verificação

Na raiz DinoPlay:

```sh
node scripts/validate-catalog.mjs
node scripts/test-cobrinhas.cjs
node scripts/test-cobrinhas-ui.cjs
node scripts/test-cobrinhas-progress.cjs
node scripts/test-cobrinhas-powers.cjs
```

Regras, bordas, crescimento, colisões, ajudas, loja, saldo, prémios únicos e recuperação de progresso testados. Interface verificada no navegador em PC, 320 × 568, 390 × 844 e 844 × 390. Toque em telemóvel físico e modo avião continuam pendentes; os testes de DOM/canvas não substituem essas verificações.
