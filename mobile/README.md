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

O bundle só deve ser assinado depois de criar uma upload key privada e ativar Play App Signing. Nunca guardar chaves ou passwords no Git.

```powershell
npm run build:bundle
```

O package ID é `io.github.rjcferreira.dinoplay`. O manifesto permite apenas Internet, bloqueia tráfego HTTP e desativa backup/transferência de dados.
