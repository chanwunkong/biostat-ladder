/* ---------- 啟動：套用語言、建立語言選單、啟動翻譯與雲端同步 ---------- */
applyContentPack();
(() => {
  const top = document.querySelector('.top-in'); if (top) top.insertAdjacentHTML('beforeend', langMenuHTML());
  const s = document.getElementById('langSel'); if (s) s.onchange = () => setLang(s.value);
})();
boot();
startTranslator();
if (typeof CLOUD !== 'undefined') CLOUD.start();
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && document.querySelector('meta[name="app-site"]')) navigator.serviceWorker.register('./sw.js').catch(() => {});
