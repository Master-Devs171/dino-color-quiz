param(
    [string]$DistinguishedName = 'CN=DinoPlay Upload, O=DinoPlay, C=PT'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $projectRoot 'mobile\android'
$keyPath = Join-Path $androidRoot 'dinoplay-upload.jks'
$propertiesPath = Join-Path $androidRoot 'keystore.properties'

if (Test-Path -LiteralPath $keyPath) {
    throw "A chave já existe em $keyPath. Não foi alterada."
}
if (Test-Path -LiteralPath $propertiesPath) {
    throw "A configuração já existe em $propertiesPath. Não foi alterada."
}
if (-not (Get-Command keytool -ErrorAction SilentlyContinue)) {
    throw 'keytool não encontrado. Instale um JDK 17 ou superior.'
}

$securePassword = Read-Host 'Crie uma password forte para a upload key (mínimo 12 caracteres)' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    if ($password.Length -lt 12) { throw 'A password deve ter pelo menos 12 caracteres.' }
    & keytool -genkeypair -v -keystore $keyPath -storetype JKS -alias dinoplay-upload -keyalg RSA -keysize 4096 -validity 10000 -dname $DistinguishedName -storepass $password -keypass $password
    if ($LASTEXITCODE -ne 0) { throw 'O keytool não conseguiu criar a chave.' }
    $content = "storeFile=dinoplay-upload.jks`nstorePassword=$password`nkeyAlias=dinoplay-upload`nkeyPassword=$password`n"
    [IO.File]::WriteAllText($propertiesPath, $content, [Text.UTF8Encoding]::new($false))
    & keytool -exportcert -rfc -keystore $keyPath -alias dinoplay-upload -storepass $password -file (Join-Path $androidRoot 'upload_certificate.pem')
    Write-Host "Upload key criada. Guarde uma cópia segura de $keyPath e da password."
} finally {
    if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
    $password = $null
}
