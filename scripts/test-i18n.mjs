import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=await readFile(resolve(root,'i18n.js'),'utf8');
const codes=['pt-PT','pt-BR','en','fr','de','es','pl'];
const required=['Biblioteca','Pais','INSTALAR','JOGAR','Área dos Pais','PIN parental','CRIAR PROTEÇÃO PARENTAL','Idade','Versão','Tamanho','Autor','Offline','Pontos','Fechar','Voltar','Puzzles','Ação','Desporto','Música','Segurança','Amigos','Jogos','Extras','INDISPONÍVEL','Quem somos','Comunidade DinoPlay','Dados e privacidade','Apagar perfil multiplayer','Alterar PIN parental','ENTRAR NA COMUNIDADE','ESCOLHIDOS PARA CRIANÇAS','GESTÃO SEGURA','Permite jogar apenas com amigos aprovados pelos dois responsáveis.','Usa apenas o primeiro nome ou um apelido. Será visível somente aos amigos autorizados.','Os códigos só funcionam aqui, uma vez e durante 2 minutos.','Monta 50 imagens coloridas e treina a atenção.','Constrói, escava e transforma um enorme mundo 3D.','Explora a cidade, ganha moedas e compra veículos.','Escolhe um PIN com 4 a 6 números.','Os dois PIN não são iguais.','Primeiro guarda o nome ou apelido da criança.','A gerar código seguro…','Introduz o código completo de 11 caracteres.','A confirmar autorização dos dois responsáveis…','Amigo autorizado','Autorizado pelos responsáveis','Com autorização parental','Categorias de jogos','instalados','jogo','jogos','🔎 A procurar uma nova versão…','🦕 Nova versão encontrada. A instalar…','✅ Atualização instalada. A reiniciar…'];
const mustChange=['Área dos Pais','CRIAR PROTEÇÃO PARENTAL','Quem somos','Dados e privacidade','Apagar perfil multiplayer','ESCOLHIDOS PARA CRIANÇAS','GESTÃO SEGURA','Permite jogar apenas com amigos aprovados pelos dois responsáveis.','Usa apenas o primeiro nome ou um apelido. Será visível somente aos amigos autorizados.','Os códigos só funcionam aqui, uma vez e durante 2 minutos.','Monta 50 imagens coloridas e treina a atenção.','Constrói, escava e transforma um enorme mundo 3D.','Explora a cidade, ganha moedas e compra veículos.','Escolhe um PIN com 4 a 6 números.','Os dois PIN não são iguais.','Primeiro guarda o nome ou apelido da criança.','A gerar código seguro…','Introduz o código completo de 11 caracteres.','A confirmar autorização dos dois responsáveis…','Autorizado pelos responsáveis','Com autorização parental','Categorias de jogos','jogo','jogos','🔎 A procurar uma nova versão…','🦕 Nova versão encontrada. A instalar…','✅ Atualização instalada. A reiniciar…'];

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
  if(!['pt-PT','pt-BR'].includes(code)&&window.DinoI18n.t('Comunidade DinoPlay')==='Comunidade DinoPlay')throw new Error(`${code}: tradução da comunidade em falta`);
}

for(const code of ['fr','de','es','pl']){
  const window={};
  const context={window,localStorage:{getItem:key=>key==='dinoPlayLanguage'?code:null,setItem(){}},document:{readyState:'loading'},addEventListener(){}};
  vm.createContext(context);vm.runInContext(source,context,{filename:'i18n.js'});
  if(window.DinoI18n.t('ESCOLHIDOS PARA CRIANÇAS')==='ESCOLHIDOS PARA CRIANÇAS')throw new Error(`${code}: fallback inglês não aplicado`);
  for(const text of mustChange)if(window.DinoI18n.t(text)===text)throw new Error(`${code}: texto continua em português: ${text}`);
}

console.log('DinoPlay: 7 idiomas e textos essenciais da plataforma validados.');
