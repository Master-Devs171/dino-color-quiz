# Extras pagos e compras parentais

## Regra principal

Uma criança nunca vê preços, promoções, carrinhos, botões de compra ou pedidos de pagamento dentro de um jogo. Toda a descoberta, confirmação, restauro e gestão de compras pertence exclusivamente à página **Extras** da Área dos Pais, protegida pelo PIN parental.

## Responsabilidade do jogo

O programador pode propor até 12 extras permanentes no campo `extras` do manifesto. Cada extra contém apenas `id`, `name`, `description` e `type: "permanent"`. Preço, moeda, impostos, disponibilidade e condições comerciais nunca são definidos pelo código contribuído.

O jogo declara a permissão `entitlements` e consulta exclusivamente:

```js
const { available } = await DinoPlay.entitlements.status();
const unlocked = await DinoPlay.entitlements.has('pacote-dinossauros');
```

O jogo deve funcionar normalmente quando `available` ou `unlocked` forem falsos. Não pode abrir páginas de pagamento, criar urgência artificial, insistir com a criança ou esconder funções essenciais de segurança e acessibilidade.

## Responsabilidade da plataforma

- A plataforma apresenta os extras apenas ao responsável autenticado.
- O preço vem sempre de um catálogo comercial controlado pelo servidor.
- O servidor valida recibos e devolve direitos assinados; `localStorage` nunca prova uma compra.
- O jogo recebe apenas verdadeiro/falso para o seu próprio extra, sem nome, email, cartão, morada ou histórico de compras.
- Compras podem ser restauradas e revogadas pela plataforma.
- Partilha de receita e identidade fiscal do programador exigem um acordo separado antes da venda.

## Estado atual

A interface, manifesto e SDK estão preparados, mas pagamentos reais permanecem desativados até existir fornecedor de pagamentos, validação de recibos no servidor, termos comerciais, política de reembolso e revisão jurídica. Até lá, todos os extras aparecem como indisponíveis e `DinoPlay.entitlements.has()` devolve `false`.
