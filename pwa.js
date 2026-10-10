'use strict';
window.lucide?.createIcons({attrs:{width:18,height:18}});
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope:'./',updateViaCache:'none'})
      .catch(() => { /* Online classroom use remains available if caching is blocked. */ });
  });
}
