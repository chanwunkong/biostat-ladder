/* ---------- 每章的互動圖 ---------- */
const sv = (id, fmt) => { const v = +$('#' + id).value, o = $('#' + id + '-o'); if (o) o.textContent = fmt ? fmt(v) : v; return v; };
const kvs = items => items.map(([l, v, k]) => (k ? cardHTML({ k, l, v }) : `<div><span>${l}</span><b>${v}</b></div>`)).join('');
const std = a => { const m = S.mean(a), s = S.sd(a); return a.map(v => (v - m) / s); };
const tpdf = (x, df) => Math.exp(S.lgamma((df + 1) / 2) - S.lgamma(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + x * x / df, -(df + 1) / 2);
const segBind = (el, sel, fn) => $$(sel + ' button', el).forEach(b => { b.onclick = () => { $$(sel + ' button', el).forEach(x => x.setAttribute('aria-selected', x === b)); fn(b); }; });
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
    el.innerHTML = `<div class="w-row">${slider('wr-a', '對照組事件率', 1, 40, 1, 20, '%')}${slider('wr-b', '治療組事件率', 1, 40, 1, 10, '%')}</div><div class="pp2"><figure><figcaption>對照組 100 人</figcaption><div id="wr-ga"></div></figure><figure><figcaption>治療組 100 人</figcaption><div id="wr-gb"></div></figure></div><div class="kv" id="wr-o"></div>`;
    const up = () => {
      const a = sv('wr-a', v => v + '%'), b = sv('wr-b', v => v + '%'), ard = a - b;
      $('#wr-ga').innerHTML = people(100, a, 'var(--c2)', i => (i < Math.min(a, b) ? 'rr rrr' : i < a ? 'ard nnt rr rrr' : '')); $('#wr-gb').innerHTML = people(100, b, 'var(--c1)', i => (i < b ? 'rr rrr' : ''));
      $('#wr-o').innerHTML = kvs([['絕對差', `${ard === 0 ? '' : ard > 0 ? '減少 ' : '增加 '}${Math.abs(ard)} 個百分點`, 'ard'], ['相對變化', `${ard > 0 ? '減少' : ard < 0 ? '增加' : ''} ${F.n(Math.abs(100 * ard / a), 0)}%`, 'rrr'], ['風險比 RR', F.n(b / a, 2), 'rr'], ['需治療人數 NNT', ard > 0 ? Math.ceil(100 / ard) + ' 人' : '—', 'nnt']]);
    };
    el.addEventListener('input', up); up();
  },
  sigma(el) {
    const init = [3, 5, 10, 6, 8];
    el.innerHTML = `<p class="w-cap">拖動五個數值。長條是 x<sub>i</sub>，紅色虛線是平均 x̄，旁邊的短線是離均差 x<sub>i</sub> − x̄。</p><div class="w-grid5">${init.map((v, i) => slider('ws-' + i, `x${i + 1}`, 0, 20, 1, v)).join('')}</div><div class="chart-wrap" id="ws-c"></div><p class="formula" id="ws-f"></p><div class="kv" id="ws-o"></div>`;
    const up = () => {
      const x = init.map((_, i) => sv('ws-' + i)), sum = S.sum(x), m = sum / 5, dev = x.map(v => v - m), ss = S.sum(dev.map(d => d * d));
      $('#ws-c').innerHTML = chart({ xcats: x.map((_, i) => `x${i + 1}`), y: [0, 20], h: 240, ylab: '數值' }, (X, Y, { M, iw }) => {
        const bw = iw / 5 * 0.38; let g = '';
        x.forEach((v, i) => { const cc = v >= m ? 'var(--c3)' : 'var(--c2)', xx = X(i) + bw / 2 + 6; g += `<rect data-k="sum" x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:var(--c1);fill-opacity:.8"/><line data-k="ss sd" x1="${xx}" x2="${xx}" y1="${Y(m)}" y2="${Y(v)}" style="stroke:${cc};stroke-width:3"/><text x="${xx + 4}" y="${(Y(m) + Y(v)) / 2}" dy=".32em" style="fill:${cc}">${dev[i] >= 0 ? '+' : ''}${F.n(dev[i], 1)}</text>`; });
        return g + `<line data-k="mean ss sd" x1="${M.l}" x2="${M.l + iw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--c2);stroke-width:2;stroke-dasharray:6 4"/><text x="${M.l + iw}" y="${Y(m) - 6}" text-anchor="end" style="fill:var(--c2)">x̄ = ${F.n(m, 1)}</text>`;
      });
      $('#ws-f').innerHTML = `Σx<sub>i</sub> = ${x.join(' + ')} = <b>${sum}</b><br>x̄ = ${sum} ÷ 5 = <b>${F.n(m, 1)}</b><br>Σ(x<sub>i</sub> − x̄) = ${dev.map(d => F.n(d, 1)).join(' + ').replace(/\+ -/g, '− ')} = <b>0</b>`;
      $('#ws-o').innerHTML = kvs([['Σx', sum, 'sum'], ['x̄', F.n(m, 2), 'mean'], ['Σ(x − x̄)²', F.n(ss, 1), 'ss'], ['標準差 s', F.n(Math.sqrt(ss / 4), 2), 'sd']]);
    };
    el.addEventListener('input', up); up();
  },
  log(el) {
    el.innerHTML = `<div class="w-row"><label class="fld"><span>處理組表現量</span><input id="wl-a" type="number" inputmode="decimal" value="50" step="any"></label><label class="fld"><span>對照組表現量</span><input id="wl-b" type="number" inputmode="decimal" value="200" step="any"></label></div><p class="w-out" id="wl-f"></p>
<figure class="fig"><figcaption>同一組倍數變化放在一般尺度：下降的點全擠在 0 和 1 之間</figcaption><div class="chart-wrap" id="wl-lin"></div></figure><figure class="fig"><figcaption>放在 log₂ 尺度：上升與下降對稱。橘色是你輸入的倍數</figcaption><div class="chart-wrap" id="wl-lg"></div></figure>`;
    const fc = [1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8], lb = ['1/8', '1/4', '1/2', '1', '2', '4', '8'], cc = v => (v < 1 ? 'var(--c1)' : v > 1 ? 'var(--c2)' : 'var(--ink)');
    const up = () => {
      const a = +$('#wl-a').value, b = +$('#wl-b').value, ok = a > 0 && b > 0, u = ok ? a / b : NaN;
      $('#wl-f').innerHTML = ok ? `倍數變化 FC = ${F.n(u, 3)}　　log<sub>2</sub>FC = <b>${F.n(Math.log2(u), 2)}</b>　（${a === b ? '沒有變化' : `${a > b ? '上升' : '下降'}了 ${F.n(Math.abs(Math.log2(u)), 2)} 次「倍增」`}）` : '請輸入兩個正數。';
      const mk = (X, Y, f, lbf) => fc.map((v, i) => `<circle cx="${X(f(v))}" cy="${Y(0.4)}" r="6" style="fill:${cc(v)}"/><text x="${X(f(v))}" y="${Y(0.4) - 12}" text-anchor="middle" style="fill:${cc(v)}">${lb[i]}</text>`).join('') + (ok && f(u) >= lbf[0] && f(u) <= lbf[1] ? `<path d="M${X(f(u))} ${Y(0.4) + 10}l-6 10h12z" style="fill:var(--c4)"/>` : '');
      $('#wl-lin').innerHTML = chart({ x: [0, 8], y: [0, 1], noY: true, h: 110, xlab: '倍數（一般尺度）' }, (X, Y) => mk(X, Y, v => v, [0, 8]));
      $('#wl-lg').innerHTML = chart({ x: [-3, 3], y: [0, 1], noY: true, h: 110, xlab: 'log₂ 倍數' }, (X, Y) => mk(X, Y, Math.log2, [-3, 3]));
    };
    el.addEventListener('input', up); up();
  },
  types(el) {
    const items = [['血型', 'A、B、O、AB', '名目'], ['收縮壓', '128、141、117 mmHg', '連續'], ['癌症分期', 'I、II、III、IV', '順序'], ['一年內住院次數', '0、1、3、0', '計數'], ['處理組別', '藥物、安慰劑', '名目'], ['疼痛程度', '無、輕、中、重', '順序'], ['基因表現量', '5.21、7.84（log2）', '連續'], ['診斷到死亡的月數', '14、32+、8、60+', '時間至事件'], ['菌落數', '23、118、0', '計數'], ['體重', '62.5、80.1 kg', '連續']];
    const cats = ['名目', '順序', '連續', '計數', '時間至事件'], why = { 名目: '類別之間沒有順序。', 順序: '類別有高低順序，但間距不一定相等。', 連續: '可以是任何數值（含小數），有單位。', 計數: '只能是 0、1、2… 的整數次數。', 時間至事件: '追蹤到事件發生的時間；「+」代表還沒發生就結束追蹤（設限）。' };
    let k = 0; const res = [];
    const draw = () => {
      const it = items[k];
      el.innerHTML = `<div class="dots" aria-hidden="true">${items.map((_, i) => `<i class="${res[i] === true ? 'ok' : res[i] === false ? 'no' : i === k ? 'cur' : ''}"></i>`).join('')}</div>` + (it ? `<div class="vcard"><p class="lbl">第 ${k + 1} / ${items.length} 個變數</p><h4>${it[0]}</h4><div class="vals">${it[1].split('、').map(v => `<span>${v}</span>`).join('')}</div></div><p class="w-cap">這是哪一種變數？</p><div class="choice">${cats.map(c => `<button type="button" class="opt" data-c="${c}">${c}</button>`).join('')}</div><div class="why" id="wt-why" hidden></div>` : `<div class="vcard"><h4>答對 ${res.filter(Boolean).length} / ${items.length}</h4><p>${res.every(Boolean) ? '全部答對。' : '錯的題目再挑戰一次吧。'}</p><button class="btn" type="button" id="wt-re">重來一次</button></div>`);
      $$('[data-c]', el).forEach(b => { b.onclick = () => { if (res[k] !== undefined) return; const ok = b.dataset.c === it[2]; res[k] = ok; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) $(`[data-c="${it[2]}"]`, el).classList.add('right'); const w = $('#wt-why', el); w.hidden = false; w.innerHTML = `<p><b>${ok ? '答對了。' : '正確答案：' + it[2] + '。'}</b>${why[it[2]]}</p><button type="button" class="btn pri" id="wt-next">下一個 →</button>`; $('#wt-next', el).onclick = () => { k++; draw(); }; }; });
      const re = $('#wt-re', el); if (re) re.onclick = () => { k = 0; res.length = 0; draw(); };
    };
    el._demo = d => { k = d.k; delete res[k]; draw(); };
    draw();
  },
  spread(el) {
    const r = rngOf(3), N = normOf(r), z = std(Array.from({ length: 30 }, () => N()));
    el.innerHTML = `<div class="w-row">${slider('wv-s', '乙組標準差', 1, 25, 1, 12)}<label class="tog"><input type="checkbox" id="wv-o"> 乙組加入一個極端值</label></div><div class="chart-wrap" id="wv-c"></div><p class="w-cap">紅線 = 平均；深色帶 = 平均 ± 1 SD；淺色帶 = ± 2 SD；方框 = 中間 50%（IQR）。</p><div class="kv" id="wv-k"></div>`;
    const up = () => {
      const s = sv('wv-s'), A = z.map(v => 120 + 4 * v), B = z.map(v => 120 + s * v); if ($('#wv-o').checked) B.push(200);
      const rows = [['甲組', A], ['乙組', B]], cl = a => Math.max(40, Math.min(205, a));
      $('#wv-c').innerHTML = chart({ ycats: rows.map(r => r[0]), x: [40, 205], h: 220, xlab: '收縮壓 (mmHg)', m: { l: 48 }, xgrid: true }, (X, Y, { ih }) => rows.map(([, v], i) => {
        const y = Y(i), hh = ih / 2 * 0.72, m = S.mean(v), sd = S.sd(v), q1 = S.quantile(v, 0.25), q3 = S.quantile(v, 0.75);
        const t = i ? 'B' : 'A'; return `<rect data-k="sd${t}" x="${X(cl(m - 2 * sd))}" y="${y - hh / 2}" width="${X(cl(m + 2 * sd)) - X(cl(m - 2 * sd))}" height="${hh}" style="fill:var(--c1);fill-opacity:.08"/><rect data-k="sd${t}" x="${X(cl(m - sd))}" y="${y - hh / 2}" width="${X(cl(m + sd)) - X(cl(m - sd))}" height="${hh}" style="fill:var(--c1);fill-opacity:.17"/><rect data-k="iqr${t}" x="${X(q1)}" y="${y - hh / 4}" width="${X(q3) - X(q1)}" height="${hh / 2}" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>` + v.map((x, k) => `<circle cx="${X(cl(x))}" cy="${y + (((k * 0.618) % 1) - 0.5) * hh * 0.8}" r="3.2" style="fill:${x === 200 ? 'var(--c2)' : 'var(--c1)'}"/>`).join('') + `<line x1="${X(m)}" x2="${X(m)}" y1="${y - hh / 2}" y2="${y + hh / 2}" style="stroke:var(--c2);stroke-width:2.5"/>`;
      }).join(''));
      $('#wv-k').innerHTML = kvs([['甲組 SD', F.n(S.sd(A), 1), 'sdA'], ['乙組 SD', F.n(S.sd(B), 1), 'sdB'], ['甲組 IQR', F.n(S.quantile(A, 0.75) - S.quantile(A, 0.25), 1), 'iqrA'], ['乙組 IQR', F.n(S.quantile(B, 0.75) - S.quantile(B, 0.25), 1), 'iqrB']]);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  table1w(el) {
    el.innerHTML = `<p class="w-cap">資料：降血壓藥隨機試驗（120 人）。切換分組方式；點表格中的變數，下方會畫出它的分佈。</p><div class="seg wrap" id="wt1-g"><button type="button" data-g="" aria-selected="false">不分組</button><button type="button" data-g="group" aria-selected="true">依治療組別</button><button type="button" data-g="sex" aria-selected="false">依性別</button></div><label class="tog"><input type="checkbox" id="wt1-p" checked> 顯示 p 值欄</label><div id="wt1-t"></div>`;
    let g = 'group';
    const up = () => {
      const r = AN.table1.run(getDS('bp_trial'), { g, vars: ['age', 'sex', 'bmi', 'sbp_base', 'ae'] }), t = r.table1, show = $('#wt1-p').checked || !g, cut = a => (g && !show ? a.slice(0, -1) : a);
      $('#wt1-p').disabled = !g;
      $('#wt1-t').innerHTML = tableHTML({ head: cut(t.head), rows: t.rows.map(x => ({ ...x, cells: cut(x.cells) })), foot: show ? t.foot : '' }) + `<div class="picks">${r.picks.map(p => `<div class="pick" data-k="${p.k}">${figHTML(p)}</div>`).join('')}</div>`;
      if (!el._k) el._k = 'v0';
    };
    segBind(el, '#wt1-g', b => { g = b.dataset.g; up(); }); $('#wt1-p').onchange = up; up();
  },
  tvis(el) {
    el.innerHTML = `<div class="w-row">${slider('wtv-d', '兩組平均差 Δ', 0, 20, 1, 6)}${slider('wtv-s', '標準差 SD', 2, 30, 1, 12)}${slider('wtv-n', '每組人數 n', 3, 100, 1, 20)}</div><figure class="fig"><figcaption>兩組資料的分佈（藍 = 對照，紅 = 治療）</figcaption><div class="chart-wrap" id="wtv-a"></div></figure><figure class="fig"><figcaption>假如兩組其實沒差，t 值的分佈；紅色面積就是 p 值</figcaption><div class="chart-wrap" id="wtv-b"></div></figure><div class="kv" id="wtv-k"></div>`;
    const up = () => {
      const d = sv('wtv-d'), s = sv('wtv-s'), n = sv('wtv-n'), se = s * Math.sqrt(2 / n), t = d / se, df = 2 * n - 2, p = S.pt2(t, df);
      const lo = 100 - 3.5 * s, hi = 100 + d + 3.5 * s, pdf = (x, m) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)), pk = pdf(100, 100);
      const curve = (X, Y, m, c) => { let q = `M${X(lo)} ${Y(0)}`; for (let i = 0; i <= 120; i++) { const x = lo + (hi - lo) * i / 120; q += `L${X(x).toFixed(1)} ${Y(pdf(x, m)).toFixed(1)}`; } return `<path class="keep" d="${q}L${X(hi)} ${Y(0)}Z" style="fill:${c};fill-opacity:.18;stroke:${c};stroke-width:2"/><line data-k="diff d" x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(pk)}" style="stroke:${c};stroke-width:2;stroke-dasharray:4 3"/>`; };
      $('#wtv-a').innerHTML = chart({ x: [lo, hi], y: [0, pk * 1.25], noY: true, h: 180, xlab: '測量值' }, (X, Y) => curve(X, Y, 100, 'var(--c1)') + curve(X, Y, 100 + d, 'var(--c2)') + `<g class="hlx" data-k="diff d"><line x1="${X(100)}" x2="${X(100 + d)}" y1="${Y(pk * 1.12)}" y2="${Y(pk * 1.12)}" style="stroke:var(--c2);stroke-width:3"/></g><g class="hlx" data-k="d"><line x1="${X(100)}" x2="${X(100 + s)}" y1="${Y(pk * 0.6)}" y2="${Y(pk * 0.6)}" style="stroke:var(--c1);stroke-width:3"/><text x="${X(100 + s / 2)}" y="${Y(pk * 0.6) - 6}" text-anchor="middle" style="fill:var(--c1)">1 SD</text></g>` + [100, 100 + d].map((m, i) => `<g class="hlx" data-k="se"><line x1="${X(m - se)}" x2="${X(m + se)}" y1="${Y(pk * (1.04 - i * 0.08))}" y2="${Y(pk * (1.04 - i * 0.08))}" style="stroke:${i ? 'var(--c2)' : 'var(--c1)'};stroke-width:4"/></g>`).join(''));
      const R = Math.max(4.5, Math.abs(t) + 1), top = tpdf(0, df), at = Math.abs(t);
      $('#wtv-b').innerHTML = chart({ x: [-R, R], y: [0, top * 1.25], noY: true, h: 170, xlab: 't 值' }, (X, Y) => {
        const area = (a, b) => { let q = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 60; i++) { const x = a + (b - a) * i / 60; q += `L${X(x).toFixed(1)} ${Y(tpdf(x, df)).toFixed(1)}`; } return q + `L${X(b)} ${Y(0)}Z`; };
        let c = ''; for (let i = 0; i <= 160; i++) { const x = -R + 2 * R * i / 160; c += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(tpdf(x, df)).toFixed(1)}`; }
        return `<path data-k="p" d="${area(at, R)}" style="fill:var(--c2);fill-opacity:.5"/><path data-k="p" d="${area(-R, -at)}" style="fill:var(--c2);fill-opacity:.5"/><path class="keep" d="${c}" style="fill:none;stroke:var(--ink);stroke-width:1.8"/><line data-k="t" x1="${X(t)}" x2="${X(t)}" y1="${Y(0)}" y2="${Y(top * 1.08)}" style="stroke:var(--c2);stroke-width:2.5"/><text x="${X(t)}" y="${Y(top * 1.08) - 5}" text-anchor="middle" style="fill:var(--c2)">t = ${F.n(t, 2)}</text>`;
      });
      $('#wtv-k').innerHTML = kvs([['訊號：平均差', d, 'diff'], ['雜訊：標準誤', F.n(se, 2), 'se'], ['t = 訊號 ÷ 雜訊', F.n(t, 2), 't'], ['p 值', F.p(p), 'p'], ["Cohen's d", F.n(d / s, 2), 'd']]);
    };
    el.addEventListener('input', up); up();
  },
  anovavis(el) {
    const r = rngOf(11), N = normOf(r), z = [0, 1, 2].map(() => std(Array.from({ length: 8 }, () => N())));
    el.innerHTML = `<div class="w-row">${slider('wa-g', '組間差距', 0, 10, 0.5, 4)}${slider('wa-s', '組內標準差', 1, 10, 0.5, 3)}</div><div class="chart-wrap" id="wa-c"></div><p class="w-cap">粗橫線是各組平均，灰色虛線是全體平均。點數字卡，圖上會畫出每個平方和用到的距離。</p><div class="fbar" id="wa-f"></div><div class="kv" id="wa-k"></div>`;
    const up = () => {
      const gap = sv('wa-g'), s = sv('wa-s'), mu = [30, 30 + gap, 30 + gap / 2], v = z.map((zz, k) => zz.map(x => mu[k] + s * x)), A = S.anova(v), gm = S.mean(v.flat()), sst = A.ssb + A.ssw;
      $('#wa-c').innerHTML = chart({ xcats: ['肥料 A', '肥料 B', '肥料 C'], y: [0, 72], h: 280, ylab: '株高（公分）' }, (X, Y, { M, iw }) => {
        let g = `<line data-k="eta msb ssb sst" x1="${M.l}" x2="${M.l + iw}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>`;
        v.forEach((grp, k) => {
          const m = S.mean(grp), xs = grp.map((_, i) => X(k) - 34 + i * 68 / (grp.length - 1));
          grp.forEach((x, i) => { g += `<line class="hlx" data-k="sst" x1="${xs[i]}" x2="${xs[i]}" y1="${Y(x)}" y2="${Y(gm)}" style="stroke:var(--c4);stroke-width:2"/><line class="hlx" data-k="ssw msw" x1="${xs[i]}" x2="${xs[i]}" y1="${Y(x)}" y2="${Y(m)}" style="stroke:var(--c3);stroke-width:2"/>`; });
          g += grp.map((x, i) => `<circle data-k="ssw msw sst" cx="${xs[i]}" cy="${Y(x)}" r="3.8" style="fill:${col4(k)};fill-opacity:.75"/>`).join('');
          g += `<line data-k="eta msb ssb ssw msw" x1="${X(k) - 38}" x2="${X(k) + 38}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:${col4(k)};stroke-width:3.5"/><line class="hlx" data-k="msb ssb eta" x1="${X(k) + 42}" x2="${X(k) + 42}" y1="${Y(gm)}" y2="${Y(m)}" style="stroke:var(--c2);stroke-width:4"/>`;
        });
        return g;
      });
      const mx = Math.max(A.msb, A.msw) || 1;
      $('#wa-f').innerHTML = `<div data-card="msb" data-k="msb F" role="button" tabindex="0"><span>組間均方</span><i style="width:${100 * A.msb / mx}%;background:var(--c2)"></i><b>${F.n(A.msb, 1)}</b></div><div data-card="msw" data-k="msw F" role="button" tabindex="0"><span>組內均方</span><i style="width:${100 * A.msw / mx}%;background:var(--muted)"></i><b>${F.n(A.msw, 1)}</b></div>`;
      $('#wa-k').innerHTML = kvs([['總平方和', F.n(sst, 1), 'sst'], ['組間平方和', F.n(A.ssb, 1), 'ssb'], ['組內平方和', F.n(A.ssw, 1), 'ssw'], ['F = 組間均方 ÷ 組內均方', F.n(A.F, 2), 'F'], ['η²', F.n(A.eta2, 2), 'eta'], ['p 值', F.p(A.p)]]);
    };
    el.addEventListener('input', up); up();
  },
  twobytwo(el) {
    const v = { a: 25, b: 70, c: 45, d: 260 }, cell = k => `<span class="cellw" data-k="or chi fis"><input class="cell" id="w2-${k}" type="number" inputmode="numeric" min="0" value="${v[k]}" aria-label="格 ${k}"></span>`;
    el.innerHTML = `<p class="w-cap">直接修改格子裡的人數（例：吸菸與心血管事件）。</p><div class="tbl-wrap"><table class="st t22"><thead><tr><th></th><th>有事件</th><th>無事件</th></tr></thead><tbody><tr><td>吸菸</td><td>${cell('a')}</td><td>${cell('b')}</td></tr><tr><td>不吸菸</td><td>${cell('c')}</td><td>${cell('d')}</td></tr></tbody></table></div><div id="w2-bars"></div><div class="kv" id="w2-k"></div><p class="callout warn" id="w2-w" hidden></p><div class="w-row"><button class="btn" type="button" id="w2-small">試試小樣本</button><button class="btn ghost" type="button" id="w2-reset">還原</button></div>`;
    const set = o => { Object.assign(v, o); for (const k in v) $('#w2-' + k).value = v[k]; up(); };
    const up = () => {
      for (const k of ['a', 'b', 'c', 'd']) v[k] = Math.max(0, Math.round(+$('#w2-' + k).value || 0));
      const { a, b, c, d } = v; if (a + b === 0 || c + d === 0 || a + c === 0 || b + d === 0) { $('#w2-k').innerHTML = '<p class="w-out">每一列、每一欄至少要有 1 人。</p>'; return; }
      const r1 = a / (a + b), r0 = c / (c + d), t = S.chisq([[a, b], [c, d]]), fp = S.fisher(a, b, c, d);
      const bar = (l, r, col) => `<div class="rbar" data-k="rr"><span>${l}</span><div><i style="width:${100 * r}%;background:${col}"></i></div><b>${F.n(100 * r, 1)}%</b></div>`;
      $('#w2-bars').innerHTML = `<p class="w-cap">各組發生事件的比例（風險）</p>${bar('吸菸', r1, 'var(--c2)')}${bar('不吸菸', r0, 'var(--c1)')}`;
      $('#w2-k').innerHTML = kvs([['風險比 RR', F.n(r1 / r0, 2), 'rr'], ['勝算比 OR', F.n((a * d) / (b * c), 2), 'or'], ['卡方 p', F.p(t.p), 'chi'], ['Fisher p', F.p(fp), 'fis']]);
      const w = $('#w2-w'); w.hidden = !(t.minExp < 5); w.textContent = `最小期望值 ${F.n(t.minExp, 2)}，小於 5：卡方近似不可靠，請看 Fisher 精確檢定。`;
    };
    $('#w2-small', el).onclick = () => set({ a: 4, b: 3, c: 1, d: 8 }); $('#w2-reset', el).onclick = () => set({ a: 25, b: 70, c: 45, d: 260 });
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
      ['二元（有／無）', { q: '需要校正其他變數嗎？', o: [['不用，比較兩組比例', R('卡方檢定', '任一格期望值小於 5 時用 Fisher 精確檢定', 'chisq')], ['要校正', R('邏輯斯迴歸', '每個參數至少約 10 個事件', 'logreg')]] }],
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
    el.innerHTML = `<div class="dag" id="wdg-g"></div><div class="w-row">${slider('wdg-s', '吸菸者比不吸菸者更常喝咖啡', 0, 0.6, 0.05, 0.4)}${slider('wdg-t', '咖啡的真實效果（OR）', 0.5, 2, 0.1, 1)}</div><div class="seg wrap" id="wdg-m"><button type="button" data-m="0" aria-selected="true">不校正</button><button type="button" data-m="1" aria-selected="false">校正吸菸</button></div><div class="chart-wrap" id="wdg-c"></div><p class="w-cap" id="wdg-x"></p>`;
    let adj = 0;
    const up = () => {
      const sd = sv('wdg-s', v => '+' + Math.round(v * 100) + ' 個百分點'), tor = sv('wdg-t', v => v.toFixed(1)), r = rngOf(99), t = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]];
      for (let i = 0; i < 20000; i++) { const s = r() < 0.3 ? 1 : 0, c = r() < 0.3 + (s ? sd : 0) ? 1 : 0, base = 0.02 * (s ? 6 : 1), od = base / (1 - base) * (c ? tor : 1); t[s][c][r() < od / (1 + od) ? 1 : 0]++; }
      const A = t[0][1][1] + t[1][1][1], B = t[0][1][0] + t[1][1][0], C = t[0][0][1] + t[1][0][1], D = t[0][0][0] + t[1][0][0], crude = A * D / (B * C);
      let nu = 0, de = 0; for (const s of [0, 1]) { const [a, b, c, d] = [t[s][1][1], t[s][1][0], t[s][0][1], t[s][0][0]], n = a + b + c + d; nu += a * d / n; de += b * c / n; } const mh = nu / de;
      const node = (x, y, s, on) => `<rect x="${x - 46}" y="${y - 18}" width="92" height="36" rx="18" style="fill:${on ? 'var(--soft)' : 'var(--surface)'};stroke:${on ? 'var(--accent)' : 'var(--ink)'};stroke-width:${on ? 2.5 : 1.5}"/><text x="${x}" y="${y}" dy=".35em" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-family:var(--body)">${s}</text>`;
      const arr = (x1, y1, x2, y2, c, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#wdg-ah)" style="stroke:${c};stroke-width:2.2${dash ? ';stroke-dasharray:6 4' : ''}"/>`;
      $('#wdg-g').innerHTML = `<svg viewBox="0 0 320 170" class="dag-svg" role="img" aria-label="因果圖：吸菸影響喝咖啡與肺癌"><defs><marker id="wdg-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>${arr(140, 46, 82, 118, adj ? 'var(--line)' : 'var(--c2)')}${arr(180, 46, 238, 118, adj ? 'var(--line)' : 'var(--c2)')}${arr(108, 140, 210, 140, 'var(--c1)', Math.abs(tor - 1) < 1e-9)}${node(160, 30, adj ? '吸菸（已校正）' : '吸菸', adj)}${node(60, 140, '喝咖啡')}${node(260, 140, '肺癌')}</svg>`;
      const rows = [['未校正 OR', crude, 'var(--c2)'], ['校正吸菸後 OR', mh, 'var(--c1)'], ['真實 OR', tor, 'var(--ink)']];
      $('#wdg-c').innerHTML = chart({ ycats: rows.map(r => r[0]), xlog: true, x: [0.4, 4], h: 170, m: { l: 110 }, xlab: '勝算比（對數尺度）' }, (X, Y, { M, ih }) => `<line x1="${X(1)}" x2="${X(1)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + rows.map(([, e, c], i) => { const v = Math.max(0.4, Math.min(4, e)); return `<circle cx="${X(v)}" cy="${Y(i)}" r="${(adj ? i === 1 : i === 0) ? 9 : 6}" style="fill:${c}"/><text x="${X(v) + 13}" y="${Y(i)}" dy=".32em" style="fill:var(--ink)">${F.n(e, 2)}</text>`; }).join(''));
      $('#wdg-x').textContent = adj ? '在吸菸者與不吸菸者中各自比較再合併（Mantel–Haenszel 法），擋住了經過吸菸的後門路徑，估計回到真實值附近。' : '喝咖啡與肺癌之間，除了直接的箭頭，還有一條經過吸菸的「後門路徑」（紅色）。不校正時，吸菸的影響混進了咖啡的估計。';
    };
    segBind(el, '#wdg-m', b => { adj = +b.dataset.m; up(); }); el.addEventListener('input', up); up();
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
    const r = rngOf(8), N = normOf(r), xs = Array.from({ length: 12 }, (_, i) => i + 1), ys = xs.map(x => +(1.8 + 0.85 * x + N(0, 1.1)).toFixed(2)), fit = S.pearson(xs, ys);
    const best = S.sum(xs.map((x, i) => (ys[i] - fit.intercept - fit.slope * x) ** 2));
    el.innerHTML = `<p class="w-cap">情境：藥物劑量 x（mg）與血中濃度 y（μg/mL），12 位受試者。紅色線段是每個點的殘差。</p><div class="w-row">${slider('wn-a', '截距 a', -4, 8, 0.1, 0)}${slider('wn-b', '斜率 b', -0.5, 2, 0.05, 0.3)}</div><div class="chart-wrap" id="wn-c"></div><div class="kv" id="wn-k"></div><div class="w-row"><button class="btn" id="wn-best" type="button">換成最小平方直線</button></div>`;
    const up = () => {
      const a = sv('wn-a', v => v.toFixed(1)), b = sv('wn-b', v => v.toFixed(2)), ssr = S.sum(xs.map((x, i) => (ys[i] - a - b * x) ** 2)), cl = v => Math.max(-1, Math.min(15, v));
      $('#wn-c').innerHTML = chart({ x: [0, 13], y: [0, 14], xlab: '劑量 x', ylab: '濃度 y', h: 300 }, (X, Y) => xs.map((x, i) => `<line data-k="ssr" x1="${X(x)}" x2="${X(x)}" y1="${Y(ys[i])}" y2="${Y(cl(a + b * x))}" style="stroke:var(--c2);stroke-width:1.5;stroke-opacity:.8"/>`).join('')
        + `<line class="keep" data-k="a b" x1="${X(0)}" x2="${X(13)}" y1="${Y(cl(a))}" y2="${Y(cl(a + 13 * b))}" style="stroke:var(--c1);stroke-width:2.5"/>`
        + `<g class="hlx" data-k="a"><circle cx="${X(0)}" cy="${Y(cl(a))}" r="6" style="fill:var(--c1)"/><text x="${X(0) + 10}" y="${Y(cl(a)) - 8}" style="fill:var(--c1)">x = 0 時 y = ${a.toFixed(1)}</text></g>`
        + `<g class="hlx" data-k="b"><line x1="${X(6)}" x2="${X(7)}" y1="${Y(cl(a + 6 * b))}" y2="${Y(cl(a + 6 * b))}" style="stroke:var(--c4);stroke-width:3"/><line x1="${X(7)}" x2="${X(7)}" y1="${Y(cl(a + 6 * b))}" y2="${Y(cl(a + 7 * b))}" style="stroke:var(--c4);stroke-width:3"/><text x="${X(7) + 6}" y="${(Y(cl(a + 6 * b)) + Y(cl(a + 7 * b))) / 2}" dy=".32em" style="fill:var(--c4)">+${b.toFixed(2)}</text></g>`
        + `<line class="hlx" data-k="best" x1="${X(0)}" x2="${X(13)}" y1="${Y(fit.intercept)}" y2="${Y(fit.intercept + 13 * fit.slope)}" style="stroke:var(--c3);stroke-width:2.5;stroke-dasharray:6 4"/>`
        + xs.map((x, i) => `<circle cx="${X(x)}" cy="${Y(ys[i])}" r="4.5" style="fill:var(--ink)"/>`).join(''));
      $('#wn-k').innerHTML = kvs([['截距 a', a.toFixed(1), 'a'], ['斜率 b', b.toFixed(2), 'b'], ['殘差平方和', ssr.toFixed(1), 'ssr'], ['最小可能的殘差平方和', best.toFixed(1), 'best']]);
    };
    el.addEventListener('input', up);
    $('#wn-best', el).onclick = () => { $('#wn-a').value = fit.intercept.toFixed(1); $('#wn-b').value = (Math.round(fit.slope / 0.05) * 0.05).toFixed(2); up(); };
    up();
  },
  mm(el) {
    el.innerHTML = `<label class="fld"><span>輸入數字（以逗號或空白分隔）</span><input id="wm-in" type="text" inputmode="decimal" value="3, 4, 4, 5, 34"></label><div class="chart-wrap" id="wm-c"></div><div class="kv" id="wm-o"></div>`;
    const up = () => {
      const v = $('#wm-in').value.split(/[\s,，、;；]+/).filter(x => x !== '').map(Number).filter(Number.isFinite);
      if (v.length < 2) { $('#wm-o').innerHTML = '<p class="w-out">至少輸入 2 個數字。</p>'; $('#wm-c').innerHTML = ''; return; }
      const m = S.mean(v), md = S.median(v), s = S.sd(v), q1 = S.quantile(v, 0.25), q3 = S.quantile(v, 0.75), [lo, hi] = S.minmax(v), cnt = {};
      $('#wm-c').innerHTML = chart({ x: [Math.min(lo, m - s), Math.max(hi, m + s)], y: [0, 1], noY: true, h: 170, m: { t: 30 } }, (X, Y) =>
        `<rect class="hlx" data-k="sd" x="${X(m - s)}" y="${Y(1) - 18}" width="${X(m + s) - X(m - s)}" height="${Y(0) - Y(1) + 18}" style="fill:var(--c2);fill-opacity:.12"/><rect class="hlx" data-k="iqr" x="${X(q1)}" y="${Y(1) - 18}" width="${X(q3) - X(q1)}" height="${Y(0) - Y(1) + 18}" style="fill:var(--c3);fill-opacity:.15"/>`
        + v.map(x => { const k = (cnt[x] = (cnt[x] || 0) + 1); return `<circle data-k="n" cx="${X(x)}" cy="${Y(0) - 8 - (k - 1) * 13}" r="5.5" style="fill:var(--c1);fill-opacity:.75"/>`; }).join('')
        + `<g data-k="mean sd"><line x1="${X(m)}" x2="${X(m)}" y1="${Y(1) - 18}" y2="${Y(0)}" style="stroke:var(--c2);stroke-width:2"/><text class="mk" x="${X(m)}" y="${Y(1) - 22}" text-anchor="middle" style="fill:var(--c2)">平均 ${F.n(m)}</text></g>`
        + `<g data-k="med iqr"><line x1="${X(md)}" x2="${X(md)}" y1="${Y(1) + 2}" y2="${Y(0)}" style="stroke:var(--c3);stroke-width:2;stroke-dasharray:5 3"/><text class="mk" x="${X(md)}" y="${Y(1) - 2}" text-anchor="middle" style="fill:var(--c3)">中位數 ${F.n(md)}</text></g>`);
      $('#wm-o').innerHTML = kvs([['n', v.length, 'n'], ['平均數', F.n(m), 'mean'], ['中位數', F.n(md), 'med'], ['標準差 SD', F.n(s), 'sd'], ['IQR（Q1–Q3）', `${F.n(q3 - q1)}（${F.n(q1)}–${F.n(q3)}）`, 'iqr']]);
    };
    el.addEventListener('input', up); up();
  },
  normal(el) {
    el.innerHTML = `<div class="w-row">${slider('wz-m', '平均 μ', 80, 160, 1, 120)}${slider('wz-s', '標準差 σ', 5, 30, 1, 15)}${slider('wz-x', '觀察值 x', 60, 200, 1, 150)}</div><div class="chart-wrap" id="wz-c"></div><div class="kv" id="wz-o"></div>`;
    const up = () => {
      const m = sv('wz-m'), s = sv('wz-s'), x = sv('wz-x'), z = (x - m) / s, P = S.pnorm(z), lo = m - 4 * s, hi = m + 4 * s, pdf = t => Math.exp(-0.5 * ((t - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)), pk = pdf(m), xc = Math.max(lo, Math.min(hi, x));
      $('#wz-c').innerHTML = chart({ x: [lo, hi], y: [0, pk * 1.25], noY: true, h: 240, xlab: '測量值' }, (X, Y) => {
        const path = (a, b) => { let d = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 80; i++) { const t = a + (b - a) * i / 80; d += `L${X(t).toFixed(1)} ${Y(pdf(t)).toFixed(1)}`; } return d + `L${X(b)} ${Y(0)}Z`; };
        let c = ''; for (let i = 0; i <= 160; i++) { const t = lo + (hi - lo) * i / 160; c += `${i ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(pdf(t)).toFixed(1)}`; }
        return `<path data-k="pl" d="${path(lo, xc)}" style="fill:var(--c1);fill-opacity:.25"/><path class="hlx" data-k="pr" d="${path(xc, hi)}" style="fill:var(--c2);fill-opacity:.3"/><path class="keep" d="${c}" style="fill:none;stroke:var(--c1);stroke-width:2"/>`
          + [-2, -1, 1, 2].map(k => `<line data-k="z" x1="${X(m + k * s)}" x2="${X(m + k * s)}" y1="${Y(0)}" y2="${Y(pdf(m + k * s))}" style="stroke:var(--muted);stroke-dasharray:3 3"/>`).join('')
          + `<g class="hlx" data-k="z"><line x1="${X(m)}" x2="${X(xc)}" y1="${Y(pk * 1.12)}" y2="${Y(pk * 1.12)}" style="stroke:var(--c4);stroke-width:3"/><text x="${(X(m) + X(xc)) / 2}" y="${Y(pk * 1.12) - 6}" text-anchor="middle" style="fill:var(--c4)">${F.n(z, 2)} 個 σ</text></g>`
          + `<line class="keep" x1="${X(xc)}" x2="${X(xc)}" y1="${Y(0)}" y2="${Y(pk * 1.05)}" style="stroke:var(--c2);stroke-width:2"/>`;
      });
      $('#wz-o').innerHTML = kvs([['z 分數', F.n(z, 2), 'z'], ['P(X ≤ x)', F.n(100 * P, 1) + '%', 'pl'], ['P(X > x)', F.n(100 * (1 - P), 1) + '%', 'pr'], ['百分位', '第 ' + F.n(100 * P, 1), 'pl']]);
    };
    el.addEventListener('input', up); up();
  },
  diag(el) {
    el.innerHTML = `<div class="w-row">${slider('wd-se', '敏感度', 50, 100, 0.5, 90, '%')}${slider('wd-sp', '特異度', 50, 100, 0.5, 95, '%')}${slider('wd-pr', '盛行率', 0.1, 50, 0.1, 1, '%')}</div><div class="tbl-wrap" id="wd-t"></div><div id="wd-bar"></div><div class="kv" id="wd-o"></div>`;
    const up = () => {
      const se = sv('wd-se', v => v + '%') / 100, sp = sv('wd-sp', v => v + '%') / 100, pr = sv('wd-pr', v => v + '%') / 100;
      const N = 10000, D = N * pr, TP = D * se, FN = D - TP, H = N - D, TN = H * sp, FP = H - TN, ppv = TP / (TP + FP), npv = TN / (TN + FN), r = v => Math.round(v).toLocaleString(), tot = TP + FP;
      $('#wd-t').innerHTML = `<table class="st"><thead><tr><th>10,000 人</th><th>有病 ${r(D)}</th><th>沒病 ${r(H)}</th></tr></thead><tbody><tr><td>陽性</td><td class="good" data-k="ppv sens">真陽性 ${r(TP)}</td><td class="bad" data-k="ppv spec">偽陽性 ${r(FP)}</td></tr><tr><td>陰性</td><td class="bad" data-k="npv sens">偽陰性 ${r(FN)}</td><td class="good" data-k="npv spec">真陰性 ${r(TN)}</td></tr></tbody></table>`;
      $('#wd-bar').innerHTML = `<p class="w-cap">檢驗陽性的 ${r(tot)} 人組成</p><div class="hbar"><i data-k="ppv" style="width:${100 * TP / tot}%;background:var(--c3)"></i><i data-k="ppv" style="width:${100 * FP / tot}%;background:var(--c2)"></i></div>${legend([['var(--c3)', `真陽性 ${r(TP)}`], ['var(--c2)', `偽陽性 ${r(FP)}`]])}`;
      $('#wd-o').innerHTML = kvs([['陽性預測值 PPV', F.n(100 * ppv, 1) + '%', 'ppv'], ['陰性預測值 NPV', F.n(100 * npv, 2) + '%', 'npv'], ['敏感度', F.n(100 * se, 1) + '%', 'sens'], ['特異度', F.n(100 * sp, 1) + '%', 'spec']]);
    };
    el.addEventListener('input', up); up();
  },
  clt(el) {
    el.innerHTML = `<div class="w-row"><label class="fld"><span>母體形狀</span><select id="wc-p"><option value="exp">右偏（像住院天數）</option><option value="unif">均勻</option><option value="bi">雙峰</option></select></label>${slider('wc-n', '每次抽樣人數 n', 1, 50, 1, 2)}</div><div class="w-row"><button class="btn" id="wc-go" type="button">重新抽樣 2,000 次</button></div><div class="w-cols"><figure class="fig"><figcaption>母體（原始資料）</figcaption><div class="chart-wrap" id="wc-a"></div></figure><figure class="fig"><figcaption>2,000 個樣本平均數</figcaption><div class="chart-wrap" id="wc-b"></div></figure></div><div class="kv" id="wc-o"></div>`;
    const P = { exp: { f: () => -5 * Math.log(1 - Math.random()), mu: 5, sd: 5, lo: 0, hi: 25 }, unif: { f: () => Math.random() * 10, mu: 5, sd: 10 / Math.sqrt(12), lo: 0, hi: 10 }, bi: { f: () => (Math.random() < 0.5 ? 2 : 8) + rnorm(), mu: 5, sd: Math.sqrt(10), lo: -1, hi: 11 } };
    const up = () => {
      const p = P[$('#wc-p').value], n = sv('wc-n'), pop = Array.from({ length: 5000 }, p.f), means = Array.from({ length: 2000 }, () => { let s = 0; for (let i = 0; i < n; i++) s += p.f(); return s / n; });
      const mm = S.mean(means), sdm = S.sd(means), se = p.sd / Math.sqrt(n);
      const band = (X, Y, a, b, k, c, y) => `<g class="hlx" data-k="${k}"><line x1="${X(a)}" x2="${X(b)}" y1="${y}" y2="${y}" style="stroke:${c};stroke-width:4"/></g>`;
      $('#wc-a').innerHTML = histChart(pop.filter(v => v >= p.lo && v <= p.hi), { lo: p.lo, hi: p.hi, bins: 30, h: 200, color: () => 'var(--muted)', noY: true, extra: (X, Y) => `<line class="hlx" data-k="mm" x1="${X(p.mu)}" x2="${X(p.mu)}" y1="${Y(0)}" y2="${Y(0) - 150}" style="stroke:var(--c2);stroke-width:2.5"/>` });
      $('#wc-b').innerHTML = histChart(means.filter(v => v >= p.lo && v <= p.hi), { lo: p.lo, hi: p.hi, bins: 40, h: 200, noY: true, extra: (X, Y) => `<line class="hlx" data-k="mm" x1="${X(mm)}" x2="${X(mm)}" y1="${Y(0)}" y2="${Y(0) - 150}" style="stroke:var(--c2);stroke-width:2.5"/>` + band(X, Y, mm - sdm, mm + sdm, 'sdm', 'var(--c2)', Y(0) - 150) + band(X, Y, mm - se, mm + se, 'se', 'var(--c4)', Y(0) - 140) });
      $('#wc-o').innerHTML = kvs([['樣本平均數的平均', F.n(mm, 2) + `（μ = ${p.mu}）`, 'mm'], ['平均數的標準差（模擬）', F.n(sdm, 3), 'sdm'], ['理論標準誤 σ ÷ √n', F.n(se, 3), 'se']]);
    };
    $('#wc-p').onchange = up; $('#wc-n').oninput = up; $('#wc-go').onclick = up; up();
  },
  ci(el) {
    el.innerHTML = `<div class="w-row">${slider('wi-n', '樣本數 n', 5, 100, 1, 20)}<label class="fld"><span>信賴水準</span><select id="wi-c"><option value="0.90">90%</option><option value="0.95" selected>95%</option><option value="0.99">99%</option></select></label></div><div class="w-row"><button class="btn" id="wi-go" type="button">再做 50 次研究</button></div><p class="w-cap">母體真值 μ = 100、σ = 15；黑線是 μ。每條橫線是一次研究算出的信賴區間。</p><div class="chart-wrap" id="wi-ch"></div><div class="kv" id="wi-o"></div>`;
    const up = () => {
      const n = sv('wi-n'), cl = +$('#wi-c').value, tc = S.qt(1 - (1 - cl) / 2, n - 1);
      const iv = Array.from({ length: 50 }, () => { const x = Array.from({ length: n }, () => 100 + 15 * rnorm()), m = S.mean(x), h = tc * S.sd(x) / Math.sqrt(n); return [m - h, m + h, m]; });
      const hit = iv.filter(([a, b]) => a <= 100 && b >= 100).length, lo = Math.min(...iv.map(v => v[0])), hi = Math.max(...iv.map(v => v[1])), wd = S.mean(iv.map(v => v[1] - v[0]));
      $('#wi-ch').innerHTML = chart({ x: [Math.min(lo, 85), Math.max(hi, 115)], y: [0, 51], noY: true, h: 380, xlab: '測量值', xgrid: true }, (X, Y) => `<line class="keep" x1="${X(100)}" x2="${X(100)}" y1="${Y(51)}" y2="${Y(0)}" style="stroke:var(--ink);stroke-width:1.5"/>` + iv.map(([a, b, m], i) => { const ok = a <= 100 && b >= 100, c = ok ? 'var(--c1)' : 'var(--c2)'; return `<g data-k="${ok ? 'hit' : 'miss'} wd"><line x1="${X(a)}" x2="${X(b)}" y1="${Y(i + 1)}" y2="${Y(i + 1)}" style="stroke:${c};stroke-width:${ok ? 2 : 3}"/><circle cx="${X(m)}" cy="${Y(i + 1)}" r="2.5" style="fill:${c}"/></g>`; }).join(''));
      $('#wi-o').innerHTML = kvs([['涵蓋 μ 的區間', `${hit} / 50`, 'hit'], ['沒涵蓋 μ 的區間', `${50 - hit} / 50`, 'miss'], ['區間平均寬度', F.n(wd, 1), 'wd']]);
    };
    $('#wi-n').oninput = up; $('#wi-c').onchange = up; $('#wi-go').onclick = up; up();
  },
  pdist(el) {
    el.innerHTML = `<div class="w-row">${slider('wp-d', "真實效果量 Cohen's d", 0, 1.2, 0.1, 0)}${slider('wp-n', '每組樣本數', 5, 100, 1, 20)}</div><div class="w-row"><button class="btn" id="wp-go" type="button">再跑 1,000 次</button></div><p class="w-cap">每次實驗比較兩組，算出一個 p 值；下圖是 1,000 個 p 值的分佈。</p><div class="chart-wrap" id="wp-c"></div><div class="kv" id="wp-o"></div>`;
    const up = () => {
      const d = sv('wp-d', v => v.toFixed(1)), n = sv('wp-n');
      const ps = Array.from({ length: 1000 }, () => S.welch(Array.from({ length: n }, rnorm), Array.from({ length: n }, () => d + rnorm())).p), sig = ps.filter(p => p < 0.05).length, th = d === 0 ? 0.05 : S.powerMeans(d, n, 0.05);
      $('#wp-c').innerHTML = histChart(ps, { lo: 0, hi: 1, bins: 20, h: 240, xlab: 'p 值', ylab: '實驗次數', color: i => (i === 0 ? 'var(--c2)' : 'var(--c1)'), tag: i => (i === 0 ? 'sig' : ''), extra: (X, Y) => `<g class="hlx" data-k="th"><line x1="${X(0)}" x2="${X(0.05)}" y1="${Y(th * 1000)}" y2="${Y(th * 1000)}" style="stroke:var(--c4);stroke-width:3"/></g>` });
      $('#wp-o').innerHTML = kvs([['p < 0.05 的實驗', `${sig} / 1000（${F.n(sig / 10, 1)}%）`, 'sig'], [d === 0 ? '理論值（α）' : '理論值（檢定力）', F.n(100 * th, 1) + '%', 'th']]);
    };
    $('#wp-d').oninput = up; $('#wp-n').oninput = up; $('#wp-go').onclick = up; up();
  },
  power(el) {
    el.innerHTML = `<div class="seg" role="tablist" id="ww-mode"><button type="button" data-m="m" aria-selected="true">比較兩組平均</button><button type="button" data-m="p" aria-selected="false">比較兩組比例</button></div>
<div class="w-row" id="ww-mean"><label class="fld"><span>想偵測的最小差異 Δ</span><input id="ww-delta" type="number" inputmode="decimal" value="5" step="any"></label><label class="fld"><span>標準差 SD</span><input id="ww-sd" type="number" inputmode="decimal" value="10" step="any" min="0"></label></div>
<div class="w-row" id="ww-prop" hidden><label class="fld"><span>對照組比例 p₁</span><input id="ww-p1" type="number" inputmode="decimal" value="0.30" step="0.01" min="0.01" max="0.99"></label><label class="fld"><span>處理組比例 p₂</span><input id="ww-p2" type="number" inputmode="decimal" value="0.20" step="0.01" min="0.01" max="0.99"></label></div>
<div class="w-row"><label class="fld"><span>α（雙尾）</span><select id="ww-a"><option>0.05</option><option>0.01</option><option>0.1</option></select></label><label class="fld"><span>檢定力</span><select id="ww-pw"><option>0.8</option><option>0.9</option><option>0.95</option></select></label><label class="fld"><span>預期流失率（%）</span><input id="ww-drop" type="number" inputmode="numeric" value="10" min="0" max="80" step="1"></label></div>
<div class="chart-wrap" id="ww-c"></div><div class="kv" id="ww-o"></div><p class="w-out" id="ww-txt"></p>`;
    let mode = 'm';
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
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
});


/* ---------- 第 5 階段：ANOVA 與實驗設計 ---------- */
Object.assign(W, {
  anovaassume(el) {
    const base = [0, 1, 2].map(k => std(Array.from({ length: 60 }, normOf(rngOf(31 + k)))));
    el.innerHTML = `<p class="w-cap">三組資料，真實平均都相同。調整分佈形狀與變異數，看 Q-Q 圖和各種檢定的反應。</p>
<div class="seg wrap" id="wq-s"><button type="button" data-s="norm" aria-selected="true">常態</button><button type="button" data-s="skew" aria-selected="false">右偏</button></div>
<div class="w-row">${slider('wq-r', 'C 組標準差是 A 組的幾倍', 1, 5, 0.5, 1)}${slider('wq-n', '每組人數', 5, 40, 1, 12)}</div>
<label class="tog"><input type="checkbox" id="wq-u"> C 組人數只有一半</label>
<div class="w-cols"><figure class="fig"><figcaption>各組資料</figcaption><div class="chart-wrap" id="wq-b"></div></figure><figure class="fig"><figcaption>殘差的 Q-Q 圖</figcaption><div class="chart-wrap" id="wq-q"></div></figure></div>
<div class="kv" id="wq-k"></div>
<div class="w-row"><button class="btn" type="button" id="wq-go">模擬 500 次：真實無差異時的偽陽性率</button></div><div class="chart-wrap" id="wq-sim"></div>`;
    let shape = 'norm', sim = null;
    const make = (r, n, unb, shp, zs) => zs.map((z, k) => { const m = k === 2 && unb ? Math.max(3, Math.round(n / 2)) : n, sd = k === 2 ? r : 1; return z.slice(0, m).map(x => (shp === 'skew' ? 10 * Math.exp(0.6 * sd * x - 0.18 * sd * sd) : 10 + 2 * sd * x)); });
    const up = () => {
      const r = sv('wq-r', v => v.toFixed(1)), n = sv('wq-n'), unb = $('#wq-u').checked, gv = make(r, n, unb, shape, base);
      const A = S.anova(gv), Wl = S.welchAnova(gv), L = S.levene(gv), K = S.kruskal(gv), sds = gv.map(S.sd), ratio = Math.max(...sds) / Math.min(...sds);
      $('#wq-b').innerHTML = boxStrip(gv.map((v, k) => ({ label: 'ABC'[k], v })), '測量值', (X, Y, { bw }) => gv.map((g, k) => { const m = S.mean(g), sd = S.sd(g), x = X(k) - bw / 2 - 10; return `<line class="hlx" data-k="spread" x1="${x}" x2="${x}" y1="${Y(m - sd)}" y2="${Y(m + sd)}" style="stroke:var(--c2);stroke-width:4"/><line class="hlx" data-k="means" x1="${X(k) - bw}" x2="${X(k) + bw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--c4);stroke-width:3"/>`; }).join(''));
      const res = gv.flatMap(g => { const m = S.mean(g); return g.map(v => v - m); }), sr = Float64Array.from(res).sort(), sdr = S.sd(res), nn = sr.length, th = Array.from(sr, (_, i) => S.qnorm((i + 0.5) / nn) * sdr);
      const [lo, hi] = S.minmax([...sr, ...th]);
      $('#wq-q').innerHTML = chart({ x: [lo, hi], y: [lo, hi], h: 260, xlab: '常態分佈的理論位置', ylab: '殘差（排序後）' }, (X, Y) => `<line class="keep" x1="${X(lo)}" y1="${Y(lo)}" x2="${X(hi)}" y2="${Y(hi)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + Array.from(sr, (v, i) => `<circle data-k="qq" cx="${X(th[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.7"/>`).join(''));
      $('#wq-k').innerHTML = kvs([['標準差 最大 ÷ 最小', F.n(ratio, 2), 'spread'], ['Levene 檢定 p', F.p(L.p), 'spread'], ['一般 ANOVA p', F.p(A.p), 'means'], ['Welch ANOVA p', F.p(Wl.p), 'means'], ['Kruskal–Wallis p', F.p(K.p), 'rank']]);
      if (sim) drawSim();
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
    $('#wq-r').oninput = reset; $('#wq-n').oninput = reset; $('#wq-u').onchange = reset; $('#wq-go', el).onclick = runSim; up();
  },
  posthoc(el) {
    const z = [0, 1, 2, 3].map(k => std(Array.from({ length: 30 }, normOf(rngOf(51 + k))))), names = ['對照', 'A', 'B', 'C'];
    el.innerHTML = `<p class="w-cap">四組植株：對照組和三種肥料。調整各組的真實效果，看事後比較與字母標記怎麼變。</p>
<div class="w-row">${slider('wh2-a', 'A 比對照高', 0, 6, 0.5, 0)}${slider('wh2-b', 'B 比對照高', 0, 6, 0.5, 2)}${slider('wh2-c', 'C 比對照高', 0, 6, 0.5, 4)}</div>
<div class="w-row">${slider('wh2-s', '組內標準差', 1, 6, 0.5, 2.5)}${slider('wh2-n', '每組株數', 4, 30, 1, 8)}</div>
<div class="seg wrap" id="wh2-m"><button type="button" data-m="none" aria-selected="false">未校正</button><button type="button" data-m="bonf" aria-selected="false">Bonferroni</button><button type="button" data-m="tukey" aria-selected="true">Tukey</button></div>
<figure class="fig"><figcaption>各組資料與字母標記（依目前選的方法）</figcaption><div class="chart-wrap" id="wh2-b2"></div></figure>
<figure class="fig"><figcaption>所有兩兩比較的平均差與信賴區間；區間不含 0（虛線）即判定有差異</figcaption><div class="chart-wrap" id="wh2-f"></div></figure>
<div class="kv" id="wh2-k"></div>
<div class="w-row"><button class="btn" type="button" id="wh2-go">模擬 500 次：真實全部沒有差異時，至少一對被判定有差的比例</button></div><div class="chart-wrap" id="wh2-sim"></div>`;
    let method = 'tukey', sim = null;
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
      const eff = [0, sv('wh2-a', v => v.toFixed(1)), sv('wh2-b', v => v.toFixed(1)), sv('wh2-c', v => v.toFixed(1))], sd = sv('wh2-s', v => v.toFixed(1)), n = sv('wh2-n'), gv = make(eff, sd, n, z);
      const pr = compare(gv, method), sig = names.map(() => names.map(() => false)); pr.forEach(x => { sig[x.i][x.j] = sig[x.j][x.i] = x.p < 0.05; });
      const L = cld(gv.map(S.mean), sig), nsig = pr.filter(x => x.p < 0.05).length;
      $('#wh2-b2').innerHTML = boxStrip(gv.map((v, k) => ({ label: names[k], v })), '株高', (X, Y, { M }) => L.map((l, k) => `<text data-k="cld" x="${X(k)}" y="${M.t + 12}" text-anchor="middle" style="fill:var(--ink);font-size:15px;font-weight:700">${l}</text>`).join(''));
      $('#wh2-f').innerHTML = forestChart(pr.map((x, idx) => ({ k: (x.p < 0.05 ? 'sigp ' : '') + 'allp', label: `${names[x.j]} − ${names[x.i]}`, est: x.diff, lo: x.lo, hi: x.hi })), '平均差', false);
      $('#wh2-k').innerHTML = kvs([['兩兩比較的對數', '6 對', 'allp'], ['未校正時的家族錯誤率', F.n(100 * (1 - Math.pow(0.95, 6)), 1) + '%', 'allp'], ['判定有差異的對數', `${nsig} 對`, 'sigp'], ['字母標記', L.map((l, k) => `${names[k]} ${l}`).join('、'), 'cld']]);
      if (sim) drawSim();
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
    segBind(el, '#wh2-m', b => { method = b.dataset.m; up(); });
    el.addEventListener('input', e => { if (e.target.type === 'range') { if (['wh2-s', 'wh2-n'].includes(e.target.id)) { sim = null; $('#wh2-sim').innerHTML = ''; } up(); } });
    $('#wh2-go', el).onclick = runSim; up();
  },
  twowayw(el) {
    const z = [0, 1, 2, 3].map(k => std(Array.from({ length: 20 }, normOf(rngOf(71 + k)))));
    el.innerHTML = `<p class="w-cap">2 × 2 因子設計：飼料（一般／高脂）× 基因型（WT／KO）。調整三種效果，看交互作用圖與 ANOVA 表怎麼變。</p>
<div class="w-row">${slider('wt2-a', '高脂飼料的效果（公克）', 0, 8, 0.5, 6)}${slider('wt2-b', 'KO 比 WT 多（公克）', -4, 4, 0.5, 0)}${slider('wt2-i', '交互作用：KO 吃高脂時額外的變化', -8, 4, 0.5, -4)}</div>
<div class="w-row">${slider('wt2-s', '組內標準差', 0.5, 4, 0.5, 1.5)}${slider('wt2-n', '每種組合幾隻', 3, 20, 1, 8)}</div>
<div class="chart-wrap" id="wt2-c"></div>${legend([['var(--c1)', 'WT'], ['var(--c2)', 'KO']])}
<div class="kv" id="wt2-k"></div><div id="wt2-t"></div>`;
    const up = () => {
      const ea = sv('wt2-a', v => v.toFixed(1)), eb = sv('wt2-b', v => v.toFixed(1)), ei = sv('wt2-i', v => v.toFixed(1)), sd = sv('wt2-s', v => v.toFixed(1)), n = sv('wt2-n');
      const mu = [[3, 3 + eb], [3 + ea, 3 + ea + eb + ei]], cells = [0, 1].map(i => [0, 1].map(j => z[i * 2 + j].slice(0, n).map(x => mu[i][j] + sd * x)));
      const y = [], ai = [], bi = []; cells.forEach((row, i) => row.forEach((cell, j) => cell.forEach(v => { y.push(v); ai.push(i); bi.push(j); })));
      const T = S.twoway(y, ai, bi), m = (i, j) => S.mean(cells[i][j]);
      $('#wt2-c').innerHTML = interPlot(['一般飼料', '高脂飼料'], ['WT', 'KO'], cells, '體重增加（公克）', (X, Y) => [0, 1].map(j => `<g class="hlx" data-k="se${j}"><line x1="${X(1) + 22 + 10 * j}" x2="${X(1) + 22 + 10 * j}" y1="${Y(m(0, j))}" y2="${Y(m(1, j))}" style="stroke:${col4(j)};stroke-width:4"/><line x1="${X(0)}" x2="${X(1) + 22 + 10 * j}" y1="${Y(m(0, j))}" y2="${Y(m(0, j))}" style="stroke:${col4(j)};stroke-dasharray:3 3"/></g>`).join(''));
      $('#wt2-k').innerHTML = kvs([['飼料主效果 F', `${F.n(T.A.F, 2)}（p ${F.p(T.A.p)}）`, 'mainA'], ['基因型主效果 F', `${F.n(T.B.F, 2)}（p ${F.p(T.B.p)}）`, 'mainB'], ['交互作用 F', `${F.n(T.AB.F, 2)}（p ${F.p(T.AB.p)}）`, 'inter'], ['簡單效果：WT 吃高脂', `${F.n(m(1, 0) - m(0, 0), 1)} 公克`, 'se0'], ['簡單效果：KO 吃高脂', `${F.n(m(1, 1) - m(0, 1), 1)} 公克`, 'se1']]);
      const rowT = (nm, r) => [nm, F.n(r.ss), r.df, F.n(r.ms), F.n(r.F, 2), F.p(r.p)];
      $('#wt2-t').innerHTML = tableHTML({ head: ['來源', 'SS', '自由度', 'MS', 'F', 'p 值'], rows: [rowT('飼料', T.A), rowT('基因型', T.B), rowT('飼料 × 基因型', T.AB), ['殘差', F.n(T.E.ss), T.E.df, F.n(T.E.ms), '', '']] });
    };
    el.addEventListener('input', up); up();
  },
  blockw(el) {
    const zb = std(Array.from({ length: 8 }, normOf(rngOf(91)))), ze = [0, 1, 2].map(k => std(Array.from({ length: 8 }, normOf(rngOf(95 + k)))));
    el.innerHTML = `<p class="w-cap">3 種肥料、每個溫室各一盆（共 6 個溫室）。溫室之間本來就有差異。比較「考慮區集」與「不考慮區集」兩種分析。</p>
<div class="w-row">${slider('wb-b', '溫室之間的差異（標準差）', 0, 6, 0.5, 4)}${slider('wb-e', '肥料 B、C 比 A 高', 0, 4, 0.5, 1.5)}${slider('wb-s', '殘差標準差', 0.5, 3, 0.5, 1)}</div>
<div class="chart-wrap" id="wb-c"></div><div class="kv" id="wb-k"></div>`;
    const up = () => {
      const sb = sv('wb-b', v => v.toFixed(1)), e = sv('wb-e', v => v.toFixed(1)), se = sv('wb-s', v => v.toFixed(1)), nb = 6, eff = [0, e, e * 1.5];
      const y = [], t = [], b = []; for (let k = 0; k < 3; k++) for (let j = 0; j < nb; j++) { y.push(30 + eff[k] + sb * zb[j] + se * ze[k][j]); t.push(k); b.push(j); }
      const R = S.blockAnova(y, t, b), gv = [0, 1, 2].map(k => y.filter((_, i) => t[i] === k)), A1 = S.anova(gv), [mn, mx] = S.minmax(y);
      $('#wb-c').innerHTML = chart({ xcats: ['肥料 A', '肥料 B', '肥料 C'], y: [mn, mx], h: 300, ylab: '株高' }, (X, Y) => {
        let g = ''; for (let j = 0; j < nb; j++) g += `<path data-k="blk" d="${[0, 1, 2].map(k => `${k ? 'L' : 'M'}${X(k)} ${Y(y[k * nb + j])}`).join('')}" style="fill:none;stroke:${['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--muted)', 'var(--ink)'][j]};stroke-width:1.5;stroke-opacity:.6"/>`;
        for (let k = 0; k < 3; k++) for (let j = 0; j < nb; j++) g += `<circle data-k="blk" cx="${X(k)}" cy="${Y(y[k * nb + j])}" r="4.5" style="fill:${['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--muted)', 'var(--ink)'][j]}"/>`;
        return g + gv.map((v, k) => `<line data-k="trt" x1="${X(k) - 30}" x2="${X(k) + 30}" y1="${Y(S.mean(v))}" y2="${Y(S.mean(v))}" style="stroke:var(--ink);stroke-width:3.5"/>`).join('');
      });
      $('#wb-k').innerHTML = kvs([['殘差均方（不考慮區集）', F.n(A1.msw, 2), 'blk'], ['殘差均方（考慮區集）', F.n(R.E.ms, 2), 'trt'], ['p 值（不考慮區集）', F.p(A1.p), 'blk'], ['p 值（考慮區集）', F.p(R.T.p), 'trt'], ['區集 F', F.n(R.B.F, 2), 'blk']]);
    };
    el.addEventListener('input', up); up();
  },
  rmw(el) {
    const zs = std(Array.from({ length: 10 }, normOf(rngOf(131)))), ze = Array.from({ length: 10 }, (_, i) => Array.from({ length: 4 }, normOf(rngOf(140 + i))));
    el.innerHTML = `<p class="w-cap">10 隻小鼠在 4 個時間點測量。調整個體差異和「相鄰時間點更相似」的程度，比較兩種分析。</p>
<div class="w-row">${slider('wr2-s', '個體之間的差異', 0, 8, 0.5, 5)}${slider('wr2-t', '每個時間點減少', 0, 6, 0.5, 2)}${slider('wr2-r', '相鄰時間點的相關（違反球形）', 0, 0.9, 0.1, 0)}</div>
<div class="chart-wrap" id="wr2-c"></div><div class="kv" id="wr2-k"></div>`;
    const up = () => {
      const ss = sv('wr2-s', v => v.toFixed(1)), td = sv('wr2-t', v => v.toFixed(1)), rho = sv('wr2-r', v => v.toFixed(1));
      const M = zs.map((u, i) => { let e = ze[i][0] * 2; return [0, 1, 2, 3].map(j => { if (j) e = rho * e + Math.sqrt(1 - rho * rho) * ze[i][j] * 2; return 50 - td * j + ss * u + e + (rho ? zs[i] * rho * j * 1.5 : 0); }); });
      const R = S.rmAnova(M), A1 = S.anova([0, 1, 2, 3].map(j => M.map(r => r[j]))), cm = [0, 1, 2, 3].map(j => S.mean(M.map(r => r[j]))), [mn, mx] = S.minmax(M.flat());
      $('#wr2-c').innerHTML = chart({ xcats: ['第 0 天', '第 3 天', '第 7 天', '第 14 天'], y: [mn, mx], h: 300, ylab: '傷口面積' }, (X, Y) => M.map(r => `<path data-k="subj" d="${r.map((v, j) => `${j ? 'L' : 'M'}${X(j)} ${Y(v).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-opacity:.45;stroke-width:1.5"/>`).join('') + `<path data-k="time" d="${cm.map((v, j) => `${j ? 'L' : 'M'}${X(j)} ${Y(v)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:3.5"/>`);
      $('#wr2-k').innerHTML = kvs([['p 值（當作獨立組的 ANOVA）', F.p(A1.p), 'subj'], ['p 值（重複測量，未校正）', F.p(R.p), 'time'], ['Greenhouse–Geisser ε', F.n(R.eps, 3), 'subj'], ['p 值（Greenhouse–Geisser 校正）', F.p(R.pGG), 'time']]);
    };
    el.addEventListener('input', up); up();
  },
  iccw(el) {
    const zb = std(Array.from({ length: 8 }, normOf(rngOf(161)))), zw = Array.from({ length: 8 }, (_, i) => std(Array.from({ length: 6 }, normOf(rngOf(170 + i)))));
    el.innerHTML = `<p class="w-cap">8 隻小鼠，每隻量好幾次。調整「小鼠之間」與「同一隻內」的差異，看 ICC 和有效樣本數。</p>
<div class="w-row">${slider('wi2-b', '小鼠之間的標準差', 0, 5, 0.25, 3)}${slider('wi2-w', '同一隻小鼠內的標準差', 0.25, 5, 0.25, 1.5)}${slider('wi2-m', '每隻量幾次', 2, 6, 1, 4)}</div>
<div class="chart-wrap" id="wi2-c"></div><div class="kv" id="wi2-k"></div>`;
    const up = () => {
      const sb = sv('wi2-b', v => v.toFixed(2)), sw = sv('wi2-w', v => v.toFixed(2)), m = sv('wi2-m'), gv = zb.map((u, i) => zw[i].slice(0, m).map(e => 20 + sb * u + sw * e)), R = S.icc(gv), gm = S.mean(gv.flat()), [mn, mx] = S.minmax(gv.flat()), de = 1 + (m - 1) * Math.max(0, R.icc);
      $('#wi2-c').innerHTML = chart({ xcats: gv.map((_, i) => `#${i + 1}`), y: [mn, mx], h: 280, ylab: '腫瘤大小' }, (X, Y) => {
        let g = `<line class="hlx" data-k="vb icc" x1="${X(0) - 20}" x2="${X(7) + 20}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>`;
        gv.forEach((v, i) => { const mi = S.mean(v); g += v.map(x => `<line class="hlx" data-k="vw icc" x1="${X(i) + 6}" x2="${X(i) + 6}" y1="${Y(x)}" y2="${Y(mi)}" style="stroke:var(--c3);stroke-width:2"/>`).join('') + v.map(x => `<circle data-k="pts" cx="${X(i)}" cy="${Y(x)}" r="4" style="fill:var(--c1);fill-opacity:.7"/>`).join('') + `<line data-k="vb icc" x1="${X(i) - 12}" x2="${X(i) + 12}" y1="${Y(mi)}" y2="${Y(mi)}" style="stroke:var(--c2);stroke-width:3"/><line class="hlx" data-k="vb icc" x1="${X(i) - 8}" x2="${X(i) - 8}" y1="${Y(gm)}" y2="${Y(mi)}" style="stroke:var(--c2);stroke-width:2.5"/>`; });
        return g;
      });
      $('#wi2-k').innerHTML = kvs([['小鼠之間的變異成分', F.n(R.vb, 2), 'vb'], ['同一隻內的變異成分', F.n(R.vw, 2), 'vw'], ['ICC', F.n(Math.max(0, R.icc), 3), 'icc'], ['設計效應', F.n(de, 2), 'pts'], ['有效樣本數', `${F.n(8 * m / de, 1)}（共 ${8 * m} 次測量）`, 'pts']]);
    };
    el.addEventListener('input', up); up();
  },
  expdesign(el) {
    el.innerHTML = `<p class="w-cap">情境：測試新藥能不能讓小鼠體重增加。每隻小鼠本來的健康狀況不同，健康的小鼠本來就長得比較好。下圖是把同一個實驗重做 400 次，每次估計的藥效（給藥組平均 − 對照組平均）。</p>
<div class="seg wrap" id="wx-a"><button type="button" data-a="rand" aria-selected="true">隨機分派</button><button type="button" data-a="pick" aria-selected="false">研究者挑選（健康的給藥）</button></div>
<label class="tog"><input type="checkbox" id="wx-b" checked> 量測者盲化</label>
<div class="w-row">${slider('wx-e', '設定的藥效（公克）', 0, 3, 0.5, 0)}${slider('wx-n', '每組小鼠數', 4, 40, 2, 10)}</div>
<div class="w-row"><button class="btn" id="wx-go" type="button">再做 400 次實驗</button></div>
<div class="chart-wrap" id="wx-c"></div>${legend([['var(--c1)', 'p ≥ 0.05 的實驗'], ['var(--c2)', 'p < 0.05 的實驗'], ['var(--ink)', '設定的藥效（真值）']])}<div class="kv" id="wx-k"></div>`;
    let alloc = 'rand';
    const up = () => {
      const blind = $('#wx-b').checked, eff = sv('wx-e', v => v.toFixed(1)), n = sv('wx-n'), est = [], sig = [];
      for (let r = 0; r < 400; r++) {
        const h = Array.from({ length: 2 * n }, rnorm), idx = h.map((_, i) => i);
        if (alloc === 'pick') idx.sort((a, b) => h[b] - h[a]); else for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        const y = i => 20 + 1.5 * h[i] + 1.5 * rnorm(), yt = idx.slice(0, n).map(i => y(i) + eff + (blind ? 0 : 0.8)), yc = idx.slice(n).map(y), wv = S.welch(yc, yt);
        est.push(wv.diff); sig.push(wv.p < 0.05);
      }
      const m = S.mean(est), sd = S.sd(est), lo = Math.min(-2, ...est), hi = Math.max(5, ...est), B = 32, bw = (hi - lo) / B, c0 = new Array(B).fill(0), c1 = new Array(B).fill(0);
      est.forEach((e, i) => { const k = Math.min(B - 1, Math.floor((e - lo) / bw)); (sig[i] ? c1 : c0)[k]++; });
      const top = Math.max(...c0.map((v, i) => v + c1[i]));
      $('#wx-c').innerHTML = chart({ x: [lo, hi], y: [0, top * 1.25], h: 260, xlab: '估計的藥效（公克）', ylab: '實驗次數' }, (X, Y) => {
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

const WMAP = { 'random-eff': ['iccw', 'ICC 與有效樣本數'], 'repeated': ['rmw', '同一個體測多次'], 'block': ['blockw', '考慮區集與否'], 'twoway': ['twowayw', '交互作用圖'], 'posthoc': ['posthoc', '事後比較與字母標記'], 'exp-design': ['expdesign', '400 次小鼠實驗'], 'anova-assume': ['anovaassume', '前提不成立會怎樣'], 'c0-1': ['rate', '100 人中有幾人'], 'c0-2': ['sigma', '動手算 Σ'], 'c0-3': ['log', '倍數與對數尺度'], 'c1-1': ['types', '變數分類挑戰'], 'c1-3': ['spread', '同樣的平均，不同的分散'], 'c1-5': ['table1w', '動手排一份 Table 1'], 'c3-1': ['tvis', '訊號與雜訊'], 'c3-2': ['anovavis', '組間 vs 組內變異'], 'c3-3': ['twobytwo', '自己填 2×2 表'], 'c3-4': ['corrvis', '相關係數的陷阱'], 'c3-5': ['chooser', '選擇統計方法'], 'c4-1': ['confound', '校正干擾因子'], 'c4-2': ['logit', '用 S 形曲線擬合資料'], 'c4-3': ['kmbuild', '自己畫存活曲線'], 'c4-4': ['mtest', '大量檢定的陷阱'], 'c4-6': ['pseudo', '偽重複模擬'], 'c5-1': ['dag', '因果圖與干擾'], 'c5-2': ['phack', 'p-hacking 模擬器'], 'c5-3': ['figgood', '同一份資料，四種圖'], 'c5-4': ['checklist', '投稿前檢查表'], 'c5-5': ['tracks', '你的下一步路線圖'] };
for (const [id, [w, t]] of Object.entries(WMAP)) { const c = CH.find(x => x.id === id); c.widget = w; c.wtitle = t; }
