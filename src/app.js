/* ---------- 互動元件 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnorm = () => { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
const slider = (id, label, min, max, step, val, unit = '') => `<label class="fld sl"><span>${label}<output id="${id}-o">${val}${unit}</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;

const W = {};
const fitTo = el => { CW = Math.round(Math.max(300, Math.min(760, (el && el.clientWidth) || 640))); };
/* ---------- 狀態 ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('biostat-ladder:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('biostat-ladder:' + k, JSON.stringify(v)); } catch (e) { /* 無法儲存時忽略 */ } },
};
const state = { done: store.get('done', {}), dsId: 'bp_trial', an: 'table1', sels: {}, uploaded: null, labReady: false, pendingRun: true };
const dsCache = {};
function getDS(id) {
  if (id === 'upload') return state.uploaded;
  if (!dsCache[id]) { const m = DATASETS.find(d => d.id === id), g = m.gen(); dsCache[id] = makeDS({ ...m, head: g.head, rows: g.rows }); }
  return dsCache[id];
}
state.sels.table1 = { g: 'group', vars: ['age', 'sex', 'bmi', 'sbp_base', 'sbp_wk12', 'ae'] };

/* ---------- 導覽 ---------- */
function go(t) { if (location.hash === '#' + t) route(t); else location.hash = t; }
function route(t) {
  t = t || 'home';
  const view = t === 'lab' ? 'lab' : t === 'data' ? 'data' : 'course';
  $$('.view').forEach(v => { v.hidden = v.id !== 'v-' + view; });
  $$('.tab, .bt').forEach(b => b.setAttribute('aria-selected', b.dataset.go === (view === 'course' ? 'home' : view)));
  $('#tocBox').classList.remove('open');
  if (view === 'course') { const c = CH.find(c => c.id === t); if (c) renderChapter(c.id); else renderHome(); renderTOC(c ? c.id : null); }
  if (view === 'lab') { renderLab(); if (state.pendingRun) { state.pendingRun = false; runAnalysis(); } }
  if (view === 'data') renderDataPage();
  window.scrollTo(0, 0);
}
function updateProgress() {
  const k = CH.filter(c => state.done[c.id]).length;
  $('#progTxt').textContent = `${k} / ${CH.length} 章`; $('#progBar').style.width = (100 * k / CH.length) + '%';
}
function setDone(id, v) { if (v) state.done[id] = 1; else delete state.done[id]; store.set('done', state.done); updateProgress(); renderTOC(id); }

function renderTOC(cur) {
  $('#toc-list').innerHTML = LEVELS.map(L => `<div class="lv"><p class="lv-h"><span class="glyph">${L.glyph}</span><span>Level ${L.n}　${L.name}</span></p><ol>${CH.filter(c => c.lv === L.n).map(c => `<li><a href="#${c.id}" class="${c.id === cur ? 'cur' : ''} ${state.done[c.id] ? 'done' : ''}"${c.id === cur ? ' aria-current="page"' : ''}><span class="num">${c.num}</span><span>${c.title}</span></a></li>`).join('')}</ol></div>`).join('');
}
function renderHome() {
  const prog = L => { const cs = CH.filter(c => c.lv === L.n); return [cs.filter(c => state.done[c.id]).length, cs.length, cs[0].id]; };
  const next = CH.find(c => !state.done[c.id]);
  $('#article').innerHTML = `<button class="toc-btn" type="button" data-toc>☰ 章節目錄</button><div class="home">
<p class="eyebrow">生物統計自學課程 · 國中數學 → 論文</p>
<h1 class="hero">從平均數到 Cox 模型，<br>一階一階走上去。</h1>
<p class="lede">六個階段、${CH.length} 章。每章有重點說明、可以動手調整的互動圖和小測驗。進階章節直接連到分析實驗室：用內建資料集或你自己的 CSV 實際跑一次分析，點一下結果中的數字，就能在圖上看到它代表的部分。</p>
<div class="cta"><button class="btn pri" type="button" data-go="${next ? next.id : 'c0-1'}">${next && next.id !== 'c0-1' ? `繼續：${next.num} ${next.title}` : '從第一章開始'}</button><button class="btn" type="button" data-go="lab">打開分析實驗室</button></div>
<ol class="ladder">${LEVELS.map(L => { const [d, n, first] = prog(L); return `<li><button type="button" data-go="${first}"><span class="glyph">${L.glyph}</span><span class="lv-t"><span class="lv-n">Level ${L.n}</span><b>${L.name}</b><span class="lv-d">${L.desc}</span></span><span class="lv-p mono">${d}/${n}</span></button></li>`; }).join('')}</ol>
<h2>怎麼使用</h2>
<ul class="how"><li><b>沒有程式基礎也可以。</b>所有計算都在瀏覽器裡完成，不需要安裝軟體，也不用寫程式。</li><li><b>照順序讀。</b>每一階都只用到前面學過的東西。已經會的章節可以直接做小測驗確認。</li><li><b>在實驗室動手做。</b>有「到實驗室動手做」按鈕的章節，會自動載入對應的資料與設定。</li><li><b>用自己的資料。</b>Excel 存成 CSV 後上傳（UTF-8 或 Big5 編碼都可以），資料不會離開你的電腦。</li></ul>
</div>`;
}
/* ---------- 練習題的名詞（定義來自 content.js 的 GLOSS） ---------- */
function termsOf(q) {
  const text = [q.q, ...q.o, q.why, q.demo && q.demo.look].filter(Boolean).join(' '), hits = [];
  GLOSS.forEach((g, gi) => { const pos = [g[0], ...g[1]].map(f => text.indexOf(f)).filter(i => i >= 0); if (pos.length) hits.push([Math.min(...pos), gi]); });
  return hits.sort((x, y) => x[0] - y[0]).map(h => h[1]);
}
const termsHTML = q => { const t = termsOf(q); return t.length ? `<div class="terms"><span class="lbl">這題的名詞（點一下看定義）</span><div class="tchips">${t.map(gi => `<button type="button" class="tchip" data-g="${gi}" aria-pressed="false">${esc(GLOSS[gi][0])}</button>`).join('')}</div><div class="tdef" hidden></div></div>` : ''; };
function bindTerms(c) {
  $$('.terms').forEach(box => {
    $$('.tchip', box).forEach(b => {
      b.onclick = () => {
        const on = b.getAttribute('aria-pressed') !== 'true', d = $('.tdef', box), [term, , def, ch] = GLOSS[+b.dataset.g], t = CH.find(x => x.id === ch);
        $$('.tchip', box).forEach(x => x.setAttribute('aria-pressed', String(x === b && on)));
        d.hidden = !on;
        if (on) d.innerHTML = `<b>${esc(term)}</b>　${esc(def)}<span class="tsrc">${ch === c.id ? '本章內容有說明' : `<a href="#${ch}">${t.num} 章「${esc(t.title)}」</a>${CH.indexOf(t) > CH.indexOf(c) ? '會詳細說明' : '學過'}`}</span>`;
      };
    });
  });
}
function renderChapter(id) {
  const i = CH.findIndex(c => c.id === id), c = CH[i], L = LEVELS[c.lv], prev = CH[i - 1], next = CH[i + 1];
  const quiz = c.quiz.map((q, qi) => { const ord = q.o.map((_, k) => k).sort(() => Math.random() - 0.5); return `<div class="q" data-q="${qi}"><p class="q-t"><span class="mono">Q${qi + 1}</span>${esc(q.q)}</p>${termsHTML(q)}${q.demo && c.widget ? `<button type="button" class="demo-btn" data-demo="${qi}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V5M5 9l5-5 5 5" style="fill:none;stroke:currentColor;stroke-width:2"/></svg>在上方圖表示範這題</button>` : ''}<div class="opts">${ord.map(k => `<button type="button" class="opt" data-k="${k}">${esc(q.o[k])}</button>`).join('')}</div><p class="why" hidden></p></div>`; }).join('');
  $('#article').innerHTML = `<div class="ch-top"><p class="eyebrow">Level ${L.n} · ${L.name} · 第 ${c.num} 章</p><button class="toc-btn" type="button" data-toc>☰ 目錄</button></div><h1>${c.title}</h1>
${c.widget ? `<section class="widget-box"><p class="lbl">動手玩 · ${c.wtitle}</p><div class="demo-note" id="demoNote" hidden></div><div class="widget" id="widget"></div></section>` : ''}
<div class="prose">${chRef(c.body)}</div>${c.refs ? `<p class="refs"><span class="lbl">對照教科書</span>${esc(c.refs)}</p>` : ''}
${c.labs ? `<section class="labs"><p class="lbl">到實驗室用真的資料做</p><div class="lab-btns">${c.labs.map((l, k) => `<button class="btn" type="button" data-lab="${k}">${l.label}<span aria-hidden="true">→</span></button>`).join('')}</div></section>` : ''}
${c.quiz.length ? `<section class="quiz"><h2>小測驗</h2>${quiz}</section>` : ''}
<div class="ch-foot"><button class="btn ${state.done[id] ? 'done' : ''}" type="button" id="doneBtn">${state.done[id] ? '已完成 ✓' : '標記為完成'}</button><nav class="pn">${prev ? `<a href="#${prev.id}"><small>上一章</small>${prev.num} ${prev.title}</a>` : '<span></span>'}${next ? `<a href="#${next.id}" class="nx"><small>下一章</small>${next.num} ${next.title}</a>` : ''}</nav></div>`;
  if (c.widget) fitTo($('#widget'));
  if (c.widget) { W[c.widget]($('#widget')); linkify($('#widget')); }
  $$('[data-lab]').forEach(b => { b.onclick = () => openLab(c.labs[+b.dataset.lab]); });
  $('#doneBtn').onclick = () => { setDone(id, !state.done[id]); const d = !!state.done[id]; $('#doneBtn').textContent = d ? '已完成 ✓' : '標記為完成'; $('#doneBtn').classList.toggle('done', d); };
  bindDemos(c); bindTerms(c);
  const right = new Set();
  $$('.q').forEach(qe => {
    const q = c.quiz[+qe.dataset.q];
    $$('.opt', qe).forEach(b => {
      b.onclick = () => {
        const ok = +b.dataset.k === 0, why = $('.why', qe);
        b.classList.add(ok ? 'right' : 'wrong'); why.hidden = false;
        if (ok) { $$('.opt', qe).forEach(x => { x.disabled = true; }); why.innerHTML = `<b>答對了。</b>${esc(q.why)}`; why.className = 'why ok'; right.add(qe.dataset.q); if (right.size === c.quiz.length && !state.done[id]) { setDone(id, true); $('#doneBtn').textContent = '已完成 ✓'; $('#doneBtn').classList.add('done'); } }
        else { b.disabled = true; why.textContent = '不對，再想想看。'; why.className = 'why no'; }
      };
    });
  });
}

/* ---------- 實驗室 ---------- */
function openLab(l) { state.dsId = l.ds; state.an = l.an; state.sels = { [l.an]: JSON.parse(JSON.stringify(l.sel)) }; state.pendingRun = true; go('lab'); }
const elig = {
  num: c => c.type === 'num' && !/^id$/i.test(c.name),
  cat: c => (c.type === 'cat' && c.nuniq >= 2 && c.nuniq <= 30) || (c.type === 'num' && c.nuniq >= 2 && c.nuniq <= 10),
  bin: c => c.nuniq === 2,
  any: c => c.nuniq >= 2 && !/^id$/i.test(c.name) && !(c.type === 'cat' && c.nuniq > 30),
};
function eligible(ds, f) { return ds ? ds.cols.filter(elig[f.t]).map(c => c.name) : []; }
function ensureSel() {
  const ds = getDS(state.dsId), spec = AN[state.an], sel = state.sels[state.an] || (state.sels[state.an] = {}), used = new Set();
  spec.fields.forEach(f => {
    if (f.t === 'value') { if (sel[f.k] === undefined || sel[f.k] === '') sel[f.k] = f.def; return; }
    if (f.t === 'text') { if (sel[f.k] === undefined) sel[f.k] = f.def || ''; return; }
    if (f.t === 'check') { if (sel[f.k] === undefined) sel[f.k] = !!f.def; return; }
    const el = eligible(ds, f);
    if (f.multi) { if (!sel[f.k]) sel[f.k] = f.def === 'all' ? el.filter(n => !used.has(n)) : f.def === 'some' ? el.filter(n => !used.has(n)).slice(0, 8) : []; sel[f.k] = sel[f.k].filter(n => el.includes(n)); }
    else { if (!el.includes(sel[f.k])) sel[f.k] = f.opt ? '' : el.find(n => !used.has(n)) || ''; if (sel[f.k]) used.add(sel[f.k]); }
  });
  return sel;
}
function renderLab() {
  const opts = DATASETS.map(d => `<option value="${d.id}">${d.name}（${d.tag}）</option>`).join('') + (state.uploaded ? `<option value="upload">你的資料：${esc(state.uploaded.name)}</option>` : '');
  $('#dsSel').innerHTML = opts; $('#dsSel').value = state.dsId;
  renderDsInfo(); renderAnList(); renderForm();
}
function renderDsInfo() {
  const ds = getDS(state.dsId), meta = DATASETS.find(d => d.id === state.dsId);
  $('#dsInfo').innerHTML = `<p class="ds-d">${esc(ds.desc)}</p><p class="mono small">${ds.n} 列 × ${ds.cols.length} 欄${meta ? ' · 模擬資料' : ''}</p>
<p class="small mut">欄位類型（點一下可把數值欄改成類別，例如以 1/2/3 編碼的分期）</p><div class="chips">${ds.cols.map((c, j) => `<button type="button" class="chip ${c.type}" data-col="${j}" ${c.orig === 'cat' ? 'disabled' : ''} title="${c.type === 'num' ? '數值' : '類別'}${c.nmiss ? `，缺失 ${c.nmiss}` : ''}">${esc(c.name)}<small>${c.type === 'num' ? '數值' : '類別'}</small></button>`).join('')}</div>
${Object.keys(ds.codebook || {}).length ? `<details class="cb"><summary>編碼簿</summary><dl>${Object.entries(ds.codebook).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details>` : ''}`;
  $$('#dsInfo .chip').forEach(b => { b.onclick = () => { const c = ds.cols[+b.dataset.col]; c.type = c.type === 'num' ? 'cat' : 'num'; renderDsInfo(); renderForm(); renderPreview(); }; });
  renderPreview();
}
function renderPreview() {
  const ds = getDS(state.dsId), k = Math.min(8, ds.n), cols = ds.cols.slice(0, 24);
  $('#preview').innerHTML = `<details class="pv" open><summary>資料預覽：前 ${k} 列${ds.cols.length > 24 ? `、前 24 欄（共 ${ds.cols.length} 欄）` : ''}</summary><div class="tbl-wrap"><table class="st mini"><thead><tr>${cols.map(c => `<th>${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: k }, (_, i) => `<tr>${cols.map(c => `<td>${c.values[i] === null ? '<span class="na">NA</span>' : esc(c.values[i])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`;
}
function renderAnList() {
  $('#anList').innerHTML = Object.entries(AN).map(([k, a]) => `<button type="button" class="an ${k === state.an ? 'on' : ''}" data-an="${k}" aria-pressed="${k === state.an}"><b>${a.name}</b><span>${a.when}</span></button>`).join('');
  $$('#anList .an').forEach(b => { b.onclick = () => { state.an = b.dataset.an; renderAnList(); renderForm(); if (AN[state.an].nodata) runAnalysis(true); else if (innerWidth < 960) $('#form').closest('.pane').scrollIntoView({ behavior: 'smooth', block: 'start' }); }; });
}
function renderForm() {
  const ds = getDS(state.dsId), spec = AN[state.an], sel = ensureSel();
  if (spec.nodata) { $('#form').innerHTML = '<p class="small mut">這項工具不需要資料集，直接在右側輸入參數。</p>'; $('#runBtn').hidden = true; return; }
  $('#runBtn').hidden = false;
  $('#form').innerHTML = spec.fields.map(f => {
    if (f.t === 'value') return `<label class="fld"><span>${f.label}</span><input id="f-${f.k}" data-k="${f.k}" type="number" inputmode="decimal" step="any" value="${esc(sel[f.k])}"></label>`;
    if (f.t === 'check') return `<label class="tog"><input id="f-${f.k}" data-k="${f.k}" type="checkbox" ${sel[f.k] ? 'checked' : ''}> ${f.label}</label>`;
    if (f.t === 'text') return `<label class="fld"><span>${f.label}</span><input id="f-${f.k}" data-k="${f.k}" type="text" value="${esc(sel[f.k] ?? '')}" placeholder="${esc(f.ph || '')}"></label>`;
    const el = eligible(ds, f);
    if (f.multi) {
      const cur = sel[f.k] || [];
      return `<fieldset class="fld multi"><legend>${f.label}</legend><div class="mini-acts"><button type="button" data-all="${f.k}">全選</button><button type="button" data-none="${f.k}">清除</button></div><div class="checks">${el.length ? el.map((n, i) => `<label><input type="checkbox" id="f-${f.k}-${i}" data-k="${f.k}" value="${esc(n)}" ${cur.includes(n) ? 'checked' : ''}><span>${esc(n)}</span>${cur.includes(n) && cur.indexOf(n) === 0 && /主要/.test(f.label) ? '<em>主要</em>' : ''}</label>`).join('') : '<p class="small mut">沒有符合類型的欄位。</p>'}</div></fieldset>`;
    }
    return `<label class="fld"><span>${f.label}</span><select id="f-${f.k}" data-k="${f.k}">${f.opt ? '<option value="">（不選）</option>' : ''}${el.map(n => `<option value="${esc(n)}" ${sel[f.k] === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>`;
  }).join('');
  $$('#form select').forEach(s => { s.onchange = () => { sel[s.dataset.k] = s.value; }; });
  $$('#form input[type=number], #form input[type=text]').forEach(s => { s.onchange = () => { sel[s.dataset.k] = s.value; }; });
  $$('#form input[type=checkbox][id^="f-"]').forEach(s => { if (!s.dataset.k || spec.fields.find(f => f.k === s.dataset.k && f.t === 'check')) s.onchange = () => { sel[s.dataset.k] = s.checked; }; });
  $$('#form .checks input[type=checkbox]').forEach(cb => { cb.onchange = () => { const a = sel[cb.dataset.k] || (sel[cb.dataset.k] = []); if (cb.checked) { if (!a.includes(cb.value)) a.push(cb.value); } else a.splice(a.indexOf(cb.value), 1); renderForm(); const n = $('#' + cb.id); if (n) n.focus(); }; });
  $$('[data-all]').forEach(b => { b.onclick = () => { const f = spec.fields.find(x => x.k === b.dataset.all); sel[f.k] = eligible(ds, f); renderForm(); }; });
  $$('[data-none]').forEach(b => { b.onclick = () => { sel[b.dataset.none] = []; renderForm(); }; });
}
/* ---------- 數字與圖連動（SPEC 第二條） ---------- */
const cardHTML = c => `<div data-card="${c.k}" role="button" tabindex="0" aria-pressed="false"><span>${c.l}</span><b>${c.v}</b></div>`;
function applyFocus(root) {
  const k = root._k;
  $$('[data-card]', root).forEach(c => c.setAttribute('aria-pressed', String(c.dataset.card === k)));
  $$('[data-k]', root).forEach(e => { const on = !!k && (e.getAttribute('data-k') || '').split(' ').includes(k); e.classList.toggle('on', on); });
  $$('svg', root).forEach(s => s.classList.toggle('focus', !!k && !!s.querySelector('.on')));
}
function linkify(root, initial) {
  if (root._linked) { applyFocus(root); return; }
  root._linked = true; root._k = initial || root._k || null;
  root.addEventListener('click', e => { const c = e.target.closest('[data-card]'); if (!c || !root.contains(c)) return; root._k = root._k === c.dataset.card ? null : c.dataset.card; applyFocus(root); });
  root.addEventListener('keydown', e => { const c = e.target.closest('[data-card]'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); c.click(); } });
  new MutationObserver(() => applyFocus(root)).observe(root, { childList: true, subtree: true });
  applyFocus(root);
}
const tableHTML = (t, open) => `<div class="tbl-wrap${t.scroll ? ' tall' : ''}"><table class="st"><thead><tr>${t.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => (Array.isArray(r) ? `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>` : `<tr class="${r.cls || ''}"${r.k ? ` data-card="${r.k}" data-k="${r.k}" tabindex="0"` : ''}>${r.cells.map(x => `<td>${x}</td>`).join('')}</tr>`)).join('')}</tbody></table></div>${t.foot ? `<p class="tfoot">${t.foot}</p>` : ''}`;
const figHTML = c => `<figure class="fig"><div class="chart-wrap">${c.svg}</div>${c.legend || ''}${c.cap ? `<figcaption>${c.cap}</figcaption>` : ''}</figure>${c.after || ''}`;
function runAnalysis(scroll) {
  const ds = getDS(state.dsId), spec = AN[state.an], out = $('#result');
  CW = Math.round(Math.max(300, Math.min(760, out.clientWidth - (innerWidth < 560 ? 34 : 46))));
  let res;
  try { res = spec.run(ds, ensureSel()); }
  catch (e) { out.innerHTML = `<div class="res"><p class="callout err"><b>無法執行：</b>${esc(e.message)}</p></div>`; return; }
  let h = `<div class="res" id="res-root"><header class="res-h"><p class="eyebrow">${spec.name}${spec.nodata ? '' : ' · ' + esc(ds.name)}</p><h2>${res.title}</h2><p class="mono small mut">${res.meta}</p>${res.facts && res.facts.length ? `<ul class="facts">${res.facts.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}</header>`;
  if (res.table1) {
    h += `<p class="hint">點表格中的一個變數，下方會畫出它的分佈。</p>${tableHTML(res.table1)}<div class="picks">${res.picks.map(p => `<div class="pick" data-k="${p.k}">${figHTML(p)}</div>`).join('')}</div>`;
  }
  (res.charts || []).forEach(c => { h += figHTML(c); });
  if (res.cards && res.cards.length) h += `<section class="cards-sec"><p class="hint">點一下數字，圖上會亮出它對應的部分。</p><div class="kv cards">${res.cards.map(cardHTML).join('')}</div></section>`;
  if (res.html) h += res.html;
  if (res.write) {
    const blk = (lang, w) => `<div class="wr" data-lang="${lang}" ${lang === 'en' ? 'hidden' : ''}>${[['m', lang === 'zh' ? '統計方法' : 'Statistical analysis'], ['r', lang === 'zh' ? '結果' : 'Results']].map(([k, t]) => `<div class="wr-p"><div class="wr-h"><span class="lbl">${t}</span><button type="button" class="copy" data-copy="wr-${lang}-${k}">複製</button></div><p id="wr-${lang}-${k}">${esc(w[k])}</p></div>`).join('')}</div>`;
    h += `<section class="write"><div class="write-h"><h3>數字的標準寫法</h3><div class="seg" role="tablist"><button type="button" data-lang="zh" aria-selected="true">中文</button><button type="button" data-lang="en" aria-selected="false">English</button></div></div>${blk('zh', res.write.zh)}${blk('en', res.write.en)}</section>`;
  }
  if (res.tables && res.tables.length) h += `<details class="more"><summary>完整統計表</summary>${res.tables.map(t => tableHTML(t)).join('')}</details>`;
  const defs = [...new Set((res.cards || []).map(c => c.d).filter(Boolean))];
  if (defs.length) h += `<details class="more"><summary>每個數字怎麼算</summary><dl class="defs">${defs.map(d => `<div><dt>${{ mean: '平均', sd: '標準差', median: '中位數', iqr: '四分位距', diff: '平均差', ci: '95% 信賴區間', t: 't', p: 'p 值', d: "Cohen's d", U: 'Mann–Whitney', V: 'Wilcoxon 符號等級', F: 'F', eta2: 'η²', H: 'Kruskal–Wallis', welchF: 'Welch ANOVA', levene: 'Levene 檢定與 Q-Q 圖', cldDef: 'Tukey 字母標記', mainEff: '主效果', interEff: '交互作用', blockDef: '區集 ANOVA', rmDef: '重複測量 ANOVA', ggDef: 'Greenhouse–Geisser 校正', friedDef: 'Friedman 檢定', adjMean: '校正後平均', gmr: '幾何平均數比', rdDef: '風險差', mcDef: 'McNemar 檢定', kapDef: 'Cohen κ', cookDef: 'Cook 距離', rateRatio: '率比', dispDef: '離散度', baDef: 'Bland–Altman', parallel: '斜率平行性檢定', chi2: 'χ²', minexp: '期望次數', cv: "Cramér's V", or: '勝算比', rr: '風險比', prop: '比例', fisher: 'Fisher 精確檢定', r: 'Pearson r', rho: 'Spearman ρ', r2: 'R²', slope: '斜率', sigma: '殘差標準誤', beta: '迴歸係數 β', OR: '勝算比（模型）', auc: 'AUC', lr: '概似比 χ²', hr: '危險比', medsurv: '中位存活時間', surv: '存活率', logrank: 'Log-rank χ²', sig: '未校正', q: 'BH q 值', bonf: 'Bonferroni' }[d] || d}</dt><dd>${DEF[d]}</dd></div>`).join('')}</dl></details>`;
  out.innerHTML = h + '</div>';
  const root = $('#res-root'); linkify(root, res.table1 && res.picks.length ? res.picks[0].k : null);
  if (scroll === true && innerWidth < 960) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (res.mount) { fitTo($('#' + res.mount)); W.power($('#' + res.mount)); linkify($('#' + res.mount)); }
  $$('.write .seg button', out).forEach(b => { b.onclick = () => { $$('.write .seg button', out).forEach(x => x.setAttribute('aria-selected', x === b)); $$('.wr', out).forEach(w => { w.hidden = w.dataset.lang !== b.dataset.lang; }); }; });
  $$('.copy', out).forEach(b => { b.onclick = () => { const p = $('#' + b.dataset.copy), done = () => { b.textContent = '已複製'; setTimeout(() => { b.textContent = '複製'; }, 1500); }; const sel = () => { const r = document.createRange(); r.selectNodeContents(p); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = '已選取，請按 Ctrl/⌘ + C'; }; try { navigator.clipboard.writeText(p.textContent).then(done, sel); } catch (e) { sel(); } }; });
}
function loadUploaded(ds) {
  state.uploaded = ds; state.dsId = 'upload'; state.an = 'table1'; state.sels = {}; renderLab();
  const m = $('#upMsg'); m.hidden = false; m.className = 'msg ok'; m.textContent = `已載入 ${ds.n} 列 × ${ds.cols.length} 欄。請檢查下方欄位類型是否正確。`;
  runAnalysis();
}
function upErr(msg) { const m = $('#upMsg'); m.hidden = false; m.className = 'msg err'; m.textContent = msg; }
function setupLab() {
  $('#dsSel').onchange = e => { state.dsId = e.target.value; state.an = 'table1'; state.sels = {}; renderLab(); runAnalysis(); };
  $('#runBtn').onclick = () => runAnalysis(true);
  $('#pasteTog').onclick = () => { $('#pasteBox').hidden = !$('#pasteBox').hidden; };
  $('#pasteGo').onclick = () => { try { const t = $('#pasteTxt').value; if (!t.trim()) return upErr('請先貼上資料。'); loadUploaded(dsFromText('貼上的資料', t)); } catch (e) { upErr(e.message); } };
  $('#upFile').onchange = e => {
    const f = e.target.files[0]; if (!f) return; if (f.size > 20e6) return upErr('檔案超過 20 MB，請先篩選需要的欄位或列。');
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const buf = rd.result; let text = new TextDecoder('utf-8').decode(buf);
        if ((text.match(/\uFFFD/g) || []).length > 0) { try { const b5 = new TextDecoder('big5').decode(buf); if ((b5.match(/\uFFFD/g) || []).length < (text.match(/\uFFFD/g) || []).length) text = b5; } catch (x) { /* 瀏覽器不支援 Big5 時沿用 UTF-8 */ } }
        loadUploaded(dsFromText(f.name, text));
      } catch (x) { upErr(x.message); }
    };
    rd.onerror = () => upErr('無法讀取檔案。'); rd.readAsArrayBuffer(f); e.target.value = '';
  };
}

/* ---------- 資料集頁 ---------- */
function renderDataPage() {
  if ($('#dataGrid').dataset.ready) return; $('#dataGrid').dataset.ready = 1;
  $('#dataGrid').innerHTML = DATASETS.map(m => { const g = m.gen(); return `<article class="dcard"><p class="eyebrow">${m.tag} · ${m.track}</p><h3>${m.name}</h3><p>${m.desc}</p><p class="mono small">${g.rows.length} 列 × ${g.head.length} 欄</p><p class="small"><b>適合練習：</b>${m.uses.join('、')}</p><details class="cb"><summary>編碼簿</summary><dl>${Object.entries(m.codebook).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details><button type="button" class="btn" data-open="${m.id}">在實驗室開啟 →</button></article>`; }).join('');
  $$('[data-open]').forEach(b => { b.onclick = () => openLab({ ds: b.dataset.open, an: 'table1', sel: {} }); });
}

/* ---------- 啟動 ---------- */
function boot() {
  $$('[data-go]').forEach(b => { if (!b.closest('#article')) b.onclick = () => go(b.dataset.go); });
  $('#article').addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
  $('#article').addEventListener('click', e => { if (e.target.closest('[data-toc]')) { $('#tocBox').classList.add('open'); const cur = $('#toc-list .cur'); if (cur) cur.scrollIntoView({ block: 'center' }); } });
  $('#tocClose').onclick = () => $('#tocBox').classList.remove('open');
  let lw = innerWidth, rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (Math.abs(innerWidth - lw) > 80) { lw = innerWidth; const h = location.hash.slice(1); if (CH.find(c => c.id === h)) renderChapter(h); else if (h === 'lab' && $('#result .res')) runAnalysis(); } }, 300); });
  setupLab(); updateProgress();
  addEventListener('hashchange', () => route(location.hash.slice(1)));
  route(location.hash.slice(1));
}
