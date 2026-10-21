import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const base=process.env.DINOPLAY_WORKER_URL||'http://127.0.0.1:8788';
const origin='https://rjcferreira.github.io';
const random=(size,chars='abcdefghijklmnopqrstuvwxyz0123456789')=>Array.from(crypto.randomBytes(size),byte=>chars[byte%chars.length]).join('');
const makeIdentity=()=>({device:random(20),secret:random(48,'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-')});
async function call(identity,path,{method='GET',body}={}){
  const response=await fetch(`${base}${path}`,{method,headers:{Origin:origin,'Content-Type':'application/json','X-Dino-Device':identity.device,Authorization:`Bearer ${identity.secret}`},body:body?JSON.stringify(body):undefined});
  const data=await response.json();
  if(!response.ok)throw Object.assign(new Error(data.error||`HTTP ${response.status}`),{status:response.status,data});
  return data;
}
async function register(identity){
  const response=await fetch(`${base}/friends/register`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(identity)});
  assert.equal(response.status,200);
}

const first=makeIdentity(),second=makeIdentity();
try{
  await register(first);await register(second);
  await call(first,'/friends/profile',{method:'POST',body:{nickname:'Dino A'}});
  await call(second,'/friends/profile',{method:'POST',body:{nickname:'Dino B'}});
  const {code}=await call(first,'/friends/code',{method:'POST'});
  await call(second,'/friends/accept',{method:'POST',body:{code}});
  assert.deepEqual((await call(first,'/friends/list')).friends,[second.device]);
  assert.deepEqual((await call(second,'/friends/list')).friends,[first.device]);
  await call(first,'/friends/account',{method:'DELETE'});
  assert.deepEqual((await call(second,'/friends/list')).friends,[]);
  await assert.rejects(()=>call(first,'/friends/list'),error=>error.status===401);
  console.log(`DinoPlay: eliminação do perfil e remoção bilateral das amizades validadas em ${base}.`);
}finally{
  for(const identity of [first,second]){
    try{await call(identity,'/friends/account',{method:'DELETE'})}catch{}
  }
}
