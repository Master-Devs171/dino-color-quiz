# DinoPlay Android

Projeto Android publicável baseado em Capacitor 8.5.3, com API 36, mínimo Android 8 (API 26) e conteúdo essencial incluído no pacote.

## Preparar e sincronizar

```powershell
npm install
npm run sync
```

## Compilar para testes

Definir `ANDROID_HOME` para o Android SDK e executar:

```powershell
cd android
.\gradlew.bat assembleDebug
```

## Bundle de produção

O bundle final precisa de uma upload key privada. Crie-a uma única vez num terminal interativo; o script pede a password sem a mostrar e os ficheiros produzidos estão excluídos do Git:

```powershell
.\scripts\create-upload-key.ps1
```

Guarde uma cópia segura de `mobile/android/dinoplay-upload.jks` e da password fora deste computador. Ative Play App Signing e deixe a Google gerar e proteger a app signing key.

```powershell
npm run build:bundle
```

Sem `keystore.properties`, o Gradle gera apenas um bundle técnico não assinado. Com a configuração criada pelo script, `app-release.aab` é assinado automaticamente com a upload key.

O package ID é `io.github.rjcferreira.dinoplay`. O manifesto permite apenas Internet, bloqueia tráfego HTTP e desativa backup/transferência de dados.
