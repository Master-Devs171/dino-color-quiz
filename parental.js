(()=>{
  'use strict';
  const KEY='dinoPlayParentalV2',encoder=new TextEncoder();
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=value=>localStorage.setItem(KEY,JSON.stringify(value));
  const bytesToHex=bytes=>[...bytes].map(value=>value.toString(16).padStart(2,'0')).join('');
  const randomHex=size=>{const bytes=new Uint8Array(size);crypto.getRandomValues(bytes);return bytesToHex(bytes)};
  async function digest(value,salt){const bytes=await crypto.subtle.digest('SHA-256',encoder.encode(`${salt}:${value}`));return bytesToHex(new Uint8Array(bytes))}
  const validPin=pin=>/^\d{4,6}$/.test(String(pin||''));
  async function setup(pin){if(!validPin(pin))throw new Error('invalid-pin');const salt=randomHex(16),recovery=`${randomHex(2)}-${randomHex(2)}-${randomHex(2)}`.toUpperCase();write({salt,pinHash:await digest(pin,salt),recoveryHash:await digest(recovery,salt),failed:0,lockedUntil:0,createdAt:Date.now()});return recovery}
  async function verify(value,recovery=false){const state=read(),now=Date.now();if(!state.pinHash)return false;if(!recovery&&state.lockedUntil>now)throw Object.assign(new Error('locked'),{retryAfter:state.lockedUntil-now});const expected=recovery?state.recoveryHash:state.pinHash,ok=(await digest(String(value||'').trim().toUpperCase(),state.salt))===expected;if(ok){state.failed=0;state.lockedUntil=0;write(state);return true}if(!recovery){state.failed=(state.failed||0)+1;if(state.failed>=5){state.failed=0;state.lockedUntil=now+60000}write(state)}return false}
  async function change(current,next){if(!await verify(current))throw new Error('incorrect-pin');return setup(next)}
  function status(){const state=read();return {configured:Boolean(state.pinHash),lockedUntil:state.lockedUntil||0}}
  window.DinoPlayParental=Object.freeze({status,setup,verify,change,validPin});
})();
