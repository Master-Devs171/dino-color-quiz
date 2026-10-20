import {execFileSync} from 'node:child_process';

const base=process.env.BASE_SHA;
const target=process.env.TARGET_SHA||'HEAD';
if(!base)throw new Error('BASE_SHA não definido');
const changed=execFileSync('git',['diff','--name-only',`${base}...${target}`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const folders=[...new Set(changed.map(path=>path.match(/^games\/community\/([^/]+)\//)?.[1]).filter(Boolean))];
const touchesGame=folders.length>0||changed.includes('games/catalog.json');
if(!touchesGame){console.log('DinoPlay: pull request sem contribuição de jogo.');process.exit(0)}
if(folders.length!==1)throw new Error('Cada pull request deve alterar exatamente um jogo comunitário.');
const id=folders[0];
const allowed=path=>path.startsWith(`games/community/${id}/`)||path==='games/catalog.json'||new RegExp(`^scripts/test-${id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[^/]*\\.cjs$`).test(path);
const forbidden=changed.filter(path=>!allowed(path));
if(forbidden.length)throw new Error(`Uma contribuição de jogo não pode alterar o núcleo da plataforma:\n${forbidden.join('\n')}`);
if(!changed.includes('games/catalog.json'))throw new Error('A entrada em games/catalog.json é obrigatória.');
for(const required of [`games/community/${id}/manifest.json`,`games/community/${id}/index.html`,`games/community/${id}/LICENSE`,`games/community/${id}/README.md`])if(!changed.some(path=>path===required))throw new Error(`Ficheiro obrigatório em falta na contribuição: ${required}`);
console.log(`DinoPlay: caminhos da contribuição ${id} aprovados.`);
