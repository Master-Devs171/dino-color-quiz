import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'i18n.js'),'utf8');
const codes=['pt-PT','pt-BR','en','fr','de','es','pl'];
const required=['Biblioteca','Pais','INSTALAR','JOGAR','Área dos Pais','PIN parental','CRIAR PROTEÇÃO PARENTAL','Idade','Versão','Tamanho','Autor','Offline','Pontos','Fechar','Voltar','Puzzles','Ação','Desporto','Música','Segurança','Amigos','Jogos','Extras','INDISPONÍVEL'];

for(const code of codes){
  const window={};
  const context={window,localStorage:{getItem:key=>key==='dinoPlayLanguage'?code:null,setItem(){}},document:{readyState:'loading'},addEventListener(){}};
  vm.createContext(context);
  vm.runInContext(source,context,{filename:'i18n.js'});
  if(!window.DinoI18n?.languages?.[code])throw new Error(`Idioma em falta: ${code}`);
  for(const text of required){
    const translated=window.DinoI18n.t(text);
    if(typeof translated!=='string'||!translated.trim())throw new Error(`${code}: tradução vazia para ${text}`);
  }
  if(!['pt-PT','pt-BR'].includes(code)&&window.DinoI18n.t('Área dos Pais')==='Área dos Pais')throw new Error(`${code}: pacote não aplicado`);
}

console.log('DinoPlay: 7 idiomas e textos essenciais da plataforma validados.');
