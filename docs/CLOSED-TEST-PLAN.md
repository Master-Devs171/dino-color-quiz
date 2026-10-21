# Plano de teste fechado — Google Play

Este plano serve para a primeira publicação do DinoPlay e para futuras versões com alterações importantes.

## Preparação

- Criar a faixa de teste fechado na Play Console.
- Adicionar pelo menos 12 testadores reais e manter o teste durante 14 dias consecutivos, quando este requisito for aplicado à conta.
- Distribuir apenas o link oficial de adesão da Google Play.
- Não partilhar a chave de assinatura nem palavras-passe da Play Console.

## Cenários a validar

1. Instalação, primeira abertura e atualização através da Google Play.
2. Navegação entre Início, Biblioteca e Área dos Pais.
3. Criação, validação e alteração do PIN parental.
4. Instalação e remoção de jogos pela Área dos Pais.
5. Mudança de idioma e fallback para inglês quando faltar uma tradução num jogo.
6. Funcionamento offline dos conteúdos que declaram suporte offline.
7. Multiplayer bloqueado por predefinição e disponível apenas após autorização parental.
8. Criação e remoção bilateral de amizades autorizadas.
9. Suspensão e retoma da aplicação sem perda indevida de estado.
10. Eliminação do perfil e dos dados online associados.

## Registo de resultados

Para cada problema, guardar modelo do telefone, versão Android, versão DinoPlay, passos para reproduzir, resultado esperado, resultado obtido e uma captura de ecrã quando aplicável.

## Critérios para avançar

- Nenhum crash ou bloqueio que impeça iniciar ou sair de um jogo.
- Nenhum acesso infantil a compras, gestão de amizades ou configuração multiplayer.
- Instalação e atualização concluídas em pelo menos dois modelos Android diferentes.
- Textos principais revistos nos sete idiomas da plataforma.
- Política de privacidade e eliminação de dados acessíveis publicamente.
