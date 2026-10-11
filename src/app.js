/* ---------- 互動元件 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnorm = () => { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); };
const slider = (id, label, min, max, step, val, unit = '') => `<label class="fld sl"><span>${label}<output id="${id}-o">${val}${unit}</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;

const W = {
  log(el) {
    el.innerHTML = `<div class="w-cols"><div class="w-stack"><label class="fld"><span>數值 x</span><input id="wl-x" type="number" value="8" step="any"></label><p class="w-out" id="wl-o"></p></div>
<div class="w-stack"><div class="w-row"><label class="fld"><span>處理組表現量</span><input id="wl-a" type="number" value="50" step="any"></label><label class="fld"><span>對照組表現量</span><input id="wl-b" type="number" value="200" step="any"></label></div><p class="w-out" id="wl-f"></p></div></div>`;
    const up = () => {
      const x = +$('#wl-x').value; $('#wl-o').innerHTML = x > 0 ? `log<sub>2</sub>(x) = <b>${F.n(Math.log2(x), 3)}</b><br>log<sub>10</sub>(x) = <b>${F.n(Math.log10(x), 3)}</b><br>ln(x) = <b>${F.n(Math.log(x), 3)}</b>` : '對數只對正數有定義。';
      const a = +$('#wl-a').value, b = +$('#wl-b').value;
      $('#wl-f').innerHTML = a > 0 && b > 0 ? `倍數變化 FC = ${F.n(a / b, 3)}<br>log<sub>2</sub>FC = <b>${F.n(Math.log2(a / b), 2)}</b>　（${a === b ? '沒有變化' : `${a > b ? '上升' : '下降'}了 ${F.n(Math.abs(Math.log2(a / b)), 2)} 次「倍增」`}）` : '請輸入正數。';
    };
    el.addEventListener('input', up); up();
  },
  line(el) {
    const r = rngOf(8), N = normOf(r), xs = Array.from({ length: 12 }, (_, i) => i + 1), ys = xs.map(x => +(1.8 + 0.85 * x + N(0, 1.1)).toFixed(2)), fit = S.pearson(xs, ys);
    el.innerHTML = `<p class="w-cap">情境：藥物劑量 x（mg）與血中濃度 y（μg/mL），12 位受試者。</p><div class="w-row">${slider('wn-a', '截距 a', -4, 8, 0.1, 0)}${slider('wn-b', '斜率 b', -0.5, 2, 0.05, 0.3)}</div><div class="chart-wrap" id="wn-c"></div><div class="w-row w-end"><p class="w-out" id="wn-o"></p><button class="btn" id="wn-best" type="button">最佳直線</button></div>`;
    const up = () => {
      const a = +$('#wn-a').value, b = +$('#wn-b').value; $('#wn-a-o').textContent = a.toFixed(1); $('#wn-b-o').textContent = b.toFixed(2);
      const ssr = S.sum(xs.map((x, i) => (ys[i] - a - b * x) ** 2)), best = S.sum(xs.map((x, i) => (ys[i] - fit.intercept - fit.slope * x) ** 2));
      $('#wn-c').innerHTML = chart({ x: [0, 13], y: [0, 14], xlab: '劑量 x', ylab: '濃度 y', h: 300 }, (X, Y) => xs.map((x, i) => `<line x1="${X(x)}" x2="${X(x)}" y1="${Y(ys[i])}" y2="${Y(Math.max(-1, Math.min(15, a + b * x)))}" style="stroke:var(--c2);stroke-width:1.5;stroke-opacity:.7"/>`).join('') + `<line x1="${X(0)}" x2="${X(13)}" y1="${Y(a)}" y2="${Y(a + 13 * b)}" style="stroke:var(--c1);stroke-width:2.5"/>` + xs.map((x, i) => `<circle cx="${X(x)}" cy="${Y(ys[i])}" r="4.5" style="fill:var(--ink)"/>`).join(''));
      $('#wn-o').innerHTML = `y = ${a.toFixed(1)} + ${b.toFixed(2)}x　　殘差平方和 = <b>${ssr.toFixed(1)}</b>　（最小可達 ${best.toFixed(1)}）`;
    };
    el.addEventListener('input', up);
    $('#wn-best').onclick = () => { $('#wn-a').value = fit.intercept.toFixed(1); $('#wn-b').value = (Math.round(fit.slope / 0.05) * 0.05).toFixed(2); up(); $('#wn-o').innerHTML += `<br>最小平方解：a = ${F.n(fit.intercept, 2)}，b = ${F.n(fit.slope, 3)}`; };
    up();
  },
  mm(el) {
    el.innerHTML = `<label class="fld"><span>輸入數字（以逗號或空白分隔）</span><input id="wm-in" type="text" value="3, 4, 4, 5, 34"></label><div class="chart-wrap" id="wm-c"></div><div class="kv" id="wm-o"></div>`;
    const up = () => {
      const v = $('#wm-in').value.split(/[\s,，、;；]+/).map(Number).filter(x => x !== '' && Number.isFinite(x));
      if (v.length < 2) { $('#wm-o').innerHTML = '<p class="w-out">至少輸入 2 個數字。</p>'; $('#wm-c').innerHTML = ''; return; }
      const m = S.mean(v), md = S.median(v), s = S.sd(v), q1 = S.quantile(v, 0.25), q3 = S.quantile(v, 0.75), [lo, hi] = S.minmax(v);
      $('#wm-o').innerHTML = [['n', v.length], ['平均數', F.n(m)], ['中位數', F.n(md)], ['標準差 SD', F.n(s)], ['Q1 – Q3', `${F.n(q1)} – ${F.n(q3)}`], ['IQR', F.n(q3 - q1)]].map(([k, x]) => `<div><span>${k}</span><b>${x}</b></div>`).join('');
      const cnt = {};
      $('#wm-c').innerHTML = chart({ x: [lo, hi], y: [0, 1], noY: true, h: 150, m: { t: 30 } }, (X, Y) => v.map(x => { const k = (cnt[x] = (cnt[x] || 0) + 1); return `<circle cx="${X(x)}" cy="${Y(0) - 8 - (k - 1) * 13}" r="5.5" style="fill:var(--c1);fill-opacity:.75"/>`; }).join('')
        + `<line x1="${X(m)}" x2="${X(m)}" y1="${Y(1) - 18}" y2="${Y(0)}" style="stroke:var(--c2);stroke-width:2"/><text class="mk" x="${X(m)}" y="${Y(1) - 22}" text-anchor="middle" style="fill:var(--c2)">平均 ${F.n(m)}</text>`
        + `<line x1="${X(md)}" x2="${X(md)}" y1="${Y(1) + 2}" y2="${Y(0)}" style="stroke:var(--c3);stroke-width:2;stroke-dasharray:5 3"/><text class="mk" x="${X(md)}" y="${Y(1) - 2}" text-anchor="middle" style="fill:var(--c3)">中位數 ${F.n(md)}</text>`);
    };
    el.addEventListener('input', up); up();
  },
  normal(el) {
    el.innerHTML = `<div class="w-row">${slider('wz-m', '平均 μ', 80, 160, 1, 120)}${slider('wz-s', '標準差 σ', 5, 30, 1, 15)}${slider('wz-x', '觀察值 x', 60, 200, 1, 150)}</div><div class="chart-wrap" id="wz-c"></div><div class="kv" id="wz-o"></div>`;
    const up = () => {
      const m = +$('#wz-m').value, s = +$('#wz-s').value, x = +$('#wz-x').value; ['m', 's', 'x'].forEach(k => { $(`#wz-${k}-o`).textContent = $(`#wz-${k}`).value; });
      const z = (x - m) / s, P = S.pnorm(z), lo = m - 4 * s, hi = m + 4 * s, pdf = t => Math.exp(-0.5 * ((t - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)), pk = pdf(m);
      $('#wz-c').innerHTML = chart({ x: [lo, hi], y: [0, pk * 1.08], noY: true, h: 230, xlab: '測量值' }, (X, Y) => {
        const pts = Array.from({ length: 161 }, (_, i) => lo + (hi - lo) * i / 160), xc = Math.max(lo, Math.min(hi, x));
        const area = pts.filter(t => t <= xc); let d = `M${X(lo)} ${Y(0)}`; area.forEach(t => { d += `L${X(t).toFixed(1)} ${Y(pdf(t)).toFixed(1)}`; }); d += `L${X(xc)} ${Y(pdf(xc))}L${X(xc)} ${Y(0)}Z`;
        let c = `M${X(lo)} ${Y(pdf(lo))}`; pts.forEach(t => { c += `L${X(t).toFixed(1)} ${Y(pdf(t)).toFixed(1)}`; });
        return `<path d="${d}" style="fill:var(--c1);fill-opacity:.22"/><path d="${c}" style="fill:none;stroke:var(--c1);stroke-width:2"/>` + [-2, -1, 1, 2].map(k => `<line x1="${X(m + k * s)}" x2="${X(m + k * s)}" y1="${Y(0)}" y2="${Y(pdf(m + k * s))}" style="stroke:var(--muted);stroke-dasharray:3 3"/>`).join('') + `<line x1="${X(xc)}" x2="${X(xc)}" y1="${Y(0)}" y2="${Y(pk * 1.05)}" style="stroke:var(--c2);stroke-width:2"/>`;
      });
      $('#wz-o').innerHTML = [['z 分數', F.n(z, 2)], ['P(X ≤ x)', F.n(100 * P, 1) + '%'], ['P(X > x)', F.n(100 * (1 - P), 1) + '%'], ['百分位', '第 ' + F.n(100 * P, 1)]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    };
    el.addEventListener('input', up); up();
  },
  diag(el) {
    el.innerHTML = `<div class="w-row">${slider('wd-se', '敏感度', 50, 100, 0.5, 90, '%')}${slider('wd-sp', '特異度', 50, 100, 0.5, 95, '%')}${slider('wd-pr', '盛行率', 0.1, 50, 0.1, 1, '%')}</div><div class="w-cols"><div class="tbl-wrap" id="wd-t"></div><div class="big-stat" id="wd-o"></div></div><div id="wd-bar"></div>`;
    const up = () => {
      const se = +$('#wd-se').value / 100, sp = +$('#wd-sp').value / 100, pr = +$('#wd-pr').value / 100; $('#wd-se-o').textContent = $('#wd-se').value + '%'; $('#wd-sp-o').textContent = $('#wd-sp').value + '%'; $('#wd-pr-o').textContent = $('#wd-pr').value + '%';
      const N = 10000, D = N * pr, TP = D * se, FN = D - TP, H = N - D, TN = H * sp, FP = H - TN, ppv = TP / (TP + FP), npv = TN / (TN + FN), r = v => Math.round(v).toLocaleString();
      $('#wd-t').innerHTML = `<table class="st"><thead><tr><th>10,000 人</th><th>有病 ${r(D)}</th><th>沒病 ${r(H)}</th></tr></thead><tbody><tr><td>陽性</td><td class="good">${r(TP)}</td><td class="bad">${r(FP)}</td></tr><tr><td>陰性</td><td class="bad">${r(FN)}</td><td class="good">${r(TN)}</td></tr></tbody></table>`;
      $('#wd-o').innerHTML = `<div><span>陽性預測值 PPV</span><b>${F.n(100 * ppv, 1)}%</b><small>陽性的人中真正有病</small></div><div><span>陰性預測值 NPV</span><b>${F.n(100 * npv, 2)}%</b><small>陰性的人中真正沒病</small></div>`;
      const tot = TP + FP; $('#wd-bar').innerHTML = `<p class="w-cap">檢驗陽性的 ${r(tot)} 人組成</p><div class="hbar"><i style="width:${100 * TP / tot}%;background:var(--c3)"></i><i style="width:${100 * FP / tot}%;background:var(--c2)"></i></div>${legend([['var(--c3)', `真陽性 ${r(TP)}`], ['var(--c2)', `偽陽性 ${r(FP)}`]])}`;
    };
    el.addEventListener('input', up); up();
  },
  clt(el) {
    el.innerHTML = `<div class="w-row"><label class="fld"><span>母體形狀</span><select id="wc-p"><option value="exp">右偏（像住院天數）</option><option value="unif">均勻</option><option value="bi">雙峰</option></select></label>${slider('wc-n', '每次抽樣人數 n', 1, 50, 1, 2)}<button class="btn" id="wc-go" type="button">重新抽樣 2,000 次</button></div><div class="w-cols"><figure class="fig"><figcaption>母體（原始資料）</figcaption><div class="chart-wrap" id="wc-a"></div></figure><figure class="fig"><figcaption>2,000 個樣本平均數</figcaption><div class="chart-wrap" id="wc-b"></div></figure></div><div class="kv" id="wc-o"></div>`;
    const P = { exp: { f: () => -5 * Math.log(1 - Math.random()), mu: 5, sd: 5, lo: 0, hi: 25 }, unif: { f: () => Math.random() * 10, mu: 5, sd: 10 / Math.sqrt(12), lo: 0, hi: 10 }, bi: { f: () => (Math.random() < 0.5 ? 2 : 8) + rnorm(), mu: 5, sd: Math.sqrt(10), lo: -1, hi: 11 } };
    const up = () => {
      const p = P[$('#wc-p').value], n = +$('#wc-n').value; $('#wc-n-o').textContent = n;
      const pop = Array.from({ length: 5000 }, p.f), means = Array.from({ length: 2000 }, () => { let s = 0; for (let i = 0; i < n; i++) s += p.f(); return s / n; });
      $('#wc-a').innerHTML = histChart(pop.filter(v => v >= p.lo && v <= p.hi), { lo: p.lo, hi: p.hi, bins: 30, h: 200, color: () => 'var(--muted)', noY: true });
      $('#wc-b').innerHTML = histChart(means.filter(v => v >= p.lo && v <= p.hi), { lo: p.lo, hi: p.hi, bins: 40, h: 200, noY: true });
      $('#wc-o').innerHTML = [['樣本平均數的平均', F.n(S.mean(means), 2) + `（μ = ${p.mu}）`], ['平均數的標準差（模擬）', F.n(S.sd(means), 3)], ['理論標準誤 σ ÷ √n', F.n(p.sd / Math.sqrt(n), 3)]].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    };
    $('#wc-p').onchange = up; $('#wc-n').oninput = up; $('#wc-go').onclick = up; up();
  },
  ci(el) {
    el.innerHTML = `<div class="w-row">${slider('wi-n', '樣本數 n', 5, 100, 1, 20)}<label class="fld"><span>信賴水準</span><select id="wi-c"><option value="0.90">90%</option><option value="0.95" selected>95%</option><option value="0.99">99%</option></select></label><button class="btn" id="wi-go" type="button">再做 50 次研究</button></div><p class="w-out" id="wi-o"></p><div class="chart-wrap" id="wi-ch"></div>`;
    const up = () => {
      const n = +$('#wi-n').value, cl = +$('#wi-c').value; $('#wi-n-o').textContent = n; const tc = S.qt(1 - (1 - cl) / 2, n - 1);
      const iv = Array.from({ length: 50 }, () => { const x = Array.from({ length: n }, () => 100 + 15 * rnorm()), m = S.mean(x), h = tc * S.sd(x) / Math.sqrt(n); return [m - h, m + h, m]; });
      const hit = iv.filter(([a, b]) => a <= 100 && b >= 100).length, lo = Math.min(...iv.map(v => v[0])), hi = Math.max(...iv.map(v => v[1]));
      $('#wi-o').innerHTML = `母體真值 μ = 100、σ = 15。50 個 ${Math.round(cl * 100)}% 信賴區間中，有 <b>${hit}</b> 個涵蓋 μ（${(hit * 2)}%）。紅色是沒涵蓋到的。`;
      $('#wi-ch').innerHTML = chart({ x: [Math.min(lo, 85), Math.max(hi, 115)], y: [0, 51], noY: true, h: 380, xlab: '測量值', xgrid: true }, (X, Y) => `<line x1="${X(100)}" x2="${X(100)}" y1="${Y(51)}" y2="${Y(0)}" style="stroke:var(--ink);stroke-width:1.5"/>` + iv.map(([a, b, m], i) => { const ok = a <= 100 && b >= 100, c = ok ? 'var(--c1)' : 'var(--c2)'; return `<line x1="${X(a)}" x2="${X(b)}" y1="${Y(i + 1)}" y2="${Y(i + 1)}" style="stroke:${c};stroke-width:${ok ? 2 : 3}"/><circle cx="${X(m)}" cy="${Y(i + 1)}" r="2.5" style="fill:${c}"/>`; }).join(''));
    };
    $('#wi-n').oninput = up; $('#wi-c').onchange = up; $('#wi-go').onclick = up; up();
  },
  pdist(el) {
    el.innerHTML = `<div class="w-row">${slider('wp-d', "真實效果量 Cohen's d", 0, 1.2, 0.1, 0)}${slider('wp-n', '每組樣本數', 5, 100, 1, 20)}<button class="btn" id="wp-go" type="button">再跑 1,000 次</button></div><p class="w-out" id="wp-o"></p><div class="chart-wrap" id="wp-c"></div>`;
    const up = () => {
      const d = +$('#wp-d').value, n = +$('#wp-n').value; $('#wp-d-o').textContent = d.toFixed(1); $('#wp-n-o').textContent = n;
      const ps = Array.from({ length: 1000 }, () => S.welch(Array.from({ length: n }, rnorm), Array.from({ length: n }, () => d + rnorm())).p), sig = ps.filter(p => p < 0.05).length / 10;
      $('#wp-o').innerHTML = d === 0 ? `虛無假設為真（兩組其實沒差）。p &lt; 0.05 的比例：<b>${sig.toFixed(1)}%</b>，理論上是 5%。這些全都是偽陽性。` : `兩組真的有差（d = ${d.toFixed(1)}）。p &lt; 0.05 的比例：<b>${sig.toFixed(1)}%</b>，這就是檢定力（理論值約 ${F.n(100 * S.powerMeans(d, n, 0.05), 0)}%）。`;
      $('#wp-c').innerHTML = histChart(ps, { lo: 0, hi: 1, bins: 20, h: 240, xlab: 'p 值', ylab: '實驗次數', color: i => (i === 0 ? 'var(--c2)' : 'var(--c1)') });
    };
    $('#wp-d').oninput = up; $('#wp-n').oninput = up; $('#wp-go').onclick = up; up();
  },
  power(el) {
    el.innerHTML = `<div class="seg" role="tablist" id="ww-mode"><button type="button" data-m="m" aria-selected="true">比較兩組平均</button><button type="button" data-m="p" aria-selected="false">比較兩組比例</button></div>
<div class="w-row" id="ww-mean"><label class="fld"><span>想偵測的最小差異 Δ</span><input id="ww-delta" type="number" value="5" step="any"></label><label class="fld"><span>標準差 SD</span><input id="ww-sd" type="number" value="10" step="any" min="0"></label></div>
<div class="w-row" id="ww-prop" hidden><label class="fld"><span>對照組比例 p₁</span><input id="ww-p1" type="number" value="0.30" step="0.01" min="0.01" max="0.99"></label><label class="fld"><span>處理組比例 p₂</span><input id="ww-p2" type="number" value="0.20" step="0.01" min="0.01" max="0.99"></label></div>
<div class="w-row"><label class="fld"><span>α（雙尾）</span><select id="ww-a"><option>0.05</option><option>0.01</option><option>0.1</option></select></label><label class="fld"><span>檢定力</span><select id="ww-pw"><option>0.8</option><option>0.9</option><option>0.95</option></select></label><label class="fld"><span>預期流失率（%）</span><input id="ww-drop" type="number" value="10" min="0" max="80" step="1"></label></div>
<div class="kv" id="ww-o"></div><div class="chart-wrap" id="ww-c"></div><p class="w-out" id="ww-txt"></p>`;
    let mode = 'm';
    $$('#ww-mode button').forEach(b => { b.onclick = () => { mode = b.dataset.m; $$('#ww-mode button').forEach(x => x.setAttribute('aria-selected', x === b)); $('#ww-mean').hidden = mode !== 'm'; $('#ww-prop').hidden = mode !== 'p'; up(); }; });
    const up = () => {
      const a = +$('#ww-a').value, pw = +$('#ww-pw').value, drop = Math.min(80, Math.max(0, +$('#ww-drop').value || 0)) / 100;
      let n, pf, txt;
      if (mode === 'm') {
        const dl = +$('#ww-delta').value, sd = +$('#ww-sd').value; if (!(dl !== 0 && sd > 0)) { $('#ww-o').innerHTML = '<p class="w-out">請輸入非零的差異與正的標準差。</p>'; return; }
        const d = Math.abs(dl / sd); n = S.nMeans(d, a, pw); pf = k => S.powerMeans(d, k, a);
        txt = `以雙尾 α = ${a}、檢定力 ${pw * 100}% 偵測兩組平均差 ${Math.abs(dl)}（標準差 ${sd}，效果量 d = ${F.n(d, 2)}），每組需 ${n} 位受試者；考量 ${Math.round(drop * 100)}% 流失率，每組預計收納 ${Math.ceil(n / (1 - drop))} 位，共 ${2 * Math.ceil(n / (1 - drop))} 位。`;
      } else {
        const p1 = +$('#ww-p1').value, p2 = +$('#ww-p2').value; if (!(p1 > 0 && p1 < 1 && p2 > 0 && p2 < 1 && p1 !== p2)) { $('#ww-o').innerHTML = '<p class="w-out">比例需介於 0 與 1 之間，且兩組不同。</p>'; return; }
        n = S.nProps(p1, p2, a, pw); pf = k => S.powerProps(p1, p2, k, a);
        txt = `以雙尾 α = ${a}、檢定力 ${pw * 100}% 偵測事件比例由 ${F.n(100 * p1, 0)}% 變為 ${F.n(100 * p2, 0)}%，每組需 ${n} 位受試者；考量 ${Math.round(drop * 100)}% 流失率，每組預計收納 ${Math.ceil(n / (1 - drop))} 位，共 ${2 * Math.ceil(n / (1 - drop))} 位。`;
      }
      const adj = Math.ceil(n / (1 - drop));
      $('#ww-o').innerHTML = [['每組所需', n], ['考量流失後每組', adj], ['總收案數', 2 * adj]].map(([k, v]) => `<div><span>${k}</span><b>${v.toLocaleString()}</b></div>`).join('');
      const nmax = Math.max(10, Math.ceil(n * 2.2)), pts = Array.from({ length: 81 }, (_, i) => 2 + (nmax - 2) * i / 80);
      $('#ww-c').innerHTML = chart({ x: [0, nmax], y: [0, 1], xlab: '每組樣本數', ylab: '檢定力', h: 260, xgrid: true }, (X, Y, { M, iw }) => `<line x1="${M.l}" x2="${M.l + iw}" y1="${Y(pw)}" y2="${Y(pw)}" style="stroke:var(--c2);stroke-dasharray:5 4"/><line x1="${X(n)}" x2="${X(n)}" y1="${Y(0)}" y2="${Y(pw)}" style="stroke:var(--c2);stroke-dasharray:5 4"/><path d="${pts.map((k, i) => `${i ? 'L' : 'M'}${X(k).toFixed(1)} ${Y(pf(k)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/><circle cx="${X(n)}" cy="${Y(pw)}" r="5" style="fill:var(--c2)"/>`);
      $('#ww-txt').innerHTML = `<span class="lbl">論文寫法</span>${esc(txt)}`;
    };
    el.addEventListener('input', up); el.addEventListener('change', up); up();
  },
};

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
<p class="lede">六個階段、${CH.length} 章。每章有重點說明、可以動手調整的互動圖和小測驗。進階章節直接連到分析實驗室：用內建資料集或你自己的 CSV 實際跑一次分析，並產生可以放進論文的中英文結果段落。</p>
<div class="cta"><button class="btn pri" type="button" data-go="${next ? next.id : 'c0-1'}">${next && next.id !== 'c0-1' ? `繼續：${next.num} ${next.title}` : '從第一章開始'}</button><button class="btn" type="button" data-go="lab">打開分析實驗室</button></div>
<ol class="ladder">${LEVELS.map(L => { const [d, n, first] = prog(L); return `<li><button type="button" data-go="${first}"><span class="glyph">${L.glyph}</span><span class="lv-t"><span class="lv-n">Level ${L.n}</span><b>${L.name}</b><span class="lv-d">${L.desc}</span></span><span class="lv-p mono">${d}/${n}</span></button></li>`; }).join('')}</ol>
<h2>怎麼使用</h2>
<ul class="how"><li><b>沒有程式基礎也可以。</b>所有計算都在瀏覽器裡完成，不需要安裝軟體，也不用寫程式。</li><li><b>照順序讀。</b>每一階都只用到前面學過的東西。已經會的章節可以直接做小測驗確認。</li><li><b>在實驗室動手做。</b>Level 3 開始，每章都有「到實驗室動手做」按鈕，會自動載入對應的資料與設定。</li><li><b>用自己的資料。</b>Excel 存成 CSV 後上傳（UTF-8 或 Big5 編碼都可以），資料不會離開你的電腦。</li></ul>
</div>`;
}
function renderChapter(id) {
  const i = CH.findIndex(c => c.id === id), c = CH[i], L = LEVELS[c.lv], prev = CH[i - 1], next = CH[i + 1];
  const quiz = c.quiz.map((q, qi) => { const ord = q.o.map((_, k) => k).sort(() => Math.random() - 0.5); return `<div class="q" data-q="${qi}"><p class="q-t"><span class="mono">Q${qi + 1}</span>${esc(q.q)}</p>${q.demo && c.widget ? `<button type="button" class="demo-btn" data-demo="${qi}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V5M5 9l5-5 5 5" style="fill:none;stroke:currentColor;stroke-width:2"/></svg>在上方圖表示範這題</button>` : ''}<div class="opts">${ord.map(k => `<button type="button" class="opt" data-k="${k}">${esc(q.o[k])}</button>`).join('')}</div><p class="why" hidden></p></div>`; }).join('');
  $('#article').innerHTML = `<div class="ch-top"><p class="eyebrow">Level ${L.n} · ${L.name} · 第 ${c.num} 章</p><button class="toc-btn" type="button" data-toc>☰ 目錄</button></div><h1>${c.title}</h1>
${c.widget ? `<section class="widget-box"><p class="lbl">動手玩 · ${c.wtitle}</p><div class="demo-note" id="demoNote" hidden></div><div class="widget" id="widget"></div></section>` : ''}
<div class="prose">${c.body}</div>
${c.labs ? `<section class="labs"><p class="lbl">到實驗室用真的資料做</p><div class="lab-btns">${c.labs.map((l, k) => `<button class="btn" type="button" data-lab="${k}">${l.label}<span aria-hidden="true">→</span></button>`).join('')}</div></section>` : ''}
${c.quiz.length ? `<section class="quiz"><h2>小測驗</h2>${quiz}</section>` : ''}
<div class="ch-foot"><button class="btn ${state.done[id] ? 'done' : ''}" type="button" id="doneBtn">${state.done[id] ? '已完成 ✓' : '標記為完成'}</button><nav class="pn">${prev ? `<a href="#${prev.id}"><small>上一章</small>${prev.num} ${prev.title}</a>` : '<span></span>'}${next ? `<a href="#${next.id}" class="nx"><small>下一章</small>${next.num} ${next.title}</a>` : ''}</nav></div>`;
  if (c.widget) fitTo($('#widget'));
  if (c.widget) W[c.widget]($('#widget'));
  $$('[data-lab]').forEach(b => { b.onclick = () => openLab(c.labs[+b.dataset.lab]); });
  $('#doneBtn').onclick = () => { setDone(id, !state.done[id]); const d = !!state.done[id]; $('#doneBtn').textContent = d ? '已完成 ✓' : '標記為完成'; $('#doneBtn').classList.toggle('done', d); };
  bindDemos(c);
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
    const el = eligible(ds, f);
    if (f.multi) {
      const cur = sel[f.k] || [];
      return `<fieldset class="fld multi"><legend>${f.label}</legend><div class="mini-acts"><button type="button" data-all="${f.k}">全選</button><button type="button" data-none="${f.k}">清除</button></div><div class="checks">${el.length ? el.map((n, i) => `<label><input type="checkbox" id="f-${f.k}-${i}" data-k="${f.k}" value="${esc(n)}" ${cur.includes(n) ? 'checked' : ''}><span>${esc(n)}</span>${cur.includes(n) && cur.indexOf(n) === 0 && /主要/.test(f.label) ? '<em>主要</em>' : ''}</label>`).join('') : '<p class="small mut">沒有符合類型的欄位。</p>'}</div></fieldset>`;
    }
    return `<label class="fld"><span>${f.label}</span><select id="f-${f.k}" data-k="${f.k}">${f.opt ? '<option value="">（不選）</option>' : ''}${el.map(n => `<option value="${esc(n)}" ${sel[f.k] === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label>`;
  }).join('');
  $$('#form select').forEach(s => { s.onchange = () => { sel[s.dataset.k] = s.value; }; });
  $$('#form input[type=checkbox]').forEach(cb => { cb.onchange = () => { const a = sel[cb.dataset.k] || (sel[cb.dataset.k] = []); if (cb.checked) { if (!a.includes(cb.value)) a.push(cb.value); } else a.splice(a.indexOf(cb.value), 1); renderForm(); const n = $('#' + cb.id); if (n) n.focus(); }; });
  $$('[data-all]').forEach(b => { b.onclick = () => { const f = spec.fields.find(x => x.k === b.dataset.all); sel[f.k] = eligible(ds, f); renderForm(); }; });
  $$('[data-none]').forEach(b => { b.onclick = () => { sel[b.dataset.none] = []; renderForm(); }; });
}
function runAnalysis(scroll) {
  const ds = getDS(state.dsId), spec = AN[state.an], out = $('#result');
  CW = Math.round(Math.max(300, Math.min(760, out.clientWidth - (innerWidth < 560 ? 34 : 46))));
  let res;
  try { res = spec.run(ds, ensureSel()); }
  catch (e) { out.innerHTML = `<div class="res"><p class="callout err"><b>無法執行：</b>${esc(e.message)}</p></div>`; return; }
  let h = `<div class="res"><header class="res-h"><p class="eyebrow">${spec.name}${spec.nodata ? '' : ' · ' + esc(ds.name)}</p><h2>${res.title}</h2><p class="mono small mut">${res.meta}</p></header>`;
  res.blocks.forEach(b => {
    if (b.table) h += `<div class="tbl-wrap${b.scroll ? ' tall' : ''}"><table class="st"><thead><tr>${b.table.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${b.table.rows.map(r => Array.isArray(r) ? `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>` : `<tr class="${r.cls || ''}">${r.cells.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${b.foot ? `<p class="tfoot">${b.foot}</p>` : ''}`;
    if (b.chart) h += `<figure class="fig"><div class="chart-wrap">${b.chart}</div>${b.legend || ''}${b.cap ? `<figcaption>${b.cap}</figcaption>` : ''}</figure>${b.after || ''}`;
    if (b.html) h += b.html;
  });
  if (res.notes && res.notes.length) h += `<div class="notes">${res.notes.map(n => `<p class="callout ${n.k}">${n.t}</p>`).join('')}</div>`;
  if (res.write) {
    const blk = (lang, w) => `<div class="wr" data-lang="${lang}" ${lang === 'en' ? 'hidden' : ''}>${[['m', lang === 'zh' ? '統計方法' : 'Statistical analysis'], ['r', lang === 'zh' ? '結果' : 'Results']].map(([k, t]) => `<div class="wr-p"><div class="wr-h"><span class="lbl">${t}</span><button type="button" class="copy" data-copy="wr-${lang}-${k}">複製</button></div><p id="wr-${lang}-${k}">${esc(w[k])}</p></div>`).join('')}</div>`;
    h += `<section class="write"><div class="write-h"><h3>論文寫法</h3><div class="seg" role="tablist"><button type="button" data-lang="zh" aria-selected="true">中文</button><button type="button" data-lang="en" aria-selected="false">English</button></div></div>${blk('zh', res.write.zh)}${blk('en', res.write.en)}<p class="small mut">這是初稿：請補上軟體名稱與版本，依期刊格式調整小數位數，並確認變數名稱改成讀者看得懂的文字。</p></section>`;
  }
  out.innerHTML = h + '</div>';
  if (scroll === true && innerWidth < 960) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (res.mount) { fitTo($('#' + res.mount)); W.power($('#' + res.mount)); }
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
