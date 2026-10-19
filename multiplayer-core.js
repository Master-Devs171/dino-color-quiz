(()=>{
'use strict';
const STORAGE_KEY='dinoPlayPlatformV1';
const POLICY=Object.freeze({maxPlayers:5,onlineDefault:false,privateInvitesOnly:true,hostApprovalRequired:true,chatAllowed:false,publicRoomsAllowed:false,accountsRequired:false});
function read(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return{}}}
function write(value){localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}
function onlineEnabled(){return read().onlineMultiplayerEnabled===true}
function setOnlineEnabled(enabled){const settings=read();settings.onlineMultiplayerEnabled=enabled===true;write(settings);window.dispatchEvent(new CustomEvent('dinoplay-parent-settings',{detail:{onlineMultiplayerEnabled:settings.onlineMultiplayerEnabled}}));return settings.onlineMultiplayerEnabled}
function authorize(mode='local'){return mode==='local'||onlineEnabled()}
function game(gameId){return Object.freeze({gameId,policy:POLICY,onlineEnabled,authorize,maxPlayers:POLICY.maxPlayers})}
window.DinoPlayMultiplayer=Object.freeze({policy:POLICY,onlineEnabled,setOnlineEnabled,authorize,game});
})();
