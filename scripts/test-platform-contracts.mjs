import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFile(resolve(root,path),'utf8');
const [platform,sdk,worker,index,schema]=await Promise.all([
  read('platform.js'),read('sdk/dinoplay-game-sdk.js'),read('sw.js'),read('index.html'),read('games/game.schema.json')
]);
const requireText=(source,text,label)=>{if(!source.includes(text))throw new Error(`Contrato da plataforma em falta: ${label}`)};

requireText(platform,'event.source !== frame.contentWindow','origem das mensagens do jogo');
requireText(platform,'throw new Error("permission-denied")','bloqueio de armazenamento sem permissão');
requireText(platform,'new Blob([encoded]).size > 262144','limite de armazenamento');
requireText(platform,'sandbox="allow-scripts allow-pointer-lock"','sandbox sem acesso à origem');
requireText(platform,'dinoplay-games-v2-${id}-','cache isolada por jogo e versão');
requireText(platform,'await caches.delete(targetName)','reposição de instalação incompleta');
requireText(platform,'if (!(await stage.match(asset)))','verificação do pacote antes de ativar atualização');
requireText(platform,'data-parent-page','Área dos Pais multipágina');
requireText(platform,'request.action === "entitlements:has"','consulta isolada de extras');
requireText(sdk,'event.source!==parent','respostas apenas do anfitrião');
requireText(sdk,"get language(){return context?.language||'en'}",'idioma preferido com fallback inglês');
requireText(sdk,"has:id=>request('entitlements:has'",'SDK de direitos pagos sem pagamentos no jogo');
requireText(schema,'"entitlements"','permissão de extras no manifesto');
requireText(schema,'"extras"','declaração de extras no manifesto');
requireText(await read('contributor-kit/game-template/game.js'),'translations[context.language]||translations.en','fallback inglês no modelo de jogo');
requireText(worker,"url.pathname.endsWith('/version.json')",'atualização da aplicação');
requireText(worker,"url.pathname.endsWith('/games/catalog.json')",'atualização do catálogo');
requireText(index,'parental.js?v=1','proteção parental carregada');
requireText(index,'Content-Security-Policy','política de segurança da aplicação');
requireText(index,'connect-src \'self\' https://dinoplay-multiplayer.dinoplay-multiplayer.workers.dev wss://dinoplay-multiplayer.dinoplay-multiplayer.workers.dev','ligações limitadas ao serviço multiplayer');

console.log('DinoPlay: contratos de sandbox, permissões, armazenamento e atualização validados.');
