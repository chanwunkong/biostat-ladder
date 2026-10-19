/* ---------- 每章的互動圖 ---------- */
const sv = (id, fmt) => { const v = +$('#' + id).value, o = $('#' + id + '-o'); if (o) o.textContent = fmt ? fmt(v) : v; return v; };
const kvs = items => items.map(([l, v, k]) => (k ? cardHTML({ k, l, v }) : `<div><span>${l}</span><b>${v}</b></div>`)).join('');
const std = a => { const m = S.mean(a), s = S.sd(a); return a.map(v => (v - m) / s); };
const tpdf = (x, df) => Math.exp(S.lgamma((df + 1) / 2) - S.lgamma(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + x * x / df, -(df + 1) / 2);
const segBind = (el, sel, fn) => $$(sel + ' button', el).forEach(b => { b.onclick = () => { $$(sel + ' button', el).forEach(x => x.setAttribute('aria-selected', x === b)); fn(b); }; });
const SRC_NOTE = '<p class="w-src">資料：<a href="#data">貫穿課程的多中心降血壓試驗</a>（模擬，8 間醫院 400 人）</p>';
const HOSP_OPTS = sel => ['全部', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'].map(h => `<option value="${h === '全部' ? '' : h}"${h === sel ? ' selected' : ''}>${h === '全部' ? '全部醫院' : h}</option>`).join('');
const BIN_VARS = () => { const d = STUDY(); return { diabetes: ['糖尿病', d.diabetes], lvh: ['左心室肥大（超音波）', d.lvh_echo], smoker: ['吸菸', d.smoker], cvd: ['36 個月內心血管事件', d.cvd_event] }; };
const READERS = () => { const d = STUDY(), I = [...Array(d.n).keys()], c = (x, y) => I.filter(i => d.ecg_readA[i] === x && d.ecg_readB[i] === y).length; return { a: c(1, 1), b: c(1, 0), c: c(0, 1), d: c(0, 0) }; };
const HN = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], AGEG = ['40–49', '50–59', '60–69', '70–80'], ageg = a => Math.min(3, Math.floor((a - 40) / 10));
const MODE_SEG = id => `<div class="seg wrap" id="${id}"><button type="button" data-m="data" aria-selected="true">研究資料</button><button type="button" data-m="own" aria-selected="false">自己調整</button></div>`;
function people(total, hit, c, tag = () => '') {
  const cols = 10, s = 22; let g = '';
  for (let i = 0; i < total; i++) { const x = (i % cols) * s + s / 2, y = Math.floor(i / cols) * s * 1.15 + 3, f = i < hit ? c : 'var(--line)'; g += `<g data-k="${tag(i)}"><circle cx="${x}" cy="${y + 4}" r="3.8" style="fill:${f}"/><path d="M${x - 6} ${y + 18}q0-9 6-9t6 9z" style="fill:${f}"/></g>`; }
  return `<svg class="ppl" viewBox="0 0 ${cols * s} ${Math.ceil(total / cols) * s * 1.15 + 2}" role="img" aria-label="${total} 人中 ${hit} 人">${g}</svg>`;
}
function tblHTML(b) { return `<div class="tbl-wrap"><table class="st"><thead><tr>${b.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => { const c = Array.isArray(r) ? r : r.cells; return `<tr class="${Array.isArray(r) ? '' : r.cls || ''}">${c.map(x => `<td>${x}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>`; }
const kmPath = (X, Y, k, c, dash) => { let d = `M${X(0)} ${Y(1)}`; k.steps.slice(1).forEach(p => { d += `H${X(p.t).toFixed(1)}V${Y(p.S).toFixed(1)}`; }); d += `H${X(k.end)}`; return `<path class="keep" d="${d}" style="fill:none;stroke:${c};stroke-width:2.5${dash ? ';stroke-dasharray:6 4' : ''}"/>`; };
const LABP = {
  ttest: { ds: 'bp_trial', an: 'ttest', sel: { y: 'sbp_wk12', g: 'group' } }, paired: { ds: 'bp_trial', an: 'paired', sel: { a: 'sbp_base', b: 'sbp_wk12' } },
  anova: { ds: 'plant_growth', an: 'anova', sel: { y: 'height_cm', g: 'fertilizer' } }, corr: { ds: 'cvd_cohort', an: 'corr', sel: { x: 'age', y: 'sbp' } },
  chisq: { ds: 'cvd_cohort', an: 'chisq', sel: { r: 'smoker', c: 'cvd_10y' } }, logreg: { ds: 'cvd_cohort', an: 'logreg', sel: { y: 'cvd_10y', xs: ['smoker', 'age', 'sex', 'sbp', 'chol', 'diabetes'] } },
  surv: { ds: 'lung_surv', an: 'surv', sel: { time: 'time_months', status: 'status', g: 'treatment', xs: ['treatment', 'stage', 'age'] } },
};

Object.assign(W, {
  rate(el) {
    const d = STUDY(), I = [...Array(d.n).keys()], OUT = { cvd: ['36 個月內發生心血管事件', i => d.cvd_event[i]], ae: ['12 週內至少一次不良事件', i => (d.ae_count[i] > 0 ? 1 : 0)], resp: ['第 12 週收縮壓降 10 mmHg 以上', i => d.responder[i]] };
    el.innerHTML = SRC_NOTE + `<div class="w-row"><label class="fld"><span>事件</span><select id="wr-y">${Object.entries(OUT).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><label class="fld"><span>醫院</span><select id="wr-h">${HOSP_OPTS('全部')}</select></label></div><div class="pp2"><figure><figcaption id="wr-ca"></figcaption><div id="wr-ga"></div></figure><figure><figcaption id="wr-cb"></figcaption><div id="wr-gb"></div></figure></div><p class="w-cap">每張小人圖都換算成 100 人；有顏色的是發生事件的人。</p><div class="kv" id="wr-o"></div>`;
    const up = () => {
      const [lab, f] = OUT[$('#wr-y').value], h = $('#wr-h').value, ix = g => I.filter(i => d.group[i] === g && (!h || d.hospital[i] === h) && f(i) != null), P = ix('placebo'), D = ix('drug'), ea = S.sum(P.map(f)), eb = S.sum(D.map(f));
      const a = 100 * ea / P.length, b = 100 * eb / D.length, ra = Math.round(a), rb = Math.round(b), ard = a - b, py = ix2 => S.sum(ix2.map(i => d.time_months[i])) / 12;
      $('#wr-ca').textContent = `安慰劑組（對照組）${ea}/${P.length} 人`; $('#wr-cb').textContent = `新藥組 ${eb}/${D.length} 人`;
      $('#wr-ga').innerHTML = people(100, ra, 'var(--c1)', i => (i < Math.min(ra, rb) ? 'pa rr rrr' : i < ra ? 'pa ard nnt rr rrr' : '')); $('#wr-gb').innerHTML = people(100, rb, 'var(--c2)', i => (i < Math.min(ra, rb) ? 'pb rr rrr' : i < rb ? 'pb ard nnt rr rrr' : ''));
      const cards = [['安慰劑組事件率', `${F.n(a, 1)}%`, 'pa'], ['新藥組事件率', `${F.n(b, 1)}%`, 'pb'], ['絕對差', `${ard === 0 ? '' : ard > 0 ? '新藥組少 ' : '新藥組多 '}${F.n(Math.abs(ard), 1)} 個百分點`, 'ard'], ['相對變化', a ? `${b < a ? '減少' : '增加'} ${F.n(Math.abs(100 * ard / a), 1)}%` : '—', 'rrr'], ['風險比 RR（新藥 ÷ 安慰劑）', a ? F.n(b / a, 3) : '—', 'rr'], ['需治療人數 NNT', ard ? `${F.n(100 / Math.abs(ard), 1)} 人` : '—', 'nnt']];
      if ($('#wr-y').value === 'cvd') cards.push(['發生率（每 100 人年）', `安慰劑 ${F.n(100 * ea / py(P), 1)}、新藥 ${F.n(100 * eb / py(D), 1)}（${F.n(py(P), 1)} 與 ${F.n(py(D), 1)} 人年）`, 'pa']);
      $('#wr-o').innerHTML = kvs(cards);
    };
    el.addEventListener('change', up); up();
  },
  sigma(el) {
    const d = STUDY(), I = [...Array(d.n).keys()];
    el.innerHTML = SRC_NOTE + `<p class="w-cap">從一間醫院挑出 5 位病人的基線收縮壓 x<sub>1</sub>…x<sub>5</sub>。點是每個 x<sub>i</sub>，紅色虛線是平均 x̄，直線段是離均差 x<sub>i</sub> − x̄。</p><div class="w-row"><label class="fld"><span>醫院</span><select id="ws-h">${HOSP_OPTS('H1').replace('<option value="">全部醫院</option>', '')}</select></label>${slider('ws-k', '第幾組 5 人', 1, 6, 1, 1)}</div><div class="chart-wrap" id="ws-c"></div><p class="formula" id="ws-f"></p><div class="kv" id="ws-o"></div>`;
    const up = () => {
      const h = $('#ws-h').value, k = sv('ws-k'), ix = I.filter(i => d.hospital[i] === h).slice((k - 1) * 5, k * 5), x = ix.map(i => d.sbp_0[i]), sum = S.sum(x), m = sum / 5, dev = x.map(v => v - m), ss = S.sum(dev.map(e => e * e)), [lo, hi] = S.minmax(x);
      $('#ws-c').innerHTML = chart({ xcats: ix.map(i => d.id[i]), y: [lo - 12, hi + 12], h: 250, ylab: '收縮壓（mmHg）' }, (X, Y, { M, iw }) => {
        let g = '';
        x.forEach((v, i) => { const cc = v >= m ? 'var(--c3)' : 'var(--c2)'; g += `<line data-k="ss sd" x1="${X(i)}" x2="${X(i)}" y1="${Y(m)}" y2="${Y(v)}" style="stroke:${cc};stroke-width:4"/><circle data-k="sum" cx="${X(i)}" cy="${Y(v)}" r="7" style="fill:var(--c1)"/><text x="${X(i) + 10}" y="${Y(v)}" dy=".32em" style="fill:var(--ink)">${v}</text><text x="${X(i) + 8}" y="${(Y(m) + Y(v)) / 2}" dy=".32em" style="fill:${cc};font-size:12px">${dev[i] >= 0 ? '+' : ''}${F.n(dev[i], 1)}</text>`; });
        return g + `<line data-k="mean ss sd" x1="${M.l}" x2="${M.l + iw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--c2);stroke-width:2;stroke-dasharray:6 4"/><text x="${M.l + iw}" y="${Y(m) - 6}" text-anchor="end" style="fill:var(--c2)">x̄ = ${F.n(m, 1)}</text>`;
      });
      $('#ws-f').innerHTML = `Σx<sub>i</sub> = ${x.join(' + ')} = <b>${sum}</b><br>x̄ = ${sum} ÷ 5 = <b>${F.n(m, 1)}</b><br>Σ(x<sub>i</sub> − x̄) = ${dev.map(e => F.n(e, 1)).join(' + ').replace(/\+ -/g, '− ')} = <b>0</b>`;
      $('#ws-o').innerHTML = kvs([['Σx', sum, 'sum'], ['x̄', F.n(m, 1), 'mean'], ['Σ(x − x̄)²', F.n(ss, 1), 'ss'], ['標準差 s', F.n(Math.sqrt(ss / 4), 2), 'sd']]);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  log(el) {
    const d = STUDY(), I = [...Array(d.n).keys()], GR = { smoker: ['吸菸者', '不吸菸者', i => d.smoker[i] === 1], diabetes: ['糖尿病', '沒有糖尿病', i => d.diabetes[i] === 1], sex: ['男性', '女性', i => d.sex[i] === 'M'] };
    el.innerHTML = SRC_NOTE + `<h4>資料中的倍數：CRP（發炎指標）</h4><div class="w-row"><label class="fld"><span>比較</span><select id="wl-g">${Object.entries(GR).map(([k, v]) => `<option value="${k}">${v[0]} vs ${v[1]}</option>`).join('')}</select></label></div>
<div class="w-cols"><figure class="fig"><figcaption>一般尺度：CRP 擠在左邊，右邊拖著長尾巴</figcaption><div class="chart-wrap" id="wl-h1"></div></figure><figure class="fig"><figcaption>log₂ 尺度：分佈變得接近對稱</figcaption><div class="chart-wrap" id="wl-h2"></div></figure></div><div class="kv" id="wl-k"></div>
<h4>自己算：倍數與 log₂</h4><div class="w-row"><label class="fld"><span>處理組表現量</span><input id="wl-a" type="number" inputmode="decimal" value="50" step="any"></label><label class="fld"><span>對照組表現量</span><input id="wl-b" type="number" inputmode="decimal" value="200" step="any"></label></div><p class="w-out" id="wl-f"></p>
<figure class="fig"><figcaption>同一組倍數放在一般尺度：下降的點全擠在 0 和 1 之間</figcaption><div class="chart-wrap" id="wl-lin"></div></figure><figure class="fig"><figcaption>放在 log₂ 尺度：上升與下降對稱。橘色是你輸入的倍數</figcaption><div class="chart-wrap" id="wl-lg"></div></figure>`;
    const fc = [1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8], lb = ['1/8', '1/4', '1/2', '1', '2', '4', '8'], cc = v => (v < 1 ? 'var(--c1)' : v > 1 ? 'var(--c2)' : 'var(--ink)');
    const hist = (vals, grp, lo, hi, bins, xlab, gmk) => { const bw = (hi - lo) / bins, cnt = g => { const c = new Array(bins).fill(0); vals.forEach((v, i) => { if (grp[i] !== g) return; const k = Math.min(bins - 1, Math.floor((v - lo) / bw)); if (k >= 0) c[k]++; }); return c; }, c1 = cnt(true), c0 = cnt(false), top = Math.max(...c1, ...c0) * 1.1;
      return chart({ x: [lo, hi], y: [0, top], h: 200, xlab, ylab: '人數' }, (X, Y) => [[c0, 'var(--c1)', 'g0'], [c1, 'var(--c2)', 'g1']].map(([c, col, k]) => c.map((n, i) => `<rect data-k="${k}" x="${X(lo + i * bw)}" y="${Y(n)}" width="${Math.max(0, X(bw) - X(0) - 1)}" height="${Y(0) - Y(n)}" style="fill:${col};fill-opacity:.55"/>`).join('')).join('') + gmk(X, Y, top)); };
    const upData = () => {
      const [l1, l0, f] = GR[$('#wl-g').value], g = I.map(f), gm = v => Math.exp(S.mean(I.filter(i => g[i] === v).map(i => Math.log(d.crp[i])))), a = gm(true), b = gm(false), u = a / b;
      $('#wl-h1').innerHTML = hist(d.crp, g, 0, 16, 32, 'CRP（mg/L）', (X, Y, top) => `<line data-k="gm1 fc" x1="${X(a)}" x2="${X(a)}" y1="${Y(0)}" y2="${Y(top)}" style="stroke:var(--c2);stroke-width:2.5"/><line data-k="gm0 fc" x1="${X(b)}" x2="${X(b)}" y1="${Y(0)}" y2="${Y(top)}" style="stroke:var(--c1);stroke-width:2.5"/>`);
      $('#wl-h2').innerHTML = hist(d.crp.map(Math.log2), g, -3, 5, 32, 'log₂(CRP)', (X, Y, top) => `<line data-k="gm1 lfc" x1="${X(Math.log2(a))}" x2="${X(Math.log2(a))}" y1="${Y(0)}" y2="${Y(top)}" style="stroke:var(--c2);stroke-width:2.5"/><line data-k="gm0 lfc" x1="${X(Math.log2(b))}" x2="${X(Math.log2(b))}" y1="${Y(0)}" y2="${Y(top)}" style="stroke:var(--c1);stroke-width:2.5"/><line class="hlx" data-k="lfc" x1="${X(Math.log2(b))}" x2="${X(Math.log2(a))}" y1="${Y(top * 0.92)}" y2="${Y(top * 0.92)}" style="stroke:var(--ink);stroke-width:3"/>`);
      $('#wl-k').innerHTML = kvs([[`${l1}的 CRP（取對數平均再轉回）`, F.n(a, 2), 'gm1'], [`${l0}的 CRP（取對數平均再轉回）`, F.n(b, 2), 'gm0'], ['倍數變化 FC', F.n(u, 3), 'fc'], ['log₂FC', F.n(Math.log2(u), 3), 'lfc']]);
    };
    const up = () => {
      const a = +$('#wl-a').value, b = +$('#wl-b').value, ok = a > 0 && b > 0, u = ok ? a / b : NaN;
      $('#wl-f').innerHTML = ok ? `倍數變化 FC = ${F.n(u, 3)}　　log<sub>2</sub>FC = <b>${F.n(Math.log2(u), 2)}</b>　（${a === b ? '沒有變化' : `${a > b ? '上升' : '下降'}了 ${F.n(Math.abs(Math.log2(u)), 2)} 次「倍增」`}）` : '請輸入兩個正數。';
      const mk = (X, Y, f, lbf) => fc.map((v, i) => `<circle cx="${X(f(v))}" cy="${Y(0.4)}" r="6" style="fill:${cc(v)}"/><text x="${X(f(v))}" y="${Y(0.4) - 12}" text-anchor="middle" style="fill:${cc(v)}">${lb[i]}</text>`).join('') + (ok && f(u) >= lbf[0] && f(u) <= lbf[1] ? `<path d="M${X(f(u))} ${Y(0.4) + 10}l-6 10h12z" style="fill:var(--c4)"/>` : '');
      $('#wl-lin').innerHTML = chart({ x: [0, 8], y: [0, 1], noY: true, h: 110, xlab: '倍數（一般尺度）' }, (X, Y) => mk(X, Y, v => v, [0, 8]));
      $('#wl-lg').innerHTML = chart({ x: [-3, 3], y: [0, 1], noY: true, h: 110, xlab: 'log₂ 倍數' }, (X, Y) => mk(X, Y, Math.log2, [-3, 3]));
    };
    $('#wl-g', el).addEventListener('change', upData); el.addEventListener('input', e => { if (e.target.id === 'wl-a' || e.target.id === 'wl-b') up(); }); upData(); up();
  },
  types(el) {
    const d = STUDY(), ag = a => ['40–49', '50–59', '60–69', '70–80'][Math.min(3, Math.floor((a - 40) / 10))], P = [0, 1, 2, 3, 4, 5, 6, 7], vs = (f, n = 4) => P.slice(0, n).map(f).join('、');
    const items = [['醫院', vs(i => d.hospital[i * 47]), '名目'], ['基線收縮壓（mmHg）', vs(i => d.sbp_0[i]), '連續'], ['分派組別', '新藥、安慰劑', '名目'], ['12 週內不良事件次數', vs(i => d.ae_count[i + 2]), '計數'], ['BMI（kg/m²）', vs(i => d.bmi[i]), '連續'], ['年齡組', '40–49、50–59、60–69、70–80', '順序'], ['吸菸', '是、否', '名目'], ['追蹤到心血管事件的月數', vs(i => d.time_months[i] + (d.cvd_event[i] ? '' : '+')), '時間至事件'], ['CRP（mg/L）', vs(i => d.crp[i]), '連續'], ['醫師判讀心電圖', '陽性、陰性', '名目']];
    const cats = ['名目', '順序', '連續', '計數', '時間至事件'], why = { 名目: '類別之間沒有順序。', 順序: '類別有高低順序，但間距不一定相等。', 連續: '可以是任何數值（含小數），有單位。', 計數: '只能是 0、1、2… 的整數次數。', 時間至事件: '追蹤到事件發生的時間；「+」代表還沒發生就結束追蹤（設限）。' };
    const cols = [['hospital', '醫院', 'nom', i => d.hospital[i]], ['age', '年齡組', 'ord', i => ag(d.age[i])], ['bmi', 'BMI', 'cont', i => d.bmi[i]], ['ae', '不良事件', 'count', i => d.ae_count[i]], ['t', '月數', 'tte', i => d.time_months[i]], ['e', '事件', 'tte cens', i => d.cvd_event[i]]];
    const table = `<div class="tbl-wrap"><table class="st dt"><thead><tr>${cols.map(c => `<th data-k="${c[2]}">${c[1]}</th>`).join('')}</tr></thead><tbody>${P.slice(0, 6).map(i => `<tr>${cols.map(c => `<td data-k="${c[2]}${c[0] === 'e' && !d.cvd_event[i] ? ' cens' : ''}"${c[0] === 'e' && !d.cvd_event[i] ? ' style="color:var(--c2)"' : ''}>${c[3](i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="w-cap">資料表的前 6 列：每列一位病人、每欄一個變數。紅色的 0 代表追蹤結束時還沒發生事件。</p>`;
    let k = 0; const res = [];
    const draw = () => {
      const it = items[k];
      el.innerHTML = SRC_NOTE + table + `<h4>分類挑戰</h4><div class="dots" aria-hidden="true">${items.map((_, i) => `<i class="${res[i] === true ? 'ok' : res[i] === false ? 'no' : i === k ? 'cur' : ''}"></i>`).join('')}</div>` + (it ? `<div class="vcard"><p class="lbl">第 ${k + 1} / ${items.length} 個變數</p><h4>${it[0]}</h4><div class="vals">${it[1].split('、').map(v => `<span>${v}</span>`).join('')}</div></div><p class="w-cap">這是哪一種變數？</p><div class="choice">${cats.map(c => `<button type="button" class="opt" data-c="${c}">${c}</button>`).join('')}</div><div class="why" id="wt-why" hidden></div>` : `<div class="vcard"><h4>答對 ${res.filter(Boolean).length} / ${items.length}</h4><p>${res.every(Boolean) ? '全部答對。' : '錯的題目再挑戰一次吧。'}</p><button class="btn" type="button" id="wt-re">重來一次</button></div>`);
      $$('[data-c]', el).forEach(b => { b.onclick = () => { if (res[k] !== undefined) return; const ok = b.dataset.c === it[2]; res[k] = ok; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) $(`[data-c="${it[2]}"]`, el).classList.add('right'); const ww = $('#wt-why', el); ww.hidden = false; ww.innerHTML = `<p><b>${ok ? '答對了。' : '正確答案：' + it[2] + '。'}</b>${why[it[2]]}</p><button type="button" class="btn pri" id="wt-next">下一個 →</button>`; $('#wt-next', el).onclick = () => { k++; draw(); }; }; });
      const re = $('#wt-re', el); if (re) re.onclick = () => { k = 0; res.length = 0; draw(); };
    };
    el._demo = dd => { k = dd.k; delete res[k]; draw(); };
    draw();
  },
  spread(el) {
    const d = STUDY(), I = [...Array(d.n).keys()], V = { sbp_0: ['基線收縮壓（mmHg）', 240], crp: ['CRP（mg/L）', 40] }, hs = sel => ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'].map(h => `<option${h === sel ? ' selected' : ''}>${h}</option>`).join('');
    el.innerHTML = SRC_NOTE + `<div class="w-row"><label class="fld"><span>變數</span><select id="wv-v">${Object.entries(V).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><label class="fld"><span>甲組</span><select id="wv-a">${hs('H1')}</select></label><label class="fld"><span>乙組</span><select id="wv-b">${hs('H8')}</select></label></div><label class="tog"><input type="checkbox" id="wv-o"> 乙組加入一個極端值</label><div class="chart-wrap" id="wv-c"></div><p class="w-cap">紅線 = 平均；深色帶 = 平均 ± 1 SD；淺色帶 = ± 2 SD；方框 = 中間 50%（IQR）。</p><div class="kv" id="wv-k"></div>`;
    const up = () => {
      const vk = $('#wv-v').value, ext = V[vk][1], get = h => I.filter(i => d.hospital[i] === h).map(i => d[vk][i]), A = get($('#wv-a').value), B = get($('#wv-b').value); if ($('#wv-o').checked) B.push(ext);
      const rows = [[`甲組 ${$('#wv-a').value}`, A], [`乙組 ${$('#wv-b').value}`, B]], all = [...A, ...B], lo0 = Math.min(...all), hi0 = Math.max(...all), pad = (hi0 - lo0) * 0.05, cl = a => Math.max(lo0 - pad, Math.min(hi0 + pad, a));
      $('#wv-c').innerHTML = chart({ ycats: rows.map(r => r[0]), x: [lo0 - pad, hi0 + pad], h: 220, xlab: V[vk][0], m: { l: 64 }, xgrid: true }, (X, Y, { ih }) => rows.map(([, v], i) => {
        const y = Y(i), hh = ih / 2 * 0.72, m = S.mean(v), sd = S.sd(v), q1 = S.quantile(v, 0.25), q3 = S.quantile(v, 0.75);
        const t = i ? 'B' : 'A'; return `<rect data-k="sd${t}" x="${X(cl(m - 2 * sd))}" y="${y - hh / 2}" width="${X(cl(m + 2 * sd)) - X(cl(m - 2 * sd))}" height="${hh}" style="fill:var(--c1);fill-opacity:.08"/><rect data-k="sd${t}" x="${X(cl(m - sd))}" y="${y - hh / 2}" width="${X(cl(m + sd)) - X(cl(m - sd))}" height="${hh}" style="fill:var(--c1);fill-opacity:.17"/><rect data-k="iqr${t}" x="${X(q1)}" y="${y - hh / 4}" width="${X(q3) - X(q1)}" height="${hh / 2}" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>` + v.map((x, k) => `<circle cx="${X(cl(x))}" cy="${y + (((k * 0.618) % 1) - 0.5) * hh * 0.8}" r="3.2" style="fill:${x === ext && i ? 'var(--c2)' : 'var(--c1)'}"/>`).join('') + `<line x1="${X(m)}" x2="${X(m)}" y1="${y - hh / 2}" y2="${y + hh / 2}" style="stroke:var(--c2);stroke-width:2.5"/>`;
      }).join(''));
      $('#wv-k').innerHTML = kvs([['甲組 SD', F.n(S.sd(A), 2), 'sdA'], ['乙組 SD', F.n(S.sd(B), 2), 'sdB'], ['甲組 IQR', F.n(S.quantile(A, 0.75) - S.quantile(A, 0.25), 2), 'iqrA'], ['乙組 IQR', F.n(S.quantile(B, 0.75) - S.quantile(B, 0.25), 2), 'iqrB'], ['甲組變異係數 CV', F.n(100 * S.sd(A) / S.mean(A), 1) + '%', 'sdA'], ['乙組變異係數 CV', F.n(100 * S.sd(B) / S.mean(B), 1) + '%', 'sdB']]);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  table1w(el) {
    el.innerHTML = SRC_NOTE + `<p class="w-cap">切換分組方式；點表格中的變數，下方會畫出它的分佈。</p><div class="seg wrap" id="wt1-g"><button type="button" data-g="" aria-selected="false">不分組</button><button type="button" data-g="group" aria-selected="true">依治療組別</button><button type="button" data-g="sex" aria-selected="false">依性別</button></div><label class="tog"><input type="checkbox" id="wt1-p" checked> 顯示 p 值欄</label><div id="wt1-t"></div>`;
    let g = 'group';
    const up = () => {
      const r = AN.table1.run(getDS('study'), { g, vars: ['age', 'sex', 'bmi', 'smoker', 'diabetes', 'sbp_0', 'crp'] }), t = r.table1, show = $('#wt1-p').checked || !g, cut = a => (g && !show ? a.slice(0, -1) : a);
      $('#wt1-p').disabled = !g;
      $('#wt1-t').innerHTML = tableHTML({ head: cut(t.head), rows: t.rows.map(x => ({ ...x, cells: cut(x.cells) })), foot: show ? t.foot : '' }) + `<div class="picks">${r.picks.map(p => `<div class="pick" data-k="${p.k}">${figHTML(p)}</div>`).join('')}</div>`;
      if (!el._k) el._k = 'v0';
    };
    segBind(el, '#wt1-g', b => { g = b.dataset.g; up(); }); $('#wt1-p').onchange = up; up();
  },
  tvis(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], OUT = { c4: ['第 4 週血壓變化', i => (D.sbp_4[i] == null ? null : D.sbp_4[i] - D.sbp_0[i])], c12: ['第 12 週血壓變化', i => (D.sbp_12[i] == null ? null : D.sbp_12[i] - D.sbp_0[i])], b0: ['基線收縮壓（分派前）', i => D.sbp_0[i]] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wtv-m') + `<div class="w-row" id="wtv-dr"><label class="fld"><span>比較</span><select id="wtv-o">${Object.entries(OUT).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><label class="fld"><span>醫院</span><select id="wtv-h">${HOSP_OPTS('全部')}</select></label></div>
<div class="w-row" id="wtv-or" hidden>${slider('wtv-d', '兩組平均差 Δ', 0, 20, 1, 6)}${slider('wtv-s', '標準差 SD', 2, 30, 1, 12)}${slider('wtv-n', '每組人數 n', 3, 100, 1, 20)}</div><figure class="fig"><figcaption id="wtv-ca">兩組資料的分佈（藍 = 安慰劑，紅 = 新藥）</figcaption><div class="chart-wrap" id="wtv-a"></div></figure><figure class="fig"><figcaption>假如兩組其實沒差，t 值的分佈；紅色面積就是 p 值</figcaption><div class="chart-wrap" id="wtv-b"></div></figure><div class="kv" id="wtv-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wtv-dr').hidden = mode !== 'data'; $('#wtv-or').hidden = mode === 'data';
      let d, s, se, t, df, p, m0, m1, top, aChart;
      if (mode === 'data') {
        const f = OUT[$('#wtv-o').value][1], h = $('#wtv-h').value, g = gr => I.filter(i => D.group[i] === gr && (!h || D.hospital[i] === h)).map(f).filter(v => v != null), A = g('placebo'), B = g('drug'), W = S.welch(A, B);
        d = W.diff; se = W.se; t = W.t; df = W.df; p = W.p; m0 = W.m1; m1 = W.m2; s = Math.sqrt((S.variance(A) + S.variance(B)) / 2);
        const [lo, hi] = S.minmax([...A, ...B]), bw = (hi - lo) / 24 || 1, cnt = v => { const c = new Array(24).fill(0); v.forEach(x => { c[Math.min(23, Math.floor((x - lo) / bw))]++; }); return c.map(x => x / v.length); }, ca = cnt(A), cb = cnt(B); top = Math.max(...ca, ...cb) * 1.3;
        aChart = chart({ x: [lo, hi], y: [0, top], noY: true, h: 190, xlab: OUT[$('#wtv-o').value][0] + '（mmHg）' }, (X, Y) => [[ca, 'var(--c1)'], [cb, 'var(--c2)']].map(([c, col]) => c.map((v, i) => `<rect x="${X(lo + i * bw) + 0.5}" y="${Y(v)}" width="${Math.max(0, X(lo + (i + 1) * bw) - X(lo + i * bw) - 1)}" height="${Y(0) - Y(v)}" style="fill:${col};fill-opacity:.4"/>`).join('')).join('')
          + [[m0, 'var(--c1)'], [m1, 'var(--c2)']].map(([m, col]) => `<line data-k="diff d" x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(top * 0.9)}" style="stroke:${col};stroke-width:2.5"/>`).join('')
          + `<g class="hlx" data-k="diff d"><line x1="${X(m0)}" x2="${X(m1)}" y1="${Y(top * 0.95)}" y2="${Y(top * 0.95)}" style="stroke:var(--ink);stroke-width:3"/></g><g class="hlx" data-k="d"><line x1="${X(m0)}" x2="${X(m0 + s)}" y1="${Y(top * 0.6)}" y2="${Y(top * 0.6)}" style="stroke:var(--c1);stroke-width:3"/><text x="${X(m0 + s / 2)}" y="${Y(top * 0.6) - 6}" text-anchor="middle" style="fill:var(--c1)">1 SD</text></g>` + [m0, m1].map((m, i) => `<g class="hlx" data-k="se"><line x1="${X(m - se / Math.SQRT2)}" x2="${X(m + se / Math.SQRT2)}" y1="${Y(top * (0.85 - i * 0.07))}" y2="${Y(top * (0.85 - i * 0.07))}" style="stroke:${i ? 'var(--c2)' : 'var(--c1)'};stroke-width:4"/></g>`).join(''));
        $('#wtv-ca').textContent = `兩組病人的分佈（藍 = 安慰劑 ${A.length} 人，紅 = 新藥 ${B.length} 人）；直線是各組平均`;
      } else {
        d = sv('wtv-d'); s = sv('wtv-s'); const n = sv('wtv-n'); se = s * Math.sqrt(2 / n); t = d / se; df = 2 * n - 2; p = S.pt2(t, df); m0 = 100; m1 = 100 + d;
        const lo = 100 - 3.5 * s, hi = 100 + d + 3.5 * s, pdf = (x, m) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)), pk = pdf(100, 100);
        const curve = (X, Y, m, c) => { let q = `M${X(lo)} ${Y(0)}`; for (let i = 0; i <= 120; i++) { const x = lo + (hi - lo) * i / 120; q += `L${X(x).toFixed(1)} ${Y(pdf(x, m)).toFixed(1)}`; } return `<path class="keep" d="${q}L${X(hi)} ${Y(0)}Z" style="fill:${c};fill-opacity:.18;stroke:${c};stroke-width:2"/><line data-k="diff d" x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(pk)}" style="stroke:${c};stroke-width:2;stroke-dasharray:4 3"/>`; };
        aChart = chart({ x: [lo, hi], y: [0, pk * 1.25], noY: true, h: 180, xlab: '測量值' }, (X, Y) => curve(X, Y, 100, 'var(--c1)') + curve(X, Y, 100 + d, 'var(--c2)') + `<g class="hlx" data-k="diff d"><line x1="${X(100)}" x2="${X(100 + d)}" y1="${Y(pk * 1.12)}" y2="${Y(pk * 1.12)}" style="stroke:var(--c2);stroke-width:3"/></g><g class="hlx" data-k="d"><line x1="${X(100)}" x2="${X(100 + s)}" y1="${Y(pk * 0.6)}" y2="${Y(pk * 0.6)}" style="stroke:var(--c1);stroke-width:3"/><text x="${X(100 + s / 2)}" y="${Y(pk * 0.6) - 6}" text-anchor="middle" style="fill:var(--c1)">1 SD</text></g>` + [100, 100 + d].map((m, i) => `<g class="hlx" data-k="se"><line x1="${X(m - se)}" x2="${X(m + se)}" y1="${Y(pk * (1.04 - i * 0.08))}" y2="${Y(pk * (1.04 - i * 0.08))}" style="stroke:${i ? 'var(--c2)' : 'var(--c1)'};stroke-width:4"/></g>`).join(''));
        $('#wtv-ca').textContent = '兩組資料的分佈（藍 = 對照，紅 = 治療）';
      }
      $('#wtv-a').innerHTML = aChart;
      const Rr = Math.max(4.5, Math.abs(t) + 1), tp = tpdf(0, df), at = Math.abs(t);
      $('#wtv-b').innerHTML = chart({ x: [-Rr, Rr], y: [0, tp * 1.25], noY: true, h: 170, xlab: 't 值' }, (X, Y) => {
        const area = (a, b) => { let q = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 60; i++) { const x = a + (b - a) * i / 60; q += `L${X(x).toFixed(1)} ${Y(tpdf(x, df)).toFixed(1)}`; } return q + `L${X(b)} ${Y(0)}Z`; };
        let c = ''; for (let i = 0; i <= 160; i++) { const x = -Rr + 2 * Rr * i / 160; c += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(tpdf(x, df)).toFixed(1)}`; }
        return `<path data-k="p" d="${area(at, Rr)}" style="fill:var(--c2);fill-opacity:.5"/><path data-k="p" d="${area(-Rr, -at)}" style="fill:var(--c2);fill-opacity:.5"/><path class="keep" d="${c}" style="fill:none;stroke:var(--ink);stroke-width:1.8"/><line data-k="t" x1="${X(t)}" x2="${X(t)}" y1="${Y(0)}" y2="${Y(tp * 1.08)}" style="stroke:var(--c2);stroke-width:2.5"/><text x="${X(t)}" y="${Y(tp * 1.08) - 5}" text-anchor="middle" style="fill:var(--c2)">t = ${F.n(t, 2)}</text>`;
      });
      $('#wtv-k').innerHTML = kvs([['訊號：平均差', F.n(d, 2), 'diff'], ['雜訊：標準誤', F.n(se, 2), 'se'], ['t = 訊號 ÷ 雜訊', F.n(t, 2), 't'], ['p 值', F.p(p), 'p'], ["Cohen's d", F.n(d / s, 2), 'd']]);
    };
    segBind(el, '#wtv-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  anovavis(el) {
    const r = rngOf(11), N = normOf(r), z = [0, 1, 2].map(() => std(Array.from({ length: 8 }, () => N())));
    const D = STUDY(), I = [...Array(D.n).keys()], V = { sbp_0: ['基線收縮壓', i => D.sbp_0[i]], age: ['年齡', i => D.age[i]], c12: ['第 12 週血壓變化', i => (D.sbp_12[i] == null ? null : D.sbp_12[i] - D.sbp_0[i])] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wa-m') + `<div class="w-row" id="wa-dr"><label class="fld"><span>8 間醫院比較</span><select id="wa-v">${Object.entries(V).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label></div><div class="w-row" id="wa-or" hidden>${slider('wa-g', '組間差距', 0, 10, 0.5, 4)}${slider('wa-s', '組內標準差', 1, 10, 0.5, 3)}</div><div class="chart-wrap" id="wa-c"></div><p class="w-cap">粗橫線是各組平均，灰色虛線是全體平均。點數字卡，圖上會畫出每個平方和用到的距離。</p><div class="fbar" id="wa-f"></div><div class="kv" id="wa-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wa-dr').hidden = mode !== 'data'; $('#wa-or').hidden = mode === 'data';
      let v, names, ylab, yr;
      if (mode === 'data') { const [lab, f] = V[$('#wa-v').value]; names = HN; v = HN.map(h => I.filter(i => D.hospital[i] === h).map(f).filter(x => x != null)); ylab = lab; const [a, b] = S.minmax(v.flat()); yr = [a - 2, b + 2]; }
      else { const gap = sv('wa-g'), s = sv('wa-s'), mu = [30, 30 + gap, 30 + gap / 2]; v = z.map((zz, k) => zz.map(x => mu[k] + s * x)); names = ['肥料 A', '肥料 B', '肥料 C']; ylab = '株高（公分）'; yr = [0, 72]; }
      const A = S.anova(v), gm = S.mean(v.flat()), sst = A.ssb + A.ssw;
      $('#wa-c').innerHTML = chart({ xcats: names, y: yr, h: 280, ylab }, (X, Y, { M, iw }) => {
        const sp = Math.min(68, iw / names.length * 0.6);
        let g = `<line data-k="eta msb ssb sst" x1="${M.l}" x2="${M.l + iw}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>`;
        v.forEach((grp, k) => {
          const m = S.mean(grp), xs = grp.map((_, i) => X(k) - sp / 2 + i * sp / (grp.length - 1));
          grp.forEach((x, i) => { g += `<line class="hlx" data-k="sst" x1="${xs[i]}" x2="${xs[i]}" y1="${Y(x)}" y2="${Y(gm)}" style="stroke:var(--c4);stroke-width:2"/><line class="hlx" data-k="ssw msw" x1="${xs[i]}" x2="${xs[i]}" y1="${Y(x)}" y2="${Y(m)}" style="stroke:var(--c3);stroke-width:2"/>`; });
          g += grp.map((x, i) => `<circle data-k="ssw msw sst" cx="${xs[i]}" cy="${Y(x)}" r="${names.length > 4 ? 2.4 : 3.8}" style="fill:${col4(k)};fill-opacity:.75"/>`).join('');
          g += `<line data-k="eta msb ssb ssw msw" x1="${X(k) - sp / 2 - 4}" x2="${X(k) + sp / 2 + 4}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:${col4(k)};stroke-width:3.5"/><line class="hlx" data-k="msb ssb eta" x1="${X(k) + sp / 2 + 7}" x2="${X(k) + sp / 2 + 7}" y1="${Y(gm)}" y2="${Y(m)}" style="stroke:var(--c2);stroke-width:4"/>`;
        });
        return g;
      });
      const mx = Math.max(A.msb, A.msw) || 1;
      $('#wa-f').innerHTML = `<div data-card="msb" data-k="msb F" role="button" tabindex="0"><span>組間均方</span><i style="width:${100 * A.msb / mx}%;background:var(--c2)"></i><b>${F.n(A.msb, 1)}</b></div><div data-card="msw" data-k="msw F" role="button" tabindex="0"><span>組內均方</span><i style="width:${100 * A.msw / mx}%;background:var(--muted)"></i><b>${F.n(A.msw, 1)}</b></div>`;
      $('#wa-k').innerHTML = kvs([['總平方和', F.n(sst, 1), 'sst'], ['組間平方和', F.n(A.ssb, 1), 'ssb'], ['組內平方和', F.n(A.ssw, 1), 'ssw'], ['F = 組間均方 ÷ 組內均方', F.n(A.F, 2), 'F'], ['η²', F.n(A.eta2, 2), 'eta'], ['p 值', F.p(A.p)]]);
    };
    segBind(el, '#wa-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  twobytwo(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], tab = f => ({ a: I.filter(i => f(i) && D.cvd_event[i]).length, b: I.filter(i => f(i) && !D.cvd_event[i]).length, c: I.filter(i => !f(i) && D.cvd_event[i]).length, d: I.filter(i => !f(i) && !D.cvd_event[i]).length }), T0 = tab(i => D.smoker[i] === 1), T1 = tab(i => D.diabetes[i] === 1), v = { ...T0 }, lab = { r1: '吸菸', r0: '不吸菸' }, cell = k => `<span class="cellw" data-k="or chi fis"><input class="cell" id="w2-${k}" type="number" inputmode="numeric" min="0" value="${v[k]}" aria-label="格 ${k}"></span>`;
    el.innerHTML = SRC_NOTE + `<p class="w-cap">預設是研究資料：36 個月內心血管事件。可以直接修改格子裡的人數。</p><div class="tbl-wrap"><table class="st t22"><thead><tr><th></th><th>有事件</th><th>無事件</th></tr></thead><tbody><tr><td id="w2-l1">吸菸</td><td>${cell('a')}</td><td>${cell('b')}</td></tr><tr><td id="w2-l0">不吸菸</td><td>${cell('c')}</td><td>${cell('d')}</td></tr></tbody></table></div><div id="w2-bars"></div><div class="kv" id="w2-k"></div><p class="callout warn" id="w2-w" hidden></p><div class="w-row"><button class="btn" type="button" id="w2-smk">研究資料：吸菸</button><button class="btn" type="button" id="w2-dm">研究資料：糖尿病</button><button class="btn" type="button" id="w2-small">試試小樣本</button></div>`;
    const set = o => { Object.assign(v, o); for (const k in v) $('#w2-' + k).value = v[k]; up(); };
    const up = () => {
      for (const k of ['a', 'b', 'c', 'd']) v[k] = Math.max(0, Math.round(+$('#w2-' + k).value || 0));
      const { a, b, c, d } = v; if (a + b === 0 || c + d === 0 || a + c === 0 || b + d === 0) { $('#w2-k').innerHTML = '<p class="w-out">每一列、每一欄至少要有 1 人。</p>'; return; }
      const r1 = a / (a + b), r0 = c / (c + d), t = S.chisq([[a, b], [c, d]]), fp = S.fisher(a, b, c, d);
      const bar = (l, r, col) => `<div class="rbar" data-k="rr"><span>${l}</span><div><i style="width:${100 * r}%;background:${col}"></i></div><b>${F.n(100 * r, 1)}%</b></div>`;
      $('#w2-bars').innerHTML = `<p class="w-cap">各組發生事件的比例（風險）</p>${bar(lab.r1, r1, 'var(--c2)')}${bar(lab.r0, r0, 'var(--c1)')}`;
      $('#w2-k').innerHTML = kvs([['風險比 RR', F.n(r1 / r0, 2), 'rr'], ['勝算比 OR', F.n((a * d) / (b * c), 2), 'or'], ['卡方 p', F.p(t.p), 'chi'], ['Fisher p', F.p(fp), 'fis']]);
      const w = $('#w2-w'); w.hidden = !(t.minExp < 5); w.textContent = `最小期望次數 ${F.n(t.minExp, 2)}，小於 5：卡方近似不可靠，請看 Fisher 精確檢定。`;
    };
    const rl = (a, b) => { lab.r1 = a; lab.r0 = b; $('#w2-l1').textContent = a; $('#w2-l0').textContent = b; };
    $('#w2-small', el).onclick = () => { rl('暴露', '未暴露'); set({ a: 4, b: 3, c: 1, d: 8 }); }; $('#w2-smk', el).onclick = () => { rl('吸菸', '不吸菸'); set(T0); }; $('#w2-dm', el).onclick = () => { rl('糖尿病', '沒有糖尿病'); set(T1); };
    el.addEventListener('input', up); up();
  },
  corrvis(el) {
    const r = rngOf(5), N = normOf(r), z1 = Array.from({ length: 60 }, () => N()), z2 = Array.from({ length: 60 }, () => N());
    el.innerHTML = `<div class="w-row">${slider('wc2-r', '相關強度', -1, 1, 0.05, 0.6)}${slider('wc2-n', '樣本數', 10, 60, 1, 40)}</div><div class="w-row"><label class="tog"><input type="checkbox" id="wc2-o"> 加入一個極端值</label><label class="tog"><input type="checkbox" id="wc2-u"> 改成 U 型關係</label></div><div class="chart-wrap" id="wc2-c"></div><div class="kv" id="wc2-k"></div><p class="w-cap" id="wc2-t"></p>`;
    const up = () => {
      const rr = sv('wc2-r', v => v.toFixed(2)), n = sv('wc2-n'), U = $('#wc2-u').checked, O = $('#wc2-o').checked;
      let x = z1.slice(0, n), y = U ? x.map((v, i) => v * v - 1 + 0.35 * z2[i]) : x.map((v, i) => rr * v + Math.sqrt(Math.max(0, 1 - rr * rr)) * z2[i]);
      if (O) { x = [...x, 3.6]; y = [...y, rr >= 0 && !U ? -3.6 : 3.6]; }
      const P = S.pearson(x, y), R = S.spearman(x, y), [y0, y1] = S.minmax(y), lo = Math.min(-4, y0), hi = Math.max(4, y1), yl = v => Math.max(lo, Math.min(hi, v));
      $('#wc2-c').innerHTML = chart({ x: [-4, 4], y: [lo, hi], h: 300, xlab: 'X', ylab: 'Y', xgrid: true }, (X, Y) => x.map((v, i) => `<circle data-k="rho" cx="${X(v)}" cy="${Y(y[i])}" r="${i >= n ? 7 : 4}" style="fill:${i >= n ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.65"/>`).join('') + `<line data-k="r r2 p" x1="${X(-4)}" x2="${X(4)}" y1="${Y(yl(P.intercept - 4 * P.slope))}" y2="${Y(yl(P.intercept + 4 * P.slope))}" style="stroke:var(--c2);stroke-width:2"/>`);
      $('#wc2-k').innerHTML = kvs([['Pearson r', F.n(P.r, 2), 'r'], ['Spearman ρ', F.n(R.rho, 2), 'rho'], ['r²', F.n(P.r * P.r, 2), 'r2'], ['p 值', F.p(P.p), 'p']]);
      $('#wc2-t').textContent = U ? 'U 型關係中 X 和 Y 明顯有關，但 r 接近 0：r 只能抓到「直線」關係。' : O ? '一個極端值就能大幅改變 Pearson r，Spearman ρ 受的影響小得多。' : '拖動滑桿，看看 r = 0.3 和 r = 0.8 的散佈圖差多少。';
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  chooser(el) {
    const R = (m, note, an) => ({ m, note, an });
    const T = { q: '你的結果變數是什麼？', o: [
      ['數值（血壓、體重、表現量）', { q: '你要比較什麼？', o: [['兩組不同個體', R('Welch t 檢定', '樣本小又明顯偏態：Mann–Whitney U', 'ttest')], ['同一個體測兩次', R('配對 t 檢定', '明顯偏態：Wilcoxon 符號等級檢定', 'paired')], ['三組以上', R('單因子 ANOVA', '偏態：Kruskal–Wallis；事後比較要校正多重比較', 'anova')], ['與另一個數值變數的關係', R('相關分析或線性迴歸', '需要校正干擾因子時用線性迴歸', 'corr')]] }],
      ['二元（有／無）', { q: '需要校正其他變數嗎？', o: [['不用，比較兩組比例', R('卡方檢定', '任一格期望次數小於 5 時用 Fisher 精確檢定', 'chisq')], ['要校正', R('邏輯斯迴歸', '每個參數至少約 10 個事件', 'logreg')]] }],
      ['時間至事件（存活、復發）', { q: '需要校正其他變數嗎？', o: [['不用，比較組別', R('Kaplan–Meier + log-rank 檢定', '', 'surv')], ['要校正', R('Cox 比例風險模型', '記得檢查比例風險假設', 'surv')]] }],
      ['同一個體多次測量，或群集資料', R('混合模型或 GEE', '本站沒有實作；替代做法是把每個群集摘要成一個數再分析', '')],
    ] };
    const path = [];
    const draw = () => {
      let node = T; const cr = []; for (const i of path) { cr.push(node.o[i][0]); node = node.o[i][1]; }
      el.innerHTML = `<div class="crumbs">${cr.length ? cr.map(c => `<span>${c}</span>`).join('<b>›</b>') : '<span class="mut">一步一步回答問題</span>'}</div>` + (node.q ? `<p class="q-big">${node.q}</p><div class="choice one">${node.o.map((o, i) => `<button type="button" class="opt" data-i="${i}">${o[0]}<span aria-hidden="true">›</span></button>`).join('')}</div>` : `<div class="vcard res-card"><p class="lbl">建議方法</p><h4>${node.m}</h4>${node.note ? `<p>${node.note}</p>` : ''}${LABP[node.an] ? '<button class="btn pri" type="button" id="wch-lab">在實驗室試試 →</button>' : ''}</div>`) + (path.length ? '<button class="btn ghost" type="button" id="wch-back">← 上一步</button>' : '');
      $$('[data-i]', el).forEach(b => { b.onclick = () => { path.push(+b.dataset.i); draw(); }; });
      const bk = $('#wch-back', el); if (bk) bk.onclick = () => { path.pop(); draw(); };
      const lb = $('#wch-lab', el); if (lb) lb.onclick = () => openLab(LABP[node.an]);
    };
    el._demo = d => { path.length = 0; path.push(...d.path); draw(); };
    draw();
  },
  confound(el) {
    const r = rngOf(21), N = normOf(r), base = Array.from({ length: 80 }, (_, i) => ({ d: i % 2, za: N(), ze: N() }));
    el.innerHTML = `<p class="w-cap">模擬試驗：藥物真實效果是讓收縮壓<b>降低 10 mmHg</b>，但年齡越大血壓越高。</p><div class="w-row">${slider('wf-g', '藥物組比對照組平均大幾歲', 0, 20, 1, 12)}</div><div class="seg wrap" id="wf-m"><button type="button" data-m="0" aria-selected="true">未校正：比平均</button><button type="button" data-m="1" aria-selected="false">校正年齡：迴歸</button></div><div class="chart-wrap" id="wf-c"></div>${legend([['var(--c1)', '對照組'], ['var(--c2)', '藥物組']])}<div class="kv" id="wf-k"></div><p class="w-cap" id="wf-t"></p>`;
    let mode = 0;
    const up = () => {
      const gap = sv('wf-g'), pts = base.map(p => { const age = 55 + (p.d ? gap / 2 : -gap / 2) + 7 * p.za; return { d: p.d, age, sbp: 80 + 0.9 * age - 10 * p.d + 6 * p.ze }; });
      const m1 = S.mean(pts.filter(p => p.d).map(p => p.sbp)), m0 = S.mean(pts.filter(p => !p.d).map(p => p.sbp)), fit = S.ols(pts.map(p => [1, p.age, p.d]), pts.map(p => p.sbp)), [a0, a1] = S.minmax(pts.map(p => p.age)), [s0, s1] = S.minmax(pts.map(p => p.sbp));
      $('#wf-c').innerHTML = chart({ x: [a0, a1], y: [s0, s1], h: 300, xlab: '年齡', ylab: '收縮壓', xgrid: true }, (X, Y, { M, iw }) => pts.map(p => `<circle cx="${X(p.age)}" cy="${Y(p.sbp)}" r="3.6" style="fill:${p.d ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.6"/>`).join('') + [0, 1].map(d => `<line class="${mode ? '' : 'hlx'}" data-k="adj" x1="${X(a0)}" x2="${X(a1)}" y1="${Y(fit.b[0] + fit.b[1] * a0 + fit.b[2] * d)}" y2="${Y(fit.b[0] + fit.b[1] * a1 + fit.b[2] * d)}" style="stroke:${d ? 'var(--c2)' : 'var(--c1)'};stroke-width:2.5"/>`).join('') + [[m0, 'var(--c1)'], [m1, 'var(--c2)']].map(([m, c]) => `<line class="${mode ? 'hlx' : ''}" data-k="crude" x1="${M.l}" x2="${M.l + iw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:${c};stroke-width:2.5;stroke-dasharray:7 4"/>`).join(''));
      $('#wf-k').innerHTML = kvs([['未校正的差異', F.n(m1 - m0, 1), 'crude'], ['校正年齡後', F.n(fit.b[2], 1), 'adj'], ['真實藥效', '−10.0']]);
      $('#wf-t').textContent = mode ? '兩條平行線之間的垂直距離，就是「同樣年齡」時兩組的差。校正後的估計接近真實效果。' : `虛線是兩組的平均收縮壓。藥物組年紀較大，年齡帶來的高血壓抵銷了藥效${gap >= 10 ? '，藥物甚至看起來無效' : ''}。`;
    };
    segBind(el, '#wf-m', b => { mode = +b.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  logit(el) {
    const ds = getDS('cvd_cohort'), ag = colOf(ds, 'age').values, ev = colOf(ds, 'cvd_10y').values, fit = S.logistic(ag.map(a => [1, a]), ev);
    el.innerHTML = `<p class="w-cap">點是 400 位世代研究參與者：上排 = 10 年內發生心血管事件，下排 = 沒有。調整 β 讓曲線貼合資料，對數概似越大代表越貼合。</p><div class="w-row">${slider('wg-0', '截距 β₀', -12, 0, 0.1, -6)}${slider('wg-1', '斜率 β₁（每歲）', -0.05, 0.2, 0.005, 0.08)}${slider('wg-x', '看某個年齡', 35, 79, 1, 60)}</div><div class="chart-wrap" id="wg-c"></div><div class="kv" id="wg-k"></div><div class="w-row"><button type="button" class="btn" id="wg-best">最佳擬合</button></div>`;
    const up = () => {
      const b0 = sv('wg-0', v => v.toFixed(1)), b1 = sv('wg-1', v => v.toFixed(3)), x = sv('wg-x'), p = a => 1 / (1 + Math.exp(-(b0 + b1 * a))), px = p(x);
      $('#wg-c').innerHTML = chart({ x: [35, 80], y: [0, 1], h: 280, xlab: '年齡', ylab: '事件機率', xgrid: true }, (X, Y) => ag.map((a, i) => `<circle data-k="ll" cx="${X(a + ((i * 0.618) % 1 - 0.5) * 0.8).toFixed(1)}" cy="${(Y(ev[i] ? 0.96 : 0.04) + ((i * 0.382) % 1 - 0.5) * 12).toFixed(1)}" r="2.5" style="fill:${ev[i] ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.35"/>`).join('') + `<path d="${Array.from({ length: 91 }, (_, i) => 35 + i * 0.5).map((a, i) => `${i ? 'L' : 'M'}${X(a).toFixed(1)} ${Y(p(a)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/><line data-k="px odds" x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(px)}" style="stroke:var(--c4);stroke-dasharray:4 3"/><circle data-k="px odds or1 or10" cx="${X(x)}" cy="${Y(px)}" r="6" style="fill:var(--c4)"/>` + [[1, 'or1'], [10, 'or10']].map(([dx, k]) => (x + dx <= 80 ? `<g class="hlx" data-k="${k}"><line x1="${X(x)}" x2="${X(x + dx)}" y1="${Y(px)}" y2="${Y(px)}" style="stroke:var(--c4);stroke-dasharray:4 3"/><line x1="${X(x + dx)}" x2="${X(x + dx)}" y1="${Y(px)}" y2="${Y(p(x + dx))}" style="stroke:var(--c4);stroke-width:3"/><circle cx="${X(x + dx)}" cy="${Y(p(x + dx))}" r="6" style="fill:var(--c4)"/></g>` : '')).join(''));
      const ll = S.sum(ev.map((e, i) => Math.log(Math.max(1e-12, e ? p(ag[i]) : 1 - p(ag[i])))));
      $('#wg-k').innerHTML = kvs([[`${x} 歲的機率 p`, F.n(px, 3), 'px'], ['勝算 p ÷ (1 − p)', F.n(px / (1 - px), 3), 'odds'], ['OR（每多 1 歲）', F.n(Math.exp(b1), 3), 'or1'], ['OR（每多 10 歲）', F.n(Math.exp(10 * b1), 2), 'or10'], ['對數概似', F.n(ll, 1), 'll']]);
    };
    $('#wg-best', el).onclick = () => { $('#wg-0').value = fit.b[0].toFixed(1); $('#wg-1').value = (Math.round(fit.b[1] / 0.005) * 0.005).toFixed(3); up(); };
    el.addEventListener('input', up); up();
  },
  kmbuild(el) {
    const T = [3, 5, 7, 8, 11, 12, 15, 18, 20, 24], st = [1, 1, 0, 1, 1, 0, 1, 0, 1, 0];
    el.innerHTML = `<p class="w-cap">每條線是一位病人的追蹤時間。<b>點一下病人那一列</b>切換結局：紅點 = 死亡（事件），藍色 ＋ = 設限（失聯或研究結束時仍存活）。</p><div class="chart-wrap" id="wk-a"></div><div class="chart-wrap" id="wk-b"></div>${legend([['var(--c1)', 'Kaplan–Meier（正確）'], ['var(--c2)', '直接刪除設限者（錯誤）']])}<div class="kv" id="wk-k"></div>`;
    const up = () => {
      $('#wk-a').innerHTML = chart({ ycats: T.map((_, i) => `病人 ${i + 1}`), x: [0, 25], h: 320, xlab: '月', m: { l: 62 }, xgrid: true }, (X, Y, { M, iw, ih }) => T.map((t, i) => `<g class="tap" data-i="${i}" role="button" tabindex="0" aria-label="病人 ${i + 1}，${st[i] ? '死亡' : '設限'}，點一下切換"><rect x="${M.l}" y="${Y(i) - ih / 20}" width="${iw}" height="${ih / 10}" style="fill:transparent"/><line x1="${X(0)}" x2="${X(t)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--muted);stroke-width:3"/>${st[i] ? `<circle data-k="ev" cx="${X(t)}" cy="${Y(i)}" r="8" style="fill:var(--c2)"/>` : `<path data-k="ce" d="M${X(t) - 8} ${Y(i)}h16M${X(t)} ${Y(i) - 8}v16" style="stroke:var(--c1);stroke-width:3.5"/>`}</g>`).join(''));
      const k = S.km(T, st), ev = T.filter((_, i) => st[i]), nv = ev.length ? S.km(ev, ev.map(() => 1)) : null;
      $('#wk-b').innerHTML = chart({ x: [0, 25], y: [0, 1], h: 240, xlab: '月', ylab: '存活機率', xgrid: true }, (X, Y) => (nv ? kmPath(X, Y, nv, 'var(--c2)', true) : '') + kmPath(X, Y, k, 'var(--c1)') + [[k, 'med', 'var(--c1)'], [nv, 'nmed', 'var(--c2)']].map(([kk, key, c]) => (kk && Number.isFinite(kk.median) ? `<g class="hlx" data-k="${key}"><line x1="${X(0)}" x2="${X(kk.median)}" y1="${Y(0.5)}" y2="${Y(0.5)}" style="stroke:${c};stroke-dasharray:4 3"/><line x1="${X(kk.median)}" x2="${X(kk.median)}" y1="${Y(0.5)}" y2="${Y(0)}" style="stroke:${c};stroke-width:3"/></g>` : '')).join('') + k.cens.map(c => `<line x1="${X(c.t)}" x2="${X(c.t)}" y1="${Y(c.S) - 6}" y2="${Y(c.S) + 6}" style="stroke:var(--c1);stroke-width:2"/>`).join(''));
      $('#wk-k').innerHTML = kvs([['事件', ev.length, 'ev'], ['設限', 10 - ev.length, 'ce'], ['KM 中位存活', Number.isFinite(k.median) ? k.median + ' 月' : '未達到', 'med'], ['刪除設限者的中位數', nv && Number.isFinite(nv.median) ? nv.median + ' 月' : '—', 'nmed']]);
      $$('.tap', el).forEach(g => { const tg = () => { st[+g.dataset.i] ^= 1; up(); }; g.onclick = tg; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } }; });
    };
    el._demo = d => { d.st.forEach((v, i) => { st[i] = v; }); up(); };
    up();
  },
  mtest(el) {
    el.innerHTML = `<div class="w-row">${slider('wm-m', '檢定幾個基因', 20, 1000, 10, 200)}${slider('wm-t', '真的有差的比例', 0, 50, 5, 10, '%')}${slider('wm-e', '真實效果大小', 1, 5, 0.5, 3)}</div><div class="w-row"><button class="btn" type="button" id="wm-go">重新模擬</button></div><div class="chart-wrap" id="wm-c"></div>${legend([['var(--c1)', '真的有差'], ['var(--muted)', '其實沒差'], ['var(--c4)', 'α = 0.05'], ['var(--c2)', 'BH 界線'], ['var(--c3)', 'Bonferroni 界線']])}<div id="wm-t"></div>`;
    const up = () => {
      const m = sv('wm-m'), tr = sv('wm-t', v => v + '%') / 100, e = sv('wm-e'), nT = Math.round(m * tr);
      const tests = Array.from({ length: m }, (_, i) => { const t = i < nT; return { t, p: S.pz2((t ? e : 0) + rnorm()) }; }), q = S.bh(tests.map(x => x.p)); tests.forEach((x, i) => { x.q = q[i]; });
      const sorted = [...tests].sort((a, b) => a.p - b.p), K = Math.min(m, Math.max(30, Math.round(nT * 2.2))), shown = sorted.slice(0, K), yM = Math.max(0.06, Math.min(1, shown[K - 1].p * 1.05)), xe = Math.min(K, yM * m / 0.05);
      $('#wm-c').innerHTML = chart({ x: [0, K], y: [0, yM], h: 280, xlab: `p 值由小到大排名（前 ${K} 名，共 ${m} 個）`, ylab: 'p 值' }, (X, Y, { M, iw }) => `<line data-k="un" x1="${M.l}" x2="${M.l + iw}" y1="${Y(0.05)}" y2="${Y(0.05)}" style="stroke:var(--c4);stroke-width:1.5"/><line data-k="bh" x1="${X(0)}" x2="${X(xe)}" y1="${Y(0)}" y2="${Y(0.05 * xe / m)}" style="stroke:var(--c2);stroke-width:2"/><line data-k="bf" x1="${M.l}" x2="${M.l + iw}" y1="${Y(0.05 / m)}" y2="${Y(0.05 / m)}" style="stroke:var(--c3);stroke-width:1.5;stroke-dasharray:5 3"/>` + shown.map((x, i) => `<circle data-k="${[x.p < 0.05 ? 'un' : '', x.q < 0.05 ? 'bh' : '', x.p < 0.05 / m ? 'bf' : ''].join(' ').trim()}" cx="${X(i + 1).toFixed(1)}" cy="${Y(x.p).toFixed(1)}" r="3.2" style="fill:${x.t ? 'var(--c1)' : 'var(--muted)'}"/>`).join(''));
      const row = (nm, f, k) => { const s = tests.filter(f), tp = s.filter(x => x.t).length; return `<tr data-card="${k}" data-k="${k}" tabindex="0"><td>${nm}</td><td>${s.length}</td><td class="good">${tp}</td><td class="bad">${s.length - tp}</td><td>${s.length ? F.n(100 * (s.length - tp) / s.length, 0) + '%' : '—'}</td></tr>`; };
      $('#wm-t').innerHTML = `<div class="tbl-wrap"><table class="st"><thead><tr><th>方法</th><th>判定顯著</th><th>真的有差</th><th>偽陽性</th><th>偽發現比例</th></tr></thead><tbody>${row('未校正 p < 0.05', x => x.p < 0.05, 'un')}${row('BH q < 0.05', x => x.q < 0.05, 'bh')}${row('Bonferroni', x => x.p < 0.05 / m, 'bf')}</tbody></table></div><p class="w-cap">點表格中的一列，圖上會亮出該方法的門檻與判定顯著的點。真的有差的基因共 ${nT} 個。BH 控制的是最後一欄「偽發現比例」，讓它平均不超過 5%。</p>`;
    };
    $('#wm-go', el).onclick = up; el.addEventListener('input', up); up();
  },
  pseudo(el) {
    el.innerHTML = `<p class="w-cap">情境：處理組與對照組的小鼠<b>其實沒有差異</b>。每隻小鼠量好幾個細胞，而不同小鼠之間本來就有差異。</p><div class="w-row">${slider('wps-m', '每組小鼠數', 2, 8, 1, 3)}${slider('wps-c', '每隻量幾個細胞', 1, 50, 1, 20)}${slider('wps-b', '小鼠之間的差異', 0, 2, 0.1, 1)}</div><div class="w-row"><button class="btn" type="button" id="wps-go">再模擬一次</button></div><figure class="fig"><figcaption>一次實驗（每種顏色是一隻小鼠，短橫線是牠的平均）</figcaption><div class="chart-wrap" id="wps-a"></div></figure><figure class="fig"><figcaption>重複 400 次實驗，p &lt; 0.05 的比例（應該是 5%，虛線）</figcaption><div class="chart-wrap" id="wps-r"></div></figure>`;
    const exp = (m, c, b) => [0, 1].map(() => Array.from({ length: m }, () => { const u = b * rnorm(); return Array.from({ length: c }, () => u + rnorm()); }));
    const up = () => {
      const m = sv('wps-m'), c = sv('wps-c'), b = sv('wps-b', v => v.toFixed(1)), one = exp(m, c, b), [lo, hi] = S.minmax(one.flat(2));
      $('#wps-a').innerHTML = chart({ xcats: ['對照組', '處理組'], y: [lo, hi], h: 230, ylab: '測量值' }, (X, Y, { iw }) => one.map((g, k) => g.map((cells, j) => { const off = (j - (m - 1) / 2) * Math.min(26, iw / 2 / (m + 1)); return cells.map((v, i) => `<circle cx="${(X(k) + off + ((i * 0.618) % 1 - 0.5) * 8).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.5" style="fill:${col4(j)};fill-opacity:.55"/>`).join('') + `<line x1="${X(k) + off - 8}" x2="${X(k) + off + 8}" y1="${Y(S.mean(cells))}" y2="${Y(S.mean(cells))}" style="stroke:${col4(j)};stroke-width:3"/>`; }).join('')).join(''));
      let fa = 0, fb = 0; const R = 400;
      for (let i = 0; i < R; i++) { const e = exp(m, c, b); if (c > 1 && S.welch(e[0].flat(), e[1].flat()).p < 0.05) fa++; if (S.welch(e[0].map(S.mean), e[1].map(S.mean)).p < 0.05) fb++; }
      const rows = [['細胞當 n（錯）', c > 1 ? fa / R : NaN, 'var(--c2)'], ['小鼠平均（對）', fb / R, 'var(--c1)']];
      $('#wps-r').innerHTML = chart({ ycats: rows.map(r => r[0]), x: [0, Math.max(0.2, ...rows.map(r => r[1] || 0))], h: 150, m: { l: 112 }, xlab: '偽陽性率' }, (X, Y, { M, ih }) => rows.map((r, i) => `<rect x="${X(0)}" y="${Y(i) - ih / 6}" width="${Number.isFinite(r[1]) ? X(r[1]) - X(0) : 0}" height="${ih / 3}" style="fill:${r[2]}"/><text x="${X(r[1] || 0) + 6}" y="${Y(i)}" dy=".32em" style="fill:var(--ink)">${Number.isFinite(r[1]) ? F.n(100 * r[1], 1) + '%' : '—'}</text>`).join('') + `<line x1="${X(0.05)}" x2="${X(0.05)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-dasharray:4 3"/>`);
    };
    $('#wps-go', el).onclick = up; el.addEventListener('change', up); up();
  },
  dag(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], ag = i => (D.age[i] < 60 ? 0 : D.age[i] < 70 ? 1 : 2), tb = ix => { const c = (a, b) => ix.filter(i => D.diabetes[i] === a && D.cvd_event[i] === b).length; return [c(1, 1), c(1, 0), c(0, 1), c(0, 0)]; };
    el.innerHTML = SRC_NOTE + MODE_SEG('wdg-mode') + `<div class="dag" id="wdg-g"></div><div class="w-row" id="wdg-or" hidden>${slider('wdg-s', '吸菸者比不吸菸者更常喝咖啡', 0, 0.6, 0.05, 0.4)}${slider('wdg-t', '咖啡的真實效果（OR）', 0.5, 2, 0.1, 1)}</div><div class="seg wrap" id="wdg-m"><button type="button" data-m="0" aria-selected="true">不校正</button><button type="button" data-m="1" aria-selected="false">校正干擾因子</button></div><div class="chart-wrap" id="wdg-c"></div><div class="kv" id="wdg-k"></div><p class="w-cap" id="wdg-x"></p>`;
    let adj = 0, mode = 'data';
    const up = () => {
      $('#wdg-or').hidden = mode === 'data';
      let crude, mh, tor = null, L;
      if (mode === 'data') {
        L = ['年齡', '糖尿病', '心血管事件', '年齡（已分層）'];
        const [a, b, c, d] = tb(I); crude = a * d / (b * c); let nu = 0, de = 0; for (const k of [0, 1, 2]) { const [a2, b2, c2, d2] = tb(I.filter(i => ag(i) === k)), n = a2 + b2 + c2 + d2; nu += a2 * d2 / n; de += b2 * c2 / n; } mh = nu / de;
      } else {
        L = ['吸菸', '喝咖啡', '肺癌', '吸菸（已校正）'];
        const sd = sv('wdg-s', v => '+' + Math.round(v * 100) + ' 個百分點'); tor = sv('wdg-t', v => v.toFixed(1)); const r = rngOf(99), t = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]];
        for (let i = 0; i < 20000; i++) { const s = r() < 0.3 ? 1 : 0, c = r() < 0.3 + (s ? sd : 0) ? 1 : 0, base = 0.02 * (s ? 6 : 1), od = base / (1 - base) * (c ? tor : 1); t[s][c][r() < od / (1 + od) ? 1 : 0]++; }
        const A = t[0][1][1] + t[1][1][1], B = t[0][1][0] + t[1][1][0], C = t[0][0][1] + t[1][0][1], Dd = t[0][0][0] + t[1][0][0]; crude = A * Dd / (B * C);
        let nu = 0, de = 0; for (const s of [0, 1]) { const [a, b, c, d] = [t[s][1][1], t[s][1][0], t[s][0][1], t[s][0][0]], n = a + b + c + d; nu += a * d / n; de += b * c / n; } mh = nu / de;
      }
      const node = (x, y, s, on, k) => `<g data-k="${k}"><rect x="${x - 50}" y="${y - 18}" width="100" height="36" rx="18" style="fill:${on ? 'var(--soft)' : 'var(--surface)'};stroke:${on ? 'var(--accent)' : 'var(--ink)'};stroke-width:${on ? 2.5 : 1.5}"/><text x="${x}" y="${y}" dy=".35em" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-family:var(--body)">${s}</text></g>`;
      const arr = (x1, y1, x2, y2, c, k, dash) => `<line data-k="${k}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#wdg-ah)" style="stroke:${c};stroke-width:2.2${dash ? ';stroke-dasharray:6 4' : ''}"/>`;
      $('#wdg-g').innerHTML = `<svg viewBox="0 0 320 170" class="dag-svg" role="img" aria-label="因果圖：${L[0]}影響${L[1]}與${L[2]}"><defs><marker id="wdg-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>${arr(140, 46, 82, 118, adj ? 'var(--line)' : 'var(--c2)', 'back conf')}${arr(180, 46, 238, 118, adj ? 'var(--line)' : 'var(--c2)', 'back conf')}${arr(108, 140, 206, 140, 'var(--c1)', 'eff', tor !== null && Math.abs(tor - 1) < 1e-9)}${node(160, 30, adj ? L[3] : L[0], adj, 'conf')}${node(56, 140, L[1], false, 'exp')}${node(264, 140, L[2], false, 'out')}</svg>`;
      const rows = [['未校正 OR', crude, 'var(--c2)', 'crude'], [`校正${L[0]}後 OR`, mh, 'var(--c1)', 'adj']]; if (tor !== null) rows.push(['真實 OR', tor, 'var(--ink)', 'true']);
      $('#wdg-c').innerHTML = chart({ ycats: rows.map(r => r[0]), xlog: true, x: [0.4, 5], h: 60 + rows.length * 36, m: { l: 110 }, xlab: '勝算比（對數尺度）' }, (X, Y, { M, ih }) => `<line x1="${X(1)}" x2="${X(1)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + rows.map(([, e, c, k], i) => { const v = Math.max(0.4, Math.min(5, e)); return `<g data-k="${k}"><circle cx="${X(v)}" cy="${Y(i)}" r="${(adj ? i === 1 : i === 0) ? 9 : 6}" style="fill:${c}"/><text x="${X(v) + 13}" y="${Y(i)}" dy=".32em" style="fill:var(--ink)">${F.n(e, 2)}</text></g>`; }).join(''));
      $('#wdg-k').innerHTML = kvs([['未校正（粗）OR', F.n(crude, 2), 'crude'], [`校正${L[0]}後的 OR`, F.n(mh, 2), 'adj']]);
      $('#wdg-x').textContent = mode === 'data'
        ? (adj ? '把病人分成 60 歲以下、60–69、70 歲以上三層，各層內比較糖尿病與心血管事件再合併：擋住經過年齡的後門路徑，OR 從 2.81 降到 2.31。' : '年齡越大越容易有糖尿病，也越容易發生心血管事件。不校正時，年齡的影響混進了糖尿病的估計。')
        : (adj ? '在吸菸者與不吸菸者中各自比較再合併（Mantel–Haenszel 法），擋住了經過吸菸的後門路徑，估計回到真實值附近。' : '喝咖啡與肺癌之間，除了直接的箭頭，還有一條經過吸菸的「後門路徑」（紅色）。不校正時，吸菸的影響混進了咖啡的估計。');
    };
    segBind(el, '#wdg-mode', b => { mode = b.dataset.m; up(); }); segBind(el, '#wdg-m', b => { adj = +b.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  phack(el) {
    const ways = ['換成次要結果變數', '刪除 3 個「極端值」', '只分析女性', '只分析 60 歲以上', '改用中位數比較', '多校正一個變數', '少校正一個變數', '改看 6 個月的資料', '排除沒按時服藥的人', '把年齡切成兩組', '換一種檢定方法', '只看第二家醫院'];
    let tries = [];
    el.innerHTML = `<p class="w-cap">情境：新藥<b>其實完全無效</b>。你有很多種看似合理的分析選擇，每試一種就得到一個新的 p 值。</p><div class="w-row"><button class="btn pri" type="button" id="wh-go">換一種分析試試</button><button class="btn ghost" type="button" id="wh-re">重來</button></div><div class="tries" id="wh-l"></div><p class="w-out" id="wh-o"></p><figure class="fig"><figcaption>試越多種分析，至少一次 p &lt; 0.05 的機率越高（假設各次獨立）</figcaption><div class="chart-wrap" id="wh-c"></div></figure>`;
    const up = () => {
      const k = tries.length, hit = tries.findIndex(p => p < 0.05);
      $('#wh-l').innerHTML = tries.map((p, i) => `<div class="try ${p < 0.05 ? 'sig' : ''}"><span>${i ? ways[(i - 1) % ways.length] : '原本計畫的分析'}</span><b>p = ${p.toFixed(3)}</b></div>`).join('') || '<p class="small mut">按上面的按鈕開始。</p>';
      $('#wh-c').innerHTML = chart({ x: [0, 20], y: [0, 1], h: 220, xlab: '嘗試了幾種分析', ylab: '機率', xgrid: true }, (X, Y) => `<path d="${Array.from({ length: 21 }, (_, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(1 - Math.pow(0.95, i))}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:2.5"/>` + (k ? `<circle cx="${X(Math.min(20, k))}" cy="${Y(1 - Math.pow(0.95, Math.min(20, k)))}" r="6.5" style="fill:var(--c2)"/>` : ''));
      $('#wh-o').innerHTML = hit >= 0 ? `第 ${hit + 1} 次嘗試得到 p &lt; 0.05。如果論文只報告這一次，讀者會以為無效的藥有效。這就是 p-hacking；事先寫好統計分析計畫可以避免。` : k ? `試了 ${k} 次都不顯著。繼續試試看。` : '';
    };
    $('#wh-go', el).onclick = () => { tries.push(Math.random()); up(); }; $('#wh-re', el).onclick = () => { tries = []; up(); }; up();
  },
  figgood(el) {
    const G = [['對照組', [12, 13, 14, 13.5, 30, 31, 29, 32]], ['處理組', [20, 22, 19, 21, 23, 20, 22, 21.5]]];
    const TX = { se: '兩組看起來幾乎一樣，誤差線很短。SE = SD ÷ √n，所以永遠比 SD 短；圖說沒寫是 SE 時，讀者會以為資料很集中。', sd: '同一份資料換成 SD，誤差線長了很多，印象完全不同。長條圖仍然藏住了資料的形狀。', ci: '95% CI 呈現「平均數估得多準」，適合比較效果，但仍看不到個別資料。', box: '畫出每個點才發現：對照組其實分成兩群（可能是兩種反應型，或批次效應）。小樣本時，請畫出所有資料點。' };
    el.innerHTML = `<div class="seg wrap" id="wfg-m"><button data-m="se" aria-selected="true" type="button">長條 ± SE</button><button data-m="sd" aria-selected="false" type="button">長條 ± SD</button><button data-m="ci" aria-selected="false" type="button">平均 ± 95% CI</button><button data-m="box" aria-selected="false" type="button">箱型 + 每個點</button></div><div class="chart-wrap" id="wfg-c"></div><p class="w-out" id="wfg-t"></p>`;
    let mode = 'se';
    const up = () => {
      $('#wfg-c').innerHTML = chart({ xcats: G.map(g => g[0] + '（n=8）'), y: [0, 36], h: 270, ylab: '測量值' }, (X, Y, { iw }) => G.map(([, v], k) => {
        const x = X(k), m = S.mean(v), sd = S.sd(v), se = sd / Math.sqrt(v.length), h = S.qt(0.975, v.length - 1) * se, bw = iw / 2 * 0.45, c = col4(k);
        if (mode === 'se' || mode === 'sd') { const e = mode === 'se' ? se : sd; return `<rect x="${x - bw / 2}" y="${Y(m)}" width="${bw}" height="${Y(0) - Y(m)}" style="fill:${c};fill-opacity:.75"/><line x1="${x}" x2="${x}" y1="${Y(m - e)}" y2="${Y(m + e)}" class="ink" style="stroke-width:2"/><line x1="${x - 10}" x2="${x + 10}" y1="${Y(m + e)}" y2="${Y(m + e)}" class="ink" style="stroke-width:2"/>`; }
        if (mode === 'ci') return `<line x1="${x}" x2="${x}" y1="${Y(m - h)}" y2="${Y(m + h)}" style="stroke:${c};stroke-width:3"/><line x1="${x - 10}" x2="${x + 10}" y1="${Y(m - h)}" y2="${Y(m - h)}" style="stroke:${c};stroke-width:3"/><line x1="${x - 10}" x2="${x + 10}" y1="${Y(m + h)}" y2="${Y(m + h)}" style="stroke:${c};stroke-width:3"/><circle cx="${x}" cy="${Y(m)}" r="7" style="fill:${c}"/>`;
        const q1 = S.quantile(v, 0.25), q3 = S.quantile(v, 0.75), md = S.median(v);
        return `<rect x="${x - bw / 2}" y="${Y(q3)}" width="${bw}" height="${Y(q1) - Y(q3)}" style="fill:none;stroke:var(--ink);stroke-width:1.5"/><line x1="${x - bw / 2}" x2="${x + bw / 2}" y1="${Y(md)}" y2="${Y(md)}" style="stroke:${c};stroke-width:3"/>` + v.map((y, i) => `<circle cx="${x + ((i * 0.618) % 1 - 0.5) * bw}" cy="${Y(y)}" r="5.5" style="fill:${c};fill-opacity:.8"/>`).join('');
      }).join(''));
      $('#wfg-t').textContent = TX[mode];
    };
    segBind(el, '#wfg-m', b => { mode = b.dataset.m; up(); }); up();
  },
  checklist(el) {
    const items = ['樣本數有事先計算，並寫出依據', '主要結果變數事先指定', '寫明缺失值的數量與處理方式', '模型變數依領域知識選擇，事件數足夠', '多重比較已校正或說明', '檢查了統計假設（常態、變異齊一、比例風險）', '觀察單位正確，沒有偽重複', '次群組分析標明是否事先規劃，並做交互作用檢定', '結論沒有超出資料（相關不等於因果）', '資料與分析程式可供審查或公開'];
    const st = store.get('chk', []), C = 2 * Math.PI * 42;
    const up = () => {
      const k = items.filter((_, i) => st[i]).length;
      el.innerHTML = `<div class="ring-row"><svg viewBox="0 0 100 100" class="ring" role="img" aria-label="已完成 ${k} 項"><circle cx="50" cy="50" r="42" style="fill:none;stroke:var(--sunk);stroke-width:10"/><circle cx="50" cy="50" r="42" transform="rotate(-90 50 50)" style="fill:none;stroke:${k === items.length ? 'var(--good)' : 'var(--eosin)'};stroke-width:10;stroke-linecap:round;stroke-dasharray:${C * k / items.length} ${C}"/><text x="50" y="50" dy=".35em" text-anchor="middle" style="fill:var(--ink);font:600 20px var(--mono)">${k}/${items.length}</text></svg><p>${k === items.length ? '全部確認過了，可以投稿。' : k >= 7 ? '快完成了，補上剩下幾項。' : '拿你的論文逐項檢查，點選已確認的項目。'}</p></div><div class="chk">${items.map((t, i) => `<label class="${st[i] ? 'on' : ''}"><input type="checkbox" id="wck-${i}" data-i="${i}" ${st[i] ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>`;
      $$('input', el).forEach(c => { c.onchange = () => { st[+c.dataset.i] = c.checked; store.set('chk', st); up(); $('#wck-' + c.dataset.i).focus(); }; });
    };
    up();
  },
  tracks(el) {
    const TR = { '臨床／流病': [['傾向分數', '在觀察性研究中模擬隨機分派'], ['多重插補', '正確處理缺失值'], ['競爭風險', '存活分析中有其他事件時'], ['統合分析', '合併多個研究的結果'], ['因果推論', 'DAG、目標試驗模擬']], '基因體／組學': [['RNA-seq 差異表現', 'DESeq2、edgeR、limma'], ['批次效應', '偵測與校正'], ['降維', 'PCA、UMAP'], ['富集分析', 'GO、GSEA'], ['單細胞分析', 'Seurat、Scanpy']], '生態／實驗': [['區集與因子設計', '二因子 ANOVA'], ['廣義線性模型', '計數資料用 Poisson 或負二項'], ['混合模型', '重複測量與群集'], ['實驗設計', '隨機化、盲化、樣本數'], ['空間與時間資料', '物種分佈、時間序列']] };
    let cur = Object.keys(TR)[0];
    const up = () => { el.innerHTML = `<p class="w-cap">選一個方向，看建議的學習順序。</p><div class="seg wrap">${Object.keys(TR).map(k => `<button type="button" data-k="${k}" aria-selected="${k === cur}">${k}</button>`).join('')}</div><ol class="road">${TR[cur].map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>`; $$('[data-k]', el).forEach(b => { b.onclick = () => { cur = b.dataset.k; up(); }; }); };
    up();
  },
});


/* ---------- 基本互動圖（每個數字卡都對應到圖上元素） ---------- */
Object.assign(W, {
  line(el) {
    const d = STUDY(), ix = [...Array(d.n).keys()].filter(i => d.hospital[i] === 'H1'), xs = ix.map(i => d.age[i]), ys = ix.map(i => d.sbp_0[i]), fit = S.pearson(xs, ys);
    const best = S.sum(xs.map((x, i) => (ys[i] - fit.intercept - fit.slope * x) ** 2));
    el.innerHTML = SRC_NOTE + `<p class="w-cap">H1 醫院 ${ix.length} 位病人：橫軸年齡、縱軸基線收縮壓。紅色線段是每個點的殘差。拖動滑桿找一條最貼近的直線。</p><div class="w-row">${slider('wn-a', '截距 a', 60, 200, 1, 150)}${slider('wn-b', '斜率 b', -1, 2, 0.05, 0)}</div><div class="chart-wrap" id="wn-c"></div><div class="kv" id="wn-k"></div><div class="w-row"><button class="btn" id="wn-best" type="button">換成最小平方直線</button></div>`;
    const up = () => {
      const a = sv('wn-a'), b = sv('wn-b', v => v.toFixed(2)), ssr = S.sum(xs.map((x, i) => (ys[i] - a - b * x) ** 2)), cl = v => Math.max(60, Math.min(220, v));
      $('#wn-c').innerHTML = chart({ x: [0, 85], y: [60, 220], xlab: '年齡 x', ylab: '收縮壓 y', h: 300 }, (X, Y) => xs.map((x, i) => `<line data-k="ssr" x1="${X(x)}" x2="${X(x)}" y1="${Y(ys[i])}" y2="${Y(cl(a + b * x))}" style="stroke:var(--c2);stroke-width:1.5;stroke-opacity:.8"/>`).join('')
        + `<line class="keep" data-k="a b" x1="${X(0)}" x2="${X(85)}" y1="${Y(cl(a))}" y2="${Y(cl(a + 85 * b))}" style="stroke:var(--c1);stroke-width:2.5"/>`
        + `<g class="hlx" data-k="a"><circle cx="${X(0)}" cy="${Y(cl(a))}" r="6" style="fill:var(--c1)"/><text x="${X(0) + 10}" y="${Y(cl(a)) - 8}" style="fill:var(--c1)">x = 0 歲時 y = ${a}</text></g>`
        + `<g class="hlx" data-k="b"><line x1="${X(40)}" x2="${X(50)}" y1="${Y(cl(a + 40 * b))}" y2="${Y(cl(a + 40 * b))}" style="stroke:var(--c4);stroke-width:3"/><line x1="${X(50)}" x2="${X(50)}" y1="${Y(cl(a + 40 * b))}" y2="${Y(cl(a + 50 * b))}" style="stroke:var(--c4);stroke-width:3"/><text x="${X(50) + 6}" y="${(Y(cl(a + 40 * b)) + Y(cl(a + 50 * b))) / 2}" dy=".32em" style="fill:var(--c4)">+10 歲 → ${b >= 0 ? '+' : ''}${F.n(10 * b, 1)}</text></g>`
        + `<line class="hlx" data-k="best" x1="${X(0)}" x2="${X(85)}" y1="${Y(fit.intercept)}" y2="${Y(fit.intercept + 85 * fit.slope)}" style="stroke:var(--c3);stroke-width:2.5;stroke-dasharray:6 4"/>`
        + xs.map((x, i) => `<circle cx="${X(x)}" cy="${Y(ys[i])}" r="4.5" style="fill:var(--ink)"/>`).join(''));
      $('#wn-k').innerHTML = kvs([['截距 a', String(a), 'a'], ['斜率 b', b.toFixed(2), 'b'], ['殘差平方和', F.n(ssr, 0), 'ssr'], ['最小可能的殘差平方和', F.n(best, 0), 'best']]);
    };
    el.addEventListener('input', up);
    $('#wn-best', el).onclick = () => { $('#wn-a').value = Math.round(fit.intercept); $('#wn-b').value = (Math.round(fit.slope / 0.05) * 0.05).toFixed(2); up(); };
    up();
  },
  mm(el) {
    const d = STUDY(), I = [...Array(d.n).keys()], V = { sbp_0: ['基線收縮壓（mmHg）', 1], crp: ['CRP（mg/L）', 0.5], ae_count: ['不良事件次數', 1] };
    el.innerHTML = SRC_NOTE + `<div class="seg wrap" id="wm-m"><button type="button" data-m="data" aria-selected="true">用研究資料</button><button type="button" data-m="own" aria-selected="false">自己輸入數字</button></div>
<div class="w-row" id="wm-dr"><label class="fld"><span>變數</span><select id="wm-v">${Object.entries(V).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><label class="fld"><span>醫院</span><select id="wm-h">${HOSP_OPTS('全部')}</select></label></div>
<label class="fld" id="wm-or" hidden><span>輸入數字（以逗號或空白分隔）</span><input id="wm-in" type="text" inputmode="decimal" value="3, 4, 4, 5, 34"></label><div class="chart-wrap" id="wm-c"></div><div class="kv" id="wm-o"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wm-dr').hidden = mode !== 'data'; $('#wm-or').hidden = mode === 'data';
      const vk = $('#wm-v').value, h = $('#wm-h').value, v = mode === 'data' ? I.filter(i => !h || d.hospital[i] === h).map(i => d[vk][i]) : $('#wm-in').value.split(/[\s,，、;；]+/).filter(x => x !== '').map(Number).filter(Number.isFinite);
      if (v.length < 2) { $('#wm-o').innerHTML = '<p class="w-out">至少輸入 2 個數字。</p>'; $('#wm-c').innerHTML = ''; return; }
      const m = S.mean(v), md = S.median(v), s = S.sd(v), q1 = S.quantile(v, 0.25), q3 = S.quantile(v, 0.75), q95 = S.quantile(v, 0.95), [lo, hi] = S.minmax(v), cnt = {};
      const marks = (X, Y, top, base) => `<rect class="hlx" data-k="sd" x="${X(Math.max(lo, m - s))}" y="${Y(top)}" width="${X(Math.min(hi, m + s)) - X(Math.max(lo, m - s))}" height="${Y(base) - Y(top)}" style="fill:var(--c2);fill-opacity:.12"/><rect class="hlx" data-k="iqr" x="${X(q1)}" y="${Y(top)}" width="${X(q3) - X(q1)}" height="${Y(base) - Y(top)}" style="fill:var(--c3);fill-opacity:.15"/>`
        + `<g data-k="mean sd"><line x1="${X(m)}" x2="${X(m)}" y1="${Y(top)}" y2="${Y(base)}" style="stroke:var(--c2);stroke-width:2.5"/><text class="mk" x="${X(m)}" y="${Y(top) - 4}" text-anchor="middle" style="fill:var(--c2)">平均 ${F.n(m)}</text></g>`
        + `<g data-k="med iqr"><line x1="${X(md)}" x2="${X(md)}" y1="${Y(top * 0.86)}" y2="${Y(base)}" style="stroke:var(--c3);stroke-width:2.5;stroke-dasharray:5 3"/><text class="mk" x="${X(md)}" y="${Y(top * 0.86) - 4}" text-anchor="middle" style="fill:var(--c3)">中位數 ${F.n(md)}</text></g>`;
      if (mode === 'data') {
        const bw = V[vk][1] * (vk === 'sbp_0' ? 4 : 1), a = Math.floor(lo / bw) * bw, nb = Math.ceil((hi - a) / bw + 1e-9) || 1, c = new Array(nb).fill(0); v.forEach(x => { c[Math.min(nb - 1, Math.floor((x - a) / bw))]++; });
        const top = Math.max(...c) * 1.25;
        $('#wm-c').innerHTML = chart({ x: [a, a + nb * bw], y: [0, top], h: 230, xlab: V[vk][0], ylab: '人數', m: { t: 30 } }, (X, Y) => c.map((n, i) => { const mid = a + (i + 0.5) * bw, t = mid > q95 ? 'n tail' : 'n'; return `<rect data-k="${t}" x="${X(a + i * bw) + 0.5}" y="${Y(n)}" width="${Math.max(0, X(a + (i + 1) * bw) - X(a + i * bw) - 1)}" height="${Y(0) - Y(n)}" style="fill:${mid > q95 ? 'var(--c4)' : 'var(--c1)'};fill-opacity:.75"/>`; }).join('') + marks(X, Y, top * 0.92, 0));
      } else {
        $('#wm-c').innerHTML = chart({ x: [Math.min(lo, m - s), Math.max(hi, m + s)], y: [0, 1], noY: true, h: 170, m: { t: 30 } }, (X, Y) => v.map(x => { const k = (cnt[x] = (cnt[x] || 0) + 1); return `<circle data-k="n${x > q95 ? ' tail' : ''}" cx="${X(x)}" cy="${Y(0) - 8 - (k - 1) * 13}" r="5.5" style="fill:var(--c1);fill-opacity:.75"/>`; }).join('') + marks(X, Y, 1, 0));
      }
      $('#wm-o').innerHTML = kvs([['n', v.length, 'n'], ['平均數', F.n(m), 'mean'], ['中位數', F.n(md), 'med'], ['標準差 SD', F.n(s), 'sd'], ['IQR（Q1–Q3）', `${F.n(q3 - q1)}（${F.n(q1)}–${F.n(q3)}）`, 'iqr']]);
    };
    segBind(el, '#wm-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  normal(el) {
    const d = STUDY(), I = [...Array(d.n).keys()];
    el.innerHTML = SRC_NOTE + `<p class="w-cap">長條：400 位病人的基線收縮壓；曲線：同樣平均與標準差的常態分佈。拖動 x，比較「常態曲線算出的比例」與「實際的病人比例」。</p><div class="w-row"><label class="fld"><span>醫院</span><select id="wz-h">${HOSP_OPTS('全部')}</select></label>${slider('wz-x', '收縮壓 x', 110, 195, 1, 170)}</div><div class="chart-wrap" id="wz-c"></div><div class="kv" id="wz-o"></div>`;
    const up = () => {
      const h = $('#wz-h').value, v = I.filter(i => !h || d.hospital[i] === h).map(i => d.sbp_0[i]), m = S.mean(v), s = S.sd(v), x = sv('wz-x'), z = (x - m) / s, P = S.pnorm(z), emp = v.filter(t => t <= x).length / v.length, lo = 105, hi = 200, bw = 5, pdf = t => Math.exp(-0.5 * ((t - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)), sc = v.length * bw;
      const c = new Array(19).fill(0); v.forEach(t => { const k = Math.floor((t - lo) / bw); if (k >= 0 && k < 19) c[k]++; }); const top = Math.max(pdf(m) * sc, ...c) * 1.2;
      $('#wz-c').innerHTML = chart({ x: [lo, hi], y: [0, top], h: 250, xlab: '基線收縮壓（mmHg）', ylab: '人數' }, (X, Y) => {
        const path = (a, b) => { let p = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 80; i++) { const t = a + (b - a) * i / 80; p += `L${X(t).toFixed(1)} ${Y(pdf(t) * sc).toFixed(1)}`; } return p + `L${X(b)} ${Y(0)}Z`; };
        let cv = ''; for (let i = 0; i <= 160; i++) { const t = lo + (hi - lo) * i / 160; cv += `${i ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(pdf(t) * sc).toFixed(1)}`; }
        return c.map((n, i) => `<rect data-k="${lo + (i + 1) * bw <= x ? 'emp bar' : 'bar'}" x="${X(lo + i * bw) + 0.5}" y="${Y(n)}" width="${X(lo + (i + 1) * bw) - X(lo + i * bw) - 1}" height="${Y(0) - Y(n)}" style="fill:var(--c1);fill-opacity:.35"/>`).join('')
          + `<path data-k="pl" d="${path(lo, Math.min(hi, x))}" style="fill:var(--c2);fill-opacity:.18"/><path class="hlx" data-k="pr" d="${path(Math.min(hi, x), hi)}" style="fill:var(--c3);fill-opacity:.3"/><path data-k="curve" d="${cv}" style="fill:none;stroke:var(--c2);stroke-width:2.5"/>`
          + [-2, -1, 1, 2].map(k => `<line data-k="z" x1="${X(m + k * s)}" x2="${X(m + k * s)}" y1="${Y(0)}" y2="${Y(pdf(m + k * s) * sc)}" style="stroke:var(--muted);stroke-dasharray:3 3"/>`).join('')
          + `<g class="hlx" data-k="z"><line x1="${X(m)}" x2="${X(x)}" y1="${Y(top * 0.93)}" y2="${Y(top * 0.93)}" style="stroke:var(--c4);stroke-width:3"/><text x="${(X(m) + X(x)) / 2}" y="${Y(top * 0.93) - 6}" text-anchor="middle" style="fill:var(--c4)">${F.n(z, 2)} 個 SD</text></g>`
          + `<line class="keep" x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(top * 0.9)}" style="stroke:var(--ink);stroke-width:2"/>`;
      });
      $('#wz-o').innerHTML = kvs([['平均 μ（這裡用樣本平均）', F.n(m, 1), 'curve'], ['標準差 σ', F.n(s, 1), 'z'], ['z 分數', F.n(z, 2), 'z'], ['P(X ≤ x)：常態曲線', F.n(100 * P, 1) + '%', 'pl'], ['P(X ≤ x)：實際病人比例', F.n(100 * emp, 1) + '%', 'emp'], ['P(X > x)：常態曲線', F.n(100 * (1 - P), 1) + '%', 'pr'], ['百分位', '第 ' + F.n(100 * P, 1), 'pl']]);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  diag(el) {
    const d = STUDY(), I = [...Array(d.n).keys()];
    el.innerHTML = SRC_NOTE + MODE_SEG('wd-m') + `<div id="wd-dr"><div class="w-row"><label class="fld"><span>判讀者</span><select id="wd-r"><option value="ecg_readA">醫師 A 判讀心電圖</option><option value="ecg_readB">醫師 B 判讀心電圖</option></select></label></div><p class="w-cap">黃金標準：心臟超音波診斷左心室肥大。下表是研究中 400 位病人的實際結果。</p><div class="tbl-wrap" id="wd-t0"></div></div>
<div class="w-row" id="wd-or" hidden>${slider('wd-se', '敏感度', 50, 100, 0.5, 90, '%')}${slider('wd-sp', '特異度', 50, 100, 0.5, 95, '%')}</div>
<div class="w-row">${slider('wd-pr', '把同一個檢驗用在盛行率…的族群', 0.1, 50, 0.1, 20.5, '%')}</div><div class="tbl-wrap" id="wd-t"></div><div id="wd-bar"></div><div class="kv" id="wd-o"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wd-dr').hidden = mode !== 'data'; $('#wd-or').hidden = mode === 'data';
      let se, sp;
      if (mode === 'data') { const rc = $('#wd-r').value, c = (l, r) => I.filter(i => d.lvh_echo[i] === l && d[rc][i] === r).length, tp = c(1, 1), fn = c(1, 0), fp = c(0, 1), tn = c(0, 0); se = tp / (tp + fn); sp = tn / (tn + fp);
        $('#wd-t0').innerHTML = `<table class="st"><thead><tr><th>400 位病人</th><th>超音波：有肥大 ${tp + fn}</th><th>沒有 ${fp + tn}</th></tr></thead><tbody><tr><td>判讀陽性</td><td class="good" data-k="sens">${tp}</td><td class="bad" data-k="spec">${fp}</td></tr><tr><td>判讀陰性</td><td class="bad" data-k="sens">${fn}</td><td class="good" data-k="spec">${tn}</td></tr></tbody></table>`; }
      else { se = sv('wd-se', v => v + '%') / 100; sp = sv('wd-sp', v => v + '%') / 100; }
      const pr = sv('wd-pr', v => v + '%') / 100;
      const N = 10000, D = N * pr, TP = D * se, FN = D - TP, H = N - D, TN = H * sp, FP = H - TN, ppv = TP / (TP + FP), npv = TN / (TN + FN), r = v => Math.round(v).toLocaleString(), tot = TP + FP;
      $('#wd-t').innerHTML = `<p class="w-cap">換算成 10,000 人、盛行率 ${F.n(100 * pr, 1)}% 的族群：</p><table class="st"><thead><tr><th>10,000 人</th><th>有病 ${r(D)}</th><th>沒病 ${r(H)}</th></tr></thead><tbody><tr><td>陽性</td><td class="good" data-k="ppv sens tp">真陽性 ${r(TP)}</td><td class="bad" data-k="ppv spec fp">偽陽性 ${r(FP)}</td></tr><tr><td>陰性</td><td class="bad" data-k="npv sens fn">偽陰性 ${r(FN)}</td><td class="good" data-k="npv spec">真陰性 ${r(TN)}</td></tr></tbody></table>`;
      $('#wd-bar').innerHTML = `<p class="w-cap">檢驗陽性的 ${r(tot)} 人組成</p><div class="hbar"><i data-k="ppv" style="width:${100 * TP / tot}%;background:var(--c3)"></i><i data-k="ppv fp" style="width:${100 * FP / tot}%;background:var(--c2)"></i></div>${legend([['var(--c3)', `真陽性 ${r(TP)}`], ['var(--c2)', `偽陽性 ${r(FP)}`]])}`;
      $('#wd-o').innerHTML = kvs([['陽性預測值 PPV', F.n(100 * ppv, 1) + '%', 'ppv'], ['陰性預測值 NPV', F.n(100 * npv, 2) + '%', 'npv'], ['敏感度', F.n(100 * se, 1) + '%', 'sens'], ['特異度', F.n(100 * sp, 1) + '%', 'spec']]);
    };
    segBind(el, '#wd-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  clt(el) {
    const D = STUDY(), POP = { crp: ['CRP（右偏）', D.crp, 0, 16], sbp_0: ['基線收縮壓（左右對稱）', D.sbp_0, 105, 195], ae_count: ['不良事件次數（只有 0、1、2…）', D.ae_count, -0.5, 4.5] };
    el.innerHTML = SRC_NOTE + `<p class="w-cap">把研究的 400 位病人當成「母體」，每次隨機抽 n 人算平均，重複 2,000 次。</p><div class="w-row"><label class="fld"><span>母體（變數）</span><select id="wc-p">${Object.entries(POP).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label>${slider('wc-n', '每次抽樣人數 n', 1, 50, 1, 2)}</div><div class="w-row"><button class="btn" id="wc-go" type="button">重新抽樣 2,000 次</button></div><div class="w-cols"><figure class="fig"><figcaption>母體：400 位病人的原始資料</figcaption><div class="chart-wrap" id="wc-a"></div></figure><figure class="fig"><figcaption>2,000 個樣本平均數</figcaption><div class="chart-wrap" id="wc-b"></div></figure></div><div class="kv" id="wc-o"></div>`;
    const up = () => {
      const [, pop, lo, hi] = POP[$('#wc-p').value], n = sv('wc-n'), mu = S.mean(pop), sd = Math.sqrt(S.mean(pop.map(v => (v - mu) ** 2))), means = Array.from({ length: 2000 }, () => { let s = 0; for (let i = 0; i < n; i++) s += pop[Math.floor(Math.random() * pop.length)]; return s / n; });
      const mm = S.mean(means), sdm = S.sd(means), se = sd / Math.sqrt(n);
      const band = (X, a, b, k, c, y) => `<g class="hlx" data-k="${k}"><line x1="${X(a)}" x2="${X(b)}" y1="${y}" y2="${y}" style="stroke:${c};stroke-width:4"/></g>`;
      $('#wc-a').innerHTML = histChart(pop.filter(v => v >= lo && v <= hi), { lo, hi, bins: 30, h: 200, color: () => 'var(--muted)', tag: () => 'pop', noY: true, extra: (X, Y) => `<line class="hlx" data-k="mm" x1="${X(mu)}" x2="${X(mu)}" y1="${Y(0)}" y2="${Y(0) - 150}" style="stroke:var(--c2);stroke-width:2.5"/>` });
      $('#wc-b').innerHTML = histChart(means.filter(v => v >= lo && v <= hi), { lo, hi, bins: 40, h: 200, noY: true, tag: () => 'means', extra: (X, Y) => `<line class="hlx" data-k="mm" x1="${X(mm)}" x2="${X(mm)}" y1="${Y(0)}" y2="${Y(0) - 150}" style="stroke:var(--c2);stroke-width:2.5"/>` + band(X, mm - sdm, mm + sdm, 'sdm', 'var(--c2)', Y(0) - 150) + band(X, mm - se, mm + se, 'se', 'var(--c4)', Y(0) - 140) });
      $('#wc-o').innerHTML = kvs([['樣本平均數的平均', F.n(mm, 2) + `（母體 μ = ${F.n(mu, 2)}）`, 'mm'], ['平均數的標準差（模擬）', F.n(sdm, 3), 'sdm'], [`理論標準誤 σ ÷ √n（σ = ${F.n(sd, 2)}）`, F.n(se, 3), 'se']]);
    };
    $('#wc-p').onchange = up; $('#wc-n').oninput = up; $('#wc-go').onclick = up; up();
  },
  ci(el) {
    const pop = STUDY().sbp_0, mu = S.mean(pop);
    el.innerHTML = SRC_NOTE + `<div class="w-row">${slider('wi-n', '樣本數 n', 5, 100, 1, 20)}<label class="fld"><span>信賴水準</span><select id="wi-c"><option value="0.90">90%</option><option value="0.95" selected>95%</option><option value="0.99">99%</option></select></label></div><div class="w-row"><button class="btn" id="wi-go" type="button">再做 50 次研究</button></div><p class="w-cap">母體＝研究的 400 位病人，真值 μ = 全部人的平均收縮壓 ${F.n(mu, 1)}（黑線）。每次研究隨機抽 n 人，每條橫線是那次研究算出的信賴區間。</p><div class="chart-wrap" id="wi-ch"></div><div class="kv" id="wi-o"></div>`;
    const up = () => {
      const n = sv('wi-n'), cl = +$('#wi-c').value, tc = S.qt(1 - (1 - cl) / 2, n - 1);
      const iv = Array.from({ length: 50 }, () => { const x = Array.from({ length: n }, () => pop[Math.floor(Math.random() * pop.length)]), m = S.mean(x), h = tc * S.sd(x) / Math.sqrt(n); return [m - h, m + h, m]; });
      const hit = iv.filter(([a, b]) => a <= mu && b >= mu).length, lo = Math.min(...iv.map(v => v[0])), hi = Math.max(...iv.map(v => v[1])), wd = S.mean(iv.map(v => v[1] - v[0]));
      $('#wi-ch').innerHTML = chart({ x: [Math.min(lo, mu - 15), Math.max(hi, mu + 15)], y: [0, 51], noY: true, h: 380, xlab: '收縮壓（mmHg）', xgrid: true }, (X, Y) => `<line data-k="mu" x1="${X(mu)}" x2="${X(mu)}" y1="${Y(51)}" y2="${Y(0)}" style="stroke:var(--ink);stroke-width:1.5"/>` + iv.map(([a, b, m], i) => { const ok = a <= mu && b >= mu, c = ok ? 'var(--c1)' : 'var(--c2)'; return `<g data-k="${ok ? 'hit' : 'miss'} wd"><line x1="${X(a)}" x2="${X(b)}" y1="${Y(i + 1)}" y2="${Y(i + 1)}" style="stroke:${c};stroke-width:${ok ? 2 : 3}"/><circle cx="${X(m)}" cy="${Y(i + 1)}" r="2.5" style="fill:${c}"/></g>`; }).join(''));
      $('#wi-o').innerHTML = kvs([['涵蓋 μ 的區間', `${hit} / 50`, 'hit'], ['沒涵蓋 μ 的區間', `${50 - hit} / 50`, 'miss'], ['區間平均寬度', F.n(wd, 1), 'wd']]);
    };
    $('#wi-n').oninput = up; $('#wi-c').onchange = up; $('#wi-go').onclick = up; up();
  },
  pdist(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], ch = (g, c) => I.filter(i => D.group[i] === g && D[c][i] != null).map(i => D[c][i] - D.sbp_0[i]), half = (a, k) => a.filter((_, i) => i % 2 === k);
    const SC = { null: ['安慰劑 vs 安慰劑（兩組其實沒差）', half(ch('placebo', 'sbp_12'), 0), half(ch('placebo', 'sbp_12'), 1)], w4: ['新藥 vs 安慰劑：第 4 週血壓變化', ch('placebo', 'sbp_4'), ch('drug', 'sbp_4')], w12: ['新藥 vs 安慰劑：第 12 週血壓變化', ch('placebo', 'sbp_12'), ch('drug', 'sbp_12')] };
    el.innerHTML = SRC_NOTE + `<div class="w-row"><label class="fld"><span>每次實驗比較的兩組</span><select id="wp-v">${Object.entries(SC).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label>${slider('wp-n', '每組樣本數', 5, 100, 1, 20)}</div><div class="w-row"><button class="btn" id="wp-go" type="button">再跑 1,000 次</button></div><p class="w-cap">每次實驗從兩組病人中各隨機抽 n 人，比較平均，算出一個 p 值；下圖是 1,000 個 p 值的分佈。</p><div class="chart-wrap" id="wp-c"></div><div class="kv" id="wp-o"></div>`;
    const up = () => {
      const [, A, B] = SC[$('#wp-v').value], n = sv('wp-n'), pick = a => Array.from({ length: n }, () => a[Math.floor(Math.random() * a.length)]), sp = Math.sqrt((S.variance(A) + S.variance(B)) / 2), dd = Math.abs(S.mean(B) - S.mean(A)) / sp, nul = $('#wp-v').value === 'null';
      const ps = Array.from({ length: 1000 }, () => S.welch(pick(A), pick(B)).p), sig = ps.filter(p => p < 0.05).length, th = nul ? 0.05 : S.powerMeans(dd, n, 0.05);
      $('#wp-c').innerHTML = histChart(ps, { lo: 0, hi: 1, bins: 20, h: 240, xlab: 'p 值', ylab: '實驗次數', color: i => (i === 0 ? 'var(--c2)' : 'var(--c1)'), tag: i => (i === 0 ? 'sig' : 'pv'), extra: (X, Y) => `<g class="hlx" data-k="th"><line x1="${X(0)}" x2="${X(0.05)}" y1="${Y(th * 1000)}" y2="${Y(th * 1000)}" style="stroke:var(--c4);stroke-width:3"/></g>` });
      $('#wp-o').innerHTML = kvs([['p < 0.05 的實驗', `${sig} / 1000（${F.n(sig / 10, 1)}%）`, 'sig'], [nul ? '理論值（α）' : `理論值（檢定力；效果量 d = ${F.n(dd, 2)}）`, F.n(100 * th, 1) + '%', 'th']]);
    };
    el.addEventListener('change', up); $('#wp-n').oninput = up; $('#wp-go').onclick = up; up();
  },
  power(el) {
    el.innerHTML = `<div class="seg" role="tablist" id="ww-mode"><button type="button" data-m="m" aria-selected="true">比較兩組平均</button><button type="button" data-m="p" aria-selected="false">比較兩組比例</button></div>
<div class="w-row" id="ww-mean"><label class="fld"><span>想偵測的最小差異 Δ</span><input id="ww-delta" type="number" inputmode="decimal" value="5" step="any"></label><label class="fld"><span>標準差 SD</span><input id="ww-sd" type="number" inputmode="decimal" value="10" step="any" min="0"></label></div>
<div class="w-row" id="ww-prop" hidden><label class="fld"><span>對照組比例 p₁</span><input id="ww-p1" type="number" inputmode="decimal" value="0.30" step="0.01" min="0.01" max="0.99"></label><label class="fld"><span>處理組比例 p₂</span><input id="ww-p2" type="number" inputmode="decimal" value="0.20" step="0.01" min="0.01" max="0.99"></label></div>
<div class="w-row"><label class="fld"><span>α（雙尾）</span><select id="ww-a"><option>0.05</option><option>0.01</option><option>0.1</option></select></label><label class="fld"><span>檢定力</span><select id="ww-pw"><option>0.8</option><option>0.9</option><option>0.95</option></select></label><label class="fld"><span>預期流失率（%）</span><input id="ww-drop" type="number" inputmode="numeric" value="10" min="0" max="80" step="1"></label></div>
<div class="w-row"><button class="btn ghost" type="button" id="ww-fill">用研究資料填入（規劃下一個試驗）</button></div><p class="w-cap" id="ww-src"></p><div class="chart-wrap" id="ww-c"></div><div class="kv" id="ww-o"></div><p class="w-out" id="ww-txt"></p>`;
    let mode = 'm';
    const fill = () => { const D = STUDY(), I = [...Array(D.n).keys()], ch = I.filter(i => D.sbp_12[i] != null).map(i => D.sbp_12[i] - D.sbp_0[i]), pl = I.filter(i => D.group[i] === 'placebo'), sdc = S.sd(ch), p1 = S.mean(pl.map(i => D.cvd_event[i]));
      if (mode === 'm') { $('#ww-delta').value = 5; $('#ww-sd').value = sdc.toFixed(1); $('#ww-src').textContent = `研究中第 12 週血壓變化的標準差約 ${F.n(sdc, 1)} mmHg；假設下一個試驗想偵測 5 mmHg 的差異。`; }
      else { $('#ww-p1').value = p1.toFixed(2); $('#ww-p2').value = (p1 * 0.75).toFixed(2); $('#ww-src').textContent = `研究中安慰劑組 36 個月心血管事件比例約 ${F.n(100 * p1, 1)}%；假設新藥讓它減少 25%。`; }
      $('#ww-src').hidden = false; el.dispatchEvent(new Event('input')); };
    segBind(el, '#ww-mode', b => { mode = b.dataset.m; $('#ww-mean').hidden = mode !== 'm'; $('#ww-prop').hidden = mode !== 'p'; up(); });
    const up = () => {
      const a = +$('#ww-a').value, pw = +$('#ww-pw').value, drop = Math.min(80, Math.max(0, +$('#ww-drop').value || 0)) / 100; let n, pf, txt;
      if (mode === 'm') {
        const dl = +$('#ww-delta').value, sd = +$('#ww-sd').value; if (!(dl !== 0 && sd > 0)) { $('#ww-o').innerHTML = '<p class="w-out">請輸入非零的差異與正的標準差。</p>'; return; }
        const d = Math.abs(dl / sd); n = S.nMeans(d, a, pw); pf = k => S.powerMeans(d, k, a);
        txt = `雙尾 α = ${a}、檢定力 ${pw * 100}%、平均差 ${Math.abs(dl)}、標準差 ${sd}（d = ${F.n(d, 2)}）：每組 ${n} 位；預期流失 ${Math.round(drop * 100)}%，每組收納 ${Math.ceil(n / (1 - drop))} 位，共 ${2 * Math.ceil(n / (1 - drop))} 位。`;
      } else {
        const p1 = +$('#ww-p1').value, p2 = +$('#ww-p2').value; if (!(p1 > 0 && p1 < 1 && p2 > 0 && p2 < 1 && p1 !== p2)) { $('#ww-o').innerHTML = '<p class="w-out">比例需介於 0 與 1 之間，且兩組不同。</p>'; return; }
        n = S.nProps(p1, p2, a, pw); pf = k => S.powerProps(p1, p2, k, a);
        txt = `雙尾 α = ${a}、檢定力 ${pw * 100}%、事件比例 ${F.n(100 * p1, 0)}% 對 ${F.n(100 * p2, 0)}%：每組 ${n} 位；預期流失 ${Math.round(drop * 100)}%，每組收納 ${Math.ceil(n / (1 - drop))} 位，共 ${2 * Math.ceil(n / (1 - drop))} 位。`;
      }
      const adj = Math.ceil(n / (1 - drop)), nmax = Math.max(10, Math.ceil(adj * 1.6)), pts = Array.from({ length: 81 }, (_, i) => 2 + (nmax - 2) * i / 80);
      $('#ww-c').innerHTML = chart({ x: [0, nmax], y: [0, 1], xlab: '每組樣本數', ylab: '檢定力', h: 260, xgrid: true }, (X, Y, { M, iw }) => `<line data-k="n" x1="${M.l}" x2="${M.l + iw}" y1="${Y(pw)}" y2="${Y(pw)}" style="stroke:var(--muted);stroke-dasharray:5 4"/><line data-k="n" x1="${X(n)}" x2="${X(n)}" y1="${Y(0)}" y2="${Y(pw)}" style="stroke:var(--c2);stroke-dasharray:5 4"/><path class="keep" d="${pts.map((k, i) => `${i ? 'L' : 'M'}${X(k).toFixed(1)} ${Y(pf(k)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/><circle data-k="n" cx="${X(n)}" cy="${Y(pw)}" r="5.5" style="fill:var(--c2)"/><g class="hlx" data-k="adj tot"><line x1="${X(adj)}" x2="${X(adj)}" y1="${Y(0)}" y2="${Y(pf(adj))}" style="stroke:var(--c4);stroke-width:2.5"/><circle cx="${X(adj)}" cy="${Y(pf(adj))}" r="5" style="fill:var(--c4)"/></g>`);
      $('#ww-o').innerHTML = kvs([['每組所需', n.toLocaleString(), 'n'], ['考量流失後每組', adj.toLocaleString(), 'adj'], ['總收案數', (2 * adj).toLocaleString(), 'tot']]);
      $('#ww-txt').innerHTML = `<span class="lbl">數字的標準寫法</span>${esc(txt)}`;
    };
    $('#ww-fill', el).onclick = fill; el.addEventListener('input', e => { if (e.isTrusted) $('#ww-src').hidden = true; up(); }); el.addEventListener('change', up); up();
  },
});


/* ---------- 第 5 階段：ANOVA 與實驗設計 ---------- */
Object.assign(W, {
  anovaassume(el) {
    const base = [0, 1, 2].map(k => std(Array.from({ length: 60 }, normOf(rngOf(31 + k)))));
    const D = STUDY(), I = [...Array(D.n).keys()], V = { sbp_0: ['基線收縮壓', i => D.sbp_0[i]], crp: ['CRP', i => D.crp[i]], lcrp: ['ln(CRP)', i => Math.log(D.crp[i])] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wq-m') + `<div class="w-row" id="wq-dr"><label class="fld"><span>4 個年齡組比較</span><select id="wq-v">${Object.entries(V).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label></div><div id="wq-or" hidden><p class="w-cap">三組資料，真實平均都相同。調整分佈形狀與變異數，看 Q-Q 圖和各種檢定的反應。</p>
<div class="seg wrap" id="wq-s"><button type="button" data-s="norm" aria-selected="true">常態</button><button type="button" data-s="skew" aria-selected="false">右偏</button></div>
<div class="w-row">${slider('wq-r', 'C 組標準差是 A 組的幾倍', 1, 5, 0.5, 1)}${slider('wq-n', '每組人數', 5, 40, 1, 12)}</div>
<label class="tog"><input type="checkbox" id="wq-u"> C 組人數只有一半</label></div>
<div class="w-cols"><figure class="fig"><figcaption>各組資料</figcaption><div class="chart-wrap" id="wq-b"></div></figure><figure class="fig"><figcaption>殘差的 Q-Q 圖</figcaption><div class="chart-wrap" id="wq-q"></div></figure></div>
<div class="kv" id="wq-k"></div>
<div class="w-row" id="wq-gor" hidden><button class="btn" type="button" id="wq-go">模擬 500 次：真實無差異時的偽陽性率</button></div><div class="chart-wrap" id="wq-sim"></div>`;
    let shape = 'norm', sim = null, mode = 'data';
    const make = (r, n, unb, shp, zs) => zs.map((z, k) => { const m = k === 2 && unb ? Math.max(3, Math.round(n / 2)) : n, sd = k === 2 ? r : 1; return z.slice(0, m).map(x => (shp === 'skew' ? 10 * Math.exp(0.6 * sd * x - 0.18 * sd * sd) : 10 + 2 * sd * x)); });
    const up = () => {
      $('#wq-dr').hidden = mode !== 'data'; $('#wq-or').hidden = mode === 'data'; $('#wq-gor').hidden = mode === 'data'; if (mode === 'data') $('#wq-sim').innerHTML = '';
      const r = sv('wq-r', v => v.toFixed(1)), n = sv('wq-n'), unb = $('#wq-u').checked, gv = mode === 'data' ? [0, 1, 2, 3].map(k => I.filter(i => ageg(D.age[i]) === k).map(V[$('#wq-v').value][1])) : make(r, n, unb, shape, base), labs = mode === 'data' ? AGEG : ['A', 'B', 'C'];
      const A = S.anova(gv), Wl = S.welchAnova(gv), L = S.levene(gv), K = S.kruskal(gv), sds = gv.map(S.sd), ratio = Math.max(...sds) / Math.min(...sds);
      $('#wq-b').innerHTML = boxStrip(gv.map((v, k) => ({ label: labs[k], v })), mode === 'data' ? V[$('#wq-v').value][0] : '測量值', (X, Y, { bw }) => gv.map((g, k) => { const m = S.mean(g), sd = S.sd(g), x = X(k) - bw / 2 - 10; return `<line class="hlx" data-k="spread" x1="${x}" x2="${x}" y1="${Y(m - sd)}" y2="${Y(m + sd)}" style="stroke:var(--c2);stroke-width:4"/><line class="hlx" data-k="means" x1="${X(k) - bw}" x2="${X(k) + bw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--c4);stroke-width:3"/>`; }).join(''));
      const res = gv.flatMap(g => { const m = S.mean(g); return g.map(v => v - m); }), sr = Float64Array.from(res).sort(), sdr = S.sd(res), nn = sr.length, th = Array.from(sr, (_, i) => S.qnorm((i + 0.5) / nn) * sdr);
      const [lo, hi] = S.minmax([...sr, ...th]);
      $('#wq-q').innerHTML = chart({ x: [lo, hi], y: [lo, hi], h: 260, xlab: '常態分佈的理論位置', ylab: '殘差（排序後）' }, (X, Y) => `<line class="keep" x1="${X(lo)}" y1="${Y(lo)}" x2="${X(hi)}" y2="${Y(hi)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + Array.from(sr, (v, i) => `<circle data-k="qq" cx="${X(th[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.7"/>`).join(''));
      $('#wq-k').innerHTML = kvs([['標準差 最大 ÷ 最小', F.n(ratio, 2), 'spread'], ['Levene 檢定 p', F.p(L.p), 'spread'], ['一般 ANOVA p', F.p(A.p), 'means'], ['Welch ANOVA p', F.p(Wl.p), 'means'], ['Kruskal–Wallis p', F.p(K.p), 'rank']]);
      if (sim && mode !== 'data') drawSim();
    };
    const drawSim = () => {
      const rows = [['一般 ANOVA', sim[0], 'var(--c2)', 'fa'], ['Welch ANOVA', sim[1], 'var(--c1)', 'fw'], ['Kruskal–Wallis', sim[2], 'var(--c3)', 'fk']];
      $('#wq-sim').innerHTML = chart({ ycats: rows.map(r => r[0]), x: [0, Math.max(0.12, ...rows.map(r => r[1]))], h: 170, m: { l: 110 }, xlab: '偽陽性率（p < 0.05 的比例）' }, (X, Y, { M, ih }) => rows.map((r, i) => `<rect data-k="${r[3]}" x="${X(0)}" y="${Y(i) - ih / 8}" width="${X(r[1]) - X(0)}" height="${ih / 4}" style="fill:${r[2]}"/><text x="${X(r[1]) + 6}" y="${Y(i)}" dy=".32em" style="fill:var(--ink)">${F.n(100 * r[1], 1)}%</text>`).join('') + `<line class="keep" x1="${X(0.05)}" x2="${X(0.05)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-dasharray:4 3"/>`);
      $('#wq-sim').insertAdjacentHTML('beforeend', `<div class="kv">${kvs([['一般 ANOVA 偽陽性率', F.n(100 * sim[0], 1) + '%', 'fa'], ['Welch ANOVA 偽陽性率', F.n(100 * sim[1], 1) + '%', 'fw'], ['Kruskal–Wallis 偽陽性率', F.n(100 * sim[2], 1) + '%', 'fk']])}</div>`);
    };
    const runSim = () => {
      const r = +$('#wq-r').value, n = +$('#wq-n').value, unb = $('#wq-u').checked, c = [0, 0, 0], R = 500;
      for (let i = 0; i < R; i++) { const gv = make(r, n, unb, shape, [0, 1, 2].map(() => Array.from({ length: 60 }, rnorm))); if (S.anova(gv).p < 0.05) c[0]++; if (S.welchAnova(gv).p < 0.05) c[1]++; if (S.kruskal(gv).p < 0.05) c[2]++; }
      sim = c.map(v => v / R); drawSim();
    };
    segBind(el, '#wq-s', b => { shape = b.dataset.s; sim = null; $('#wq-sim').innerHTML = ''; up(); });
    const reset = () => { sim = null; $('#wq-sim').innerHTML = ''; up(); };
    $('#wq-r').oninput = reset; $('#wq-n').oninput = reset; $('#wq-u').onchange = reset; $('#wq-go', el).onclick = runSim; segBind(el, '#wq-m', b => { mode = b.dataset.m; up(); }); $('#wq-v', el).onchange = up; up();
  },
  posthoc(el) {
    const z = [0, 1, 2, 3].map(k => std(Array.from({ length: 30 }, normOf(rngOf(51 + k))))), names = ['對照', 'A', 'B', 'C'];
    const D = STUDY(), I = [...Array(D.n).keys()];
    el.innerHTML = SRC_NOTE + MODE_SEG('wh2-src') + `<p class="w-cap" id="wh2-cap"></p><div id="wh2-or" hidden>
<div class="w-row">${slider('wh2-a', 'A 比對照高', 0, 6, 0.5, 0)}${slider('wh2-b', 'B 比對照高', 0, 6, 0.5, 2)}${slider('wh2-c', 'C 比對照高', 0, 6, 0.5, 4)}</div>
<div class="w-row">${slider('wh2-s', '組內標準差', 1, 6, 0.5, 2.5)}${slider('wh2-n', '每組株數', 4, 30, 1, 8)}</div></div>
<div class="seg wrap" id="wh2-m"><button type="button" data-m="none" aria-selected="false">未校正</button><button type="button" data-m="bonf" aria-selected="false">Bonferroni</button><button type="button" data-m="tukey" aria-selected="true">Tukey</button></div>
<figure class="fig"><figcaption>各組資料與字母標記（依目前選的方法）</figcaption><div class="chart-wrap" id="wh2-b2"></div></figure>
<figure class="fig"><figcaption>所有兩兩比較的平均差與信賴區間；區間不含 0（虛線）即判定有差異</figcaption><div class="chart-wrap" id="wh2-f"></div></figure>
<div class="kv" id="wh2-k"></div>
<div class="w-row" id="wh2-gor" hidden><button class="btn" type="button" id="wh2-go">模擬 500 次：真實全部沒有差異時，至少一對被判定有差的比例</button></div><div class="chart-wrap" id="wh2-sim"></div>`;
    let method = 'tukey', sim = null, src = 'data', names0 = names.slice();
    const make = (eff, sd, n, zs) => zs.map((zz, k) => zz.slice(0, n).map(x => 30 + eff[k] + sd * x));
    const compare = (gv, m) => {
      const A = S.anova(gv), k = gv.length, mm = k * (k - 1) / 2, T = S.tukey(gv), out = [];
      T.pairs.forEach(x => {
        const se = Math.sqrt(A.msw * (1 / gv[x.i].length + 1 / gv[x.j].length)), t = x.diff / se, praw = S.pt2(t, A.df2);
        const crit = m === 'tukey' ? T.qcrit / Math.SQRT2 : S.qt(1 - (m === 'bonf' ? 0.05 / mm : 0.05) / 2, A.df2);
        out.push({ ...x, p: m === 'tukey' ? x.p : m === 'bonf' ? Math.min(1, praw * mm) : praw, lo: x.diff - crit * se, hi: x.diff + crit * se });
      });
      return out;
    };
    const up = () => {
      $('#wh2-or').hidden = src === 'data'; $('#wh2-gor').hidden = src === 'data'; if (src === 'data') $('#wh2-sim').innerHTML = '';
      $('#wh2-cap').textContent = src === 'data' ? '四個年齡組的基線收縮壓。看事後比較與字母標記。' : '四組植株：對照組和三種肥料。調整各組的真實效果，看事後比較與字母標記怎麼變。';
      names.splice(0, 4, ...(src === 'data' ? AGEG : names0));
      const eff = [0, sv('wh2-a', v => v.toFixed(1)), sv('wh2-b', v => v.toFixed(1)), sv('wh2-c', v => v.toFixed(1))], sd = sv('wh2-s', v => v.toFixed(1)), n = sv('wh2-n'), gv = src === 'data' ? [0, 1, 2, 3].map(k => I.filter(i => ageg(D.age[i]) === k).map(i => D.sbp_0[i])) : make(eff, sd, n, z);
      const pr = compare(gv, method), sig = names.map(() => names.map(() => false)); pr.forEach(x => { sig[x.i][x.j] = sig[x.j][x.i] = x.p < 0.05; });
      const L = cld(gv.map(S.mean), sig), nsig = pr.filter(x => x.p < 0.05).length;
      $('#wh2-b2').innerHTML = boxStrip(gv.map((v, k) => ({ label: names[k], v })), src === 'data' ? '基線收縮壓' : '株高', (X, Y, { M }) => L.map((l, k) => `<text data-k="cld" x="${X(k)}" y="${M.t + 12}" text-anchor="middle" style="fill:var(--ink);font-size:15px;font-weight:700">${l}</text>`).join(''));
      $('#wh2-f').innerHTML = forestChart(pr.map((x, idx) => ({ k: (x.p < 0.05 ? 'sigp ' : '') + 'allp', label: `${names[x.j]} − ${names[x.i]}`, est: x.diff, lo: x.lo, hi: x.hi })), '平均差', false);
      $('#wh2-k').innerHTML = kvs([['兩兩比較的對數', '6 對', 'allp'], ['未校正時的家族錯誤率', F.n(100 * (1 - Math.pow(0.95, 6)), 1) + '%', 'allp'], ['判定有差異的對數', `${nsig} 對`, 'sigp'], ['字母標記', L.map((l, k) => `${names[k]} ${l}`).join('、'), 'cld']]);
      if (sim && src !== 'data') drawSim();
    };
    const drawSim = () => {
      const rows = [['未校正', sim[0], 'var(--c2)', 'sn'], ['Bonferroni', sim[1], 'var(--c3)', 'sb'], ['Tukey', sim[2], 'var(--c1)', 'st']];
      $('#wh2-sim').innerHTML = chart({ ycats: rows.map(r => r[0]), x: [0, Math.max(0.3, ...rows.map(r => r[1]))], h: 170, m: { l: 90 }, xlab: '至少一對被判定有差的比例' }, (X, Y, { M, ih }) => rows.map((r, i) => `<rect data-k="${r[3]}" x="${X(0)}" y="${Y(i) - ih / 8}" width="${X(r[1]) - X(0)}" height="${ih / 4}" style="fill:${r[2]}"/><text x="${X(r[1]) + 6}" y="${Y(i)}" dy=".32em" style="fill:var(--ink)">${F.n(100 * r[1], 1)}%</text>`).join('') + `<line class="keep" x1="${X(0.05)}" x2="${X(0.05)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-dasharray:4 3"/>`)
        + `<div class="kv">${kvs([['未校正的家族錯誤率（模擬）', F.n(100 * sim[0], 1) + '%', 'sn'], ['Bonferroni（模擬）', F.n(100 * sim[1], 1) + '%', 'sb'], ['Tukey（模擬）', F.n(100 * sim[2], 1) + '%', 'st']])}</div>`;
    };
    const runSim = () => {
      const sd = +$('#wh2-s').value, n = +$('#wh2-n').value, c = [0, 0, 0], R = 500;
      const df = 4 * n - 4, tc = [S.qt(0.975, df), S.qt(1 - 0.025 / 6, df), S.qtukey(0.95, 4, df) / Math.SQRT2];
      for (let r = 0; r < R; r++) {
        const gv = make([0, 0, 0, 0], sd, n, [0, 1, 2, 3].map(() => Array.from({ length: n }, rnorm))), A = S.anova(gv), m = gv.map(S.mean), se = Math.sqrt(A.msw * 2 / n);
        let mx = 0; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) mx = Math.max(mx, Math.abs(m[i] - m[j]) / se);
        tc.forEach((t, i) => { if (mx > t) c[i]++; });
      }
      sim = c.map(v => v / R); drawSim();
    };
    segBind(el, '#wh2-m', b => { method = b.dataset.m; up(); }); segBind(el, '#wh2-src', b => { src = b.dataset.m; up(); });
    el.addEventListener('input', e => { if (e.target.type === 'range') { if (['wh2-s', 'wh2-n'].includes(e.target.id)) { sim = null; $('#wh2-sim').innerHTML = ''; } up(); } });
    $('#wh2-go', el).onclick = runSim; up();
  },
  twowayw(el) {
    const z = [0, 1, 2, 3].map(k => std(Array.from({ length: 20 }, normOf(rngOf(71 + k)))));
    const D = STUDY(), I = [...Array(D.n).keys()], BF = { sex: ['性別', ['女性', '男性'], i => (D.sex[i] === 'M' ? 1 : 0)], smoker: ['吸菸', ['不吸菸', '吸菸'], i => D.smoker[i]], old: ['年齡', ['65 歲以下', '65 歲以上'], i => (D.age[i] >= 65 ? 1 : 0)] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wt2-m') + `<p class="w-cap" id="wt2-cap"></p><div class="w-row" id="wt2-dr"><label class="fld"><span>第二個因子</span><select id="wt2-f">${Object.entries(BF).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label></div><div id="wt2-or" hidden>
<div class="w-row">${slider('wt2-a', '高脂飼料的效果（公克）', 0, 8, 0.5, 6)}${slider('wt2-b', 'KO 比 WT 多（公克）', -4, 4, 0.5, 0)}${slider('wt2-i', '交互作用：KO 吃高脂時額外的變化', -8, 4, 0.5, -4)}</div>
<div class="w-row">${slider('wt2-s', '組內標準差', 0.5, 4, 0.5, 1.5)}${slider('wt2-n', '每種組合幾隻', 3, 20, 1, 8)}</div></div>
<div class="chart-wrap" id="wt2-c"></div><div id="wt2-lg"></div>
<div class="kv" id="wt2-k"></div><div id="wt2-t"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wt2-dr').hidden = mode !== 'data'; $('#wt2-or').hidden = mode === 'data';
      let cells, L;
      if (mode === 'data') { const [bn, bl, bf] = BF[$('#wt2-f').value], ix = I.filter(i => D.sbp_12[i] != null); L = { A: ['安慰劑', '新藥'], B: bl, an: '組別', bn, ylab: '第 12 週血壓變化（mmHg）', u: ' mmHg', se: bl.map(b => `簡單效果：${b}的藥效`) }; cells = [0, 1].map(i => [0, 1].map(j => ix.filter(k => (D.group[k] === 'drug' ? 1 : 0) === i && bf(k) === j).map(k => D.sbp_12[k] - D.sbp_0[k]))); $('#wt2-cap').textContent = `2 × 2：組別（安慰劑／新藥）× ${bn}。看交互作用圖與 ANOVA 表。`; }
      else { const ea = sv('wt2-a', v => v.toFixed(1)), eb = sv('wt2-b', v => v.toFixed(1)), ei = sv('wt2-i', v => v.toFixed(1)), sd = sv('wt2-s', v => v.toFixed(1)), n = sv('wt2-n'), mu = [[3, 3 + eb], [3 + ea, 3 + ea + eb + ei]]; cells = [0, 1].map(i => [0, 1].map(j => z[i * 2 + j].slice(0, n).map(x => mu[i][j] + sd * x))); L = { A: ['一般飼料', '高脂飼料'], B: ['WT', 'KO'], an: '飼料', bn: '基因型', ylab: '體重增加（公克）', u: ' 公克', se: ['簡單效果：WT 吃高脂', '簡單效果：KO 吃高脂'] }; $('#wt2-cap').textContent = '2 × 2 因子設計：飼料（一般／高脂）× 基因型（WT／KO）。調整三種效果，看交互作用圖與 ANOVA 表怎麼變。'; }
      $('#wt2-lg').innerHTML = legend([['var(--c1)', L.B[0]], ['var(--c2)', L.B[1]]]);
      const y = [], ai = [], bi = []; cells.forEach((row, i) => row.forEach((cell, j) => cell.forEach(v => { y.push(v); ai.push(i); bi.push(j); })));
      const T = S.twoway(y, ai, bi), m = (i, j) => S.mean(cells[i][j]);
      $('#wt2-c').innerHTML = interPlot(L.A, L.B, cells, L.ylab, (X, Y) => [0, 1].map(j => `<g class="hlx" data-k="se${j}"><line x1="${X(1) + 22 + 10 * j}" x2="${X(1) + 22 + 10 * j}" y1="${Y(m(0, j))}" y2="${Y(m(1, j))}" style="stroke:${col4(j)};stroke-width:4"/><line x1="${X(0)}" x2="${X(1) + 22 + 10 * j}" y1="${Y(m(0, j))}" y2="${Y(m(0, j))}" style="stroke:${col4(j)};stroke-dasharray:3 3"/></g>`).join(''));
      $('#wt2-k').innerHTML = kvs([[`${L.an}主效果 F`, `${F.n(T.A.F, 2)}（p ${F.p(T.A.p)}）`, 'mainA'], [`${L.bn}主效果 F`, `${F.n(T.B.F, 2)}（p ${F.p(T.B.p)}）`, 'mainB'], ['交互作用 F', `${F.n(T.AB.F, 2)}（p ${F.p(T.AB.p)}）`, 'inter'], [L.se[0], `${F.n(m(1, 0) - m(0, 0), 1)}${L.u}`, 'se0'], [L.se[1], `${F.n(m(1, 1) - m(0, 1), 1)}${L.u}`, 'se1']]);
      const rowT = (nm, r) => [nm, F.n(r.ss), r.df, F.n(r.ms), F.n(r.F, 2), F.p(r.p)];
      $('#wt2-t').innerHTML = tableHTML({ head: ['來源', 'SS', '自由度', 'MS', 'F', 'p 值'], rows: [rowT(L.an, T.A), rowT(L.bn, T.B), rowT(`${L.an} × ${L.bn}`, T.AB), ['殘差', F.n(T.E.ss), T.E.df, F.n(T.E.ms), '', '']] });
    };
    segBind(el, '#wt2-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  blockw(el) {
    const zb = std(Array.from({ length: 8 }, normOf(rngOf(91)))), ze = [0, 1, 2].map(k => std(Array.from({ length: 8 }, normOf(rngOf(95 + k)))));
    const D = STUDY(), I = [...Array(D.n).keys()];
    el.innerHTML = SRC_NOTE + MODE_SEG('wb-m') + `<p class="w-cap" id="wb-cap"></p>
<div class="w-row" id="wb-or" hidden>${slider('wb-b', '溫室之間的差異（標準差）', 0, 6, 0.5, 4)}${slider('wb-e', '肥料 B、C 比 A 高', 0, 4, 0.5, 1.5)}${slider('wb-s', '殘差標準差', 0.5, 3, 0.5, 1)}</div>
<div class="chart-wrap" id="wb-c"></div><div class="kv" id="wb-k"></div>`;
    let mode = 'data';
    const PAL = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--muted)', 'var(--ink)', 'var(--accent)', 'var(--eosin)'];
    const up = () => {
      $('#wb-or').hidden = mode === 'data';
      let y = [], t = [], b = [], nt, nb, TN, cm;
      if (mode === 'data') { I.forEach(i => { y.push(D.sbp_4[i]); t.push(D.group[i] === 'drug' ? 1 : 0); b.push(HN.indexOf(D.hospital[i])); }); nt = 2; nb = 8; TN = ['安慰劑', '新藥']; $('#wb-cap').textContent = '每間醫院內各自隨機分派新藥與安慰劑：醫院就是區集。結果是第 4 週收縮壓；每條彩色線連接同一間醫院兩組的平均。'; }
      else { const sb = sv('wb-b', v => v.toFixed(1)), e = sv('wb-e', v => v.toFixed(1)), se = sv('wb-s', v => v.toFixed(1)), eff = [0, e, e * 1.5]; nt = 3; nb = 6; TN = ['肥料 A', '肥料 B', '肥料 C']; for (let k = 0; k < 3; k++) for (let j = 0; j < nb; j++) { y.push(30 + eff[k] + sb * zb[j] + se * ze[k][j]); t.push(k); b.push(j); } $('#wb-cap').textContent = '3 種肥料、每個溫室各一盆（共 6 個溫室）。溫室之間本來就有差異。比較「考慮區集」與「不考慮區集」兩種分析。'; }
      cm = Array.from({ length: nb }, (_, j) => Array.from({ length: nt }, (_, k) => S.mean(y.filter((_, i) => t[i] === k && b[i] === j))));
      const R = S.blockAnova(y, t, b), gv = Array.from({ length: nt }, (_, k) => y.filter((_, i) => t[i] === k)), A1 = S.anova(gv), [mn, mx] = S.minmax(cm.flat());
      $('#wb-c').innerHTML = chart({ xcats: TN, y: [mn - 2, mx + 2], h: 300, ylab: mode === 'data' ? '第 4 週收縮壓（各醫院平均）' : '株高' }, (X, Y) => {
        let g = ''; for (let j = 0; j < nb; j++) g += `<path data-k="blk" d="${cm[j].map((v, k) => `${k ? 'L' : 'M'}${X(k)} ${Y(v)}`).join('')}" style="fill:none;stroke:${PAL[j]};stroke-width:1.5;stroke-opacity:.7"/>` + cm[j].map((v, k) => `<circle data-k="blk" cx="${X(k)}" cy="${Y(v)}" r="4.5" style="fill:${PAL[j]}"/>`).join('') + (mode === 'data' ? `<text x="${X(nt - 1) + 10}" y="${Y(cm[j][nt - 1])}" dy=".32em" style="font-size:11px;fill:var(--muted)">${HN[j]}</text>` : '');
        return g + gv.map((v, k) => `<line data-k="trt" x1="${X(k) - 30}" x2="${X(k) + 30}" y1="${Y(S.mean(v))}" y2="${Y(S.mean(v))}" style="stroke:var(--ink);stroke-width:3.5"/>`).join('');
      });
      $('#wb-k').innerHTML = kvs([['殘差均方（不考慮區集）', F.n(A1.msw, 2), 'blk'], ['殘差均方（考慮區集）', F.n(R.E.ms, 2), 'trt'], ['p 值（不考慮區集）', F.p(A1.p), 'blk'], ['p 值（考慮區集）', F.p(R.T.p), 'trt'], ['區集 F', F.n(R.B.F, 2), 'blk']]);
    };
    segBind(el, '#wb-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  rmw(el) {
    const zs = std(Array.from({ length: 10 }, normOf(rngOf(131)))), ze = Array.from({ length: 10 }, (_, i) => Array.from({ length: 4 }, normOf(rngOf(140 + i))));
    const D = STUDY(), I = [...Array(D.n).keys()].filter(i => D.sbp_12[i] != null);
    el.innerHTML = SRC_NOTE + MODE_SEG('wr2-m') + `<p class="w-cap" id="wr2-cap"></p><div class="w-row" id="wr2-dr"><label class="fld"><span>醫院</span><select id="wr2-h">${HOSP_OPTS('H1').replace('<option value="">全部醫院</option>', '')}</select></label><label class="fld"><span>組別</span><select id="wr2-g"><option value="drug">新藥組</option><option value="placebo">安慰劑組</option></select></label></div>
<div class="w-row" id="wr2-or" hidden>${slider('wr2-s', '個體之間的差異', 0, 8, 0.5, 5)}${slider('wr2-t', '每個時間點減少', 0, 6, 0.5, 2)}${slider('wr2-r', '相鄰時間點的相關（違反球形）', 0, 0.9, 0.1, 0)}</div>
<div class="chart-wrap" id="wr2-c"></div><div class="kv" id="wr2-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wr2-dr').hidden = mode !== 'data'; $('#wr2-or').hidden = mode === 'data';
      $('#wr2-cap').textContent = mode === 'data' ? '同一間醫院、同一組完成 12 週的病人，每人 4 次收縮壓（每條藍線是一位病人）。比較兩種分析。' : '10 隻小鼠在 4 個時間點測量。調整個體差異和「相鄰時間點更相似」的程度，比較兩種分析。';
      const ss = sv('wr2-s', v => v.toFixed(1)), td = sv('wr2-t', v => v.toFixed(1)), rho = sv('wr2-r', v => v.toFixed(1));
      const M = mode === 'data' ? I.filter(i => D.hospital[i] === $('#wr2-h').value && D.group[i] === $('#wr2-g').value).map(i => [D.sbp_0[i], D.sbp_4[i], D.sbp_8[i], D.sbp_12[i]]) : zs.map((u, i) => { let e = ze[i][0] * 2; return [0, 1, 2, 3].map(j => { if (j) e = rho * e + Math.sqrt(1 - rho * rho) * ze[i][j] * 2; return 50 - td * j + ss * u + e + (rho ? zs[i] * rho * j * 1.5 : 0); }); });
      const R = S.rmAnova(M), A1 = S.anova([0, 1, 2, 3].map(j => M.map(r => r[j]))), cm = [0, 1, 2, 3].map(j => S.mean(M.map(r => r[j]))), [mn, mx] = S.minmax(M.flat());
      $('#wr2-c').innerHTML = chart({ xcats: mode === 'data' ? ['第 0 週', '第 4 週', '第 8 週', '第 12 週'] : ['第 0 天', '第 3 天', '第 7 天', '第 14 天'], y: [mn, mx], h: 300, ylab: mode === 'data' ? '收縮壓' : '傷口面積' }, (X, Y) => M.map(r => `<path data-k="subj" d="${r.map((v, j) => `${j ? 'L' : 'M'}${X(j)} ${Y(v).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-opacity:.45;stroke-width:1.5"/>`).join('') + `<path data-k="time" d="${cm.map((v, j) => `${j ? 'L' : 'M'}${X(j)} ${Y(v)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:3.5"/>`);
      $('#wr2-k').innerHTML = kvs([['p 值（當作獨立組的 ANOVA）', F.p(A1.p), 'subj'], ['p 值（重複測量，未校正）', F.p(R.p), 'time'], ['Greenhouse–Geisser ε', F.n(R.eps, 3), 'subj'], ['p 值（Greenhouse–Geisser 校正）', F.p(R.pGG), 'time']]);
    };
    segBind(el, '#wr2-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  iccw(el) {
    const zb = std(Array.from({ length: 8 }, normOf(rngOf(161)))), zw = Array.from({ length: 8 }, (_, i) => std(Array.from({ length: 6 }, normOf(rngOf(170 + i)))));
    const D = STUDY(), I = [...Array(D.n).keys()];
    el.innerHTML = SRC_NOTE + MODE_SEG('wi2-mode') + `<p class="w-cap" id="wi2-cap"></p>
<div class="w-row"><span id="wi2-or" hidden>${slider('wi2-b', '小鼠之間的標準差', 0, 5, 0.25, 3)}${slider('wi2-w', '同一隻小鼠內的標準差', 0.25, 5, 0.25, 1.5)}</span>${slider('wi2-m', '每群取幾個', 2, 30, 1, 10)}</div>
<div class="chart-wrap" id="wi2-c"></div><div class="kv" id="wi2-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wi2-or').hidden = mode === 'data'; const mm = $('#wi2-m'); mm.max = mode === 'data' ? 30 : 6; if (mode !== 'data' && +mm.value > 6) mm.value = 6;
      $('#wi2-cap').textContent = mode === 'data' ? '8 間醫院，每間取前 m 位病人的基線收縮壓。看醫院之間與醫院之內的變異、ICC 和有效樣本數。' : '8 隻小鼠，每隻量好幾次。調整「小鼠之間」與「同一隻內」的差異，看 ICC 和有效樣本數。';
      const sb = sv('wi2-b', v => v.toFixed(2)), sw = sv('wi2-w', v => v.toFixed(2)), m = sv('wi2-m'), gv = mode === 'data' ? HN.map(h => I.filter(i => D.hospital[i] === h).slice(0, m).map(i => D.sbp_0[i])) : zb.map((u, i) => zw[i].slice(0, m).map(e => 20 + sb * u + sw * e)), R = S.icc(gv), gm = S.mean(gv.flat()), [mn, mx] = S.minmax(gv.flat()), de = 1 + (m - 1) * Math.max(0, R.icc);
      $('#wi2-c').innerHTML = chart({ xcats: mode === 'data' ? HN : gv.map((_, i) => `#${i + 1}`), y: [mn, mx], h: 280, ylab: mode === 'data' ? '基線收縮壓' : '腫瘤大小' }, (X, Y) => {
        let g = `<line class="hlx" data-k="vb icc" x1="${X(0) - 20}" x2="${X(7) + 20}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>`;
        gv.forEach((v, i) => { const mi = S.mean(v); g += v.map(x => `<line class="hlx" data-k="vw icc" x1="${X(i) + 6}" x2="${X(i) + 6}" y1="${Y(x)}" y2="${Y(mi)}" style="stroke:var(--c3);stroke-width:2"/>`).join('') + v.map(x => `<circle data-k="pts" cx="${X(i)}" cy="${Y(x)}" r="4" style="fill:var(--c1);fill-opacity:.7"/>`).join('') + `<line data-k="vb icc" x1="${X(i) - 12}" x2="${X(i) + 12}" y1="${Y(mi)}" y2="${Y(mi)}" style="stroke:var(--c2);stroke-width:3"/><line class="hlx" data-k="vb icc" x1="${X(i) - 8}" x2="${X(i) - 8}" y1="${Y(gm)}" y2="${Y(mi)}" style="stroke:var(--c2);stroke-width:2.5"/>`; });
        return g;
      });
      $('#wi2-k').innerHTML = kvs([[mode === 'data' ? '醫院之間的變異成分' : '小鼠之間的變異成分', F.n(R.vb, 2), 'vb'], [mode === 'data' ? '醫院之內的變異成分' : '同一隻內的變異成分', F.n(R.vw, 2), 'vw'], ['ICC', F.n(Math.max(0, R.icc), 3), 'icc'], ['設計效應', F.n(de, 2), 'pts'], ['有效樣本數', `${F.n(8 * m / de, 1)}（共 ${8 * m} 次測量）`, 'pts']]);
    };
    segBind(el, '#wi2-mode', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  ancovaw(el) {
    const zx = std(Array.from({ length: 40 }, normOf(rngOf(201)))), ze = std(Array.from({ length: 40 }, normOf(rngOf(202))));
    const D = STUDY(), I = [...Array(D.n).keys()].filter(i => D.sbp_12[i] != null);
    el.innerHTML = SRC_NOTE + MODE_SEG('wc3-m') + `<p class="w-cap" id="wc3-cap"></p><div class="w-row" id="wc3-dr"><label class="fld"><span>醫院</span><select id="wc3-h">${HOSP_OPTS('全部')}</select></label></div><div id="wc3-or" hidden><div class="w-row">${slider('wc3-e', '處理效果（公克）', 0, 4, 0.5, 2)}${slider('wc3-r', '起始體重與結果的關係（斜率）', 0, 1.5, 0.1, 0.9)}${slider('wc3-d', '處理組起始體重多（公克）', -4, 4, 0.5, 0)}</div>
<label class="tog"><input type="checkbox" id="wc3-i"> 兩組斜率不同（違反平行斜率）</label></div>
<div class="chart-wrap" id="wc3-c"></div><div id="wc3-lg"></div><div class="kv" id="wc3-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wc3-dr').hidden = mode !== 'data'; $('#wc3-or').hidden = mode === 'data';
      const e = sv('wc3-e', v => v.toFixed(1)), b = sv('wc3-r', v => v.toFixed(1)), dd = sv('wc3-d', v => v.toFixed(1)), inter = $('#wc3-i').checked;
      let g, x, y;
      if (mode === 'data') { const h = $('#wc3-h').value, ix = I.filter(i => !h || D.hospital[i] === h); g = ix.map(i => (D.group[i] === 'drug' ? 1 : 0)); x = ix.map(i => D.sbp_0[i]); y = ix.map(i => D.sbp_12[i]); }
      else { g = zx.map((_, i) => (i < 20 ? 0 : 1)); x = zx.map((z, i) => 25 + 3 * z + (g[i] ? dd : 0)); y = x.map((v, i) => 10 + b * (v - 25) * (inter && g[i] ? 0.2 : 1) + (g[i] ? e : 0) + 1.5 * ze[i]); }
      $('#wc3-cap').textContent = mode === 'data' ? '基線收縮壓是共變數（分派前測量），結果是第 12 週收縮壓。比較「不校正」與 ANCOVA。' : '兩組各 20 隻小鼠，處理前先量體重（共變數），處理 4 週後再量。比較「不校正」與 ANCOVA。';
      $('#wc3-lg').innerHTML = legend(mode === 'data' ? [['var(--c1)', '安慰劑'], ['var(--c2)', '新藥']] : [['var(--c1)', '對照組'], ['var(--c2)', '處理組']]);
      const R = S.ancova(y, g, x), raw = [0, 1].map(l => S.mean(y.filter((_, i) => g[i] === l))), w = S.welch(y.filter((_, i) => !g[i]), y.filter((_, i) => g[i]));
      const seAdj = Math.sqrt(R.fit.se[1] ** 2), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(y), sl = R.cov.slope;
      $('#wc3-c').innerHTML = chart({ x: [x0, x1], y: [y0, y1], xlab: mode === 'data' ? '基線收縮壓（共變數）' : '起始體重（公克）', ylab: mode === 'data' ? '第 12 週收縮壓' : '4 週後的結果', h: 300, xgrid: true }, (X, Y, { M, iw }) => y.map((v, i) => `<circle cx="${X(x[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.5" style="fill:${col4(g[i])};fill-opacity:.45"/>`).join('')
        + [0, 1].map(l => `<line class="hlx" data-k="raw" x1="${M.l}" x2="${M.l + iw}" y1="${Y(raw[l])}" y2="${Y(raw[l])}" style="stroke:${col4(l)};stroke-width:2.5;stroke-dasharray:7 4"/>`).join('')
        + [0, 1].map(l => `<line data-k="adj" x1="${X(x0)}" x2="${X(x1)}" y1="${Y(R.adj[l] + sl * (x0 - R.xm))}" y2="${Y(R.adj[l] + sl * (x1 - R.xm))}" style="stroke:${col4(l)};stroke-width:2.5"/>`).join('')
        + `<g class="hlx" data-k="adj"><line x1="${X(R.xm)}" x2="${X(R.xm)}" y1="${Y(R.adj[0])}" y2="${Y(R.adj[1])}" style="stroke:var(--c4);stroke-width:4"/></g>`
        + [0, 1].map(l => { const xs = x.filter((_, i) => g[i] === l), ys = y.filter((_, i) => g[i] === l), P = S.pearson(xs, ys); return `<line class="hlx" data-k="inter" x1="${X(x0)}" x2="${X(x1)}" y1="${Y(P.intercept + P.slope * x0)}" y2="${Y(P.intercept + P.slope * x1)}" style="stroke:${col4(l)};stroke-width:2;stroke-dasharray:3 3"/>`; }).join(''));
      $('#wc3-k').innerHTML = kvs([['未校正的差異（標準誤）', `${F.n(w.diff, 2)}（${F.n(w.se, 2)}）`, 'raw'], ['ANCOVA 校正後差異（標準誤）', `${F.n(R.adj[1] - R.adj[0], 2)}（${F.n(seAdj, 2)}）`, 'adj'], ['設定的處理效果（真值）', mode === 'data' ? '−10（資料產生時設定）' : e.toFixed(1)], ['斜率平行性檢定 p', F.p(R.inter.p), 'inter']]);
    };
    segBind(el, '#wc3-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  expdesign(el) {
    const POP = STUDY().sbp_0;
    el.innerHTML = SRC_NOTE + `<p class="w-cap">情境：每次從研究的 400 位病人中抽 2n 人，試驗新藥能降多少血壓。每個人本來的血壓不同，基線血壓高的人，之後量的血壓也比較高。下圖是把同一個試驗重做 400 次，每次估計的藥效（安慰劑組平均 − 新藥組平均，越大代表降越多）。</p>
<div class="seg wrap" id="wx-a"><button type="button" data-a="rand" aria-selected="true">隨機分派</button><button type="button" data-a="pick" aria-selected="false">研究者挑選（血壓較低的給新藥）</button></div>
<label class="tog"><input type="checkbox" id="wx-b" checked> 量測者盲化</label>
<div class="w-row">${slider('wx-e', '設定的藥效（mmHg）', 0, 15, 1, 0)}${slider('wx-n', '每組人數', 4, 40, 2, 10)}</div>
<div class="w-row"><button class="btn" id="wx-go" type="button">再做 400 次實驗</button></div>
<div class="chart-wrap" id="wx-c"></div>${legend([['var(--c1)', 'p ≥ 0.05 的實驗'], ['var(--c2)', 'p < 0.05 的實驗'], ['var(--ink)', '設定的藥效（真值）']])}<div class="kv" id="wx-k"></div>`;
    let alloc = 'rand';
    const up = () => {
      const blind = $('#wx-b').checked, eff = sv('wx-e', v => v.toFixed(1)), n = sv('wx-n'), est = [], sig = [];
      for (let r = 0; r < 400; r++) {
        const h = Array.from({ length: 2 * n }, () => POP[Math.floor(Math.random() * POP.length)]), idx = h.map((_, i) => i);
        if (alloc === 'pick') idx.sort((a, b) => h[a] - h[b]); else for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        const y = i => h[i] - 3 + 6 * rnorm(), yt = idx.slice(0, n).map(i => y(i) - eff - (blind ? 0 : 4)), yc = idx.slice(n).map(y), wv = S.welch(yt, yc);
        est.push(wv.diff); sig.push(wv.p < 0.05);
      }
      const m = S.mean(est), sd = S.sd(est), lo = Math.min(-8, ...est), hi = Math.max(20, ...est), B = 32, bw = (hi - lo) / B, c0 = new Array(B).fill(0), c1 = new Array(B).fill(0);
      est.forEach((e, i) => { const k = Math.min(B - 1, Math.floor((e - lo) / bw)); (sig[i] ? c1 : c0)[k]++; });
      const top = Math.max(...c0.map((v, i) => v + c1[i]));
      $('#wx-c').innerHTML = chart({ x: [lo, hi], y: [0, top * 1.25], h: 260, xlab: '估計的藥效（mmHg）', ylab: '實驗次數' }, (X, Y) => {
        let g = '';
        for (let i = 0; i < B; i++) { const x0 = X(lo + i * bw) + 0.5, wd = Math.max(0, X(lo + (i + 1) * bw) - X(lo + i * bw) - 1); g += `<rect x="${x0.toFixed(1)}" y="${Y(c0[i]).toFixed(1)}" width="${wd.toFixed(1)}" height="${(Y(0) - Y(c0[i])).toFixed(1)}" style="fill:var(--c1)"/><rect data-k="sig" x="${x0.toFixed(1)}" y="${Y(c0[i] + c1[i]).toFixed(1)}" width="${wd.toFixed(1)}" height="${(Y(c0[i]) - Y(c0[i] + c1[i])).toFixed(1)}" style="fill:var(--c2)"/>`; }
        const yT = Y(top * 1.15);
        return g + `<line data-k="true bias" x1="${X(eff)}" x2="${X(eff)}" y1="${Y(0)}" y2="${yT}" style="stroke:var(--ink);stroke-width:2.5"/>`
          + `<line data-k="mean bias" x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${yT}" style="stroke:var(--c4);stroke-width:2.5;stroke-dasharray:6 4"/>`
          + `<g class="hlx" data-k="bias"><line x1="${X(eff)}" x2="${X(m)}" y1="${yT}" y2="${yT}" style="stroke:var(--c4);stroke-width:4"/></g>`
          + `<g class="hlx" data-k="sd"><line x1="${X(m - sd)}" x2="${X(m + sd)}" y1="${Y(top * 1.05)}" y2="${Y(top * 1.05)}" style="stroke:var(--c3);stroke-width:4"/></g>`;
      });
      $('#wx-k').innerHTML = kvs([['設定的藥效（真值）', eff.toFixed(1), 'true'], ['估計值的平均', F.n(m, 2), 'mean'], ['偏差（平均 − 真值）', F.n(m - eff, 2), 'bias'], ['估計值的標準差', F.n(sd, 2), 'sd'], ['p < 0.05 的比例', `${F.n(100 * S.mean(sig.map(Number)), 1)}%`, 'sig']]);
    };
    segBind(el, '#wx-a', b => { alloc = b.dataset.a; up(); });
    $('#wx-b').onchange = up; $('#wx-e').oninput = up; $('#wx-n').oninput = up; $('#wx-go').onclick = up; up();
  },
});


/* ---------- 第 2、3 階段：機率與推論 ---------- */
Object.assign(W, {
  rocw(el) {
    const D = STUDY(), sc = D.ecg_score, yy = D.lvh_echo, P = S.sum(yy), Nn = yy.length - P, idx = sc.map((_, i) => i).sort((a, b) => sc[b] - sc[a]); let tp0 = 0, fp0 = 0; const emp = [[0, 0]]; for (const i of idx) { if (yy[i]) tp0++; else fp0++; emp.push([fp0 / Nn, tp0 / P]); }
    el.innerHTML = SRC_NOTE + MODE_SEG('wo-m') + `<p class="w-cap" id="wo-cap"></p>
<div class="w-row"><span id="wo-or" hidden>${slider('wo-d', '兩群的差距（幾個標準差）', 0, 3, 0.25, 1.5)}</span>${slider('wo-c', '閾值', -3, 6, 0.1, 3)}</div>
<div class="w-cols"><figure class="fig"><figcaption>兩群人的分佈與閾值</figcaption><div class="chart-wrap" id="wo-a"></div></figure><figure class="fig"><figcaption>ROC 曲線（紅點是目前的閾值）</figcaption><div class="chart-wrap" id="wo-b"></div></figure></div><div class="kv" id="wo-k"></div>`;
    const pdf = (x, m) => Math.exp(-0.5 * (x - m) ** 2) / Math.sqrt(2 * Math.PI);
    let mode = 'data';
    const up = () => {
      $('#wo-or').hidden = mode === 'data';
      const c = sv('wo-c', v => v.toFixed(1)); let sens, spec, auc, pts, a;
      if (mode === 'data') {
        $('#wo-cap').textContent = '藍色：超音波沒有左心室肥大的人；紅色：有肥大的人。橫軸是心電圖分數。拖動閾值：高於閾值判為陽性。';
        sens = sc.filter((s, i) => yy[i] && s > c).length / P; spec = sc.filter((s, i) => !yy[i] && s <= c).length / Nn; auc = S.auc(sc, yy); pts = emp;
        const lo = -2, hi = 7, bw = 0.5, nb = 18, cnt = g => { const r = new Array(nb).fill(0); sc.forEach((s, i) => { if (yy[i] !== g) return; const k = Math.floor((s - lo) / bw); if (k >= 0 && k < nb) r[k]++; }); const t = g ? P : Nn; return r.map(v => v / t / bw); }, c0 = cnt(0), c1 = cnt(1), top = Math.max(...c0, ...c1) * 1.15, cc = Math.max(lo, Math.min(hi, c));
        a = chart({ x: [lo, hi], y: [0, top], noY: true, h: 220, xlab: '心電圖分數' }, (X, Y) => [[c0, 0], [c1, 1]].map(([cn, g]) => cn.map((v, i) => { const x0 = lo + i * bw, right = x0 + bw / 2 > c; return `<rect data-k="${g ? (right ? 'sens' : 'fn') : (right ? 'fpr' : 'spec')}" x="${X(x0) + 0.5}" y="${Y(v)}" width="${X(x0 + bw) - X(x0) - 1}" height="${Y(0) - Y(v)}" style="fill:var(--c${g + 1});fill-opacity:${right ? 0.6 : 0.25}"/>`; }).join('')).join('') + `<line class="keep" x1="${X(cc)}" x2="${X(cc)}" y1="${Y(0)}" y2="${Y(top * 0.97)}" style="stroke:var(--ink);stroke-width:2.5"/>`);
      } else {
        $('#wo-cap').textContent = '藍色是沒病的人、紅色是有病的人的生物標記濃度分佈（理論的常態分佈）。拖動閾值：右邊（高於閾值）判為陽性。';
        const dd = sv('wo-d', v => v.toFixed(2)), lo = -3.5, hi = dd + 3.5; sens = 1 - S.pnorm(c - dd); spec = S.pnorm(c); auc = S.pnorm(dd / Math.SQRT2);
        pts = Array.from({ length: 101 }, (_, i) => { const t = 6 - (12 + dd) * i / 100; return [1 - S.pnorm(t), 1 - S.pnorm(t - dd)]; });
        a = chart({ x: [lo, hi], y: [0, 0.45], noY: true, h: 220, xlab: '生物標記濃度（標準化）' }, (X, Y) => {
          const area = (m, aa, b) => { if (b <= aa) return 'M0 0'; let q = `M${X(aa)} ${Y(0)}`; for (let i = 0; i <= 60; i++) { const x = aa + (b - aa) * i / 60; q += `L${X(x).toFixed(1)} ${Y(pdf(x, m)).toFixed(1)}`; } return q + `L${X(b)} ${Y(0)}Z`; };
          const curve = m => { let q = ''; for (let i = 0; i <= 120; i++) { const x = lo + (hi - lo) * i / 120; q += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(pdf(x, m)).toFixed(1)}`; } return q; };
          const cc = Math.max(lo, Math.min(hi, c));
          return `<path data-k="spec" d="${area(0, lo, cc)}" style="fill:var(--c1);fill-opacity:.3"/><path data-k="fpr" d="${area(0, cc, hi)}" style="fill:var(--c1);fill-opacity:.12"/><path data-k="sens" d="${area(dd, cc, hi)}" style="fill:var(--c2);fill-opacity:.35"/><path class="keep" d="${curve(0)}" style="fill:none;stroke:var(--c1);stroke-width:2"/><path class="keep" d="${curve(dd)}" style="fill:none;stroke:var(--c2);stroke-width:2"/><line class="keep" x1="${X(cc)}" x2="${X(cc)}" y1="${Y(0)}" y2="${Y(0.43)}" style="stroke:var(--ink);stroke-width:2.5"/>`;
        });
      }
      $('#wo-a').innerHTML = a;
      $('#wo-b').innerHTML = chart({ x: [0, 1], y: [0, 1], h: 240, xlab: '1 − 特異度', ylab: '敏感度', xgrid: true }, (X, Y) => {
        const path = pts.map(([p, q], i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(q).toFixed(1)}`).join('');
        return `<path data-k="auc" d="${path}L${X(1)} ${Y(0)}L${X(0)} ${Y(0)}Z" style="fill:var(--c3);fill-opacity:.15"/><path class="keep" d="${path}" style="fill:none;stroke:var(--c3);stroke-width:2.5"/><line class="keep" x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" style="stroke:var(--muted);stroke-dasharray:4 4"/><circle data-k="sens spec fpr youden thr" cx="${X(1 - spec)}" cy="${Y(sens)}" r="6" style="fill:var(--c2)"/><g class="hlx" data-k="youden"><line x1="${X(1 - spec)}" x2="${X(1 - spec)}" y1="${Y(1 - spec)}" y2="${Y(sens)}" style="stroke:var(--c4);stroke-width:3"/></g>`;
      });
      $('#wo-k').innerHTML = kvs([['敏感度', F.n(100 * sens, 1) + '%', 'sens'], ['特異度', F.n(100 * spec, 1) + '%', 'spec'], ['偽陽性率（1 − 特異度）', F.n(100 * (1 - spec), 1) + '%', 'fpr'], ['Youden 指數', F.n(sens + spec - 1, 3), 'youden'], ['AUC', F.n(auc, 3), 'auc']]);
    };
    segBind(el, '#wo-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  rvw(el) {
    const D = STUDY(), ae = D.ae_count.map(v => Math.min(5, v)), dataP = [0, 1, 2, 3, 4, 5].map(k => ae.filter(v => v === k).length / ae.length), init = [1, 3, 4, 2, 0, 0];
    el.innerHTML = SRC_NOTE + MODE_SEG('wv2-m') + `<p class="w-cap" id="wv2-cap"></p>
<div class="w-grid5" id="wv2-or" hidden>${init.map((v, i) => slider('wv2-' + i, `X = ${i}`, 0, 10, 1, v)).join('')}</div>
<div class="w-row">${slider('wv2-k', '累積機率：P(X ≤ k) 的 k', 0, 5, 1, 1)}<button class="btn" type="button" id="wv2-go">重新模擬 1000 次</button></div>
<div class="w-cols"><figure class="fig"><figcaption>機率分佈</figcaption><div class="chart-wrap" id="wv2-a"></div></figure><figure class="fig"><figcaption>模擬：前 n 次結果的平均</figcaption><div class="chart-wrap" id="wv2-b"></div></figure></div><div class="kv" id="wv2-o"></div>`;
    let draws = [], mode = 'data';
    const up = (resim) => {
      $('#wv2-or').hidden = mode === 'data';
      $('#wv2-cap').textContent = mode === 'data' ? 'X = 隨機挑一位病人，他在 12 週內的不良事件次數。每根長條的高度＝400 人中該次數的比例。模擬：每次隨機挑一位病人。' : '調整每個值的相對比重（會自動換算成機率，總和為 1），例如每窩存活的幼鼠數。';
      const p = mode === 'data' ? dataP : (() => { const wts = init.map((_, i) => sv('wv2-' + i)), tot = S.sum(wts) || 1; return wts.map(v => v / tot); })(), k = sv('wv2-k'), mu = S.sum(p.map((v, i) => v * i)), sd = Math.sqrt(S.sum(p.map((v, i) => v * (i - mu) ** 2))), cdf = S.sum(p.slice(0, k + 1));
      if (resim || !draws.length) { draws = Array.from({ length: 1000 }, () => { let u = Math.random(), i = 0; while (i < 5 && u > p[i]) { u -= p[i]; i++; } return i; }); }
      const top = Math.max(0.1, ...p);
      $('#wv2-a').innerHTML = chart({ xcats: ['0', '1', '2', '3', '4', '5'], y: [0, top], h: 240, ylab: 'P(X = x)' }, (X, Y, { iw }) => {
        const bw = iw / 6 * 0.6, xc = v => X(0) + v * (X(1) - X(0));
        return p.map((v, i) => `<rect data-k="${i <= k ? 'cdf bar' : 'bar'}" x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:var(--c1);fill-opacity:.8"/>`).join('')
          + `<line data-k="ex sd" x1="${xc(mu)}" x2="${xc(mu)}" y1="${Y(0)}" y2="${Y(top)}" style="stroke:var(--c2);stroke-width:2.5"/><g class="hlx" data-k="sd"><line x1="${xc(mu - sd)}" x2="${xc(mu + sd)}" y1="${Y(top * 0.95)}" y2="${Y(top * 0.95)}" style="stroke:var(--c4);stroke-width:4"/></g>`;
      });
      const run = []; let acc = 0; draws.forEach((v, i) => { acc += v; if ((i + 1) % 5 === 0 || i < 30) run.push([i + 1, acc / (i + 1)]); });
      $('#wv2-b').innerHTML = chart({ x: [0, 1000], y: [0, Math.max(2, Math.ceil(mu * 2))], h: 240, xlab: '模擬次數 n', ylab: '平均' }, (X, Y, { M, iw }) => `<line data-k="ex" x1="${M.l}" x2="${M.l + iw}" y1="${Y(mu)}" y2="${Y(mu)}" style="stroke:var(--c2);stroke-width:2;stroke-dasharray:6 4"/><path data-k="sim" d="${run.map(([n, m], i) => `${i ? 'L' : 'M'}${X(n).toFixed(1)} ${Y(Math.min(Math.max(2, Math.ceil(mu * 2)), m)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-width:2"/>`);
      $('#wv2-o').innerHTML = kvs([['期望值 E(X)', F.n(mu, 3), 'ex'], ['標準差 σ', F.n(sd, 2), 'sd'], [`P(X ≤ ${k})`, F.n(cdf, 3), 'cdf'], ['1000 次的平均（大數法則）', F.n(S.mean(draws), 3), 'sim']]);
    };
    segBind(el, '#wv2-m', bt => { mode = bt.dataset.m; up(true); });
    el.addEventListener('input', e => { if (e.target.type === 'range') up(e.target.id !== 'wv2-k'); });
    $('#wv2-go', el).onclick = () => up(true); up(true);
  },
  binomw(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], arm = g => I.filter(i => D.group[i] === g && D.responder[i] != null).map(i => D.responder[i]), ARM = { drug: ['新藥組', arm('drug')], placebo: ['安慰劑組', arm('placebo')] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wbn-m') + `<div class="w-row"><label class="fld" id="wbn-dr"><span>從哪一組抽病人</span><select id="wbn-g">${Object.entries(ARM).map(([k, v]) => `<option value="${k}">${v[0]}（反應率 ${F.n(S.mean(v[1]), 3)}）</option>`).join('')}</select></label>${slider('wbn-n', '人數 n', 1, 60, 1, 10)}<span id="wbn-or" hidden>${slider('wbn-p', '成功機率 p', 0, 1, 0.05, 0.25)}</span>${slider('wbn-k', 'k', 0, 60, 1, 6)}</div>
<p class="w-cap" id="wbn-cap"></p><label class="tog"><input type="checkbox" id="wbn-c"> 畫出常態近似</label><div class="chart-wrap" id="wbn-g2"></div><div class="kv" id="wbn-o"></div>`;
    let mode = 'data', sim = null, simKey = '';
    const up = () => {
      $('#wbn-dr').hidden = mode !== 'data'; $('#wbn-or').hidden = mode === 'data';
      const n = sv('wbn-n'), arr = ARM[$('#wbn-g').value][1], p = mode === 'data' ? S.mean(arr) : sv('wbn-p', v => v.toFixed(2)), kk = $('#wbn-k'); kk.max = n; const k = Math.min(n, sv('wbn-k')), mu = n * p, sd = Math.sqrt(n * p * (1 - p)), pm = Array.from({ length: n + 1 }, (_, i) => S.dbinom(i, n, p)), top = Math.max(...pm), norm = $('#wbn-c').checked;
      if (mode === 'data' && simKey !== $('#wbn-g').value + n) { simKey = $('#wbn-g').value + n; const r = rngOf(n * 7 + 1), f = new Array(n + 1).fill(0); for (let t = 0; t < 1000; t++) { let s = 0; for (let j = 0; j < n; j++) s += arr[Math.floor(r() * arr.length)]; f[s]++; } sim = f.map(v => v / 1000); }
      $('#wbn-cap').textContent = mode === 'data' ? `長條：二項分佈的理論機率（n = ${n}、p = ${F.n(p, 3)}）。紅點：從${ARM[$('#wbn-g').value][0]}隨機抽 ${n} 位病人、數有反應的人數，重複 1,000 次的實際比例。` : '每次試驗只有成功或失敗兩種結果，成功機率都是 p。';
      const approx = sd > 0 ? S.pnorm((k + 0.5 - mu) / sd) : NaN;
      $('#wbn-g2').innerHTML = chart({ x: [-0.5, n + 0.5], y: [0, top * 1.15], h: 260, xlab: '成功次數 X', ylab: 'P(X = x)' }, (X, Y) => {
        const bw = Math.max(1, (X(1) - X(0)) * 0.7);
        let g = pm.map((v, i) => `<rect data-k="${[i === k ? 'pk' : '', i <= k ? 'cdf' : '', 'bar'].join(' ').trim()}" x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:var(--c1);fill-opacity:.8"/>`).join('');
        if (mode === 'data' && sim) g += sim.map((v, i) => (v ? `<circle data-k="simb" cx="${X(i)}" cy="${Y(Math.min(top * 1.15, v))}" r="${Math.min(5, bw / 2 + 1)}" style="fill:var(--c2)"/>` : '')).join('');
        g += `<line data-k="ex sd" x1="${X(mu)}" x2="${X(mu)}" y1="${Y(0)}" y2="${Y(top * 1.1)}" style="stroke:var(--c2);stroke-width:2.5"/><g class="hlx" data-k="sd"><line x1="${X(mu - sd)}" x2="${X(mu + sd)}" y1="${Y(top * 1.05)}" y2="${Y(top * 1.05)}" style="stroke:var(--c4);stroke-width:4"/></g>`;
        if (norm && sd > 0) { let c = ''; for (let i = 0; i <= 160; i++) { const x = -0.5 + (n + 1) * i / 160; c += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(Math.min(top * 1.15, Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI)))).toFixed(1)}`; } g += `<path data-k="napp" d="${c}" style="fill:none;stroke:var(--c3);stroke-width:2.5"/>`; }
        return g;
      });
      $('#wbn-o').innerHTML = kvs([['期望值 n × p', F.n(mu, 2), 'ex'], ['標準差 √(np(1 − p))', F.n(sd, 2), 'sd'], [`P(X = ${k})`, F.n(pm[k], 4), 'pk'], [`P(X ≤ ${k})`, F.n(S.pbinom(k, n, p), 4), 'cdf'], ['常態近似的 P(X ≤ k)（含連續性校正）', norm ? F.n(approx, 4) : '勾選上方選項', 'napp'], ['n × p × (1 − p)', F.n(n * p * (1 - p), 2)]]);
    };
    segBind(el, '#wbn-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  poissonw(el) {
    const D = STUDY(), I = [...Array(D.n).keys()].filter(i => D.fu_days[i] === 84), SUB = { all: ['全部完成 12 週的病人', () => true], young: ['70 歲以下', i => D.age[i] <= 70], old: ['70 歲以上', i => D.age[i] > 70], mix: ['新藥組（含年輕與年長）', i => D.group[i] === 'drug'] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wps2-m0') + `<div class="w-row"><label class="fld" id="wps2-dr"><span>哪些病人</span><select id="wps2-s">${Object.entries(SUB).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><span id="wps2-or" hidden>${slider('wps2-l', '平均次數 λ', 0.5, 15, 0.5, 3)}</span>${slider('wps2-k', 'k', 0, 30, 1, 1)}</div>
<div class="chart-wrap" id="wps2-g"></div><div id="wps2-plate" hidden>
<p class="w-cap">培養皿模擬：皿面切成 100 格，菌落總數平均每格 λ 個。</p>
<div class="seg wrap" id="wps2-m"><button type="button" data-m="rand" aria-selected="true">隨機散布</button><button type="button" data-m="clump" aria-selected="false">成團聚集</button></div>
<div class="w-row"><button class="btn" type="button" id="wps2-go">重新培養</button></div>
<div class="w-cols"><figure class="fig"><figcaption>培養皿（每點一個菌落）</figcaption><div class="chart-wrap" id="wps2-d"></div></figure><figure class="fig"><figcaption>每格菌落數的分佈（線為 Poisson 預期）</figcaption><div class="chart-wrap" id="wps2-h"></div></figure></div></div>
<div class="kv" id="wps2-o"></div>`;
    let mode = 'rand', src = 'data', pts = [];
    const gen = lam => { const tot = Math.round(lam * 100); pts = []; if (mode === 'rand') for (let i = 0; i < tot; i++) pts.push([Math.random() * 10, Math.random() * 10]); else { const nc = Math.max(1, Math.round(tot / 8)); const cs = Array.from({ length: nc }, () => [Math.random() * 10, Math.random() * 10]); for (let i = 0; i < tot; i++) { const c0 = cs[i % nc]; pts.push([Math.min(9.999, Math.max(0, c0[0] + 0.35 * rnorm())), Math.min(9.999, Math.max(0, c0[1] + 0.35 * rnorm()))]); } } };
    const up = regen => {
      $('#wps2-dr').hidden = src !== 'data'; $('#wps2-or').hidden = src === 'data'; $('#wps2-plate').hidden = src === 'data';
      const k = sv('wps2-k');
      if (src === 'data') {
        const v = I.filter(SUB[$('#wps2-s').value][1]).map(i => D.ae_count[i]), lam = S.mean(v), vr = S.variance(v), mx = Math.max(6, ...v), freq = Array.from({ length: mx + 1 }, (_, i) => v.filter(x => x === i).length / v.length), pm = Array.from({ length: mx + 1 }, (_, i) => S.dpois(i, lam)), top = Math.max(...freq, ...pm) * 1.15;
        $('#wps2-g').innerHTML = chart({ x: [-0.5, mx + 0.5], y: [0, top], h: 240, xlab: '每人 12 週內的不良事件次數', ylab: '比例' }, (X, Y) => { const bw = Math.max(1, (X(1) - X(0)) * 0.7); return freq.map((f, i) => `<rect data-k="var obs${i === k ? ' pk' : ''}${i <= k ? ' cdf' : ''}" x="${X(i) - bw / 2}" y="${Y(f)}" width="${bw}" height="${Y(0) - Y(f)}" style="fill:var(--c2);fill-opacity:.55"/>`).join('') + `<path data-k="fit" d="${pm.map((p, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(p)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/>` + pm.map((p, i) => `<circle data-k="fit" cx="${X(i)}" cy="${Y(p)}" r="4" style="fill:var(--c1)"/>`).join('') + `<line data-k="ex" x1="${X(lam)}" x2="${X(lam)}" y1="${Y(0)}" y2="${Y(top * 0.95)}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/>`; });
        $('#wps2-o').innerHTML = kvs([['人數', String(v.length)], ['平均次數 λ', F.n(lam, 3), 'ex'], ['變異數', F.n(vr, 3), 'var'], ['變異數 ÷ 平均（Poisson 約為 1）', F.n(vr / lam, 2), 'var'], [`Poisson 預期的 P(X = ${k})`, F.n(S.dpois(k, lam), 3), 'fit'], [`實際的機率分佈：X = ${k}`, F.n(freq[k] ?? 0, 3), 'pk'], [`P(X ≤ ${k})`, F.n(S.ppois(k, lam), 3), 'cdf']]);
        return;
      }
      const lam = sv('wps2-l', v => v.toFixed(1)), pm = Array.from({ length: 31 }, (_, i) => S.dpois(i, lam)), top = Math.max(...pm), mx = Math.min(30, Math.ceil(lam + 4 * Math.sqrt(lam) + 2));
      if (regen || !pts.length) gen(lam);
      $('#wps2-g').innerHTML = chart({ x: [-0.5, mx + 0.5], y: [0, top * 1.15], h: 220, xlab: '次數 X', ylab: 'P(X = x)' }, (X, Y) => { const bw = Math.max(1, (X(1) - X(0)) * 0.7); return pm.slice(0, mx + 1).map((v, i) => `<rect data-k="${[i === k ? 'pk' : '', i <= k ? 'cdf' : '', 'fit'].join(' ').trim()}" x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:var(--c1);fill-opacity:.8"/>`).join('') + `<line data-k="ex" x1="${X(lam)}" x2="${X(lam)}" y1="${Y(0)}" y2="${Y(top * 1.1)}" style="stroke:var(--c2);stroke-width:2.5"/>`; });
      const counts = new Array(100).fill(0); pts.forEach(([x, y]) => { counts[Math.floor(y) * 10 + Math.floor(x)]++; }); const m = S.mean(counts), v = S.variance(counts), cmax = Math.max(...counts);
      $('#wps2-d').innerHTML = chart({ x: [0, 10], y: [0, 10], noY: true, h: 240, m: { b: 16, l: 16 } }, (X, Y) => { let g = ''; for (let i = 1; i < 10; i++) g += `<line class="keep" x1="${X(i)}" x2="${X(i)}" y1="${Y(0)}" y2="${Y(10)}" style="stroke:var(--line)"/><line class="keep" x1="${X(0)}" x2="${X(10)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--line)"/>`; return g + pts.map(([x, y]) => `<circle data-k="dots" cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="1.8" style="fill:var(--c2);fill-opacity:.7"/>`).join(''); });
      const hm = Math.max(cmax, mx), freq = Array.from({ length: hm + 1 }, (_, i) => counts.filter(c => c === i).length);
      $('#wps2-h').innerHTML = chart({ x: [-0.5, hm + 0.5], y: [0, Math.max(...freq, ...pm.slice(0, hm + 1).map(p => p * 100)) * 1.1], h: 240, xlab: '每格的菌落數', ylab: '格數' }, (X, Y) => { const bw = Math.max(1, (X(1) - X(0)) * 0.7); return freq.map((f, i) => `<rect data-k="var" x="${X(i) - bw / 2}" y="${Y(f)}" width="${bw}" height="${Y(0) - Y(f)}" style="fill:var(--c2);fill-opacity:.6"/>`).join('') + `<path class="keep" d="${Array.from({ length: hm + 1 }, (_, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(S.dpois(i, lam) * 100)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/>`; });
      $('#wps2-o').innerHTML = kvs([['P(X = k)', F.n(pm[k] ?? 0, 4), 'pk'], ['P(X ≤ k)', F.n(S.ppois(k, lam), 4), 'cdf'], ['期望值 = 變異數 = λ', lam.toFixed(1), 'ex'], ['培養皿：每格平均數', F.n(m, 2), 'dots'], ['培養皿：每格變異數', F.n(v, 2), 'var'], ['變異數 ÷ 平均（Poisson 約為 1）', F.n(v / m, 2), 'var']]);
    };
    segBind(el, '#wps2-m0', b => { src = b.dataset.m; up(true); }); segBind(el, '#wps2-m', b => { mode = b.dataset.m; up(true); });
    el.addEventListener('input', e => { if (e.target.type === 'range') up(e.target.id === 'wps2-l'); }); el.addEventListener('change', e => { if (e.target.tagName === 'SELECT') up(); });
    $('#wps2-go', el).onclick = () => up(true); up(true);
  },
  tdistw(el) {
    el.innerHTML = SRC_NOTE + `<div class="w-row">${slider('wtd-df', '自由度（n − 1）', 1, 60, 1, 4)}</div><div class="chart-wrap" id="wtd-c"></div>
<div class="w-row"><button class="btn" type="button" id="wtd-go">從 400 位病人抽 2000 個樣本：誤用 1.96 時，95% 信賴區間的實際涵蓋率</button></div><div class="kv" id="wtd-k"></div>`;
    let cov = null;
    const up = () => {
      const df = sv('wtd-df'), tc = S.qt(0.975, df), tail = 2 * (1 - S.pt(1.96, df)), npdf = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
      $('#wtd-c').innerHTML = chart({ x: [-5, 5], y: [0, 0.42], noY: true, h: 230, xlab: 't 值' }, (X, Y) => {
        const curve = f => { let q = ''; for (let i = 0; i <= 200; i++) { const x = -5 + 10 * i / 200; q += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`; } return q; };
        const area = (f, a, b) => { let q = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 60; i++) { const x = a + (b - a) * i / 60; q += `L${X(x).toFixed(1)} ${Y(f(x)).toFixed(1)}`; } return q + `L${X(b)} ${Y(0)}Z`; };
        const tp = x => S.tpdf(x, df);
        return `<path data-k="tail" d="${area(tp, 1.96, 5)}${area(tp, -5, -1.96)}" style="fill:var(--c2);fill-opacity:.35"/><path data-k="norm" class="keep" d="${curve(npdf)}" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:6 4"/><path class="keep" d="${curve(tp)}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/>`
          + [-1, 1].map(s => `<line data-k="norm" x1="${X(1.96 * s)}" x2="${X(1.96 * s)}" y1="${Y(0)}" y2="${Y(0.2)}" style="stroke:var(--muted);stroke-width:2"/><line data-k="tc" x1="${X(Math.min(5, tc) * s)}" x2="${X(Math.min(5, tc) * s)}" y1="${Y(0)}" y2="${Y(0.2)}" style="stroke:var(--c1);stroke-width:2.5"/>`).join('');
      });
      $('#wtd-k').innerHTML = kvs([['t 分佈的 95% 臨界值', F.n(tc, 3), 'tc'], ['常態分佈的臨界值', '1.960', 'norm'], ['t 分佈中 |t| > 1.96 的機率', F.n(100 * tail, 1) + '%', 'tail'], ['誤用 1.96 的信賴區間涵蓋率（模擬）', cov ? F.n(100 * cov[0], 1) + '%' : '按上方按鈕', 'tail'], ['用 t 臨界值的信賴區間涵蓋率（模擬）', cov ? F.n(100 * cov[1], 1) + '%' : '按上方按鈕', 'tc']]);
    };
    $('#wtd-go', el).onclick = () => { const pop = STUDY().sbp_0, mu = S.mean(pop), df = +$('#wtd-df').value, n = df + 1, tc = S.qt(0.975, df); let a = 0, b = 0; for (let r = 0; r < 2000; r++) { const x = Array.from({ length: n }, () => pop[Math.floor(Math.random() * pop.length)]), m = S.mean(x), se = S.sd(x) / Math.sqrt(n); if (Math.abs(m - mu) <= 1.96 * se) a++; if (Math.abs(m - mu) <= tc * se) b++; } cov = [a / 2000, b / 2000]; up(); };
    $('#wtd-df').oninput = () => { cov = null; up(); }; up();
  },
  propciw(el) {
    el.innerHTML = SRC_NOTE + `<div class="w-row">${slider('wpc-n', '樣本數 n', 5, 200, 1, 20)}${slider('wpc-x', '成功數 x', 0, 200, 1, 7)}</div>
<div class="chart-wrap" id="wpc-c"></div><div class="kv" id="wpc-k"></div>
<p class="w-cap">涵蓋率模擬：從研究的 400 位病人中，每次抽 n 人算比例的 95% CI，重複 2000 次，看三種方法的區間有多少比例涵蓋真正的比例（400 人的比例）。</p>
<div class="w-row"><label class="fld"><span>變數</span><select id="wpc-v">${Object.entries(BIN_VARS()).map(([k, v]) => `<option value="${k}">${v[0]}（真正比例 ${F.n(S.mean(v[1]), 3)}）</option>`).join('')}</select></label><button class="btn" type="button" id="wpc-go">模擬 2000 次</button><button class="btn ghost" type="button" id="wpc-one">抽一組 n 人當上面的樣本</button></div><div class="chart-wrap" id="wpc-s"></div>`;
    const methods = [['wald', 'Wald', 'var(--c2)'], ['wilson', 'Wilson', 'var(--c1)'], ['exact', '精確法', 'var(--c3)']];
    let sim = null;
    const up = () => {
      const n = sv('wpc-n'), xs = $('#wpc-x'); xs.max = n; const x = Math.min(n, sv('wpc-x')), R = S.propCI(x, n);
      $('#wpc-c').innerHTML = chart({ ycats: methods.map(m => m[1]), x: [-0.1, 1], h: 180, m: { l: 70 }, xlab: '比例', xgrid: true }, (X, Y, { M, ih }) => `<line class="keep" x1="${X(0)}" x2="${X(0)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-width:1.5"/><line class="keep" x1="${X(1)}" x2="${X(1)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-width:1.5"/>` + methods.map(([k, , c], i) => `<g data-k="${k}"><line x1="${X(R[k][0])}" x2="${X(R[k][1])}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:${c};stroke-width:5"/><circle cx="${X(R.p)}" cy="${Y(i)}" r="5" style="fill:var(--ink)"/></g>`).join(''));
      $('#wpc-k').innerHTML = kvs([['樣本比例 p̂', F.n(R.p, 3), 'wilson'], ['標準誤', F.n(R.se, 3), 'wald'], ['Wald 95% CI', F.ci(...R.wald, 3), 'wald'], ['Wilson 95% CI', F.ci(...R.wilson, 3), 'wilson'], ['精確法 95% CI', F.ci(...R.exact, 3), 'exact']]);
      if (sim) $('#wpc-s').innerHTML = chart({ ycats: methods.map(m => m[1]), x: [Math.min(0.7, ...sim) - 0.02, 1], h: 170, m: { l: 70 }, xlab: '涵蓋率' }, (X, Y, { M, ih }) => methods.map(([k, , c], i) => `<rect data-k="cov${k}" x="${X(Math.min(0.7, ...sim) - 0.02)}" y="${Y(i) - ih / 8}" width="${X(sim[i]) - X(Math.min(0.7, ...sim) - 0.02)}" height="${ih / 4}" style="fill:${c}"/><text x="${X(sim[i]) + 5}" y="${Y(i)}" dy=".32em" style="fill:var(--ink)">${F.n(100 * sim[i], 1)}%</text>`).join('') + `<line class="keep" x1="${X(0.95)}" x2="${X(0.95)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-dasharray:4 3"/>`);
    };
    const runSim = () => { const n = +$('#wpc-n').value, pop = BIN_VARS()[$('#wpc-v').value][1], p = S.mean(pop), c = [0, 0, 0]; for (let r = 0; r < 2000; r++) { let x = 0; for (let i = 0; i < n; i++) x += pop[Math.floor(Math.random() * pop.length)]; const R = S.propCI(x, n); methods.forEach(([k], i) => { if (R[k][0] <= p && p <= R[k][1]) c[i]++; }); } sim = c.map(v => v / 2000); up(); };
    el.addEventListener('input', e => { if (e.target.type === 'range') { if (e.target.id !== 'wpc-x') sim = null; if (!sim) $('#wpc-s').innerHTML = ''; up(); } });
    $('#wpc-go', el).onclick = runSim; $('#wpc-v', el).onchange = () => { sim = null; $('#wpc-s').innerHTML = ''; };
    $('#wpc-one', el).onclick = () => { const n = +$('#wpc-n').value, pop = BIN_VARS()[$('#wpc-v').value][1]; let x = 0; for (let i = 0; i < n; i++) x += pop[Math.floor(Math.random() * pop.length)]; $('#wpc-x').value = x; up(); };
    up();
  },
  onetw(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], V = { sbp_0: ['基線收縮壓', i => D.sbp_0[i], [130, 175]], ch4: ['第 4 週 − 基線（每人的變化量）', i => D.sbp_4[i] - D.sbp_0[i], [-15, 10]] };
    el.innerHTML = SRC_NOTE + `<p class="w-cap">一間醫院的病人，和參考值 μ₀ 比較。看 μ₀ 落在信賴區間內外時，p 值怎麼變。</p>
<div class="w-row"><label class="fld"><span>變數</span><select id="wo1-v">${Object.entries(V).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><label class="fld"><span>醫院</span><select id="wo1-h">${HOSP_OPTS('H1').replace('<option value="">全部醫院</option>', '')}</select></label>${slider('wo1-u', '參考值 μ₀', -15, 175, 0.5, 150)}</div>
<div class="chart-wrap" id="wo1-c"></div><div class="chart-wrap" id="wo1-t"></div><div class="kv" id="wo1-k"></div>`;
    const up = () => {
      const vk = $('#wo1-v').value, [lab, f, rg] = V[vk], x = I.filter(i => D.hospital[i] === $('#wo1-h').value).map(f), u = sv('wo1-u', v => v.toFixed(1)), R = S.oneT(x, u), [lo, hi] = S.minmax([...x, u, rg[0], rg[1]]);
      $('#wo1-c').innerHTML = chart({ x: [lo - 2, hi + 2], y: [0, 1], noY: true, h: 170, xlab: lab + '（mmHg）', m: { t: 24 } }, (X, Y) => x.map((v, k) => `<circle data-k="n" cx="${X(v).toFixed(1)}" cy="${(Y(0.3) + (((k * 0.618) % 1) - 0.5) * 40).toFixed(1)}" r="3.5" style="fill:var(--c1);fill-opacity:.5"/>`).join('') + `<g data-k="ci se"><line x1="${X(R.ci[0])}" x2="${X(R.ci[1])}" y1="${Y(0.78)}" y2="${Y(0.78)}" style="stroke:var(--c2);stroke-width:5"/><circle cx="${X(R.m)}" cy="${Y(0.78)}" r="6" style="fill:var(--c2)"/></g><g data-k="mu0 t"><line x1="${X(u)}" x2="${X(u)}" y1="${Y(0)}" y2="${Y(1)}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/><text x="${X(u)}" y="${Y(1) - 6}" text-anchor="middle" style="fill:var(--ink)">μ₀ = ${u.toFixed(1)}</text></g>`);
      $('#wo1-t').innerHTML = distChart('t', R.t, R.df, `t（自由度 ${R.df}）`);
      $('#wo1-k').innerHTML = kvs([['n', String(x.length), 'n'], ['平均 x̄', F.n(R.m, 2), 'ci'], ['標準差 s', F.n(S.sd(x), 2), 'se'], ['標準誤 s ÷ √n', F.n(R.se, 3), 'se'], ['95% 信賴區間', F.ci(...R.ci, 1), 'ci'], ['參考值 μ₀', u.toFixed(1), 'mu0'], ['t = (x̄ − μ₀) ÷ 標準誤', F.n(R.t, 2), 't'], ['p 值', F.p(R.p), 'p']]);
    };
    $('#wo1-v', el).onchange = () => { $('#wo1-u').value = $('#wo1-v').value === 'ch4' ? 0 : 150; up(); }; el.addEventListener('input', up); $('#wo1-h', el).onchange = up; up();
  },
  binomtestw(el) {
    const D = STUDY(), I = [...Array(D.n).keys()];
    el.innerHTML = SRC_NOTE + MODE_SEG('wbt-m') + `<div class="w-row" id="wbt-dr"><label class="fld"><span>醫院</span><select id="wbt-h">${HOSP_OPTS('H1')}</select></label><label class="fld"><span>組別</span><select id="wbt-g"><option value="drug">新藥組</option><option value="placebo">安慰劑組</option></select></label></div><p class="w-cap" id="wbt-cap"></p>
<div class="w-row"><span id="wbt-or" hidden>${slider('wbt-n', '總數 n', 5, 100, 1, 20)}${slider('wbt-x', '觀察到的成功數 x', 0, 100, 1, 7)}</span>${slider('wbt-p', '預期比例 p₀', 0.05, 0.95, 0.05, 0.3)}</div><div class="chart-wrap" id="wbt-c"></div><div class="kv" id="wbt-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wbt-dr').hidden = mode !== 'data'; $('#wbt-or').hidden = mode === 'data';
      let n, x;
      if (mode === 'data') { const h = $('#wbt-h').value, ix = I.filter(i => (!h || D.hospital[i] === h) && D.group[i] === $('#wbt-g').value && D.responder[i] != null); n = ix.length; x = ix.filter(i => D.responder[i] === 1).length; $('#wbt-cap').textContent = `${h || '全部醫院'}${$('#wbt-g').value === 'drug' ? '新藥組' : '安慰劑組'}：${n} 位完成 12 週的病人中，${x} 位收縮壓降 10 mmHg 以上。和預期比例 p₀ 比較。`; }
      else { n = sv('wbt-n'); const xs = $('#wbt-x'); xs.max = n; x = Math.min(n, sv('wbt-x')); $('#wbt-cap').textContent = ''; }
      const p0 = sv('wbt-p', v => v.toFixed(2)), T = S.binomTest(x, n, p0), CI = S.propCI(x, n), pm = Array.from({ length: n + 1 }, (_, k) => S.dbinom(k, n, p0)), d0 = pm[x], top = Math.max(...pm);
      $('#wbt-c').innerHTML = chart({ x: [-0.5, n + 0.5], y: [0, top * 1.2], h: 250, xlab: '成功數（若 H₀ 為真）', ylab: '機率' }, (X, Y) => { const bw = Math.max(1, (X(1) - X(0)) * 0.7); return pm.map((v, k) => { const ex = v <= d0 * (1 + 1e-7); return `<rect data-k="${ex ? 'p' : 'h0'}" x="${X(k) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:${ex ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.8"/>`; }).join('') + `<line data-k="obs" x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(top * 1.15)}" style="stroke:var(--ink);stroke-width:2.5"/><line data-k="h0" x1="${X(n * p0)}" x2="${X(n * p0)}" y1="${Y(0)}" y2="${Y(top * 1.15)}" style="stroke:var(--c3);stroke-width:2;stroke-dasharray:5 4"/>`; });
      $('#wbt-k').innerHTML = kvs([['樣本比例 p̂', `${x}/${n} = ${F.n(x / n, 3)}`, 'obs'], ['H₀ 下的期望值 n × p₀', F.n(n * p0, 1), 'h0'], ['精確二項檢定 p 值', F.p(T.p), 'p'], ['z 近似的 p 值', F.p(T.pz), 'p'], ['比例的 95% CI（Wilson）', F.ci(...CI.wilson, 3), 'obs']]);
    };
    segBind(el, '#wbt-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  gofw(el) {
    const D = STUDY(), names = ['圓黃', '皺黃', '圓綠', '皺綠'], init = [315, 108, 101, 32], H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'];
    const DATA = { sex: ['性別：女、男（預期 1：1）', ['女', '男'], [D.sex.filter(s => s === 'F').length, D.sex.filter(s => s === 'M').length], [1, 1]], hosp: ['8 間醫院的收案人數（預期相同）', H, H.map(h => D.hospital.filter(x => x === h).length), H.map(() => 1)], age: ['年齡組（預期 2：3：3：2）', ['40–49', '50–59', '60–69', '70–80'], [0, 1, 2, 3].map(k => D.age.filter(a => Math.min(3, Math.floor((a - 40) / 10)) === k).length), [2, 3, 3, 2]] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wg2-m') + `<div class="w-row" id="wg2-dr"><label class="fld"><span>資料</span><select id="wg2-v">${Object.entries(DATA).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label></div><div id="wg2-or" hidden><p class="w-cap">孟德爾的豌豆雙因子雜交：調整觀察到的粒數，或切換預期比例。</p>
<div class="seg wrap" id="wg2-r"><button type="button" data-r="9,3,3,1" aria-selected="true">預期 9：3：3：1</button><button type="button" data-r="1,1,1,1" aria-selected="false">預期 1：1：1：1</button></div>
<div class="w-grid5">${init.map((v, i) => slider('wg2-' + i, names[i], 0, 400, 1, v)).join('')}</div></div>
<div class="chart-wrap" id="wg2-c"></div>${legend([['var(--c1)', '觀察次數'], ['var(--muted)', '期望次數']])}<div class="chart-wrap" id="wg2-d"></div><div class="kv" id="wg2-k"></div>`;
    let ratio = [9, 3, 3, 1], mode = 'data';
    const up = () => {
      $('#wg2-dr').hidden = mode !== 'data'; $('#wg2-or').hidden = mode === 'data';
      let L, obs, rt;
      if (mode === 'data') { const [, l, o, r] = DATA[$('#wg2-v').value]; L = l; obs = o; rt = r; } else { L = names; obs = init.map((_, i) => sv('wg2-' + i)); rt = ratio; }
      if (S.sum(obs) === 0) return;
      const G = S.gof(obs, rt), mx = Math.max(...obs, ...G.E);
      $('#wg2-c').innerHTML = chart({ xcats: L, y: [0, mx * 1.1], h: 250, ylab: mode === 'data' ? '人數' : '粒數' }, (X, Y, { iw }) => { const bw = iw / L.length * 0.3; return obs.map((o, i) => `<rect data-k="obs" x="${X(i) - bw - 2}" y="${Y(o)}" width="${bw}" height="${Y(0) - Y(o)}" style="fill:var(--c1)"/><rect data-k="exp" x="${X(i) + 2}" y="${Y(G.E[i])}" width="${bw}" height="${Y(0) - Y(G.E[i])}" style="fill:var(--muted);fill-opacity:.6"/><line class="hlx" data-k="chi2" x1="${X(i)}" x2="${X(i)}" y1="${Y(o)}" y2="${Y(G.E[i])}" style="stroke:var(--c2);stroke-width:3"/>`).join(''); });
      $('#wg2-d').innerHTML = distChart('chi2', G.chi2, G.df, `χ²（自由度 ${G.df}）`);
      $('#wg2-k').innerHTML = kvs([['總數', S.sum(obs)], ['最小期望次數', F.n(G.minExp, 1), 'exp'], ['χ²', F.n(G.chi2, 3), 'chi2'], ['p 值', F.p(G.p), 'p']]);
    };
    segBind(el, '#wg2-m', b => { mode = b.dataset.m; up(); }); segBind(el, '#wg2-r', b => { ratio = b.dataset.r.split(',').map(Number); up(); });
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  bootw(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], pick = g => I.filter(i => D.hospital[i] === 'H2' && D.group[i] === g).slice(0, 8).map(i => D.crp[i]), A = pick('placebo'), B = pick('drug'), all = [...A, ...B], obs = S.mean(B) - S.mean(A);
    el.innerHTML = SRC_NOTE + `<p class="w-cap">H2 醫院安慰劑組與新藥組各 8 位病人的 CRP（mg/L）：資料右偏，有幾個很大的值。</p>
<div class="seg wrap" id="wbo-m"><button type="button" data-m="perm" aria-selected="true">排列檢定</button><button type="button" data-m="boot" aria-selected="false">Bootstrap：處理組中位數</button></div>
<div class="w-row"><button class="btn" type="button" id="wbo-1">重抽 1 次</button><button class="btn" type="button" id="wbo-2">重抽 2000 次</button><button class="btn ghost" type="button" id="wbo-0">清除</button></div>
<div class="chart-wrap" id="wbo-d"></div><div class="chart-wrap" id="wbo-h"></div><div class="kv" id="wbo-k"></div>`;
    let mode = 'perm', res = [], last = null;
    const once = () => {
      if (mode === 'perm') { const idx = all.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } const a = idx.slice(0, 8).map(i => all[i]), b = idx.slice(8).map(i => all[i]); last = { a, b }; return S.mean(b) - S.mean(a); }
      const b = Array.from({ length: 8 }, () => B[Math.floor(Math.random() * 8)]); last = { b }; return S.median(b);
    };
    const draw = () => {
      const groups = mode === 'perm' ? [['對照', last ? last.a : A], ['處理', last ? last.b : B]] : [['處理組（原始）', B], ['重抽的樣本', last ? last.b : B]];
      $('#wbo-d').innerHTML = chart({ xcats: groups.map(g => g[0]), y: [0, Math.max(...all) * 1.1], h: 200, ylab: 'CRP（mg/L）' }, (X, Y) => groups.map(([, v], k) => v.map((x, i) => `<circle cx="${X(k) + ((i * 0.618) % 1 - 0.5) * 40}" cy="${Y(x)}" r="5" style="fill:${col4(k)};fill-opacity:.7"/>`).join('') + `<line x1="${X(k) - 30}" x2="${X(k) + 30}" y1="${Y(mode === 'perm' ? S.mean(v) : S.median(v))}" y2="${Y(mode === 'perm' ? S.mean(v) : S.median(v))}" style="stroke:var(--ink);stroke-width:3"/>`).join(''));
      if (mode === 'perm') {
        const ext = res.filter(d => Math.abs(d) >= Math.abs(obs) - 1e-12).length, p = res.length ? ext / res.length : NaN, w = S.welch(A, B);
        $('#wbo-h').innerHTML = res.length ? histChart(res, { lo: -6, hi: 6, bins: 48, h: 220, xlab: '打亂標籤後的平均差（虛無分佈）', ylab: '次數', color: i => (Math.abs(-6 + (i + 0.5) * 0.25) >= Math.abs(obs) ? 'var(--c2)' : 'var(--c1)'), tag: i => (Math.abs(-6 + (i + 0.5) * 0.25) >= Math.abs(obs) ? 'pp' : 'null'), extra: (X, Y) => `<line data-k="obs pp" x1="${X(obs)}" x2="${X(obs)}" y1="${Y(0)}" y2="${Y(0) - 160}" style="stroke:var(--ink);stroke-width:2.5"/>` }) : '';
        $('#wbo-k').innerHTML = kvs([['觀察到的平均差', F.n(obs, 2), 'obs'], ['重抽次數', res.length], ['排列檢定 p 值', res.length ? F.p(p) : '—', 'pp'], ['Welch t 檢定 p 值（比較用）', F.p(w.p), 'obs']]);
      } else {
        const ci = res.length >= 40 ? [S.quantile(res, 0.025), S.quantile(res, 0.975)] : null;
        $('#wbo-h').innerHTML = res.length ? histChart(res, { lo: 0, hi: Math.ceil(Math.max(...B)), bins: 40, h: 220, xlab: '重抽樣本的中位數（Bootstrap 分佈）', ylab: '次數', tag: () => 'bd', extra: (X, Y) => `<line data-k="med" x1="${X(S.median(B))}" x2="${X(S.median(B))}" y1="${Y(0)}" y2="${Y(0) - 160}" style="stroke:var(--ink);stroke-width:2.5"/>` + (ci ? `<g class="hlx" data-k="bci"><line x1="${X(ci[0])}" x2="${X(ci[1])}" y1="${Y(0) - 150}" y2="${Y(0) - 150}" style="stroke:var(--c2);stroke-width:5"/></g>` : '') }) : '';
        $('#wbo-k').innerHTML = kvs([['原始資料的中位數', F.n(S.median(B), 2), 'med'], ['重抽次數', res.length], ['Bootstrap 95% 信賴區間', ci ? F.ci(...ci, 1) : '至少重抽 40 次', 'bci']]);
      }
    };
    segBind(el, '#wbo-m', b => { mode = b.dataset.m; res = []; last = null; draw(); });
    $('#wbo-1', el).onclick = () => { res.push(once()); draw(); };
    $('#wbo-2', el).onclick = () => { for (let i = 0; i < 2000; i++) res.push(once()); draw(); };
    $('#wbo-0', el).onclick = () => { res = []; last = null; draw(); };
    draw();
  },
  twoassume(el) {
    const D = STUDY(), I = [...Array(D.n).keys()], V = { crp: ['CRP（mg/L）', 40], tg: ['三酸甘油脂（mmol/L）', 12] };
    el.innerHTML = SRC_NOTE + `<p class="w-cap">比較不吸菸者（對照）與吸菸者的右偏濃度資料：每組取前 n 位病人。切換是否取對數、是否加入一個極端值。</p>
<div class="w-row"><label class="fld"><span>變數</span><select id="wta-v">${Object.entries(V).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label>${slider('wta-n', '每組人數', 5, 80, 1, 30)}</div>
<div class="w-row"><label class="tog"><input type="checkbox" id="wta-l"> 先取自然對數</label><label class="tog"><input type="checkbox" id="wta-o"> 不吸菸組加入一個極端值</label></div>
<div class="w-cols"><figure class="fig"><figcaption>兩組資料</figcaption><div class="chart-wrap" id="wta-b"></div></figure><figure class="fig"><figcaption>殘差的 Q-Q 圖</figcaption><div class="chart-wrap" id="wta-q"></div></figure></div><div class="kv" id="wta-k"></div>`;
    const up = () => {
      const n = sv('wta-n'), vk = $('#wta-v').value, lg = $('#wta-l').checked, out = $('#wta-o').checked, g = s => I.filter(i => D.smoker[i] === s).slice(0, n).map(i => D[vk][i]);
      let A = g(0), B = g(1); if (out) A = [...A, V[vk][1]];
      const a = lg ? A.map(Math.log) : A, b = lg ? B.map(Math.log) : B, w = S.welch(a, b), mw = S.mannWhitney(a, b), L = S.levene([a, b]), vt = S.varTest(a, b);
      $('#wta-b').innerHTML = boxStrip([{ label: '不吸菸', v: a }, { label: '吸菸', v: b }], lg ? `ln(${V[vk][0]})` : V[vk][0]);
      $('#wta-q').innerHTML = qqChart([...a.map(v => v - S.mean(a)), ...b.map(v => v - S.mean(b))]);
      $('#wta-k').innerHTML = kvs([['Welch t 檢定 p 值', F.p(w.p), 'mean0'], ['Mann–Whitney p 值', F.p(mw.p), 'rank'], ['Levene 檢定 p 值', F.p(L.p), 'sd0'], ['F 檢定（變異數）p 值', F.p(vt.p), 'sd1'], [lg ? '幾何平均數比（吸菸 ÷ 不吸菸）' : '平均差（吸菸 − 不吸菸）', lg ? `${F.n(Math.exp(w.diff), 2)}（${F.ci(Math.exp(w.ci[0]), Math.exp(w.ci[1]), 2)}）` : `${F.n(w.diff, 1)}（${F.ci(...w.ci, 1)}）`, 'diff']]);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  nonparw(el) {
    const za = [0.2, -1.1, 0.7, -0.4, 1.5, -0.8, 0.1, -1.6], zb = [0.9, -0.3, 1.8, 0.4, -0.9, 1.2, 0.6, -0.1], zd = [0.6, -0.8, 1.4, 0.2, 1.9, -0.3, 0.9, 0.4], D = STUDY(), I = [...Array(D.n).keys()], pick = (h, g) => I.filter(i => D.hospital[i] === h && D.group[i] === g).slice(0, 8);
    el.innerHTML = SRC_NOTE + MODE_SEG('wnp-src') + `<div class="w-row" id="wnp-dr"><label class="fld"><span>醫院（各取 8 位病人）</span><select id="wnp-h">${HOSP_OPTS('H1').replace('<option value="">全部醫院</option>', '')}</select></label></div><div class="seg wrap" id="wnp-m"><button type="button" data-m="ind" aria-selected="true">兩組獨立：Mann–Whitney</button><button type="button" data-m="pair" aria-selected="false">配對：符號檢定與 Wilcoxon</button></div>
<div class="w-row" id="wnp-or" hidden>${slider('wnp-s', '處理效果', -2, 3, 0.25, 1)}</div><label class="tog"><input type="checkbox" id="wnp-o"> 加入一個極端值</label>
<div class="chart-wrap" id="wnp-c"></div><p class="w-cap" id="wnp-cap"></p><div class="kv" id="wnp-k"></div>`;
    let mode = 'ind', src = 'data';
    const up = () => {
      $('#wnp-dr').hidden = src !== 'data'; $('#wnp-or').hidden = src === 'data';
      const sh = sv('wnp-s', v => v.toFixed(2)), out = $('#wnp-o').checked, h = $('#wnp-h').value, ch4 = i => D.sbp_4[i] - D.sbp_0[i];
      if (mode === 'ind') {
        const A = src === 'data' ? pick(h, 'placebo').map(ch4) : za.map(z => 10 + 2 * z), B = src === 'data' ? pick(h, 'drug').map(ch4) : zb.map(z => 10 + sh * 2 + 2 * z); if (out) B[0] = src === 'data' ? 30 : 40;
        const all = [...A, ...B], { r } = S.rank(all), mw = S.mannWhitney(A, B), w = S.welch(A, B), [lo, hi] = S.minmax(all);
        $('#wnp-c').innerHTML = chart({ ycats: src === 'data' ? ['安慰劑', '新藥'] : ['對照', '處理'], x: [lo - 1, hi + 1], h: 200, m: { l: 48 }, xlab: src === 'data' ? '第 4 週血壓變化（圓圈中的數字是合併後的名次）' : '測量值（圓圈中的數字是合併後的名次）', xgrid: true }, (X, Y) => [A, B].map((g, k) => g.map((v, i) => { const rk = r[k * 8 + i]; return `<g data-k="${k ? 'rb' : 'ra'}"><circle cx="${X(v)}" cy="${Y(k)}" r="11" style="fill:${col4(k)};fill-opacity:.85"/><text x="${X(v)}" y="${Y(k)}" dy=".35em" text-anchor="middle" style="fill:#fff;font-size:10px;font-weight:600">${Number.isInteger(rk) ? rk : rk.toFixed(1)}</text></g>`; }).join('')).join(''));
        $('#wnp-cap').textContent = '兩組合併後由小到大排名。若兩組沒有差異，名次應該交錯分布。';
        const RB = S.sum(r.slice(8));
        $('#wnp-k').innerHTML = kvs([['處理組的名次總和', F.n(RB, 1), 'rb'], ['對照組的名次總和', F.n(S.sum(r.slice(0, 8)), 1), 'ra'], ['Mann–Whitney U', F.n(mw.U, 1), 'rb'], ['Mann–Whitney p 值', F.p(mw.p), 'rb'], ['Welch t 檢定 p 值（比較用）', F.p(w.p), 'ra']]);
      } else {
        const d = src === 'data' ? pick(h, 'drug').map(ch4) : zd.map(z => sh + 1.2 * z); if (out) d[0] = src === 'data' ? 25 : 12;
        const nz = d.map((v, i) => [v, i]).filter(([v]) => v !== 0), { r } = S.rank(nz.map(([v]) => Math.abs(v))), st = S.signTest(d), wl = S.wilcoxonSR(d), pt = S.oneT(d, 0), [lo, hi] = S.minmax([0, ...d]);
        $('#wnp-c').innerHTML = chart({ xcats: d.map((_, i) => `#${i + 1}`), y: [Math.min(lo, -1), Math.max(hi, 1)], h: 240, ylab: '差值（後 − 前）' }, (X, Y, { M, iw }) => `<line class="keep" x1="${M.l}" x2="${M.l + iw}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink)"/>` + d.map((v, i) => { const rk = r[nz.findIndex(([, j]) => j === i)]; return `<g data-k="${v > 0 ? 'pos' : 'neg'}"><rect x="${X(i) - 12}" y="${Y(Math.max(0, v))}" width="24" height="${Math.abs(Y(v) - Y(0))}" style="fill:${v > 0 ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.8"/><text x="${X(i)}" y="${v > 0 ? Y(v) - 6 : Y(v) + 14}" text-anchor="middle" style="fill:var(--ink);font-size:11px">${rk === undefined ? '' : (Number.isInteger(rk) ? rk : rk.toFixed(1))}</text></g>`; }).join(''));
        $('#wnp-cap').textContent = (src === 'data' ? `${h} 醫院新藥組 8 位病人：第 4 週 − 基線。` : '') + '每根長條是一個個體的差值；數字是差值絕對值的名次。紅色為正、藍色為負。';
        $('#wnp-k').innerHTML = kvs([['正號個數（符號檢定）', `${st.pos} / ${st.n}`, 'pos'], ['符號檢定 p 值', F.p(st.p), 'pos'], ['正差值的名次總和 V', F.n(wl.V, 1), 'pos'], ['Wilcoxon 符號等級 p 值', F.p(wl.p), 'pos'], ['配對 t 檢定 p 值（比較用）', F.p(pt.p), 'neg']]);
      }
    };
    segBind(el, '#wnp-m', b => { mode = b.dataset.m; up(); }); segBind(el, '#wnp-src', b => { src = b.dataset.m; up(); });
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  twopropw(el) {
    const D = STUDY(), I = [...Array(D.n).keys()];
    el.innerHTML = SRC_NOTE + MODE_SEG('wp2-m') + `<div class="w-row" id="wp2-dr"><label class="fld"><span>醫院</span><select id="wp2-h">${HOSP_OPTS('全部')}</select></label><p class="w-cap">反應＝第 12 週收縮壓比基線降 10 mmHg 以上（完成 12 週的病人）。</p></div><div class="w-row" id="wp2-or" hidden>${slider('wp2-n', '每組人數', 10, 300, 10, 50)}${slider('wp2-a', '安慰劑組反應人數', 0, 300, 1, 15)}${slider('wp2-b', '新藥組反應人數', 0, 300, 1, 25)}</div>
<figure class="fig"><figcaption>兩組的反應率與各自的 95% 信賴區間（Wilson）</figcaption><div class="chart-wrap" id="wp2-c"></div></figure><figure class="fig"><figcaption>風險差與 95% 信賴區間；虛線是 0（沒有差異）</figcaption><div class="chart-wrap" id="wp2-d"></div></figure><div class="kv" id="wp2-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wp2-dr').hidden = mode !== 'data'; $('#wp2-or').hidden = mode === 'data';
      let a, b, na, nb;
      if (mode === 'data') { const h = $('#wp2-h').value, ix = g => I.filter(i => D.group[i] === g && (!h || D.hospital[i] === h) && D.responder[i] != null); na = ix('placebo').length; nb = ix('drug').length; a = ix('placebo').filter(i => D.responder[i]).length; b = ix('drug').filter(i => D.responder[i]).length; }
      else { const n = sv('wp2-n'); ['wp2-a', 'wp2-b'].forEach(id => { $('#' + id).max = n; }); a = Math.min(n, sv('wp2-a')); b = Math.min(n, sv('wp2-b')); na = nb = n; }
      const T = S.twoProp(a, na, b, nb), ca = S.propCI(a, na), cb = S.propCI(b, nb);
      $('#wp2-c').innerHTML = chart({ xcats: ['安慰劑', '新藥'], y: [0, 1], h: 230, ylab: '反應率' }, (X, Y) => [[T.p1, ca.wilson, 'p1'], [T.p2, cb.wilson, 'p2']].map(([p, ci, k], i) => `<g data-k="${k} diff"><rect x="${X(i) - 30}" y="${Y(p)}" width="60" height="${Y(0) - Y(p)}" style="fill:${col4(i)};fill-opacity:.75"/><line x1="${X(i)}" x2="${X(i)}" y1="${Y(ci[0])}" y2="${Y(ci[1])}" class="ink" style="stroke-width:2"/></g>`).join(''));
      const lo = Math.min(-0.2, T.ci[0]), hi = Math.max(0.2, T.ci[1]);
      $('#wp2-d').innerHTML = chart({ x: [lo, hi], y: [0, 1], noY: true, h: 110, xlab: '風險差（新藥 − 安慰劑）' }, (X, Y) => `<line class="keep" x1="${X(0)}" x2="${X(0)}" y1="${Y(0)}" y2="${Y(1)}" style="stroke:var(--muted);stroke-dasharray:5 4"/><g data-k="diff ci"><line x1="${X(T.ci[0])}" x2="${X(T.ci[1])}" y1="${Y(0.5)}" y2="${Y(0.5)}" style="stroke:var(--c2);stroke-width:5"/><circle cx="${X(T.diff)}" cy="${Y(0.5)}" r="7" style="fill:var(--c2)"/></g>`);
      $('#wp2-k').innerHTML = kvs([['安慰劑組事件率（反應率）', `${a}/${na} = ${F.n(100 * T.p1, 1)}%`, 'p1'], ['新藥組事件率（反應率）', `${b}/${nb} = ${F.n(100 * T.p2, 1)}%`, 'p2'], ['風險差（95% CI）', `${F.n(100 * T.diff, 1)}（${F.ci(100 * T.ci[0], 100 * T.ci[1], 1)}）個百分點`, 'ci'], ['z（p 值）', `${F.n(T.z, 2)}（p ${F.p(T.p)}）`, 'diff'], ['卡方 χ² = z²', F.n(T.chi2, 2), 'diff']]);
    };
    segBind(el, '#wp2-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  mcnemarw(el) {
    el.innerHTML = SRC_NOTE + MODE_SEG('wmc-m') + `<p class="w-cap" id="wmc-cap"></p>
<div class="w-row" id="wmc-or" hidden>${slider('wmc-a', '兩次都有症狀 a', 0, 60, 1, 30)}${slider('wmc-b', '變好 b（前有後無）', 0, 60, 1, 20)}${slider('wmc-c', '變差 c（前無後有）', 0, 60, 1, 5)}${slider('wmc-d', '兩次都沒有 d', 0, 60, 1, 45)}</div>
<div class="chart-wrap" id="wmc-g"></div><div class="kv" id="wmc-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wmc-or').hidden = mode === 'data';
      const RD = READERS(), a = mode === 'data' ? RD.a : sv('wmc-a'), b = mode === 'data' ? RD.b : sv('wmc-b'), c = mode === 'data' ? RD.c : sv('wmc-c'), d = mode === 'data' ? RD.d : sv('wmc-d'), M = S.mcnemar(b, c), wrong = (a + b + c + d) ? S.chisq([[a + b, c + d], [a + c, b + d]]) : null;
      $('#wmc-g').innerHTML = ($('#wmc-cap').textContent = mode === 'data' ? '同一批 400 張心電圖，醫師 A 與醫師 B 各判讀一次（配對資料）。比較兩位醫師判讀陽性的比例。' : '100 位病人治療前後是否有症狀。調整四格的人數。', chart)({ xcats: mode === 'data' ? ['兩人都陽性', '只有 A 陽性 b', '只有 B 陽性 c', '兩人都陰性'] : ['兩次都有', '變好 b', '變差 c', '兩次都沒有'], y: [0, Math.max(60, a, b, c, d) * 1.1], h: 240, ylab: '人數' }, (X, Y, { iw }) => [[a, 'same'], [b, 'b'], [c, 'c'], [d, 'same']].map(([v, k], i) => `<rect data-k="${k}" x="${X(i) - iw / 10}" y="${Y(v)}" width="${iw / 5}" height="${Y(0) - Y(v)}" style="fill:${k === 'same' ? 'var(--muted)' : 'var(--c2)'};fill-opacity:.8"/><text x="${X(i)}" y="${Y(v) - 6}" text-anchor="middle" style="fill:var(--ink)">${v}</text>`).join(''));
      $('#wmc-k').innerHTML = kvs([[mode === 'data' ? '不一致對：只有 A 陽性 b' : '不一致對：變好 b', b, 'b'], [mode === 'data' ? '不一致對：只有 B 陽性 c' : '不一致對：變差 c', c, 'c'], ['McNemar χ² = (b − c)² ÷ (b + c)', F.n(M.chi2, 2), 'b'], ['McNemar p 值', F.p(M.p), 'c'], ['精確 p 值（二項）', F.p(M.pExact), 'b'], ['錯誤做法：當作兩組獨立的卡方 p', wrong ? F.p(wrong.p) : '—', 'same']]);
    };
    segBind(el, '#wmc-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  kappaw(el) {
    el.innerHTML = SRC_NOTE + MODE_SEG('wka-m') + `<p class="w-cap" id="wka-cap"></p>
<div class="w-row" id="wka-or" hidden>${slider('wka-a', '兩人都判陽性', 0, 100, 1, 20)}${slider('wka-b', '只有甲判陽性', 0, 100, 1, 5)}${slider('wka-c', '只有乙判陽性', 0, 100, 1, 10)}${slider('wka-d', '兩人都判陰性', 0, 100, 1, 15)}</div>
<div class="chart-wrap" id="wka-g"></div><div class="kv" id="wka-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wka-or').hidden = mode === 'data'; $('#wka-cap').textContent = mode === 'data' ? '兩位醫師判讀同一批 400 張心電圖是否有左心室肥大。' : '兩位病理師判讀同一批切片。調整四格的張數。';
      const RD = READERS(), a = mode === 'data' ? RD.a : sv('wka-a'), b = mode === 'data' ? RD.b : sv('wka-b'), c = mode === 'data' ? RD.c : sv('wka-c'), d = mode === 'data' ? RD.d : sv('wka-d'); if (a + b + c + d === 0) return; const K = S.kappa([[a, b], [c, d]]);
      $('#wka-g').innerHTML = chart({ x: [0, 1], y: [0, 1], noY: true, h: 170, xlab: '比例' }, (X, Y) => `<g data-k="po"><rect x="${X(0)}" y="${Y(0.9)}" width="${X(K.po) - X(0)}" height="${Y(0.6) - Y(0.9)}" style="fill:var(--c1)"/><text x="${X(Math.min(K.po, 0.6)) + 6}" y="${Y(0.75)}" dy=".32em" style="fill:var(--ink)">觀察一致 ${F.n(100 * K.po, 1)}%</text></g><g data-k="pe"><rect x="${X(0)}" y="${Y(0.5)}" width="${X(K.pe) - X(0)}" height="${Y(0.2) - Y(0.5)}" style="fill:var(--muted)"/><text x="${X(Math.min(K.pe, 0.6)) + 6}" y="${Y(0.35)}" dy=".32em" style="fill:var(--ink)">機遇一致 ${F.n(100 * K.pe, 1)}%</text></g><g class="hlx" data-k="kap"><line x1="${X(K.pe)}" x2="${X(K.po)}" y1="${Y(0.08)}" y2="${Y(0.08)}" style="stroke:var(--c2);stroke-width:5"/><line x1="${X(K.pe)}" x2="${X(1)}" y1="${Y(0.02)}" y2="${Y(0.02)}" style="stroke:var(--c2);stroke-width:2;stroke-dasharray:4 3"/></g>`);
      $('#wka-k').innerHTML = kvs([['觀察一致率', F.n(100 * K.po, 1) + '%', 'po'], ['機遇一致率', F.n(100 * K.pe, 1) + '%', 'pe'], ['Kappa κ', F.n(K.kappa, 3), 'kap']]);
    };
    segBind(el, '#wka-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  graphsw(el) {
    const stay = STUDY().crp;
    el.innerHTML = SRC_NOTE + `<p class="w-cap">同一份資料：400 位病人的 CRP（發炎指標）。切換圖的種類。</p>
<div class="seg wrap" id="wgr-m"><button type="button" data-m="hist" aria-selected="true">直方圖</button><button type="button" data-m="box" aria-selected="false">箱型圖</button><button type="button" data-m="dot" aria-selected="false">點圖</button><button type="button" data-m="bar" aria-selected="false">平均值長條圖</button></div>
<div class="w-row">${slider('wgr-b', '直方圖的組數', 2, 40, 1, 12)}</div><div class="chart-wrap" id="wgr-c"></div><div class="kv" id="wgr-k"></div>`;
    let mode = 'hist';
    const up = () => {
      const bins = sv('wgr-b'), m = S.mean(stay), md = S.median(stay), [lo, hi] = S.minmax(stay), sd = S.sd(stay);
      let svg = '';
      if (mode === 'hist') svg = histChart(stay, { lo: 0, hi: Math.ceil(hi), bins, h: 260, xlab: 'CRP（mg/L）', ylab: '人數', tag: () => 'bins', extra: (X, Y) => `<line data-k="mean" x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(0) - 190}" style="stroke:var(--c2);stroke-width:2.5"/><line data-k="med" x1="${X(md)}" x2="${X(md)}" y1="${Y(0)}" y2="${Y(0) - 190}" style="stroke:var(--c3);stroke-width:2.5;stroke-dasharray:5 4"/>` });
      else if (mode === 'box') svg = boxStrip([{ label: '全部病人', v: stay }], 'CRP（mg/L）');
      else if (mode === 'dot') { const cnt = {}; svg = chart({ x: [0, Math.ceil(hi)], y: [0, 1], noY: true, h: 260, xlab: 'CRP（mg/L）' }, (X, Y) => stay.map(v => { const vv = Math.round(v * 2) / 2, k = (cnt[vv] = (cnt[vv] || 0) + 1); return `<circle data-k="bins" cx="${X(vv)}" cy="${Y(0) - 6 - (k - 1) * 4}" r="2.4" style="fill:var(--c1);fill-opacity:.75"/>`; }).join('') + `<line data-k="mean" x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(1)}" style="stroke:var(--c2);stroke-width:2"/><line data-k="med" x1="${X(md)}" x2="${X(md)}" y1="${Y(0)}" y2="${Y(1)}" style="stroke:var(--c3);stroke-width:2;stroke-dasharray:5 4"/>`); }
      else svg = chart({ xcats: ['全部病人'], y: [0, m + sd], h: 260, ylab: 'CRP（mg/L）' }, (X, Y) => `<rect data-k="mean" x="${X(0) - 40}" y="${Y(m)}" width="80" height="${Y(0) - Y(m)}" style="fill:var(--c1);fill-opacity:.8"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(m - sd / Math.sqrt(stay.length))}" y2="${Y(m + sd / Math.sqrt(stay.length))}" class="ink" style="stroke-width:2"/>`);
      $('#wgr-c').innerHTML = svg;
      const items = { hist: [['平均數', F.n(m, 1), 'mean'], ['中位數', F.n(md, 1), 'med'], ['組距（每組寬度）', F.n(Math.ceil(hi) / bins, 2) + ' mg/L', 'bins']], box: [['中位數', F.n(md, 1), 'med0'], ['四分位距 IQR', F.n(S.quantile(stay, 0.75) - S.quantile(stay, 0.25), 1), 'iqr0'], ['平均數（◇）', F.n(m, 1), 'mean0']], dot: [['平均數', F.n(m, 1), 'mean'], ['中位數', F.n(md, 1), 'med'], ['人數', stay.length, 'bins']], bar: [['平均數（長條高度）', F.n(m, 1), 'mean']] }[mode];
      $('#wgr-k').innerHTML = kvs([...items, ['最小值 – 最大值', `${F.n(lo)} – ${F.n(hi)}`]]);
      $('#wgr-b').disabled = mode !== 'hist';
    };
    segBind(el, '#wgr-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  simpleregw(el) {
    const r = rngOf(451), N = normOf(r), ax = Array.from({ length: 80 }, () => 30 + 40 * r()), ay = ax.map(a => 100 + 0.8 * a + N(0, 12));
    el.innerHTML = `<p class="w-cap">年齡與收縮壓。拖動「預測的年齡」，比較平均反應的信賴區間與個體的預測區間。</p>
<div class="w-row">${slider('wsr-n', '樣本數', 8, 80, 1, 25)}${slider('wsr-x', '預測的年齡', 10, 100, 1, 60)}</div>
<div class="chart-wrap" id="wsr-c"></div>${legend([['var(--c2)', '平均反應的 95% 信賴帶'], ['var(--c4)', '個體的 95% 預測帶']])}<div class="kv" id="wsr-k"></div>`;
    const up = () => {
      const n = sv('wsr-n'), x0 = sv('wsr-x'), x = ax.slice(0, n), y = ay.slice(0, n), P = S.slrPredict(x, y, x0), [xa, xb] = S.minmax(x), grid = Array.from({ length: 61 }, (_, i) => 10 + 90 * i / 60), B = grid.map(g => S.slrPredict(x, y, g));
      $('#wsr-c').innerHTML = chart({ x: [10, 100], y: [60, 220], h: 320, xlab: '年齡', ylab: '收縮壓', xgrid: true }, (X, Y) => {
        const band = (k, c, op, key) => `<path data-k="${key}" d="${grid.map((g, i) => `${i ? 'L' : 'M'}${X(g).toFixed(1)} ${Y(Math.min(220, B[i][k][1])).toFixed(1)}`).join('')}${grid.map((g, i) => [g, i]).reverse().map(([g, i]) => `L${X(g).toFixed(1)} ${Y(Math.max(60, B[i][k][0])).toFixed(1)}`).join('')}Z" style="fill:${c};fill-opacity:${op}"/>`;
        return `<rect class="keep" x="${X(10)}" y="${Y(220)}" width="${X(xa) - X(10)}" height="${Y(60) - Y(220)}" style="fill:var(--sunk);fill-opacity:.7"/><rect class="keep" x="${X(xb)}" y="${Y(220)}" width="${X(100) - X(xb)}" height="${Y(60) - Y(220)}" style="fill:var(--sunk);fill-opacity:.7"/>`
          + band('pi', 'var(--c4)', 0.15, 'pi') + band('ci', 'var(--c2)', 0.3, 'ci') + x.map((v, i) => `<circle cx="${X(v).toFixed(1)}" cy="${Y(y[i]).toFixed(1)}" r="3.5" style="fill:var(--c1);fill-opacity:.6"/>`).join('')
          + `<line data-k="slope" x1="${X(10)}" x2="${X(100)}" y1="${Y(P.intercept + P.slope * 10)}" y2="${Y(P.intercept + P.slope * 100)}" style="stroke:var(--ink);stroke-width:2"/><g data-k="fit ci pi"><line x1="${X(x0)}" x2="${X(x0)}" y1="${Y(Math.max(60, P.pi[0]))}" y2="${Y(Math.min(220, P.pi[1]))}" style="stroke:var(--c4);stroke-width:3"/><line x1="${X(x0) + 5}" x2="${X(x0) + 5}" y1="${Y(Math.max(60, P.ci[0]))}" y2="${Y(Math.min(220, P.ci[1]))}" style="stroke:var(--c2);stroke-width:5"/><circle cx="${X(x0)}" cy="${Y(P.fit)}" r="6" style="fill:var(--ink)"/></g>`;
      });
      $('#wsr-k').innerHTML = kvs([['斜率（95% CI）', `${F.n(P.slope, 2)}（${F.ci(...P.slopeCI, 2)}）`, 'slope'], ['R²', F.n(P.r2, 3), 'slope'], [`${x0} 歲的預測值`, F.n(P.fit, 1), 'fit'], ['平均反應的 95% 信賴區間', F.ci(...P.ci, 1), 'ci'], ['個體的 95% 預測區間', F.ci(...P.pi, 1), 'pi']]);
    };
    el.addEventListener('input', up); up();
  },
  regdiagw(el) {
    const r = rngOf(501), N = normOf(r), bx = Array.from({ length: 40 }, () => 1 + 9 * r()), be = Array.from({ length: 40 }, () => N());
    el.innerHTML = `<div class="seg wrap" id="wrd-m"><button type="button" data-m="ok" aria-selected="true">合適</button><button type="button" data-m="curve" aria-selected="false">彎曲</button><button type="button" data-m="funnel" aria-selected="false">喇叭形</button><button type="button" data-m="infl" aria-selected="false">一個影響點</button></div>
<div class="seg wrap" id="wrd-t"><button type="button" data-t="none" aria-selected="true">直線模型</button><button type="button" data-t="log" aria-selected="false">對 y 取對數</button><button type="button" data-t="quad" aria-selected="false">加入 x²</button></div>
<div class="w-cols"><figure class="fig"><figcaption>資料與模型</figcaption><div class="chart-wrap" id="wrd-a"></div></figure><figure class="fig"><figcaption>殘差圖</figcaption><div class="chart-wrap" id="wrd-b"></div></figure></div><div class="kv" id="wrd-k"></div>`;
    let mode = 'ok', tf = 'none';
    const up = () => {
      let x = bx.slice(), y = x.map((v, i) => mode === 'curve' ? 2 + 0.5 * (v - 5.5) ** 2 + be[i] : mode === 'funnel' ? Math.exp(0.6 + 0.25 * v + 0.25 * be[i]) : 3 + 1.2 * v + 1.5 * be[i]);
      if (mode === 'infl') { x = [...x, 22]; y = [...y, 6]; }
      const yy = tf === 'log' ? y.map(v => Math.log(Math.max(0.01, v))) : y, X = x.map(v => (tf === 'quad' ? [1, v, v * v] : [1, v])), m = S.ols(X, yy), iC = m.cook.indexOf(Math.max(...m.cook)), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(yy), grid = Array.from({ length: 50 }, (_, i) => x0 + (x1 - x0) * i / 49);
      $('#wrd-a').innerHTML = chart({ x: [x0, x1], y: [y0, y1], h: 240, xlab: 'x', ylab: tf === 'log' ? 'ln(y)' : 'y' }, (Xs, Ys) => x.map((v, i) => `<circle data-k="${i === iC ? 'cook' : 'pts'}" cx="${Xs(v).toFixed(1)}" cy="${Ys(yy[i]).toFixed(1)}" r="${i === iC ? 6 : 3.5}" style="fill:${i === iC ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.7"/>`).join('') + `<path data-k="r2" d="${grid.map((g, i) => `${i ? 'L' : 'M'}${Xs(g).toFixed(1)} ${Ys(m.b[0] + m.b[1] * g + (tf === 'quad' ? m.b[2] * g * g : 0)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`);
      const [f0, f1] = S.minmax(m.fitted), ra = Math.max(...m.resid.map(Math.abs));
      $('#wrd-b').innerHTML = chart({ x: [f0, f1], y: [-ra, ra], h: 240, xlab: '預測值', ylab: '殘差' }, (Xs, Ys, { M, iw }) => `<line class="keep" x1="${M.l}" x2="${M.l + iw}" y1="${Ys(0)}" y2="${Ys(0)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + m.fitted.map((v, i) => `<circle data-k="${i === iC ? 'cook' : 'res'}" cx="${Xs(v).toFixed(1)}" cy="${Ys(m.resid[i]).toFixed(1)}" r="${i === iC ? 6 : 3.5}" style="fill:${i === iC ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.7"/>`).join(''));
      $('#wrd-k').innerHTML = kvs([['R²', F.n(m.r2, 3), 'r2'], ['殘差標準誤', F.n(m.sigma, 3), 'res'], ['最大的 Cook 距離（紅點）', F.n(m.cook[iC], 3), 'cook'], ['斜率（x 的係數）', F.n(m.b[1], 3), 'r2']]);
    };
    segBind(el, '#wrd-m', b => { mode = b.dataset.m; up(); }); segBind(el, '#wrd-t', b => { tf = b.dataset.t; up(); }); up();
  },
  ratew(el) {
    el.innerHTML = `<p class="w-cap">兩組的事件數與追蹤人年。發生率 = 事件數 ÷ 人年。</p>
<div class="w-row">${slider('wrt-a', '吸菸組事件數', 0, 100, 1, 30)}${slider('wrt-ta', '吸菸組人年', 200, 6000, 100, 2000)}${slider('wrt-b', '不吸菸組事件數', 0, 100, 1, 15)}${slider('wrt-tb', '不吸菸組人年', 200, 6000, 100, 2500)}</div>
<div class="chart-wrap" id="wrt-c"></div><div class="kv" id="wrt-k"></div>`;
    const up = () => {
      const a = sv('wrt-a'), ta = sv('wrt-ta'), b = sv('wrt-b'), tb = sv('wrt-tb'); if (!a || !b) { $('#wrt-k').innerHTML = '<p class="w-out">兩組都至少需要 1 個事件。</p>'; return; }
      const ra = 1000 * a / ta, rb = 1000 * b / tb, rr = (a / ta) / (b / tb), se = Math.sqrt(1 / a + 1 / b), ci = [rr * Math.exp(-1.96 * se), rr * Math.exp(1.96 * se)], m = S.poisson([[1, 0], [1, 1]], [b, a], [Math.log(tb), Math.log(ta)]);
      const cia = [ra * Math.exp(-1.96 / Math.sqrt(a)), ra * Math.exp(1.96 / Math.sqrt(a))], cib = [rb * Math.exp(-1.96 / Math.sqrt(b)), rb * Math.exp(1.96 / Math.sqrt(b))], top = Math.max(cia[1], cib[1]) * 1.1;
      $('#wrt-c').innerHTML = chart({ xcats: ['不吸菸', '吸菸'], y: [0, top], h: 240, ylab: '每千人年的發生率' }, (X, Y) => [[rb, cib, 'rb'], [ra, cia, 'ra']].map(([v, ci2, k], i) => `<g data-k="${k} rr"><rect x="${X(i) - 30}" y="${Y(v)}" width="60" height="${Y(0) - Y(v)}" style="fill:${col4(i)};fill-opacity:.75"/><line x1="${X(i)}" x2="${X(i)}" y1="${Y(ci2[0])}" y2="${Y(ci2[1])}" class="ink" style="stroke-width:2"/></g>`).join(''));
      $('#wrt-k').innerHTML = kvs([['吸菸組發生率（每千人年）', F.n(ra, 1), 'ra'], ['不吸菸組發生率（每千人年）', F.n(rb, 1), 'rb'], ['率比（95% CI）', `${F.n(rr, 2)}（${F.ci(...ci, 2)}）`, 'rr'], ['Poisson 迴歸的 e^β', F.n(Math.exp(m.b[1]), 2), 'rr'], ['只比事件數的比值（錯誤）', F.n(a / b, 2)]]);
    };
    el.addEventListener('input', up); up();
  },
  blandw(el) {
    const r = rngOf(551), N = normOf(r), truth = Array.from({ length: 50 }, () => 70 + 150 * r()), e1 = Array.from({ length: 50 }, () => N()), e2 = Array.from({ length: 50 }, () => N());
    el.innerHTML = `<p class="w-cap">舊方法（A）與新血糖儀（B）測量同樣 50 份樣本。</p>
<div class="w-row">${slider('wba-b', '固定偏差（B 多幾 mg/dL）', -20, 20, 1, 10)}${slider('wba-p', '比例偏差（B 多幾 %）', -20, 20, 1, 0)}${slider('wba-e', '隨機誤差（SD）', 1, 20, 1, 5)}</div>
<div class="w-cols"><figure class="fig"><figcaption>兩方法的散佈圖（虛線為 A = B）</figcaption><div class="chart-wrap" id="wba-s"></div></figure><figure class="fig"><figcaption>Bland–Altman 圖</figcaption><div class="chart-wrap" id="wba-c"></div></figure></div><div class="kv" id="wba-k"></div>`;
    const up = () => {
      const bias0 = sv('wba-b'), pb = sv('wba-p') / 100, err = sv('wba-e'), A = truth.map((t, i) => t + 0.5 * err * e1[i]), B = truth.map((t, i) => t * (1 + pb) + bias0 + 0.5 * err * e2[i]);
      const d = B.map((v, i) => v - A[i]), mm = B.map((v, i) => (v + A[i]) / 2), bias = S.mean(d), sdd = S.sd(d), loa = [bias - 1.96 * sdd, bias + 1.96 * sdd], P = S.pearson(A, B), [lo, hi] = S.minmax([...A, ...B]);
      $('#wba-s').innerHTML = chart({ x: [lo, hi], y: [lo, hi], h: 240, xlab: '方法 A', ylab: '方法 B' }, (X, Y) => `<line class="keep" x1="${X(lo)}" y1="${Y(lo)}" x2="${X(hi)}" y2="${Y(hi)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + A.map((v, i) => `<circle data-k="r" cx="${X(v).toFixed(1)}" cy="${Y(B[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.6"/>`).join(''));
      const [m0, m1] = S.minmax(mm), [d0, d1] = S.minmax([...d, ...loa, 0]);
      $('#wba-c').innerHTML = chart({ x: [m0, m1], y: [d0 - 2, d1 + 2], h: 240, xlab: '兩方法的平均', ylab: '差值 B − A' }, (X, Y, { M, iw }) => mm.map((v, i) => `<circle cx="${X(v).toFixed(1)}" cy="${Y(d[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.6"/>`).join('') + `<line class="keep" x1="${M.l}" x2="${M.l + iw}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--muted)"/><line data-k="bias" x1="${M.l}" x2="${M.l + iw}" y1="${Y(bias)}" y2="${Y(bias)}" style="stroke:var(--c2);stroke-width:2.5"/>` + loa.map(v => `<line data-k="loa" x1="${M.l}" x2="${M.l + iw}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--c2);stroke-dasharray:6 4"/>`).join(''));
      $('#wba-k').innerHTML = kvs([['相關係數 r', F.n(P.r, 3), 'r'], ['偏差（平均差）', F.n(bias, 1), 'bias'], ['95% 一致性界限', F.ci(...loa, 1), 'loa']]);
    };
    el.addEventListener('input', up); up();
  },
  mhw(el) {
    el.innerHTML = `<p class="w-cap">兩個科系：容易進的甲系（錄取率約 65%）、難進的乙系（約 25%）。各 500 名男性、500 名女性申請者。</p>
<div class="w-row">${slider('wmh-f', '女性申請乙系的比例', 0.1, 0.9, 0.05, 0.8)}${slider('wmh-m', '男性申請乙系的比例', 0.1, 0.9, 0.05, 0.2)}${slider('wmh-g', '乙系中男性比女性多錄取（百分點）', -20, 20, 1, 0)}</div>
<div class="chart-wrap" id="wmh-c"></div><div class="kv" id="wmh-k"></div>`;
    const up = () => {
      const fB = sv('wmh-f', v => Math.round(v * 100) + '%'), mB = sv('wmh-m', v => Math.round(v * 100) + '%'), gB = sv('wmh-g') / 100;
      const cell = (n, p) => [Math.round(n * p), n - Math.round(n * p)];
      const tA = (() => { const m = cell(500 * (1 - mB), 0.65), f = cell(500 * (1 - fB), 0.65); return [[m[0], f[0]], [m[1], f[1]]]; })(), tB = (() => { const m = cell(500 * mB, 0.25 + gB / 2), f = cell(500 * fB, 0.25 - gB / 2); return [[m[0], f[0]], [m[1], f[1]]]; })();
      const crude = [[tA[0][0] + tB[0][0], tA[0][1] + tB[0][1]], [tA[1][0] + tB[1][0], tA[1][1] + tB[1][1]]], M = S.mantelHaenszel([tA, tB]);
      const orOf = ([[a, b], [c, d]]) => { const h = a * b * c * d === 0 ? 0.5 : 0, A = a + h, B = b + h, C = c + h, D = d + h, l = Math.log(A * D / (B * C)), se = Math.sqrt(1 / A + 1 / B + 1 / C + 1 / D); return { est: Math.exp(l), lo: Math.exp(l - 1.96 * se), hi: Math.exp(l + 1.96 * se) }; };
      const rows = [{ k: 'sa', label: '甲系', ...orOf(tA) }, { k: 'sb', label: '乙系', ...orOf(tB) }, { k: 'crude', label: '兩系合起來（粗）', ...orOf(crude) }, { k: 'mh', label: 'Mantel–Haenszel', est: M.or, lo: M.ci[0], hi: M.ci[1] }];
      $('#wmh-c').innerHTML = forestChart(rows, '男性錄取的勝算比（相對於女性，對數尺度）');
      const rate = (t, j) => t[0][j] / (t[0][j] + t[1][j]);
      $('#wmh-k').innerHTML = kvs([['未分層：男 vs 女錄取率', `${F.n(100 * rate(crude, 0), 1)}% vs ${F.n(100 * rate(crude, 1), 1)}%`, 'crude'], ['甲系的勝算比', F.n(rows[0].est, 2), 'sa'], ['乙系的勝算比', F.n(rows[1].est, 2), 'sb'], ['粗勝算比（未分層）', F.n(rows[2].est, 2), 'crude'], ['Mantel–Haenszel 勝算比', `${F.n(M.or, 2)}（${F.ci(...M.ci, 2)}）`, 'mh']]);
    };
    el.addEventListener('input', up); up();
  },
  stdw(el) {
    el.innerHTML = `<div class="seg wrap" id="wsd-m"><button type="button" data-m="std" aria-selected="true">年齡標準化</button><button type="button" data-m="paf" aria-selected="false">族群歸因分率</button></div><div id="wsd-body"></div>`;
    let mode = 'std';
    const draw = () => {
      const body = $('#wsd-body', el);
      if (mode === 'std') {
        body.innerHTML = `<p class="w-cap">甲、乙兩鎮各 10,000 人。調整各鎮的老年人口比例與各年齡層死亡率（每千人）。標準人口：老年人 30%。</p>
<div class="w-row">${slider('wsd-oa', '甲鎮老年人比例', 0.05, 0.6, 0.05, 0.5)}${slider('wsd-ob', '乙鎮老年人比例', 0.05, 0.6, 0.05, 0.1)}</div>
<div class="w-row">${slider('wsd-ya', '甲鎮年輕人死亡率', 0.5, 10, 0.5, 1.5)}${slider('wsd-oa2', '甲鎮老年人死亡率', 5, 80, 1, 40)}${slider('wsd-yb', '乙鎮年輕人死亡率', 0.5, 10, 0.5, 2)}${slider('wsd-ob2', '乙鎮老年人死亡率', 5, 80, 1, 50)}</div><div class="chart-wrap" id="wsd-c"></div><div class="kv" id="wsd-k"></div>`;
      } else body.innerHTML = `<div class="w-row">${slider('wsd-pe', '族群中暴露者的比例 Pe', 0.05, 0.9, 0.05, 0.3)}${slider('wsd-rr', '相對風險 RR', 1, 10, 0.1, 2)}</div><div class="chart-wrap" id="wsd-c"></div><div class="kv" id="wsd-k"></div>`;
      up();
    };
    const up = () => {
      if (mode === 'std') {
        const oa = sv('wsd-oa', v => Math.round(v * 100) + '%'), ob = sv('wsd-ob', v => Math.round(v * 100) + '%'), ya = sv('wsd-ya'), o2a = sv('wsd-oa2'), yb = sv('wsd-yb'), o2b = sv('wsd-ob2');
        const crA = (1 - oa) * ya + oa * o2a, crB = (1 - ob) * yb + ob * o2b, sA = 0.7 * ya + 0.3 * o2a, sB = 0.7 * yb + 0.3 * o2b, expA = (1 - oa) * yb + oa * o2b, smr = crA / expA, top = Math.max(crA, crB, sA, sB) * 1.15;
        $('#wsd-c').innerHTML = chart({ xcats: ['粗死亡率', '年齡標準化率'], y: [0, top], h: 240, ylab: '每千人死亡' }, (X, Y) => [[crA, crB, 'crude'], [sA, sB, 'std']].map(([a, b, k], i) => `<g data-k="${k}"><rect x="${X(i) - 34}" y="${Y(a)}" width="30" height="${Y(0) - Y(a)}" style="fill:var(--c1)"/><rect x="${X(i) + 4}" y="${Y(b)}" width="30" height="${Y(0) - Y(b)}" style="fill:var(--c2)"/></g>`).join(''));
        $('#wsd-c').insertAdjacentHTML('beforeend', legend([['var(--c1)', '甲鎮'], ['var(--c2)', '乙鎮']]));
        $('#wsd-k').innerHTML = kvs([['粗率（甲 vs 乙）', `${F.n(crA, 1)} vs ${F.n(crB, 1)}`, 'crude'], ['年齡標準化率（甲 vs 乙）', `${F.n(sA, 1)} vs ${F.n(sB, 1)}`, 'std'], ['甲鎮以乙鎮為標準的 SMR', F.n(smr, 2), 'std']]);
      } else {
        const pe = sv('wsd-pe', v => Math.round(v * 100) + '%'), rr = sv('wsd-rr', v => v.toFixed(1)), paf = pe * (rr - 1) / (1 + pe * (rr - 1)), afe = (rr - 1) / rr, r0 = 0.05, cases0 = 10000 * ((1 - pe) * r0), cases1 = 10000 * pe * r0 * rr, attr = 10000 * pe * r0 * (rr - 1);
        $('#wsd-c').innerHTML = chart({ xcats: ['非暴露者的病例', '暴露者的病例'], y: [0, Math.max(cases0, cases1) * 1.15], h: 240, ylab: '病例數（每萬人，基礎風險 5%）' }, (X, Y) => `<rect data-k="base" x="${X(0) - 34}" y="${Y(cases0)}" width="68" height="${Y(0) - Y(cases0)}" style="fill:var(--c1)"/><rect data-k="base afe" x="${X(1) - 34}" y="${Y(cases1 - attr)}" width="68" height="${Y(0) - Y(cases1 - attr)}" style="fill:var(--c1)"/><rect data-k="paf afe" x="${X(1) - 34}" y="${Y(cases1)}" width="68" height="${Y(cases1 - attr) - Y(cases1)}" style="fill:var(--c2)"/>`);
        $('#wsd-c').insertAdjacentHTML('beforeend', legend([['var(--c2)', '可歸因於暴露的病例'], ['var(--c1)', '即使沒有暴露也會發生的病例']]));
        $('#wsd-k').innerHTML = kvs([['族群歸因分率 PAF', F.n(100 * paf, 1) + '%', 'paf'], ['暴露組歸因分率 (RR − 1) ÷ RR', F.n(100 * afe, 1) + '%', 'afe'], ['可歸因的病例（= PAF × 全部病例，每萬人）', F.n(attr, 0), 'paf']]);
      }
    };
    segBind(el, '#wsd-m', b => { mode = b.dataset.m; draw(); });
    el.addEventListener('input', up); draw();
  },
  phw(el) {
    const u = Array.from({ length: 300 }, rngOf(601)), cens = Array.from({ length: 300 }, rngOf(602));
    el.innerHTML = `<p class="w-cap">標準療法 vs 手術，各 150 人，追蹤 36 個月。設定手術組在「切點」前後的危險比。</p>
<div class="w-row">${slider('wph-e', '前期的危險比（手術 ÷ 標準）', 0.3, 3, 0.1, 2)}${slider('wph-l', '後期的危險比', 0.3, 3, 0.1, 0.4)}${slider('wph-t', '切點（月）', 2, 24, 1, 6)}</div>
<div class="w-cols"><figure class="fig"><figcaption>Kaplan–Meier 曲線</figcaption><div class="chart-wrap" id="wph-a"></div></figure><figure class="fig"><figcaption>log(−log) 圖</figcaption><div class="chart-wrap" id="wph-b"></div></figure></div>${legend([['var(--c1)', '標準療法'], ['var(--c2)', '手術']])}<div class="kv" id="wph-k"></div>`;
    const up = () => {
      const he = sv('wph-e', v => v.toFixed(1)), hl = sv('wph-l', v => v.toFixed(1)), tc = sv('wph-t'), base = 0.04;
      const T = [], St = [], g = [];
      for (let i = 0; i < 300; i++) {
        const grp = i % 2, h1 = base * (grp ? he : 1), h2 = base * (grp ? hl : 1), e = -Math.log(1 - u[i]); let t = e / h1; if (t > tc) t = tc + (e - h1 * tc) / h2;
        const c = 12 + 24 * cens[i]; T.push(Math.min(t, c, 36)); St.push(t <= Math.min(c, 36) ? 1 : 0); g.push(grp);
      }
      const ks = [0, 1].map(k => S.km(T.filter((_, i) => g[i] === k), St.filter((_, i) => g[i] === k))), cx = S.cox(T, St, g.map(v => [v])), hr = Math.exp(cx.b[0]);
      const pr = (a, b) => { const ev = k => St.filter((s, i) => g[i] === k && s && T[i] > a && T[i] <= b).length, pt = k => S.sum(T.map((t, i) => (g[i] === k ? Math.max(0, Math.min(t, b) - a) : 0))); return (ev(1) / pt(1)) / (ev(0) / pt(0)); };
      $('#wph-a').innerHTML = chart({ x: [0, 36], y: [0, 1], h: 240, xlab: '月', ylab: '存活機率' }, (X, Y) => `<line class="hlx" data-k="early late" x1="${X(tc)}" x2="${X(tc)}" y1="${Y(0)}" y2="${Y(1)}" style="stroke:var(--c4);stroke-width:2;stroke-dasharray:5 4"/>` + ks.map((k, i) => { let d = `M${X(0)} ${Y(1)}`; k.steps.slice(1).forEach(p => { d += `H${X(p.t).toFixed(1)}V${Y(p.S).toFixed(1)}`; }); return `<path data-k="hr" d="${d}H${X(k.end).toFixed(1)}" style="fill:none;stroke:${col4(i)};stroke-width:2.2"/>`; }).join(''));
      const ll = ks.map(k => k.steps.slice(1).filter(p => p.S > 0 && p.S < 1 && p.t > 0.3).map(p => [Math.log(p.t), Math.log(-Math.log(p.S))])), fl = ll.flat(), [x0, x1] = S.minmax(fl.map(p => p[0])), [y0, y1] = S.minmax(fl.map(p => p[1]));
      $('#wph-b').innerHTML = chart({ x: [x0, x1], y: [y0, y1], h: 240, xlab: 'log(月)', ylab: 'log(−log S)' }, (X, Y) => ll.map((pts, i) => `<path data-k="ll" d="${pts.map(([a, b], j) => `${j ? 'L' : 'M'}${X(a).toFixed(1)} ${Y(b).toFixed(1)}`).join('')}" style="fill:none;stroke:${col4(i)};stroke-width:2"/>`).join('') + `<line class="hlx" data-k="early late" x1="${X(Math.log(tc))}" x2="${X(Math.log(tc))}" y1="${Y(y0)}" y2="${Y(y1)}" style="stroke:var(--c4);stroke-width:2;stroke-dasharray:5 4"/>`);
      $('#wph-k').innerHTML = kvs([['Cox 模型的單一危險比', F.n(hr, 2), 'hr'], [`切點前的率比（0–${tc} 月）`, F.n(pr(0, tc), 2), 'early'], [`切點後的率比（${tc}–36 月）`, F.n(pr(tc, 36), 2), 'late']]);
    };
    el.addEventListener('input', up); up();
  },
  missingw(el) {
    const r = rngOf(701), N = normOf(r), n = 200, age = Array.from({ length: n }, () => N(55, 10)), sbp = age.map(a => 90 + 0.8 * a + N(0, 10)), u = Array.from({ length: n }, () => r()), trueMean = S.mean(sbp);
    el.innerHTML = `<p class="w-cap">200 位病人的年齡（全部有）與收縮壓（部分缺失）。比較各種處理方法估計的收縮壓平均。</p>
<div class="seg wrap" id="wms-m"><button type="button" data-m="mcar" aria-selected="false">完全隨機缺失</button><button type="button" data-m="mar" aria-selected="true">隨機缺失（年長者較常缺）</button><button type="button" data-m="mnar" aria-selected="false">非隨機缺失（血壓高的較常缺）</button></div>
<div class="w-row">${slider('wms-p', '缺失比例', 0.05, 0.6, 0.05, 0.3)}</div>
<div class="w-cols"><figure class="fig"><figcaption>空心點為收縮壓缺失的病人（灰色為真實值，實際上看不到）</figcaption><div class="chart-wrap" id="wms-a"></div></figure><figure class="fig"><figcaption>各方法估計的平均與 95% CI；黑色虛線是真值</figcaption><div class="chart-wrap" id="wms-b"></div></figure></div><div class="kv" id="wms-k"></div>`;
    let mode = 'mar';
    const up = () => {
      const p = sv('wms-p', v => Math.round(v * 100) + '%'), score = mode === 'mcar' ? u : mode === 'mar' ? age.map((a, i) => -(a - 55) / 10 + (u[i] - 0.5)) : sbp.map((v, i) => -(v - 134) / 13 + (u[i] - 0.5));
      const order = score.map((s, i) => [s, i]).sort((x, y) => x[0] - y[0]), miss = new Set(order.slice(0, Math.round(n * p)).map(x => x[1])), obs = sbp.map((_, i) => i).filter(i => !miss.has(i));
      const ciM = v => { const m = S.mean(v), se = S.sd(v) / Math.sqrt(v.length); return { m, lo: m - 1.96 * se, hi: m + 1.96 * se, sd: S.sd(v) }; };
      const cc = ciM(obs.map(i => sbp[i])), meanFill = ciM(sbp.map((v, i) => (miss.has(i) ? cc.m : v))), fit = S.pearson(obs.map(i => age[i]), obs.map(i => sbp[i])), resSd = Math.sqrt(S.sum(obs.map(i => (sbp[i] - fit.intercept - fit.slope * age[i]) ** 2)) / (obs.length - 2));
      const regFill = ciM(sbp.map((v, i) => (miss.has(i) ? fit.intercept + fit.slope * age[i] : v)));
      const M = 20, ests = [], wv = []; for (let k = 0; k < M; k++) { const d = sbp.map((v, i) => (miss.has(i) ? fit.intercept + fit.slope * age[i] + resSd * rnorm() : v)); ests.push(S.mean(d)); wv.push(S.variance(d) / n); }
      const Q = S.mean(ests), T = S.mean(wv) + (1 + 1 / M) * S.variance(ests), mi = { m: Q, lo: Q - 1.96 * Math.sqrt(T), hi: Q + 1.96 * Math.sqrt(T) };
      const [y0, y1] = S.minmax(sbp);
      $('#wms-a').innerHTML = chart({ x: [25, 85], y: [y0, y1], h: 240, xlab: '年齡', ylab: '收縮壓' }, (X, Y) => sbp.map((v, i) => miss.has(i) ? `<circle data-k="miss" cx="${X(age[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.5" style="fill:none;stroke:var(--muted);stroke-width:1.2"/>` : `<circle data-k="cc" cx="${X(age[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.6"/>`).join(''));
      const rows = [['完全案例', cc, 'cc'], ['平均值填補', meanFill, 'mf'], ['單次迴歸填補', regFill, 'rf'], ['多重插補（20 次）', mi, 'mi']], lo = Math.min(trueMean - 6, ...rows.map(r2 => r2[1].lo)), hi = Math.max(trueMean + 6, ...rows.map(r2 => r2[1].hi));
      $('#wms-b').innerHTML = chart({ ycats: rows.map(r2 => r2[0]), x: [lo, hi], h: 220, m: { l: 112 }, xlab: '收縮壓平均' }, (X, Y, { M: Mg, ih }) => `<line class="keep" x1="${X(trueMean)}" x2="${X(trueMean)}" y1="${Mg.t}" y2="${Mg.t + ih}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/>` + rows.map(([, e, k], i) => `<g data-k="${k}"><line x1="${X(e.lo)}" x2="${X(e.hi)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c2);stroke-width:4"/><circle cx="${X(e.m)}" cy="${Y(i)}" r="5.5" style="fill:var(--c2)"/></g>`).join(''));
      $('#wms-k').innerHTML = kvs([['真值（全部 200 人的平均）', F.n(trueMean, 1)], ['完全案例分析', `${F.n(cc.m, 1)}（${F.ci(cc.lo, cc.hi, 1)}）`, 'cc'], ['平均值填補後的標準差', `${F.n(meanFill.sd, 1)}（原本 ${F.n(S.sd(sbp), 1)}）`, 'mf'], ['多重插補', `${F.n(mi.m, 1)}（${F.ci(mi.lo, mi.hi, 1)}）`, 'mi']]);
    };
    segBind(el, '#wms-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  metaw(el) {
    const B = [['Aronson 1948', 4, 119, 11, 128], ['Ferguson 1949', 6, 300, 29, 274], ['Rosenthal 1960', 3, 228, 11, 209], ['Hart 1977', 62, 13536, 248, 12619], ['Frimodt-Moller 1973', 33, 5036, 47, 5761], ['Stein 1953', 180, 1361, 372, 1079], ['Vandiviere 1973', 8, 2537, 10, 619], ['Madras 1980', 505, 87886, 499, 87892], ['Coetzee 1968', 29, 7470, 45, 7232], ['Rosenthal 1961', 17, 1699, 65, 1600], ['Comstock 1974', 186, 50448, 141, 27197], ['Comstock 1969', 5, 2493, 3, 2338], ['Comstock 1976', 27, 16886, 29, 17825]];
    const all = B.map(([l, a, b, c, d]) => ({ l, y: Math.log(a / (a + b) / (c / (c + d))), v: 1 / a - 1 / (a + b) + 1 / c - 1 / (c + d) }));
    el.innerHTML = `<p class="w-cap">BCG 疫苗與結核病：13 個試驗的風險比 RR（疫苗組 ÷ 對照組）。</p>
<div class="seg wrap" id="wma-m"><button type="button" data-m="fe" aria-selected="true">方塊大小：固定效果權重</button><button type="button" data-m="re" aria-selected="false">方塊大小：隨機效果權重</button></div>
<div class="w-row"><label class="fld"><span>暫時拿掉一篇研究（敏感度分析）</span><select id="wma-x"><option value="">全部納入</option>${B.map((r, i) => `<option value="${i}">${r[0]}</option>`).join('')}</select></label></div>
<figure class="fig"><figcaption>森林圖：方塊＝各研究 RR（大小＝權重），橫線＝95% CI；菱形＝合併估計</figcaption><div class="chart-wrap" id="wma-a"></div></figure>
<figure class="fig"><figcaption>漏斗圖：越上面越精確；灰線為以固定效果合併估計為中心的 95% 範圍</figcaption><div class="chart-wrap" id="wma-b"></div></figure><div class="kv" id="wma-k"></div>`;
    let mode = 'fe';
    const up = () => {
      const x = $('#wma-x').value, st = all.filter((_, i) => String(i) !== x), m = S.meta(st.map(s => s.y), st.map(s => s.v)), wt = mode === 'fe' ? m.w : m.wr, wmax = Math.max(...wt), e = Math.exp;
      const rows = [...st.map(s => s.l), '固定效果模型', '隨機效果模型', '預測區間'], lo = 0.05, hi = 5;
      $('#wma-a').innerHTML = chart({ ycats: rows, xlog: true, x: [lo, hi], h: 70 + rows.length * 24, m: { l: Math.min(150, CW * 0.36) }, xlab: 'RR（對數刻度；< 1 表示疫苗組風險較低）' }, (X, Y, { M: Mg, ih }) => {
        const cx = v => X(Math.min(hi, Math.max(lo, e(v)))), dia = (r, i, k, c) => `<path data-k="${k}" d="M${cx(r.lo)} ${Y(i)}L${cx(r.est)} ${Y(i) - 7}L${cx(r.hi)} ${Y(i)}L${cx(r.est)} ${Y(i) + 7}Z" style="fill:${c}"/>`;
        let g = `<line x1="${X(1)}" x2="${X(1)}" y1="${Mg.t}" y2="${Mg.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/><line class="hlx" data-k="q i2" x1="${cx(m.fixed.est)}" x2="${cx(m.fixed.est)}" y1="${Mg.t}" y2="${Mg.t + ih}" style="stroke:var(--c2);stroke-width:1.5"/>`;
        st.forEach((s, i) => { const se = Math.sqrt(s.v), sz = 3 + 8 * Math.sqrt(wt[i] / wmax); g += `<line class="hlx" data-k="q i2" x1="${cx(s.y)}" x2="${cx(m.fixed.est)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c2);stroke-width:3;stroke-opacity:.6"/><g data-k="st"><line x1="${cx(s.y - 1.96 * se)}" x2="${cx(s.y + 1.96 * se)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c1);stroke-width:1.5"/><rect x="${cx(s.y) - sz}" y="${Y(i) - sz}" width="${2 * sz}" height="${2 * sz}" style="fill:var(--c1)"/></g>`; });
        const k = st.length;
        return g + dia(m.fixed, k, 'fe', 'var(--ink)') + dia(m.random, k + 1, 're', 'var(--c2)') + `<line data-k="pi tau" x1="${cx(m.pi[0])}" x2="${cx(m.pi[1])}" y1="${Y(k + 2)}" y2="${Y(k + 2)}" style="stroke:var(--c2);stroke-width:4;stroke-opacity:.55"/>`;
      });
      const pr = st.map(s => 1 / Math.sqrt(s.v)), pmax = Math.max(...pr) * 1.1, ys = Array.from({ length: 40 }, (_, i) => 1.5 + (pmax - 1.5) * i / 39);
      $('#wma-b').innerHTML = chart({ x: [lo, hi], xlog: true, y: [0, pmax], h: 230, xlab: 'RR（對數刻度）', ylab: '精確度 1/標準誤' }, (X, Y) => {
        const cx = v => X(Math.min(hi, Math.max(lo, e(v)))), f = m.fixed.est, side = sg => ys.map((p, i) => `${i ? 'L' : 'M'}${cx(f + sg * 1.96 / p).toFixed(1)} ${Y(p).toFixed(1)}`).join('');
        return `<path class="keep" d="${side(-1)}" style="fill:none;stroke:var(--muted);stroke-dasharray:4 3"/><path class="keep" d="${side(1)}" style="fill:none;stroke:var(--muted);stroke-dasharray:4 3"/><line data-k="fe" x1="${cx(f)}" x2="${cx(f)}" y1="${Y(0)}" y2="${Y(pmax)}" style="stroke:var(--ink);stroke-width:1.5"/>` + st.map((s, i) => `<circle data-k="st" cx="${cx(s.y).toFixed(1)}" cy="${Y(pr[i]).toFixed(1)}" r="4.5" style="fill:var(--c1);fill-opacity:.75"/>`).join('');
      });
      const rr = r => `${F.n(e(r.est), 2)}（${F.ci(e(r.lo), e(r.hi), 2)}）`;
      $('#wma-k').innerHTML = kvs([['納入的研究數 n', String(m.k), 'st'], ['固定效果模型合併 RR', rr(m.fixed), 'fe'], ['隨機效果模型合併 RR', rr(m.random), 're'], ["Cochran's Q", `${F.n(m.Q, 1)}（自由度 ${m.df}，${F.peq(m.pQ)}）`, 'q'], ['I²', `${F.n(100 * m.I2, 1)}%`, 'i2'], ['τ²', F.n(m.tau2, 3), 'tau'], ['隨機效果的 95% 預測區間（RR）', F.ci(e(m.pi[0]), e(m.pi[1]), 2), 'pi']]);
    };
    segBind(el, '#wma-m', b => { mode = b.dataset.m; up(); }); el.addEventListener('change', up); up();
  },
  equivw(el) {
    el.innerHTML = `<p class="w-cap">兩種療法的治癒率都約 80%。差異 = 新療法 − 標準療法（百分點），越大越好。</p>
<div class="w-row">${slider('weq-d', '觀察到的差異', -12, 12, 0.5, -2)}${slider('weq-n', '每組人數', 40, 1500, 10, 300)}${slider('weq-m', '界限 Δ', 2, 15, 0.5, 10)}</div>
<figure class="fig"><figcaption>淺色帶＝−Δ 到 +Δ；虛線＝0（兩者相同）</figcaption><div class="chart-wrap" id="weq-a"></div></figure><div class="kv" id="weq-k"></div>
<h4>交叉設計 vs 平行設計：所需總人數</h4><p class="w-cap">偵測 5 mmHg 的血壓差，標準差 12，α = 0.05，檢定力 80%。</p>
<div class="w-row">${slider('weq-r', '同一人兩期測量的相關 ρ', 0, 0.95, 0.05, 0.5)}</div><div class="chart-wrap" id="weq-b"></div><div class="kv" id="weq-k2"></div>`;
    const up = () => {
      const d = sv('weq-d', v => F.n(v, 1)), n = sv('weq-n', String), D = sv('weq-m', v => F.n(v, 1)), r = sv('weq-r', v => v.toFixed(2)), se = Math.sqrt(2 * 0.8 * 0.2 / n) * 100;
      const c95 = [d - 1.96 * se, d + 1.96 * se], c90 = [d - 1.645 * se, d + 1.645 * se], lim = Math.max(16, D + 2);
      $('#weq-a').innerHTML = chart({ ycats: ['95% CI', '90% CI'], x: [-lim, lim], h: 150, m: { l: 64 }, xlab: '差異（百分點）' }, (X, Y, { M: Mg, ih }) => {
        const cl = v => X(Math.max(-lim, Math.min(lim, v))), bar = (c, i, k) => `<g data-k="${k}"><line x1="${cl(c[0])}" x2="${cl(c[1])}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c2);stroke-width:4"/><circle cx="${cl(d)}" cy="${Y(i)}" r="5" style="fill:var(--c2)"/></g>`;
        return `<rect data-k="mar" x="${X(-D)}" y="${Mg.t}" width="${X(D) - X(-D)}" height="${ih}" style="fill:var(--c1);fill-opacity:.15"/><line data-k="mar" x1="${X(-D)}" x2="${X(-D)}" y1="${Mg.t}" y2="${Mg.t + ih}" style="stroke:var(--c1);stroke-width:2"/><line data-k="mar" x1="${X(D)}" x2="${X(D)}" y1="${Mg.t}" y2="${Mg.t + ih}" style="stroke:var(--c1);stroke-width:2"/><line x1="${X(0)}" x2="${X(0)}" y1="${Mg.t}" y2="${Mg.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + bar(c95, 0, 'ci') + bar(c90, 1, 'ci90');
      });
      $('#weq-k').innerHTML = kvs([['差異的 95% CI', F.ci(c95[0], c95[1], 1), 'ci'], ['差異的 90% CI（等效性試驗用）', F.ci(c90[0], c90[1], 1), 'ci90'], ['不劣性界限 Δ', `±${F.n(D, 1)}`, 'mar']]);
      const z2 = (1.959964 + 0.841621) ** 2, s2 = 144, dd = 25, nPar = 2 * Math.ceil(2 * s2 * z2 / dd), nCx = Math.ceil(2 * s2 * (1 - r) * z2 / dd), top = nPar * 1.15;
      $('#weq-b').innerHTML = chart({ xcats: ['平行設計', '交叉設計'], y: [0, top], h: 200, ylab: '總人數' }, (X, Y, ctx) => { const bw = Math.min(80, ctx.iw * 0.25); return [[nPar, 'np', 'var(--c1)'], [nCx, 'nc', 'var(--c2)']].map(([v, k, c], i) => `<g data-k="${k}"><rect x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:${c}"/><text x="${X(i)}" y="${Y(v) - 5}" text-anchor="middle">${v}</text></g>`).join(''); });
      $('#weq-k2').innerHTML = kvs([['平行設計總人數', String(nPar), 'np'], ['交叉設計總人數', String(nCx), 'nc']]);
    };
    el.addEventListener('input', up); up();
  },
  pcaw(el) {
    const r0 = rngOf(1301), N0 = normOf(r0), base = Array.from({ length: 150 }, () => [N0(), N0()]);
    const r1 = rngOf(1302), N1 = normOf(r1), G = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'], prof = [[2, 2, 0, 0, 0, 0], [0, 0, 2.2, 2, 0, 0], [0, 0, 0, 0, 2, 2.4]];
    const DATA = { grp: [], none: [] }, truth = []; prof.forEach((pf, c) => { for (let i = 0; i < 30; i++) { const s = N1(0, 0.6); DATA.grp.push(pf.map(m => m + s + N1(0, 0.8))); truth.push(c); } });
    for (let i = 0; i < 90; i++) { const s = N1(); DATA.none.push(G.map(() => s * 0.8 + N1())); }
    el.innerHTML = `<h4>兩個變數的 PCA</h4><div class="w-row">${slider('wpc-r', '兩個變數的相關係數', -0.95, 0.95, 0.05, 0.6)}</div>
<figure class="fig"><figcaption>z 分數；紅線＝PC1 方向，藍線＝PC2 方向（長度∝標準差）</figcaption><div class="chart-wrap" id="wpc-a"></div></figure><div class="kv" id="wpc-k1"></div>
<h4>6 個基因、90 個樣本：PCA ＋ k-means</h4>
<div class="seg wrap" id="wpc-d"><button type="button" data-d="grp" aria-selected="true">資料有 3 種細胞型</button><button type="button" data-d="none" aria-selected="false">沒有群結構</button></div>
<div class="w-row">${slider('wpc-k', '群數 k', 1, 4, 1, 3)}</div>
<div class="w-cols"><figure class="fig"><figcaption>PC1 對 PC2，顏色＝k-means 分出的群；×＝群中心</figcaption><div class="chart-wrap" id="wpc-b"></div></figure><figure class="fig"><figcaption>陡坡圖：各主成分解釋的變異比例</figcaption><div class="chart-wrap" id="wpc-c"></div><figcaption>群內平方和對 k</figcaption><div class="chart-wrap" id="wpc-e"></div></figure></div><div class="kv" id="wpc-k2"></div>`;
    let ds = 'grp';
    const up = () => {
      const rho = sv('wpc-r', v => v.toFixed(2)), k = +sv('wpc-k', String), b = Math.sqrt(1 - rho * rho), P2 = base.map(([u, v]) => [u, rho * u + b * v]), A = S.pca(P2);
      $('#wpc-a').innerHTML = chart({ x: [-3.5, 3.5], y: [-3.5, 3.5], h: 260, xlab: '變數 1（z 分數）', ylab: '變數 2（z 分數）' }, (X, Y) => {
        const ax = (i, k2, c) => { const v = A.loadings[i], L = 2 * Math.sqrt(A.values[i]); return `<line data-k="${k2}" x1="${X(-L * v[0])}" y1="${Y(-L * v[1])}" x2="${X(L * v[0])}" y2="${Y(L * v[1])}" style="stroke:${c};stroke-width:3.5"/>`; };
        const Z = A.scores.map(s => [s[0] * A.loadings[0][0] + s[1] * A.loadings[1][0], s[0] * A.loadings[0][1] + s[1] * A.loadings[1][1]]);
        return Z.map(([x, y]) => `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="2.8" style="fill:var(--muted);fill-opacity:.6"/>`).join('') + ax(0, 'pc1', 'var(--c2)') + ax(1, 'pc2', 'var(--c1)');
      });
      $('#wpc-k1').innerHTML = kvs([['PC1 解釋的變異比例', `${F.n(100 * A.prop[0], 1)}%`, 'pc1'], ['PC2 解釋的變異比例', `${F.n(100 * A.prop[1], 1)}%`, 'pc2'], ['PC1 的載荷（變數 1, 變數 2）', A.loadings[0].map(x => F.n(x, 2)).join(', '), 'pc1']]);
      const B = S.pca(DATA[ds]), sc = B.scores.map(s => [s[0], s[1]]), km = S.kmeans(sc, k, 7), ks = [1, 2, 3, 4, 5, 6].map(j => S.kmeans(sc, j, 7).wss), lim = Math.max(...sc.flat().map(Math.abs)) * 1.08;
      $('#wpc-b').innerHTML = chart({ x: [-lim, lim], y: [-lim, lim], h: 260, xlab: `PC1（${F.n(100 * B.prop[0], 1)}%）`, ylab: `PC2（${F.n(100 * B.prop[1], 1)}%）` }, (X, Y) =>
        sc.map(([x, y], i) => { const c = km.centers[km.cluster[i]]; return `<line class="hlx" data-k="wss" x1="${X(x)}" y1="${Y(y)}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:${col4(km.cluster[i])};stroke-width:1"/><circle data-k="cl" cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.6" style="fill:${col4(km.cluster[i])};fill-opacity:.75"/>`; }).join('') +
        km.centers.map(([x, y]) => `<path data-k="cl wss" d="M${X(x) - 6} ${Y(y) - 6}L${X(x) + 6} ${Y(y) + 6}M${X(x) - 6} ${Y(y) + 6}L${X(x) + 6} ${Y(y) - 6}" style="stroke:var(--ink);stroke-width:3"/>`).join(''));
      $('#wpc-c').innerHTML = chart({ xcats: G.map((_, i) => 'PC' + (i + 1)), y: [0, 100], h: 150, ylab: '%' }, (X, Y, ctx) => { const bw = ctx.iw / 6 * 0.6; return B.prop.map((p, i) => `<rect data-k="${i === 0 ? 'p1' : i === 1 ? 'p2' : ''}" x="${X(i) - bw / 2}" y="${Y(100 * p)}" width="${bw}" height="${Y(0) - Y(100 * p)}" style="fill:var(--c1)"/>`).join(''); });
      $('#wpc-e').innerHTML = chart({ x: [0.5, 6.5], y: [0, ks[0] * 1.1], h: 150, xlab: '群數 k', ylab: '群內平方和' }, (X, Y) => `<path class="keep" d="${ks.map((v, i) => `${i ? 'L' : 'M'}${X(i + 1)} ${Y(v)}`).join('')}" style="fill:none;stroke:var(--muted);stroke-width:1.5"/>` + ks.map((v, i) => `<circle data-k="${i + 1 === k ? 'wss' : ''}" cx="${X(i + 1)}" cy="${Y(v)}" r="${i + 1 === k ? 6 : 4}" style="fill:${i + 1 === k ? 'var(--c2)' : 'var(--muted)'}"/>`).join(''));
      $('#wpc-k2').innerHTML = kvs([['PC1 解釋的變異比例', `${F.n(100 * B.prop[0], 1)}%`, 'p1'], ['PC2 解釋的變異比例', `${F.n(100 * B.prop[1], 1)}%`, 'p2'], ['k-means 分出的群數 k', String(k), 'cl'], ['k-means 群內平方和', F.n(km.wss, 1), 'wss']]);
    };
    segBind(el, '#wpc-d', b2 => { ds = b2.dataset.d; up(); }); el.addEventListener('input', up); up();
  },
  likew(el) {
    el.innerHTML = `<p class="w-cap">n 隻小鼠中 x 隻出現腫瘤。曲線是每個 p 值的對數概似 ℓ(p)（減去最大值，頂點 = 0）。</p>
<div class="w-row">${slider('wlk-n', '小鼠數 n', 5, 200, 1, 10)}${slider('wlk-x', '出現腫瘤 x', 0, 10, 1, 3)}${slider('wlk-p', '虛無假設的 p₀', 0.02, 0.98, 0.01, 0.5)}</div>
<div class="chart-wrap" id="wlk-c"></div>${legend([['var(--ink)', '對數概似'], ['var(--c1)', 'Wald 的拋物線近似']])}<div class="kv" id="wlk-k"></div>`;
    const up = () => {
      const n = +sv('wlk-n', String), xs = $('#wlk-x'); xs.max = n; const x = +sv('wlk-x', String), p0 = sv('wlk-p', v => v.toFixed(2)), ph = x / n;
      const ll = p => (x ? x * Math.log(p) : 0) + (n - x ? (n - x) * Math.log(1 - p) : 0), lmax = ll(Math.min(1 - 1e-12, Math.max(1e-12, ph))), rel = p => ll(p) - lmax;
      const root = (a, b) => { for (let i = 0; i < 80; i++) { const m = (a + b) / 2; (rel(m) + 1.920729 > 0) === (rel(a) + 1.920729 > 0) ? (a = m) : (b = m); } return (a + b) / 2; };
      const lo = x === 0 ? 0 : root(1e-12, ph), hi = x === n ? 1 : root(ph, 1 - 1e-12), se = Math.sqrt(ph * (1 - ph) / n), G = -2 * rel(p0), pv = 1 - S.pchisq(G, 1), bot = -8;
      const ps = Array.from({ length: 300 }, (_, i) => 0.001 + 0.998 * i / 299), cl = v => Math.max(bot, v);
      $('#wlk-c').innerHTML = chart({ x: [0, 1], y: [bot, 0.6], h: 260, xlab: 'p', ylab: 'ℓ(p) − ℓ(MLE)' }, (X, Y) => {
        const curve = ps.map((p, i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(cl(rel(p))).toFixed(1)}`).join(''), wald = se > 0 ? ps.map((p, i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(cl(-((p - ph) ** 2) / (2 * se * se))).toFixed(1)}`).join('') : '';
        return `<path class="keep" d="${curve}" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>${wald ? `<path data-k="wald" d="${wald}" style="fill:none;stroke:var(--c1);stroke-width:1.5;stroke-dasharray:5 3"/>` : ''}
<line x1="${X(0)}" x2="${X(1)}" y1="${Y(-1.92)}" y2="${Y(-1.92)}" style="stroke:var(--muted);stroke-dasharray:4 3"/><g data-k="ci"><line x1="${X(lo)}" x2="${X(hi)}" y1="${Y(-1.92)}" y2="${Y(-1.92)}" style="stroke:var(--c2);stroke-width:4"/></g>
<g data-k="wald"><line x1="${X(Math.max(-0.05, ph - 1.96 * se))}" x2="${X(Math.min(1.05, ph + 1.96 * se))}" y1="${Y(-2.3)}" y2="${Y(-2.3)}" style="stroke:var(--c1);stroke-width:4"/></g>
<line data-k="mle" x1="${X(ph)}" x2="${X(ph)}" y1="${Y(bot)}" y2="${Y(0)}" style="stroke:var(--c2);stroke-width:2"/><g data-k="lr p"><line x1="${X(p0)}" x2="${X(p0)}" y1="${Y(cl(rel(p0)))}" y2="${Y(0)}" style="stroke:var(--c3);stroke-width:3"/><circle cx="${X(p0)}" cy="${Y(cl(rel(p0)))}" r="5" style="fill:var(--c3)"/></g>`;
      });
      $('#wlk-k').innerHTML = kvs([['最大概似估計 p̂', F.n(ph, 3), 'mle'], ['概似比統計量 G', F.n(G, 2), 'lr'], ['概似比檢定的 p 值', F.p(pv), 'p'], ['95% 概似信賴區間', F.ci(lo, hi, 3), 'ci'], ['95% Wald 信賴區間', F.ci(ph - 1.96 * se, ph + 1.96 * se, 3), 'wald']]);
    };
    el.addEventListener('input', up); up();
  },
  mixedw(el) {
    el.innerHTML = `<div id="wmx-p"></div><h4>部分匯集：14 間醫院的平均收縮壓</h4><p class="w-cap">每間醫院的病人數不同（點的大小）。左邊是各醫院自己的平均，右邊是隨機截距模型的估計。</p><div class="w-row">${slider('wmx-t', '醫院之間的真實差異 τ', 0, 12, 0.5, 5)}</div><div class="chart-wrap" id="wmx-c"></div><div class="kv" id="wmx-k"></div>`;
    W.pseudo($('#wmx-p', el));
    const r = rngOf(1606), N = normOf(r), ns = [3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 35, 50, 70, 100], z = ns.map(() => N()), eps = ns.map(n => Array.from({ length: n }, () => N())), sig = 15, box = $('#wmx-c').parentNode;
    const up = () => {
      const tau = sv('wmx-t', v => F.n(v, 1)), G = ns.map((n, j) => eps[j].map(e => 135 + tau * z[j] + sig * e)), A = S.anova(G), N0 = S.sum(ns), n0 = (N0 - S.sum(ns.map(n => n * n)) / N0) / (ns.length - 1);
      const s2 = A.msw, t2 = Math.max(0, (A.msb - A.msw) / n0), raw = G.map(S.mean), wj = ns.map(n => 1 / (t2 + s2 / n)), mu = S.sum(raw.map((m, j) => m * wj[j])) / S.sum(wj), lam = ns.map(n => (t2 + s2 / n) > 0 ? t2 / (t2 + s2 / n) : 0), bl = raw.map((m, j) => mu + lam[j] * (m - mu)), [lo, hi] = S.minmax(raw);
      $('#wmx-c').innerHTML = chart({ xcats: ['各醫院自己的平均', '混合模型估計'], y: [Math.min(lo, mu - 2) - 3, Math.max(hi, mu + 2) + 3], h: 280, ylab: '收縮壓' }, (X, Y, { iw }) =>
        `<rect class="hlx" data-k="tau" x="${X(0) - iw / 4}" y="${Y(mu + Math.sqrt(t2))}" width="${X(1) - X(0) + iw / 2}" height="${Y(mu - Math.sqrt(t2)) - Y(mu + Math.sqrt(t2))}" style="fill:var(--c1);fill-opacity:.15"/><line data-k="mu" x1="${X(0) - iw / 4}" x2="${X(1) + iw / 4}" y1="${Y(mu)}" y2="${Y(mu)}" style="stroke:var(--ink);stroke-dasharray:5 4;stroke-width:1.5"/>` +
        ns.map((n, j) => `<g data-k="${j === 0 ? 'small' : j === ns.length - 1 ? 'big' : ''}"><line x1="${X(0)}" x2="${X(1)}" y1="${Y(raw[j])}" y2="${Y(bl[j])}" style="stroke:var(--muted);stroke-width:1.2"/><circle cx="${X(0)}" cy="${Y(raw[j])}" r="${2.5 + Math.sqrt(n) * 0.8}" style="fill:var(--c1);fill-opacity:.6"/><circle cx="${X(1)}" cy="${Y(bl[j])}" r="${2.5 + Math.sqrt(n) * 0.8}" style="fill:var(--c2);fill-opacity:.6"/></g>`).join(''));
      $('#wmx-k').innerHTML = kvs([['整體平均 μ', F.n(mu, 1), 'mu'], ['估計的醫院間標準差 τ', F.n(Math.sqrt(t2), 2), 'tau'], ['ICC', F.n(t2 / (t2 + s2), 3), 'tau'], ['縮減：最小醫院（3 人）自身平均的權重', F.n(lam[0], 2), 'small'], ['縮減：最大醫院（100 人）自身平均的權重', F.n(lam[ns.length - 1], 2), 'big']]);
    };
    box.addEventListener('input', up); up();
  },
  bayesw(el) {
    const PR = { flat: [1, 1, '平坦 Beta(1, 1)'], skep: [6, 14, '懷疑 Beta(6, 14)：約 30%'], opt: [12, 8, '樂觀 Beta(12, 8)：約 60%'] };
    el.innerHTML = `<p class="w-cap">新藥試驗：n 人中 x 人有反應。標準療法的反應率是 30%（灰色虛線）。</p>
<div class="seg wrap" id="wby-p">${Object.entries(PR).map(([k, v], i) => `<button type="button" data-p="${k}" aria-selected="${!i}">${v[2]}</button>`).join('')}</div>
<div class="w-row">${slider('wby-n', '人數 n', 1, 200, 1, 10)}${slider('wby-x', '有反應 x', 0, 10, 1, 6)}</div>
<div class="chart-wrap" id="wby-c"></div>${legend([['var(--c1)', '事前分佈'], ['var(--muted)', '概似（縮放到同高度）'], ['var(--c2)', '後驗分佈']])}<div class="kv" id="wby-k"></div>`;
    let pk = 'flat';
    const lb = (a, b) => S.lgamma(a) + S.lgamma(b) - S.lgamma(a + b), dbeta = (p, a, b) => Math.exp((a - 1) * Math.log(p) + (b - 1) * Math.log(1 - p) - lb(a, b));
    const up = () => {
      const n = +sv('wby-n', String), xs = $('#wby-x'); xs.max = n; const x = +sv('wby-x', String), [a, b] = PR[pk], A = a + x, B = b + n - x;
      const ps = Array.from({ length: 300 }, (_, i) => 0.0015 + 0.997 * i / 299), pri = ps.map(p => dbeta(p, a, b)), post = ps.map(p => dbeta(p, A, B)), lik = ps.map(p => dbeta(p, x + 1, n - x + 1)), top = Math.max(...post, ...pri) * 1.1, lsc = Math.max(...post) / Math.max(...lik);
      const lo = S.qbeta(0.025, A, B), hi = S.qbeta(0.975, A, B), pm = A / (A + B), pg = 1 - S.ibeta(0.3, A, B);
      $('#wby-c').innerHTML = chart({ x: [0, 1], y: [0, top], noY: true, h: 250, xlab: '反應率' }, (X, Y) => {
        const path = (v, s = 1) => ps.map((p, i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(Math.min(top, v[i] * s)).toFixed(1)}`).join('');
        const area = (f, t) => { const q = ps.filter(p => p >= f && p <= t); return q.length ? `M${X(q[0])} ${Y(0)}` + q.map(p => `L${X(p).toFixed(1)} ${Y(Math.min(top, dbeta(p, A, B))).toFixed(1)}`).join('') + `L${X(q[q.length - 1])} ${Y(0)}Z` : 'M0 0'; };
        return `<path class="hlx" data-k="pg" d="${area(0.3, 1)}" style="fill:var(--c2);fill-opacity:.25"/><path data-k="cri" d="${area(lo, hi)}" style="fill:var(--c2);fill-opacity:.18"/><line x1="${X(0.3)}" x2="${X(0.3)}" y1="${Y(0)}" y2="${Y(top)}" style="stroke:var(--muted);stroke-dasharray:4 3"/>
<path data-k="pri" d="${path(pri)}" style="fill:none;stroke:var(--c1);stroke-width:2;stroke-dasharray:6 4"/><path class="keep" d="${path(lik, lsc)}" style="fill:none;stroke:var(--muted);stroke-width:1.5"/><path data-k="post" d="${path(post)}" style="fill:none;stroke:var(--c2);stroke-width:2.5"/><line data-k="pm" x1="${X(pm)}" x2="${X(pm)}" y1="${Y(0)}" y2="${Y(dbeta(pm, A, B))}" style="stroke:var(--c2);stroke-width:2"/>`;
      });
      $('#wby-k').innerHTML = kvs([['事前分佈', `Beta(${a}, ${b})`, 'pri'], ['後驗分佈', `Beta(${A}, ${B})`, 'post'], ['後驗平均', F.n(pm, 3), 'pm'], ['95% 可信區間', F.ci(lo, hi, 3), 'cri'], ['後驗機率 P(反應率 > 30%)', F.n(pg, 3), 'pg']]);
    };
    segBind(el, '#wby-p', b2 => { pk = b2.dataset.p; up(); }); el.addEventListener('input', up); up();
  },
  mosaic(el) {
    const d = STUDY(), I = [...Array(d.n).keys()], AV = { smoker: ['吸菸', '不吸菸', i => d.smoker[i] === 1], diabetes: ['糖尿病', '沒有糖尿病', i => d.diabetes[i] === 1], male: ['男性', '女性', i => d.sex[i] === 'M'] }, BV = { cvd: ['心血管事件', i => d.cvd_event[i] === 1], lvh: ['左心室肥大', i => d.lvh_echo[i] === 1], dm: ['糖尿病', i => d.diabetes[i] === 1] };
    el.innerHTML = SRC_NOTE + MODE_SEG('wm2-m') + `<div class="w-row" id="wm2-dr"><label class="fld"><span>事件 A（左右分欄）</span><select id="wm2-av">${Object.entries(AV).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label><label class="fld"><span>事件 B（紅色）</span><select id="wm2-bv">${Object.entries(BV).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select></label></div>
<div class="w-row" id="wm2-or" hidden>${slider('wm2-a', 'P(A)', 5, 95, 5, 30, '%')}${slider('wm2-ba', 'P(B | A)', 0, 100, 5, 30, '%')}${slider('wm2-bn', 'P(B | 非 A)', 0, 100, 5, 15, '%')}</div>
<p class="w-cap" id="wm2-cap"></p><div class="chart-wrap" id="wm2-c"></div><div class="kv" id="wm2-k"></div>`;
    let mode = 'data';
    const up = () => {
      $('#wm2-dr').hidden = mode !== 'data'; $('#wm2-or').hidden = mode === 'data';
      let a, ba, bn, LA, LN, LB;
      if (mode === 'data') { const [la, ln, fa] = AV[$('#wm2-av').value], [lb, fb] = BV[$('#wm2-bv').value], A = I.filter(fa), N = I.filter(i => !fa(i)); a = A.length / d.n; ba = A.filter(fb).length / A.length; bn = N.filter(fb).length / N.length; LA = la; LN = ln; LB = lb; }
      else { a = sv('wm2-a', v => v + '%') / 100; ba = sv('wm2-ba', v => v + '%') / 100; bn = sv('wm2-bn', v => v + '%') / 100; LA = 'A'; LN = '非 A'; LB = 'B'; }
      const ab = a * ba, b = ab + (1 - a) * bn, aob = a + b - ab;
      $('#wm2-cap').textContent = `正方形代表${mode === 'data' ? ' 400 位病人' : '全部的人'}（面積 = 1）。左右寬度是「${LA}」與「${LN}」的比例；每一欄內，紅色的高度是該群中「${LB}」的比例。`;
      $('#wm2-c').innerHTML = chart({ x: [0, 1], y: [0, 1], h: 300, noY: true, xlab: `左：${LA}　｜　右：${LN}`, m: { t: 20 } }, (X, Y) => {
        const rect = (x0, x1, y0, y1, fill, k, op = 1) => `<rect data-k="${k}" x="${X(x0)}" y="${Y(y1)}" width="${X(x1) - X(x0)}" height="${Y(y0) - Y(y1)}" style="fill:${fill};fill-opacity:${op};stroke:var(--surface);stroke-width:2"/>`;
        return rect(0, a, 0, ba, 'var(--c2)', 'pa pab pb pbga paob') + rect(0, a, ba, 1, 'var(--c1)', 'pa paob', 0.35) + rect(a, 1, 0, bn, 'var(--c2)', 'pb pbgn paob', 0.75) + rect(a, 1, bn, 1, 'var(--muted)', 'pn', 0.25)
          + `<g class="hlx" data-k="ind"><line x1="${X(0)}" x2="${X(1)}" y1="${Y(b)}" y2="${Y(b)}" style="stroke:var(--ink);stroke-width:2.5;stroke-dasharray:6 4"/><text x="${X(1) - 4}" y="${Y(b) - 6}" text-anchor="end" style="fill:var(--ink)">獨立時兩欄的紅色應一樣高</text></g>`;
      });
      const pc = v => F.n(100 * v, 1) + '%';
      $('#wm2-k').innerHTML = kvs([[`P(${LA})`, pc(a), 'pa'], [`P(${LB})`, pc(b), 'pb'], [`P(${LA} 且 ${LB})`, pc(ab), 'pab'], [`P(${LA} 或 ${LB})`, pc(aob), 'paob'], [`P(${LB} | ${LA})`, pc(ba), 'pbga'], [`P(${LB} | ${LN})`, pc(bn), 'pbgn'], [`若獨立：P(${LA}) × P(${LB})`, pc(a * b), 'ind']]);
    };
    segBind(el, '#wm2-m', bt => { mode = bt.dataset.m; up(); }); el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
});

const WMAP = { 'bayes': ['bayesw', '事前分佈、概似與後驗分佈'], 'likelihood': ['likew', '對數概似曲線'], 'pca': ['pcaw', '主成分方向與 k-means 分群'], 'equiv': ['equivw', '信賴區間與界限 Δ；交叉設計的人數'], 'meta': ['metaw', '森林圖與漏斗圖'], 'missing': ['missingw', '缺失機制與處理方法'], 'ph-check': ['phw', '危險比隨時間改變'], 'standardize': ['stdw', '標準化與歸因分率'], 'mh': ['mhw', '辛普森悖論'], 'bland-altman': ['blandw', '兩台血糖儀'], 'poisson-reg': ['ratew', '發生率與率比'], 'reg-diag': ['regdiagw', '看殘差圖找問題'], 'simple-reg': ['simpleregw', '信賴帶與預測帶'], 'graphs': ['graphsw', '同一份資料，四種圖'], 'kappa': ['kappaw', '兩位病理師的一致性'], 'mcnemar': ['mcnemarw', '只看不一致的人'], 'two-prop': ['twopropw', '兩組反應率'], 'nonpar': ['nonparw', '用名次比較'], 'two-assume': ['twoassume', '轉換與極端值'], 'boot': ['bootw', '重抽 2000 次'], 'gof': ['gofw', '孟德爾的豌豆'], 'binom-test': ['binomtestw', '二項檢定'], 'one-t': ['onetw', '單一樣本 t 檢定'], 'prop-ci': ['propciw', '三種比例信賴區間'], 'tdist': ['tdistw', 't 分佈與常態分佈'], 'poisson': ['poissonw', 'Poisson 分佈與培養皿'], 'binom': ['binomw', '二項分佈'], 'rv': ['rvw', '自己設計一個機率分佈'], 'roc': ['rocw', '閾值與 ROC 曲線'], 'prob-rules': ['mosaic', '馬賽克圖'], 'ancova': ['ancovaw', '校正起始體重'], 'random-eff': ['iccw', 'ICC 與有效樣本數'], 'repeated': ['rmw', '同一個體測多次'], 'block': ['blockw', '考慮區集與否'], 'twoway': ['twowayw', '交互作用圖'], 'posthoc': ['posthoc', '事後比較與字母標記'], 'exp-design': ['expdesign', '400 次小鼠實驗'], 'anova-assume': ['anovaassume', '前提不成立會怎樣'], 'c0-1': ['rate', '100 人中有幾人'], 'c0-2': ['sigma', '動手算 Σ'], 'c0-3': ['log', '倍數與對數尺度'], 'c1-1': ['types', '變數分類挑戰'], 'c1-3': ['spread', '同樣的平均，不同的分散'], 'c1-5': ['table1w', '動手排一份 Table 1'], 'c3-1': ['tvis', '訊號與雜訊'], 'c3-2': ['anovavis', '組間 vs 組內變異'], 'c3-3': ['twobytwo', '自己填 2×2 表'], 'c3-4': ['corrvis', '相關係數的陷阱'], 'c3-5': ['chooser', '選擇統計方法'], 'c4-1': ['confound', '校正干擾因子'], 'c4-2': ['logit', '用 S 形曲線擬合資料'], 'c4-3': ['kmbuild', '自己畫存活曲線'], 'c4-4': ['mtest', '大量檢定的陷阱'], 'c4-6': ['mixedw', '偽重複與部分匯集'], 'c5-1': ['dag', '因果圖與干擾'], 'c5-2': ['phack', 'p-hacking 模擬器'], 'c5-3': ['figgood', '同一份資料，四種圖'], 'c5-4': ['checklist', '投稿前檢查表'], 'c5-5': ['tracks', '你的下一步路線圖'] };
for (const [id, [w, t]] of Object.entries(WMAP)) { const c = CH.find(x => x.id === id); c.widget = w; c.wtitle = t; }
