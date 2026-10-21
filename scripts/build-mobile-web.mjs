import {cp,mkdir,readdir,readFile,rm,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'mobile','www');
const rootFiles=[
  'index.html','about.html','privacy.html','dinoplay-v23.webmanifest','version.json',
  'dinoplay-v23-192.png','dinoplay-v23-512.png','style.css','world.css','racer.css',
  'language.css','game-runtime.css','app.js','platform.js','parental.js','i18n.js',
  'multiplayer-core.js','multiplayer.js','racer.js','sw.js'
];
const directories=['assets','games','sdk'];
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const file of rootFiles)await cp(resolve(root,file),resolve(output,file));
for(const directory of directories)await cp(resolve(root,directory),resolve(output,directory),{recursive:true});

// Service workers do not control Capacitor's local scheme. Remove registration while preserving
// the browser/PWA source and its offline worker unchanged.
const appPath=resolve(output,'app.js');
let app=await readFile(appPath,'utf8');
app=app.replace(/if\('serviceWorker' in navigator\)navigator\.serviceWorker\.register\('\.\/sw\.js'\);?/g,'');
await writeFile(appPath,app);

const copied=await readdir(output);
if(!copied.includes('index.html'))throw new Error('index.html não foi copiado');
console.log(`DinoPlay Android: ${copied.length} entradas preparadas em mobile/www.`);
