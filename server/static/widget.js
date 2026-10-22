(function () {
  'use strict';
  const root = document.createElement('div');
  root.innerHTML = '<button aria-label="Tư vấn AI" data-snus-open>✨</button><section hidden><header>Tư vấn Snus Sài Gòn <button data-snus-close>×</button></header><div data-snus-log></div><form><input aria-label="Tin nhắn" autocomplete="off" maxlength="2000"><button>Gửi</button></form></section>';
  document.body.appendChild(root);
  const style = document.createElement('style'); style.textContent = '[data-snus-open]{position:fixed;right:20px;bottom:20px;z-index:9999;border:0;border-radius:50%;width:56px;height:56px;background:#111;color:#fff;font-size:24px;box-shadow:0 4px 18px #0004}section{position:fixed;right:20px;bottom:88px;z-index:9999;width:min(360px,calc(100vw - 32px));height:500px;background:#fff;border:1px solid #ddd;border-radius:16px;box-shadow:0 8px 30px #0003;display:flex;flex-direction:column;overflow:hidden}section[hidden]{display:none}header{padding:14px;background:#111;color:#fff;font-weight:600}header button{float:right;background:none;color:#fff;border:0;font-size:20px}[data-snus-log]{padding:12px;overflow:auto;flex:1;white-space:pre-wrap;font:14px/1.45 system-ui}form{display:flex;border-top:1px solid #ddd}input{flex:1;padding:12px;border:0;outline:0}form button{padding:0 14px;border:0;background:#111;color:#fff}'; document.head.appendChild(style);
  const panel = root.querySelector('section'), launcher = root.querySelector('[data-snus-open]'), log = root.querySelector('[data-snus-log]'), input = root.querySelector('input');
  function add(text, who) { const p = document.createElement('p'); p.textContent = (who ? 'Bạn: ' : 'Em: ') + text; log.appendChild(p); log.scrollTop = log.scrollHeight; }
  function open() { panel.hidden = false; input.focus(); }
  root.querySelector('[data-snus-open]').onclick = open;
  window.SnusChat = { open: open };
  if (document.currentScript && document.currentScript.dataset.launcher === 'off') launcher.hidden = true;
  if (window.__snusChatOpen) { open(); window.__snusChatOpen = false; }
  root.querySelector('[data-snus-close]').onclick = () => { panel.hidden = true; };
  root.querySelector('form').onsubmit = async (e) => { e.preventDefault(); const message = input.value.trim(); if (!message) return; input.value = ''; add(message, true); const r = await fetch('/chat/api/message', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({message, history:[]}) }); const reader = r.body.getReader(), decoder = new TextDecoder(), chunks=[]; while(true){const x=await reader.read(); if(x.done)break; chunks.push(decoder.decode(x.value,{stream:true}));} const match=chunks.join('').match(/"text":"((?:\\.|[^"\\])*)"/); add(match ? JSON.parse('"'+match[1]+'"') : 'Dạ hệ thống đang bận, anh/chị thử lại sau ạ.'); };
}());
