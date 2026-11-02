import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const [
  platform,
  shell,
  sdk,
  worker,
  index,
  schema,
  multiplayerCore,
  multiplayerWorker,
  privacy,
  about,
  versionFile,
  androidManifest,
] = await Promise.all([
  read("platform.js"),
  read("shell.js"),
  read("sdk/dinoplay-game-sdk.js"),
  read("sw.js"),
  read("index.html"),
  read("games/game.schema.json"),
  read("multiplayer-core.js"),
  read("cloudflare-multiplayer/src/index.js"),
  read("privacy.html"),
  read("about.html"),
  read("version.json"),
  read("mobile/android/app/src/main/AndroidManifest.xml"),
]);
const requireText = (source, text, label) => {
  if (!source.includes(text))
    throw new Error(`Contrato da plataforma em falta: ${label}`);
};
const releaseVersion = JSON.parse(versionFile).version;
requireText(
  shell,
  `const APP_VERSION = "${releaseVersion}"`,
  "versão interna igual à versão publicada",
);
requireText(
  shell,
  "window.DINOPLAY_VERSION = APP_VERSION",
  "versão única partilhada com a interface",
);
requireText(
  shell,
  '`./sw.js?v=${encodeURIComponent(APP_VERSION)}`',
  "Service Worker identificado pela versão publicada",
);
for (const [, asset] of index.matchAll(
  /(?:src|href)="([^"?]+\.(?:js|css)\?v=\d+)"/g,
))
  requireText(
    worker,
    `./${asset}`,
    `pré-cache atualizado para ${asset}`,
  );
requireText(
  platform,
  "window.DINOPLAY_VERSION",
  "interface usa a versão interna atual",
);
requireText(
  platform,
  "game.catalogCover",
  "capas da biblioteca servidas pela própria aplicação",
);
requireText(
  platform,
  'https://rjcferreira.github.io/DinoPlay/',
  "catálogo público usado pela aplicação Android",
);
requireText(
  platform,
  '? [publicCatalogUrl, "./games/catalog.json"]',
  "fallback interno quando o catálogo público estiver indisponível",
);
requireText(
  platform,
  "[A-Za-z0-9-]{1,39}",
  "repositórios comunitários mantêm o proprietário original",
);
requireText(
  index,
  `DinoPlay v${releaseVersion}`,
  "versão inicial igual à versão publicada",
);
requireText(
  androidManifest,
  'android:screenOrientation="fullSensor"',
  "aplicação Android permite rotação completa pelo sensor",
);

requireText(
  platform,
  "event.source !== frame.contentWindow",
  "origem das mensagens do jogo",
);
requireText(
  platform,
  'throw new Error("permission-denied")',
  "bloqueio de armazenamento sem permissão",
);
requireText(
  platform,
  "new Blob([encoded]).size > 262144",
  "limite de armazenamento",
);
requireText(
  platform,
  ': "allow-scripts allow-pointer-lock"',
  "sandbox sem acesso à origem",
);
requireText(
  platform,
  '? "allow-scripts allow-same-origin allow-pointer-lock"',
  "origem local apenas no Android nativo",
);
requireText(
  platform,
  "dinoplay-games-v2-${id}-",
  "cache isolada por jogo e versão",
);
requireText(
  platform,
  "await clearGamePackage(game)",
  "reposição de instalação incompleta",
);
requireText(
  platform,
  "if (!(await stage.match(installedAssetPath(game, asset))))",
  "verificação do pacote antes de ativar atualização",
);
requireText(platform, "data-parent-page", "Área dos Pais multipágina");
requireText(
  platform,
  'request.action === "entitlements:has"',
  "consulta isolada de extras",
);
requireText(
  platform,
  "parentPrivacyMarkup",
  "controlo parental de dados e privacidade",
);
requireText(
  platform,
  "deleteMultiplayerProfile",
  "eliminação do perfil multiplayer",
);
requireText(platform, "parentReportsMarkup", "denúncia protegida na Área dos Pais");
requireText(
  platform,
  "dinoplay-community.dinoplay-multiplayer.workers.dev/reports/game",
  "envio seguro de denúncias para o serviço comunitário",
);
requireText(
  index,
  "https://dinoplay-community.dinoplay-multiplayer.workers.dev",
  "ligação limitada ao serviço de denúncias aprovado",
);
requireText(sdk, "event.source!==parent", "respostas apenas do anfitrião");
requireText(
  sdk,
  "get language(){return context?.language||'en'}",
  "idioma preferido com fallback inglês",
);
requireText(
  sdk,
  "has:id=>request('entitlements:has'",
  "SDK de direitos pagos sem pagamentos no jogo",
);
requireText(schema, '"entitlements"', "permissão de extras no manifesto");
requireText(schema, '"extras"', "declaração de extras no manifesto");
requireText(
  await read("contributor-kit/game-template/game.js"),
  "translations[context.language]||translations.en",
  "fallback inglês no modelo de jogo",
);
requireText(
  worker,
  'url.pathname.endsWith("/version.json")',
  "atualização da aplicação",
);
requireText(
  worker,
  'url.pathname.endsWith("/games/catalog.json")',
  "atualização do catálogo",
);
requireText(index, "parental.js?v=1", "proteção parental carregada");
requireText(
  index,
  "Content-Security-Policy",
  "política de segurança da aplicação",
);
requireText(
  index,
  "connect-src 'self' https://rjcferreira.github.io https://raw.githubusercontent.com https://dinoplay-multiplayer.dinoplay-multiplayer.workers.dev",
  "ligações limitadas aos repositórios aprovados e ao serviço multiplayer",
);
requireText(
  multiplayerCore,
  "api('/friends/account',{method:'DELETE'})",
  "pedido autenticado de eliminação multiplayer",
);
requireText(
  multiplayerCore,
  "if(onlineEnabled())syncFriends()",
  "nenhum registo multiplayer antes da autorização parental",
);
requireText(
  multiplayerWorker,
  "url.pathname==='/friends/account'&&request.method==='DELETE'",
  "eliminação de dados multiplayer no servidor",
);
requireText(
  multiplayerWorker,
  "activeCode:${device}",
  "invalidação do código de amizade anterior",
);
requireText(
  multiplayerWorker,
  "activeSession:${device}",
  "invalidação da sessão anterior",
);
requireText(
  privacy,
  "Política de privacidade",
  "política de privacidade pública",
);
requireText(
  worker,
  'FILES.push("./privacy.html", "./about.html")',
  "páginas institucionais disponíveis offline",
);
requireText(
  worker,
  "c.addAll(FILES)",
  "instalação atómica dos ficheiros essenciais",
);
requireText(
  about,
  "Pais a construir para os nossos filhos",
  "origem e missão do DinoPlay",
);
requireText(
  about,
  "https://discord.gg/f22q9cQYNp",
  "ligação pública da comunidade",
);
requireText(
  platform,
  "Não é uma área para crianças",
  "comunidade reservada a adultos na Área dos Pais",
);

console.log(
  "DinoPlay: contratos de sandbox, permissões, armazenamento e atualização validados.",
);
