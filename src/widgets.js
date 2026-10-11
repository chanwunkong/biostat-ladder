/* ---------- 每章的互動圖 ---------- */
const sv = (id, fmt) => { const v = +$('#' + id).value, o = $('#' + id + '-o'); if (o) o.textContent = fmt ? fmt(v) : v; return v; };
const kvs = items => items.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
const std = a => { const m = S.mean(a), s = S.sd(a); return a.map(v => (v - m) / s); };
const tpdf = (x, df) => Math.exp(S.lgamma((df + 1) / 2) - S.lgamma(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + x * x / df, -(df + 1) / 2);
const segBind = (el, sel, fn) => $$(sel + ' button', el).forEach(b => { b.onclick = () => { $$(sel + ' button', el).forEach(x => x.setAttribute('aria-selected', x === b)); fn(b); }; });
function people(total, hit, c) {
  const cols = 10, s = 22; let g = '';
  for (let i = 0; i < total; i++) { const x = (i % cols) * s + s / 2, y = Math.floor(i / cols) * s * 1.15 + 3, f = i < hit ? c : 'var(--line)'; g += `<circle cx="${x}" cy="${y + 4}" r="3.8" style="fill:${f}"/><path d="M${x - 6} ${y + 18}q0-9 6-9t6 9z" style="fill:${f}"/>`; }
  return `<svg class="ppl" viewBox="0 0 ${cols * s} ${Math.ceil(total / cols) * s * 1.15 + 2}" role="img" aria-label="${total} 人中 ${hit} 人">${g}</svg>`;
}
function tblHTML(b) { return `<div class="tbl-wrap"><table class="st"><thead><tr>${b.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => { const c = Array.isArray(r) ? r : r.cells; return `<tr class="${Array.isArray(r) ? '' : r.cls || ''}">${c.map(x => `<td>${x}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div>`; }
const kmPath = (X, Y, k, c, dash) => { let d = `M${X(0)} ${Y(1)}`; k.steps.slice(1).forEach(p => { d += `H${X(p.t).toFixed(1)}V${Y(p.S).toFixed(1)}`; }); d += `H${X(k.end)}`; return `<path d="${d}" style="fill:none;stroke:${c};stroke-width:2.5${dash ? ';stroke-dasharray:6 4' : ''}"/>`; };
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
      $('#wr-ga').innerHTML = people(100, a, 'var(--c2)'); $('#wr-gb').innerHTML = people(100, b, 'var(--c1)');
      $('#wr-o').innerHTML = kvs([['絕對差', `${ard === 0 ? '' : ard > 0 ? '減少 ' : '增加 '}${Math.abs(ard)} 個百分點`], ['相對變化', `${ard > 0 ? '減少' : ard < 0 ? '增加' : ''} ${F.n(Math.abs(100 * ard / a), 0)}%`], ['風險比 RR', F.n(b / a, 2)], ['需治療人數 NNT', ard > 0 ? Math.ceil(100 / ard) + ' 人' : '—']]);
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
        x.forEach((v, i) => { const cc = v >= m ? 'var(--c3)' : 'var(--c2)', xx = X(i) + bw / 2 + 6; g += `<rect x="${X(i) - bw / 2}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:var(--c1);fill-opacity:.8"/><line x1="${xx}" x2="${xx}" y1="${Y(m)}" y2="${Y(v)}" style="stroke:${cc};stroke-width:3"/><text x="${xx + 4}" y="${(Y(m) + Y(v)) / 2}" dy=".32em" style="fill:${cc}">${dev[i] >= 0 ? '+' : ''}${F.n(dev[i], 1)}</text>`; });
        return g + `<line x1="${M.l}" x2="${M.l + iw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--c2);stroke-width:2;stroke-dasharray:6 4"/><text x="${M.l + iw}" y="${Y(m) - 6}" text-anchor="end" style="fill:var(--c2)">x̄ = ${F.n(m, 1)}</text>`;
      });
      $('#ws-f').innerHTML = `Σx<sub>i</sub> = ${x.join(' + ')} = <b>${sum}</b><br>x̄ = ${sum} ÷ 5 = <b>${F.n(m, 1)}</b><br>Σ(x<sub>i</sub> − x̄) = ${dev.map(d => F.n(d, 1)).join(' + ').replace(/\+ -/g, '− ')} = <b>0</b>`;
      $('#ws-o').innerHTML = kvs([['Σx', sum], ['x̄', F.n(m, 2)], ['Σ(x − x̄)²', F.n(ss, 1)], ['標準差 s', F.n(Math.sqrt(ss / 4), 2)]]);
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
        return `<rect x="${X(cl(m - 2 * sd))}" y="${y - hh / 2}" width="${X(cl(m + 2 * sd)) - X(cl(m - 2 * sd))}" height="${hh}" style="fill:var(--c1);fill-opacity:.08"/><rect x="${X(cl(m - sd))}" y="${y - hh / 2}" width="${X(cl(m + sd)) - X(cl(m - sd))}" height="${hh}" style="fill:var(--c1);fill-opacity:.17"/><rect x="${X(q1)}" y="${y - hh / 4}" width="${X(q3) - X(q1)}" height="${hh / 2}" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>` + v.map((x, k) => `<circle cx="${X(cl(x))}" cy="${y + (((k * 0.618) % 1) - 0.5) * hh * 0.8}" r="3.2" style="fill:${x === 200 ? 'var(--c2)' : 'var(--c1)'}"/>`).join('') + `<line x1="${X(m)}" x2="${X(m)}" y1="${y - hh / 2}" y2="${y + hh / 2}" style="stroke:var(--c2);stroke-width:2.5"/>`;
      }).join(''));
      $('#wv-k').innerHTML = kvs([['甲組 SD', F.n(S.sd(A), 1)], ['乙組 SD', F.n(S.sd(B), 1)], ['甲組 IQR', F.n(S.quantile(A, 0.75) - S.quantile(A, 0.25), 1)], ['乙組 IQR', F.n(S.quantile(B, 0.75) - S.quantile(B, 0.25), 1)]]);
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
  table1w(el) {
    el.innerHTML = `<p class="w-cap">資料：降血壓藥隨機試驗（120 人）。切換分組方式，觀察表格怎麼變。</p><div class="seg wrap" id="wt1-g"><button type="button" data-g="" aria-selected="false">不分組</button><button type="button" data-g="group" aria-selected="true">依治療組別</button><button type="button" data-g="sex" aria-selected="false">依性別</button></div><label class="tog"><input type="checkbox" id="wt1-p" checked> 顯示 p 值欄</label><div id="wt1-t"></div><figure class="fig"><figcaption>年齡分佈</figcaption><div class="chart-wrap" id="wt1-c"></div></figure>`;
    let g = 'group';
    const up = () => {
      const ds = getDS('bp_trial'), b = AN.table1.run(ds, { g, vars: ['age', 'sex', 'bmi', 'sbp_base', 'ae'] }).blocks[0].table, show = $('#wt1-p').checked || !g, cut = a => (g && !show ? a.slice(0, -1) : a);
      $('#wt1-p').disabled = !g;
      $('#wt1-t').innerHTML = tblHTML({ head: cut(b.head), rows: b.rows.map(x => (Array.isArray(x) ? cut(x) : { cls: x.cls, cells: cut(x.cells) })) });
      const ac = colOf(ds, 'age'), all = [...Array(ds.n).keys()];
      if (g) { const gc = colOf(ds, g); $('#wt1-c').innerHTML = boxStrip(levelsOf(ds, gc, all).map(l => ({ label: l, v: all.filter(i => lab(gc.values[i]) === l).map(i => ac.values[i]) })), '年齡（歲）'); }
      else $('#wt1-c').innerHTML = boxStrip([{ label: '全體', v: ac.values }], '年齡（歲）');
    };
    segBind(el, '#wt1-g', b => { g = b.dataset.g; up(); }); $('#wt1-p').onchange = up; up();
  },
  tvis(el) {
    el.innerHTML = `<div class="w-row">${slider('wtv-d', '兩組平均差 Δ', 0, 20, 1, 6)}${slider('wtv-s', '標準差 SD', 2, 30, 1, 12)}${slider('wtv-n', '每組人數 n', 3, 100, 1, 20)}</div><figure class="fig"><figcaption>兩組資料的分佈（藍 = 對照，紅 = 治療）</figcaption><div class="chart-wrap" id="wtv-a"></div></figure><figure class="fig"><figcaption>假如兩組其實沒差，t 值的分佈；紅色面積就是 p 值</figcaption><div class="chart-wrap" id="wtv-b"></div></figure><div class="kv" id="wtv-k"></div>`;
    const up = () => {
      const d = sv('wtv-d'), s = sv('wtv-s'), n = sv('wtv-n'), se = s * Math.sqrt(2 / n), t = d / se, df = 2 * n - 2, p = S.pt2(t, df);
      const lo = 100 - 3.5 * s, hi = 100 + d + 3.5 * s, pdf = (x, m) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)), pk = pdf(100, 100);
      const curve = (X, Y, m, c) => { let q = `M${X(lo)} ${Y(0)}`; for (let i = 0; i <= 120; i++) { const x = lo + (hi - lo) * i / 120; q += `L${X(x).toFixed(1)} ${Y(pdf(x, m)).toFixed(1)}`; } return `<path d="${q}L${X(hi)} ${Y(0)}Z" style="fill:${c};fill-opacity:.18;stroke:${c};stroke-width:2"/><line x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(pk)}" style="stroke:${c};stroke-width:2;stroke-dasharray:4 3"/>`; };
      $('#wtv-a').innerHTML = chart({ x: [lo, hi], y: [0, pk * 1.1], noY: true, h: 170, xlab: '測量值' }, (X, Y) => curve(X, Y, 100, 'var(--c1)') + curve(X, Y, 100 + d, 'var(--c2)'));
      const R = Math.max(4.5, Math.abs(t) + 1), top = tpdf(0, df), at = Math.abs(t);
      $('#wtv-b').innerHTML = chart({ x: [-R, R], y: [0, top * 1.25], noY: true, h: 170, xlab: 't 值' }, (X, Y) => {
        const area = (a, b) => { let q = `M${X(a)} ${Y(0)}`; for (let i = 0; i <= 60; i++) { const x = a + (b - a) * i / 60; q += `L${X(x).toFixed(1)} ${Y(tpdf(x, df)).toFixed(1)}`; } return q + `L${X(b)} ${Y(0)}Z`; };
        let c = ''; for (let i = 0; i <= 160; i++) { const x = -R + 2 * R * i / 160; c += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(tpdf(x, df)).toFixed(1)}`; }
        return `<path d="${area(at, R)}" style="fill:var(--c2);fill-opacity:.5"/><path d="${area(-R, -at)}" style="fill:var(--c2);fill-opacity:.5"/><path d="${c}" style="fill:none;stroke:var(--ink);stroke-width:1.8"/><line x1="${X(t)}" x2="${X(t)}" y1="${Y(0)}" y2="${Y(top * 1.08)}" style="stroke:var(--c2);stroke-width:2.5"/><text x="${X(t)}" y="${Y(top * 1.08) - 5}" text-anchor="middle" style="fill:var(--c2)">t = ${F.n(t, 2)}</text>`;
      });
      $('#wtv-k').innerHTML = kvs([['訊號：平均差', d], ['雜訊：標準誤', F.n(se, 2)], ['t = 訊號 ÷ 雜訊', F.n(t, 2)], ['p 值', F.p(p)], ["Cohen's d", F.n(d / s, 2)]]);
    };
    el.addEventListener('input', up); up();
  },
  anovavis(el) {
    const r = rngOf(11), N = normOf(r), z = [0, 1, 2].map(() => std(Array.from({ length: 12 }, () => N())));
    el.innerHTML = `<div class="w-row">${slider('wa-g', '組間差距', 0, 10, 0.5, 4)}${slider('wa-s', '組內標準差', 1, 10, 0.5, 3)}</div><div class="chart-wrap" id="wa-c"></div><p class="w-cap">粗線是各組平均，虛線是全體平均。</p><div class="fbar" id="wa-f"></div><div class="kv" id="wa-k"></div>`;
    const up = () => {
      const gap = sv('wa-g'), s = sv('wa-s'), mu = [30, 30 + gap, 30 + gap / 2], v = z.map((zz, k) => zz.map(x => mu[k] + s * x)), A = S.anova(v), gm = S.mean(v.flat());
      $('#wa-c').innerHTML = chart({ xcats: ['肥料 A', '肥料 B', '肥料 C'], y: [0, 72], h: 260, ylab: '株高（公分）' }, (X, Y, { M, iw }) => `<line x1="${M.l}" x2="${M.l + iw}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + v.map((g, k) => g.map((x, i) => `<circle cx="${X(k) + ((i * 0.618) % 1 - 0.5) * 40}" cy="${Y(x)}" r="3.6" style="fill:${col4(k)};fill-opacity:.6"/>`).join('') + `<line x1="${X(k) - 30}" x2="${X(k) + 30}" y1="${Y(S.mean(g))}" y2="${Y(S.mean(g))}" style="stroke:${col4(k)};stroke-width:3.5"/>`).join(''));
      const mx = Math.max(A.msb, A.msw) || 1;
      $('#wa-f').innerHTML = `<div><span>組間變異</span><i style="width:${100 * A.msb / mx}%;background:var(--c2)"></i><b>${F.n(A.msb, 1)}</b></div><div><span>組內變異</span><i style="width:${100 * A.msw / mx}%;background:var(--muted)"></i><b>${F.n(A.msw, 1)}</b></div>`;
      $('#wa-k').innerHTML = kvs([['F = 組間 ÷ 組內', F.n(A.F, 2)], ['p 值', F.p(A.p)], ['η²', F.n(A.eta2, 2)]]);
    };
    el.addEventListener('input', up); up();
  },
  twobytwo(el) {
    const v = { a: 25, b: 70, c: 45, d: 260 }, cell = k => `<input class="cell" id="w2-${k}" type="number" inputmode="numeric" min="0" value="${v[k]}" aria-label="格 ${k}">`;
    el.innerHTML = `<p class="w-cap">直接修改格子裡的人數（例：吸菸與心血管事件）。</p><div class="tbl-wrap"><table class="st t22"><thead><tr><th></th><th>有事件</th><th>無事件</th></tr></thead><tbody><tr><td>吸菸</td><td>${cell('a')}</td><td>${cell('b')}</td></tr><tr><td>不吸菸</td><td>${cell('c')}</td><td>${cell('d')}</td></tr></tbody></table></div><div id="w2-bars"></div><div class="kv" id="w2-k"></div><p class="callout warn" id="w2-w" hidden></p><div class="w-row"><button class="btn" type="button" id="w2-small">試試小樣本</button><button class="btn ghost" type="button" id="w2-reset">還原</button></div>`;
    const set = o => { Object.assign(v, o); for (const k in v) $('#w2-' + k).value = v[k]; up(); };
    const up = () => {
      for (const k of ['a', 'b', 'c', 'd']) v[k] = Math.max(0, Math.round(+$('#w2-' + k).value || 0));
      const { a, b, c, d } = v; if (a + b === 0 || c + d === 0 || a + c === 0 || b + d === 0) { $('#w2-k').innerHTML = '<p class="w-out">每一列、每一欄至少要有 1 人。</p>'; return; }
      const r1 = a / (a + b), r0 = c / (c + d), t = S.chisq([[a, b], [c, d]]), fp = S.fisher(a, b, c, d);
      const bar = (l, r, col) => `<div class="rbar"><span>${l}</span><div><i style="width:${100 * r}%;background:${col}"></i></div><b>${F.n(100 * r, 1)}%</b></div>`;
      $('#w2-bars').innerHTML = `<p class="w-cap">各組發生事件的比例（風險）</p>${bar('吸菸', r1, 'var(--c2)')}${bar('不吸菸', r0, 'var(--c1)')}`;
      $('#w2-k').innerHTML = kvs([['風險比 RR', F.n(r1 / r0, 2)], ['勝算比 OR', F.n((a * d) / (b * c), 2)], ['卡方 p', F.p(t.p)], ['Fisher p', F.p(fp)]]);
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
      $('#wc2-c').innerHTML = chart({ x: [-4, 4], y: [lo, hi], h: 300, xlab: 'X', ylab: 'Y', xgrid: true }, (X, Y) => x.map((v, i) => `<circle cx="${X(v)}" cy="${Y(y[i])}" r="${i >= n ? 7 : 4}" style="fill:${i >= n ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.65"/>`).join('') + `<line x1="${X(-4)}" x2="${X(4)}" y1="${Y(yl(P.intercept - 4 * P.slope))}" y2="${Y(yl(P.intercept + 4 * P.slope))}" style="stroke:var(--c2);stroke-width:2"/>`);
      $('#wc2-k').innerHTML = kvs([['Pearson r', F.n(P.r, 2)], ['Spearman ρ', F.n(R.rho, 2)], ['r²', F.n(P.r * P.r, 2)], ['p 值', F.p(P.p)]]);
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
      $('#wf-c').innerHTML = chart({ x: [a0, a1], y: [s0, s1], h: 300, xlab: '年齡', ylab: '收縮壓', xgrid: true }, (X, Y, { M, iw }) => pts.map(p => `<circle cx="${X(p.age)}" cy="${Y(p.sbp)}" r="3.6" style="fill:${p.d ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.6"/>`).join('') + (mode ? [0, 1].map(d => `<line x1="${X(a0)}" x2="${X(a1)}" y1="${Y(fit.b[0] + fit.b[1] * a0 + fit.b[2] * d)}" y2="${Y(fit.b[0] + fit.b[1] * a1 + fit.b[2] * d)}" style="stroke:${d ? 'var(--c2)' : 'var(--c1)'};stroke-width:2.5"/>`).join('') : [[m0, 'var(--c1)'], [m1, 'var(--c2)']].map(([m, c]) => `<line x1="${M.l}" x2="${M.l + iw}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:${c};stroke-width:2.5;stroke-dasharray:7 4"/>`).join('')));
      $('#wf-k').innerHTML = kvs([['未校正的差異', F.n(m1 - m0, 1)], ['校正年齡後', F.n(fit.b[2], 1)], ['真實藥效', '−10.0']]);
      $('#wf-t').textContent = mode ? '兩條平行線之間的垂直距離，就是「同樣年齡」時兩組的差。校正後的估計接近真實效果。' : `虛線是兩組的平均收縮壓。藥物組年紀較大，年齡帶來的高血壓抵銷了藥效${gap >= 10 ? '，藥物甚至看起來無效' : ''}。`;
    };
    segBind(el, '#wf-m', b => { mode = +b.dataset.m; up(); }); el.addEventListener('input', up); up();
  },
  logit(el) {
    const ds = getDS('cvd_cohort'), ag = colOf(ds, 'age').values, ev = colOf(ds, 'cvd_10y').values, fit = S.logistic(ag.map(a => [1, a]), ev);
    el.innerHTML = `<p class="w-cap">點是 400 位世代研究參與者：上排 = 10 年內發生心血管事件，下排 = 沒有。調整 β 讓曲線貼合資料，對數概似越大代表越貼合。</p><div class="w-row">${slider('wg-0', '截距 β₀', -12, 0, 0.1, -6)}${slider('wg-1', '斜率 β₁（每歲）', -0.05, 0.2, 0.005, 0.08)}${slider('wg-x', '看某個年齡', 35, 79, 1, 60)}</div><div class="chart-wrap" id="wg-c"></div><div class="kv" id="wg-k"></div><div class="w-row"><button type="button" class="btn" id="wg-best">最佳擬合</button></div>`;
    const up = () => {
      const b0 = sv('wg-0', v => v.toFixed(1)), b1 = sv('wg-1', v => v.toFixed(3)), x = sv('wg-x'), p = a => 1 / (1 + Math.exp(-(b0 + b1 * a))), px = p(x);
      $('#wg-c').innerHTML = chart({ x: [35, 80], y: [0, 1], h: 280, xlab: '年齡', ylab: '事件機率', xgrid: true }, (X, Y) => ag.map((a, i) => `<circle cx="${X(a + ((i * 0.618) % 1 - 0.5) * 0.8).toFixed(1)}" cy="${(Y(ev[i] ? 0.96 : 0.04) + ((i * 0.382) % 1 - 0.5) * 12).toFixed(1)}" r="2.5" style="fill:${ev[i] ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.35"/>`).join('') + `<path d="${Array.from({ length: 91 }, (_, i) => 35 + i * 0.5).map((a, i) => `${i ? 'L' : 'M'}${X(a).toFixed(1)} ${Y(p(a)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/><line x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(px)}" style="stroke:var(--c4);stroke-dasharray:4 3"/><circle cx="${X(x)}" cy="${Y(px)}" r="6" style="fill:var(--c4)"/>`);
      const ll = S.sum(ev.map((e, i) => Math.log(Math.max(1e-12, e ? p(ag[i]) : 1 - p(ag[i])))));
      $('#wg-k').innerHTML = kvs([[`${x} 歲的機率 p`, F.n(px, 3)], ['勝算 p ÷ (1 − p)', F.n(px / (1 - px), 3)], ['OR（每多 1 歲）', F.n(Math.exp(b1), 3)], ['OR（每多 10 歲）', F.n(Math.exp(10 * b1), 2)], ['對數概似', F.n(ll, 1)]]);
    };
    $('#wg-best', el).onclick = () => { $('#wg-0').value = fit.b[0].toFixed(1); $('#wg-1').value = (Math.round(fit.b[1] / 0.005) * 0.005).toFixed(3); up(); };
    el.addEventListener('input', up); up();
  },
  kmbuild(el) {
    const T = [3, 5, 7, 8, 11, 12, 15, 18, 20, 24], st = [1, 1, 0, 1, 1, 0, 1, 0, 1, 0];
    el.innerHTML = `<p class="w-cap">每條線是一位病人的追蹤時間。<b>點一下病人那一列</b>切換結局：紅點 = 死亡（事件），藍色 ＋ = 設限（失聯或研究結束時仍存活）。</p><div class="chart-wrap" id="wk-a"></div><div class="chart-wrap" id="wk-b"></div>${legend([['var(--c1)', 'Kaplan–Meier（正確）'], ['var(--c2)', '直接刪除設限者（錯誤）']])}<div class="kv" id="wk-k"></div>`;
    const up = () => {
      $('#wk-a').innerHTML = chart({ ycats: T.map((_, i) => `病人 ${i + 1}`), x: [0, 25], h: 320, xlab: '月', m: { l: 62 }, xgrid: true }, (X, Y, { M, iw, ih }) => T.map((t, i) => `<g class="tap" data-i="${i}" role="button" tabindex="0" aria-label="病人 ${i + 1}，${st[i] ? '死亡' : '設限'}，點一下切換"><rect x="${M.l}" y="${Y(i) - ih / 20}" width="${iw}" height="${ih / 10}" style="fill:transparent"/><line x1="${X(0)}" x2="${X(t)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--muted);stroke-width:3"/>${st[i] ? `<circle cx="${X(t)}" cy="${Y(i)}" r="8" style="fill:var(--c2)"/>` : `<path d="M${X(t) - 8} ${Y(i)}h16M${X(t)} ${Y(i) - 8}v16" style="stroke:var(--c1);stroke-width:3.5"/>`}</g>`).join(''));
      const k = S.km(T, st), ev = T.filter((_, i) => st[i]), nv = ev.length ? S.km(ev, ev.map(() => 1)) : null;
      $('#wk-b').innerHTML = chart({ x: [0, 25], y: [0, 1], h: 240, xlab: '月', ylab: '存活機率', xgrid: true }, (X, Y) => (nv ? kmPath(X, Y, nv, 'var(--c2)', true) : '') + kmPath(X, Y, k, 'var(--c1)') + k.cens.map(c => `<line x1="${X(c.t)}" x2="${X(c.t)}" y1="${Y(c.S) - 6}" y2="${Y(c.S) + 6}" style="stroke:var(--c1);stroke-width:2"/>`).join(''));
      $('#wk-k').innerHTML = kvs([['事件', ev.length], ['設限', 10 - ev.length], ['KM 中位存活', Number.isFinite(k.median) ? k.median + ' 月' : '未達到'], ['刪除設限者的中位數', nv && Number.isFinite(nv.median) ? nv.median + ' 月' : '—']]);
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
      $('#wm-c').innerHTML = chart({ x: [0, K], y: [0, yM], h: 280, xlab: `p 值由小到大排名（前 ${K} 名，共 ${m} 個）`, ylab: 'p 值' }, (X, Y, { M, iw }) => `<line x1="${M.l}" x2="${M.l + iw}" y1="${Y(0.05)}" y2="${Y(0.05)}" style="stroke:var(--c4);stroke-width:1.5"/><line x1="${X(0)}" x2="${X(xe)}" y1="${Y(0)}" y2="${Y(0.05 * xe / m)}" style="stroke:var(--c2);stroke-width:2"/><line x1="${M.l}" x2="${M.l + iw}" y1="${Y(0.05 / m)}" y2="${Y(0.05 / m)}" style="stroke:var(--c3);stroke-width:1.5;stroke-dasharray:5 3"/>` + shown.map((x, i) => `<circle cx="${X(i + 1).toFixed(1)}" cy="${Y(x.p).toFixed(1)}" r="3.2" style="fill:${x.t ? 'var(--c1)' : 'var(--muted)'}"/>`).join(''));
      const row = (nm, f) => { const s = tests.filter(f), tp = s.filter(x => x.t).length; return `<tr><td>${nm}</td><td>${s.length}</td><td class="good">${tp}</td><td class="bad">${s.length - tp}</td><td>${s.length ? F.n(100 * (s.length - tp) / s.length, 0) + '%' : '—'}</td></tr>`; };
      $('#wm-t').innerHTML = `<div class="tbl-wrap"><table class="st"><thead><tr><th>方法</th><th>判定顯著</th><th>真的有差</th><th>偽陽性</th><th>偽發現比例</th></tr></thead><tbody>${row('未校正 p < 0.05', x => x.p < 0.05)}${row('BH q < 0.05', x => x.q < 0.05)}${row('Bonferroni', x => x.p < 0.05 / m)}</tbody></table></div><p class="w-cap">真的有差的基因共 ${nT} 個。BH 控制的是最後一欄「偽發現比例」，讓它平均不超過 5%。</p>`;
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

const WMAP = { 'c0-1': ['rate', '100 人中有幾人'], 'c0-2': ['sigma', '動手算 Σ'], 'c0-3': ['log', '倍數與對數尺度'], 'c1-1': ['types', '變數分類挑戰'], 'c1-3': ['spread', '同樣的平均，不同的分散'], 'c1-5': ['table1w', '動手排一份 Table 1'], 'c3-1': ['tvis', '訊號與雜訊'], 'c3-2': ['anovavis', '組間 vs 組內變異'], 'c3-3': ['twobytwo', '自己填 2×2 表'], 'c3-4': ['corrvis', '相關係數的陷阱'], 'c3-5': ['chooser', '選擇統計方法'], 'c4-1': ['confound', '校正干擾因子'], 'c4-2': ['logit', '用 S 形曲線擬合資料'], 'c4-3': ['kmbuild', '自己畫存活曲線'], 'c4-4': ['mtest', '大量檢定的陷阱'], 'c4-6': ['pseudo', '偽重複模擬'], 'c5-1': ['dag', '因果圖與干擾'], 'c5-2': ['phack', 'p-hacking 模擬器'], 'c5-3': ['figgood', '同一份資料，四種圖'], 'c5-4': ['checklist', '投稿前檢查表'], 'c5-5': ['tracks', '你的下一步路線圖'] };
for (const [id, [w, t]] of Object.entries(WMAP)) { const c = CH.find(x => x.id === id); c.widget = w; c.wtitle = t; }
