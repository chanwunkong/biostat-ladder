/* ---------- 名詞圖解：每個名詞用共用資料集（STUDY）畫一張小圖，亮起它對應的部分 ---------- */
const TFIG = (() => {
  let P = null;
  const prep = () => {
    if (P) return P;
    const d = STUDY(), I = [...Array(d.n).keys()], nn = a => a.filter(v => v != null);
    const pl = I.filter(i => d.group[i] === 'placebo'), dr = I.filter(i => d.group[i] === 'drug'), h1 = I.filter(i => d.hospital[i] === 'H1');
    P = { d, I, nn, pl, dr, h1 };
    return P;
  };
  const rng = s => rngOf(s), at = (a, ix) => ix.map(i => a[i]);
  // 直方圖：tag(i, 中點) 回傳每根長條的 data-k；extra(X, Y, top) 疊加
  const HB = (vals, lo, hi, bins, o = {}) => {
    const bw = (hi - lo) / bins, c = new Array(bins).fill(0);
    vals.forEach(v => { const k = Math.min(bins - 1, Math.floor((v - lo) / bw)); if (k >= 0 && v <= hi) c[k]++; });
    const top = Math.max(1, ...c) * 1.12;
    return chart({ x: [lo, hi], y: [0, top], h: o.h || 210, xlab: o.xlab, ylab: o.ylab || '人數' }, (X, Y) => c.map((n, i) => { const m = lo + (i + 0.5) * bw; return `<rect data-k="${o.tag ? o.tag(i, m) : 'bar'}" x="${(X(lo + i * bw) + 0.5).toFixed(1)}" y="${Y(n).toFixed(1)}" width="${Math.max(0, X(lo + (i + 1) * bw) - X(lo + i * bw) - 1).toFixed(1)}" height="${(Y(0) - Y(n)).toFixed(1)}" style="fill:${o.color ? o.color(i, m) : 'var(--c1)'}"/>`; }).join('') + (o.extra ? o.extra(X, Y, top, bw) : ''));
  };
  const vline = (X, Y, x, y0, y1, k, c, o = {}) => `<line${o.hlx ? ' class="hlx"' : ''} data-k="${k}" x1="${X(x).toFixed(1)}" x2="${X(x).toFixed(1)}" y1="${Y(y0).toFixed(1)}" y2="${Y(y1).toFixed(1)}" style="stroke:${c};stroke-width:${o.w || 2.5}${o.dash ? ';stroke-dasharray:5 4' : ''}"/>`;
  const hband = (X, Y, a, b, y0, y1, k, c) => `<rect class="hlx" data-k="${k}" x="${X(a).toFixed(1)}" y="${Y(y1).toFixed(1)}" width="${(X(b) - X(a)).toFixed(1)}" height="${(Y(y0) - Y(y1)).toFixed(1)}" style="fill:${c};fill-opacity:.2"/>`;
  const lbl = (x, y, t, k, c = 'var(--ink)', anchor = 'middle', hlx = true) => `<text${hlx ? ' class="hlx"' : ''} data-k="${k}" x="${x.toFixed ? x.toFixed(1) : x}" y="${y.toFixed ? y.toFixed(1) : y}" text-anchor="${anchor}" style="fill:${c};font-size:12px">${t}</text>`;
  const npdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));
  const svgBox = (w, h, body) => `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${body}</svg>`;
  const node = (x, y, t, k, c = 'var(--ink)', wd = 96) => `<g data-k="${k}"><rect x="${x - wd / 2}" y="${y - 17}" width="${wd}" height="34" rx="10" style="fill:var(--surface);stroke:${c};stroke-width:2"/><text x="${x}" y="${y}" dy=".35em" text-anchor="middle" style="fill:var(--ink);font-size:13px">${t}</text></g>`;
  const arrow = (x1, y1, x2, y2, k, c = 'var(--muted)', dash) => `<line data-k="${k}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#tf-ah)" style="stroke:${c};stroke-width:2.2${dash ? ';stroke-dasharray:6 4' : ''}"/>`;
  const AH = '<defs><marker id="tf-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--muted)"/></marker></defs>';
  const tdens = (t, df) => S.tpdf(t, df);
  const welchOf = (ix, col) => { const { d } = prep(), a = ix.filter(i => d.group[i] === 'placebo' && d[col][i] != null).map(i => d[col][i] - d.sbp_0[i]), b = ix.filter(i => d.group[i] === 'drug' && d[col][i] != null).map(i => d[col][i] - d.sbp_0[i]); return { a, b, w: S.welch(a, b) }; };
  const tab2 = (R, C, tab, ylab) => {
    const p = tab.map(r => r[0] / (r[0] + r[1])), n = S.sum(tab.flat()), pool = (tab[0][0] + tab[1][0]) / n, odds = p.map(x => x / (1 - x));
    const ex = tab.map(r => [0, 1].map(j => (r[0] + r[1]) * (tab[0][j] + tab[1][j]) / n)), chi2 = S.sum(tab.flatMap((r, i) => r.map((o, j) => (o - ex[i][j]) ** 2 / ex[i][j])));
    const svg = stackChart(R, C, tab, ylab, (i, j) => (j === 0 ? `r${i} e` : `n${i}`), (X, Y, ctx) => `<line class="hlx" data-k="pool exp" x1="${X(0) - ctx.bw}" x2="${X(1) + ctx.bw}" y1="${Y(100 * pool)}" y2="${Y(100 * pool)}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4"/><line class="hlx" data-k="rd" x1="${(X(0) + X(1)) / 2}" x2="${(X(0) + X(1)) / 2}" y1="${Y(100 * p[0])}" y2="${Y(100 * p[1])}" style="stroke:var(--ink);stroke-width:3"/><line class="hlx" data-k="rd" x1="${X(0) + ctx.bw / 2}" x2="${(X(0) + X(1)) / 2}" y1="${Y(100 * p[0])}" y2="${Y(100 * p[0])}" style="stroke:var(--ink);stroke-dasharray:3 3"/><line class="hlx" data-k="rd" x1="${X(1) - ctx.bw / 2}" x2="${(X(0) + X(1)) / 2}" y1="${Y(100 * p[1])}" y2="${Y(100 * p[1])}" style="stroke:var(--ink);stroke-dasharray:3 3"/>`);
    return { svg, v: { a: tab[1][0], b: tab[1][1], c: tab[0][0], dd: tab[0][1], n0: tab[0][0] + tab[0][1], n1: tab[1][0] + tab[1][1], p0: 100 * p[0], p1: 100 * p[1], rd: 100 * (p[1] - p[0]), rr: p[1] / p[0], or: odds[1] / odds[0], o0: odds[0], o1: odds[1], nnt: Math.abs(1 / (p[1] - p[0])), pool: 100 * pool, ex: ex[1][0], chi2, pchi: F.peq(1 - S.pchisq(chi2, 1)), rel: 100 * (p[1] - p[0]) / p[0] } };
  };

  const FIG = {
    hist() {
      const { d } = prep(), x = d.sbp_0, m = S.mean(x), sd = S.sd(x), md = S.median(x), q1 = S.quantile(x, 0.25), q3 = S.quantile(x, 0.75), p90 = S.quantile(x, 0.9), one = x[5], lo = 105, hi = 195;
      const svg = HB(x, lo, hi, 18, { xlab: '基線收縮壓（mmHg）', extra: (X, Y, top, bw) => {
        const ys = Array.from({ length: 90 }, (_, i) => lo + (hi - lo) * i / 89), sc = x.length * bw;
        return hband(X, Y, m - sd, m + sd, 0, top, 'sd var', 'var(--c2)') + hband(X, Y, q1, q3, 0, top, 'iqr', 'var(--c3)') + hband(X, Y, lo, 160, 0, top, 'cdf', 'var(--c2)')
          + `<path class="hlx" data-k="norm" d="${ys.map((v, i) => `${i ? 'L' : 'M'}${X(v).toFixed(1)} ${Y(npdf(v, m, sd) * sc).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:2.5"/>`
          + vline(X, Y, m, 0, top, 'mean', 'var(--c2)') + vline(X, Y, md, 0, top * 0.9, 'med', 'var(--ink)', { dash: 1, w: 2 })
          + [q1, md, q3].map(q => vline(X, Y, q, 0, top, 'q', 'var(--c3)', { hlx: 1, w: 2 })).join('') + vline(X, Y, p90, 0, top, 'pct', 'var(--c3)', { hlx: 1 }) + vline(X, Y, 140, 0, top, 'ref', 'var(--ink)', { hlx: 1, dash: 1 })
          + `<line class="hlx" data-k="dev z" x1="${X(m)}" x2="${X(one)}" y1="${Y(top * 0.93)}" y2="${Y(top * 0.93)}" style="stroke:var(--c3);stroke-width:3"/><circle class="hlx" data-k="dev z" cx="${X(one)}" cy="${Y(top * 0.93)}" r="6" style="fill:var(--c3)"/>`;
      } });
      return { svg, v: { n: x.length, m, sd, md, q1, q3, iqr: q3 - q1, vr: sd * sd, cv: 100 * sd / m, one, dev: one - m, z: (one - m) / sd, p90, c160: 100 * x.filter(v => v <= 160).length / x.length, sum: S.sum(x) } };
    },
    crp() {
      const { d } = prep(), x = d.crp, m = S.mean(x), md = S.median(x), q95 = S.quantile(x, 0.95), gm = Math.exp(S.mean(x.map(Math.log)));
      const svg = HB(x, 0, 16, 32, { xlab: 'C 反應蛋白 CRP（mg/L）', tag: (i, mid) => (mid > q95 ? 'bar tail' : 'bar'), color: (i, mid) => (mid > q95 ? 'var(--c4)' : 'var(--c1)'), extra: (X, Y, top) => vline(X, Y, m, 0, top, 'mean', 'var(--c2)') + vline(X, Y, md, 0, top, 'med', 'var(--ink)', { dash: 1 }) + vline(X, Y, gm, 0, top, 'gm', 'var(--c3)', { hlx: 1 }) });
      return { svg, v: { m, md, q95, gm, over: x.filter(v => v > 16).length, mx: Math.max(...x) } };
    },
    crplog() {
      const { d } = prep(), x = d.crp.map(Math.log), m = S.mean(x);
      const svg = HB(x, -2.5, 4, 26, { xlab: 'ln(CRP)：取對數後', extra: (X, Y, top) => vline(X, Y, m, 0, top, 'gm', 'var(--c3)') });
      return { svg, v: { lm: m, gm: Math.exp(m), sq: S.mean(prep().d.crp.map(Math.sqrt)) } };
    },
    box() {
      const { d, pl, dr, nn } = prep(), a = nn(at(d.sbp_12, pl)), b = nn(at(d.sbp_12, dr)), w = S.welch(a, b);
      return { svg: boxStrip([{ label: '安慰劑', v: a }, { label: '新藥', v: b }], '第 12 週收縮壓'), v: { m0: S.mean(a), m1: S.mean(b), s0: S.sd(a), s1: S.sd(b), diff: w.diff, t: w.t, df: w.df, p: F.peq(w.p), dd: w.d, lo: w.ci[0], hi: w.ci[1], fr: S.variance(b) / S.variance(a), n0: a.length, n1: b.length } };
    },
    bar() {
      const { d } = prep(), H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], c = H.map(h => d.hospital.filter(x => x === h).length);
      return { svg: chart({ xcats: H, y: [0, 80], h: 200, ylab: '人數', xlab: '醫院（名目變數）' }, (X, Y, ctx) => c.map((n, i) => `<rect data-k="bar${i === 7 ? ' mx' : ''}" x="${X(i) - ctx.iw / 20}" y="${Y(n)}" width="${ctx.iw / 10}" height="${Y(0) - Y(n)}" style="fill:var(--c1)"/>`).join('') + `<line class="hlx" data-k="exp" x1="${X(0) - 20}" x2="${X(7) + 20}" y1="${Y(50)}" y2="${Y(50)}" style="stroke:var(--c2);stroke-width:2.5;stroke-dasharray:6 4"/>` + c.map((n, i) => `<line class="hlx" data-k="dev" x1="${X(i)}" x2="${X(i)}" y1="${Y(n)}" y2="${Y(50)}" style="stroke:var(--c2);stroke-width:3"/>`).join('')), v: { mx: Math.max(...c), mn: Math.min(...c), chi2: S.sum(c.map(n => (n - 50) ** 2 / 50)), pg: F.peq(1 - S.pchisq(S.sum(c.map(n => (n - 50) ** 2 / 50)), 7)) } };
    },
    agegrp() {
      const { d } = prep(), L = ['40–49', '50–59', '60–69', '70–80'], c = L.map((_, k) => d.age.filter(a => Math.min(3, Math.floor((a - 40) / 10)) === k).length);
      return { svg: chart({ xcats: L, y: [0, Math.max(...c) * 1.15], h: 200, ylab: '人數', xlab: '年齡組（順序變數）' }, (X, Y, ctx) => c.map((n, i) => `<rect data-k="bar" x="${X(i) - ctx.iw / 12}" y="${Y(n)}" width="${ctx.iw / 6}" height="${Y(0) - Y(n)}" style="fill:var(--c1)"/>`).join('')), v: {} };
    },
    pois() {
      const { d } = prep(), x = d.ae_count, m = S.mean(x), vr = S.variance(x), K = [0, 1, 2, 3, 4], obs = K.map(k => (k < 4 ? x.filter(v => v === k).length : x.filter(v => v >= 4).length) / x.length), fit = K.map(k => (k < 4 ? S.dpois(k, m) : 1 - S.ppois(3, m)));
      return { svg: chart({ xcats: ['0', '1', '2', '3', '4+'], y: [0, Math.max(...obs, ...fit) * 1.15], h: 200, ylab: '比例', xlab: '12 週內不良事件次數（計數變數）' }, (X, Y, ctx) => obs.map((p, i) => `<rect data-k="obs bar" x="${X(i) - ctx.iw / 14}" y="${Y(p)}" width="${ctx.iw / 7}" height="${Y(0) - Y(p)}" style="fill:var(--c1)"/>`).join('') + fit.map((p, i) => `<circle data-k="fit" cx="${X(i)}" cy="${Y(p)}" r="6" style="fill:var(--c2)"/>`).join('')), v: { m, vr, ratio: vr / m, p0: 100 * obs[0] } };
    },
    scat() {
      const { d } = prep(), x = d.age, y = d.sbp_0, f = S.pearson(x, y), o = S.ols(x.map(v => [1, v]), y), n = x.length, mx = S.mean(x), sxx = S.sum(x.map(v => (v - mx) ** 2)), s = o.sigma, tc = S.qt(0.975, n - 2), one = 5;
      const pred = v => f.intercept + f.slope * v, xs = Array.from({ length: 41 }, (_, i) => 40 + i), band = (k, c, pi) => { const se = v => s * Math.sqrt((pi ? 1 : 0) + 1 / n + (v - mx) ** 2 / sxx); return `<path class="hlx" data-k="${k}" d="M${xs.map(v => `${XX(v)} ${YY(pred(v) + tc * se(v))}`).join('L')}L${xs.slice().reverse().map(v => `${XX(v)} ${YY(pred(v) - tc * se(v))}`).join('L')}Z" style="fill:${c};fill-opacity:.22"/>`; };
      const cookTop = o.cook.map((c, i) => [c, i]).sort((a, b) => b[0] - a[0]).slice(0, 3).map(z => z[1]), levTop = o.lev.map((c, i) => [c, i]).sort((a, b) => b[0] - a[0]).slice(0, 4).map(z => z[1]);
      let XX, YY; const sq = [3, 11, 27, 40, 66, 90];
      const svg = chart({ x: [38, 82], y: [110, 195], h: 240, xlab: '年齡', ylab: '基線收縮壓' }, (X, Y) => {
        XX = v => X(v).toFixed(1); YY = v => Y(v).toFixed(1);
        return band('cb', 'var(--c2)', 0) + band('pb', 'var(--c3)', 1)
          + x.map((v, i) => `<line class="hlx" data-k="res" x1="${X(v)}" x2="${X(v)}" y1="${Y(y[i])}" y2="${Y(pred(v))}" style="stroke:var(--c2);stroke-width:1"/>`).join('')
          + sq.map(i => { const r = Math.abs(Y(y[i]) - Y(pred(x[i]))); return `<rect class="hlx" data-k="sq" x="${X(x[i])}" y="${Math.min(Y(y[i]), Y(pred(x[i])))}" width="${r}" height="${r}" style="fill:var(--c2);fill-opacity:.3;stroke:var(--c2)"/>`; }).join('')
          + x.map((v, i) => `<circle data-k="pt" cx="${X(v).toFixed(1)}" cy="${Y(y[i]).toFixed(1)}" r="2.4" style="fill:var(--c1);fill-opacity:.45"/>`).join('')
          + `<line data-k="line" x1="${X(40)}" x2="${X(80)}" y1="${Y(pred(40))}" y2="${Y(pred(80))}" style="stroke:var(--c2);stroke-width:3"/>`
          + `<path class="hlx" data-k="slope" d="M${X(55)} ${Y(pred(55))}H${X(65)}V${Y(pred(65))}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>` + lbl(X(60), Y(pred(55)) + 16, '+10 歲', 'slope') + lbl(X(65) + 6, Y((pred(55) + pred(65)) / 2), `+${F.n(10 * f.slope, 1)}`, 'slope', 'var(--ink)', 'start')
          + `<line class="hlx" data-k="one" x1="${X(x[one])}" x2="${X(x[one])}" y1="${Y(y[one])}" y2="${Y(pred(x[one]))}" style="stroke:var(--c3);stroke-width:3"/><circle class="hlx" data-k="one" cx="${X(x[one])}" cy="${Y(y[one])}" r="6" style="fill:var(--c3)"/><circle class="hlx" data-k="one pred" cx="${X(x[one])}" cy="${Y(pred(x[one]))}" r="6" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>`
          + cookTop.map(i => `<circle class="hlx" data-k="cook" cx="${X(x[i])}" cy="${Y(y[i])}" r="9" style="fill:none;stroke:var(--c4);stroke-width:2.5"/>`).join('') + levTop.map(i => `<circle class="hlx" data-k="lev" cx="${X(x[i])}" cy="${Y(y[i])}" r="9" style="fill:none;stroke:var(--c3);stroke-width:2.5"/>`).join('')
          + `<line class="hlx" data-k="ext" x1="${X(80)}" x2="${X(82)}" y1="${Y(pred(80))}" y2="${Y(pred(82))}" style="stroke:var(--c2);stroke-width:3;stroke-dasharray:4 3"/>`;
      });
      return { svg, v: { r: f.r, r2: f.r * f.r, slope: f.slope, s10: 10 * f.slope, int: f.intercept, oneX: x[one], oneY: y[one], pred: pred(x[one]), res: y[one] - pred(x[one]), sse: S.sum(o.resid.map(e => e * e)), rho: S.spearman(x, y).rho, cook: o.cook[cookTop[0]], sig: s } };
    },
    scat0() {
      const { d } = prep(), x = d.age, y = d.sbp_0, f = S.pearson(x, y), pred = v => f.intercept + f.slope * v;
      return { svg: chart({ x: [0, 82], y: [Math.min(100, f.intercept - 10), 195], h: 220, xlab: '年齡', ylab: '收縮壓' }, (X, Y) => x.map((v, i) => `<circle data-k="pt" cx="${X(v).toFixed(1)}" cy="${Y(y[i]).toFixed(1)}" r="2.2" style="fill:var(--c1);fill-opacity:.4"/>`).join('') + `<line data-k="line" x1="${X(40)}" x2="${X(80)}" y1="${Y(pred(40))}" y2="${Y(pred(80))}" style="stroke:var(--c2);stroke-width:3"/><line data-k="ext int" x1="${X(0)}" x2="${X(40)}" y1="${Y(pred(0))}" y2="${Y(pred(40))}" style="stroke:var(--c2);stroke-width:2.5;stroke-dasharray:6 4"/><circle data-k="int" cx="${X(0)}" cy="${Y(f.intercept)}" r="7" style="fill:var(--c2)"/>`), v: { int: f.intercept, slope: f.slope } };
    },
    resid() {
      const { d } = prep(), o = S.ols(d.age.map(v => [1, v]), d.sbp_0), [a, b] = S.minmax(o.fitted);
      return { svg: chart({ x: [a - 1, b + 1], y: [-40, 40], h: 210, xlab: '預測值', ylab: '殘差' }, (X, Y) => `<line data-k="zero" x1="${X(a - 1)}" x2="${X(b + 1)}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4"/>` + o.fitted.map((f, i) => `<circle data-k="pt" cx="${X(f).toFixed(1)}" cy="${Y(Math.max(-40, Math.min(40, o.resid[i]))).toFixed(1)}" r="2.4" style="fill:var(--c1);fill-opacity:.5"/>`).join('')), v: {} };
    },
    two2() {
      const { d, pl, dr } = prep(), cnt = (ix, v) => ix.filter(i => d.responder[i] === v).length;
      return tab2(['安慰劑', '新藥'], ['降 ≥ 10 mmHg', '沒有'], [[cnt(pl, 1), cnt(pl, 0)], [cnt(dr, 1), cnt(dr, 0)]], '%');
    },
    smk() {
      const { d, I } = prep(), cnt = (s, e) => I.filter(i => d.smoker[i] === s && d.cvd_event[i] === e).length;
      return tab2(['不吸菸', '吸菸'], ['發生心血管事件', '沒有'], [[cnt(0, 1), cnt(0, 0)], [cnt(1, 1), cnt(1, 0)]], '%');
    },
    diag() {
      const { d, I } = prep(), c = (l, r) => I.filter(i => d.lvh_echo[i] === l && d.ecg_readA[i] === r).length, tp = c(1, 1), fn = c(1, 0), fp = c(0, 1), tn = c(0, 0);
      return { svg: stackChart(['超音波：有肥大', '超音波：沒有'], ['醫師 A 判讀陽性', '判讀陰性'], [[tp, fn], [fp, tn]], '%', (i, j) => [['tp', 'fn'], ['fp', 'tn']][i][j]), v: { tp, fn, fp, tn, sens: 100 * tp / (tp + fn), spec: 100 * tn / (tn + fp), ppv: 100 * tp / (tp + fp), npv: 100 * tn / (tn + fn), prev: 100 * (tp + fn) / 400 } };
    },
    roc() {
      const { d } = prep(), sc = d.ecg_score, y = d.lvh_echo, P = S.sum(y), N = y.length - P, idx = sc.map((_, i) => i).sort((a, b) => sc[b] - sc[a]); let tp = 0, fp = 0; const pts = [[0, 0]];
      for (const i of idx) { if (y[i]) tp++; else fp++; pts.push([fp / N, tp / P]); }
      const se3 = sc.filter((s, i) => y[i] && s > 3).length / P, fpr3 = sc.filter((s, i) => !y[i] && s > 3).length / N;
      return { svg: chart({ x: [0, 1], y: [0, 1], h: 230, xlab: '1 − 特異度', ylab: '敏感度', xgrid: true }, (X, Y) => { const p = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${X(a).toFixed(1)} ${Y(b).toFixed(1)}`).join(''); return `<path data-k="auc" d="${p}L${X(1)} ${Y(0)}L${X(0)} ${Y(0)}Z" style="fill:var(--c1);fill-opacity:.18"/><path data-k="curve" d="${p}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" style="stroke:var(--muted);stroke-dasharray:4 4"/><line class="hlx" data-k="you" x1="${X(fpr3)}" x2="${X(fpr3)}" y1="${Y(fpr3)}" y2="${Y(se3)}" style="stroke:var(--c2);stroke-width:3"/><circle data-k="thr you" cx="${X(fpr3)}" cy="${Y(se3)}" r="7" style="fill:var(--c2)"/>`; }), v: { auc: S.auc(sc, y), se3: 100 * se3, sp3: 100 * (1 - fpr3), j: se3 - fpr3 } };
    },
    kappa() {
      const { d, I } = prep(), c = (a, b) => I.filter(i => d.ecg_readA[i] === a && d.ecg_readB[i] === b).length, T = [[c(1, 1), c(1, 0)], [c(0, 1), c(0, 0)]], k = S.kappa(T), n = 400, rs = T.map(S.sum), cs = [T[0][0] + T[1][0], T[0][1] + T[1][1]], w = CW, h = 220, cw = Math.min(120, (w - 120) / 2), x0 = (w - 2 * cw) / 2 + 30, y0 = 40;
      let g = `<text x="${x0 + cw}" y="22" text-anchor="middle" style="font-size:13px;fill:var(--ink)">醫師 B</text><text x="${x0 - 60}" y="${y0 + cw * 0.75}" text-anchor="middle" style="font-size:13px;fill:var(--ink)">醫師 A</text>`;
      ['陽性', '陰性'].forEach((t, j) => { g += `<text x="${x0 + cw * (j + 0.5)}" y="36" text-anchor="middle" style="font-size:12px;fill:var(--muted)">${t}</text><text x="${x0 - 8}" y="${y0 + cw * 0.75 * (j + 0.5)}" text-anchor="end" style="font-size:12px;fill:var(--muted)">${t}</text>`; });
      T.forEach((r, i) => r.forEach((v, j) => { const ag = i === j, e = rs[i] * cs[j] / n; g += `<g data-k="${ag ? 'agree' : 'dis'}"><rect x="${x0 + cw * j}" y="${y0 + cw * 0.75 * i}" width="${cw - 4}" height="${cw * 0.75 - 4}" rx="6" style="fill:${ag ? 'var(--c1)' : 'var(--c2)'};fill-opacity:.25;stroke:${ag ? 'var(--c1)' : 'var(--c2)'}"/><text x="${x0 + cw * (j + 0.5)}" y="${y0 + cw * 0.75 * (i + 0.5) - 6}" text-anchor="middle" style="font-size:18px;fill:var(--ink)">${v}</text></g><text class="hlx" data-k="chance" x="${x0 + cw * (j + 0.5)}" y="${y0 + cw * 0.75 * (i + 0.5) + 16}" text-anchor="middle" style="font-size:12px;fill:var(--c3)">機遇預期 ${F.n(e, 1)}</text>`; }));
      return { svg: svgBox(w, h, g), v: { po: 100 * k.po, pe: 100 * k.pe, k: k.kappa, b: T[0][1], c: T[1][0] } };
    },
    ba() {
      const { d } = prep(), a = d.sbp_0, b = d.sbp_devB, m = a.map((v, i) => (v + b[i]) / 2), df = a.map((v, i) => b[i] - v), bias = S.mean(df), sd = S.sd(df), f = S.pearson(m, df), [lo, hi] = S.minmax(m);
      return { svg: chart({ x: [lo, hi], y: [Math.min(-8, bias - 3 * sd), bias + 3 * sd], h: 220, xlab: '兩台血壓計的平均', ylab: 'B − A' }, (X, Y) => m.map((v, i) => `<circle data-k="pt" cx="${X(v).toFixed(1)}" cy="${Y(df[i]).toFixed(1)}" r="2.4" style="fill:var(--c1);fill-opacity:.45"/>`).join('') + `<line x1="${X(lo)}" x2="${X(hi)}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--muted);stroke-dasharray:4 3"/><line data-k="bias" x1="${X(lo)}" x2="${X(hi)}" y1="${Y(bias)}" y2="${Y(bias)}" style="stroke:var(--c2);stroke-width:2.5"/>` + [-1, 1].map(s => `<line data-k="loa" x1="${X(lo)}" x2="${X(hi)}" y1="${Y(bias + s * 1.96 * sd)}" y2="${Y(bias + s * 1.96 * sd)}" style="stroke:var(--c3);stroke-width:2;stroke-dasharray:6 4"/>`).join('') + `<line class="hlx" data-k="prop" x1="${X(lo)}" x2="${X(hi)}" y1="${Y(f.intercept + f.slope * lo)}" y2="${Y(f.intercept + f.slope * hi)}" style="stroke:var(--c4);stroke-width:3"/>`), v: { bias, lo: bias - 1.96 * sd, hi: bias + 1.96 * sd, slope: f.slope } };
    },
    samp() {
      const { d } = prep(), pop = d.sbp_0, r = rng(31), mu = S.mean(pop), sg = S.sd(pop), means = Array.from({ length: 1000 }, () => S.mean(Array.from({ length: 20 }, () => pop[Math.floor(r() * 400)]))), se = S.sd(means), one = means[0];
      return { svg: HB(means, mu - 12, mu + 12, 24, { xlab: '1,000 次抽樣（每次 20 人）的平均', ylab: '次數', extra: (X, Y, top) => hband(X, Y, mu - se, mu + se, 0, top, 'se', 'var(--c2)') + vline(X, Y, mu, 0, top, 'mu', 'var(--ink)') + vline(X, Y, one, 0, top * 0.8, 'one', 'var(--c3)', { hlx: 1, w: 3 }), tag: () => 'means' }), v: { mu, sg, se, th: sg / Math.sqrt(20), one } };
    },
    sampcrp() {
      const { d } = prep(), pop = d.crp, r = rng(32), means = Array.from({ length: 1000 }, () => S.mean(Array.from({ length: 30 }, () => pop[Math.floor(r() * 400)])));
      const bins = 32, lo = 0, hi = 12, bw = (hi - lo) / bins, cnt = v => { const c = new Array(bins).fill(0); v.forEach(x => { const k = Math.floor((x - lo) / bw); if (k >= 0 && k < bins) c[k]++; }); const m = Math.max(...c); return c.map(z => z / m); }, cp = cnt(pop), cm = cnt(means);
      return { svg: chart({ x: [lo, hi], y: [0, 1.1], noY: true, h: 210, xlab: 'CRP（mg/L）' }, (X, Y) => cp.map((p, i) => `<rect data-k="pop" x="${X(lo + i * bw)}" y="${Y(p)}" width="${X(bw) - X(0) - 1}" height="${Y(0) - Y(p)}" style="fill:var(--c1);fill-opacity:.35"/>`).join('') + cm.map((p, i) => `<rect data-k="means" x="${X(lo + i * bw)}" y="${Y(p)}" width="${X(bw) - X(0) - 1}" height="${Y(0) - Y(p)}" style="fill:var(--c2);fill-opacity:.75"/>`).join('')), v: { sk: S.skew(pop) } };
    },
    boot() {
      const { d } = prep(), r = rng(33), s = Array.from({ length: 20 }, () => d.sbp_0[Math.floor(r() * 400)]), m = S.mean(s), bs = Array.from({ length: 1000 }, () => S.mean(Array.from({ length: 20 }, () => s[Math.floor(r() * 20)]))), lo = S.quantile(bs, 0.025), hi = S.quantile(bs, 0.975);
      return { svg: HB(bs, m - 14, m + 14, 28, { xlab: '從同一份 20 人樣本「放回抽樣」1,000 次的平均', ylab: '次數', tag: () => 'means', extra: (X, Y, top) => hband(X, Y, lo, hi, 0, top, 'ci', 'var(--c2)') + vline(X, Y, m, 0, top, 'obs', 'var(--ink)') }), v: { m, lo, hi } };
    },
    sampbias() {
      const { d, I } = prep(), r = rng(34), mu = S.mean(d.sbp_0), young = I.filter(i => d.age[i] < 55).map(i => d.sbp_0[i]), draw = (pool, n) => S.mean(Array.from({ length: n }, () => pool[Math.floor(r() * pool.length)]));
      const A = Array.from({ length: 600 }, () => draw(d.sbp_0, 20)), B = Array.from({ length: 600 }, () => draw(young, 20)), lo = mu - 18, hi = mu + 12, bins = 30, bw = (hi - lo) / bins, cnt = v => { const c = new Array(bins).fill(0); v.forEach(x => { const k = Math.floor((x - lo) / bw); if (k >= 0 && k < bins) c[k]++; }); return c; }, ca = cnt(A), cb = cnt(B), top = Math.max(...ca, ...cb) * 1.1;
      return { svg: chart({ x: [lo, hi], y: [0, top], h: 210, xlab: '每次抽 20 人的平均收縮壓', ylab: '次數' }, (X, Y) => ca.map((c, i) => `<rect data-k="unb" x="${X(lo + i * bw)}" y="${Y(c)}" width="${X(bw) - X(0) - 1}" height="${Y(0) - Y(c)}" style="fill:var(--c1);fill-opacity:.6"/>`).join('') + cb.map((c, i) => `<rect data-k="bias" x="${X(lo + i * bw)}" y="${Y(c)}" width="${X(bw) - X(0) - 1}" height="${Y(0) - Y(c)}" style="fill:var(--c2);fill-opacity:.6"/>`).join('') + vline(X, Y, mu, 0, top, 'mu', 'var(--ink)')), v: { mu, mb: S.mean(B), sa: S.sd(A) } };
    },
    ci() {
      const { d } = prep(), pop = d.sbp_0, mu = S.mean(pop), r = rng(35), rows = Array.from({ length: 20 }, () => { const s = Array.from({ length: 20 }, () => pop[Math.floor(r() * 400)]), m = S.mean(s), h = S.qt(0.975, 19) * S.sd(s) / Math.sqrt(20); return [m - h, m, m + h]; }), miss = rows.filter(c => c[0] > mu || c[2] < mu).length;
      return { svg: chart({ ycats: rows.map(() => ''), x: [mu - 16, mu + 16], h: 260, xlab: '20 次研究（每次 20 人）的 95% 信賴區間', m: { l: 16 } }, (X, Y, { M, ih }) => `<line data-k="mu" x1="${X(mu)}" x2="${X(mu)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-width:2"/>` + rows.map((c, i) => { const ms = c[0] > mu || c[2] < mu; return `<g data-k="ci${ms ? ' miss' : ''}${i === 0 ? ' one' : ''}"><line x1="${X(c[0])}" x2="${X(c[2])}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:${ms ? 'var(--c2)' : 'var(--c1)'};stroke-width:3"/><circle cx="${X(c[1])}" cy="${Y(i)}" r="3.5" style="fill:${ms ? 'var(--c2)' : 'var(--c1)'}"/></g>`; }).join('')), v: { mu, miss, cov: 20 - miss, lo: rows[0][0], hi: rows[0][2], est: rows[0][1] } };
    },
    nullt() {
      const { h1 } = prep(), { w } = welchOf(h1, 'sbp_4'), t = w.t, df = w.df, tc = S.qt(0.975, df), lim = Math.max(4.2, Math.abs(t) + 0.8), xs = Array.from({ length: 161 }, (_, i) => -lim + 2 * lim * i / 160);
      const area = (a, b, k, c, hlx) => { const q = xs.filter(x => x >= a && x <= b); return q.length ? `<path${hlx ? ' class="hlx"' : ''} data-k="${k}" d="M${XX(q[0])} ${YY(0)}${q.map(x => `L${XX(x)} ${YY(tdens(x, df))}`).join('')}L${XX(q[q.length - 1])} ${YY(0)}Z" style="fill:${c};fill-opacity:.5"/>` : ''; };
      let XX, YY; const a = Math.abs(t);
      return { svg: chart({ x: [-lim, lim], y: [0, 0.45], noY: true, h: 200, xlab: 't（虛無假設為真時的分佈）' }, (X, Y) => { XX = v => X(v).toFixed(1); YY = v => Y(v).toFixed(1); return `<path data-k="curve h0" d="${xs.map((x, i) => `${i ? 'L' : 'M'}${XX(x)} ${YY(tdens(x, df))}`).join('')}" style="fill:none;stroke:var(--ink);stroke-width:2"/>` + area(a, lim, 'p', 'var(--c2)') + area(-lim, -a, 'p', 'var(--c2)') + area(tc, lim, 'alpha', 'var(--c3)', 1) + area(-lim, -tc, 'alpha', 'var(--c3)', 1) + area(t > 0 ? t : -lim, t > 0 ? lim : t, 'one', 'var(--c4)', 1) + vline(X, Y, t, 0, 0.42, 'tobs', 'var(--c2)', { w: 3 }) + [-tc, tc].map(c => vline(X, Y, c, 0, 0.42, 'crit', 'var(--c3)', { hlx: 1, dash: 1 })).join(''); }), v: { t, df, p: F.peq(w.p), p1: F.peq(w.p / 2), tc, diff: w.diff } };
    },
    pow() {
      const dl = 2.4, xs = Array.from({ length: 161 }, (_, i) => -4 + 10 * i / 160), c = 1.96; let XX, YY;
      const area = (f, a, b, k, col) => { const q = xs.filter(x => x >= a && x <= b); return `<path class="hlx" data-k="${k}" d="M${XX(q[0])} ${YY(0)}${q.map(x => `L${XX(x)} ${YY(f(x))}`).join('')}L${XX(q[q.length - 1])} ${YY(0)}Z" style="fill:${col};fill-opacity:.45"/>`; };
      const f0 = x => npdf(x, 0, 1), f1 = x => npdf(x, dl, 1);
      return { svg: chart({ x: [-4, 6], y: [0, 0.45], noY: true, h: 200, xlab: '檢定統計量' }, (X, Y) => { XX = v => X(v).toFixed(1); YY = v => Y(v).toFixed(1); return area(f0, c, 6, 'alpha', 'var(--c2)') + area(f1, -4, c, 'beta', 'var(--c3)') + area(f1, c, 6, 'pow', 'var(--c4)') + `<path data-k="h0" d="${xs.map((x, i) => `${i ? 'L' : 'M'}${XX(x)} ${YY(f0(x))}`).join('')}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/><path data-k="h1" d="${xs.map((x, i) => `${i ? 'L' : 'M'}${XX(x)} ${YY(f1(x))}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:2.5;stroke-dasharray:6 4"/>` + vline(X, Y, c, 0, 0.44, 'crit', 'var(--ink)', { dash: 1 }); }), v: { pw: 100 * (1 - S.pnorm(c - dl)), b: 100 * S.pnorm(c - dl) } };
    },
    hosp() {
      const { d, I } = prep(), H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], G = H.map(h => I.filter(i => d.hospital[i] === h).map(i => d.sbp_0[i])), A = S.anova(G), gm = S.mean(d.sbp_0), hm = G.map(S.mean), sd = G.map(S.sd), [lo, hi] = S.minmax(d.sbp_0);
      return { svg: chart({ xcats: H, y: [lo, hi], h: 240, ylab: '基線收縮壓' }, (X, Y, ctx) => { const bw = ctx.iw / 8; let g = ''; G.forEach((v, j) => v.forEach((y, k) => { const x = X(j) + (((k * 0.618) % 1) - 0.5) * bw * 0.5; g += `<line class="hlx" data-k="within" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${Y(y).toFixed(1)}" y2="${Y(hm[j]).toFixed(1)}" style="stroke:var(--c1);stroke-width:1"/><circle data-k="pt" cx="${x.toFixed(1)}" cy="${Y(y).toFixed(1)}" r="2.2" style="fill:var(--c1);fill-opacity:.4"/>`; })); return g + `<line data-k="gm" x1="${X(0) - bw / 2}" x2="${X(7) + bw / 2}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4"/>` + hm.map((m, j) => `<line class="hlx" data-k="between" x1="${X(j) + bw * 0.3}" x2="${X(j) + bw * 0.3}" y1="${Y(m)}" y2="${Y(gm)}" style="stroke:var(--c2);stroke-width:4"/><line class="hlx" data-k="sdbar" x1="${X(j) - bw * 0.3}" x2="${X(j) - bw * 0.3}" y1="${Y(m - sd[j])}" y2="${Y(m + sd[j])}" style="stroke:var(--c3);stroke-width:4"/><line data-k="hm" x1="${X(j) - bw * 0.35}" x2="${X(j) + bw * 0.35}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--c2);stroke-width:3.5"/>`).join(''); }), v: { F: A.F, df1: A.df1, df2: A.df2, p: F.peq(A.p), eta: 100 * A.eta2, ssb: A.ssb, ssw: A.ssw, msb: A.msb, msw: A.msw, rg: Math.max(...hm) - Math.min(...hm), smin: Math.min(...sd), smax: Math.max(...sd) } };
    },
    spag() {
      const { d, pl, dr } = prep(), pick = [...pl.slice(0, 10), ...dr.slice(0, 10)], W = [0, 4, 8, 12], C = ['sbp_0', 'sbp_4', 'sbp_8', 'sbp_12'], gmean = ix => C.map(c => S.mean(ix.map(i => d[c][i]).filter(v => v != null)));
      const m0 = gmean(pl), m1 = gmean(dr);
      return { svg: chart({ x: [0, 12], y: [115, 185], h: 230, xlab: '週', ylab: '收縮壓' }, (X, Y) => pick.map(i => { const c = d.group[i] === 'drug' ? 'var(--c2)' : 'var(--c1)', pts = C.map((k, t) => [W[t], d[k][i]]).filter(p => p[1] != null), last = pts[pts.length - 1]; return `<path data-k="ind" d="${pts.map((p, t) => `${t ? 'L' : 'M'}${X(p[0])} ${Y(p[1])}`).join('')}" style="fill:none;stroke:${c};stroke-opacity:.45;stroke-width:1.4"/>` + (pts.length < 4 ? `<path class="hlx" data-k="drop" d="M${X(last[0]) - 5} ${Y(last[1]) - 5}l10 10m0 -10l-10 10" style="stroke:var(--ink);stroke-width:2.5"/>` : ''); }).join('') + [[m0, 'gm0', 'var(--c1)'], [m1, 'gm1', 'var(--c2)']].map(([m, k, c]) => `<path data-k="${k} gm" d="${m.map((v, t) => `${t ? 'L' : 'M'}${X(W[t])} ${Y(v)}`).join('')}" style="fill:none;stroke:${c};stroke-width:4"/>`).join('')), v: { c0: m0[3] - m0[0], c1: m1[3] - m1[0] } };
    },
    km() {
      const { d, I } = prep(), g = I.map(i => (d.group[i] === 'drug' ? 1 : 0)), K = [0, 1].map(k => S.km(I.filter(i => g[i] === k).map(i => d.time_months[i]), I.filter(i => g[i] === k).map(i => d.cvd_event[i]))), cx = S.cox(d.time_months, d.cvd_event, g.map(v => [v]));
      return { svg: chart({ x: [0, 36], y: [0.4, 1], h: 230, xlab: '月', ylab: '未發生事件的比例' }, (X, Y) => K.map((k, j) => { let p = `M${X(0)} ${Y(1)}`; k.steps.slice(1).forEach(s => { p += `H${X(s.t).toFixed(1)}V${Y(s.S).toFixed(1)}`; }); p += `H${X(k.end)}`; return `<path data-k="c${j} curve" d="${p}" style="fill:none;stroke:var(--c${j + 1});stroke-width:2.5"/>` + k.cens.filter((_, q) => q % 3 === 0).map(c => `<line data-k="cens" x1="${X(c.t)}" x2="${X(c.t)}" y1="${Y(c.S) - 5}" y2="${Y(c.S) + 5}" style="stroke:var(--c${j + 1});stroke-width:1.5"/>`).join(''); }).join('') + `<line class="hlx" data-k="med" x1="${X(0)}" x2="${X(36)}" y1="${Y(0.5)}" y2="${Y(0.5)}" style="stroke:var(--ink);stroke-dasharray:5 4;stroke-width:2"/>`), v: { hr: Math.exp(cx.b[0]), e0: K[0].events, e1: K[1].events, s0: 100 * K[0].at(24).S, s1: 100 * K[1].at(24).S, ncen: 400 - K[0].events - K[1].events } };
    },
    loglog() {
      const { d, I } = prep(), K = [0, 1].map(k => S.km(I.filter(i => (d.group[i] === 'drug') === !!k).map(i => d.time_months[i]), I.filter(i => (d.group[i] === 'drug') === !!k).map(i => d.cvd_event[i])));
      return { svg: chart({ x: [0, 3.6], y: [-6, -0.5], h: 210, xlab: 'ln(月)', ylab: 'ln(−ln S)' }, (X, Y) => K.map((k, j) => `<path data-k="c${j}" d="${k.steps.slice(1).filter(s => s.S < 1 && s.S > 0).map((s, i) => `${i ? 'L' : 'M'}${X(Math.log(s.t)).toFixed(1)} ${Y(Math.log(-Math.log(s.S))).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c${j + 1});stroke-width:2.5"/>`).join('')), v: {} };
    },
    pmf() {
      const n = 10, p = 0.43, ks = [...Array(11).keys()], pr = ks.map(k => S.dbinom(k, n, p)), m = n * p, s = Math.sqrt(n * p * (1 - p));
      return { svg: chart({ xcats: ks.map(String), y: [0, 0.3], h: 210, xlab: '10 位新藥組病人中有反應的人數', ylab: '機率' }, (X, Y, ctx) => { const bw = ctx.iw / 11 * 0.7, xs = Array.from({ length: 101 }, (_, i) => -0.5 + 11 * i / 100); return pr.map((q, k) => `<rect data-k="bar${k <= 3 ? ' cum' : ''}${k === 4 ? ' k' : ''}" x="${X(k) - bw / 2}" y="${Y(q)}" width="${bw}" height="${Y(0) - Y(q)}" style="fill:${k === 4 ? 'var(--c3)' : 'var(--c1)'}"/>`).join('') + `<path class="hlx" data-k="norm" d="${xs.map((x, i) => `${i ? 'L' : 'M'}${(X(0) + (x) * (X(1) - X(0))).toFixed(1)} ${Y(npdf(x, m, s)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:2.5"/><line data-k="ev" x1="${X(0) + m * (X(1) - X(0))}" x2="${X(0) + m * (X(1) - X(0))}" y1="${Y(0)}" y2="${Y(0.29)}" style="stroke:var(--c2);stroke-width:2;stroke-dasharray:5 4"/>`; }), v: { p4: pr[4], cum: S.pbinom(3, n, p), ev: m, c104: 210 } };
    },
    btest() {
      const { d, h1 } = prep(), ix = h1.filter(i => d.group[i] === 'drug' && d.responder[i] != null), n = ix.length, x = ix.filter(i => d.responder[i] === 1).length, p0 = 0.3, pr = [...Array(n + 1).keys()].map(k => S.dbinom(k, n, p0)), px = pr[x], b = S.binomTest(x, n, p0);
      return { svg: chart({ xcats: pr.map((_, k) => String(k)), y: [0, Math.max(...pr) * 1.15], h: 200, xlab: `H1 新藥組 ${n} 人中有反應的人數（假設 p₀ = 0.3）`, ylab: '機率' }, (X, Y, ctx) => { const bw = ctx.iw / pr.length * 0.7; return pr.map((q, k) => `<rect data-k="${q <= px * (1 + 1e-7) ? 'p' : 'bar'}" x="${X(k) - bw / 2}" y="${Y(q)}" width="${bw}" height="${Y(0) - Y(q)}" style="fill:${q <= px * (1 + 1e-7) ? 'var(--c2)' : 'var(--c1)'}"/>`).join('') + vline(X, Y, x, 0, Math.max(...pr) * 1.1, 'obs', 'var(--ink)', { dash: 1 }); }), v: { n, x, p: F.peq(b.p), ex: n * p0, ph: x / n } };
    },
    prop() {
      const { d, h1 } = prep(), ix = h1.filter(i => d.group[i] === 'drug' && d.responder[i] != null), n = ix.length, x = ix.filter(i => d.responder[i] === 1).length, c = S.propCI(x, n), rows = [['Wald', c.wald, 'wald'], ['Wilson', c.wilson, 'wilson'], ['精確法', c.exact, 'exact']];
      return { svg: chart({ ycats: rows.map(r => r[0]), x: [-0.1, 1], h: 170, m: { l: 70 }, xlab: `H1 新藥組 ${x}/${n} 人有反應：比例的 95% CI` }, (X, Y, { M, ih }) => `<line data-k="phat" x1="${X(x / n)}" x2="${X(x / n)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4"/><line x1="${X(0)}" x2="${X(0)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted)"/>` + rows.map(([, ci, k], i) => `<line data-k="${k}" x1="${X(ci[0])}" x2="${X(ci[1])}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c${i + 1});stroke-width:5"/>`).join('')), v: { x, n, ph: x / n, wl: c.wald[0], wh: c.wald[1], sl: c.wilson[0], sh: c.wilson[1], el: c.exact[0], eh: c.exact[1] } };
    },
    logit() {
      const { d } = prep(), x = d.age, y = d.cvd_event, m = S.logistic(x.map(v => [1, v]), y), [b0, b1] = m.b, pr = v => 1 / (1 + Math.exp(-(b0 + b1 * v))), r = rng(36), p70 = pr(70);
      return { svg: chart({ x: [40, 80], y: [-0.08, 1.08], h: 220, xlab: '年齡', ylab: '發生心血管事件' }, (X, Y) => x.map((v, i) => `<circle data-k="pt" cx="${X(v + (r() - 0.5) * 0.8).toFixed(1)}" cy="${Y(y[i] + (r() - 0.5) * 0.08).toFixed(1)}" r="2.2" style="fill:var(--c1);fill-opacity:.35"/>`).join('') + `<path data-k="curve" d="${Array.from({ length: 41 }, (_, i) => `${i ? 'L' : 'M'}${X(40 + i).toFixed(1)} ${Y(pr(40 + i)).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:3"/>` + vline(X, Y, 70, 0, p70, 'odds', 'var(--c3)', { hlx: 1, w: 3 }) + `<circle class="hlx" data-k="odds" cx="${X(70)}" cy="${Y(p70)}" r="6" style="fill:var(--c3)"/>`), v: { b1, or10: Math.exp(10 * b1), or1: Math.exp(b1), p70: 100 * p70, o70: p70 / (1 - p70), ll: m.ll } };
    },
    rate() {
      const { d, pl, dr } = prep(), e = ix => S.sum(at(d.ae_count, ix)), pt = ix => S.sum(at(d.fu_days, ix)), r0 = 100 * e(pl) / pt(pl), r1 = 100 * e(dr) / pt(dr);
      return { svg: chart({ xcats: ['安慰劑', '新藥'], y: [0, Math.max(r0, r1) * 1.3], h: 200, ylab: '每 100 人日的事件數' }, (X, Y, ctx) => [r0, r1].map((r, i) => `<rect data-k="r${i}" x="${X(i) - ctx.iw / 8}" y="${Y(r)}" width="${ctx.iw / 4}" height="${Y(0) - Y(r)}" style="fill:var(--c${i + 1})"/>` + lbl(X(i), Y(r) - 8, `${e(i ? dr : pl)} 件 ÷ ${pt(i ? dr : pl).toLocaleString()} 人日`, 'pt r' + i)).join('') + `<line class="hlx" data-k="rr" x1="${X(0)}" x2="${X(1)}" y1="${Y(Math.max(r0, r1) * 1.18)}" y2="${Y(Math.max(r0, r1) * 1.18)}" style="stroke:var(--ink);stroke-width:2.5"/>`), v: { r0, r1, rr: r1 / r0, e0: e(pl), e1: e(dr), t0: pt(pl), t1: pt(dr) } };
    },
    forest() {
      const { d, I } = prep(), H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], st = H.map(h => { const { w } = welchOf(I.filter(i => d.hospital[i] === h), 'sbp_4'); return { l: h, y: w.diff, v: w.se ** 2 }; }), m = S.meta(st.map(s => s.y), st.map(s => s.v)), rows = [...H, '固定效果', '隨機效果'];
      return { svg: chart({ ycats: rows, x: [-16, 8], h: 70 + rows.length * 22, m: { l: 72 }, xlab: '第 4 週新藥 − 安慰劑（變化量差，mmHg）' }, (X, Y, { M, ih }) => { const dia = (r, i, k, c) => `<path data-k="${k}" d="M${X(r.lo)} ${Y(i)}L${X(r.est)} ${Y(i) - 7}L${X(r.hi)} ${Y(i)}L${X(r.est)} ${Y(i) + 7}Z" style="fill:${c}"/>`; return `<line x1="${X(0)}" x2="${X(0)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + st.map((s, i) => { const se = Math.sqrt(s.v), sz = 3 + 7 * Math.sqrt(m.w[i] / Math.max(...m.w)); return `<line class="hlx" data-k="het" x1="${X(s.y)}" x2="${X(m.fixed.est)}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c2);stroke-width:3;stroke-opacity:.6"/><g data-k="st"><line x1="${X(Math.max(-16, s.y - 1.96 * se))}" x2="${X(Math.min(8, s.y + 1.96 * se))}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c1);stroke-width:1.5"/><rect x="${X(s.y) - sz}" y="${Y(i) - sz}" width="${2 * sz}" height="${2 * sz}" style="fill:var(--c1)"/></g>`; }).join('') + dia(m.fixed, 8, 'fe', 'var(--ink)') + dia(m.random, 9, 're', 'var(--c2)') + `<line class="hlx" data-k="het" x1="${X(m.fixed.est)}" x2="${X(m.fixed.est)}" y1="${M.t}" y2="${Y(7.5)}" style="stroke:var(--c2);stroke-width:1.5"/>`; }), v: { fe: m.fixed.est, re: m.random.est, i2: 100 * m.I2, q: m.Q, tau: m.tau2, k: 8 } };
    },
    funnel() {
      const { d, I } = prep(), H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], st = H.map(h => welchOf(I.filter(i => d.hospital[i] === h), 'sbp_4').w), m = S.meta(st.map(s => s.diff), st.map(s => s.se ** 2)), f = m.fixed.est, pm = Math.max(...st.map(s => 1 / s.se)) * 1.15, ys = Array.from({ length: 30 }, (_, i) => 0.12 + (pm - 0.12) * i / 29);
      return { svg: chart({ x: [-20, 12], y: [0, pm], h: 210, xlab: '各醫院的效果（mmHg）', ylab: '精確度 1/SE' }, (X, Y) => [-1, 1].map(s => `<path d="${ys.map((p, i) => `${i ? 'L' : 'M'}${X(Math.max(-20, Math.min(12, f + s * 1.96 / p))).toFixed(1)} ${Y(p).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--muted);stroke-dasharray:4 3"/>`).join('') + `<line data-k="fe" x1="${X(f)}" x2="${X(f)}" y1="${Y(0)}" y2="${Y(pm)}" style="stroke:var(--ink);stroke-width:2"/>` + st.map(s => `<circle data-k="st" cx="${X(s.diff)}" cy="${Y(1 / s.se)}" r="5" style="fill:var(--c1)"/>`).join('')), v: {} };
    },
    pca() {
      const { d } = prep(), V = ['chol', 'ldl', 'hdl', 'tg', 'glucose', 'hba1c'], A = S.pca(d.chol.map((_, i) => V.map(v => d[v][i]))), sc = A.scores, lim = Math.max(...sc.flatMap(s => [Math.abs(s[0]), Math.abs(s[1])])) * 1.05;
      return { svg: chart({ x: [-lim, lim], y: [-lim, lim], h: 240, xlab: `PC1（${F.n(100 * A.prop[0], 1)}%）`, ylab: `PC2（${F.n(100 * A.prop[1], 1)}%）` }, (X, Y) => sc.map((s, i) => `<circle data-k="pt" cx="${X(s[0]).toFixed(1)}" cy="${Y(s[1]).toFixed(1)}" r="2.6" style="fill:${d.diabetes[i] ? 'var(--c2)' : 'var(--c1)'};fill-opacity:.55"/>`).join('') + `<line class="hlx" data-k="pc1" x1="${X(-lim)}" x2="${X(lim)}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--c3);stroke-width:4"/><line class="hlx" data-k="pc2" x1="${X(0)}" x2="${X(0)}" y1="${Y(-lim)}" y2="${Y(lim)}" style="stroke:var(--c3);stroke-width:4"/>`), v: { p1: 100 * A.prop[0], p2: 100 * A.prop[1] } };
    },
    load() {
      const { d } = prep(), V = ['chol', 'ldl', 'hdl', 'tg', 'glucose', 'hba1c'], L = ['膽固醇', 'LDL', 'HDL', '三酸甘油脂', '血糖', 'HbA1c'], A = S.pca(d.chol.map((_, i) => V.map(v => d[v][i])));
      return { svg: chart({ xcats: L, y: [-1, 1], h: 210, ylab: '載荷' }, (X, Y, ctx) => { const bw = ctx.iw / 6 * 0.3; return [0, 1].map(k => A.loadings[k].map((l, j) => `<rect data-k="l${k + 1}" x="${X(j) + (k - 1) * bw}" y="${Y(Math.max(0, l))}" width="${bw}" height="${Math.abs(Y(l) - Y(0))}" style="fill:var(--c${k + 1})"/>`).join('')).join('') + `<line x1="${X(0) - bw * 2}" x2="${X(5) + bw * 2}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink)"/>`; }), v: {} };
    },
    scree() {
      const { d } = prep(), V = ['chol', 'ldl', 'hdl', 'tg', 'glucose', 'hba1c'], A = S.pca(d.chol.map((_, i) => V.map(v => d[v][i])));
      return { svg: chart({ xcats: A.prop.map((_, i) => 'PC' + (i + 1)), y: [0, 50], h: 190, ylab: '解釋的變異 %' }, (X, Y, ctx) => A.prop.map((p, i) => `<rect data-k="${i < 2 ? 'top' : 'rest'}" x="${X(i) - ctx.iw / 16}" y="${Y(100 * p)}" width="${ctx.iw / 8}" height="${Y(0) - Y(100 * p)}" style="fill:var(--c1)"/>`).join('') + `<path data-k="line" d="${A.prop.map((p, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(100 * p)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:2"/>`), v: { p1: 100 * A.prop[0], p2: 100 * A.prop[1] } };
    },
    kmean() {
      const { d } = prep(), V = ['chol', 'ldl', 'hdl', 'tg', 'glucose', 'hba1c'], A = S.pca(d.chol.map((_, i) => V.map(v => d[v][i]))), sc = A.scores.map(s => [s[0], s[1]]), K = S.kmeans(sc, 2, 5), lim = Math.max(...sc.flat().map(Math.abs)) * 1.05;
      return { svg: chart({ x: [-lim, lim], y: [-lim, lim], h: 230, xlab: 'PC1', ylab: 'PC2' }, (X, Y) => sc.map((s, i) => { const c = K.centers[K.cluster[i]]; return `<line class="hlx" data-k="wss" x1="${X(s[0])}" y1="${Y(s[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" style="stroke:var(--c${K.cluster[i] + 1});stroke-width:.8"/><circle data-k="cl" cx="${X(s[0]).toFixed(1)}" cy="${Y(s[1]).toFixed(1)}" r="2.6" style="fill:var(--c${K.cluster[i] + 1});fill-opacity:.6"/>`; }).join('') + K.centers.map(([x, y]) => `<path data-k="cent wss" d="M${X(x) - 6} ${Y(y) - 6}l12 12m0 -12l-12 12" style="stroke:var(--ink);stroke-width:3"/>`).join('')), v: { wss: K.wss } };
    },
    dendro() {
      const { d, I } = prep(), H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], V = ['sbp_0', 'age', 'bmi', 'crp', 'chol', 'glucose'], z = V.map(v => { const m = S.mean(d[v]), s = S.sd(d[v]); return H.map(h => S.mean(I.filter(i => d.hospital[i] === h).map(i => (d[v][i] - m) / s))); }), pts = H.map((_, j) => V.map((__, k) => z[k][j]));
      const dist = (a, b) => Math.sqrt(S.sum(a.map((v, i) => (v - b[i]) ** 2))); let cl = pts.map((p, i) => ({ m: [i], h: 0, kids: null })); const D = (A, B) => S.mean(A.m.flatMap(i => B.m.map(j => dist(pts[i], pts[j]))));
      while (cl.length > 1) { let bi = 0, bj = 1, bd = Infinity; for (let i = 0; i < cl.length; i++) for (let j = i + 1; j < cl.length; j++) { const v = D(cl[i], cl[j]); if (v < bd) { bd = v; bi = i; bj = j; } } const n = { m: [...cl[bi].m, ...cl[bj].m], h: bd, kids: [cl[bi], cl[bj]] }; cl = cl.filter((_, k) => k !== bi && k !== bj).concat([n]); }
      const root = cl[0], order = root.m, hmax = root.h * 1.1, w = CW, ht = 210, L = 30, R = w - 20, T = 14, B = ht - 40, xo = i => L + (order.indexOf(i) + 0.5) * (R - L) / 8, yo = h => B - (B - T) * h / hmax; let g = '';
      const draw = n => { if (!n.kids) return [xo(n.m[0]), B]; const [a, b] = n.kids.map(draw), y = yo(n.h); g += `<path data-k="tree" d="M${a[0]} ${a[1]}V${y}H${b[0]}V${b[1]}" style="fill:none;stroke:var(--c1);stroke-width:2.2"/>`; return [(a[0] + b[0]) / 2, y]; };
      draw(root); order.forEach(i => { g += `<text data-k="leaf" x="${xo(i)}" y="${B + 18}" text-anchor="middle" style="font-size:12px;fill:var(--ink)">${H[i]}</text>`; });
      return { svg: svgBox(w, ht, g + `<text x="${L}" y="${ht - 4}" style="font-size:11px;fill:var(--muted)">越晚（越高處）合併＝越不相似</text>`), v: {} };
    },
    like() {
      const { d, nn } = prep(), r = nn(d.responder), n = r.length, x = S.sum(r), ph = x / n, ll = p => x * Math.log(p) + (n - x) * Math.log(1 - p), rel = p => ll(p) - ll(ph), ps = Array.from({ length: 200 }, (_, i) => 0.25 + 0.35 * i / 199), root = (a, b) => { for (let i = 0; i < 60; i++) { const m = (a + b) / 2; (rel(m) + 1.92 > 0) === (rel(a) + 1.92 > 0) ? (a = m) : (b = m); } return a; }, lo = root(0.25, ph), hi = root(ph, 0.6), p0 = 0.5;
      return { svg: chart({ x: [0.25, 0.6], y: [-8, 0.5], h: 210, xlab: '反應率 p', ylab: 'ℓ(p) − ℓ(最大)' }, (X, Y) => `<path data-k="curve" d="${ps.map((p, i) => `${i ? 'L' : 'M'}${X(p).toFixed(1)} ${Y(Math.max(-8, rel(p))).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>` + vline(X, Y, ph, -8, 0, 'mle', 'var(--c2)') + `<line data-k="ci" x1="${X(lo)}" x2="${X(hi)}" y1="${Y(-1.92)}" y2="${Y(-1.92)}" style="stroke:var(--c2);stroke-width:4"/>` + vline(X, Y, p0, Math.max(-8, rel(p0)), 0, 'lr', 'var(--c3)', { hlx: 1, w: 3 })), v: { x, n, ph, lo, hi, g: -2 * rel(p0) } };
    },
    bayes() {
      const { d, h1 } = prep(), ix = h1.filter(i => d.responder[i] != null), n = ix.length, x = ix.filter(i => d.responder[i] === 1).length, a = 6, b = 14, A = a + x, B = b + n - x, lb = (p, q) => S.lgamma(p) + S.lgamma(q) - S.lgamma(p + q), db = (p, s, t) => Math.exp((s - 1) * Math.log(p) + (t - 1) * Math.log(1 - p) - lb(s, t)), ps = Array.from({ length: 200 }, (_, i) => 0.005 + 0.99 * i / 199), lo = S.qbeta(0.025, A, B), hi = S.qbeta(0.975, A, B), top = Math.max(...ps.map(p => db(p, A, B))) * 1.1, lk = ps.map(p => db(p, x + 1, n - x + 1)), sc = Math.max(...ps.map(p => db(p, A, B))) / Math.max(...lk);
      const path = f => ps.map((p, i) => `${i ? 'L' : 'M'}${XX(p)} ${YY(Math.min(top, f(p, i)))}`).join(''); let XX, YY;
      return { svg: chart({ x: [0, 1], y: [0, top], noY: true, h: 210, xlab: `H1 醫院的反應率（${x}/${n} 人）` }, (X, Y) => { XX = v => X(v).toFixed(1); YY = v => Y(v).toFixed(1); const q = ps.filter(p => p >= lo && p <= hi), q3 = ps.filter(p => p >= 0.3); return `<path class="hlx" data-k="pp" d="M${XX(q3[0])} ${YY(0)}${q3.map(p => `L${XX(p)} ${YY(db(p, A, B))}`).join('')}L${XX(q3[q3.length - 1])} ${YY(0)}Z" style="fill:var(--c2);fill-opacity:.3"/><path data-k="cri" d="M${XX(q[0])} ${YY(0)}${q.map(p => `L${XX(p)} ${YY(db(p, A, B))}`).join('')}L${XX(q[q.length - 1])} ${YY(0)}Z" style="fill:var(--c2);fill-opacity:.2"/><path data-k="pri" d="${path(p => db(p, a, b))}" style="fill:none;stroke:var(--c1);stroke-width:2.2;stroke-dasharray:6 4"/><path data-k="lik" d="${path((p, i) => lk[i] * sc)}" style="fill:none;stroke:var(--muted);stroke-width:1.6"/><path data-k="post" d="${path(p => db(p, A, B))}" style="fill:none;stroke:var(--c2);stroke-width:2.8"/>` + vline(X, Y, A / (A + B), 0, db(A / (A + B), A, B), 'pm', 'var(--c2)', { hlx: 1 }); }), v: { x, n, a, b, A, B, pm: A / (A + B), lo, hi, pp: 1 - S.ibeta(0.3, A, B) } };
    },
    miss() {
      const { d, I } = prep(), drop = I.filter(i => d.sbp_12[i] == null), keep = I.filter(i => d.sbp_12[i] != null);
      return { svg: chart({ x: [38, 82], y: [110, 195], h: 220, xlab: '年齡', ylab: '基線收縮壓' }, (X, Y) => keep.map(i => `<circle data-k="obs" cx="${X(d.age[i]).toFixed(1)}" cy="${Y(d.sbp_0[i]).toFixed(1)}" r="2.4" style="fill:var(--c1);fill-opacity:.45"/>`).join('') + drop.map(i => `<circle data-k="drop" cx="${X(d.age[i]).toFixed(1)}" cy="${Y(d.sbp_0[i]).toFixed(1)}" r="4" style="fill:none;stroke:var(--c2);stroke-width:2"/>`).join('')), v: { nd: drop.length, a0: S.mean(at(d.age, keep)), a1: S.mean(at(d.age, drop)) } };
    },
    missfill() {
      const { d, I, nn } = prep(), obs = nn(d.sbp_12), m = S.mean(obs), nm = d.sbp_12.length - obs.length, o = S.ols(I.filter(i => d.sbp_12[i] != null).map(i => [1, d.sbp_0[i]]), obs), r = rng(37), imp = I.filter(i => d.sbp_12[i] == null).flatMap(i => [0, 1, 2].map(() => o.b[0] + o.b[1] * d.sbp_0[i] + o.sigma * normOf(r)()));
      const filled = [...obs, ...new Array(nm).fill(m)];
      return { svg: HB(obs, 100, 190, 30, { xlab: '第 12 週收縮壓', extra: (X, Y, top) => `<rect class="hlx" data-k="fill" x="${X(m) - 3}" y="${Y(Math.min(top, nm))}" width="6" height="${Y(0) - Y(Math.min(top, nm))}" style="fill:var(--c2)"/>` + imp.map(v => `<circle class="hlx" data-k="mi" cx="${X(v).toFixed(1)}" cy="${Y(top * 0.06).toFixed(1)}" r="3" style="fill:var(--c3);fill-opacity:.6"/>`).join('') }), v: { m, nm, s0: S.sd(obs), s1: S.sd(filled) } };
    },
    equiv() {
      const rows = [['優越性', [1.5, 7.5], 'sup'], ['不劣性', [-3.2, 4], 'ni'], ['等效性（90% CI）', [-2.4, 2.6], 'eq']];
      return { svg: chart({ ycats: rows.map(r => r[0]), x: [-12, 12], h: 170, m: { l: 112 }, xlab: '新藥 − 標準藥（反應率差，百分點）' }, (X, Y, { M, ih }) => `<rect data-k="zone" x="${X(-5)}" y="${M.t}" width="${X(5) - X(-5)}" height="${ih}" style="fill:var(--c1);fill-opacity:.15"/><line data-k="zone" x1="${X(-5)}" x2="${X(-5)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--c1);stroke-width:2"/><line data-k="zone" x1="${X(5)}" x2="${X(5)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--c1);stroke-width:2"/><line x1="${X(0)}" x2="${X(0)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + rows.map(([, c, k], i) => `<line data-k="${k}" x1="${X(c[0])}" x2="${X(c[1])}" y1="${Y(i)}" y2="${Y(i)}" style="stroke:var(--c2);stroke-width:5"/>`).join('')), v: {} };
    },
    dag() {
      const w = CW, h = 230, cx = w / 2;
      const g = AH + arrow(cx - 50, 50, cx - 120, 112, 'conf back') + arrow(cx + 50, 50, cx + 120, 112, 'conf back') + arrow(cx - 92, 130, cx + 92, 130, 'exp') + arrow(cx - 150, 190, cx - 150, 150, 'cause') + arrow(cx + 20, 190, cx + 120, 148, 'med') + arrow(cx - 100, 200, cx - 40, 200, 'med')
        + node(cx, 34, '年齡', 'conf back', 'var(--c3)') + node(cx - 150, 130, '糖尿病', 'exp', 'var(--c1)') + node(cx + 150, 130, '心血管事件', 'exp', 'var(--c2)', 100) + node(cx - 150, 205, 'BMI', 'cause') + node(cx + 10, 205, '收縮壓', 'med', 'var(--c4)');
      return { svg: svgBox(w, h, g), v: {} };
    },
    design() {
      const w = CW, h = 260, cx = w / 2, bx = Math.min(130, w / 4);
      const g = AH + node(cx, 28, '8 間醫院 400 位病人', 'unit rep', 'var(--ink)', 170) + arrow(cx, 46, cx, 78, 'rand') + `<g data-k="rand"><rect x="${cx - 70}" y="80" width="140" height="30" rx="15" style="fill:var(--soft);stroke:var(--accent);stroke-width:2"/><text x="${cx}" y="95" dy=".35em" text-anchor="middle" style="font-size:13px;fill:var(--ink)">在各醫院內隨機分派</text></g>` + `<rect class="hlx" data-k="block" x="${cx - 100}" y="12" width="200" height="104" rx="8" style="fill:none;stroke:var(--c3);stroke-width:2.5;stroke-dasharray:6 4"/>`
        + arrow(cx - 20, 112, cx - bx, 150, 'rand') + arrow(cx + 20, 112, cx + bx, 150, 'rand') + node(cx - bx, 170, '新藥 200 人', 'trt', 'var(--c2)', 110) + node(cx + bx, 170, '安慰劑 200 人', 'ctrl', 'var(--c1)', 120)
        + `<g class="hlx" data-k="blind"><text x="${cx}" y="174" text-anchor="middle" style="font-size:22px">🙈</text><text x="${cx}" y="200" text-anchor="middle" style="font-size:11.5px;fill:var(--ink)">病人與醫師都不知道組別</text></g>`
        + `<text x="${cx}" y="236" text-anchor="middle" style="font-size:12.5px;fill:var(--muted)">第 0、4、8、12 週量血壓 → 比較兩組</text>`;
      return { svg: svgBox(w, h, g), v: {} };
    },
    cross() {
      const w = CW, h = 200, L = 70, R = w - 16, seg = (R - L) / 3, row = (y, a, b, k) => `<text x="${L - 8}" y="${y}" dy=".35em" text-anchor="end" style="font-size:12px;fill:var(--ink)">${k}</text><rect data-k="per1" x="${L}" y="${y - 14}" width="${seg - 4}" height="28" rx="6" style="fill:${a[1]}"/><text x="${L + seg / 2}" y="${y}" dy=".35em" text-anchor="middle" style="font-size:12px;fill:#fff">${a[0]}</text><rect data-k="wash" x="${L + seg}" y="${y - 14}" width="${seg - 4}" height="28" rx="6" style="fill:var(--line)"/><text x="${L + seg * 1.5}" y="${y}" dy=".35em" text-anchor="middle" style="font-size:12px;fill:var(--ink)">洗除期</text><rect data-k="per2" x="${L + 2 * seg}" y="${y - 14}" width="${seg - 4}" height="28" rx="6" style="fill:${b[1]}"/><text x="${L + seg * 2.5}" y="${y}" dy=".35em" text-anchor="middle" style="font-size:12px;fill:#fff">${b[0]}</text><path class="hlx" data-k="carry" d="M${L + seg - 8} ${y}C${L + seg * 1.5} ${y - 34} ${L + seg * 1.5} ${y - 34} ${L + 2 * seg + 8} ${y - 6}" style="fill:none;stroke:var(--c4);stroke-width:2.5;stroke-dasharray:5 4"/>`;
      return { svg: svgBox(w, h, row(60, ['新藥', 'var(--c2)'], ['安慰劑', 'var(--c1)'], '順序 AB') + row(130, ['安慰劑', 'var(--c1)'], ['新藥', 'var(--c2)'], '順序 BA') + `<text x="${L + seg / 2}" y="180" text-anchor="middle" style="font-size:12px;fill:var(--muted)">第 1 期</text><text x="${L + seg * 2.5}" y="180" text-anchor="middle" style="font-size:12px;fill:var(--muted)">第 2 期</text>`), v: {} };
    },
    venn() {
      const { d, I } = prep(), A = I.filter(i => d.smoker[i]).length, B = I.filter(i => d.diabetes[i]).length, AB = I.filter(i => d.smoker[i] && d.diabetes[i]).length, w = CW, h = 220, cx = w / 2;
      const g = `<rect class="hlx" data-k="notA" x="8" y="8" width="${w - 16}" height="${h - 16}" rx="10" style="fill:var(--c3);fill-opacity:.12"/><rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="10" style="fill:none;stroke:var(--line)"/><text x="18" y="28" style="font-size:12px;fill:var(--muted)">400 位病人</text>`
        + `<circle data-k="A union" cx="${cx - 40}" cy="115" r="78" style="fill:var(--c1);fill-opacity:.3;stroke:var(--c1);stroke-width:2"/><circle data-k="B union cond" cx="${cx + 55}" cy="115" r="46" style="fill:var(--c2);fill-opacity:.3;stroke:var(--c2);stroke-width:2"/>`
        + `<text x="${cx - 70}" y="115" text-anchor="middle" style="font-size:13px;fill:var(--ink)">吸菸 ${A}</text><text x="${cx + 70}" y="108" text-anchor="middle" style="font-size:13px;fill:var(--ink)">糖尿病 ${B}</text><text class="hlx" data-k="AB cond" x="${cx + 18}" y="152" text-anchor="middle" style="font-size:13px;fill:var(--ink);font-weight:700">兩者 ${AB}</text>`;
      return { svg: svgBox(w, h, g), v: { A, B, AB, pA: A / 400, pB: B / 400, pAB: AB / 400, pAgB: AB / B, pU: (A + B - AB) / 400 } };
    },
    ancova() {
      const { d, I } = prep(), ix = I.filter(i => d.sbp_12[i] != null), o = S.ols(ix.map(i => [1, d.sbp_0[i], d.group[i] === 'drug' ? 1 : 0]), ix.map(i => d.sbp_12[i])), [b0, b1, b2] = o.b, mx = S.mean(ix.map(i => d.sbp_0[i]));
      return { svg: chart({ x: [110, 195], y: [100, 190], h: 230, xlab: '基線收縮壓（共變數）', ylab: '第 12 週收縮壓' }, (X, Y) => ix.map(i => `<circle data-k="p${d.group[i] === 'drug' ? 1 : 0}" cx="${X(d.sbp_0[i]).toFixed(1)}" cy="${Y(d.sbp_12[i]).toFixed(1)}" r="2.3" style="fill:var(--c${d.group[i] === 'drug' ? 2 : 1});fill-opacity:.45"/>`).join('') + [0, 1].map(g => `<line data-k="l${g}" x1="${X(115)}" x2="${X(190)}" y1="${Y(b0 + b1 * 115 + b2 * g)}" y2="${Y(b0 + b1 * 190 + b2 * g)}" style="stroke:var(--c${g + 1});stroke-width:3"/>`).join('') + `<line class="hlx" data-k="adj" x1="${X(mx)}" x2="${X(mx)}" y1="${Y(b0 + b1 * mx)}" y2="${Y(b0 + b1 * mx + b2)}" style="stroke:var(--ink);stroke-width:4"/>` + hband(X, Y, mx - 0.6, mx + 0.6, 100, 190, 'cov', 'var(--ink)')), v: { b2, b1, mx } };
    },
    inter() {
      const { d, I } = prep(), cell = (g, s) => I.filter(i => d.group[i] === g && d.sex[i] === s).map(i => d.sbp_4[i] - d.sbp_0[i]);
      return { svg: interPlot(['安慰劑', '新藥'], ['女', '男'], [[cell('placebo', 'F'), cell('placebo', 'M')], [cell('drug', 'F'), cell('drug', 'M')]], '第 4 週血壓變化'), v: {} };
    },
    strata() {
      const { d, I } = prep(), tb = ix => { const c = (s, e) => ix.filter(i => d.smoker[i] === s && d.cvd_event[i] === e).length; return [c(1, 1), c(1, 0), c(0, 1), c(0, 0)]; }, orci = ([a, b, c, dd]) => { const o = a * dd / (b * c), se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / dd); return { est: o, lo: o * Math.exp(-1.96 * se), hi: o * Math.exp(1.96 * se) }; };
      const all = tb(I), fF = tb(I.filter(i => d.sex[i] === 'F')), fM = tb(I.filter(i => d.sex[i] === 'M')), mh = S.sum([fF, fM].map(([a, b, c, dd]) => a * dd / (a + b + c + dd))) / S.sum([fF, fM].map(([a, b, c, dd]) => b * c / (a + b + c + dd)));
      const rows = [{ label: '未分層（粗）', ...orci(all), k: 'crude' }, { label: '女性', ...orci(fF), k: 's0' }, { label: '男性', ...orci(fM), k: 's1' }, { label: 'Mantel–Haenszel', est: mh, lo: mh, hi: mh, k: 'mh' }];
      return { svg: forestChart(rows, '吸菸 vs 不吸菸：心血管事件的勝算比'), v: { crude: rows[0].est, oF: rows[1].est, oM: rows[2].est, mh } };
    },
    mtest() {
      const { d, pl, dr } = prep(), V = ['age', 'bmi', 'sbp_0', 'sbp_devB', 'crp', 'chol', 'ldl', 'hdl', 'tg', 'glucose', 'hba1c', 'ecg_score', 'smoker', 'diabetes', 'lvh_echo', 'ecg_readA', 'ecg_readB', 'fu_days'], ps = V.map(v => S.welch(at(d[v], dr), at(d[v], pl)).p).sort((a, b) => a - b), m = ps.length;
      return { svg: chart({ x: [0.5, m + 0.5], y: [0, 1], h: 210, xlab: `${m} 個基線變數兩組比較的 p 值（由小到大）`, ylab: 'p 值' }, (X, Y) => `<line data-k="a" x1="${X(0.5)}" x2="${X(m + 0.5)}" y1="${Y(0.05)}" y2="${Y(0.05)}" style="stroke:var(--muted);stroke-dasharray:4 3"/><line class="hlx" data-k="bonf" x1="${X(0.5)}" x2="${X(m + 0.5)}" y1="${Y(0.05 / m)}" y2="${Y(0.05 / m)}" style="stroke:var(--c2);stroke-width:2.5"/><line class="hlx" data-k="bh" x1="${X(0.5)}" x2="${X(m + 0.5)}" y1="${Y(0.05 * 0.5 / m)}" y2="${Y(0.05 * (m + 0.5) / m)}" style="stroke:var(--c3);stroke-width:2.5"/><path class="hlx" data-k="unif" d="M${X(0.5)} ${Y(0)}L${X(m + 0.5)} ${Y(1)}" style="stroke:var(--ink);stroke-dasharray:6 4;fill:none"/>` + ps.map((p, i) => `<circle data-k="p" cx="${X(i + 1)}" cy="${Y(p)}" r="4.5" style="fill:var(--c1)"/>`).join('')), v: { m, mn: ps[0], ns: ps.filter(p => p < 0.05).length, fw: 100 * (1 - 0.95 ** m) } };
    },
    qq() {
      const { d } = prep(); return { svg: qqChart(d.sbp_0), v: {} };
    },
    qqcrp() {
      const { d } = prep(); return { svg: qqChart(d.crp), v: {} };
    },
    types() {
      const { d } = prep(), w = CW, cols = [['hospital', '醫院', 'nom'], ['bmi', 'BMI', 'cont'], ['ae_count', '不良事件', 'count'], ['time_months', '月數', 'tte'], ['cvd_event', '事件', 'cens']], cw = (w - 40) / cols.length, rows = [0, 1, 2, 3, 4, 5];
      let g = cols.map(([c, l, k], j) => `<g data-k="${k}"><rect x="${20 + j * cw}" y="8" width="${cw - 4}" height="${30 + rows.length * 26}" rx="6" style="fill:var(--soft);stroke:var(--line)"/><text x="${20 + j * cw + cw / 2}" y="28" text-anchor="middle" style="font-size:12.5px;fill:var(--ink);font-weight:700">${l}</text>${rows.map(r => `<text x="${20 + j * cw + cw / 2}" y="${56 + r * 26}" text-anchor="middle" style="font-size:12.5px;fill:${c === 'cvd_event' && d[c][r] === 0 ? 'var(--c2)' : 'var(--ink)'}">${d[c][r]}</text>`).join('')}</g>`).join('');
      return { svg: svgBox(w, 50 + rows.length * 26, g), v: {} };
    },
    logfc() {
      const { d, I } = prep(), gm = s => Math.exp(S.mean(I.filter(i => d.smoker[i] === s).map(i => Math.log(d.crp[i])))), fc = gm(1) / gm(0), T = [0.25, 0.5, 1, 2, 4];
      return { svg: chart({ x: [0.2, 5], xlog: true, y: [0, 1], noY: true, h: 130, xlab: '吸菸者 ÷ 不吸菸者的 CRP（對數刻度）' }, (X, Y) => `<line x1="${X(1)}" x2="${X(1)}" y1="${Y(0)}" y2="${Y(1)}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + T.map(t => `<text data-k="axis" x="${X(t)}" y="${Y(0.75)}" text-anchor="middle" style="font-size:11px;fill:var(--muted)">log₂ = ${F.n(Math.log2(t), 0)}</text>`).join('') + `<circle data-k="fc" cx="${X(fc)}" cy="${Y(0.4)}" r="8" style="fill:var(--c2)"/>`), v: { fc, l2: Math.log2(fc) } };
    },
    perm() {
      const { h1 } = prep(), { a, b, w } = welchOf(h1, 'sbp_4'), all = [...a, ...b], obs = S.mean(b) - S.mean(a), r = rng(38), null_ = Array.from({ length: 1000 }, () => { const s = all.slice(); for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; } return S.mean(s.slice(0, b.length)) - S.mean(s.slice(b.length)); }), p = null_.filter(v => Math.abs(v) >= Math.abs(obs)).length / 1000;
      return { svg: HB(null_, -14, 14, 28, { xlab: '把組別標籤隨機重排 1,000 次的平均差', ylab: '次數', tag: (i, m) => (Math.abs(m) >= Math.abs(obs) ? 'null p' : 'null'), color: (i, m) => (Math.abs(m) >= Math.abs(obs) ? 'var(--c2)' : 'var(--c1)'), extra: (X, Y, top) => vline(X, Y, obs, 0, top, 'obs', 'var(--ink)', { w: 3 }) }), v: { obs, p, wt: F.peq(w.p) } };
    },
    std() {
      const { d, I } = prep(), ag = i => (d.age[i] < 55 ? 0 : d.age[i] < 65 ? 1 : 2), L = ['< 55', '55–64', '≥ 65'], rt = (s, k) => { const ix = I.filter(i => d.smoker[i] === s && (k == null || ag(i) === k)); return ix.length ? S.mean(ix.map(i => d.cvd_event[i])) : 0; }, w = [0, 1, 2].map(k => I.filter(i => ag(i) === k).length / 400);
      const std = s => S.sum([0, 1, 2].map(k => w[k] * rt(s, k))), crude = [rt(0), rt(1)], sd = [std(0), std(1)], pall = S.mean(d.cvd_event);
      return { svg: chart({ xcats: [...L, '全部（粗率）', '年齡標準化'], y: [0, 60], h: 220, ylab: '心血管事件 %' }, (X, Y, ctx) => { const bw = ctx.iw / 5 * 0.3; let g = ''; [0, 1, 2].forEach(k => [0, 1].forEach(s => { const v = 100 * rt(s, k); g += `<rect data-k="strat" x="${X(k) + (s - 1) * bw}" y="${Y(v)}" width="${bw}" height="${Y(0) - Y(v)}" style="fill:var(--c${s + 1})"/>`; })); [0, 1].forEach(s => { g += `<rect data-k="crude" x="${X(3) + (s - 1) * bw}" y="${Y(100 * crude[s])}" width="${bw}" height="${Y(0) - Y(100 * crude[s])}" style="fill:var(--c${s + 1})"/><rect data-k="std" x="${X(4) + (s - 1) * bw}" y="${Y(100 * sd[s])}" width="${bw}" height="${Y(0) - Y(100 * sd[s])}" style="fill:var(--c${s + 1})"/>`; }); return g; }), v: { c0: 100 * crude[0], c1: 100 * crude[1], s0: 100 * sd[0], s1: 100 * sd[1], paf: 100 * (pall - crude[0]) / pall, afe: 100 * (crude[1] - crude[0]) / crude[1] } };
    },
    shrink() {
      const { d, I } = prep(), H = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8'], G = H.map(h => I.filter(i => d.hospital[i] === h).map(i => d.sbp_0[i])), ns = G.map(g => g.length), A = S.anova(G), N0 = S.sum(ns), n0 = (N0 - S.sum(ns.map(n => n * n)) / N0) / 7, s2 = A.msw, t2 = Math.max(0, (A.msb - A.msw) / n0), raw = G.map(S.mean), wj = ns.map(n => 1 / (t2 + s2 / n)), mu = S.sum(raw.map((m, j) => m * wj[j])) / S.sum(wj), lam = ns.map(n => t2 / (t2 + s2 / n)), bl = raw.map((m, j) => mu + lam[j] * (m - mu)), [lo, hi] = S.minmax(raw), icc = t2 / (t2 + s2);
      return { svg: chart({ xcats: ['各醫院自己的平均', '混合模型估計'], y: [lo - 2, hi + 2], h: 230, ylab: '基線收縮壓' }, (X, Y, { iw }) => `<rect class="hlx" data-k="tau" x="${X(0) - iw / 5}" y="${Y(mu + Math.sqrt(t2))}" width="${X(1) - X(0) + iw / 2.5}" height="${Y(mu - Math.sqrt(t2)) - Y(mu + Math.sqrt(t2))}" style="fill:var(--c1);fill-opacity:.15"/><line data-k="gm" x1="${X(0) - iw / 5}" x2="${X(1) + iw / 5}" y1="${Y(mu)}" y2="${Y(mu)}" style="stroke:var(--ink);stroke-dasharray:5 4;stroke-width:1.5"/>` + ns.map((n, j) => `<line data-k="shr" x1="${X(0)}" x2="${X(1)}" y1="${Y(raw[j])}" y2="${Y(bl[j])}" style="stroke:var(--muted);stroke-width:1.2"/><circle data-k="raw" cx="${X(0)}" cy="${Y(raw[j])}" r="${3 + Math.sqrt(n) * 0.6}" style="fill:var(--c1);fill-opacity:.6"/><circle data-k="blup" cx="${X(1)}" cy="${Y(bl[j])}" r="${3 + Math.sqrt(n) * 0.6}" style="fill:var(--c2);fill-opacity:.6"/>`).join('')), v: { tau: Math.sqrt(t2), sg: Math.sqrt(s2), icc, de: 1 + (50 - 1) * icc, neff: 400 / (1 + 49 * icc), l0: lam[0] } };
    },
    err() {
      const { d, pl, dr, nn } = prep(), g = [nn(at(d.sbp_12, pl)), nn(at(d.sbp_12, dr))], st = g.map(v => { const m = S.mean(v), s = S.sd(v), se = s / Math.sqrt(v.length); return { m, sd: s, se, ci: S.qt(0.975, v.length - 1) * se }; });
      return { svg: chart({ xcats: ['平均 ± SD', '平均 ± SE', '平均 ± 95% CI'], y: [115, 160], h: 210, ylab: '第 12 週收縮壓' }, (X, Y) => ['sd', 'se', 'ci'].map((k, j) => st.map((s, i) => { const x = X(j) + (i - 0.5) * 22, e = s[k]; return `<g data-k="${k}"><line x1="${x}" x2="${x}" y1="${Y(s.m - e)}" y2="${Y(s.m + e)}" style="stroke:var(--c${i + 1});stroke-width:2.5"/><circle cx="${x}" cy="${Y(s.m)}" r="5" style="fill:var(--c${i + 1})"/></g>`; }).join('')).join('')), v: { sd: st[0].sd, se: st[0].se } };
    },
    lln() {
      const { d } = prep(), x = d.sbp_0, mu = S.mean(x); let s = 0; const run = x.map((v, i) => (s += v) / (i + 1));
      return { svg: chart({ x: [1, 400], y: [mu - 15, mu + 15], h: 200, xlab: '累積的病人數', ylab: '目前的平均' }, (X, Y) => `<line data-k="mu" x1="${X(1)}" x2="${X(400)}" y1="${Y(mu)}" y2="${Y(mu)}" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4"/><path data-k="run" d="${run.map((v, i) => `${i ? 'L' : 'M'}${X(i + 1).toFixed(1)} ${Y(Math.max(mu - 15, Math.min(mu + 15, v))).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:2.2"/>`), v: { mu } };
    },
    table1() {
      const { d, pl, dr } = prep(), w = CW, f = (ix, c) => `${F.n(S.mean(at(d[c], ix)), 1)} (${F.n(S.sd(at(d[c], ix)), 1)})`, pc = (ix, c, v) => `${ix.filter(i => d[c][i] === v).length} (${F.n(100 * ix.filter(i => d[c][i] === v).length / ix.length, 0)}%)`;
      const R = [['', '安慰劑 (n=200)', '新藥 (n=200)'], ['年齡', f(pl, 'age'), f(dr, 'age')], ['女性', pc(pl, 'sex', 'F'), pc(dr, 'sex', 'F')], ['BMI', f(pl, 'bmi'), f(dr, 'bmi')], ['吸菸', pc(pl, 'smoker', 1), pc(dr, 'smoker', 1)], ['基線收縮壓', f(pl, 'sbp_0'), f(dr, 'sbp_0')]], cw = [w * 0.3, w * 0.33, w * 0.33];
      const g = R.map((r, i) => `<g data-k="${i ? 'row' : 'head'}">${r.map((c, j) => `<text x="${8 + cw.slice(0, j).reduce((a, b) => a + b, 0) + (j ? cw[j] / 2 : 0)}" y="${24 + i * 28}" text-anchor="${j ? 'middle' : 'start'}" style="font-size:12.5px;fill:var(--ink);${i ? '' : 'font-weight:700'}">${c}</text>`).join('')}</g>`).join('') + `<line x1="6" x2="${w - 6}" y1="32" y2="32" style="stroke:var(--ink)"/>`;
      return { svg: svgBox(w, 30 + R.length * 28, g), v: {} };
    },
    rank() {
      const { h1 } = prep(), { a, b } = welchOf(h1, 'sbp_4'), all = [...a.map(v => [v, 0]), ...b.map(v => [v, 1])].sort((p, q) => p[0] - q[0]), r0 = S.sum(all.map((p, i) => (p[1] === 0 ? i + 1 : 0))), r1 = S.sum(all.map((p, i) => (p[1] === 1 ? i + 1 : 0)));
      return { svg: chart({ x: [0, all.length + 1], y: [0, 2], noY: true, h: 140, xlab: 'H1 醫院第 4 週血壓變化，由小到大的名次' }, (X, Y) => { const sp = X(2) - X(1), rr = Math.min(7, sp / 2.1); return all.map((p, i) => `<g data-k="r${p[1]}"><circle cx="${X(i + 1)}" cy="${Y(p[1] ? 1.4 : 0.6)}" r="${rr}" style="fill:var(--c${p[1] + 1})"/>${sp >= 13 || (i + 1) % 5 === 0 ? `<text x="${X(i + 1)}" y="${Y(p[1] ? 1.4 : 0.6) + (sp >= 13 ? 0 : (p[1] ? -14 : 16))}" dy=".35em" text-anchor="middle" style="font-size:${sp >= 13 ? 9 : 10}px;fill:${sp >= 13 ? '#fff' : 'var(--ink)'}">${i + 1}</text>` : ''}</g>`).join(''); }), v: { r0, r1, n0: a.length, n1: b.length } };
    },
    pairdiff() {
      const { d, dr } = prep(), df = dr.map(i => d.sbp_4[i] - d.sbp_0[i]), m = S.mean(df), t = S.oneT(df, 0);
      return { svg: HB(df, -35, 25, 30, { xlab: '新藥組每人：第 4 週 − 基線', tag: (i, mid) => (mid < 0 ? 'neg bar' : 'pos bar'), color: (i, mid) => (mid < 0 ? 'var(--c2)' : 'var(--c1)'), extra: (X, Y, top) => vline(X, Y, 0, 0, top, 'zero', 'var(--ink)', { dash: 1 }) + vline(X, Y, m, 0, top, 'mean', 'var(--c3)', { w: 3 }) }), v: { m, neg: df.filter(v => v < 0).length, pos: df.filter(v => v > 0).length, t: t.t, n: df.length } };
    },
  };

  // 名詞 → [圖, 亮起的 data-k（空白分隔）, 圖說]。圖說中的 {x} 由圖算出的數字填入
  const M = {
    '百分點': ['two2', 'rd', '新藥組反應率 {p1}% − 安慰劑組 {p0}% = {rd} 個百分點（黑線）'],
    '盛行率': ['venn', 'B', '400 人中有糖尿病的 {B} 人：糖尿病盛行率 = {B} ÷ 400'],
    '發生率': ['rate', 'r0 r1', '長條高度＝每 100 人日發生的不良事件數：安慰劑 {r0}、新藥 {r1}'],
    '事件率': ['two2', 'r1', '新藥組中達到「降 10 mmHg 以上」的比例 {p1}%（亮起的部分）'],
    '絕對差': ['two2', 'rd', '兩組反應率直接相減：{p1}% − {p0}% = {rd} 個百分點'],
    '相對變化': ['two2', 'r0 r1', '（新藥 − 安慰劑）÷ 安慰劑 = {rel}%'],
    '風險比': ['two2', 'r0 r1', '新藥組反應率 ÷ 安慰劑組反應率 = {p1}% ÷ {p0}% = {rr}'],
    '需治療人數': ['two2', 'rd', '1 ÷ 反應率差（{rd} 個百分點）≈ {nnt}：約治療這麼多人，多一人有反應'],
    '對照組': ['design', 'ctrl', '安慰劑組是對照組：除了藥以外，其他一切都和新藥組相同'],
    '人時': ['rate', 'pt', '分母是每個人被追蹤的天數加總：安慰劑 {t0} 人日、新藥 {t1} 人日'],
    'Σ': ['hist', 'bar', '每根長條裡的病人收縮壓全部加起來：Σx = {sum}'],
    '離均差': ['hist', 'dev', '綠色線段＝一位病人（{one}）離平均（{m}）的距離：{dev}'],
    '估計值': ['ci', 'one', '最上面這次研究只抽 20 人，估計平均 {est}；黑線是 400 人的真值 {mu}'],
    '真值': ['ci', 'mu', '黑線＝全部 400 人的平均 {mu}；每次只抽 20 人的估計值都在它附近跳動'],
    'μ 與 σ': ['samp', 'mu', '把 400 人當成母體：μ = {mu}、σ = {sg}；黑線是 μ'],
    '對數': ['crplog', 'bar', 'CRP 取對數後，右偏的分佈變得接近左右對稱'],
    '倍數變化': ['logfc', 'fc', '吸菸者的 CRP 約是不吸菸者的 {fc} 倍（紅點）'],
    'log₂FC': ['logfc', 'fc axis', '倍數 {fc} 取 log₂ = {l2}；每 +1 代表加倍、−1 代表減半'],
    '預測值': ['scat', 'pred', '空心圓＝直線在這位病人年齡（{oneX} 歲）上的高度：預測值 {pred}'],
    '斜率': ['scat', 'slope', '年齡每多 10 歲，直線升高 {s10} mmHg：斜率 = {slope}'],
    '截距': ['scat0', 'int', '把直線往左延伸到年齡 0 的高度：截距 {int}（只是數學上的起點）'],
    '殘差': ['scat', 'one', '綠色線段＝這位病人的實際值 {oneY} − 預測值 {pred} = 殘差 {res}'],
    '殘差平方和': ['scat', 'sq', '每個正方形的邊長是殘差；所有正方形面積加總＝殘差平方和 {sse}'],
    '最小平方法': ['scat', 'res line', '紅線是讓所有殘差（紅色短線）平方加總最小的那條直線'],
    '名目變數': ['types', 'nom', '醫院 H1–H8 只是名字，沒有大小順序'],
    '順序變數': ['agegrp', 'bar', '年齡組有先後順序，但組與組的「距離」不一定相等'],
    '連續變數': ['types', 'cont', 'BMI 可以是任何小數值'],
    '計數變數': ['pois', 'obs', '不良事件次數只能是 0、1、2…'],
    '時間至事件': ['types', 'tte cens', '追蹤到發生心血管事件（事件 = 1）或結束追蹤（事件 = 0）的月數'],
    '設限': ['types', 'cens', '紅色的 0：追蹤結束時還沒發生事件，只知道「至少」這麼久'],
    '平均數': ['hist', 'mean', '紅線＝400 位病人基線收縮壓的平均 {m} mmHg'],
    '中位數': ['crp', 'med', '黑色虛線＝中位數 {md}：一半病人的 CRP 比它低；紅線平均 {m} 被右邊的大值拉高'],
    '極端值': ['crp', 'tail', '最右邊亮起的長條：CRP 最高的 5%（> {q95}）'],
    '偏態': ['crp', 'bar tail', '長尾巴拖在右邊：右偏。平均 {m} > 中位數 {md}'],
    '穩健': ['crp', 'med tail', '右邊的極端值再大，中位數 {md} 也幾乎不動'],
    '標準差': ['hist', 'sd', '紅色帶＝平均 ± 1 個標準差（{m} ± {sd}）'],
    '變異數': ['hist', 'var', '標準差 {sd} 的平方 = 變異數 {vr}；紅色帶是 ± 1 個標準差'],
    '四分位距': ['hist', 'iqr', '綠色帶＝中間 50% 的病人：第 25 到 75 百分位數（{q1} 至 {q3}），寬 {iqr}'],
    '四分位數': ['hist', 'q', '三條綠線把病人分成人數相等的四份：{q1}、{md}、{q3}'],
    '變異係數': ['hist', 'sd mean', '標準差 {sd} ÷ 平均 {m} = {cv}%'],
    '自由度': ['hist', 'dev', '算標準差時，離均差加總一定是 0，所以只有 n − 1 = 399 個可以自由變動'],
    '長條圖': ['bar', 'bar', '每間醫院的病人數：類別變數用長條，長條之間有間隔'],
    '直方圖': ['hist', 'bar', '把收縮壓切成每 5 mmHg 一組，長條高度＝該組人數'],
    '組數': ['hist', 'bar', '這裡切成 18 組；組數太少看不出形狀，太多則太破碎'],
    '箱型圖': ['box', 'iqr0 iqr1 med0 med1', '箱子＝中間 50%，粗線＝中位數，鬚＝正常範圍內最遠的值'],
    '散佈圖': ['scat', 'pt', '每個點是一位病人：橫軸年齡、縱軸收縮壓'],
    '常態分佈': ['hist', 'norm', '紅色曲線＝平均 {m}、標準差 {sd} 的常態分佈，和長條形狀很接近'],
    'z 分數': ['hist', 'z', '這位病人 {one} 比平均高 {dev}，等於 {z} 個標準差'],
    '百分位': ['hist', 'pct', '綠線＝第 90 百分位數 {p90}：90% 的病人收縮壓比它低'],
    'P(X ≤ x)': ['hist', 'cdf', '紅色區域＝收縮壓 ≤ 160 的病人，占 {c160}%'],
    'Table 1': ['table1', 'row', '研究論文的第一個表：兩組的基本特徵並排比較'],
    '隨機分派試驗': ['design', 'rand', '在各醫院內用隨機方式決定誰吃新藥、誰吃安慰劑'],
    '校正': ['ancova', 'adj', '在基線收縮壓相同的情況下比較兩組：黑線＝校正後差異 {b2}'],
    '臨床意義': ['box', 'diff', '兩組平均差 {diff} mmHg：這個大小對病人重不重要，要由醫學判斷'],
    '機率': ['venn', 'A', '隨機挑一位病人，他吸菸的機率 = {A} ÷ 400 = {pA}'],
    '事件': ['venn', 'A', '「病人吸菸」就是一個事件：藍圈'],
    '餘事件': ['venn', 'notA', '圓圈外的區域：不屬於該事件的所有人'],
    '互斥': ['venn', 'A notA', '「吸菸」與「不吸菸」不可能同時發生：互斥'],
    '條件機率': ['venn', 'cond', '只看糖尿病的 {B} 人（紅圈），其中吸菸 {AB} 人：P(吸菸 | 糖尿病) = {pAgB}'],
    '獨立事件': ['venn', 'AB', '若獨立，兩者都有的比例應接近 P(吸菸) × P(糖尿病) = {pA} × {pB}'],
    '加法法則': ['venn', 'union', 'P(吸菸或糖尿病) = {pA} + {pB} − 重疊的 {pAB} = {pU}'],
    '乘法法則': ['venn', 'AB', 'P(兩者都有) = P(糖尿病) × P(吸菸 | 糖尿病) = {pAB}'],
    '全機率法則': ['venn', 'A', '吸菸的人 = 有糖尿病的吸菸者 + 沒糖尿病的吸菸者'],
    '敏感度': ['diag', 'tp fn', '真的有左心室肥大的人中，被判讀陽性的比例：{sens}%'],
    '特異度': ['diag', 'fp tn', '真的沒有肥大的人中，被判讀陰性的比例：{spec}%'],
    '陽性預測值': ['diag', 'tp fp', '判讀陽性的人中，真的有肥大的比例：{ppv}%'],
    '陰性預測值': ['diag', 'fn tn', '判讀陰性的人中，真的沒有肥大的比例：{npv}%'],
    '偽陽性': ['diag', 'fp', '沒有肥大卻被判讀陽性：{fp} 人'],
    '偽陰性': ['diag', 'fn', '有肥大卻被判讀陰性：{fn} 人'],
    '閾值': ['roc', 'thr', '紅點＝心電圖分數 > 3 判為陽性時的敏感度 {se3}%、特異度 {sp3}%'],
    'ROC 曲線': ['roc', 'curve', '把閾值從高到低移動，每個閾值的（1 − 特異度, 敏感度）連成曲線'],
    'AUC': ['roc', 'auc', '曲線下面積 = {auc}：隨機挑一位有、一位沒有肥大的人，分數排對的機率'],
    'Youden 指數': ['roc', 'you', '紅色線段＝敏感度 + 特異度 − 1 = {j}'],
    '隨機變數': ['pmf', 'bar', '「10 位病人中有反應的人數」事先不知道，可能是 0 到 10'],
    '離散隨機變數': ['pmf', 'bar', '只能是 0、1、2…10 這些整數'],
    '機率分佈': ['pmf', 'bar', '每根長條＝出現該人數的機率，全部加起來 = 1'],
    '期望值': ['pmf', 'ev', '紅色虛線＝長期平均會有 {ev} 人有反應'],
    '累積機率': ['pmf', 'cum', '亮起的長條加總：最多 3 人有反應的機率 {cum}'],
    '大數法則': ['lln', 'run', '病人越多，累積平均（紅線）越穩定地靠近全體平均 {mu}'],
    '白努利試驗': ['pmf', 'k', '每位病人只有「有反應／沒有」兩種結果，就是一次白努利試驗'],
    '二項分佈': ['pmf', 'bar', '10 人、每人反應率 0.43 時，有反應人數的機率分佈'],
    '組合數': ['pmf', 'k', '10 人中剛好 4 人有反應，有 C(10, 4) = {c104} 種組合；機率 {p4}'],
    '常態近似': ['pmf', 'norm', '紅色曲線＝同樣平均與標準差的常態分佈，和長條形狀相近'],
    '連續性校正': ['pmf', 'k norm', '用常態曲線算「剛好 4」時，要算 3.5 到 4.5 之間的面積'],
    'Poisson 分佈': ['pois', 'fit', '紅點＝平均 {m} 的 Poisson 分佈；長條＝實際的不良事件次數'],
    '速率': ['rate', 'r0 r1', '單位時間內發生的事件數：每 100 人日 {r0} 與 {r1} 件'],
    '過度離散': ['pois', 'obs fit', '實際變異數 {vr} ÷ 平均 {m} = {ratio}；大於 1 就是過度離散'],
    '聚集': ['pois', 'obs', '有些病人特別容易出事（例如年長者），事件會集中在少數人身上'],
    '抽樣分佈': ['samp', 'means', '從 400 人中抽 20 人算平均，重複 1,000 次，平均的分佈'],
    '中央極限定理': ['sampcrp', 'means', 'CRP 本身很右偏（藍），但每次 30 人的平均（紅）分佈接近常態'],
    '標準誤': ['samp', 'se', '紅色帶＝樣本平均之間的標準差 {se}（≈ σ ÷ √20 = {th}）'],
    '信賴區間': ['ci', 'ci', '每條線是一次研究的 95% CI；有 {cov} 條涵蓋黑色真值'],
    '涵蓋率': ['ci', 'miss', '紅色是沒涵蓋真值的 {miss} 條；長期下來約 5%'],
    't 分佈': ['nullt', 'curve', '樣本小時，平均差除以標準誤的分佈：比常態分佈尾巴更厚'],
    '臨界值': ['nullt', 'crit', '綠色虛線 ±{tc}：兩側尾巴各占 2.5%'],
    '樣本比例': ['prop', 'phat', '黑色虛線＝{x} ÷ {n} = {ph}'],
    'Wald 法': ['prop', 'wald', '藍線：{wl} 至 {wh}；樣本小時可能超出 0–1'],
    'Wilson 法': ['prop', 'wilson', '紅線：{sl} 至 {sh}；不會超出 0–1'],
    '精確法': ['prop', 'exact', '綠線：用二項分佈直接算，{el} 至 {eh}'],
    '虛無假設': ['nullt', 'h0', '假設 H1 醫院兩組真的沒差，t 值應該照這條曲線分佈'],
    'p 值': ['nullt', 'p', '紅色面積＝虛無假設下，t 至少和觀察到的 {t} 一樣極端的機率：{p}'],
    '顯著水準': ['nullt', 'alpha', '綠色區域合計 5%：事先訂好的 α'],
    '型一錯誤': ['pow', 'alpha', '紅色面積：其實沒有效果，卻落在拒絕區'],
    '檢定力': ['pow', 'pow', '虛線＝真的有效果時的分佈；落在臨界值右邊的部分＝檢定力 {pw}%'],
    '效果量': ['box', 'diff d', '平均差 {diff} 除以標準差：效果量 d = {dd}'],
    "Cohen's d": ['box', 'd', '兩組平均差 ÷ 合併標準差 = {dd}'],
    '單一樣本 t 檢定': ['hist', 'mean ref', '平均（紅線 {m}）和參考值 140（黑色虛線）比較'],
    '參考值': ['hist', 'ref', '黑色虛線＝事先給定的參考值 140 mmHg'],
    '二項檢定': ['btest', 'p obs', '假設反應率 0.3，紅色長條＝和觀察到的 {x} 人一樣或更不可能的結果：{p}'],
    '預期比例': ['btest', 'bar', '假設的比例 0.3：{n} 人預期約 {ex} 人有反應'],
    '卡方適合度檢定': ['bar', 'exp dev', '各醫院人數（長條）和「平均分配 50 人」（虛線）的差距'],
    '排列檢定': ['perm', 'null obs', '把組別標籤隨機打亂 1,000 次，看觀察到的差 {obs} 有多少見'],
    '虛無分佈': ['perm', 'null', '標籤打亂後的平均差分佈：假設兩組沒差時會出現的範圍'],
    'Bootstrap': ['boot', 'means ci', '從同一份樣本放回抽樣 1,000 次；中間 95%（紅色帶）就是信賴區間'],
    '放回抽樣': ['boot', 'means', '每抽出一個人就放回去，同一人可能被抽到好幾次'],
    '事後檢定力': ['pow', 'pow', '檢定力要在研究前依預期效果計算；用觀察到的效果回推沒有新資訊'],
    '單尾檢定': ['nullt', 'one', '只算一側的尾巴：{p1}'],
    '干擾因子': ['dag', 'conf', '年齡同時影響糖尿病與心血管事件'],
    '中介變數': ['dag', 'med', 'BMI → 收縮壓 → 心血管事件：收縮壓在因果路徑中間'],
    '選樣偏差': ['sampbias', 'bias', '只從 55 歲以下抽樣（紅），平均 {mb} 系統性地低於真值 {mu}'],
    '後門路徑': ['dag', 'back', '糖尿病 ← 年齡 → 心血管事件：經過年齡繞回來的路徑'],
    't 檢定': ['box', 'diff sd0 sd1', 't = 平均差 ÷ 標準誤 = {t}'],
    '訊號與雜訊': ['box', 'diff sd0 sd1', '訊號＝兩組平均差 {diff}；雜訊＝每組內部的分散'],
    '平均差': ['box', 'diff', '新藥組 {m1} − 安慰劑組 {m0} = {diff} mmHg'],
    '配對 t 檢定': ['pairdiff', 'mean zero', '每人自己第 4 週 − 基線的差；看平均差 {m} 離 0 多遠'],
    'Welch': ['box', 'sd0 sd1', '兩組標準差 {s0}、{s1} 不必相等'],
    'F 檢定（變異數）': ['box', 'sd0 sd1', '兩組變異數相除：{fr}'],
    '幾何平均數': ['crp', 'gm', '綠線＝取對數後平均再轉回：{gm}，比算術平均 {m} 更接近中間'],
    '平方根轉換': ['crp', 'bar tail', '對右偏的資料開根號，可以把長尾巴縮短'],
    '敏感度分析': ['miss', 'drop', '對退出的 {nd} 人做不同假設，看結論是否改變'],
    'Mann–Whitney': ['rank', 'r0 r1', '把兩組混在一起排名次，比較名次總和：{r0} vs {r1}'],
    '符號檢定': ['pairdiff', 'neg pos', '只數正負：下降的 {neg} 人 vs 上升的 {pos} 人'],
    'Wilcoxon 符號等級檢定': ['pairdiff', 'neg pos zero', '看差值的正負，並考慮差值大小的名次'],
    '名次': ['rank', 'r0 r1', '數值由小到大的排序位置 1, 2, 3…'],
    '卡方檢定': ['smk', 'exp r0 r1', '比較觀察人數和「兩組比例相同」時的期望人數：χ² = {chi2}，{pchi}'],
    '2×2 表': ['smk', 'r0 r1 n0 n1', '吸菸 × 心血管事件：四個格子'],
    '期望次數': ['smk', 'exp', '虛線＝如果吸菸與事件無關，兩組的事件比例都應是 {pool}%；吸菸發生事件的期望人數 {ex}'],
    'Fisher 精確檢定': ['smk', 'r0 r1', '格子人數少時，用超幾何分佈直接算機率'],
    '勝算比': ['smk', 'r0 r1 n0 n1', '吸菸者的勝算 {o1} ÷ 不吸菸者的勝算 {o0} = {or}'],
    '世代研究': ['smk', 'r0 r1', '先依吸菸分組，往後追蹤誰發生事件'],
    '病例對照研究': ['smk', 'r0 r1', '反過來：先找發生事件與沒發生的人，再回頭看吸菸比例'],
    '風險差': ['two2', 'rd', '{p1}% − {p0}% = {rd} 個百分點'],
    '合併比例': ['two2', 'pool', '虛線＝兩組合起來的反應率 {pool}%'],
    'McNemar 檢定': ['kappa', 'dis', '只看兩位醫師意見不同的格子：{b} vs {c}'],
    '不一致對': ['kappa', 'dis', '紅色格子：一位說陽性、另一位說陰性'],
    '觀察一致率': ['kappa', 'agree', '藍色格子（意見相同）的比例：{po}%'],
    '機遇一致率': ['kappa', 'chance', '綠字：只靠運氣也會一致的人數；機遇一致率 {pe}%'],
    'Kappa': ['kappa', 'agree chance', '(觀察一致 {po}% − 機遇一致 {pe}%) ÷ (100% − {pe}%) = {k}'],
    '無母數方法': ['rank', 'r0 r1', '不看原始數值，只用名次比較'],
    'Kruskal–Wallis': ['hosp', 'hm', '多組版本的名次比較：把 8 間醫院的病人一起排名次'],
    '二元變數': ['two2', 'r0 r1 n0 n1', '只有兩種值：有反應／沒有'],
    '線性迴歸': ['scat', 'line', '用直線描述年齡與收縮壓的關係'],
    '邏輯斯迴歸': ['logit', 'curve', 'S 形曲線＝各年齡發生心血管事件的機率'],
    'Cox 迴歸': ['km', 'c0 c1', '比較兩條存活曲線的事件速率：危險比 {hr}'],
    '實驗（experiment）': ['design', 'rand', '研究者決定誰接受新藥'],
    '觀察研究': ['smk', 'r0 r1', '吸菸是病人自己的選擇，研究者只觀察'],
    '偏差': ['sampbias', 'bias mu', '紅色的估計整體偏離黑色真值：系統性的誤差'],
    '抽樣誤差': ['sampbias', 'unb', '藍色：隨機抽樣的平均圍繞真值左右跳動，寬約 ±{sa}'],
    '精確度': ['ci', 'ci', '每條區間越短，估計越精確'],
    '安慰劑': ['design', 'ctrl', '外觀相同但沒有藥效的藥丸'],
    '隨機分派': ['design', 'rand', '用隨機方式決定組別，讓兩組在已知與未知因素上都相近'],
    '盲化': ['design', 'blind', '病人與評估者都不知道組別'],
    '實驗單位': ['design', 'unit', '藥是給每一位病人吃的：病人就是實驗單位'],
    '重複（replication）': ['design', 'rep', '每組有 200 位病人，而不是只有 1 位'],
    '區集': ['design', 'block', '在每間醫院內各自隨機分派：醫院就是區集'],
    'ANOVA': ['hosp', 'between within', '比較醫院之間（紅）與醫院之內（藍）的變異：F = {F}'],
    'F 值': ['hosp', 'between within', '組間均方 {msb} ÷ 組內均方 {msw} = {F}'],
    '平方和': ['hosp', 'between within', '每段距離平方後加總：組間 {ssb}、組內 {ssw}'],
    '均方': ['hosp', 'between', '平方和 ÷ 自由度：組間 {msb}、組內 {msw}'],
    'η²': ['hosp', 'between', '組間平方和占總平方和的 {eta}%'],
    '組間變異': ['hosp', 'between', '紅色線段＝各醫院平均離總平均的距離'],
    '組內變異': ['hosp', 'within', '藍色細線＝每位病人離自己醫院平均的距離'],
    '事後比較': ['hosp', 'hm', 'ANOVA 之後，兩兩比較醫院平均'],
    '獨立性': ['spag', 'ind', '同一位病人的 4 次測量彼此相關，不是獨立的'],
    '常態性': ['qq', 'qq', '點落在虛線上：收縮壓接近常態分佈'],
    '變異數同質性': ['hosp', 'sdbar', '綠色線＝各醫院 ± 1 SD，長度從 {smin} 到 {smax}'],
    'Q-Q 圖': ['qqcrp', 'qq', 'CRP 的點在右上角彎離虛線：右偏'],
    'Levene 檢定': ['hosp', 'sdbar', '比較各醫院內部的分散程度（綠色線長度）'],
    'Welch ANOVA': ['hosp', 'sdbar hm', '各醫院標準差不相等時也能比較平均'],
    '對數轉換': ['crplog', 'bar', '取對數後，右偏的 CRP 變得接近對稱'],
    '家族錯誤率': ['mtest', 'p a', '同時做 {m} 個檢定，至少一個誤判的機率高達 {fw}%'],
    '計畫比較': ['hosp', 'hm', '事先只計畫比較少數幾組，例如 H1 vs H8'],
    'Tukey HSD': ['hosp', 'hm', '同時比較 8 間醫院所有兩兩組合，控制家族錯誤率'],
    'Dunnett 檢定': ['hosp', 'hm', '每一組只和一個對照組比較'],
    '學生化全距分佈': ['hosp', 'hm', '最大與最小平均之差（{rg}）÷ 標準誤 的分佈'],
    '字母標記': ['hosp', 'hm', '共用同一個字母的組之間，沒有達到設定的差異標準'],
    '因子設計': ['inter', 'b0 b1', '同時看藥物（橫軸）與性別（兩條線）'],
    '主效果': ['inter', 'mainA', '◆＝不分性別時兩組的平均：藥物的主效果'],
    '交互作用圖': ['inter', 'b0 b1', '兩條線：女性與男性各自的藥物效果'],
    '簡單效果': ['inter', 'b0', '只看某一性別時的藥物效果'],
    '平衡設計': ['inter', 'b0 b1', '每種組合的人數相同或相近'],
    '交互作用': ['inter', 'inter', '虛線＝如果沒有交互作用應有的平行線；實線偏離多少就是交互作用'],
    '隨機完全區集設計': ['design', 'block', '每間醫院內，新藥與安慰劑各占一半'],
    '重複測量': ['spag', 'ind', '每條細線是一位病人第 0、4、8、12 週的血壓'],
    '球形假設': ['spag', 'ind', '任兩次測量之差的變異數都要相同'],
    'Greenhouse–Geisser 校正': ['spag', 'ind', '球形假設不成立時，把自由度打折'],
    'Friedman 檢定': ['spag', 'ind', '每位病人自己 4 次測量排名次，再比較'],
    '混合設計': ['spag', 'gm0 gm1', '組別在受試者之間，時間在受試者之內'],
    '固定效果': ['inter', 'mainA', '藥物是研究者想比較的特定處理'],
    '隨機效果': ['shrink', 'raw tau', '8 間醫院是從許多醫院中抽出的樣本'],
    '變異成分': ['shrink', 'tau', '醫院之間 τ = {tau}、醫院之內 σ = {sg}'],
    '組內相關係數': ['shrink', 'tau', 'τ² ÷ (τ² + σ²) = {icc}'],
    '設計效應': ['shrink', 'tau', '每院約 50 人：1 + 49 × ICC = {de}'],
    '有效樣本數': ['shrink', 'tau', '400 ÷ 設計效應 ≈ {neff} 個獨立的人'],
    '共變數': ['ancova', 'cov', '基線收縮壓：會影響結果、但不是研究重點的連續變數'],
    '共變數分析': ['ancova', 'l0 l1 adj', '同時放入組別與基線收縮壓：兩條平行線'],
    '校正後平均': ['ancova', 'adj', '在相同基線收縮壓（{mx}）下的兩組預測值，相差 {b2}'],
    '平行斜率': ['ancova', 'l0 l1', '兩條線的斜率都是 {b1}'],
    '線性模型': ['ancova', 'l0 l1', 'y = β₀ + β₁·基線 + β₂·新藥'],
    '相關係數': ['scat', 'pt line', '年齡與收縮壓：r = {r}'],
    'Spearman': ['scat', 'pt', '用名次算的相關係數：{rho}'],
    'r²': ['scat', 'res line', '收縮壓的變異中，有 {r2} 可以用年齡解釋'],
    '簡單線性迴歸': ['scat', 'line', '收縮壓 = {int} + {slope} × 年齡'],
    '預測區間': ['scat', 'pb', '綠色帶＝下一位病人的收縮壓可能落在的範圍'],
    '信賴帶': ['scat', 'cb', '紅色窄帶＝平均收縮壓的 95% CI；中間最窄'],
    '外推': ['scat0', 'ext', '虛線超出資料範圍（40 歲以下）：直線關係不一定成立'],
    '迴歸係數': ['scat', 'slope', '年齡的係數 = {slope}：每多 1 歲收縮壓高這麼多'],
    '虛擬變數': ['ancova', 'l1', '新藥 = 1、安慰劑 = 0；係數＝兩條線的距離 {b2}'],
    '參考組': ['ancova', 'l0', '安慰劑組是參考組（虛擬變數 = 0）'],
    '基線': ['ancova', 'cov', '研究開始時的收縮壓'],
    '殘差圖': ['resid', 'pt zero', '殘差對預測值：沒有形狀、均勻散在 0 附近最理想'],
    '槓桿值': ['scat', 'lev', '綠圈：年齡最極端的病人，對直線的位置影響力大'],
    '影響點': ['scat', 'cook', '紅圈：拿掉後直線變化最大的點'],
    'Cook 距離': ['scat', 'cook', '紅圈：Cook 距離最大的 3 點，最大 {cook}'],
    '二次項': ['scat', 'pt line', '如果點呈現彎曲，可以加入年齡²'],
    '勝算': ['logit', 'odds', '70 歲時機率 {p70}%，勝算 = p ÷ (1 − p) = {o70}'],
    'e^β': ['logit', 'curve', '年齡每多 1 歲，勝算乘以 {or1}（每 10 歲 {or10}）'],
    '對數概似': ['like', 'curve', '每個參數值下觀察到這份資料的機率取對數；頂點最貼合資料'],
    '率比': ['rate', 'r0 r1 rr', '新藥 {r1} ÷ 安慰劑 {r0} = {rr}'],
    'Poisson 迴歸': ['rate', 'r0 r1', '用事件數與人時建模，係數取 e 次方就是率比'],
    '位移項': ['rate', 'pt', '把 log(人時) 放進模型，讓結果變成「率」'],
    '離散度': ['pois', 'obs fit', '變異數 ÷ 平均 = {ratio}'],
    '一致性': ['ba', 'pt bias loa', '兩台血壓計量同一個人，差多少'],
    '偏差（一致性）': ['ba', 'bias', '紅線＝B 平均比 A 高 {bias} mmHg'],
    '一致性界限': ['ba', 'loa', '綠色虛線＝95% 的差值落在 {lo} 至 {hi}'],
    '比例偏差': ['ba', 'prop', '黃線向上傾斜：血壓越高，兩台差越多（斜率 {slope}）'],
    'Bland–Altman 圖': ['ba', 'pt', '橫軸兩台平均、縱軸兩台差'],
    '分層': ['strata', 's0 s1', '分成女性、男性各算一次勝算比'],
    '辛普森悖論': ['strata', 'crude s0 s1', '合併計算與分層計算的方向可能相反'],
    'Mantel–Haenszel 勝算比': ['strata', 'mh', '把各層勝算比加權合併：{mh}'],
    '粗勝算比': ['strata', 'crude', '不分層直接計算：{crude}'],
    '效果修飾': ['strata', 's0 s1', '女性 {oF} vs 男性 {oM}：效果在不同層不一樣'],
    '粗率': ['std', 'crude', '不考慮年齡：不吸菸 {c0}%、吸菸 {c1}%'],
    '年齡標準化率': ['std', 'std', '套用同一個年齡結構：不吸菸 {s0}%、吸菸 {s1}%'],
    '標準化死亡比': ['std', 'strat std', '觀察到的事件數 ÷ 依標準族群年齡別率算出的預期數'],
    '族群歸因分率': ['std', 'crude', '全體的事件中，因吸菸而多出來的比例：{paf}%'],
    '暴露組歸因分率': ['std', 'crude', '吸菸者的事件中，因吸菸而多出來的比例：{afe}%'],
    'Kaplan–Meier': ['km', 'c0 c1', '每發生一個事件，曲線往下走一階'],
    '中位存活時間': ['km', 'med', '曲線降到 0.5 的時間；這裡 36 個月內還沒降到一半'],
    '危險比': ['km', 'c0 c1', '新藥組事件速率 ÷ 安慰劑組 = {hr}'],
    '比例風險假設': ['loglog', 'c0 c1', '兩條線大致平行：危險比不隨時間改變'],
    'log(−log) 圖': ['loglog', 'c0 c1', 'ln(−ln S) 對 ln(時間)：平行代表比例風險'],
    'Schoenfeld 殘差': ['loglog', 'c0 c1', '檢查危險比是否隨時間改變的殘差'],
    '分層 Cox 模型': ['km', 'c0 c1', '每層有自己的基準風險曲線'],
    '概似函數': ['like', 'curve', '{x}/{n} 人有反應時，每個反應率 p 的對數概似'],
    '最大概似估計': ['like', 'mle', '曲線頂點：p̂ = {ph}'],
    '概似比統計量': ['like', 'lr', '頂點與 p = 0.5 處的高度差 × 2 = {g}'],
    '概似比檢定': ['like', 'lr', '比較頂點和虛無假設處的高度'],
    '概似信賴區間': ['like', 'ci', '比頂點低不到 1.92 的範圍：{lo} 至 {hi}'],
    'AIC': ['like', 'mle', '−2 × 最大對數概似 + 2 × 參數數；比較模型時越小越好'],
    '頻率學派': ['ci', 'ci', '真值固定；95% 指重複研究時有 95% 的區間會涵蓋它'],
    '貝氏統計': ['bayes', 'pri post', '事前分佈（藍虛線）＋資料 → 後驗分佈（紅）'],
    '事前分佈': ['bayes', 'pri', '藍色虛線 Beta({a}, {b})：看資料前認為反應率約 30%'],
    '後驗分佈': ['bayes', 'post', '紅線 Beta({A}, {B})：結合 {x}/{n} 人的資料後'],
    '後驗平均': ['bayes', 'pm', '後驗分佈的平均 {pm}'],
    '可信區間': ['bayes', 'cri', '後驗中間 95%：{lo} 至 {hi}'],
    '後驗機率': ['bayes', 'pp', '反應率 > 30% 的後驗機率 {pp}'],
    '多重檢定': ['mtest', 'p', '{m} 個基線變數逐一比較，兩組本來就是隨機分派的'],
    '偽發現率': ['mtest', 'bh', '被判為有差異的結果中，預期有多少比例是假的'],
    'Bonferroni': ['mtest', 'bonf', '紅線 0.05 ÷ {m}：每個檢定的門檻變嚴'],
    'Benjamini–Hochberg': ['mtest', 'bh', '綠線：第 i 小的 p 值和 0.05 × i ÷ {m} 比較'],
    '轉錄體': ['mtest', 'p', '一次量上萬個基因，等於做上萬個檢定'],
    '混合模型': ['shrink', 'raw blup', '同時估計整體平均與醫院之間的差異'],
    '隨機截距': ['shrink', 'raw', '每間醫院有自己的基準高度'],
    '隨機斜率': ['spag', 'ind', '每位病人血壓下降的速度不同'],
    '部分匯集': ['shrink', 'shr', '每間醫院的估計往總平均拉近'],
    '縮減': ['shrink', 'shr blup', '人數少的醫院被拉得比較多（最小醫院權重 {l0}）'],
    '廣義估計方程式': ['shrink', 'gm', '只估計整體平均關係，再修正標準誤'],
    '穩健標準誤': ['shrink', 'gm', '用資料本身估計群集內相關造成的不確定性'],
    'REML': ['shrink', 'tau', '估計 τ 與 σ 的方法'],
    '群集': ['hosp', 'pt hm', '同一間醫院的病人彼此較相似'],
    '偽重複': ['spag', 'ind', '20 位病人 × 4 次＝80 個數字，但只有 20 個獨立的人'],
    '完全案例分析': ['miss', 'obs', '只用藍點：排除第 12 週沒量到的 {nd} 人'],
    '完全隨機缺失': ['miss', 'drop', '若空心點隨機散布在各年齡，就是完全隨機缺失'],
    '隨機缺失': ['miss', 'drop', '退出者（空心）平均 {a1} 歲，比留下者 {a0} 歲大：缺失和年齡有關'],
    '非隨機缺失': ['miss', 'drop', '如果是第 12 週血壓高的人才退出，就無法從看得到的資料判斷'],
    '平均值填補': ['missfill', 'fill', '{nm} 個缺值全補成平均（紅柱）：標準差從 {s0} 降到 {s1}'],
    '多重插補': ['missfill', 'mi', '綠點：依基線血壓加上隨機誤差，每個缺值補 3 次'],
    'Rubin 法則': ['missfill', 'mi', '把每份補好的資料分別分析，再合併'],
    '統合分析': ['forest', 'st fe re', '8 間醫院各自的效果，合併成菱形'],
    '系統性回顧': ['forest', 'st', '先找齊所有研究，才合併'],
    '固定效果模型': ['forest', 'fe', '黑菱形：假設各醫院真實效果相同，合併 {fe}'],
    '隨機效果模型': ['forest', 're', '紅菱形：允許各醫院真實效果不同，合併 {re}'],
    '研究間變異數': ['forest', 'het', '各研究真實效果之間的變異：τ² = {tau}'],
    '異質性': ['forest', 'het', '紅色線段＝各醫院效果離合併值的距離；Q = {q}'],
    'I²': ['forest', 'het', '觀察到的差異中，來自真實差異的比例：{i2}%'],
    '森林圖': ['forest', 'st', '方塊＝各研究效果（越大權重越高），菱形＝合併'],
    '發表偏差': ['funnel', 'st', '如果某一側的小研究（下方）缺很多，就要懷疑'],
    '漏斗圖': ['funnel', 'st fe', '精確度越低（越下面），點越分散，形成漏斗'],
    '優越性試驗': ['equiv', 'sup', '整個 CI 在 0 的右邊'],
    '不劣性試驗': ['equiv', 'ni zone', 'CI 下限在 −Δ 的右邊'],
    '等效性試驗': ['equiv', 'eq zone', '90% CI 整個落在 ±Δ 之內'],
    '不劣性界限': ['equiv', 'zone', '藍色帶的邊界 ±Δ（這裡 Δ = 5）'],
    '雙單尾檢定': ['equiv', 'eq zone', '兩次單尾檢定：不比 −Δ 差、也不比 +Δ 好'],
    '平行設計': ['design', 'trt ctrl', '每人只接受一種處理'],
    '交叉設計': ['cross', 'per1 per2', '每人先後接受兩種處理，順序隨機'],
    '洗除期': ['cross', 'wash', '兩期之間的空檔，讓藥效消失'],
    '時期效應': ['cross', 'per2', '第 2 期本身就可能和第 1 期不同'],
    '延滯效應': ['cross', 'carry', '第 1 期的藥效延續到第 2 期'],
    '非監督式學習': ['pca', 'pt', '只用 6 項抽血值找結構，不看任何結果變數'],
    '主成分分析': ['pca', 'pc1 pc2', '6 項抽血值壓縮成 2 個方向；紅點＝糖尿病'],
    '第一主成分': ['pca', 'pc1', '資料最分散的方向，解釋 {p1}% 的變異'],
    '第二主成分': ['pca', 'pc2', '與 PC1 垂直、次分散的方向，解釋 {p2}%'],
    '載荷': ['load', 'l1', '藍色長條：每項抽血值在 PC1 上的權重'],
    '解釋的變異比例': ['scree', 'top', '前兩個主成分合計 {p1}% + {p2}%'],
    '陡坡圖': ['scree', 'line', '各主成分解釋的變異比例依序排列'],
    '分群': ['kmean', 'cl', '依相似度把病人分成 2 群'],
    'k-means': ['kmean', 'cl cent', '× 是群中心；每人歸到最近的中心'],
    '群內平方和': ['kmean', 'wss', '細線＝每人到群中心的距離；平方加總 {wss}'],
    '階層式分群': ['dendro', 'tree', '8 間醫院依病人特徵逐步合併'],
    '樹狀圖': ['dendro', 'tree leaf', '越早（越低處）合併的醫院越相似'],
    '統計分析計畫': ['mtest', 'p', '事先寫好要比較什麼，避免事後挑結果'],
    'p-hacking': ['mtest', 'p', '{m} 個比較中，最小的 p 值 {mn}：挑著報告就會誤導'],
    '誤差線': ['err', 'sd se ci', '同一份資料，誤差線可以代表 SD、SE 或 95% CI，長度差很多'],
    '次群組分析': ['forest', 'st', '每間醫院是一個次群組：小樣本的效果跳動很大'],
  };
  const cache = {};
  return {
    has: t => !!M[t],
    html(term, w) {
      const m = M[term]; if (!m) return '';
      const [f, keys, cap] = m, cw = Math.round(Math.max(280, Math.min(560, w || 360))), ck = f + '|' + cw, old = CW;
      if (!cache[ck]) { CW = cw; try { cache[ck] = FIG[f](); } finally { CW = old; } }
      const o = cache[ck], txt = cap.replace(/\{(\w+)\}/g, (_, k) => (typeof o.v[k] === 'number' ? (Number.isInteger(o.v[k]) ? o.v[k].toLocaleString() : F.n(o.v[k])) : o.v[k] ?? ''));
      return `<figure class="tfig" data-keys="${keys}">${o.svg}<figcaption>${esc(txt)}</figcaption></figure>`;
    },
    mark(root) {
      $$('.tfig', root).forEach(fg => { const ks = fg.dataset.keys.split(' '); $$('[data-k]', fg).forEach(e => e.classList.toggle('on', (e.getAttribute('data-k') || '').split(' ').some(k => ks.includes(k)))); $$('svg', fg).forEach(s => s.classList.toggle('focus', !!s.querySelector('.on'))); });
    },
    terms: () => Object.keys(M),
    figs: () => Object.keys(FIG),
  };
})();

// 各章上方互動圖中，名詞對應的 data-k（空白分隔）。沒有對應的名詞改顯示 TFIG 小圖
const WTERM = {
  'c0-1': { '百分點': 'ard', '絕對差': 'ard', '相對變化': 'rrr', '風險比': 'rr', '需治療人數': 'nnt', '事件率': 'pa pb', '對照組': 'pa' },
  'c0-2': { 'Σ': 'sum', '離均差': 'ss' },
  'c0-3': { '對數': 'lfc', '倍數變化': 'fc', 'log₂FC': 'lfc' },
  'c1-1': { '名目變數': 'nom', '順序變數': 'ord', '連續變數': 'cont', '計數變數': 'count', '時間至事件': 'tte', '設限': 'cens' },
  'c1-2': { '平均數': 'mean', '中位數': 'med', '極端值': 'tail', '偏態': 'tail mean med', '穩健': 'med tail' },
  'c1-3': { '標準差': 'sdA sdB', '變異數': 'sdA sdB', '四分位距': 'iqrA iqrB', '四分位數': 'iqrA iqrB', '變異係數': 'sdA sdB' },
  'graphs': { '直方圖': 'bins', '組數': 'bins', '箱型圖': 'iqr0 med0', '長條圖': 'mean' },
  'c1-4': { '常態分佈': 'curve', 'z 分數': 'z', '百分位': 'pl', 'P(X ≤ x)': 'pl' },
  'c1-5': { 'Table 1': 'v0' },
  'prob-rules': { '機率': 'pa', '事件': 'pa', '條件機率': 'pbga', '獨立事件': 'ind', '加法法則': 'paob', '乘法法則': 'pab', '全機率法則': 'pb' },
  'c2-1': { '敏感度': 'sens', '特異度': 'spec', '陽性預測值': 'ppv', '陰性預測值': 'npv', '偽陽性': 'fp', '偽陰性': 'fn' },
  'roc': { '閾值': 'thr', 'AUC': 'auc', 'Youden 指數': 'youden', '敏感度': 'sens', '特異度': 'spec' },
  'rv': { '隨機變數': 'bar', '離散隨機變數': 'bar', '機率分佈': 'bar', '期望值': 'ex', '累積機率': 'cdf', '大數法則': 'sim' },
  'binom': { '二項分佈': 'bar', '組合數': 'pk', '常態近似': 'napp', '連續性校正': 'napp', '期望值': 'ex' },
  'poisson': { 'Poisson 分佈': 'fit', '速率': 'ex', '過度離散': 'var', '聚集': 'var' },
  'c2-2': { '抽樣分佈': 'means', '中央極限定理': 'means pop', '標準誤': 'se' },
  'c2-3': { '信賴區間': 'wd', '涵蓋率': 'hit miss', '真值': 'mu' },
  'tdist': { 't 分佈': 'tail', '臨界值': 'tc' },
  'prop-ci': { 'Wald 法': 'wald', 'Wilson 法': 'wilson', '精確法': 'exact', '樣本比例': 'wilson' },
  'c2-4': { 'p 值': 'pv sig', '顯著水準': 'sig', '型一錯誤': 'sig', '檢定力': 'th' },
  'one-t': { '單一樣本 t 檢定': 't', '參考值': 'mu0', '信賴區間': 'ci', '標準誤': 'se', 'p 值': 'p' },
  'binom-test': { '二項檢定': 'p', '預期比例': 'h0', 'p 值': 'p' },
  'gof': { '卡方適合度檢定': 'chi2', '期望次數': 'exp' },
  'boot': { '排列檢定': 'pp obs', '虛無分佈': 'null pp', 'Bootstrap': 'bd bci', '放回抽樣': 'bd' },
  'c4-5': { '檢定力': 'n' },
  'c5-1': { '干擾因子': 'conf', '後門路徑': 'back', '校正': 'adj' },
  'c3-1': { 't 檢定': 't', '訊號與雜訊': 'diff se', '平均差': 'diff', "Cohen's d": 'd', '效果量': 'd', 'p 值': 'p', '標準誤': 'se' },
  'two-assume': { '幾何平均數': 'diff', 'F 檢定（變異數）': 'sd0 sd1', 'Q-Q 圖': 'qq', 'Levene 檢定': 'sd0 sd1', '常態性': 'qq', 'Mann–Whitney': 'rank', 'Welch': 'mean0 mean1' },
  'nonpar': { 'Mann–Whitney': 'ra rb', '符號檢定': 'pos', 'Wilcoxon 符號等級檢定': 'pos neg', '名次': 'ra rb' },
  'c3-3': { '2×2 表': 'or chi fis', '勝算比': 'or', '風險比': 'rr', '卡方檢定': 'chi', 'Fisher 精確檢定': 'fis' },
  'two-prop': { '風險差': 'ci diff', '事件率': 'p1 p2' },
  'mcnemar': { 'McNemar 檢定': 'b c', '不一致對': 'b c' },
  'kappa': { '觀察一致率': 'po', '機遇一致率': 'pe', 'Kappa': 'kap' },
  'exp-design': { '偏差': 'bias', '精確度': 'sd', '抽樣誤差': 'sd' },
  'c3-2': { 'ANOVA': 'ssb ssw', 'F 值': 'F', '平方和': 'sst ssb ssw', '均方': 'msb msw', 'η²': 'eta', '組間變異': 'ssb', '組內變異': 'ssw' },
  'anova-assume': { '常態性': 'qq', 'Q-Q 圖': 'qq', '變異數同質性': 'spread', 'Levene 檢定': 'spread', 'Welch ANOVA': 'means', 'Kruskal–Wallis': 'rank' },
  'posthoc': { '字母標記': 'cld', 'Tukey HSD': 'allp sigp', '家族錯誤率': 'allp', '事後比較': 'allp' },
  'twoway': { '主效果': 'mainA mainB', '交互作用': 'inter', '交互作用圖': 'b0 b1', '簡單效果': 'se0 se1' },
  'block': { '區集': 'blk', '隨機完全區集設計': 'blk trt' },
  'repeated': { '重複測量': 'subj', 'Greenhouse–Geisser 校正': 'time' },
  'random-eff': { '變異成分': 'vb vw', '組內相關係數': 'icc', '設計效應': 'pts', '有效樣本數': 'pts', '隨機效果': 'vb' },
  'ancova': { '共變數分析': 'adj', '校正後平均': 'adj', '平行斜率': 'inter', '共變數': 'adj' },
  'c0-4': { '斜率': 'b', '截距': 'a', '殘差': 'ssr', '殘差平方和': 'ssr', '最小平方法': 'best' },
};
