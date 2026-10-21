# Publicação do DinoPlay na Google Play

Este documento é a checklist de lançamento. Não se deve publicar antes de todos os bloqueios estarem resolvidos.

## Decisões técnicas

- Formato Android: **Capacitor 8**, com os ficheiros essenciais incluídos no pacote e sem plugins de permissões sensíveis. A TWA foi rejeitada como arquitetura porque o próprio Bubblewrap avisa que é incompatível com aplicações dirigidas a menores de 13 anos, e a política Families não permite uma aplicação que seja apenas um invólucro de um website.
- ID de pacote proposto: `io.github.rjcferreira.dinoplay`. O ID torna-se permanente depois da primeira publicação; confirme-o antes de criar a aplicação na Play Console.
- URL inicial: `https://rjcferreira.github.io/dino-color-quiz/?app=dinoplay`.
- API alvo: Android 16 / API 36 para novas submissões a partir de 31 de agosto de 2026.
- Sem permissões de localização, câmara, microfone, contactos, telefone, ficheiros, Bluetooth ou identificador de publicidade.

## Bloqueios antes de gerar o AAB final

1. Criar a aplicação na Play Console com o ID de pacote definitivo e ativar Play App Signing.
2. Obter a impressão digital SHA-256 da **App signing key** da Play Console.
3. Compilar o projeto em `mobile/android` com API 36 e inspecionar o manifesto final para confirmar a ausência de permissões sensíveis e `AD_ID`.
4. Criar uma upload key local e ativar Play App Signing; nunca guardar a chave, passwords ou credenciais no Git.
5. Gerar e testar o AAB de release.

O `assetlinks.json` só é necessário se forem ativados Android App Links para abrir URLs do site diretamente na aplicação; deixou de ser um bloqueio da arquitetura principal.

## Play Console

- Categoria: Jogos / Educativo ou Família, conforme a opção disponível.
- Público-alvo: declarar fielmente as idades infantis suportadas; a aplicação foi desenhada a partir dos 5 anos.
- Anúncios: **Não contém anúncios**.
- Compras: **Não** enquanto o sistema de pagamentos estiver desativado. Qualquer futura venda digital tem de usar Google Play Billing e validação no servidor.
- Acesso à app: explicar que a Área dos Pais usa um PIN criado localmente; o revisor pode criar qualquer PIN de 4 a 6 números.
- Política de privacidade: `https://rjcferreira.github.io/dino-color-quiz/privacy.html`.
- Classificação de conteúdo: responder de acordo com cada jogo disponível no catálogo. Uma contribuição nova obriga a rever esta classificação.
- App content / Families: confirmar ausência de chat, anúncios, localização, contactos e perfis públicos; multiplayer privado e bloqueado por predefinição.
- Registar o package name e confirmar a identidade do programador, exigido desde 30 de setembro de 2026.

## Segurança dos dados — base para o formulário

Responder conservadoramente e rever o formulário com a política publicada:

- dados processados fora do dispositivo quando o multiplayer é ativado: identificador técnico pseudónimo, segredo de autenticação, apelido, relações de amizade, presença e dados técnicos de rede;
- finalidades: funcionalidade da aplicação, autenticação, prevenção de abuso e comunicação entre amigos autorizados;
- sem venda, publicidade ou análise comportamental;
- dados em trânsito protegidos por HTTPS/WSS; a partida usa WebRTC;
- eliminação disponível em **Área dos Pais → Privacidade**;
- progresso, PIN e preferências processados apenas no dispositivo não são declarados como recolha fora do dispositivo;
- avaliar no formulário se o processamento temporário de endereços IP pelo alojamento, STUN e WebRTC é elegível como processamento efémero. Em caso de dúvida, declarar.

## Materiais da loja ainda necessários

- ícone Google Play 512×512 PNG (o ficheiro `dinoplay-v23-512.png` tem as dimensões corretas; confirmar visualmente margens e recorte);
- feature graphic 1024×500, PNG de 24 bits ou JPEG sem transparência;
- pelo menos duas capturas reais de telefone, entre 320 e 3840 px e com proporção aceite;
- nome, descrição curta e descrição completa sem alegações enganosas;
- email público de suporte e contacto de privacidade do programador;
- traduções da ficha para os idiomas escolhidos.

## Testes obrigatórios e recomendados

- Teste interno em pelo menos um Android Samsung e um Android de outro fabricante.
- Android 8/9 (mínimo escolhido), Android 13, 14, 15 e 16.
- instalação limpa, atualização, modo offline, retoma após suspensão e limpeza de dados;
- Área dos Pais, recuperação do PIN e bloqueio por tentativas;
- criação e eliminação do perfil multiplayer;
- multiplayer entre Wi-Fi e dados móveis, perda de rede, ecrã bloqueado e reconexão;
- instalação, atualização, falha e rollback de jogos comunitários;
- desempenho e memória nos dois mundos 3D;
- relatório pre-launch da Play Console sem crashes, ANRs ou vulnerabilidades bloqueantes.

Contas pessoais da Play Console criadas depois de 13 de novembro de 2023 precisam de teste fechado com pelo menos 12 participantes inscritos continuamente durante 14 dias antes de pedir acesso à produção.

## Regra para jogos comunitários

JavaScript interpretado pode ser carregado em runtime, mas cada atualização continua sujeita às políticas Google Play. O catálogo só pode aceitar código revisto, local ao domínio DinoPlay, sem SDKs externos, anúncios, recolha de dados, downloads executáveis ou funções proibidas. Uma mudança material de conteúdo, recolha de dados, multiplayer ou monetização obriga a rever a ficha, Data safety, classificação etária e política de privacidade.
