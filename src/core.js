// ==PURE-BEGIN==
/* ---------- 統計核心 ---------- */
const S = (() => {
  const LG = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  function lgamma(x) { let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const c of LG) s += c / ++y; return -t + Math.log(2.5066282746310005 * s / x); }
  function betacf(a, b, x) {
    const FP = 1e-300; const qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d;
    for (let m = 1; m <= 400; m++) {
      const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-15) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function gser(a, x) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 1000; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; } return sum * Math.exp(-x + a * Math.log(x) - lgamma(a)); }
  function gcf(a, x) {
    const FP = 1e-300; let b = x + 1 - a, c = 1 / FP, d = 1 / b, h = d;
    for (let i = 1; i < 1000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < FP) d = FP; c = b + an / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; }
    return Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
  }
  const gammaQ = (a, x) => x <= 0 ? 1 : x < a + 1 ? 1 - gser(a, x) : gcf(a, x);
  const pnorm = z => { const q = 0.5 * gammaQ(0.5, z * z / 2); return z < 0 ? q : 1 - q; };
  const pz2 = z => gammaQ(0.5, z * z / 2);
  function qnorm(p) {
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425; let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const pt2 = (t, df) => ibeta(df / (df + t * t), df / 2, 0.5);
  const pt = (t, df) => { const p = 0.5 * pt2(t, df); return t < 0 ? p : 1 - p; };
  function qt(p, df) { let lo = -1e4, hi = 1e4; for (let i = 0; i < 120; i++) { const m = (lo + hi) / 2; if (pt(m, df) < p) lo = m; else hi = m; } return (lo + hi) / 2; }
  const pf = (F, d1, d2) => F <= 0 ? 1 : ibeta(d2 / (d2 + d1 * F), d2 / 2, d1 / 2);
  const pchisq = (x, k) => gammaQ(k / 2, x / 2);

  const sum = a => { let s = 0; for (const v of a) s += v; return s; };
  const mean = a => sum(a) / a.length;
  const variance = a => { const m = mean(a); let s = 0; for (const v of a) s += (v - m) ** 2; return s / (a.length - 1); };
  const sd = a => Math.sqrt(variance(a));
  function quantile(a, q) { const s = Float64Array.from(a).sort(); const h = (s.length - 1) * q, lo = Math.floor(h), hi = Math.min(lo + 1, s.length - 1); return s[lo] + (h - lo) * (s[hi] - s[lo]); }
  const median = a => quantile(a, 0.5);
  function skew(a) { const n = a.length; if (n < 3) return 0; const m = mean(a); let m2 = 0, m3 = 0; for (const v of a) { const d = v - m; m2 += d * d; m3 += d * d * d; } m2 /= n; m3 /= n; return m2 > 0 ? m3 / Math.pow(m2, 1.5) : 0; }
  function minmax(a) { let lo = Infinity, hi = -Infinity; for (const v of a) { if (v < lo) lo = v; if (v > hi) hi = v; } return [lo, hi]; }
  function rank(a) {
    const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = new Array(a.length), ties = [];
    for (let i = 0; i < idx.length;) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; const avg = (i + j) / 2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = avg; if (j > i) ties.push(j - i + 1); i = j + 1; }
    return { r, ties };
  }
  const tieSum = ties => ties.reduce((s, t) => s + t * t * t - t, 0);

  function welch(a, b) {
    const n1 = a.length, n2 = b.length, m1 = mean(a), m2 = mean(b), v1 = variance(a), v2 = variance(b);
    const se = Math.sqrt(v1 / n1 + v2 / n2), diff = m2 - m1, t = diff / se;
    const df = (v1 / n1 + v2 / n2) ** 2 / ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1));
    const tc = qt(0.975, df), sp = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
    return { n1, n2, m1, m2, s1: Math.sqrt(v1), s2: Math.sqrt(v2), diff, se, t, df, p: se > 0 ? pt2(t, df) : NaN, ci: [diff - tc * se, diff + tc * se], d: diff / sp };
  }
  function mannWhitney(a, b) {
    const n1 = a.length, n2 = b.length, N = n1 + n2; const { r, ties } = rank([...a, ...b]);
    let R2 = 0; for (let i = n1; i < N; i++) R2 += r[i];
    const U = R2 - n2 * (n2 + 1) / 2, mu = n1 * n2 / 2;
    const sig = Math.sqrt(n1 * n2 / 12 * ((N + 1) - tieSum(ties) / (N * (N - 1))));
    const cc = U > mu ? -0.5 : U < mu ? 0.5 : 0; const z = sig > 0 ? (U - mu + cc) / sig : 0;
    return { U, z, p: pz2(z) };
  }
  function pairedT(x, y) {
    const d = y.map((v, i) => v - x[i]), n = d.length, md = mean(d), sdd = sd(d), se = sdd / Math.sqrt(n), df = n - 1, t = md / se, tc = qt(0.975, df);
    return { n, md, sdd, se, t, df, p: se > 0 ? pt2(t, df) : NaN, ci: [md - tc * se, md + tc * se], dz: md / sdd, d };
  }
  function wilcoxonSR(d) {
    const nz = d.filter(v => v !== 0), n = nz.length; if (n < 1) return { V: 0, z: 0, p: NaN, n };
    const { r, ties } = rank(nz.map(Math.abs)); let V = 0; nz.forEach((v, i) => { if (v > 0) V += r[i]; });
    const mu = n * (n + 1) / 4, sig = Math.sqrt(n * (n + 1) * (2 * n + 1) / 24 - tieSum(ties) / 48);
    const cc = V > mu ? -0.5 : V < mu ? 0.5 : 0; const z = sig > 0 ? (V - mu + cc) / sig : 0;
    return { V, z, p: pz2(z), n };
  }
  function anova(groups) {
    const k = groups.length, all = groups.flat(), N = all.length, gm = mean(all); let ssb = 0, ssw = 0;
    for (const g of groups) { const m = mean(g); ssb += g.length * (m - gm) ** 2; for (const v of g) ssw += (v - m) ** 2; }
    const df1 = k - 1, df2 = N - k, msb = ssb / df1, msw = ssw / df2, F = msb / msw;
    return { F, df1, df2, p: pf(F, df1, df2), ssb, ssw, msb, msw, eta2: ssb / (ssb + ssw) };
  }
  // 學生化全距分佈（Tukey 事後比較用）：P(Q ≤ q) = ∫ g(s) · W(q·s) ds
  // g 為 √(χ²_ν / ν) 的密度，W(w) = k ∫ φ(z) [Φ(z) − Φ(z − w)]^(k−1) dz；以分段 Gauss–Legendre 數值積分
  const GL = (() => { const x = [-0.9894009349916499, -0.9445750230732326, -0.8656312023878318, -0.7554044083550030, -0.6178762444026438, -0.4580167776572274, -0.2816035507792589, -0.0950125098376374], w = [0.0271524594117541, 0.0622535239386479, 0.0951585116824928, 0.1246289712555339, 0.1495959888165767, 0.1691565193950025, 0.1826034150449236, 0.1894506104550685]; return { x: [...x, ...x.map(v => -v).reverse()], w: [...w, ...[...w].reverse()] }; })();
  const integ = (f, a, b, segs) => { let s = 0; const h = (b - a) / segs; for (let i = 0; i < segs; i++) { const c0 = a + (i + 0.5) * h; for (let j = 0; j < 16; j++) s += GL.w[j] * f(c0 + GL.x[j] * h / 2); } return s * h / 2; };
  const erfcFast = x => { const z = Math.abs(x), t = 1 / (1 + 0.5 * z), r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; };
  const PhiF = z => 0.5 * erfcFast(-z / Math.SQRT2), phi = z => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const rangeCdf = (w, k) => (w <= 0 ? 0 : Math.min(1, k * integ(z => phi(z) * Math.pow(Math.max(0, PhiF(z) - PhiF(z - w)), k - 1), -8, 8 + w, 12)));
  function ptukey(q, k, df) {
    if (q <= 0) return 0;
    if (df > 5000) return rangeCdf(q, k);
    const lg = Math.log(df) * df / 2 - lgamma(df / 2) - (df / 2 - 1) * Math.LN2, sd = 1 / Math.sqrt(2 * df), lo = Math.max(0, 1 - 9 * sd), hi = 1 + 12 * sd;
    return Math.min(1, integ(s => (s <= 0 ? 0 : Math.exp(lg + (df - 1) * Math.log(s) - df * s * s / 2) * rangeCdf(q * s, k)), lo, hi, 10));
  }
  const qtCache = {};
  function qtukey(p, k, df) { const key = `${p}|${k}|${df}`; if (qtCache[key]) return qtCache[key]; let lo = 0, hi = 50; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (ptukey(m, k, df) < p) lo = m; else hi = m; } return (qtCache[key] = (lo + hi) / 2); }
  // Tukey–Kramer 兩兩比較（各組人數可不同）
  function tukey(groups) {
    const A = anova(groups), k = groups.length, qc = qtukey(0.95, k, A.df2), out = [];
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) {
      const diff = mean(groups[j]) - mean(groups[i]), se = Math.sqrt(A.msw / 2 * (1 / groups[i].length + 1 / groups[j].length)), q = Math.abs(diff) / se;
      out.push({ i, j, diff, q, p: 1 - ptukey(q, k, A.df2), ci: [diff - qc * se, diff + qc * se] });
    }
    return { pairs: out, qcrit: qc, df: A.df2, msw: A.msw };
  }
  // 二因子 ANOVA（含交互作用）。a、b 為各觀察值所屬水準的編號（0 起算）。
  // 以模型比較計算 Type II 平方和：主效果各自校正另一個主效果，交互作用校正兩個主效果；平衡設計時與 R 的 aov() 相同
  function twoway(y, a, b) {
    const na = Math.max(...a) + 1, nb = Math.max(...b) + 1, N = y.length;
    const cols = (useA, useB, useAB) => y.map((_, i) => { const r = [1]; if (useA) for (let l = 1; l < na; l++) r.push(a[i] === l ? 1 : 0); if (useB) for (let l = 1; l < nb; l++) r.push(b[i] === l ? 1 : 0); if (useAB) for (let l = 1; l < na; l++) for (let m = 1; m < nb; m++) r.push(a[i] === l && b[i] === m ? 1 : 0); return r; });
    const rss = X => { const XtX = X[0].map((_, p) => X[0].map((__, q) => X.reduce((s, r) => s + r[p] * r[q], 0))), Xty = X[0].map((_, p) => X.reduce((s, r, i) => s + r[p] * y[i], 0)), V = inv(XtX), bb = V.map(r => dot(r, Xty)); return y.reduce((s, v, i) => s + (v - dot(X[i], bb)) ** 2, 0); };
    const rFull = rss(cols(1, 1, 1)), rAB = rss(cols(1, 1, 0)), rA = rss(cols(1, 0, 0)), rB = rss(cols(0, 1, 0)), my = mean(y), sst = y.reduce((s, v) => s + (v - my) ** 2, 0);
    const dfE = N - na * nb, mse = rFull / dfE, row = (ss, df) => ({ ss, df, ms: ss / df, F: ss / df / mse, p: pf(ss / df / mse, df, dfE) });
    return { A: row(rB - rAB, na - 1), B: row(rA - rAB, nb - 1), AB: row(rAB - rFull, (na - 1) * (nb - 1)), E: { ss: rFull, df: dfE, ms: mse }, sst };
  }
  // 區集 ANOVA（處理 + 區集，不含交互作用）。t、b 為處理與區集的編號（0 起算）
  function blockAnova(y, t, b) {
    const nt = Math.max(...t) + 1, nb = Math.max(...b) + 1, N = y.length;
    const X = (useT, useB) => y.map((_, i) => { const r = [1]; if (useT) for (let l = 1; l < nt; l++) r.push(t[i] === l ? 1 : 0); if (useB) for (let l = 1; l < nb; l++) r.push(b[i] === l ? 1 : 0); return r; });
    const rss = M => { const XtX = M[0].map((_, p) => M[0].map((__, q) => M.reduce((s, r) => s + r[p] * r[q], 0))), Xty = M[0].map((_, p) => M.reduce((s, r, i) => s + r[p] * y[i], 0)), V = inv(XtX), bb = V.map(r => dot(r, Xty)); return y.reduce((s, v, i) => s + (v - dot(M[i], bb)) ** 2, 0); };
    const rFull = rss(X(1, 1)), rT = rss(X(1, 0)), rB = rss(X(0, 1)), dfE = N - nt - nb + 1, mse = rFull / dfE, row = (ss, df) => ({ ss, df, ms: ss / df, F: ss / df / mse, p: pf(ss / df / mse, df, dfE) });
    return { T: row(rB - rFull, nt - 1), B: row(rT - rFull, nb - 1), E: { ss: rFull, df: dfE, ms: mse } };
  }
  // 重複測量 ANOVA（單因子）。M 為 n 個個體 × k 個時間點的矩陣。計算上等於把個體當區集；另算 Greenhouse–Geisser ε
  function rmAnova(M) {
    const n = M.length, k = M[0].length, gm = mean(M.flat()), rm = M.map(mean), cm = M[0].map((_, j) => mean(M.map(r => r[j])));
    const ssT = n * sum(cm.map(v => (v - gm) ** 2)), ssS = k * sum(rm.map(v => (v - gm) ** 2)), ssTot = sum(M.flat().map(v => (v - gm) ** 2)), ssE = ssTot - ssT - ssS;
    const df1 = k - 1, df2 = (k - 1) * (n - 1), F = (ssT / df1) / (ssE / df2);
    const cov = cm.map((_, a) => cm.map((__, b) => sum(M.map(r => (r[a] - cm[a]) * (r[b] - cm[b]))) / (n - 1)));
    const rmn = cov.map(mean), tm = mean(rmn), D = cov.map((r, a) => r.map((v, b) => v - rmn[a] - rmn[b] + tm));
    const tr = sum(D.map((r, a) => r[a])), tr2 = sum(D.map(r => sum(r.map(v => v * v)))), eps = Math.min(1, Math.max(1 / df1, tr * tr / (df1 * tr2)));
    return { F, df1, df2, p: pf(F, df1, df2), eps, pGG: pf(F, df1 * eps, df2 * eps), ssT, ssS, ssE, msE: ssE / df2 };
  }
  // Friedman 檢定（重複測量的無母數版本）：每個個體內排名
  function friedman(M) {
    const n = M.length, k = M[0].length, R = new Array(k).fill(0); let tie = 0;
    M.forEach(row => { const { r, ties } = rank(row); r.forEach((v, j) => { R[j] += v; }); tie += tieSum(ties); });
    const Q = (12 / (n * k * (k + 1)) * sum(R.map(v => v * v)) - 3 * n * (k + 1)) / (1 - tie / (n * k * (k * k - 1)));
    return { Q, df: k - 1, p: pchisq(Q, k - 1), R };
  }
  // 隨機效果單因子 ANOVA 的變異成分與 ICC(1,1)（Shrout & Fleiss 1979）。groups 為各群的測量值
  function icc(groups) {
    const A = anova(groups), k = groups.length, N = sum(groups.map(g => g.length)), n0 = (N - sum(groups.map(g => g.length ** 2)) / N) / (k - 1);
    const vb = Math.max(0, (A.msb - A.msw) / n0), vw = A.msw;
    return { vb, vw, icc: (A.msb - A.msw) / (A.msb + (n0 - 1) * A.msw), n0, F: A.F, df1: A.df1, df2: A.df2, p: A.p };
  }
  // 共變數分析：y ~ 組別 + 共變數 x。g 為組別編號（0 起算）。回傳 Type II F、校正後平均與斜率平行性檢定
  function ancova(y, g, x) {
    const k = Math.max(...g) + 1, N = y.length, xm = mean(x);
    const D = (useG, useX, useInt) => y.map((_, i) => { const r = [1]; if (useG) for (let l = 1; l < k; l++) r.push(g[i] === l ? 1 : 0); if (useX) r.push(x[i] - xm); if (useInt) for (let l = 1; l < k; l++) r.push(g[i] === l ? x[i] - xm : 0); return r; });
    const full = ols(D(1, 1, 0), y), rss = M => sum(ols(M, y).resid.map(r => r * r)), rFull = sum(full.resid.map(r => r * r)), dfE = N - k - 1, mse = rFull / dfE;
    const Fg = (rss(D(0, 1, 0)) - rFull) / (k - 1) / mse, Fx = (rss(D(1, 0, 0)) - rFull) / mse, rInt = rss(D(1, 1, 1)), dfI = N - 2 * k, Fi = (rFull - rInt) / (k - 1) / (rInt / dfI);
    const adj = Array.from({ length: k }, (_, l) => full.b[0] + (l ? full.b[l] : 0));
    return { group: { F: Fg, df1: k - 1, df2: dfE, p: pf(Fg, k - 1, dfE) }, cov: { F: Fx, df1: 1, df2: dfE, p: pf(Fx, 1, dfE), slope: full.b[k] }, inter: { F: Fi, df1: k - 1, df2: dfI, p: pf(Fi, k - 1, dfI) }, adj, xm, fit: full };
  }
  // Welch ANOVA（不假設各組變異數相等；R 的 oneway.test(var.equal = FALSE)）
  function welchAnova(groups) {
    const k = groups.length, n = groups.map(g => g.length), m = groups.map(mean), w = groups.map((g, i) => n[i] / variance(g)), W = sum(w);
    const mw = sum(w.map((wi, i) => wi * m[i])) / W, h = sum(w.map((wi, i) => (1 - wi / W) ** 2 / (n[i] - 1)));
    const F = sum(w.map((wi, i) => wi * (m[i] - mw) ** 2)) / (k - 1) / (1 + 2 * (k - 2) / (k * k - 1) * h);
    const df1 = k - 1, df2 = (k * k - 1) / (3 * h);
    return { F, df1, df2, p: pf(F, df1, df2) };
  }
  // Levene 檢定（以中位數為中心，即 Brown–Forsythe 版本；R 的 car::leveneTest 預設）
  function levene(groups) { const r = anova(groups.map(g => { const md = median(g); return g.map(v => Math.abs(v - md)); })); return { F: r.F, df1: r.df1, df2: r.df2, p: r.p }; }
  function kruskal(groups) {
    const all = groups.flat(), N = all.length; const { r, ties } = rank(all); let H = 0, off = 0;
    for (const g of groups) { let R = 0; for (let i = 0; i < g.length; i++) R += r[off + i]; off += g.length; H += R * R / g.length; }
    H = 12 / (N * (N + 1)) * H - 3 * (N + 1); const C = 1 - tieSum(ties) / (N ** 3 - N); if (C > 0) H /= C;
    const df = groups.length - 1; return { H, df, p: pchisq(H, df) };
  }
  function chisq(tab) {
    let T = tab.filter(r => sum(r) > 0); const keep = T[0].map((_, j) => T.some(r => r[j] > 0)); T = T.map(r => r.filter((_, j) => keep[j]));
    const R = T.map(sum), C = T[0].map((_, j) => sum(T.map(r => r[j]))), N = sum(R);
    let x2 = 0, minExp = Infinity;
    const E = T.map((r, i) => r.map((o, j) => { const e = R[i] * C[j] / N; minExp = Math.min(minExp, e); x2 += (o - e) ** 2 / e; return e; }));
    const df = (T.length - 1) * (C.length - 1);
    return { chi2: x2, df, p: df > 0 ? pchisq(x2, df) : NaN, minExp, V: df > 0 ? Math.sqrt(x2 / (N * Math.min(T.length - 1, C.length - 1))) : NaN, E };
  }
  const lchoose = (n, k) => lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1);
  const dbinom = (k, n, p) => (k < 0 || k > n ? 0 : p === 0 ? (k === 0 ? 1 : 0) : p === 1 ? (k === n ? 1 : 0) : Math.exp(lchoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)));
  const pbinom = (k, n, p) => { let s = 0; for (let i = 0; i <= Math.min(k, n); i++) s += dbinom(i, n, p); return Math.min(1, s); };
  const dpois = (k, lam) => (k < 0 ? 0 : Math.exp(-lam + k * Math.log(lam) - lgamma(k + 1)));
  const ppois = (k, lam) => { let s = 0; for (let i = 0; i <= k; i++) s += dpois(i, lam); return Math.min(1, s); };
  // 比例的信賴區間：Wald、Wilson、精確法（Clopper–Pearson，以 Beta 分佈的分位數計算）
  const qbeta = (p, a, b) => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (ibeta(m, a, b) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  function propCI(x, n, conf = 0.95) {
    const z = qnorm(1 - (1 - conf) / 2), p = x / n, se = Math.sqrt(p * (1 - p) / n), d = 1 + z * z / n, ctr = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
    return { p, se, wald: [p - z * se, p + z * se], wilson: [ctr - h, ctr + h], exact: [x === 0 ? 0 : qbeta((1 - conf) / 2, x, n - x + 1), x === n ? 1 : qbeta(1 - (1 - conf) / 2, x + 1, n - x)] };
  }
  function fisher(a, b, c, d) {
    const r1 = a + b, r2 = c + d, c1 = a + c, n = r1 + r2; const lp = x => lchoose(r1, x) + lchoose(r2, c1 - x) - lchoose(n, c1);
    const lo = Math.max(0, c1 - r2), hi = Math.min(r1, c1), p0 = lp(a); let p = 0;
    for (let x = lo; x <= hi; x++) { const l = lp(x); if (l <= p0 + 1e-7) p += Math.exp(l); }
    return Math.min(1, p);
  }
  function pearson(x, y) {
    const n = x.length, mx = mean(x), my = mean(y); let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { const a = x[i] - mx, b = y[i] - my; sxy += a * b; sxx += a * a; syy += b * b; }
    const r = sxy / Math.sqrt(sxx * syy), df = n - 2, t = r * Math.sqrt(df / Math.max(1e-300, 1 - r * r));
    const z = Math.atanh(Math.max(-0.999999, Math.min(0.999999, r))), se = 1 / Math.sqrt(n - 3);
    return { n, r, t, df, p: Math.abs(r) >= 1 ? 0 : pt2(t, df), ci: [Math.tanh(z - 1.96 * se), Math.tanh(z + 1.96 * se)], slope: sxy / sxx, intercept: my - sxy / sxx * mx };
  }
  function spearman(x, y) { const p = pearson(rank(x).r, rank(y).r); return { rho: p.r, p: p.p }; }

  const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
  function inv(A) {
    const n = A.length; let maxd = 0; for (let i = 0; i < n; i++) maxd = Math.max(maxd, Math.abs(A[i][i]));
    const tol = 1e-11 * (maxd || 1);
    const M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (Math.abs(M[p][c]) < tol) throw new Error('SINGULAR');
      [M[c], M[p]] = [M[p], M[c]]; const pv = M[c][c]; for (let j = 0; j < 2 * n; j++) M[c][j] /= pv;
      for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; if (f) for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j]; }
    }
    return M.map(r => r.slice(n));
  }
  function crossprod(X, w) {
    const p = X[0].length, A = Array.from({ length: p }, () => new Array(p).fill(0));
    for (let i = 0; i < X.length; i++) { const xi = X[i], wi = w ? w[i] : 1; for (let a = 0; a < p; a++) { const v = xi[a] * wi; if (v) for (let b = a; b < p; b++) A[a][b] += v * xi[b]; } }
    for (let a = 0; a < p; a++) for (let b = 0; b < a; b++) A[a][b] = A[b][a]; return A;
  }
  function ols(X, y) {
    const n = X.length, p = X[0].length; const V = inv(crossprod(X)); const Xty = new Array(p).fill(0);
    for (let i = 0; i < n; i++) for (let a = 0; a < p; a++) Xty[a] += X[i][a] * y[i];
    const b = V.map(r => dot(r, Xty)), fitted = X.map(xi => dot(xi, b)), resid = y.map((v, i) => v - fitted[i]);
    const rss = sum(resid.map(r => r * r)), my = mean(y), tss = sum(y.map(v => (v - my) ** 2)), df = n - p, s2 = rss / df;
    const se = V.map((r, j) => Math.sqrt(r[j] * s2)), tc = qt(0.975, df);
    const t = b.map((v, j) => v / se[j]), pv = t.map(v => pt2(v, df));
    const r2 = 1 - rss / tss, F = p > 1 ? ((tss - rss) / (p - 1)) / s2 : NaN;
    return { b, se, t, p: pv, ci: b.map((v, j) => [v - tc * se[j], v + tc * se[j]]), r2, adj: 1 - (1 - r2) * (n - 1) / df, F, df1: p - 1, df2: df, pF: p > 1 ? pf(F, p - 1, df) : NaN, sigma: Math.sqrt(s2), fitted, resid, n };
  }
  function logistic(X, y) {
    const n = X.length, p = X[0].length; let b = new Array(p).fill(0), it = 0, conv = false, mu;
    const ybar = mean(y); b[0] = Math.log(ybar / (1 - ybar));
    for (; it < 100; it++) {
      mu = X.map(xi => 1 / (1 + Math.exp(-dot(xi, b)))); const w = mu.map(m => Math.max(1e-10, m * (1 - m)));
      const g = new Array(p).fill(0); for (let i = 0; i < n; i++) for (let a = 0; a < p; a++) g[a] += X[i][a] * (y[i] - mu[i]);
      const step = inv(crossprod(X, w)).map(r => dot(r, g)); b = b.map((v, j) => v + step[j]);
      if (Math.max(...step.map(Math.abs)) < 1e-9) { conv = true; it++; break; }
    }
    mu = X.map(xi => 1 / (1 + Math.exp(-dot(xi, b))));
    const V = inv(crossprod(X, mu.map(m => Math.max(1e-10, m * (1 - m))))); const se = V.map((r, j) => Math.sqrt(r[j]));
    const ll = sum(y.map((v, i) => v ? Math.log(Math.max(1e-300, mu[i])) : Math.log(Math.max(1e-300, 1 - mu[i]))));
    const ll0 = n * (ybar * Math.log(ybar) + (1 - ybar) * Math.log(1 - ybar));
    const z = b.map((v, j) => v / se[j]);
    return { b, se, z, p: z.map(pz2), ll, ll0, mu, conv, it };
  }
  function auc(score, y) {
    const { r } = rank(score); let R1 = 0, n1 = 0; y.forEach((v, i) => { if (v) { R1 += r[i]; n1++; } }); const n0 = y.length - n1;
    return (R1 - n1 * (n1 + 1) / 2) / (n1 * n0);
  }
  function cox(time, status, X0) {
    const n = time.length, p = X0[0].length; const cm = Array.from({ length: p }, (_, j) => mean(X0.map(r => r[j])));
    const X = X0.map(r => r.map((v, j) => v - cm[j])); const order = time.map((_, i) => i).sort((a, b) => time[b] - time[a]);
    function evalAt(b) {
      let S0 = 0, ll = 0; const S1 = new Array(p).fill(0), S2 = Array.from({ length: p }, () => new Array(p).fill(0));
      const grad = new Array(p).fill(0), H = Array.from({ length: p }, () => new Array(p).fill(0));
      for (let i = 0; i < n;) {
        const t = time[order[i]]; let j = i, d = 0; const ds = new Array(p).fill(0);
        while (j < n && time[order[j]] === t) {
          const k = order[j], xk = X[k], eta = dot(xk, b), r = Math.exp(eta); S0 += r;
          for (let a = 0; a < p; a++) { S1[a] += r * xk[a]; for (let c = 0; c < p; c++) S2[a][c] += r * xk[a] * xk[c]; }
          if (status[k]) { d++; ll += eta; for (let a = 0; a < p; a++) ds[a] += xk[a]; } j++;
        }
        if (d) { ll -= d * Math.log(S0); for (let a = 0; a < p; a++) { grad[a] += ds[a] - d * S1[a] / S0; for (let c = 0; c < p; c++) H[a][c] += d * (S2[a][c] / S0 - S1[a] * S1[c] / (S0 * S0)); } }
        i = j;
      }
      return { ll, grad, H };
    }
    let b = new Array(p).fill(0), conv = false; const ll0 = evalAt(b).ll; let cur = evalAt(b);
    for (let it = 0; it < 60; it++) {
      let step = inv(cur.H).map(r => dot(r, cur.grad)); const mx = Math.max(...step.map(Math.abs)); if (mx > 5) step = step.map(s => s * 5 / mx);
      let nb = b.map((v, j) => v + step[j]), nx = evalAt(nb), half = 0;
      while (nx.ll < cur.ll - 1e-10 && half < 20) { step = step.map(s => s / 2); nb = b.map((v, j) => v + step[j]); nx = evalAt(nb); half++; }
      b = nb; cur = nx; if (Math.max(...step.map(Math.abs)) < 1e-9) { conv = true; break; }
    }
    const V = inv(cur.H), se = V.map((r, j) => Math.sqrt(r[j])), z = b.map((v, j) => v / se[j]);
    return { b, se, z, p: z.map(pz2), ll: cur.ll, ll0, conv };
  }
  function km(time, status) {
    const n = time.length, idx = time.map((_, i) => i).sort((a, b) => time[a] - time[b]);
    let nr = n, Sv = 1, vs = 0; const steps = [{ t: 0, S: 1, lo: 1, hi: 1, n, d: 0 }], cens = [];
    for (let i = 0; i < n;) {
      const t = time[idx[i]]; let j = i, d = 0, c = 0; while (j < n && time[idx[j]] === t) { if (status[idx[j]]) d++; else c++; j++; }
      if (d) {
        Sv *= 1 - d / nr; if (nr > d) vs += d / (nr * (nr - d)); let lo = Sv, hi = Sv;
        if (Sv > 0 && Sv < 1) { const se = Math.sqrt(vs) / Math.abs(Math.log(Sv)); lo = Math.pow(Sv, Math.exp(1.96 * se)); hi = Math.pow(Sv, Math.exp(-1.96 * se)); }
        steps.push({ t, S: Sv, lo, hi, n: nr, d });
      }
      if (c) cens.push({ t, S: Sv }); nr -= d + c; i = j;
    }
    const m = steps.find(s => s.S <= 0.5);
    const at = T => { let s = steps[0]; for (const x of steps) { if (x.t <= T) s = x; else break; } return s; };
    return { steps, cens, median: m ? m.t : NaN, at, end: Math.max(...time), events: steps.reduce((a, s) => a + s.d, 0), n };
  }
  function logrank(time, status, g, k) {
    const times = [...new Set(time.filter((_, i) => status[i]))].sort((a, b) => a - b);
    const O = new Array(k).fill(0), E = new Array(k).fill(0), V = Array.from({ length: k }, () => new Array(k).fill(0));
    for (const t of times) {
      const nr = new Array(k).fill(0), dr = new Array(k).fill(0);
      for (let i = 0; i < time.length; i++) { if (time[i] >= t) { nr[g[i]]++; if (time[i] === t && status[i]) dr[g[i]]++; } }
      const N = sum(nr), D = sum(dr);
      for (let a = 0; a < k; a++) { O[a] += dr[a]; E[a] += D * nr[a] / N; if (N > 1) for (let b = 0; b < k; b++) V[a][b] += D * (N - D) / (N * N * (N - 1)) * nr[a] * ((a === b ? N : 0) - nr[b]); }
    }
    const m = k - 1, dv = O.slice(0, m).map((o, i) => o - E[i]), Vi = inv(V.slice(0, m).map(r => r.slice(0, m)));
    const chi2 = dot(dv, Vi.map(r => dot(r, dv)));
    return { chi2, df: m, p: pchisq(chi2, m), O, E };
  }
  function bh(p) {
    const m = p.length, o = p.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]), q = new Array(m); let mn = 1;
    for (let k = m - 1; k >= 0; k--) { mn = Math.min(mn, o[k][0] * m / (k + 1)); q[o[k][1]] = mn; } return q;
  }
  function holm(p) {
    const m = p.length, o = p.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]), q = new Array(m); let mx = 0;
    o.forEach(([v, i], k) => { mx = Math.max(mx, Math.min(1, (m - k) * v)); q[i] = mx; }); return q;
  }
  const nMeans = (d, alpha, power) => { const za = qnorm(1 - alpha / 2), zb = qnorm(power); return Math.ceil(2 * (za + zb) ** 2 / (d * d) + za * za / 4); };
  const powerMeans = (d, n, alpha) => pnorm(Math.abs(d) * Math.sqrt(n / 2) - qnorm(1 - alpha / 2));
  const nProps = (p1, p2, alpha, power) => { const za = qnorm(1 - alpha / 2), zb = qnorm(power), pb = (p1 + p2) / 2; return Math.ceil((za * Math.sqrt(2 * pb * (1 - pb)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2 / ((p1 - p2) ** 2)); };
  const powerProps = (p1, p2, n, alpha) => { const za = qnorm(1 - alpha / 2), pb = (p1 + p2) / 2; return pnorm((Math.abs(p1 - p2) * Math.sqrt(n) - za * Math.sqrt(2 * pb * (1 - pb))) / Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))); };

  return { dbinom, pbinom, dpois, ppois, propCI, lgamma, ibeta, pnorm, pz2, qnorm, pt, pt2, qt, pf, pchisq, sum, mean, variance, sd, quantile, median, skew, minmax, rank, welch, mannWhitney, pairedT, wilcoxonSR, anova, twoway, blockAnova, rmAnova, friedman, icc, ancova, welchAnova, levene, ptukey, qtukey, tukey, kruskal, chisq, fisher, pearson, spearman, inv, ols, logistic, auc, cox, km, logrank, bh, holm, nMeans, powerMeans, nProps, powerProps };
})();

/* ---------- 格式 ---------- */
const F = {
  n(x, d) { if (x == null || !Number.isFinite(x)) return '—'; if (d == null) { const a = Math.abs(x); d = a >= 10 ? 1 : a >= 1 ? 2 : 3; } const s = x.toFixed(d); return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s; },
  p: p => !Number.isFinite(p) ? '—' : p < 0.001 ? '< 0.001' : p.toFixed(3),
  peq: p => !Number.isFinite(p) ? 'p = —' : p < 0.001 ? 'p < 0.001' : 'p = ' + p.toFixed(3),
  ci: (lo, hi, d) => { d = d ?? F.dec(Math.max(Math.abs(lo), Math.abs(hi))); return `${F.n(lo, d)} 至 ${F.n(hi, d)}`; },
  cien: (lo, hi, d) => { d = d ?? F.dec(Math.max(Math.abs(lo), Math.abs(hi))); return `${F.n(lo, d)} to ${F.n(hi, d)}`; },
  dec: a => (a >= 10 ? 1 : a >= 1 ? 2 : 3),
};
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* ---------- 圖表 ---------- */
function niceScale(min, max, count) {
  if (!(isFinite(min) && isFinite(max))) { min = 0; max = 1; }
  if (max - min < 1e-12) { const d = Math.abs(min) * 0.1 || 1; min -= d; max += d; }
  const raw = (max - min) / count, mag = Math.pow(10, Math.floor(Math.log10(raw))), r = raw / mag;
  const step = (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * mag;
  const lo = Math.floor(min / step + 1e-9) * step, hi = Math.ceil(max / step - 1e-9) * step, ticks = [];
  for (let v = lo; v <= hi + step * 1e-6; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return { lo, hi, step, ticks };
}
const tickFmt = (v, step) => v.toFixed(Math.min(6, Math.max(0, -Math.floor(Math.log10(step) + 1e-9))));
function logTicks(lo, hi) {
  const c = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 4, 5, 10, 20, 50, 100, 200, 500, 1000];
  let t = c.filter(v => v >= lo && v <= hi); if (t.length > 7) t = t.filter(v => [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 50, 100, 1000].includes(v)); return t;
}
var CW = 640;
function chart(o, draw) {
  const w = o.w || CW, h = o.h || 320;
  const M = Object.assign({ l: o.noY ? 16 : 58, r: 18, t: 14, b: o.xlab ? 50 : 30 }, o.m || {});
  const iw = w - M.l - M.r, ih = h - M.t - M.b; let X, Y, xt = [], yt = [];
  if (o.xcats) { const n = o.xcats.length; X = i => M.l + (i + 0.5) * iw / n; xt = o.xcats.map((c, i) => [X(i), c]); }
  else if (o.xlog) { const a = Math.log(o.x[0]), b = Math.log(o.x[1]); X = v => M.l + (Math.log(v) - a) / (b - a) * iw; xt = logTicks(o.x[0], o.x[1]).map(v => [X(v), String(v)]); }
  else { const s = niceScale(o.x[0], o.x[1], o.xn || 6); X = v => M.l + (v - s.lo) / (s.hi - s.lo) * iw; xt = s.ticks.map(v => [X(v), tickFmt(v, s.step)]); }
  if (o.ycats) { const n = o.ycats.length; Y = i => M.t + (i + 0.5) * ih / n; yt = o.ycats.map((c, i) => [Y(i), c]); }
  else { const s = niceScale(o.y[0], o.y[1], o.yn || 5); Y = v => M.t + ih - (v - s.lo) / (s.hi - s.lo) * ih; yt = o.noY ? [] : s.ticks.map(v => [Y(v), tickFmt(v, s.step)]); }
  let g = '';
  if (!o.ycats) yt.forEach(([y]) => { g += `<line class="gl" x1="${M.l}" x2="${w - M.r}" y1="${y}" y2="${y}"/>`; });
  if (o.xgrid) xt.forEach(([x]) => { g += `<line class="gl" x1="${x}" x2="${x}" y1="${M.t}" y2="${M.t + ih}"/>`; });
  g += `<line class="ax" x1="${M.l}" x2="${w - M.r}" y1="${M.t + ih}" y2="${M.t + ih}"/>`;
  xt.forEach(([x, l]) => { g += `<text x="${x}" y="${M.t + ih + 18}" text-anchor="middle">${esc(l)}</text>`; });
  yt.forEach(([y, l]) => { g += `<text x="${M.l - 8}" y="${y}" dy=".32em" text-anchor="end">${esc(l)}</text>`; });
  if (o.xlab) g += `<text class="lab" x="${M.l + iw / 2}" y="${h - 10}" text-anchor="middle">${esc(o.xlab)}</text>`;
  if (o.ylab && !o.noY) g += `<text class="lab" transform="translate(14 ${M.t + ih / 2}) rotate(-90)" text-anchor="middle">${esc(o.ylab)}</text>`;
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img">${g}${draw(X, Y, { M, iw, ih, w, h })}</svg>`;
}
const col4 = i => `var(--c${i % 4 + 1})`;
const legend = items => `<div class="legend">${items.map(([c, l]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')}</div>`;
function histChart(vals, o) {
  const bins = o.bins || 30, lo = o.lo, hi = o.hi, bw = (hi - lo) / bins, c = new Array(bins).fill(0);
  for (const v of vals) { let k = Math.floor((v - lo) / bw); if (v === hi) k = bins - 1; if (k >= 0 && k < bins) c[k]++; }
  const mx = Math.max(1, ...c);
  return chart({ x: [lo, hi], y: [0, mx], h: o.h || 220, xlab: o.xlab, ylab: o.ylab || '次數', noY: o.noY }, (X, Y) =>
    c.map((n, i) => `<rect data-k="${o.tag ? o.tag(i) : ''}" x="${(X(lo + i * bw) + 0.5).toFixed(1)}" y="${Y(n).toFixed(1)}" width="${Math.max(0, X(lo + (i + 1) * bw) - X(lo + i * bw) - 1).toFixed(1)}" height="${(Y(0) - Y(n)).toFixed(1)}" style="fill:${o.color ? o.color(i) : 'var(--c1)'}"/>`).join('') + (o.extra ? o.extra(X, Y) : ''));
}
// 統計分佈的機率密度（給 distChart 用）
S.tpdf = (x, df) => Math.exp(S.lgamma((df + 1) / 2) - S.lgamma(df / 2)) / Math.sqrt(df * Math.PI) * Math.pow(1 + x * x / df, -(df + 1) / 2);
S.fpdf = (x, d1, d2) => (x <= 0 ? 0 : Math.exp(S.lgamma((d1 + d2) / 2) - S.lgamma(d1 / 2) - S.lgamma(d2 / 2) + (d1 / 2) * Math.log(d1 / d2) + (d1 / 2 - 1) * Math.log(x) - ((d1 + d2) / 2) * Math.log(1 + d1 * x / d2)));
S.chipdf = (x, k) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - S.lgamma(k / 2)));

// 箱型＋散點。data-k：iqr{i} 箱、med{i} 中位數、mean{i} 平均、sd{i} 平均 ± 1 SD（亮起才顯示）
function boxStrip(groups, ylab, extra) {
  const [mn, mx] = S.minmax(groups.flatMap(g => g.v));
  return chart({ xcats: groups.map(g => `${g.label}（n=${g.v.length}）`), y: [mn, mx], ylab, h: 330 }, (X, Y, ctx) => {
    const bw = Math.min(64, ctx.iw / groups.length * 0.4); let s = '';
    groups.forEach((g, i) => {
      const c = col4(i), x = X(i), q1 = S.quantile(g.v, 0.25), q3 = S.quantile(g.v, 0.75), md = S.median(g.v), iqr = q3 - q1;
      const [wl, wh] = S.minmax(g.v.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr)), m = S.mean(g.v), sd = g.v.length > 1 ? S.sd(g.v) : 0, sx = x + bw / 2 + 12;
      if (g.v.length <= 500) g.v.forEach((v, k) => { const jx = x + (((k * 0.6180339887) % 1) - 0.5) * bw * 1.5; s += `<circle cx="${jx.toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" style="fill:${c};fill-opacity:.4"/>`; });
      s += `<line x1="${x}" x2="${x}" y1="${Y(wl)}" y2="${Y(q1)}" class="ink"/><line x1="${x}" x2="${x}" y1="${Y(q3)}" y2="${Y(wh)}" class="ink"/>`;
      s += `<rect data-k="iqr${i}" x="${x - bw / 2}" y="${Y(q3)}" width="${bw}" height="${Math.max(1, Y(q1) - Y(q3))}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>`;
      s += `<line data-k="med${i} rank" x1="${x - bw / 2}" x2="${x + bw / 2}" y1="${Y(md)}" y2="${Y(md)}" style="stroke:${c};stroke-width:3"/>`;
      s += `<g class="hlx" data-k="sd${i} d"><line x1="${sx}" x2="${sx}" y1="${Y(m - sd)}" y2="${Y(m + sd)}" style="stroke:var(--c2);stroke-width:3"/><line x1="${sx - 5}" x2="${sx + 5}" y1="${Y(m - sd)}" y2="${Y(m - sd)}" style="stroke:var(--c2);stroke-width:2"/><line x1="${sx - 5}" x2="${sx + 5}" y1="${Y(m + sd)}" y2="${Y(m + sd)}" style="stroke:var(--c2);stroke-width:2"/></g>`;
      s += `<path data-k="mean${i} diff" d="M${x} ${Y(m) - 6}l6 6l-6 6l-6 -6z" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.2"/>`;
    });
    return s + (extra ? extra(X, Y, { ...ctx, bw }) : '');
  });
}
const boxCap = '箱＝四分位距；粗線＝中位數；◇＝平均；鬚線延伸到 1.5 倍 IQR 內最遠的值；點＝個別觀察值。';

// 係數圖：log=true 時為 OR／HR（參考線 1），否則為 β（參考線 0）。每列 data-k = row.k
function forestChart(rows, xlab, log = true) {
  const ref = log ? 1 : 0; let lo = Math.min(ref, ...rows.map(r => r.lo)), hi = Math.max(ref, ...rows.map(r => r.hi));
  if (log) { lo = Math.max(1e-3, lo * 0.8); hi = Math.min(1e3, hi * 1.25); } else { const pd = (hi - lo) * 0.08 || 1; lo -= pd; hi += pd; }
  const ml = Math.min(260, CW * 0.42, 24 + Math.max(...rows.map(r => r.label.length)) * 7.5);
  return chart({ ycats: rows.map(r => r.label), xlog: log, x: [lo, hi], xlab, h: 60 + rows.length * 34, m: { l: ml }, xgrid: !log }, (X, Y, { M, ih }) => {
    let s = `<line x1="${X(ref)}" x2="${X(ref)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>`;
    rows.forEach((r, i) => { const y = Y(i), a = X(Math.max(lo, r.lo)), b = X(Math.min(hi, r.hi)); s += `<g data-k="${r.k || ''}"><line x1="${a}" x2="${b}" y1="${y}" y2="${y}" style="stroke:var(--c1);stroke-width:2"/><rect x="${X(r.est) - 5}" y="${y - 5}" width="10" height="10" style="fill:var(--c1)"/></g>`; });
    return s;
  });
}

// 虛無假設下的分佈：kind = 't'（雙尾）、'F'、'chi2'（右尾）。data-k：p 著色面積、t／F／chi2 統計量位置
function distChart(kind, stat, df, label) {
  const [d1, d2] = Array.isArray(df) ? df : [df, 0], two = kind === 't', a = Math.abs(stat);
  const pdf = kind === 't' ? x => S.tpdf(x, d1) : kind === 'F' ? x => S.fpdf(x, d1, d2) : x => S.chipdf(x, d1);
  const lo = two ? -Math.max(4.5, a + 1) : 0, hi = two ? -lo : Math.max(a * 1.25, kind === 'F' ? 5 : d1 + 4 * Math.sqrt(2 * d1));
  const xs = Array.from({ length: 201 }, (_, i) => lo + (hi - lo) * i / 200), ymax = Math.max(...xs.filter(x => two || x > hi * 0.03).map(pdf)), cap = v => Math.min(v, ymax * 1.1), key = kind === 'chi2' ? 'chi2' : kind;
  return chart({ x: [lo, hi], y: [0, ymax * 1.2], noY: true, h: 170, xlab: label }, (X, Y) => {
    const area = (a0, b0) => { if (!(b0 > a0)) return ''; let q = `M${X(a0)} ${Y(0)}`; for (let i = 0; i <= 80; i++) { const x = a0 + (b0 - a0) * i / 80; q += `L${X(x).toFixed(1)} ${Y(cap(pdf(x))).toFixed(1)}`; } return q + `L${X(b0)} ${Y(0)}Z`; };
    let c = ''; xs.forEach((x, i) => { c += `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(cap(pdf(x))).toFixed(1)}`; });
    const sx = X(Math.max(lo, Math.min(hi, stat))), top = Y(ymax * 1.1);
    return `<path class="keep" d="${c}" style="fill:none;stroke:var(--ink);stroke-width:1.6"/><path data-k="p" d="${(two ? area(a, hi) + area(lo, -a) : area(Math.min(a, hi), hi)) || 'M0 0'}" style="fill:var(--c2);fill-opacity:.55"/><g data-k="${key}"><line x1="${sx}" x2="${sx}" y1="${Y(0)}" y2="${top}" style="stroke:var(--c2);stroke-width:2.5"/><text x="${sx}" y="${top - 5}" text-anchor="${sx > X(hi) - 40 ? 'end' : 'middle'}" style="fill:var(--c2)">${kind === 'chi2' ? 'χ²' : kind} = ${F.n(stat, 2)}</text></g>`;
  });
}
const distCap = { t: '虛無假設下的 t 分佈；紅色面積＝雙尾 p 值。', F: '虛無假設下的 F 分佈；紅色面積＝p 值。', chi2: '虛無假設下的 χ² 分佈；紅色面積＝p 值。' };

// 百分比堆疊長條。tag(i, j) 回傳每段的 data-k
function stackChart(R, C, tab, ylab, tag = () => '', extra) {
  return chart({ xcats: R, y: [0, 100], ylab, h: 280 }, (X, Y, ctx) => {
    const bw = Math.min(90, ctx.iw / R.length * 0.55); let g = '';
    R.forEach((r, i) => { const tot = S.sum(tab[i]); let acc = 0; C.forEach((c, j) => { const p = tot ? 100 * tab[i][j] / tot : 0; g += `<rect data-k="${tag(i, j)}" x="${X(i) - bw / 2}" y="${Y(acc + p)}" width="${bw}" height="${Y(acc) - Y(acc + p)}" style="fill:${col4(j)}"/>`; if (p >= 8) g += `<text class="in" x="${X(i)}" y="${(Y(acc) + Y(acc + p)) / 2}" dy=".32em" text-anchor="middle">${p.toFixed(0)}%</text>`; acc += p; }); });
    return g + (extra ? extra(X, Y, { ...ctx, bw }) : '');
  });
}

// 字母標記（compact letter display）：平均由大到小排列，找出所有「彼此都沒有顯著差異」的最長連續組合，各給一個字母
function cld(means, sig) {
  const k = means.length, ord = means.map((_, i) => i).sort((a, b) => means[b] - means[a]), runs = [];
  for (let s = 0; s < k; s++) { let e = s; while (e + 1 < k && ord.slice(s, e + 2).every(x => ord.slice(s, e + 2).every(y => x === y || !sig[x][y]))) e++; runs.push([s, e]); }
  const max = runs.filter((r, i) => !runs.some((o, j) => j !== i && o[0] <= r[0] && o[1] >= r[1] && (o[0] < r[0] || o[1] > r[1]))).filter((r, i, arr) => arr.findIndex(o => o[0] === r[0] && o[1] === r[1]) === i);
  const L = new Array(k).fill(''); max.forEach((r, li) => { for (let t = r[0]; t <= r[1]; t++) L[ord[t]] += String.fromCharCode(97 + li); }); return L;
}
// 交互作用圖：x 軸為因子 A，每條線為因子 B 的一個水準。cells[i][j] 為 A 第 i 水準、B 第 j 水準的資料
// data-k：b{j} 各線；mainA 因子 A 的邊際平均（◆）；mainB 因子 B 的邊際平均（虛線）；inter 「沒有交互作用時」的平行參考線與偏離量
function interPlot(La, Lb, cells, ylab, extra) {
  const [mn, mx] = S.minmax(cells.flat(2)), mean = (i, j) => S.mean(cells[i][j]);
  return chart({ xcats: La, y: [mn, mx], ylab, h: 320 }, (X, Y, ctx) => {
    let g = '';
    La.forEach((_, i) => Lb.forEach((__, j) => cells[i][j].forEach((v, k) => { g += `<circle cx="${(X(i) + (j - (Lb.length - 1) / 2) * 16 + (((k * 0.618) % 1) - 0.5) * 10).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.4" style="fill:${col4(j)};fill-opacity:.3"/>`; })));
    Lb.forEach((_, j) => { const mb = S.mean(La.flatMap((__, i) => cells[i][j])); g += `<line class="hlx" data-k="mainB" x1="${X(0) - 20}" x2="${X(La.length - 1) + 20}" y1="${Y(mb)}" y2="${Y(mb)}" style="stroke:${col4(j)};stroke-width:2;stroke-dasharray:6 4"/>`; });
    for (let j = 1; j < Lb.length; j++) { const sh = S.mean(La.map((__, i) => mean(i, j) - mean(i, 0))); g += `<path class="hlx" data-k="inter" d="${La.map((__, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(mean(i, 0) + sh)}`).join('')}" style="fill:none;stroke:${col4(j)};stroke-width:2;stroke-dasharray:4 4"/>` + La.map((__, i) => `<line class="hlx" data-k="inter" x1="${X(i) + 10}" x2="${X(i) + 10}" y1="${Y(mean(i, 0) + sh)}" y2="${Y(mean(i, j))}" style="stroke:var(--c2);stroke-width:3.5"/>`).join(''); }
    Lb.forEach((_, j) => { g += `<g data-k="b${j}"><path d="${La.map((__, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(mean(i, j))}`).join('')}" style="fill:none;stroke:${col4(j)};stroke-width:3"/>${La.map((__, i) => `<circle cx="${X(i)}" cy="${Y(mean(i, j))}" r="5.5" style="fill:${col4(j)}"/>`).join('')}</g>`; });
    La.forEach((_, i) => { const ma = S.mean(Lb.flatMap((__, j) => cells[i][j])); g += `<path class="hlx" data-k="mainA" d="M${X(i)} ${Y(ma) - 8}l8 8l-8 8l-8 -8z" style="fill:var(--ink)"/>`; });
    return g + (extra ? extra(X, Y, ctx, mean) : '');
  });
}
// 常態 Q-Q 圖；data-k="qq" 為各點
function qqChart(vals) {
  const sr = Float64Array.from(vals).sort(), n = sr.length, sd = S.sd(vals), m = S.mean(vals), th = Array.from(sr, (_, i) => m + S.qnorm((i + 0.5) / n) * sd), [lo, hi] = S.minmax([...sr, ...th]);
  return chart({ x: [lo, hi], y: [lo, hi], h: 260, xlab: '常態分佈的理論位置', ylab: '實際值（排序後）' }, (X, Y) => `<line class="keep" x1="${X(lo)}" y1="${Y(lo)}" x2="${X(hi)}" y2="${Y(hi)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + Array.from(sr, (v, i) => `<circle data-k="qq" cx="${X(th[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.7"/>`).join(''));
}
// ROC 曲線；data-k="auc" 為曲線下面積
function rocChart(score, y) {
  const idx = score.map((_, i) => i).sort((a, b) => score[b] - score[a]), P = S.sum(y), N = y.length - P; let tp = 0, fp = 0; const pts = [[0, 0]];
  for (const i of idx) { if (y[i]) tp++; else fp++; pts.push([fp / N, tp / P]); }
  const line = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a} ${b}`);
  return chart({ x: [0, 1], y: [0, 1], h: 280, xlab: '1 − 特異度（偽陽性率）', ylab: '敏感度', xgrid: true }, (X, Y) => {
    const d = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${X(a).toFixed(1)} ${Y(b).toFixed(1)}`).join('');
    return `<path data-k="auc" d="${d}L${X(1)} ${Y(0)}L${X(0)} ${Y(0)}Z" style="fill:var(--c1);fill-opacity:.15"/><path class="keep" d="${d}" style="fill:none;stroke:var(--c1);stroke-width:2.2"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" style="stroke:var(--muted);stroke-dasharray:4 4"/>`;
  });
}

// 每個數字的定義（規格第三條：只說怎麼算）
const DEF = {
  mean: '所有值加總後除以個數。', sd: '標準差：每個值與平均之差的平方，加總後除以 n − 1，再開根號。', median: '排序後位於正中間的值。', iqr: '四分位距：第 75 百分位數減第 25 百分位數。',
  diff: '第二組平均減第一組平均。', ci: '95% 信賴區間：估計值 ± t 臨界值 × 標準誤。以同樣方法重複抽樣時，約 95% 的區間會涵蓋真值。', t: 't 統計量：估計值 ÷ 標準誤。',
  p: 'p 值：假設虛無假設為真時，得到至少這麼極端的統計量的機率，即分佈圖上紅色的面積。', d: "Cohen's d：平均差 ÷ 合併標準差。",
  U: 'Mann–Whitney：兩組資料合併排名後，以名次計算的檢定。', V: 'Wilcoxon 符號等級：把差值的絕對值排名後，以正差值的名次總和計算的檢定。', F: 'F 統計量：組間均方 ÷ 組內均方。', eta2: 'η²：組間平方和 ÷ 總平方和。', H: 'Kruskal–Wallis：所有資料合併排名後，比較各組平均名次的檢定。',
  chi2: 'χ² 統計量：每一格的（觀察次數 − 期望次數）² ÷ 期望次數，全部加總。', minexp: '期望次數：列總和 × 欄總和 ÷ 總數，即兩變數無關時每一格的人數。圖上虛線是期望的比例。', cv: "Cramér's V：√(χ² ÷ (n × (列數與欄數中較小者 − 1)))。",
  or: '勝算比：第二列的勝算 ÷ 第一列的勝算；勝算 = 屬於欄變數第二個類別的人數 ÷ 第一個類別的人數。', rr: '風險比：第二列的事件比例 ÷ 第一列的事件比例。', prop: '該列中屬於欄變數第二個類別的比例。', fisher: 'Fisher 精確檢定：固定邊際總和，列出所有可能的 2×2 表，加總機率不大於觀察表的機率。',
  r: 'Pearson r：兩變數離均差乘積的總和 ÷ √(兩者離均差平方和的乘積)。信賴區間以 Fisher z 轉換計算。', rho: 'Spearman ρ：先把兩個變數轉成名次，再計算 Pearson r。', r2: 'R²：1 − 殘差平方和 ÷ 總平方和。', slope: '最小平方直線的斜率：x 增加 1 時，直線上 y 的變化量。', sigma: '殘差標準誤：√(殘差平方和 ÷ (n − 參數數))。',
  beta: '迴歸係數 β：其他變數固定時，該變數增加 1 單位（類別變數則為相對參考組），結果變數平均的變化量。', OR: '勝算比：e 的 β 次方，β 為邏輯斯迴歸係數。', auc: 'AUC：ROC 曲線下的面積。', lr: '概似比 χ²：2 ×（模型的對數概似 − 只有截距的對數概似）。',
  hr: '危險比：e 的 β 次方，β 為 Cox 模型係數。', medsurv: '中位存活時間：Kaplan–Meier 曲線第一次降到 0.5 以下的時間。', surv: '存活率：每個事件時間點乘上（1 − 事件數 ÷ 風險人數）的累積結果；括號為 95% CI。', logrank: 'Log-rank χ²：比較各組在每個事件時間點的觀察事件數與期望事件數。',
  sig: '未校正 p < 0.05 的變數數。', q: 'Benjamini–Hochberg：p 值由小到大排序，第 i 個乘上 m ÷ i，再由後往前取最小值，得到 q 值；這裡數 q < 0.05 的個數。', bonf: 'Bonferroni：p 值 × 檢定總數 m；這裡數校正後 < 0.05 的個數，等同 p < 0.05 ÷ m。',
  welchF: 'Welch ANOVA：各組變異數分別估計、以各組人數 ÷ 變異數為權重的 F 檢定，不要求變異數相等。', levene: 'Levene 檢定：算出每個值與自己那組中位數的距離，再用 ANOVA 比較這些距離；p 值小代表各組變異數不同。Q-Q 圖則用來看殘差是否接近常態。',
  cldDef: 'Tukey–Kramer 事後比較後，平均由大到小排列；彼此沒有顯著差異的組別共用同一個字母。兩組沒有共同字母，代表 Tukey 校正 p < 0.05。',
  mainEff: '主效果：把另一個因子的各水準平均起來後，這個因子各水準之間的差異。圖上的 ◆ 或虛線是邊際平均。', interEff: '交互作用：一個因子的效果是否隨另一個因子的水準而不同。圖上虛線是「沒有交互作用時」第二條線應在的位置，紅色線段是實際偏離的量。',
  blockDef: '區集 ANOVA 先扣除區集之間的差異，再比較處理；區集解釋掉的變異越多，殘差均方越小。最後一張卡是忽略區集、直接做單因子 ANOVA 的結果，供比較。',
  rmDef: '重複測量 ANOVA：把每個個體當成區集，扣除個體之間的差異後，比較各時間點的平均。', ggDef: 'Greenhouse–Geisser ε：用各時間點的共變異數矩陣估計違反球形假設的程度，介於 1/(時間點數 − 1) 與 1；自由度乘上 ε 後重新計算 p 值。', friedDef: 'Friedman 檢定：在每個個體內把各時間點的值排名，再比較各時間點的名次總和。',
  adjMean: '校正後平均：用 ANCOVA 模型預測「共變數等於全體平均時」各組的平均；括號內是未校正的原始平均。', parallel: '斜率平行性檢定：在模型中加入「組別 × 共變數」交互作用，檢定各組的迴歸斜率是否相同；ANCOVA 假設斜率相同。',
  n: '分析使用的觀察數。', ev: '結果為事件（編碼 1）的人數。',
};
const cd = (k, l, v, d) => ({ k, l, v, d });

/* ---------- 資料集 ---------- */
function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function normOf(r) { return (m = 0, s = 1) => { let u = 0; while (u === 0) u = r(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }; }
const pad = (k, n) => String(k).padStart(n, '0');

const DATASETS = [
  {
    id: 'bp_trial', name: '降血壓藥隨機試驗', tag: '臨床試驗', track: '臨床／流病',
    desc: '120 位第一期高血壓患者隨機分派至新藥或安慰劑，追蹤 12 週收縮壓與不良事件。4 位受試者第 12 週失聯。',
    order: { group: ['placebo', 'drug'], sex: ['F', 'M'] },
    codebook: { id: '受試者編號', group: '分派組別：drug = 新藥，placebo = 安慰劑', age: '年齡（歲）', sex: '性別：F = 女，M = 男', bmi: '身體質量指數（kg/m²）', sbp_base: '基線收縮壓（mmHg）', sbp_wk12: '第 12 週收縮壓（mmHg），失聯者為缺失', ae: '是否發生不良事件：1 = 是，0 = 否' },
    uses: ['Table 1', 't 檢定', '配對 t 檢定', '線性迴歸（ANCOVA）', '卡方（不良事件）'],
    gen() {
      const r = rngOf(20240611), N = normOf(r), miss = new Set([9, 34, 77, 102]), rows = [];
      for (let i = 0; i < 120; i++) {
        const drug = i % 4 === 0 || i % 4 === 3, age = Math.round(N(58, 9)), sex = r() < 0.47 ? 'F' : 'M', bmi = +N(26.8, 3.6).toFixed(1), sb = Math.round(N(152, 10));
        const w12 = Math.round(sb - (drug ? 13.5 : 4) + 0.45 * (bmi - 26.8) + 0.12 * (age - 58) + N(0, 8.5)), ae = r() < (drug ? 0.2 : 0.08) ? 1 : 0;
        rows.push(['P' + pad(i + 1, 3), drug ? 'drug' : 'placebo', age, sex, bmi, sb, miss.has(i) ? null : w12, ae]);
      }
      return { head: ['id', 'group', 'age', 'sex', 'bmi', 'sbp_base', 'sbp_wk12', 'ae'], rows };
    },
  },
  {
    id: 'cvd_cohort', name: '心血管世代研究', tag: '世代研究', track: '臨床／流病',
    desc: '400 位 35–79 歲社區成人，記錄基線危險因子，追蹤 10 年是否發生心血管事件。',
    order: { sex: ['F', 'M'] },
    codebook: { id: '參與者編號', age: '基線年齡（歲）', sex: '性別：F = 女，M = 男', smoker: '目前吸菸：1 = 是，0 = 否', sbp: '收縮壓（mmHg）', chol: '總膽固醇（mmol/L）', diabetes: '糖尿病：1 = 是，0 = 否', cvd_10y: '10 年內心血管事件：1 = 發生，0 = 未發生' },
    uses: ['卡方與勝算比', '相關', '邏輯斯迴歸'],
    gen() {
      const r = rngOf(77), N = normOf(r), rows = [];
      for (let i = 0; i < 400; i++) {
        const age = Math.round(Math.min(79, Math.max(35, N(55, 10)))), sex = r() < 0.5 ? 'F' : 'M', smoker = r() < (sex === 'M' ? 0.38 : 0.18) ? 1 : 0;
        const sbp = Math.round(N(126 + 0.4 * (age - 55), 15)), chol = +N(5.2, 0.95).toFixed(1), dm = r() < 0.06 + 0.004 * (age - 35) ? 1 : 0;
        const lp = -10.4 + 0.075 * age + 0.75 * smoker + 0.018 * sbp + 0.32 * chol + 0.85 * dm + (sex === 'M' ? 0.35 : 0);
        rows.push(['C' + pad(i + 1, 3), age, sex, smoker, sbp, chol, dm, r() < 1 / (1 + Math.exp(-lp)) ? 1 : 0]);
      }
      return { head: ['id', 'age', 'sex', 'smoker', 'sbp', 'chol', 'diabetes', 'cvd_10y'], rows };
    },
  },
  {
    id: 'lung_surv', name: '肺癌存活追蹤', tag: '存活資料', track: '臨床／流病',
    desc: '160 位非小細胞肺癌患者接受標準治療或新療法，最長追蹤 60 個月；部分患者於研究結束時仍存活或中途失聯（設限）。',
    order: { treatment: ['standard', 'new'], stage: ['II', 'III', 'IV'] },
    codebook: { id: '病人編號', treatment: '治療：standard = 標準治療，new = 新療法', stage: '癌症分期：II、III、IV', age: '診斷年齡（歲）', time_months: '追蹤時間（月）：至死亡或最後一次追蹤', status: '狀態：1 = 死亡（事件），0 = 設限' },
    uses: ['Kaplan–Meier', 'Log-rank 檢定', 'Cox 迴歸'],
    gen() {
      const r = rngOf(2025), N = normOf(r), rows = [];
      for (let i = 0; i < 160; i++) {
        const tr = i % 2 ? 'new' : 'standard', u = r(), st = u < 0.3 ? 'II' : u < 0.65 ? 'III' : 'IV', age = Math.round(N(63, 8));
        const lp = -0.5 * (tr === 'new') + (st === 'III' ? 0.6 : st === 'IV' ? 1.25 : 0) + 0.025 * (age - 63), h = 0.022 * Math.exp(lp);
        const T = -Math.log(1 - r()) / h, C = Math.min(12 + r() * 48, -Math.log(1 - r()) / 0.006);
        rows.push(['L' + pad(i + 1, 3), tr, st, age, Math.max(0.1, +Math.min(T, C).toFixed(1)), T <= C ? 1 : 0]);
      }
      return { head: ['id', 'treatment', 'stage', 'age', 'time_months', 'status'], rows };
    },
  },
  {
    id: 'gene_expr', name: '腫瘤與正常組織基因表現', tag: '組學', track: '基因體／組學',
    desc: '8 對腫瘤與正常組織樣本、40 個基因的 log2 表現量。其中 8 個基因事先設定為真的有差異，用來檢驗多重檢定校正的效果。',
    order: { tissue: ['normal', 'tumor'] },
    codebook: { sample: '樣本編號', tissue: '組織：normal = 正常，tumor = 腫瘤', 'GENE01–GENE40': '各基因的 log2 標準化表現量' },
    truth: ['GENE03', 'GENE07', 'GENE12', 'GENE18', 'GENE21', 'GENE29', 'GENE33', 'GENE38'],
    uses: ['多重檢定（BH／FDR）', '火山圖'],
    gen() {
      const r = rngOf(314), N = normOf(r), eff = { 3: 2.0, 7: -1.6, 12: 1.4, 18: 2.6, 21: 1.1, 29: -1.3, 33: 1.8, 38: 1.0 };
      const genes = Array.from({ length: 40 }, (_, k) => ({ name: 'GENE' + pad(k + 1, 2), base: 5 + r() * 6, sd: 0.5 + r() * 0.5, e: eff[k + 1] || 0 }));
      const rows = [];
      for (let i = 0; i < 16; i++) { const tum = i >= 8; rows.push(['S' + pad(i + 1, 2), tum ? 'tumor' : 'normal', ...genes.map(g => +N(g.base + (tum ? g.e : 0), g.sd).toFixed(2))]); }
      return { head: ['sample', 'tissue', ...genes.map(g => g.name)], rows };
    },
  },
  {
    id: 'plant_growth', name: '肥料對植株生長', tag: '實驗設計', track: '生態／實驗',
    desc: '60 株植物分成對照組與 A、B、C 三種肥料（各 15 株），分置於 3 個溫室區集，6 週後測量株高與葉片數。',
    order: { fertilizer: ['control', 'A', 'B', 'C'], block: ['B1', 'B2', 'B3'] },
    codebook: { plant: '植株編號', fertilizer: '肥料：control = 對照，A／B／C = 三種配方', block: '溫室區集：B1、B2、B3', soil_ph: '土壤 pH 值', height_cm: '第 6 週株高（公分）', leaf_count: '第 6 週葉片數' },
    uses: ['ANOVA 與事後比較', 'Kruskal–Wallis', '線性迴歸（含區集）'],
    gen() {
      const r = rngOf(42), N = normOf(r), fs = ['control', 'A', 'B', 'C'], eff = { control: 0, A: 2.2, B: 5.6, C: 3.6 }, be = { B1: 0, B2: 1.5, B3: -1.2 }, rows = [];
      for (let i = 0; i < 60; i++) {
        const f = fs[i % 4], b = 'B' + (Math.floor(i / 4) % 3 + 1), ph = +N(6.5, 0.35).toFixed(1);
        rows.push(['T' + pad(i + 1, 2), f, b, ph, +(28 + eff[f] + be[b] + 2.2 * (ph - 6.5) + N(0, 2.6)).toFixed(1), Math.max(3, Math.round(N(11 + eff[f] * 0.6, 2.2)))]);
      }
      return { head: ['plant', 'fertilizer', 'block', 'soil_ph', 'height_cm', 'leaf_count'], rows };
    },
  },
  {
    id: 'diet_geno', name: '小鼠基因型 × 飲食', tag: '因子設計', track: '生態／實驗',
    desc: '48 隻小鼠，野生型（WT）與基因剔除（KO）各 24 隻，各一半吃一般飼料、一半吃高脂飼料（每種組合 12 隻），8 週後測量體重增加與肝臟脂肪比例。',
    order: { genotype: ['WT', 'KO'], diet: ['chow', 'HFD'], sex: ['F', 'M'] },
    codebook: { id: '小鼠編號', genotype: '基因型：WT = 野生型，KO = 基因剔除', diet: '飼料：chow = 一般飼料，HFD = 高脂飼料', sex: '性別：F = 雌，M = 雄', weight_gain_g: '8 週體重增加（公克）', liver_fat_pct: '肝臟脂肪比例（%）' },
    uses: ['二因子 ANOVA 與交互作用', '多組比較'],
    gen() {
      const r = rngOf(808), N = normOf(r), rows = [], mu = { 'WT|chow': 3, 'WT|HFD': 9, 'KO|chow': 3.2, 'KO|HFD': 5.2 }, lf = { 'WT|chow': 4, 'WT|HFD': 9, 'KO|chow': 3, 'KO|HFD': 8 };
      let k = 0; for (const g of ['WT', 'KO']) for (const d of ['chow', 'HFD']) for (let i = 0; i < 12; i++) { k++; rows.push(['M' + pad(k, 2), g, d, i % 2 ? 'M' : 'F', +(mu[g + '|' + d] + (i % 2 ? 0.6 : 0) + N(0, 1.6)).toFixed(1), +Math.max(0.5, lf[g + '|' + d] + N(0, 1.5)).toFixed(1)]); }
      return { head: ['id', 'genotype', 'diet', 'sex', 'weight_gain_g', 'liver_fat_pct'], rows };
    },
  },
  {
    id: 'wound', name: '小鼠傷口癒合', tag: '重複測量', track: '生態／實驗',
    desc: '12 隻小鼠背部製造相同大小的傷口，在第 0、3、7、14 天測量同一個傷口的面積。每隻小鼠一列、每個時間點一欄（寬格式）。',
    order: {},
    codebook: { id: '小鼠編號', day0: '第 0 天傷口面積（mm²）', day3: '第 3 天傷口面積（mm²）', day7: '第 7 天傷口面積（mm²）', day14: '第 14 天傷口面積（mm²）' },
    uses: ['重複測量 ANOVA', 'Friedman 檢定'],
    gen() {
      const r = rngOf(1414), N = normOf(r), rows = [], mu = [50, 41, 28, 12];
      for (let i = 0; i < 12; i++) { const u = N(0, 5); let e = N(0, 3); rows.push(['W' + pad(i + 1, 2), ...mu.map((m, j) => { if (j) e = 0.6 * e + 0.8 * N(0, 3); return +Math.max(1, m + u * (1 - j * 0.15) + e).toFixed(1); })]); }
      return { head: ['id', 'day0', 'day3', 'day7', 'day14'], rows };
    },
  },
];

const MISSING = new Set(['', 'na', 'n/a', 'nan', 'null', '.', '-', '#n/a', 'missing', '缺', '無']);
const NUMRE = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
function makeDS({ id, name, head, rows, order = {}, codebook = {}, truth = null, desc = '' }) {
  const n = rows.length;
  const cols = head.map((h, j) => {
    const raw = rows.map(r => (r[j] === undefined ? null : r[j])), nn = raw.filter(v => v !== null);
    const isNum = nn.length > 0 && nn.every(v => typeof v === 'number' && Number.isFinite(v));
    return { name: h, type: isNum ? 'num' : 'cat', orig: isNum ? 'num' : 'cat', values: isNum ? raw : raw.map(v => (v === null ? null : String(v))), nuniq: new Set(nn.map(String)).size, nmiss: n - nn.length };
  });
  return { id, name, n, cols, order, codebook, truth, desc };
}
function parseCSV(text) {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/)[0]; let delim = ',', best = 0;
  for (const c of [',', '\t', ';']) { const k = first.split(c).length; if (k > best) { best = k; delim = c; } }
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"' && f === '') q = true;
    else if (ch === delim) { row.push(f); f = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += ch;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const clean = rows.filter(r => r.some(c => c.trim() !== ''));
  if (clean.length < 2) throw new Error('讀不到資料：檔案至少需要一列標題和一列資料。');
  const seen = {};
  const header = clean[0].map((h, j) => { let s = h.trim() || 'V' + (j + 1); if (seen[s]) s += '_' + (++seen[s]); else seen[s] = 1; return s; });
  return { header, data: clean.slice(1), delim };
}
function dsFromText(name, text) {
  const { header, data, delim } = parseCSV(text);
  const rows = data.map(r => header.map((_, j) => { const v = (r[j] ?? '').trim(); return MISSING.has(v.toLowerCase()) ? null : v; }));
  header.forEach((_, j) => { const nn = rows.map(r => r[j]).filter(v => v !== null); if (nn.length && nn.every(v => NUMRE.test(v))) rows.forEach(r => { if (r[j] !== null) r[j] = +r[j]; }); });
  const ds = makeDS({ id: 'upload', name, head: header, rows, desc: `從檔案匯入：${data.length} 列 × ${header.length} 欄（分隔符號：${delim === '\t' ? 'Tab' : delim}）。` });
  return ds;
}

/* ---------- 分析 ---------- */
const lab = v => (v === null ? null : String(v));
function colOf(ds, name) { const c = ds.cols.find(c => c.name === name); if (!c) throw new Error(`找不到欄位「${name}」。`); return c; }
function levelsOf(ds, c, idx) {
  const set = new Set(); for (const i of idx) { const v = c.values[i]; if (v !== null) set.add(String(v)); }
  const ord = ((ds.order && ds.order[c.name]) || []).map(String).filter(l => set.has(l));
  return [...ord, ...[...set].filter(l => !ord.includes(l)).sort((a, b) => a.localeCompare(b, 'zh-Hant', { numeric: true }))];
}
function complete(ds, names) { const cs = names.map(n => colOf(ds, n)), idx = []; for (let i = 0; i < ds.n; i++) if (cs.every(c => c.values[i] !== null)) idx.push(i); return { idx, dropped: ds.n - idx.length }; }
function design(ds, idx, names) {
  const terms = [];
  for (const n of names) {
    const c = colOf(ds, n);
    if (c.type === 'num') terms.push({ label: n, cols: [{ lab: n, f: i => c.values[i] }] });
    else {
      const L = levelsOf(ds, c, idx); if (L.length < 2) throw new Error(`「${n}」在分析樣本中只有一個類別，無法放入模型。`);
      if (L.length > 15) throw new Error(`「${n}」有 ${L.length} 個類別，太多了；請改用類別較少的變數。`);
      terms.push({ label: n, ref: L[0], cols: L.slice(1).map(l => ({ lab: `${n}: ${l} vs ${L[0]}`, f: i => (lab(c.values[i]) === l ? 1 : 0) })) });
    }
  }
  return { X: idx.map(i => terms.flatMap(t => t.cols.map(c => c.f(i)))), names: terms.flatMap(t => t.cols.map(c => c.lab)), refs: terms.filter(t => t.ref).map(t => `${t.label} 的參考組為「${t.ref}」`) };
}
function binCode(ds, c, idx) {
  const L = levelsOf(ds, c, idx); if (L.length !== 2) throw new Error(`「${c.name}」需要剛好兩種值（例如 0/1），目前有 ${L.length} 種。`);
  const ev = c.type === 'num' && L.includes('1') && L.includes('0') ? '1' : L[1];
  return { y: idx.map(i => (lab(c.values[i]) === ev ? 1 : 0)), ev, ref: L.find(l => l !== ev) };
}
const meta = (n, dropped) => `分析樣本 n = ${n}${dropped ? `（${dropped} 筆因缺失值排除）` : ''}`;
const joinZh = a => a.join('、'), joinEn = a => (a.length < 3 ? a.join(' and ') : a.slice(0, -1).join(', ') + ', and ' + a[a.length - 1]);
function catFail(e) { if (e.message === 'SINGULAR') throw new Error('模型無法估計：可能有完全共線（例如某變數是其他變數的組合、或某類別只有一種結果）。請移除部分變數後再試。'); throw e; }

// 每項分析回傳：{ title, meta, facts[], charts[{svg,cap,legend,after}], cards[cd], write{zh,en}, tables[{head,rows,foot,scroll}] }
// 依 SPEC.md：只呈現數字與圖，不下結論。
const W2 = (zm, zr, em, er) => ({ zh: { m: zm, r: zr }, en: { m: em, r: er } });
const descRows = (G, gv) => [['n', ...gv.map(a => a.length)], ['平均 ± SD', ...gv.map(a => `${F.n(S.mean(a))} ± ${F.n(a.length > 1 ? S.sd(a) : NaN)}`)], ['中位數 [IQR]', ...gv.map(a => `${F.n(S.median(a))} [${F.n(S.quantile(a, 0.25))}, ${F.n(S.quantile(a, 0.75))}]`)]];

const AN = {
  table1: {
    name: '描述統計／Table 1', when: '每個變數的平均、標準差、人數與百分比，可依組別分欄',
    fields: [{ k: 'g', label: '分組變數（可留空）', t: 'cat', opt: true }, { k: 'vars', label: '要描述的變數', t: 'any', multi: true, def: 'some' }],
    run(ds, s) {
      const vars = (s.vars || []).filter(v => v && v !== s.g); if (!vars.length) throw new Error('請至少勾選一個要描述的變數。');
      let base = [...Array(ds.n).keys()], dropped = 0, G = null, gIdx = null;
      if (s.g) {
        const gc = colOf(ds, s.g), keep = base.filter(i => gc.values[i] !== null); dropped = base.length - keep.length; base = keep;
        G = levelsOf(ds, gc, base); if (G.length > 8) throw new Error('分組變數超過 8 組，請選擇類別較少的變數。');
        gIdx = G.map(l => base.filter(i => lab(gc.values[i]) === l));
      }
      const hasP = G && G.length >= 2, groupsIdx = G ? gIdx : [base], groupLab = G || ['全體'];
      const head = ['變數', `全體<br><span class="mut">n = ${base.length}</span>`, ...(G ? G.map((l, j) => `${esc(l)}<br><span class="mut">n = ${gIdx[j].length}</span>`) : []), ...(hasP ? ['p 值'] : [])];
      const rows = [], picks = [], foot = [];
      vars.forEach((v, vi) => {
        const c = colOf(ds, v), k = 'v' + vi, idxV = base.filter(i => c.values[i] !== null), miss = base.length - idxV.length;
        if (miss) foot.push(`${esc(v)} 缺失 ${miss} 筆`);
        if (c.type === 'num' && c.nuniq > 2) {
          const all = idxV.map(i => c.values[i]), gv = G ? gIdx.map(ix => ix.filter(i => c.values[i] !== null).map(i => c.values[i])) : null;
          const ms = a => (a.length ? `${F.n(S.mean(a))} ± ${F.n(a.length > 1 ? S.sd(a) : NaN)}` : '—'), mq = a => (a.length ? `${F.n(S.median(a))} [${F.n(S.quantile(a, 0.25))}, ${F.n(S.quantile(a, 0.75))}]` : '—');
          const p = hasP && gv.every(a => a.length >= 2) ? (G.length === 2 ? S.welch(gv[0], gv[1]).p : S.anova(gv).p) : NaN;
          rows.push({ k, cells: [`<b>${esc(v)}</b> <span class="mut">平均 ± SD</span>`, ms(all), ...(G ? gv.map(ms) : []), ...(hasP ? [F.p(p) + '<sup>a</sup>'] : [])] });
          rows.push({ k, cls: 'sub', cells: ['<span class="ind mut">中位數 [IQR]</span>', mq(all), ...(G ? gv.map(mq) : []), ...(hasP ? [''] : [])] });
          picks.push({ k, svg: boxStrip((gv || [all]).map((a, j) => ({ label: groupLab[j], v: a })), v) });
        } else {
          const L = levelsOf(ds, c, idxV); if (L.length > 12) { foot.push(`${esc(v)} 有 ${L.length} 個類別，未列出`); return; }
          const tab = groupsIdx.map(ix => L.map(l => ix.filter(i => lab(c.values[i]) === l).length)), p = hasP ? S.chisq(tab).p : NaN;
          rows.push({ k, cls: 'grp', cells: [`<b>${esc(v)}</b> <span class="mut">n (%)</span>`, '', ...(G ? G.map(() => '') : []), ...(hasP ? [F.p(p) + '<sup>b</sup>'] : [])] });
          const pct = (ix, l) => { const den = ix.filter(i => c.values[i] !== null).length, n = ix.filter(i => lab(c.values[i]) === l).length; return den ? `${n} (${(100 * n / den).toFixed(1)})` : '—'; };
          L.forEach(l => rows.push({ k, cells: [`<span class="ind">${esc(l)}</span>`, pct(base, l), ...(G ? gIdx.map(ix => pct(ix, l)) : []), ...(hasP ? [''] : [])] }));
          picks.push({ k, svg: stackChart(groupLab, L, tab, `${v}（%）`), legend: legend(L.map((l, j) => [col4(j), esc(l)])) });
        }
      });
      const sups = hasP ? ['a Welch t 檢定（兩組）或單因子 ANOVA（多組）', 'b 卡方檢定'] : [];
      return {
        title: G ? `Table 1：依「${esc(s.g)}」分組` : 'Table 1', meta: meta(base.length, dropped), facts: [],
        table1: { head, rows, foot: [...sups, ...foot].join('；') }, picks,
        write: W2(`連續變數以平均值 ± 標準差及中位數 [四分位距] 表示，類別變數以人數（百分比）表示。${hasP ? `組間比較：連續變數使用 Welch t 檢定${G.length > 2 ? '或單因子變異數分析' : ''}，類別變數使用卡方檢定。` : ''}`,
          `共 ${base.length} 位研究對象${G ? '（' + G.map((l, j) => `${l} n = ${gIdx[j].length}`).join('；') + '）' : ''}。`,
          `Continuous variables are presented as mean ± standard deviation and median [interquartile range]; categorical variables as number (percentage).${hasP ? ` Between-group comparisons used Welch's t test${G.length > 2 ? ' or one-way analysis of variance' : ''} for continuous variables and the chi-square test for categorical variables.` : ''}`,
          `A total of ${base.length} participants${G ? ' (' + G.map((l, j) => `${l}, n = ${gIdx[j].length}`).join('; ') + ')' : ''}.`),
      };
    },
  },
  ttest: {
    name: '兩組比較', when: 'Welch t 檢定與 Mann–Whitney：兩組的數值結果',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'g', label: '分組變數（兩組）', t: 'cat' }],
    run(ds, s) {
      const yc = colOf(ds, s.y), gc = colOf(ds, s.g), { idx, dropped } = complete(ds, [s.y, s.g]), G = levelsOf(ds, gc, idx);
      if (G.length !== 2) throw new Error(`分組變數需要剛好兩組，「${s.g}」目前有 ${G.length} 組。三組以上請改用「多組比較」。`);
      const [a, b] = G.map(l => idx.filter(i => lab(gc.values[i]) === l).map(i => yc.values[i]));
      if (a.length < 2 || b.length < 2) throw new Error('每組至少需要 2 筆資料。');
      const w = S.welch(a, b), mw = S.mannWhitney(a, b), m0 = w.m1, m1 = w.m2;
      const box = boxStrip([{ label: G[0], v: a }, { label: G[1], v: b }], s.y, (X, Y, { bw }) => {
        const x0 = X(0), x1 = X(1), xm = (x0 + x1) / 2, cx = x1 + bw / 2 + 30;
        return `<g class="hlx" data-k="diff d"><line x1="${x0}" x2="${x1}" y1="${Y(m0)}" y2="${Y(m0)}" style="stroke:var(--c1);stroke-dasharray:5 4;stroke-width:1.5"/><line x1="${xm}" x2="${xm}" y1="${Y(m0)}" y2="${Y(m1)}" style="stroke:var(--c2);stroke-width:3"/><text x="${xm + 6}" y="${(Y(m0) + Y(m1)) / 2}" dy=".32em" style="fill:var(--c2)">${F.n(w.diff)}</text></g>`
          + `<g class="hlx" data-k="ci"><line x1="${x0}" x2="${cx}" y1="${Y(m0)}" y2="${Y(m0)}" style="stroke:var(--c1);stroke-dasharray:5 4;stroke-width:1.5"/><line x1="${cx}" x2="${cx}" y1="${Y(m0 + w.ci[0])}" y2="${Y(m0 + w.ci[1])}" style="stroke:var(--c2);stroke-width:4"/><circle cx="${cx}" cy="${Y(m1)}" r="4" style="fill:var(--c2)"/></g>`;
      });
      return {
        title: `${esc(s.y)}：${esc(G[1])} vs ${esc(G[0])}`, meta: meta(idx.length, dropped), facts: [],
        charts: [{ svg: box, cap: boxCap }, { svg: distChart('t', w.t, w.df, `t（自由度 ${F.n(w.df, 1)}）`), cap: distCap.t }],
        cards: [cd('mean0', `${esc(G[0])} 平均`, F.n(m0), 'mean'), cd('mean1', `${esc(G[1])} 平均`, F.n(m1), 'mean'), cd('sd0', `${esc(G[0])} SD`, F.n(w.s1), 'sd'), cd('sd1', `${esc(G[1])} SD`, F.n(w.s2), 'sd'),
          cd('med0', `${esc(G[0])} 中位數`, F.n(S.median(a)), 'median'), cd('med1', `${esc(G[1])} 中位數`, F.n(S.median(b)), 'median'), cd('diff', `平均差（${esc(G[1])} − ${esc(G[0])}）`, F.n(w.diff), 'diff'), cd('ci', '平均差 95% CI', F.ci(...w.ci), 'ci'),
          cd('t', 'Welch t', `${F.n(w.t, 2)}（df ${F.n(w.df, 1)}）`, 't'), cd('p', 'p 值（Welch）', F.p(w.p), 'p'), cd('d', "Cohen's d", F.n(w.d, 2), 'd'), cd('rank', 'p 值（Mann–Whitney）', F.p(mw.p), 'U')],
        tables: [{ head: ['', `${esc(G[0])}`, `${esc(G[1])}`], rows: descRows(G, [a, b]) }, { head: ['檢定', '估計值', '95% CI', '統計量', 'p 值'], rows: [[`Welch t<br><span class="mut">平均差（${esc(G[1])} − ${esc(G[0])}）</span>`, F.n(w.diff), F.ci(...w.ci), `t(${F.n(w.df, 1)}) = ${F.n(w.t, 2)}`, F.p(w.p)], ['Mann–Whitney U', '—', '—', `U = ${F.n(mw.U, 1)}，z = ${F.n(mw.z, 2)}`, F.p(mw.p)], ["Cohen's d", F.n(w.d, 2), '—', '—', '—']] }],
        write: W2(`${s.y} 的兩組比較使用 Welch t 檢定（不假設變異數相等）與 Mann–Whitney U 檢定；效果量為 Cohen's d。檢定皆為雙尾。`,
          `${G[1]} 組（n = ${b.length}）${s.y} ${F.n(m1)} ± ${F.n(w.s2)}；${G[0]} 組（n = ${a.length}）${F.n(m0)} ± ${F.n(w.s1)}；平均差 ${F.n(w.diff)}（95% CI ${F.ci(...w.ci)}；Welch t(${F.n(w.df, 1)}) = ${F.n(w.t, 2)}，${F.peq(w.p)}；Cohen's d = ${F.n(w.d, 2)}）。Mann–Whitney U = ${F.n(mw.U, 1)}，${F.peq(mw.p)}。`,
          `${s.y} was compared between groups using Welch's t test, which does not assume equal variances, and the Mann–Whitney U test; effect size is reported as Cohen's d. All tests were two-sided.`,
          `${s.y}: ${F.n(m1)} ± ${F.n(w.s2)} in the ${G[1]} group (n = ${b.length}) and ${F.n(m0)} ± ${F.n(w.s1)} in the ${G[0]} group (n = ${a.length}); mean difference ${F.n(w.diff)} (95% CI ${F.cien(...w.ci)}; Welch's t(${F.n(w.df, 1)}) = ${F.n(w.t, 2)}, ${F.peq(w.p)}; Cohen's d = ${F.n(w.d, 2)}). Mann–Whitney U = ${F.n(mw.U, 1)}, ${F.peq(mw.p)}.`),
      };
    },
  },
  paired: {
    name: '配對比較', when: '配對 t 檢定與 Wilcoxon 符號等級：同一個體的兩次測量',
    fields: [{ k: 'a', label: '第一次測量（前）', t: 'num' }, { k: 'b', label: '第二次測量（後）', t: 'num' }],
    run(ds, s) {
      if (s.a === s.b) throw new Error('請選擇兩個不同的欄位。');
      const ac = colOf(ds, s.a), bc = colOf(ds, s.b), { idx, dropped } = complete(ds, [s.a, s.b]); if (idx.length < 3) throw new Error('至少需要 3 筆完整配對資料。');
      const x = idx.map(i => ac.values[i]), y = idx.map(i => bc.values[i]), pt = S.pairedT(x, y), wl = S.wilcoxonSR(pt.d), mx0 = S.mean(x), my0 = S.mean(y);
      const [mn, mx] = S.minmax([...x, ...y]), show = Math.min(200, idx.length);
      const ch = chart({ xcats: [s.a, s.b], y: [mn, mx], ylab: '測量值', h: 330 }, (X, Y) => {
        let g = ''; for (let i = 0; i < show; i++) g += `<line data-k="wil" x1="${X(0)}" x2="${X(1)}" y1="${Y(x[i]).toFixed(1)}" y2="${Y(y[i]).toFixed(1)}" style="stroke:${y[i] < x[i] ? 'var(--c1)' : 'var(--c2)'};stroke-opacity:.35"/>`;
        const cx = X(1) + 34;
        return g + `<line data-k="chg" x1="${X(0)}" x2="${X(1)}" y1="${Y(mx0)}" y2="${Y(my0)}" style="stroke:var(--ink);stroke-width:3"/><circle data-k="mA chg" cx="${X(0)}" cy="${Y(mx0)}" r="5.5" style="fill:var(--ink)"/><circle data-k="mB chg" cx="${X(1)}" cy="${Y(my0)}" r="5.5" style="fill:var(--ink)"/>`
          + `<g class="hlx" data-k="ci"><line x1="${X(0)}" x2="${cx}" y1="${Y(mx0)}" y2="${Y(mx0)}" style="stroke:var(--muted);stroke-dasharray:5 4"/><line x1="${cx}" x2="${cx}" y1="${Y(mx0 + pt.ci[0])}" y2="${Y(mx0 + pt.ci[1])}" style="stroke:var(--c2);stroke-width:4"/><circle cx="${cx}" cy="${Y(my0)}" r="4" style="fill:var(--c2)"/></g>`;
      });
      return {
        title: `${esc(s.a)} → ${esc(s.b)}`, meta: meta(idx.length, dropped), facts: [],
        charts: [{ svg: ch, legend: legend([['var(--c1)', '下降'], ['var(--c2)', '上升或不變'], ['var(--ink)', '平均']]), cap: `每條細線是一個個體${show < idx.length ? `（只畫出前 ${show} 位）` : ''}。` }, { svg: distChart('t', pt.t, pt.df, `t（自由度 ${pt.df}）`), cap: distCap.t }],
        cards: [cd('mA', `${esc(s.a)} 平均`, F.n(mx0), 'mean'), cd('mB', `${esc(s.b)} 平均`, F.n(my0), 'mean'), cd('chg', '平均變化（後 − 前）', F.n(pt.md), 'diff'), cd('ci', '平均變化 95% CI', F.ci(...pt.ci), 'ci'), cd('t', '配對 t', `${F.n(pt.t, 2)}（df ${pt.df}）`, 't'), cd('p', 'p 值（配對 t）', F.p(pt.p), 'p'), cd('wil', 'p 值（Wilcoxon）', F.p(wl.p), 'V')],
        tables: [{ head: ['', '平均 ± SD', '中位數 [IQR]'], rows: [[esc(s.a), `${F.n(mx0)} ± ${F.n(S.sd(x))}`, `${F.n(S.median(x))} [${F.n(S.quantile(x, 0.25))}, ${F.n(S.quantile(x, 0.75))}]`], [esc(s.b), `${F.n(my0)} ± ${F.n(S.sd(y))}`, `${F.n(S.median(y))} [${F.n(S.quantile(y, 0.25))}, ${F.n(S.quantile(y, 0.75))}]`], ['差值（後 − 前）', `${F.n(pt.md)} ± ${F.n(pt.sdd)}`, `${F.n(S.median(pt.d))} [${F.n(S.quantile(pt.d, 0.25))}, ${F.n(S.quantile(pt.d, 0.75))}]`]] }, { head: ['檢定', '平均變化', '95% CI', '統計量', 'p 值'], rows: [['配對 t', F.n(pt.md), F.ci(...pt.ci), `t(${pt.df}) = ${F.n(pt.t, 2)}`, F.p(pt.p)], ['Wilcoxon 符號等級', '—', '—', `V = ${F.n(wl.V, 1)}，z = ${F.n(wl.z, 2)}`, F.p(wl.p)]] }],
        write: W2(`同一受試者 ${s.a} 與 ${s.b} 的差異使用配對 t 檢定與 Wilcoxon 符號等級檢定。`,
          `n = ${idx.length}；${s.a} ${F.n(mx0)} ± ${F.n(S.sd(x))}，${s.b} ${F.n(my0)} ± ${F.n(S.sd(y))}；平均變化 ${F.n(pt.md)}（95% CI ${F.ci(...pt.ci)}；配對 t(${pt.df}) = ${F.n(pt.t, 2)}，${F.peq(pt.p)}）；Wilcoxon ${F.peq(wl.p)}。`,
          `Within-participant differences between ${s.a} and ${s.b} were analysed with the paired t test and the Wilcoxon signed-rank test.`,
          `n = ${idx.length}; ${s.a} ${F.n(mx0)} ± ${F.n(S.sd(x))}, ${s.b} ${F.n(my0)} ± ${F.n(S.sd(y))}; mean change ${F.n(pt.md)} (95% CI ${F.cien(...pt.ci)}; paired t(${pt.df}) = ${F.n(pt.t, 2)}, ${F.peq(pt.p)}); Wilcoxon ${F.peq(wl.p)}.`),
      };
    },
  },
  anova: {
    name: '多組比較', when: '單因子 ANOVA、Kruskal–Wallis 與兩兩比較：三組以上',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'g', label: '分組變數', t: 'cat' }],
    run(ds, s) {
      const yc = colOf(ds, s.y), gc = colOf(ds, s.g), { idx, dropped } = complete(ds, [s.y, s.g]), G = levelsOf(ds, gc, idx);
      if (G.length < 2) throw new Error('分組變數至少需要兩組。'); if (G.length > 12) throw new Error('組數超過 12 組，請選擇類別較少的變數。');
      const gv = G.map(l => idx.filter(i => lab(gc.values[i]) === l).map(i => yc.values[i])); if (gv.some(a => a.length < 2)) throw new Error('每組至少需要 2 筆資料。');
      const A = S.anova(gv), K = S.kruskal(gv), Wl = S.welchAnova(gv), Lv = S.levene(gv), gm = S.mean(gv.flat()), tables = [];
      let letters = null, tukeyTable = null;
      if (G.length > 2) {
        const T = S.tukey(gv), pr = T.pairs.map(x => ({ ...x, w: S.welch(gv[x.i], gv[x.j]) })), adj = S.holm(pr.map(x => x.w.p)), sig = G.map(() => G.map(() => false));
        T.pairs.forEach(x => { sig[x.i][x.j] = sig[x.j][x.i] = x.p < 0.05; }); letters = cld(gv.map(S.mean), sig);
        tukeyTable = ({ head: ['比較', '平均差', 'Tukey 95% CI', 'Tukey 校正 p', 'Welch t + Holm 校正 p'], rows: pr.map((x, k) => [`${esc(G[x.j])} − ${esc(G[x.i])}`, F.n(x.diff), F.ci(...x.ci), F.p(x.p), F.p(adj[k])]), foot: `Tukey–Kramer 事後比較（臨界值 q = ${F.n(T.qcrit, 3)}，自由度 ${T.df}）；另列兩兩 Welch t 檢定以 Holm 法校正的結果。` });
      }
      const box = boxStrip(G.map((l, j) => ({ label: l, v: gv[j] })), s.y, (X, Y, { M, iw, bw }) => (letters ? letters.map((L, j) => `<text data-k="tukey" x="${X(j)}" y="${M.t + 12}" text-anchor="middle" style="fill:var(--ink);font-size:14px;font-weight:600">${L}</text>`).join('') : '') + gv.map((g, j) => `<line class="hlx" data-k="welch" x1="${X(j) - bw / 2}" x2="${X(j) + bw / 2}" y1="${Y(S.mean(g))}" y2="${Y(S.mean(g))}" style="stroke:var(--c4);stroke-width:3"/>`).join('') + `<g class="hlx" data-k="gm eta F"><line x1="${M.l}" x2="${M.l + iw}" y1="${Y(gm)}" y2="${Y(gm)}" style="stroke:var(--muted);stroke-width:1.5;stroke-dasharray:6 4"/></g>` + gv.map((g, j) => `<line class="hlx" data-k="eta F" x1="${X(j) - bw / 2 - 8}" x2="${X(j) - bw / 2 - 8}" y1="${Y(gm)}" y2="${Y(S.mean(g))}" style="stroke:var(--c2);stroke-width:3"/>`).join(''));
      tables.push({ head: ['組別', ...G.map(esc)], rows: descRows(G, gv) });
      tables.push({ head: ['變異來源', 'SS', 'df', 'MS', '統計量', 'p 值'], rows: [['組間', F.n(A.ssb), A.df1, F.n(A.msb), `F = ${F.n(A.F, 2)}`, F.p(A.p)], ['組內', F.n(A.ssw), A.df2, F.n(A.msw), '', ''], ['Kruskal–Wallis', '', K.df, '', `H = ${F.n(K.H, 2)}`, F.p(K.p)], ['Welch ANOVA', '', `${Wl.df1}, ${F.n(Wl.df2, 1)}`, '', `F = ${F.n(Wl.F, 2)}`, F.p(Wl.p)], ['Levene 檢定（變異數同質性）', '', `${Lv.df1}, ${Lv.df2}`, '', `F = ${F.n(Lv.F, 2)}`, F.p(Lv.p)]] });
      if (tukeyTable) tables.push(tukeyTable);
      return {
        title: `${esc(s.y)}：依「${esc(s.g)}」${G.length} 組`, meta: meta(idx.length, dropped), facts: [],
        charts: [{ svg: box, cap: boxCap + '亮起時：灰色虛線＝全體平均，紅線＝各組平均與全體平均的距離。' }, { svg: distChart('F', A.F, [A.df1, A.df2], `F（自由度 ${A.df1}, ${A.df2}）`), cap: distCap.F }, { svg: qqChart(gv.flatMap(g => { const m = S.mean(g); return g.map(v => v - m); })), cap: '殘差（每個值 − 自己那組的平均）的 Q-Q 圖；虛線為常態分佈的參考線。' }],
        cards: [...G.map((l, j) => cd('mean' + j, `${esc(l)} 平均`, F.n(S.mean(gv[j])), 'mean')), cd('gm', '全體平均', F.n(gm), 'mean'), cd('F', 'F', `${F.n(A.F, 2)}（df ${A.df1}, ${A.df2}）`, 'F'), cd('p', 'p 值（ANOVA）', F.p(A.p), 'p'), cd('eta', 'η²', F.n(A.eta2, 3), 'eta2'), cd('rank', 'p 值（Kruskal–Wallis）', F.p(K.p), 'H'), cd('welch', 'p 值（Welch ANOVA）', F.p(Wl.p), 'welchF'), cd('qq', 'p 值（Levene）', F.p(Lv.p), 'levene'), ...(letters ? [cd('tukey', 'Tukey 字母標記', letters.join(' / '), 'cldDef')] : [])],
        tables,
        write: W2(`${G.length} 組間 ${s.y} 的比較使用單因子變異數分析${G.length > 2 ? '，兩兩比較使用 Welch t 檢定並以 Holm 法校正' : ''}，另以 Welch ANOVA（不假設變異數相等）與 Kruskal–Wallis 檢定計算，並以 Levene 檢定比較各組變異數。`,
          `F(${A.df1}, ${A.df2}) = ${F.n(A.F, 2)}，${F.peq(A.p)}，η² = ${F.n(A.eta2, 3)}；Welch F(${Wl.df1}, ${F.n(Wl.df2, 1)}) = ${F.n(Wl.F, 2)}，${F.peq(Wl.p)}；Kruskal–Wallis H = ${F.n(K.H, 2)}，${F.peq(K.p)}；Levene F(${Lv.df1}, ${Lv.df2}) = ${F.n(Lv.F, 2)}，${F.peq(Lv.p)}。各組：${G.map((l, j) => `${l} ${F.n(S.mean(gv[j]))} ± ${F.n(S.sd(gv[j]))}`).join('；')}。`,
          `${s.y} was compared across ${G.length} groups using one-way analysis of variance${G.length > 2 ? ", with pairwise Welch's t tests adjusted by the Holm method" : ''}, Welch's ANOVA (not assuming equal variances), and the Kruskal–Wallis test; homogeneity of variances was assessed with Levene's test.`,
          `F(${A.df1}, ${A.df2}) = ${F.n(A.F, 2)}, ${F.peq(A.p)}, η² = ${F.n(A.eta2, 3)}; Welch's F(${Wl.df1}, ${F.n(Wl.df2, 1)}) = ${F.n(Wl.F, 2)}, ${F.peq(Wl.p)}; Kruskal–Wallis H = ${F.n(K.H, 2)}, ${F.peq(K.p)}; Levene's F(${Lv.df1}, ${Lv.df2}) = ${F.n(Lv.F, 2)}, ${F.peq(Lv.p)}. Group means: ${G.map((l, j) => `${F.n(S.mean(gv[j]))} ± ${F.n(S.sd(gv[j]))} (${l})`).join(', ')}.`),
      };
    },
  },
  anova2: {
    name: '二因子 ANOVA', when: '兩個類別因子同時影響一個數值結果，含交互作用',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'a', label: '因子 A（x 軸）', t: 'cat' }, { k: 'b', label: '因子 B（不同線）', t: 'cat' }],
    run(ds, s) {
      if (s.a === s.b) throw new Error('兩個因子要選不同的變數。');
      const yc = colOf(ds, s.y), ac = colOf(ds, s.a), bc = colOf(ds, s.b), { idx, dropped } = complete(ds, [s.y, s.a, s.b]), La = levelsOf(ds, ac, idx), Lb = levelsOf(ds, bc, idx);
      if (La.length < 2 || Lb.length < 2) throw new Error('兩個因子都至少需要兩個水準。'); if (La.length * Lb.length > 24) throw new Error('組合太多（超過 24 種），請選擇水準較少的因子。');
      const ai = idx.map(i => La.indexOf(lab(ac.values[i]))), bi = idx.map(i => Lb.indexOf(lab(bc.values[i]))), y = idx.map(i => yc.values[i]);
      const cells = La.map((_, i) => Lb.map((__, j) => y.filter((v, k) => ai[k] === i && bi[k] === j)));
      if (cells.flat().some(c => c.length < 2)) throw new Error('每一種組合至少需要 2 個觀察值，才能估計組內變異。');
      let T; try { T = S.twoway(y, ai, bi); } catch (e) { catFail(e); }
      const bal = new Set(cells.flat().map(c => c.length)).size === 1, rowT = (nm, r) => [nm, F.n(r.ss), r.df, F.n(r.ms), F.n(r.F, 2), F.p(r.p)];
      return {
        title: `${esc(s.y)}：${esc(s.a)} × ${esc(s.b)}`, meta: meta(idx.length, dropped), facts: [bal ? `平衡設計：每種組合 ${cells[0][0].length} 個觀察值` : '非平衡設計：各組合人數不同，平方和採 Type II'],
        charts: [{ svg: interPlot(La, Lb, cells, s.y), legend: legend(Lb.map((l, j) => [col4(j), esc(l)])), cap: '交互作用圖：每個大點是一種組合的平均，同一條線是因子 B 的同一個水準。兩條線平行代表沒有交互作用。' }, { svg: distChart('F', T.AB.F, [T.AB.df, T.E.df], `交互作用的 F（自由度 ${T.AB.df}, ${T.E.df}）`), cap: distCap.F + '（交互作用）' }],
        cards: [cd('mainA', `${esc(s.a)} 主效果 F`, `${F.n(T.A.F, 2)}（p ${F.p(T.A.p)}）`, 'mainEff'), cd('mainB', `${esc(s.b)} 主效果 F`, `${F.n(T.B.F, 2)}（p ${F.p(T.B.p)}）`, 'mainEff'), cd('inter', '交互作用 F', `${F.n(T.AB.F, 2)}（df ${T.AB.df}, ${T.E.df}）`, 'interEff'), cd('p', 'p 值（交互作用）', F.p(T.AB.p), 'p')],
        tables: [{ head: [`${esc(s.a)} ＼ ${esc(s.b)}`, ...Lb.map(esc)], rows: La.map((l, i) => [`<b>${esc(l)}</b>`, ...Lb.map((_, j) => `${F.n(S.mean(cells[i][j]))} ± ${F.n(S.sd(cells[i][j]))} <span class="mut">(n=${cells[i][j].length})</span>`)]), foot: '各組合的平均 ± SD。' },
          { head: ['變異來源', 'SS', '自由度', 'MS', 'F', 'p 值'], rows: [rowT(esc(s.a), T.A), rowT(esc(s.b), T.B), rowT(`${esc(s.a)} × ${esc(s.b)}`, T.AB), ['殘差', F.n(T.E.ss), T.E.df, F.n(T.E.ms), '', '']], foot: '二因子 ANOVA（Type II 平方和）。' }],
        write: W2(`以二因子變異數分析（含交互作用項，Type II 平方和）分析 ${s.y} 與 ${s.a}、${s.b} 的關係。`,
          `${s.a}：F(${T.A.df}, ${T.E.df}) = ${F.n(T.A.F, 2)}，${F.peq(T.A.p)}；${s.b}：F(${T.B.df}, ${T.E.df}) = ${F.n(T.B.F, 2)}，${F.peq(T.B.p)}；${s.a} × ${s.b} 交互作用：F(${T.AB.df}, ${T.E.df}) = ${F.n(T.AB.F, 2)}，${F.peq(T.AB.p)}。`,
          `${s.y} was analysed by two-way analysis of variance with ${s.a}, ${s.b}, and their interaction (Type II sums of squares).`,
          `${s.a}: F(${T.A.df}, ${T.E.df}) = ${F.n(T.A.F, 2)}, ${F.peq(T.A.p)}; ${s.b}: F(${T.B.df}, ${T.E.df}) = ${F.n(T.B.F, 2)}, ${F.peq(T.B.p)}; ${s.a} × ${s.b} interaction: F(${T.AB.df}, ${T.E.df}) = ${F.n(T.AB.F, 2)}, ${F.peq(T.AB.p)}.`),
      };
    },
  },
  block: {
    name: '區集 ANOVA', when: '隨機完全區集設計：處理 + 區集（例如溫室、日期、窩）',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'tr', label: '處理', t: 'cat' }, { k: 'bk', label: '區集', t: 'cat' }],
    run(ds, s) {
      if (s.tr === s.bk) throw new Error('處理與區集要選不同的變數。');
      const yc = colOf(ds, s.y), tc = colOf(ds, s.tr), bc = colOf(ds, s.bk), { idx, dropped } = complete(ds, [s.y, s.tr, s.bk]), Lt = levelsOf(ds, tc, idx), Lb = levelsOf(ds, bc, idx);
      if (Lt.length < 2 || Lb.length < 2) throw new Error('處理與區集都至少需要兩個水準。');
      const ti = idx.map(i => Lt.indexOf(lab(tc.values[i]))), bi = idx.map(i => Lb.indexOf(lab(bc.values[i]))), y = idx.map(i => yc.values[i]);
      let R; try { R = S.blockAnova(y, ti, bi); } catch (e) { catFail(e); }
      const gv = Lt.map((_, k) => y.filter((v, i) => ti[i] === k)), A1 = S.anova(gv), rowT = (nm, r) => [nm, F.n(r.ss), r.df, F.n(r.ms), F.n(r.F, 2), F.p(r.p)];
      const box = boxStrip(Lt.map((l, k) => ({ label: l, v: gv[k] })), s.y, (X, Y, { bw }) => Lb.map((_, j) => { const pts = Lt.map((__, k) => { const v = y.filter((vv, i) => ti[i] === k && bi[i] === j); return v.length ? S.mean(v) : null; }); return `<path class="hlx" data-k="blk" d="${pts.map((m, k) => (m === null ? '' : `${k && pts[k - 1] !== null ? 'L' : 'M'}${X(k) + bw / 2 + 14} ${Y(m)}`)).join('')}" style="fill:none;stroke:${col4(j)};stroke-width:2"/>`; }).join(''));
      return {
        title: `${esc(s.y)}：${esc(s.tr)}（區集：${esc(s.bk)}）`, meta: meta(idx.length, dropped), facts: [`${Lb.length} 個區集、${Lt.length} 種處理`],
        charts: [{ svg: box, cap: boxCap + '亮起時：每條彩色線連接同一個區集在各處理的平均。' }, { svg: distChart('F', R.T.F, [R.T.df, R.E.df], `處理的 F（自由度 ${R.T.df}, ${R.E.df}）`), cap: distCap.F + '（處理，已扣除區集）' }],
        cards: [cd('F', '處理 F（考慮區集）', `${F.n(R.T.F, 2)}（df ${R.T.df}, ${R.E.df}）`, 'F'), cd('p', 'p 值（考慮區集）', F.p(R.T.p), 'p'), cd('blk', '區集 F', `${F.n(R.B.F, 2)}（df ${R.B.df}, ${R.E.df}）`, 'blockDef'), cd('blk', 'p 值（不考慮區集的單因子 ANOVA）', F.p(A1.p), 'blockDef')],
        tables: [{ head: ['變異來源', 'SS', '自由度', 'MS', 'F', 'p 值'], rows: [rowT(esc(s.tr), R.T), rowT(`區集（${esc(s.bk)}）`, R.B), ['殘差', F.n(R.E.ss), R.E.df, F.n(R.E.ms), '', '']], foot: `不考慮區集時：單因子 ANOVA F(${A1.df1}, ${A1.df2}) = ${F.n(A1.F, 2)}，${F.peq(A1.p)}；殘差均方 ${F.n(A1.msw)}。` }],
        write: W2(`以隨機完全區集設計的變異數分析（${s.tr} + 區集 ${s.bk}）分析 ${s.y}。`,
          `${s.tr}：F(${R.T.df}, ${R.E.df}) = ${F.n(R.T.F, 2)}，${F.peq(R.T.p)}；區集：F(${R.B.df}, ${R.E.df}) = ${F.n(R.B.F, 2)}，${F.peq(R.B.p)}。`,
          `${s.y} was analysed by analysis of variance for a randomized complete block design, with ${s.tr} as the treatment and ${s.bk} as the block.`,
          `${s.tr}: F(${R.T.df}, ${R.E.df}) = ${F.n(R.T.F, 2)}, ${F.peq(R.T.p)}; block: F(${R.B.df}, ${R.E.df}) = ${F.n(R.B.F, 2)}, ${F.peq(R.B.p)}.`),
      };
    },
  },
  rm: {
    name: '重複測量 ANOVA', when: '同一個體在三個以上時間點（或條件）的測量；每個時間點一欄',
    fields: [{ k: 'vars', label: '依時間順序勾選各時間點的欄位（至少 3 欄）', t: 'num', multi: true }],
    run(ds, s) {
      const vars = s.vars || []; if (vars.length < 3) throw new Error('請依時間順序勾選至少 3 個時間點的欄位；只有兩個時間點請用「配對比較」。');
      const cs = vars.map(v => colOf(ds, v)), { idx, dropped } = complete(ds, vars); if (idx.length < 3) throw new Error('至少需要 3 個個體的完整資料。');
      const M = idx.map(i => cs.map(c => c.values[i])), R = S.rmAnova(M), Fr = S.friedman(M), k = vars.length, cm = vars.map((_, j) => S.mean(M.map(r => r[j]))), [mn, mx] = S.minmax(M.flat());
      const ch = chart({ xcats: vars, y: [mn, mx], ylab: '測量值', h: 320 }, (X, Y) => M.map(r => `<path data-k="subj" d="${r.map((v, j) => `${j ? 'L' : 'M'}${X(j)} ${Y(v).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--c1);stroke-opacity:.3;stroke-width:1.5"/>`).join('') + `<path data-k="time F" d="${cm.map((v, j) => `${j ? 'L' : 'M'}${X(j)} ${Y(v)}`).join('')}" style="fill:none;stroke:var(--c2);stroke-width:3.5"/>` + cm.map((v, j) => `<circle data-k="time F" cx="${X(j)}" cy="${Y(v)}" r="5.5" style="fill:var(--c2)"/>`).join(''));
      return {
        title: `重複測量：${vars.map(esc).join(' → ')}`, meta: meta(idx.length, dropped) + `（個體數）`, facts: dropped ? [`有任何一個時間點缺值的個體（${dropped} 個）整個被排除；混合模型可以保留這些個體`] : [],
        charts: [{ svg: ch, legend: legend([['var(--c1)', '每個個體'], ['var(--c2)', '各時間點平均']]), cap: '每條淺藍線是一個個體在各時間點的測量值。' }, { svg: distChart('F', R.F, [R.df1, R.df2], `時間的 F（自由度 ${R.df1}, ${R.df2}）`), cap: distCap.F + '（未校正自由度）' }],
        cards: [cd('time', '時間 F', `${F.n(R.F, 2)}（df ${R.df1}, ${R.df2}）`, 'rmDef'), cd('p', 'p 值（未校正）', F.p(R.p), 'p'), cd('F', 'Greenhouse–Geisser ε', F.n(R.eps, 3), 'ggDef'), cd('time', 'p 值（Greenhouse–Geisser 校正）', F.p(R.pGG), 'ggDef'), cd('subj', 'p 值（Friedman）', F.p(Fr.p), 'friedDef')],
        tables: [{ head: ['時間點', 'n', '平均 ± SD'], rows: vars.map((v, j) => [esc(v), M.length, `${F.n(cm[j])} ± ${F.n(S.sd(M.map(r => r[j])))}`]) },
          { head: ['變異來源', 'SS', '自由度', 'MS', 'F', 'p 值'], rows: [['時間', F.n(R.ssT), R.df1, F.n(R.ssT / R.df1), F.n(R.F, 2), F.p(R.p)], ['個體', F.n(R.ssS), M.length - 1, F.n(R.ssS / (M.length - 1)), '', ''], ['殘差', F.n(R.ssE), R.df2, F.n(R.msE), '', '']], foot: `Greenhouse–Geisser ε = ${F.n(R.eps, 3)}；校正後自由度 ${F.n(R.df1 * R.eps, 2)}, ${F.n(R.df2 * R.eps, 2)}，${F.peq(R.pGG)}。Friedman χ²(${Fr.df}) = ${F.n(Fr.Q, 2)}，${F.peq(Fr.p)}。` }],
        write: W2(`${vars.join('、')} 的變化以單因子重複測量變異數分析檢定，並以 Greenhouse–Geisser 法校正球形假設；另以 Friedman 檢定計算。`,
          `時間：F(${R.df1}, ${R.df2}) = ${F.n(R.F, 2)}，Greenhouse–Geisser ε = ${F.n(R.eps, 2)}，校正後 ${F.peq(R.pGG)}；Friedman χ²(${Fr.df}) = ${F.n(Fr.Q, 2)}，${F.peq(Fr.p)}；n = ${M.length}。`,
          `Changes across ${vars.join(', ')} were tested by one-way repeated-measures analysis of variance with the Greenhouse–Geisser correction for sphericity, and by the Friedman test.`,
          `Time: F(${R.df1}, ${R.df2}) = ${F.n(R.F, 2)}, Greenhouse–Geisser ε = ${F.n(R.eps, 2)}, corrected ${F.peq(R.pGG)}; Friedman χ²(${Fr.df}) = ${F.n(Fr.Q, 2)}, ${F.peq(Fr.p)}; n = ${M.length}.`),
      };
    },
  },
  ancova: {
    name: '共變數分析（ANCOVA）', when: '比較組別平均，同時校正一個連續的共變數（例如基線值）',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'g', label: '組別', t: 'cat' }, { k: 'x', label: '共變數（數值，處理前測量）', t: 'num' }],
    run(ds, s) {
      if (s.y === s.x) throw new Error('結果變數與共變數要選不同的欄位。');
      const yc = colOf(ds, s.y), gc = colOf(ds, s.g), xc = colOf(ds, s.x), { idx, dropped } = complete(ds, [s.y, s.g, s.x]), G = levelsOf(ds, gc, idx);
      if (G.length < 2) throw new Error('組別至少需要兩組。'); if (G.length > 8) throw new Error('組別超過 8 組。');
      const y = idx.map(i => yc.values[i]), x = idx.map(i => xc.values[i]), gi = idx.map(i => G.indexOf(lab(gc.values[i])));
      let R; try { R = S.ancova(y, gi, x); } catch (e) { catFail(e); }
      const raw = G.map((_, l) => S.mean(y.filter((__, i) => gi[i] === l))), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(y), sl = R.cov.slope;
      const ch = chart({ x: [x0, x1], y: [y0, y1], xlab: s.x, ylab: s.y, h: 330, xgrid: true }, (X, Y) => y.map((v, i) => `<circle cx="${X(x[i]).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" style="fill:${col4(gi[i])};fill-opacity:.45"/>`).join('')
        + G.map((_, l) => `<line data-k="adj${l} slope" x1="${X(x0)}" x2="${X(x1)}" y1="${Y(R.adj[l] + sl * (x0 - R.xm))}" y2="${Y(R.adj[l] + sl * (x1 - R.xm))}" style="stroke:${col4(l)};stroke-width:2.5"/><circle class="hlx" data-k="adj${l}" cx="${X(R.xm)}" cy="${Y(R.adj[l])}" r="6" style="fill:${col4(l)}"/>`).join('')
        + `<line class="hlx" data-k="${G.map((_, l) => 'adj' + l).join(' ')}" x1="${X(R.xm)}" x2="${X(R.xm)}" y1="${Y(y0)}" y2="${Y(y1)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>`);
      return {
        title: `ANCOVA：${esc(s.y)}，依「${esc(s.g)}」校正 ${esc(s.x)}`, meta: meta(idx.length, dropped), facts: [`校正後平均＝共變數 ${esc(s.x)} 等於全體平均（${F.n(R.xm)}）時，各組的預測平均`],
        charts: [{ svg: ch, legend: legend(G.map((l, j) => [col4(j), esc(l)])), cap: '各組一條斜率相同的迴歸直線；亮起時，直線與灰色虛線（共變數的全體平均）的交點就是校正後平均。' }, { svg: distChart('F', R.group.F, [R.group.df1, R.group.df2], `組別的 F（自由度 ${R.group.df1}, ${R.group.df2}）`), cap: distCap.F + '（組別，已校正共變數）' }],
        cards: [...G.map((l, j) => cd('adj' + j, `${esc(l)} 校正後平均`, `${F.n(R.adj[j])}（未校正 ${F.n(raw[j])}）`, 'adjMean')), cd('F', '組別 F（校正後）', `${F.n(R.group.F, 2)}（df ${R.group.df1}, ${R.group.df2}）`, 'F'), cd('p', 'p 值（組別，校正後）', F.p(R.group.p), 'p'), cd('slope', `共變數斜率`, `${F.n(sl)}（p ${F.p(R.cov.p)}）`, 'slope'), cd('slope', '斜率平行性檢定 p', F.p(R.inter.p), 'parallel')],
        tables: [{ head: ['組別', '未校正平均', '校正後平均'], rows: G.map((l, j) => [esc(l), F.n(raw[j]), F.n(R.adj[j])]) }, { head: ['來源', 'F', '自由度', 'p 值'], rows: [[esc(s.g), F.n(R.group.F, 2), `${R.group.df1}, ${R.group.df2}`, F.p(R.group.p)], [esc(s.x), F.n(R.cov.F, 2), `1, ${R.cov.df2}`, F.p(R.cov.p)], [`${esc(s.g)} × ${esc(s.x)}（斜率是否平行）`, F.n(R.inter.F, 2), `${R.inter.df1}, ${R.inter.df2}`, F.p(R.inter.p)]], foot: '組別與共變數為 Type II F；最後一列為加入交互作用項的檢定。' }],
        write: W2(`以共變數分析比較各組 ${s.y}，校正 ${s.x}；並以 ${s.g} × ${s.x} 交互作用檢定迴歸斜率是否平行。`,
          `校正 ${s.x} 後，${s.g}：F(${R.group.df1}, ${R.group.df2}) = ${F.n(R.group.F, 2)}，${F.peq(R.group.p)}；校正後平均：${G.map((l, j) => `${l} ${F.n(R.adj[j])}`).join('、')}；${s.x} 斜率 = ${F.n(sl)}；斜率平行性檢定 ${F.peq(R.inter.p)}。`,
          `${s.y} was compared across ${s.g} groups by analysis of covariance adjusting for ${s.x}; parallelism of slopes was tested with the ${s.g} × ${s.x} interaction.`,
          `After adjustment for ${s.x}, ${s.g}: F(${R.group.df1}, ${R.group.df2}) = ${F.n(R.group.F, 2)}, ${F.peq(R.group.p)}; adjusted means ${G.map((l, j) => `${F.n(R.adj[j])} (${l})`).join(', ')}; slope for ${s.x} = ${F.n(sl)}; test of parallel slopes ${F.peq(R.inter.p)}.`),
      };
    },
  },
  chisq: {
    name: '類別關聯', when: '卡方、Fisher 精確檢定、勝算比與風險比：兩個類別變數',
    fields: [{ k: 'r', label: '列變數（例如暴露、組別）', t: 'cat' }, { k: 'c', label: '欄變數（例如結果）', t: 'cat' }],
    run(ds, s) {
      if (s.r === s.c) throw new Error('請選擇兩個不同的變數。');
      const rc = colOf(ds, s.r), cc = colOf(ds, s.c), { idx, dropped } = complete(ds, [s.r, s.c]), R = levelsOf(ds, rc, idx), C = levelsOf(ds, cc, idx);
      if (R.length < 2 || C.length < 2) throw new Error('兩個變數都至少需要兩個類別。'); if (R.length > 10 || C.length > 10) throw new Error('類別超過 10 個，請選擇類別較少的變數。');
      const tab = R.map(r => C.map(c => idx.filter(i => lab(rc.values[i]) === r && lab(cc.values[i]) === c).length)), t = S.chisq(tab), is22 = R.length === 2 && C.length === 2, N = idx.length;
      const colTot = C.map((_, j) => S.sum(tab.map(r => r[j]))), facts = [], rl = l => (/^-?\d+(\.\d+)?$/.test(l) ? `${s.r} = ${l}` : l);
      let fp = NaN, or = null, rr = null;
      if (is22) {
        const [[a, b], [c, d]] = tab; fp = S.fisher(a, b, c, d);
        const h = a * b * c * d === 0 ? 0.5 : 0, [A, B, Cc, D] = [a + h, b + h, c + h, d + h], lor = Math.log(A * D / (B * Cc)), se = Math.sqrt(1 / A + 1 / B + 1 / Cc + 1 / D);
        or = { est: Math.exp(lor), lo: Math.exp(lor - 1.96 * se), hi: Math.exp(lor + 1.96 * se) };
        const r1 = D / (Cc + D), r0 = B / (A + B), lrr = Math.log(r1 / r0), ser = Math.sqrt(1 / D - 1 / (Cc + D) + 1 / B - 1 / (A + B));
        rr = { est: r1 / r0, lo: Math.exp(lrr - 1.96 * ser), hi: Math.exp(lrr + 1.96 * ser), p1: d / (c + d), p0: b / (a + b) };
        facts.push(`OR 與 RR：${esc(C[1])} 的比較，${esc(R[1])} 相對於 ${esc(R[0])}`); if (h) facts.push('表中有 0 的格子，OR 與 RR 以每格加 0.5 計算');
      }
      const tag = (i, j) => (is22 && j === 1 ? `prop${i} or rr fisher` : '');
      const bars = stackChart(R, C, tab, `${s.c} 的比例（%）`, tag, (X, Y, { bw }) => { let acc = 0, g = ''; C.slice(0, -1).forEach((_, j) => { acc += 100 * colTot[j] / N; R.forEach((__, i) => { g += `<line class="hlx" data-k="exp chi2 cv" x1="${X(i) - bw / 2 - 6}" x2="${X(i) + bw / 2 + 6}" y1="${Y(acc)}" y2="${Y(acc)}" style="stroke:var(--ink);stroke-width:2.5;stroke-dasharray:5 3"/>`; }); }); return g; });
      const cards = [];
      if (is22) cards.push(cd('prop1', `${esc(rl(R[1]))}：${esc(C[1])} 比例`, `${F.n(100 * rr.p1, 1)}%`, 'prop'), cd('prop0', `${esc(rl(R[0]))}：${esc(C[1])} 比例`, `${F.n(100 * rr.p0, 1)}%`, 'prop'), cd('or', '勝算比 OR', `${F.n(or.est, 2)}（${F.ci(or.lo, or.hi, 2)}）`, 'or'), cd('rr', '風險比 RR', `${F.n(rr.est, 2)}（${F.ci(rr.lo, rr.hi, 2)}）`, 'rr'), cd('fisher', 'p 值（Fisher）', F.p(fp), 'fisher'));
      cards.push(cd('chi2', 'χ²', `${F.n(t.chi2, 2)}（df ${t.df}）`, 'chi2'), cd('p', 'p 值（卡方）', F.p(t.p), 'p'), cd('cv', "Cramér's V", F.n(t.V, 3), 'cv'), cd('exp', '最小期望次數', F.n(t.minExp, 2), 'minexp'));
      const rows = R.map((r, i) => { const tot = S.sum(tab[i]); return [`<b>${esc(r)}</b>`, ...tab[i].map((k, j) => `${k} <span class="mut">(${tot ? (100 * k / tot).toFixed(1) : '—'}%)</span><br><span class="mut small">期望 ${F.n(t.E[i] ? S.sum(tab[i]) * colTot[j] / N : NaN, 1)}</span>`), tot]; });
      rows.push(['合計', ...colTot, N]);
      const pTxtZh = `χ²(${t.df}) = ${F.n(t.chi2, 2)}，${F.peq(t.p)}${is22 ? `；Fisher ${F.peq(fp)}` : ''}；Cramér's V = ${F.n(t.V, 3)}`, pTxtEn = `χ²(${t.df}) = ${F.n(t.chi2, 2)}, ${F.peq(t.p)}${is22 ? `; Fisher's exact ${F.peq(fp)}` : ''}; Cramér's V = ${F.n(t.V, 3)}`;
      return {
        title: `${esc(s.r)} × ${esc(s.c)}`, meta: meta(N, dropped), facts,
        charts: [{ svg: bars, legend: legend(C.map((c, j) => [col4(j), esc(c)])), cap: '亮起時：黑色虛線＝兩變數無關時的期望比例。' }, { svg: distChart('chi2', t.chi2, t.df, `χ²（自由度 ${t.df}）`), cap: distCap.chi2 }],
        cards, tables: [{ head: [`${esc(s.r)} ＼ ${esc(s.c)}`, ...C.map(esc), '合計'], rows, foot: '括號內為列百分比。' }],
        write: W2(`類別變數間的關聯使用卡方檢定${is22 ? '與 Fisher 精確檢定，並計算勝算比、風險比及其 95% 信賴區間' : ''}。`,
          is22 ? `${rl(R[1])}：${tab[1][1]}/${S.sum(tab[1])}（${F.n(100 * rr.p1, 1)}%）；${rl(R[0])}：${tab[0][1]}/${S.sum(tab[0])}（${F.n(100 * rr.p0, 1)}%）；OR = ${F.n(or.est, 2)}（95% CI ${F.ci(or.lo, or.hi, 2)}）；RR = ${F.n(rr.est, 2)}（95% CI ${F.ci(rr.lo, rr.hi, 2)}）；${pTxtZh}。` : `${pTxtZh}。`,
          `Associations between categorical variables were assessed with the chi-square test${is22 ? " and Fisher's exact test; odds ratios and risk ratios with 95% confidence intervals were calculated" : ''}.`,
          is22 ? `${rl(R[1])}: ${tab[1][1]}/${S.sum(tab[1])} (${F.n(100 * rr.p1, 1)}%); ${rl(R[0])}: ${tab[0][1]}/${S.sum(tab[0])} (${F.n(100 * rr.p0, 1)}%); OR ${F.n(or.est, 2)} (95% CI ${F.cien(or.lo, or.hi, 2)}); RR ${F.n(rr.est, 2)} (95% CI ${F.cien(rr.lo, rr.hi, 2)}); ${pTxtEn}.` : `${pTxtEn}.`),
      };
    },
  },
  corr: {
    name: '相關', when: 'Pearson 與 Spearman：兩個數值變數',
    fields: [{ k: 'x', label: 'X 變數（數值）', t: 'num' }, { k: 'y', label: 'Y 變數（數值）', t: 'num' }],
    run(ds, s) {
      if (s.x === s.y) throw new Error('請選擇兩個不同的變數。');
      const xc = colOf(ds, s.x), yc = colOf(ds, s.y), { idx, dropped } = complete(ds, [s.x, s.y]); if (idx.length < 4) throw new Error('至少需要 4 筆完整資料。');
      const x = idx.map(i => xc.values[i]), y = idx.map(i => yc.values[i]), P = S.pearson(x, y), R = S.spearman(x, y), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(y), step = x.length > 1500 ? Math.ceil(x.length / 1500) : 1;
      const sc = chart({ x: [x0, x1], y: [y0, y1], xlab: s.x, ylab: s.y, h: 330, xgrid: true }, (X, Y) => { let g = ''; for (let i = 0; i < x.length; i += step) g += `<circle cx="${X(x[i]).toFixed(1)}" cy="${Y(y[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.45"/>`; return g + `<line data-k="r slope r2" x1="${X(x0)}" x2="${X(x1)}" y1="${Y(P.intercept + P.slope * x0)}" y2="${Y(P.intercept + P.slope * x1)}" style="stroke:var(--c2);stroke-width:2.5"/>`; });
      const rx = S.rank(x).r, ry = S.rank(y).r, n = x.length;
      const rk = chart({ x: [0, n], y: [0, n], xlab: `${s.x} 的名次`, ylab: `${s.y} 的名次`, h: 260 }, (X, Y) => { let g = ''; for (let i = 0; i < n; i += step) g += `<circle data-k="rho" cx="${X(rx[i]).toFixed(1)}" cy="${Y(ry[i]).toFixed(1)}" r="2.6" style="fill:var(--c3);fill-opacity:.5"/>`; return g; });
      return {
        title: `${esc(s.x)} 與 ${esc(s.y)}`, meta: meta(idx.length, dropped), facts: [],
        charts: [{ svg: sc, cap: `紅線為最小平方直線：${esc(s.y)} = ${F.n(P.intercept)} + ${F.n(P.slope)} × ${esc(s.x)}` }, { svg: rk, cap: '把兩個變數各自換成名次後的散佈圖（Spearman ρ 用的資料）。' }, { svg: distChart('t', P.t, P.df, `t（自由度 ${P.df}）`), cap: distCap.t }],
        cards: [cd('r', 'Pearson r（95% CI）', `${F.n(P.r, 3)}（${F.ci(...P.ci, 3)}）`, 'r'), cd('rho', 'Spearman ρ', F.n(R.rho, 3), 'rho'), cd('r2', 'r²', F.n(P.r * P.r, 3), 'r2'), cd('slope', '斜率', F.n(P.slope), 'slope'), cd('p', 'p 值（Pearson）', F.p(P.p), 'p')],
        tables: [{ head: ['方法', '係數', '95% CI', 'p 值'], rows: [['Pearson r', F.n(P.r, 3), F.ci(...P.ci, 3), F.p(P.p)], ['Spearman ρ', F.n(R.rho, 3), '—', F.p(R.p)]] }],
        write: W2(`連續變數間的關聯以 Pearson 相關係數（信賴區間以 Fisher z 轉換計算）與 Spearman 等級相關係數表示。`,
          `${s.x} 與 ${s.y}：Pearson r = ${F.n(P.r, 2)}（95% CI ${F.ci(...P.ci, 2)}，${F.peq(P.p)}）；Spearman ρ = ${F.n(R.rho, 2)}（${F.peq(R.p)}）；n = ${idx.length}。`,
          `Associations between continuous variables are reported as Pearson's correlation coefficient (confidence intervals via Fisher's z transformation) and Spearman's rank correlation coefficient.`,
          `${s.x} and ${s.y}: Pearson r = ${F.n(P.r, 2)} (95% CI ${F.cien(...P.ci, 2)}, ${F.peq(P.p)}); Spearman ρ = ${F.n(R.rho, 2)} (${F.peq(R.p)}); n = ${idx.length}.`),
      };
    },
  },
  linreg: {
    name: '線性迴歸', when: '數值結果與一個或多個預測變數',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'xs', label: '預測變數（第一個勾選者列在最前）', t: 'any', multi: true }],
    run(ds, s) {
      const xs = (s.xs || []).filter(v => v !== s.y); if (!xs.length) throw new Error('請至少勾選一個預測變數。');
      const { idx, dropped } = complete(ds, [s.y, ...xs]), yc = colOf(ds, s.y), D = design(ds, idx, xs), X0 = D.X.map(r => [1, ...r]), y = idx.map(i => yc.values[i]);
      if (idx.length <= X0[0].length + 1) throw new Error(`樣本數（${idx.length}）不足以估計 ${X0[0].length} 個參數。`);
      let m; try { m = S.ols(X0, y); } catch (e) { catFail(e); }
      const rowsB = D.names.map((nm, i) => ({ k: 'b' + (i + 1), label: nm, est: m.b[i + 1], lo: m.ci[i + 1][0], hi: m.ci[i + 1][1] }));
      const charts = [{ svg: forestChart(rowsB, 'β（與參考值 0 的距離）', false), cap: '每列為一個迴歸係數：方塊＝β，橫線＝95% CI，虛線＝0。' }];
      if (xs.length === 1 && colOf(ds, xs[0]).type === 'num') {
        const x = D.X.map(r => r[0]), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(y);
        charts.push({ svg: chart({ x: [x0, x1], y: [y0, y1], xlab: xs[0], ylab: s.y, h: 320 }, (Xs, Ys) => x.map((v, i) => `<circle data-k="r2" cx="${Xs(v).toFixed(1)}" cy="${Ys(y[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.45"/>`).join('') + `<line data-k="b1 r2" x1="${Xs(x0)}" x2="${Xs(x1)}" y1="${Ys(m.b[0] + m.b[1] * x0)}" y2="${Ys(m.b[0] + m.b[1] * x1)}" style="stroke:var(--c2);stroke-width:2.5"/>`), cap: '散佈圖與迴歸直線。' });
      }
      const [f0, f1] = S.minmax(m.fitted), [r0, r1] = S.minmax(m.resid), ra = Math.max(Math.abs(r0), Math.abs(r1));
      charts.push({ svg: chart({ x: [f0, f1], y: [-ra, ra], xlab: '預測值', ylab: '殘差', h: 280 }, (Xs, Ys, { M, iw }) => `<line x1="${M.l}" x2="${M.l + iw}" y1="${Ys(0)}" y2="${Ys(0)}" style="stroke:var(--muted);stroke-dasharray:5 4"/>` + m.fitted.map((v, i) => `<circle data-k="r2 sigma" cx="${Xs(v).toFixed(1)}" cy="${Ys(m.resid[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.45"/>`).join('') + `<g class="hlx" data-k="sigma"><rect x="${M.l}" y="${Ys(m.sigma)}" width="${iw}" height="${Ys(-m.sigma) - Ys(m.sigma)}" style="fill:var(--c2);fill-opacity:.12"/></g>`), cap: '殘差（實際值 − 預測值）對預測值；虛線＝0。' });
      charts.push({ svg: distChart('F', m.F, [m.df1, m.df2], `F（自由度 ${m.df1}, ${m.df2}）`), cap: distCap.F + '（整體模型）' });
      const others = xs.slice(1);
      return {
        title: `線性迴歸：${esc(s.y)}`, meta: meta(idx.length, dropped), facts: D.refs.map(esc),
        charts, cards: [...rowsB.map(r => cd(r.k, `β：${esc(r.label)}`, `${F.n(r.est)}（${F.ci(r.lo, r.hi)}）`, 'beta')), cd('r2', 'R²', F.n(m.r2, 3), 'r2'), cd('sigma', '殘差標準誤', F.n(m.sigma), 'sigma'), cd('F', 'F（整體模型）', `${F.n(m.F, 2)}（df ${m.df1}, ${m.df2}）`, 'F'), cd('p', 'p 值（整體模型）', F.p(m.pF), 'p')],
        tables: [{ head: ['變數', 'β', '95% CI', 't', 'p 值'], rows: ['截距', ...D.names].map((nm, j) => [j ? `<b>${esc(nm)}</b>` : `<span class="mut">${nm}</span>`, F.n(m.b[j]), F.ci(...m.ci[j]), F.n(m.t[j], 2), F.p(m.p[j])]), foot: `R² = ${F.n(m.r2, 3)}；調整後 R² = ${F.n(m.adj, 3)}；F(${m.df1}, ${m.df2}) = ${F.n(m.F, 2)}，${F.peq(m.pF)}；殘差標準誤 = ${F.n(m.sigma)}` }],
        write: W2(`以多元線性迴歸分析 ${s.y} 與 ${joinZh(xs)}${D.refs.length ? '（類別變數以虛擬變數編碼）' : ''}，結果以迴歸係數 β 與 95% 信賴區間表示。`,
          `${D.names[0]}：β = ${F.n(m.b[1])}（95% CI ${F.ci(...m.ci[1])}，${F.peq(m.p[1])}）${others.length ? `，模型中同時納入 ${joinZh(others)}` : ''}；R² = ${F.n(m.r2, 3)}；n = ${idx.length}。`,
          `Multiple linear regression was used to model ${s.y} with ${joinEn(xs)}${D.refs.length ? ' (categorical variables dummy-coded)' : ''}; results are reported as regression coefficients (β) with 95% confidence intervals.`,
          `${D.names[0]}: β = ${F.n(m.b[1])} (95% CI ${F.cien(...m.ci[1])}, ${F.peq(m.p[1])})${others.length ? `, with ${joinEn(others)} in the model` : ''}; R² = ${F.n(m.r2, 3)}; n = ${idx.length}.`),
      };
    },
  },
  logreg: {
    name: '邏輯斯迴歸', when: '二元結果（有／無）與一個或多個預測變數，得到勝算比',
    fields: [{ k: 'y', label: '結果變數（二元）', t: 'bin' }, { k: 'xs', label: '預測變數（第一個勾選者列在最前）', t: 'any', multi: true }],
    run(ds, s) {
      const xs = (s.xs || []).filter(v => v !== s.y); if (!xs.length) throw new Error('請至少勾選一個預測變數。');
      const { idx, dropped } = complete(ds, [s.y, ...xs]), yc = colOf(ds, s.y), B = binCode(ds, yc, idx), D = design(ds, idx, xs), X0 = D.X.map(r => [1, ...r]);
      const ev = S.sum(B.y), nev = idx.length - ev; if (ev < 2 || nev < 2) throw new Error('事件數或非事件數太少，無法建立模型。');
      let m; try { m = S.logistic(X0, B.y); } catch (e) { catFail(e); }
      const k = D.names.length, rows = D.names.map((nm, i) => { const j = i + 1, b = m.b[j], se = m.se[j]; return { k: 'o' + j, label: nm, est: Math.exp(b), lo: Math.exp(b - 1.96 * se), hi: Math.exp(b + 1.96 * se), p: m.p[j] }; });
      const A = S.auc(m.mu, B.y), lr = 2 * (m.ll - m.ll0), plr = S.pchisq(lr, k), facts = [`事件：${esc(s.y)} = ${esc(B.ev)}（編碼 1）；非事件：${esc(B.ref)}`, ...D.refs.map(esc), `事件數 ÷ 參數數 = ${F.n(Math.min(ev, nev) / k, 1)}`];
      if (!m.conv) facts.push('模型在 100 次迭代內未收斂');
      return {
        title: `邏輯斯迴歸：${esc(s.y)} = ${esc(B.ev)}`, meta: meta(idx.length, dropped) + `；事件 ${ev} 例（${F.n(100 * ev / idx.length, 1)}%）`, facts,
        charts: [{ svg: forestChart(rows, '勝算比 OR（對數尺度）'), cap: '方塊＝OR，橫線＝95% CI，虛線＝OR 1。' }, { svg: rocChart(m.mu, B.y), cap: '以模型預測機率畫出的 ROC 曲線；對角虛線為 AUC 0.5 的參考線。' }, { svg: distChart('chi2', lr, k, `概似比 χ²（自由度 ${k}）`), cap: distCap.chi2 + '（整體模型）' }],
        cards: [...rows.map(r => cd(r.k, `OR：${esc(r.label)}`, `${F.n(r.est, 2)}（${F.ci(r.lo, r.hi, 2)}）`, 'OR')), cd('auc', 'AUC', F.n(A, 3), 'auc'), cd('chi2', '概似比 χ²', `${F.n(lr, 2)}（df ${k}）`, 'lr'), cd('p', 'p 值（整體模型）', F.p(plr), 'p')],
        tables: [{ head: ['變數', 'OR', '95% CI', 'p 值'], rows: rows.map(r => [`<b>${esc(r.label)}</b>`, F.n(r.est, 2), F.ci(r.lo, r.hi, 2), F.p(r.p)]), foot: `AUC = ${F.n(A, 3)}；概似比 χ²(${k}) = ${F.n(lr, 2)}，${F.peq(plr)}；McFadden pseudo-R² = ${F.n(1 - m.ll / m.ll0, 3)}` }],
        write: W2(`以多變項邏輯斯迴歸分析 ${s.y}，模型納入 ${joinZh(xs)}；結果以勝算比（OR）及 95% 信賴區間表示，並計算 ROC 曲線下面積（AUC）。`,
          `n = ${idx.length}，事件 ${ev} 例（${F.n(100 * ev / idx.length, 1)}%）。${rows.map(r => `${r.label}：OR = ${F.n(r.est, 2)}（95% CI ${F.ci(r.lo, r.hi, 2)}，${F.peq(r.p)}）`).join('；')}；AUC = ${F.n(A, 2)}。`,
          `Multivariable logistic regression including ${joinEn(xs)} was used to model ${s.y}. Results are reported as odds ratios (ORs) with 95% confidence intervals; the area under the ROC curve (AUC) was calculated.`,
          `n = ${idx.length}; ${ev} events (${F.n(100 * ev / idx.length, 1)}%). ${rows.map(r => `${r.label}: OR ${F.n(r.est, 2)} (95% CI ${F.cien(r.lo, r.hi, 2)}, ${F.peq(r.p)})`).join('; ')}; AUC ${F.n(A, 2)}.`),
      };
    },
  },
  surv: {
    name: '存活分析', when: 'Kaplan–Meier、log-rank 與 Cox 迴歸：時間至事件資料',
    fields: [{ k: 'time', label: '追蹤時間（數值）', t: 'num' }, { k: 'status', label: '事件狀態（1 = 事件，0 = 設限）', t: 'bin' }, { k: 'g', label: '比較組別（可留空）', t: 'cat', opt: true }, { k: 'xs', label: 'Cox 模型的變數（可留空，留空時使用比較組別）', t: 'any', multi: true, opt: true }],
    run(ds, s) {
      const xs = (s.xs || []).filter(v => v !== s.time && v !== s.status), names = [s.time, s.status, ...(s.g ? [s.g] : []), ...xs.filter(v => v !== s.g)];
      const { idx, dropped } = complete(ds, names), tc = colOf(ds, s.time), B = binCode(ds, colOf(ds, s.status), idx), time = idx.map(i => tc.values[i]), st = B.y;
      if (time.some(t => t < 0)) throw new Error('追蹤時間不能是負數。');
      let G = ['全體'], gi = idx.map(() => 0);
      if (s.g) { const gc = colOf(ds, s.g); G = levelsOf(ds, gc, idx); if (G.length > 6) throw new Error('比較組別超過 6 組。'); gi = idx.map(i => G.indexOf(lab(gc.values[i]))); }
      const curves = G.map((l, k) => { const ii = gi.map((g, i) => (g === k ? i : -1)).filter(i => i >= 0); return { label: l, ...S.km(ii.map(i => time[i]), ii.map(i => st[i])), tt: ii.map(i => time[i]) }; });
      const maxT = Math.max(...time), sc = niceScale(0, maxT, 6), tk = sc.ticks.filter(t => t > 0 && t < maxT), t1 = tk[Math.floor((tk.length - 1) / 3)], t2 = tk[Math.floor(2 * (tk.length - 1) / 3)] ?? t1;
      const km = chart({ x: [0, maxT], y: [0, 1], ylab: '存活機率', xlab: s.time, h: 330 }, (X, Y) => {
        let g = `<line class="hlx" data-k="${curves.map((_, i) => 'med' + i).join(' ')}" x1="${X(0)}" x2="${X(maxT)}" y1="${Y(0.5)}" y2="${Y(0.5)}" style="stroke:var(--muted);stroke-dasharray:4 4"/>`;
        curves.forEach((c, i) => {
          let d = `M${X(0)} ${Y(1)}`; c.steps.slice(1).forEach(p => { d += `H${X(p.t).toFixed(1)}V${Y(p.S).toFixed(1)}`; }); d += `H${X(c.end).toFixed(1)}`;
          g += `<path class="keep" data-k="km${i}" d="${d}" style="fill:none;stroke:${col4(i)};stroke-width:2.2"/>` + c.cens.map(z => `<line x1="${X(z.t).toFixed(1)}" x2="${X(z.t).toFixed(1)}" y1="${Y(z.S) - 4}" y2="${Y(z.S) + 4}" style="stroke:${col4(i)}"/>`).join('');
          if (Number.isFinite(c.median)) g += `<line class="hlx" data-k="med${i}" x1="${X(c.median)}" x2="${X(c.median)}" y1="${Y(0.5)}" y2="${Y(0)}" style="stroke:${col4(i)};stroke-width:2.5"/>`;
          [[t1, 's1_'], [t2, 's2_']].forEach(([T, kk]) => { const a = c.at(T); g += `<g class="hlx" data-k="${kk}${i}"><line x1="${X(T)}" x2="${X(T)}" y1="${Y(a.lo)}" y2="${Y(a.hi)}" style="stroke:${col4(i)};stroke-width:4"/><circle cx="${X(T)}" cy="${Y(a.S)}" r="5" style="fill:${col4(i)}"/></g>`; });
        });
        return g;
      });
      const ticksIn = sc.ticks.filter(t => t <= maxT);
      const risk = `<div class="tbl-wrap"><table class="st risk"><thead><tr><th>風險人數</th>${ticksIn.map(t => `<th>${tickFmt(t, sc.step)}</th>`).join('')}</tr></thead><tbody>${curves.map((c, i) => `<tr><td><i class="sw" style="background:${col4(i)}"></i>${esc(c.label)}</td>${ticksIn.map(t => `<td>${c.tt.filter(x => x >= t).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      const charts = [{ svg: km, legend: legend(curves.map((c, i) => [col4(i), esc(c.label)])), cap: '短直線＝設限時間點；下方為各時間點的風險人數。', after: risk }];
      const sAt = (c, T) => { const x = c.at(T); return `${F.n(100 * x.S, 1)}%（${F.n(100 * x.lo, 1)}–${F.n(100 * x.hi, 1)}）`; };
      const cards = curves.flatMap((c, i) => [cd('med' + i, `${esc(c.label)} 中位存活`, Number.isFinite(c.median) ? F.n(c.median) : '未降到 0.5', 'medsurv'), cd('s1_' + i, `${esc(c.label)} 存活率 @ ${t1}`, sAt(c, t1), 'surv'), cd('s2_' + i, `${esc(c.label)} 存活率 @ ${t2}`, sAt(c, t2), 'surv')]);
      const tables = [{ head: ['組別', 'n', '事件', '中位存活', `存活率 @ ${t1}`, `存活率 @ ${t2}`], rows: curves.map(c => [`<b>${esc(c.label)}</b>`, c.n, c.events, Number.isFinite(c.median) ? F.n(c.median) : '—', sAt(c, t1), sAt(c, t2)]), foot: '存活率括號為 95% CI（log(−log) 轉換）。' }];
      let L = null; const facts = [`事件：${esc(s.status)} = ${esc(B.ev)}`];
      if (G.length >= 2) {
        L = S.logrank(time, st, gi, G.length);
        charts.push({ svg: distChart('chi2', L.chi2, L.df, `log-rank χ²（自由度 ${L.df}）`), cap: distCap.chi2 });
        cards.push(cd('chi2', 'log-rank χ²', `${F.n(L.chi2, 2)}（df ${L.df}）`, 'logrank'), cd('p', 'p 值（log-rank）', F.p(L.p), 'p'));
        tables.push({ head: ['組別', '觀察事件 O', '期望事件 E', 'O ÷ E'], rows: G.map((l, k) => [esc(l), F.n(L.O[k], 0), F.n(L.E[k], 1), F.n(L.O[k] / L.E[k], 2)]) });
      }
      const cv = xs.length ? xs : s.g ? [s.g] : []; let hr = null;
      if (cv.length) {
        const D = design(ds, idx, cv); let m; try { m = S.cox(time, st, D.X); } catch (e) { catFail(e); }
        hr = D.names.map((nm, j) => ({ k: 'h' + j, label: nm, est: Math.exp(m.b[j]), lo: Math.exp(m.b[j] - 1.96 * m.se[j]), hi: Math.exp(m.b[j] + 1.96 * m.se[j]), p: m.p[j] }));
        charts.push({ svg: forestChart(hr, '危險比 HR（對數尺度）'), cap: 'Cox 比例風險模型（Breslow 法處理同時事件）：方塊＝HR，橫線＝95% CI，虛線＝HR 1。' });
        cards.push(...hr.map(r => cd(r.k, `HR：${esc(r.label)}`, `${F.n(r.est, 2)}（${F.ci(r.lo, r.hi, 2)}）`, 'hr')));
        tables.push({ head: ['變數', 'HR', '95% CI', 'p 值'], rows: hr.map(r => [`<b>${esc(r.label)}</b>`, F.n(r.est, 2), F.ci(r.lo, r.hi, 2), F.p(r.p)]) });
        facts.push(...D.refs.map(esc), `事件數 ÷ 參數數 = ${F.n(S.sum(st) / D.names.length, 1)}`);
      }
      const medZh = curves.map(c => `${s.g ? c.label + ' ' : ''}${Number.isFinite(c.median) ? F.n(c.median) : '未達到'}`).join('、'), medEn = curves.map(c => `${Number.isFinite(c.median) ? F.n(c.median) : 'not reached'}${s.g ? ` (${c.label})` : ''}`).join(' vs ');
      return {
        title: `存活分析：${esc(s.time)}${s.g ? `，依「${esc(s.g)}」` : ''}`, meta: meta(idx.length, dropped) + `；事件 ${S.sum(st)} 例`, facts, charts, cards, tables,
        write: W2(`存活曲線以 Kaplan–Meier 法估計${L ? '，組間以 log-rank 檢定比較' : ''}${hr ? `；以 Cox 比例風險模型估計危險比（HR）及 95% 信賴區間，模型納入 ${joinZh(cv)}` : ''}。`,
          `事件 ${S.sum(st)} 例；中位存活時間 ${medZh}${L ? `（log-rank χ²(${L.df}) = ${F.n(L.chi2, 2)}，${F.peq(L.p)}）` : ''}${hr ? `；${hr.map(r => `${r.label}：HR = ${F.n(r.est, 2)}（95% CI ${F.ci(r.lo, r.hi, 2)}，${F.peq(r.p)}）`).join('；')}` : ''}。`,
          `Survival was estimated with the Kaplan–Meier method${L ? ' and compared with the log-rank test' : ''}${hr ? `; hazard ratios (HRs) with 95% confidence intervals were estimated with Cox proportional hazards regression including ${joinEn(cv)}` : ''}.`,
          `${S.sum(st)} events; median survival ${medEn}${L ? ` (log-rank χ²(${L.df}) = ${F.n(L.chi2, 2)}, ${F.peq(L.p)})` : ''}${hr ? `; ${hr.map(r => `${r.label}: HR ${F.n(r.est, 2)} (95% CI ${F.cien(r.lo, r.hi, 2)}, ${F.peq(r.p)})`).join('; ')}` : ''}.`),
      };
    },
  },
  multi: {
    name: '多重檢定', when: '一次比較大量變數（如基因），計算 BH q 值與 Bonferroni',
    fields: [{ k: 'g', label: '分組變數（兩組）', t: 'cat' }, { k: 'vars', label: '要檢定的變數（數值）', t: 'num', multi: true, def: 'all' }],
    run(ds, s) {
      const gc = colOf(ds, s.g), vars = (s.vars || []).filter(v => v !== s.g); if (vars.length < 2) throw new Error('請至少勾選兩個要檢定的變數。');
      const base = [...Array(ds.n).keys()].filter(i => gc.values[i] !== null), G = levelsOf(ds, gc, base); if (G.length !== 2) throw new Error(`分組變數需要剛好兩組，「${s.g}」有 ${G.length} 組。`);
      const res = [];
      for (const v of vars) { const c = colOf(ds, v), gv = G.map(l => base.filter(i => lab(gc.values[i]) === l && c.values[i] !== null).map(i => c.values[i])); if (gv.some(a => a.length < 2)) continue; const w = S.welch(gv[0], gv[1]); if (Number.isFinite(w.p)) res.push({ v, diff: w.diff, p: w.p }); }
      if (res.length < 2) throw new Error('可檢定的變數不足。');
      const m = res.length, q = S.bh(res.map(r => r.p)); res.forEach((r, i) => { r.q = q[i]; r.bf = Math.min(1, r.p * m); }); res.sort((a, b) => a.p - b.p);
      const k0 = res.filter(r => r.p < 0.05).length, k1 = res.filter(r => r.q < 0.05).length, k2 = res.filter(r => r.bf < 0.05).length, bhCut = k1 ? Math.max(...res.filter(r => r.q < 0.05).map(r => r.p)) : null;
      const xs = res.map(r => r.diff), ys = res.map(r => -Math.log10(Math.max(1e-300, r.p))), [x0, x1] = S.minmax(xs), ax = Math.max(Math.abs(x0), Math.abs(x1)), ym = Math.max(2, -Math.log10(0.05 / m) + 0.3, ...ys);
      const ch = chart({ x: [-ax, ax], y: [0, ym], xlab: `差值（${G[1]} − ${G[0]}）`, ylab: '−log10(p)', h: 340, xgrid: true }, (X, Y, { M, iw }) => {
        const hl = (y, k, c) => `<line class="${k === 'sig' ? '' : 'hlx'}" data-k="${k}" x1="${M.l}" x2="${M.l + iw}" y1="${Y(y)}" y2="${Y(y)}" style="stroke:${c};stroke-width:1.5;stroke-dasharray:5 4"/>`;
        let g = hl(-Math.log10(0.05), 'sig', 'var(--muted)') + hl(-Math.log10(0.05 / m), 'bf', 'var(--c3)') + (bhCut ? hl(-Math.log10(bhCut), 'bh', 'var(--c2)') : '');
        res.forEach((r, i) => { const tg = [r.p < 0.05 ? 'sig' : '', r.q < 0.05 ? 'bh' : '', r.bf < 0.05 ? 'bf' : ''].join(' ').trim(); g += `<circle data-k="${tg}" cx="${X(r.diff).toFixed(1)}" cy="${Y(ys[i]).toFixed(1)}" r="3.5" style="fill:${r.q < 0.05 ? 'var(--c2)' : 'var(--muted)'};fill-opacity:.8"/>`; });
        return g;
      });
      const tables = [];
      if (ds.truth) {
        const T = new Set(ds.truth), sc = f => { const sg = res.filter(f), tp = sg.filter(r => T.has(r.v)).length; return [tp, sg.length - tp]; }, a = sc(r => r.p < 0.05), b = sc(r => r.q < 0.05), c = sc(r => r.bf < 0.05);
        tables.push({ head: ['方法', `模擬時設定為有差異的變數（共 ${T.size} 個）`, '模擬時設定為無差異的變數'], rows: [['未校正 p < 0.05', a[0], a[1]], ['BH q < 0.05', b[0], b[1]], ['Bonferroni', c[0], c[1]]], foot: '這份模擬資料事先設定了哪些變數有差異，所以可以對照；真實資料沒有這一欄。' });
      }
      tables.push({ head: ['變數', '差值', 'p 值', 'BH q 值', 'Bonferroni p'], rows: res.map(r => [esc(r.v), F.n(r.diff), F.p(r.p), F.p(r.q), F.p(r.bf)]), scroll: true });
      return {
        title: `多重檢定：${m} 個變數，${esc(G[1])} vs ${esc(G[0])}`, meta: `樣本 n = ${base.length}；每個變數為 Welch t 檢定`, facts: [],
        charts: [{ svg: ch, legend: legend([['var(--c2)', 'BH q < 0.05'], ['var(--muted)', 'BH q ≥ 0.05']]), cap: '火山圖：每個點是一個變數。灰色虛線＝p 0.05；亮起時另顯示 Bonferroni 門檻（0.05 ÷ m）與 BH 門檻。' }],
        cards: [cd('sig', '未校正 p < 0.05', `${k0} 個`, 'sig'), cd('bh', 'BH q < 0.05', `${k1} 個`, 'q'), cd('bf', 'Bonferroni < 0.05', `${k2} 個`, 'bonf')],
        tables,
        write: W2(`各變數兩組間以 Welch t 檢定比較，並以 Benjamini–Hochberg 法計算 q 值、以 Bonferroni 法校正 p 值。`,
          `檢定 ${m} 個變數：未校正 p < 0.05 者 ${k0} 個；BH q < 0.05 者 ${k1} 個${k1 ? `（${res.filter(r => r.q < 0.05).slice(0, 8).map(r => r.v).join('、')}${k1 > 8 ? ' 等' : ''}）` : ''}；Bonferroni 校正後 < 0.05 者 ${k2} 個。`,
          `Each variable was compared between groups with Welch's t test; q values were calculated with the Benjamini–Hochberg procedure and p values were also Bonferroni-adjusted.`,
          `${m} variables tested: ${k0} with unadjusted p < 0.05; ${k1} with BH q < 0.05${k1 ? ` (${res.filter(r => r.q < 0.05).slice(0, 8).map(r => r.v).join(', ')}${k1 > 8 ? ', and others' : ''})` : ''}; ${k2} with Bonferroni-adjusted p < 0.05.`),
      };
    },
  },
  power: {
    name: '樣本數計算', when: '研究開始前：偵測某個效果需要的人數', fields: [], nodata: true,
    run() { return { title: '樣本數與檢定力', meta: '不需要資料集', facts: [], charts: [], cards: [], tables: [], html: '<div class="widget" id="lab-power"></div>', mount: 'lab-power' }; },
  },
};
// ==PURE-END==
