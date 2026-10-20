/* ---------- 多語系 ----------
 * 原文是繁體中文。其他語言由兩部分組成（見 src/lang-*.js）：
 *   1. 內容包：章節內文、練習題、名詞表、階段名稱（含 HTML 與名詞比對，整份替換）
 *   2. 片語字典：介面與互動圖上的其他文字。畫面產生後即時翻譯；數字先換成 {0}、{1}… 再查表
 * 查不到的片語保留中文，並記在 window.__i18nMiss（網址加 ?i18ndebug 時會列在主控台）。
 */
const LANGS = [['zh-TW', '繁體中文'], ['en', 'English']];
const I18N = { lang: 'zh-TW', packs: {} };
(() => {
  let l = null;
  try { l = new URLSearchParams(location.search).get('lang') || localStorage.getItem('biostat-ladder:lang'); } catch (e) { /* 無法讀取時用瀏覽器語言 */ }
  if (!l || !LANGS.some(x => x[0] === l)) l = /^zh/i.test(navigator.language || '') ? 'zh-TW' : 'en';
  I18N.lang = l;
})();
const isZh = () => I18N.lang === 'zh-TW';
const pack = () => I18N.packs[I18N.lang] || null;
function setLang(l) {
  try { localStorage.setItem('biostat-ladder:lang', l); } catch (e) { /* 私密模式 */ }
  const u = new URL(location.href); u.searchParams.delete('lang'); location.href = u.toString();
}

// 原始（中文）名詞表：名詞對應（WTERM）與名詞圖解（TFIG）用中文名詞當鍵
const GLOSS_ZH = GLOSS.map(g => [g[0], g[1].slice(), g[2], g[3]]);

// 套用內容包：在 QD 合併練習題之後、boot() 之前呼叫
function applyContentPack() {
  const P = pack(); if (!P) return;
  document.documentElement.lang = P.htmlLang || I18N.lang;
  (P.levels || []).forEach((v, i) => { if (LEVELS[i] && v) Object.assign(LEVELS[i], v); });
  for (const c of CH) {
    const t = P.ch && P.ch[c.id]; if (!t) continue;
    ['title', 'body', 'wtitle', 'refs'].forEach(k => { if (t[k] != null) c[k] = t[k]; });
    if (t.quiz) c.quiz = c.quiz.map((q, i) => { const e = t.quiz[i]; if (!e) return q; const demo = q.demo ? { ...q.demo, look: e.look ?? q.demo.look } : q.demo; return { ...q, q: e.q ?? q.q, o: e.o ?? q.o, why: e.why ?? q.why, demo }; });
    if (t.labs && c.labs) c.labs = c.labs.map((l, i) => ({ ...l, label: t.labs[i] ?? l.label }));
  }
  if (P.gloss) GLOSS.forEach((g, i) => { const e = P.gloss[GLOSS_ZH[i][0]]; if (e) { g[0] = e[0]; g[1] = e[1] || []; g[2] = e[2]; } });
}

// ---------- 片語翻譯 ----------
const CJK_RE = /[㐀-鿿、-〿＀-￯]/;  // 不含全形空白：只有全形空白的字串不需翻譯
// 數字與英文字（欄位名稱、方法名稱）都換成佔位符，讓同一句型只需翻譯一次
const NUM_RE = /[−-]?\d+(?:[.,]\d+)*|[A-Za-z_][A-Za-z0-9_]*/g;
let FRAG = null;
function fragTable() {
  if (FRAG) return FRAG;
  const P = pack(), m = new Map();
  GLOSS_ZH.forEach((g, i) => { if (CJK_RE.test(g[0])) m.set(g[0], GLOSS[i][0]); });
  Object.entries((P && P.frag) || {}).forEach(([k, v]) => m.set(k, v));
  FRAG = [...m.entries()].sort((a, b) => b[0].length - a[0].length);
  return FRAG;
}
function trPhrase(s) {
  const P = pack(); if (!P || !CJK_RE.test(s)) return s;
  const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0], core = s.trim(), nums = [];
  const key = core.replace(NUM_RE, m => `{${nums.push(m) - 1}}`);
  let out = P.ph && P.ph[key];
  if (out == null && P.ph && P.ph[core] != null) out = P.ph[core];
  else if (out != null) out = out.replace(/\{(\d+)\}/g, (_, i) => nums[+i] ?? '');
  if (out == null) {
    // 查不到整句：用名詞與常用片段逐段替換
    out = core; for (const [z, e] of fragTable()) if (out.includes(z)) out = out.split(z).join(e);
    out = out.replace(/([A-Za-z0-9)])(?=[A-Za-z(])/g, '$1').replace(/\s+([，。])/g, '$1').replace(/，/g, ', ').replace(/。/g, '. ').replace(/：/g, ': ').replace(/（/g, ' (').replace(/）/g, ')').replace(/、/g, ', ');
    if (/[\u3400-\u9fff]/.test(out)) { (window.__i18nMiss = window.__i18nMiss || new Set()).add(key); }
  }
  return lead + out + tail;
}
// 只在內容真的改變時才寫回，避免部分漏譯的文字一再觸發 MutationObserver 而無限循環
// 也記住譯出的字串：部分漏譯（仍含中文）的結果不再拿去二次翻譯
const TR_OUT = new Set();
function trOnce(v) { if (!CJK_RE.test(v) || TR_OUT.has(v)) return v; const t = trPhrase(v); TR_OUT.add(t); return t; }
function setText(n) { const v = n.nodeValue, t = trOnce(v); if (t !== v) n.nodeValue = t; }
const TR_ATTRS = ['aria-label', 'title', 'placeholder'];
function trNode(root) {
  if (isZh() || !root) return;
  if (root.nodeType === 3) { setText(root); return; }
  if (root.nodeType !== 1) return;
  if (root.closest && root.closest('[data-notr]')) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (CJK_RE.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest('[data-notr], script, style')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
  const list = []; while (w.nextNode()) list.push(w.currentNode);
  list.forEach(setText);
  const els = root.querySelectorAll ? [root, ...root.querySelectorAll('[aria-label], [title], [placeholder]')] : [root];
  els.forEach(e => TR_ATTRS.forEach(a => { const v = e.getAttribute && e.getAttribute(a); if (v) { const t = trOnce(v); if (t !== v) e.setAttribute(a, t); } }));
}
function startTranslator() {
  if (isZh()) return;
  trNode(document.body); if (CJK_RE.test(document.title)) document.title = trPhrase(document.title);
  new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') trNode(m.target); else m.addedNodes.forEach(trNode); } }).observe(document.body, { childList: true, subtree: true, characterData: true });
  if (/i18ndebug/.test(location.search)) setInterval(() => { if (window.__i18nMiss && window.__i18nMiss.size) console.log('i18n miss', [...window.__i18nMiss]); }, 5000);
}
// 語言切換選單（頁首）
function langMenuHTML() { return `<label class="lang" data-notr><span class="sr">Language</span><select id="langSel" aria-label="Language">${LANGS.map(([k, v]) => `<option value="${k}"${k === I18N.lang ? ' selected' : ''}>${v}</option>`).join('')}</select></label>`; }
