(()=>{
'use strict';
const STORAGE_KEY='dinoPlayPlatformV1';
const API='https://dinoplay-multiplayer.dinoplay-multiplayer.workers.dev';
const POLICY=Object.freeze({maxPlayers:5,onlineDefault:false,privateInvitesOnly:true,hostApprovalRequired:true,chatAllowed:false,publicRoomsAllowed:false,accountsRequired:false});
function read(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}}
function write(value){localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}
function onlineEnabled(){return read().onlineMultiplayerEnabled===true}
function setOnlineEnabled(enabled){const settings=read();settings.onlineMultiplayerEnabled=enabled===true;write(settings);window.dispatchEvent(new CustomEvent('dinoplay-parent-settings',{detail:{onlineMultiplayerEnabled:settings.onlineMultiplayerEnabled}}));return settings.onlineMultiplayerEnabled}
function random(size,chars='abcdefghijklmnopqrstuvwxyz0123456789'){const bytes=crypto.getRandomValues(new Uint8Array(size));return Array.from(bytes,b=>chars[b%chars.length]).join('')}
function identity(){const settings=read();if(!/^[a-z0-9]{20}$/.test(settings.multiplayerDeviceId||''))settings.multiplayerDeviceId=random(20);if(!/^[A-Za-z0-9_-]{40,80}$/.test(settings.multiplayerDeviceSecret||''))settings.multiplayerDeviceSecret=random(48,'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-');settings.authorizedFriends=Array.isArray(settings.authorizedFriends)?settings.authorizedFriends:[];write(settings);return{device:settings.multiplayerDeviceId,secret:settings.multiplayerDeviceSecret}}
async function api(path,options={}){const id=identity(),response=await fetch(`${API}${path}`,{...options,headers:{'Content-Type':'application/json','X-Dino-Device':id.device,'Authorization':`Bearer ${id.secret}`,...options.headers}});const data=await response.json().catch(()=>({}));if(!response.ok)throw Object.assign(new Error(data.error||'request-failed'),{status:response.status,code:data.error});return data}
async function register(){const id=identity();const response=await fetch(`${API}/friends/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(id)});if(!response.ok)throw new Error('register-failed');return id}
async function syncFriends(){await register();const data=await api('/friends/list');const settings=read();settings.authorizedFriends=data.friends||[];settings.authorizedFriendProfiles=data.profiles||{};settings.childNickname=data.nickname||settings.childNickname||'';write(settings);window.dispatchEvent(new CustomEvent('dinoplay-friends-changed',{detail:{friends:settings.authorizedFriends,profiles:settings.authorizedFriendProfiles}}));return settings.authorizedFriends}
async function setChildNickname(nickname){await register();const data=await api('/friends/profile',{method:'POST',body:JSON.stringify({nickname})});const settings=read();settings.childNickname=data.nickname;write(settings);return data.nickname}
async function createFriendCode(){await register();return api('/friends/code',{method:'POST'})}
async function acceptFriendCode(code){await register();const result=await api('/friends/accept',{method:'POST',body:JSON.stringify({code})});await syncFriends();return result}
async function removeFriend(friendId){await api(`/friends/${friendId}`,{method:'DELETE'});return syncFriends()}
async function openPresence(){await register();const {ticket}=await api('/friends/session',{method:'POST'});return new WebSocket(`${API.replace('https:','wss:')}/play?ticket=${ticket}`)}
function friends(){return read().authorizedFriends||[]}
function friendProfiles(){return read().authorizedFriendProfiles||{}}
function childNickname(){return read().childNickname||''}
function authorize(mode='local'){return mode==='local'||(onlineEnabled()&&friends().length>0)}
function game(gameId){return Object.freeze({gameId,policy:POLICY,onlineEnabled,authorize,maxPlayers:POLICY.maxPlayers,friends,identity})}
window.DinoPlayMultiplayer=Object.freeze({policy:POLICY,onlineEnabled,setOnlineEnabled,authorize,game,identity,friends,friendProfiles,childNickname,setChildNickname,register,syncFriends,createFriendCode,acceptFriendCode,removeFriend,openPresence});
register().then(syncFriends).catch(()=>{});
})();
