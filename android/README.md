# Android / Google Play — protótipo TWA arquivado

Esta pasta conserva a preparação inicial da TWA apenas como referência. O próprio Bubblewrap avisa que TWA é incompatível com aplicações dirigidas a menores de 13 anos; por isso, a versão Google Play passou para **Capacitor 8** em `../mobile/android`.

- Consulte `../docs/GOOGLE-PLAY-RELEASE.md`.
- Configuração Bubblewrap arquivada: `twa-manifest.json`.
- ID preparado: `io.github.rjcferreira.dinoplay` (torna-se permanente na primeira criação/publicação na Play Console).
- Não usar esta TWA para a publicação infantil.
- Nunca faça commit de ficheiros `.jks`, `.keystore`, `keystore.properties`, passwords ou credenciais da Play Console.
- `assetlinks.template.json` tem de receber a impressão digital da **App signing key**, não apenas a upload key.
- O `assetlinks.json` final tem de ficar em `https://rjcferreira.github.io/.well-known/assetlinks.json`.
