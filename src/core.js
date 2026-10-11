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

  return { lgamma, ibeta, pnorm, pz2, qnorm, pt, pt2, qt, pf, pchisq, sum, mean, variance, sd, quantile, median, skew, minmax, rank, welch, mannWhitney, pairedT, wilcoxonSR, anova, kruskal, chisq, fisher, pearson, spearman, inv, ols, logistic, auc, cox, km, logrank, bh, holm, nMeans, powerMeans, nProps, powerProps };
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
    c.map((n, i) => `<rect x="${(X(lo + i * bw) + 0.5).toFixed(1)}" y="${Y(n).toFixed(1)}" width="${Math.max(0, X(lo + (i + 1) * bw) - X(lo + i * bw) - 1).toFixed(1)}" height="${(Y(0) - Y(n)).toFixed(1)}" style="fill:${o.color ? o.color(i) : 'var(--c1)'}"/>`).join('') + (o.extra ? o.extra(X, Y) : ''));
}
function boxStrip(groups, ylab) {
  const [mn, mx] = S.minmax(groups.flatMap(g => g.v));
  return chart({ xcats: groups.map(g => `${g.label}（n=${g.v.length}）`), y: [mn, mx], ylab, h: 330 }, (X, Y, { iw }) => {
    const bw = Math.min(64, iw / groups.length * 0.4); let s = '';
    groups.forEach((g, i) => {
      const c = col4(i), x = X(i), q1 = S.quantile(g.v, 0.25), q3 = S.quantile(g.v, 0.75), md = S.median(g.v), iqr = q3 - q1;
      const [wl, wh] = S.minmax(g.v.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr));
      if (g.v.length <= 500) g.v.forEach((v, k) => { const jx = x + (((k * 0.6180339887) % 1) - 0.5) * bw * 1.5; s += `<circle cx="${jx.toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" style="fill:${c};fill-opacity:.4"/>`; });
      s += `<line x1="${x}" x2="${x}" y1="${Y(wl)}" y2="${Y(q1)}" class="ink"/><line x1="${x}" x2="${x}" y1="${Y(q3)}" y2="${Y(wh)}" class="ink"/>`;
      s += `<rect x="${x - bw / 2}" y="${Y(q3)}" width="${bw}" height="${Math.max(1, Y(q1) - Y(q3))}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>`;
      s += `<line x1="${x - bw / 2}" x2="${x + bw / 2}" y1="${Y(md)}" y2="${Y(md)}" style="stroke:${c};stroke-width:3"/>`;
      const m = S.mean(g.v); s += `<path d="M${x} ${Y(m) - 6}l6 6l-6 6l-6 -6z" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.2"/>`;
    });
    return s;
  });
}
const boxCap = '箱型為四分位距、粗線為中位數、鬚線延伸至 1.5 倍 IQR 內的最遠值；◇ 為平均數；點為個別觀察值。';
function forestChart(rows, xlab) {
  let lo = Math.min(...rows.map(r => r.lo)), hi = Math.max(...rows.map(r => r.hi));
  lo = Math.max(1e-3, Math.min(lo, 1) * 0.8); hi = Math.min(1e3, Math.max(hi, 1) * 1.25);
  const ml = Math.min(260, CW * 0.42, 24 + Math.max(...rows.map(r => r.label.length)) * 7.5);
  return chart({ ycats: rows.map(r => r.label), xlog: true, x: [lo, hi], xlab, h: 60 + rows.length * 34, m: { l: ml } }, (X, Y, { M, ih }) => {
    let s = `<line x1="${X(1)}" x2="${X(1)}" y1="${M.t}" y2="${M.t + ih}" style="stroke:var(--muted);stroke-dasharray:4 3"/>`;
    rows.forEach((r, i) => { const y = Y(i); s += `<line x1="${X(Math.max(lo, r.lo))}" x2="${X(Math.min(hi, r.hi))}" y1="${y}" y2="${y}" style="stroke:var(--c1);stroke-width:2"/><rect x="${X(r.est) - 5}" y="${y - 5}" width="10" height="10" style="fill:var(--c1)"/>`; });
    return s;
  });
}

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

const AN = {
  table1: {
    name: '描述統計／Table 1', when: '描述研究對象的基本特徵，可依組別分欄',
    fields: [{ k: 'g', label: '分組變數（可留空）', t: 'cat', opt: true }, { k: 'vars', label: '要描述的變數', t: 'any', multi: true, def: 'some' }],
    run(ds, s) {
      const vars = (s.vars || []).filter(v => v && v !== s.g); if (!vars.length) throw new Error('請至少勾選一個要描述的變數。');
      let base = [...Array(ds.n).keys()], dropped = 0, G = null, gIdx = null;
      if (s.g) {
        const gc = colOf(ds, s.g), keep = base.filter(i => gc.values[i] !== null); dropped = base.length - keep.length; base = keep;
        G = levelsOf(ds, gc, base); if (G.length > 8) throw new Error('分組變數超過 8 組，請選擇類別較少的變數。');
        gIdx = G.map(l => base.filter(i => lab(gc.values[i]) === l));
      }
      const hasP = G && G.length >= 2;
      const head = ['變數', `全體<br><span class="mut">n = ${base.length}</span>`, ...(G ? G.map((l, j) => `${esc(l)}<br><span class="mut">n = ${gIdx[j].length}</span>`) : []), ...(hasP ? ['p 值'] : [])];
      const rows = [], foot = []; let skewUsed = false, fisherUsed = false;
      for (const v of vars) {
        const c = colOf(ds, v), idxV = base.filter(i => c.values[i] !== null), miss = base.length - idxV.length;
        if (miss) foot.push(`${esc(v)} 缺失 ${miss} 筆`);
        if (c.type === 'num' && c.nuniq > 2) {
          const all = idxV.map(i => c.values[i]), sk = Math.abs(S.skew(all)) > 1; if (sk) skewUsed = true;
          const fm = a => (a.length ? (sk ? `${F.n(S.median(a))} [${F.n(S.quantile(a, 0.25))}, ${F.n(S.quantile(a, 0.75))}]` : `${F.n(S.mean(a))} ± ${F.n(a.length > 1 ? S.sd(a) : NaN)}`) : '—');
          const gv = G ? gIdx.map(ix => ix.filter(i => c.values[i] !== null).map(i => c.values[i])) : null;
          let p = NaN;
          if (hasP && gv.every(a => a.length >= 2)) p = sk ? (G.length === 2 ? S.mannWhitney(gv[0], gv[1]).p : S.kruskal(gv).p) : (G.length === 2 ? S.welch(gv[0], gv[1]).p : S.anova(gv).p);
          rows.push([`<b>${esc(v)}</b> <span class="mut">${sk ? '中位數 [IQR]' : '平均 ± SD'}</span>`, fm(all), ...(G ? gv.map(fm) : []), ...(hasP ? [F.p(p) + (sk ? '<sup>b</sup>' : '<sup>a</sup>')] : [])]);
        } else {
          const L = levelsOf(ds, c, idxV); if (L.length > 12) { foot.push(`${esc(v)} 有 ${L.length} 個類別，未列出`); continue; }
          let p = NaN, sup = '<sup>c</sup>';
          if (hasP) {
            const tab = gIdx.map(ix => L.map(l => ix.filter(i => lab(c.values[i]) === l).length)); const t = S.chisq(tab); p = t.p;
            if (L.length === 2 && G.length === 2 && t.minExp < 5) { p = S.fisher(tab[0][0], tab[0][1], tab[1][0], tab[1][1]); fisherUsed = true; sup = '<sup>d</sup>'; }
          }
          rows.push({ cls: 'grp', cells: [`<b>${esc(v)}</b> <span class="mut">n (%)</span>`, '', ...(G ? G.map(() => '') : []), ...(hasP ? [F.p(p) + sup] : [])] });
          const pct = ix => { const den = ix.filter(i => c.values[i] !== null).length, k = ix.filter(i => lab(c.values[i]) === l).length; return den ? `${k} (${(100 * k / den).toFixed(1)})` : '—'; };
          let l; for (l of L) rows.push([`<span class="ind">${esc(l)}</span>`, pct(base), ...(G ? gIdx.map(pct) : []), ...(hasP ? [''] : [])]);
        }
      }
      const sups = hasP ? ['a Welch t 檢定（兩組）或單因子 ANOVA（多組）', 'b Mann–Whitney U（兩組）或 Kruskal–Wallis（多組）', 'c 卡方檢定', fisherUsed ? 'd Fisher 精確檢定' : null].filter(Boolean) : [];
      const notes = []; if (hasP) notes.push({ k: 'info', t: '如果這是<b>隨機分派試驗</b>，CONSORT 建議 Table 1 不放 p 值：分組是隨機的，組間差異依定義來自機遇。觀察性研究則可呈現，但重點是差異大小。' });
      if (skewUsed) notes.push({ k: 'info', t: '偏態係數絕對值大於 1 的連續變數自動改以中位數 [四分位距] 呈現。' });
      const gs = G ? G.map((l, j) => `${l} ${gIdx[j].length} 位`) : [];
      return {
        title: G ? `Table 1：依「${esc(s.g)}」分組的基本特徵` : 'Table 1：研究對象基本特徵', meta: meta(base.length, dropped),
        blocks: [{ table: { head, rows }, foot: [...sups, ...foot].join('；') }], notes,
        write: {
          zh: { m: `連續變數以平均值 ± 標準差表示${skewUsed ? '，明顯偏態者以中位數 [四分位距] 表示' : ''}；類別變數以人數（百分比）表示。${hasP ? `組間比較方面，連續變數使用 Welch t 檢定${G.length > 2 ? '或單因子變異數分析' : ''}${skewUsed ? '（偏態者使用 Mann–Whitney U 或 Kruskal–Wallis 檢定）' : ''}，類別變數使用卡方檢定${fisherUsed ? '（期望值小於 5 時使用 Fisher 精確檢定）' : ''}。` : ''}`, r: `共納入 ${base.length} 位研究對象${G ? '，其中 ' + joinZh(gs) : ''}。研究對象的基本特徵如表 1 所示。` },
          en: { m: `Continuous variables are presented as mean ± standard deviation${skewUsed ? ' or, when markedly skewed, as median [interquartile range]' : ''}; categorical variables are presented as number (percentage).${hasP ? ` Between-group differences were assessed with Welch's t test${G.length > 2 ? ' or one-way analysis of variance' : ''}${skewUsed ? ' (Mann–Whitney U or Kruskal–Wallis test for skewed variables)' : ''} for continuous variables and the chi-square test${fisherUsed ? " (Fisher's exact test when expected counts were below 5)" : ''} for categorical variables.` : ''}`, r: `A total of ${base.length} participants were included${G ? ' (' + joinEn(G.map((l, j) => `${l}, n = ${gIdx[j].length}`)) + ')' : ''}. Baseline characteristics are shown in Table 1.` },
        },
      };
    },
  },
  ttest: {
    name: '兩組比較', when: 'Welch t 檢定與 Mann–Whitney U：比較兩組的數值結果',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'g', label: '分組變數（兩組）', t: 'cat' }],
    run(ds, s) {
      const yc = colOf(ds, s.y), gc = colOf(ds, s.g), { idx, dropped } = complete(ds, [s.y, s.g]), G = levelsOf(ds, gc, idx);
      if (G.length !== 2) throw new Error(`分組變數需要剛好兩組，「${s.g}」目前有 ${G.length} 組。三組以上請改用「多組比較」。`);
      const [a, b] = G.map(l => idx.filter(i => lab(gc.values[i]) === l).map(i => yc.values[i]));
      if (a.length < 2 || b.length < 2) throw new Error('每組至少需要 2 筆資料。');
      const w = S.welch(a, b), mw = S.mannWhitney(a, b), notes = [];
      if ((a.length < 30 && Math.abs(S.skew(a)) > 1) || (b.length < 30 && Math.abs(S.skew(b)) > 1)) notes.push({ k: 'warn', t: '樣本小且分佈明顯偏態，t 檢定的假設可能不成立：建議以 Mann–Whitney U 的結果為主，或先將資料取對數。' });
      if (Math.max(w.s1, w.s2) / Math.min(w.s1, w.s2) > 2) notes.push({ k: 'info', t: '兩組標準差相差超過 2 倍；Welch t 檢定不假設變異數相等，這裡適用。' });
      notes.push({ k: 'info', t: '若同一個體被測量兩次（例如治療前後），請改用「配對比較」。' });
      const desc = g => [`${F.n(S.mean(g))} ± ${F.n(S.sd(g))}`, `${F.n(S.median(g))} [${F.n(S.quantile(g, 0.25))}, ${F.n(S.quantile(g, 0.75))}]`];
      const [da, db] = [desc(a), desc(b)];
      return {
        title: `${esc(s.y)}：${esc(G[1])} vs ${esc(G[0])}`, meta: meta(idx.length, dropped),
        blocks: [
          { table: { head: ['', `${esc(G[0])}（n = ${a.length}）`, `${esc(G[1])}（n = ${b.length}）`], rows: [['平均 ± SD', da[0], db[0]], ['中位數 [IQR]', da[1], db[1]]] } },
          { table: { head: ['檢定', '估計值', '95% CI', '統計量', 'p 值'], rows: [[`Welch t 檢定<br><span class="mut">平均差（${esc(G[1])} − ${esc(G[0])}）</span>`, F.n(w.diff), F.ci(...w.ci), `t(${F.n(w.df, 1)}) = ${F.n(w.t, 2)}`, F.p(w.p)], ['Mann–Whitney U', '—', '—', `U = ${F.n(mw.U, 1)}，z = ${F.n(mw.z, 2)}`, F.p(mw.p)], ["效果量 Cohen's d", F.n(w.d, 2), '—', '—', '—']] } },
          { chart: boxStrip([{ label: G[0], v: a }, { label: G[1], v: b }], s.y), cap: boxCap },
        ], notes,
        write: {
          zh: { m: `兩組間 ${s.y} 的比較採用 Welch t 檢定（不假設兩組變異數相等），並以 Mann–Whitney U 檢定作為敏感度分析；效果量以 Cohen's d 表示。所有檢定皆為雙尾，顯著水準為 0.05。`, r: `${G[1]} 組（n = ${b.length}）的 ${s.y} 平均為 ${F.n(w.m2)} ± ${F.n(w.s2)}，${G[0]} 組（n = ${a.length}）為 ${F.n(w.m1)} ± ${F.n(w.s1)}；平均差為 ${F.n(w.diff)}（95% CI ${F.ci(...w.ci)}；Welch t(${F.n(w.df, 1)}) = ${F.n(w.t, 2)}，${F.peq(w.p)}；Cohen's d = ${F.n(w.d, 2)}）。` },
          en: { m: `${s.y} was compared between groups using Welch's t test, which does not assume equal variances, with the Mann–Whitney U test as a sensitivity analysis. Effect size is reported as Cohen's d. All tests were two-sided with a significance level of 0.05.`, r: `Mean ${s.y} was ${F.n(w.m2)} ± ${F.n(w.s2)} in the ${G[1]} group (n = ${b.length}) and ${F.n(w.m1)} ± ${F.n(w.s1)} in the ${G[0]} group (n = ${a.length}); the mean difference was ${F.n(w.diff)} (95% CI ${F.cien(...w.ci)}; Welch's t(${F.n(w.df, 1)}) = ${F.n(w.t, 2)}, ${F.peq(w.p)}; Cohen's d = ${F.n(w.d, 2)}).` },
        },
      };
    },
  },
  paired: {
    name: '配對比較', when: '配對 t 檢定與 Wilcoxon 符號等級：同一個體前後兩次測量',
    fields: [{ k: 'a', label: '第一次測量（前）', t: 'num' }, { k: 'b', label: '第二次測量（後）', t: 'num' }],
    run(ds, s) {
      if (s.a === s.b) throw new Error('請選擇兩個不同的欄位。');
      const ac = colOf(ds, s.a), bc = colOf(ds, s.b), { idx, dropped } = complete(ds, [s.a, s.b]);
      if (idx.length < 3) throw new Error('至少需要 3 筆完整配對資料。');
      const x = idx.map(i => ac.values[i]), y = idx.map(i => bc.values[i]), pt = S.pairedT(x, y), wl = S.wilcoxonSR(pt.d);
      const [mn, mx] = S.minmax([...x, ...y]), show = idx.length > 200 ? 200 : idx.length;
      const ch = chart({ xcats: [s.a, s.b], y: [mn, mx], ylab: '測量值', h: 330 }, (X, Y) => {
        let g = ''; for (let i = 0; i < show; i++) g += `<line x1="${X(0)}" x2="${X(1)}" y1="${Y(x[i]).toFixed(1)}" y2="${Y(y[i]).toFixed(1)}" style="stroke:${y[i] < x[i] ? 'var(--c1)' : 'var(--c2)'};stroke-opacity:.35"/>`;
        return g + `<line x1="${X(0)}" x2="${X(1)}" y1="${Y(S.mean(x))}" y2="${Y(S.mean(y))}" style="stroke:var(--ink);stroke-width:3"/>` + [0, 1].map(k => `<circle cx="${X(k)}" cy="${Y(S.mean(k ? y : x))}" r="5" style="fill:var(--ink)"/>`).join('');
      });
      return {
        title: `${esc(s.a)} → ${esc(s.b)}`, meta: meta(idx.length, dropped),
        blocks: [
          { table: { head: ['', '平均 ± SD', '中位數 [IQR]'], rows: [[esc(s.a), `${F.n(S.mean(x))} ± ${F.n(S.sd(x))}`, `${F.n(S.median(x))} [${F.n(S.quantile(x, 0.25))}, ${F.n(S.quantile(x, 0.75))}]`], [esc(s.b), `${F.n(S.mean(y))} ± ${F.n(S.sd(y))}`, `${F.n(S.median(y))} [${F.n(S.quantile(y, 0.25))}, ${F.n(S.quantile(y, 0.75))}]`], [`差值（後 − 前）`, `${F.n(pt.md)} ± ${F.n(pt.sdd)}`, `${F.n(S.median(pt.d))} [${F.n(S.quantile(pt.d, 0.25))}, ${F.n(S.quantile(pt.d, 0.75))}]`]] } },
          { table: { head: ['檢定', '平均變化', '95% CI', '統計量', 'p 值'], rows: [['配對 t 檢定', F.n(pt.md), F.ci(...pt.ci), `t(${pt.df}) = ${F.n(pt.t, 2)}`, F.p(pt.p)], ['Wilcoxon 符號等級', '—', '—', `V = ${F.n(wl.V, 1)}，z = ${F.n(wl.z, 2)}`, F.p(wl.p)]] } },
          { chart: ch, legend: legend([['var(--c1)', '下降'], ['var(--c2)', '上升或不變'], ['var(--ink)', '平均']]), cap: `每條細線為一個個體${show < idx.length ? `（僅畫出前 ${show} 位）` : ''}。` },
        ],
        notes: [{ k: 'info', t: '配對設計以每個人自己當對照，消除了個體間差異，因此比獨立樣本比較更有檢定力。注意：單組前後比較無法排除時間、安慰劑效應或向平均數迴歸；有對照組時，應比較兩組的變化量。' }],
        write: {
          zh: { m: `同一受試者 ${s.a} 與 ${s.b} 的差異以配對 t 檢定分析，並以 Wilcoxon 符號等級檢定作為敏感度分析。`, r: `${idx.length} 位受試者的 ${s.b} 平均為 ${F.n(S.mean(y))} ± ${F.n(S.sd(y))}，${s.a} 平均為 ${F.n(S.mean(x))} ± ${F.n(S.sd(x))}；平均變化為 ${F.n(pt.md)}（95% CI ${F.ci(...pt.ci)}；配對 t(${pt.df}) = ${F.n(pt.t, 2)}，${F.peq(pt.p)}）。` },
          en: { m: `Within-participant differences between ${s.a} and ${s.b} were analysed with the paired t test, with the Wilcoxon signed-rank test as a sensitivity analysis.`, r: `Among ${idx.length} participants, mean ${s.b} was ${F.n(S.mean(y))} ± ${F.n(S.sd(y))} compared with ${F.n(S.mean(x))} ± ${F.n(S.sd(x))} for ${s.a}; the mean change was ${F.n(pt.md)} (95% CI ${F.cien(...pt.ci)}; paired t(${pt.df}) = ${F.n(pt.t, 2)}, ${F.peq(pt.p)}).` },
        },
      };
    },
  },
  anova: {
    name: '多組比較', when: '單因子 ANOVA、Kruskal–Wallis 與事後比較：三組以上',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'g', label: '分組變數', t: 'cat' }],
    run(ds, s) {
      const yc = colOf(ds, s.y), gc = colOf(ds, s.g), { idx, dropped } = complete(ds, [s.y, s.g]), G = levelsOf(ds, gc, idx);
      if (G.length < 2) throw new Error('分組變數至少需要兩組。'); if (G.length > 12) throw new Error('組數超過 12 組，請選擇類別較少的變數。');
      const gv = G.map(l => idx.filter(i => lab(gc.values[i]) === l).map(i => yc.values[i]));
      if (gv.some(a => a.length < 2)) throw new Error('每組至少需要 2 筆資料。');
      const A = S.anova(gv), K = S.kruskal(gv), blocks = [];
      blocks.push({ table: { head: ['組別', 'n', '平均 ± SD', '中位數 [IQR]'], rows: G.map((l, j) => [esc(l), gv[j].length, `${F.n(S.mean(gv[j]))} ± ${F.n(S.sd(gv[j]))}`, `${F.n(S.median(gv[j]))} [${F.n(S.quantile(gv[j], 0.25))}, ${F.n(S.quantile(gv[j], 0.75))}]`]) } });
      blocks.push({ table: { head: ['變異來源', 'SS', 'df', 'MS', 'F', 'p 值'], rows: [['組間', F.n(A.ssb), A.df1, F.n(A.msb), F.n(A.F, 2), F.p(A.p)], ['組內（殘差）', F.n(A.ssw), A.df2, F.n(A.msw), '', ''], ['Kruskal–Wallis', '', K.df, '', `H = ${F.n(K.H, 2)}`, F.p(K.p)]] }, foot: `η² = ${F.n(A.eta2, 3)}：分組解釋了 ${F.n(A.eta2 * 100, 1)}% 的變異。` });
      if (G.length > 2) {
        const pr = []; for (let i = 0; i < G.length; i++) for (let j = i + 1; j < G.length; j++) pr.push({ i, j, w: S.welch(gv[i], gv[j]) });
        const adj = S.holm(pr.map(x => x.w.p));
        blocks.push({ table: { head: ['比較', '平均差', '95% CI（未校正）', 'p 值', 'Holm 校正 p'], rows: pr.map((x, k) => [`${esc(G[x.j])} − ${esc(G[x.i])}`, F.n(x.w.diff), F.ci(...x.w.ci), F.p(x.w.p), `<b>${F.p(adj[k])}</b>`]) }, foot: '事後比較：兩兩 Welch t 檢定，以 Holm 法校正多重比較。' });
      }
      blocks.push({ chart: boxStrip(G.map((l, j) => ({ label: l, v: gv[j] })), s.y), cap: boxCap });
      const sig = A.p < 0.05;
      return {
        title: `${esc(s.y)}：依「${esc(s.g)}」${G.length} 組比較`, meta: meta(idx.length, dropped), blocks,
        notes: [{ k: 'info', t: 'ANOVA 只回答「是否至少有一組不同」；哪幾組不同請看事後比較表。若設計中有區集或同一個體重複測量，請改用含區集的線性迴歸或混合模型。' }],
        write: {
          zh: { m: `${G.length} 組間 ${s.y} 的比較採用單因子變異數分析（ANOVA）${G.length > 2 ? '，事後兩兩比較使用 Welch t 檢定並以 Holm 法校正多重比較' : ''}；並以 Kruskal–Wallis 檢定作為無母數敏感度分析。`, r: `${G.length} 組間 ${s.y} 的平均值${sig ? '有' : '未觀察到'}統計上顯著的差異（F(${A.df1}, ${A.df2}) = ${F.n(A.F, 2)}，${F.peq(A.p)}，η² = ${F.n(A.eta2, 3)}）。各組平均：${G.map((l, j) => `${l} ${F.n(S.mean(gv[j]))} ± ${F.n(S.sd(gv[j]))}`).join('；')}。` },
          en: { m: `${s.y} was compared across ${G.length} groups using one-way analysis of variance${G.length > 2 ? ", followed by pairwise Welch's t tests with Holm adjustment for multiple comparisons" : ''}; the Kruskal–Wallis test was used as a non-parametric sensitivity analysis.`, r: `Mean ${s.y} ${sig ? 'differed significantly' : 'did not differ significantly'} across groups (F(${A.df1}, ${A.df2}) = ${F.n(A.F, 2)}, ${F.peq(A.p)}, η² = ${F.n(A.eta2, 3)}). Group means were ${G.map((l, j) => `${F.n(S.mean(gv[j]))} ± ${F.n(S.sd(gv[j]))} (${l})`).join(', ')}.` },
        },
      };
    },
  },
  chisq: {
    name: '類別關聯', when: '卡方、Fisher 精確檢定與勝算比：兩個類別變數',
    fields: [{ k: 'r', label: '列變數（例如暴露、組別）', t: 'cat' }, { k: 'c', label: '欄變數（例如結果）', t: 'cat' }],
    run(ds, s) {
      if (s.r === s.c) throw new Error('請選擇兩個不同的變數。');
      const rc = colOf(ds, s.r), cc = colOf(ds, s.c), { idx, dropped } = complete(ds, [s.r, s.c]), R = levelsOf(ds, rc, idx), C = levelsOf(ds, cc, idx);
      if (R.length < 2 || C.length < 2) throw new Error('兩個變數都至少需要兩個類別。'); if (R.length > 10 || C.length > 10) throw new Error('類別超過 10 個，請選擇類別較少的變數。');
      const tab = R.map(r => C.map(c => idx.filter(i => lab(rc.values[i]) === r && lab(cc.values[i]) === c).length)), t = S.chisq(tab), notes = [];
      const rows = R.map((r, i) => { const tot = S.sum(tab[i]); return [`<b>${esc(r)}</b>`, ...tab[i].map(k => `${k} <span class="mut">(${tot ? (100 * k / tot).toFixed(1) : '—'}%)</span>`), tot]; });
      rows.push(['合計', ...C.map((_, j) => S.sum(tab.map(r => r[j]))), idx.length]);
      const stats = [['卡方檢定', `χ²(${t.df}) = ${F.n(t.chi2, 2)}`, F.p(t.p)]];
      let fp = NaN, or = null, rr = null;
      if (R.length === 2 && C.length === 2) {
        const [[a, b], [c, d]] = tab; fp = S.fisher(a, b, c, d); stats.push(['Fisher 精確檢定', '—', F.p(fp)]);
        const h = a * b * c * d === 0 ? 0.5 : 0, [A, B, Cc, D] = [a + h, b + h, c + h, d + h], lor = Math.log(A * D / (B * Cc)), se = Math.sqrt(1 / A + 1 / B + 1 / Cc + 1 / D);
        or = { est: Math.exp(lor), lo: Math.exp(lor - 1.96 * se), hi: Math.exp(lor + 1.96 * se) };
        const r1 = D / (Cc + D), r0 = B / (A + B), lrr = Math.log(r1 / r0), ser = Math.sqrt(1 / D - 1 / (Cc + D) + 1 / B - 1 / (A + B));
        rr = { est: r1 / r0, lo: Math.exp(lrr - 1.96 * ser), hi: Math.exp(lrr + 1.96 * ser), r1: d / (c + d), r0: b / (a + b) };
        stats.push([`勝算比 OR<br><span class="mut">${esc(C[1])} 的勝算：${esc(R[1])} vs ${esc(R[0])}</span>`, `${F.n(or.est, 2)}（95% CI ${F.ci(or.lo, or.hi, 2)}）`, '—']);
        stats.push([`風險比 RR<br><span class="mut">僅適用世代研究與試驗</span>`, `${F.n(rr.est, 2)}（95% CI ${F.ci(rr.lo, rr.hi, 2)}）`, '—']);
        if (h) notes.push({ k: 'info', t: '表中有 0 的格子，OR 與 RR 已在每格加 0.5（Haldane 校正）後計算。' });
      }
      stats.push(["Cramér's V", F.n(t.V, 3), '—']);
      if (t.minExp < 5) notes.push({ k: 'warn', t: `最小期望值為 ${F.n(t.minExp, 2)}（小於 5），卡方近似不可靠。${R.length === 2 && C.length === 2 ? '請以 Fisher 精確檢定的 p 值為準。' : '考慮合併類別或使用精確檢定。'}` });
      const ch = chart({ xcats: R, y: [0, 100], ylab: `${s.c} 的比例（%）`, h: 300 }, (X, Y, { iw }) => {
        const bw = Math.min(90, iw / R.length * 0.55); let g = '';
        R.forEach((r, i) => { const tot = S.sum(tab[i]); let acc = 0; C.forEach((c, j) => { const p = tot ? 100 * tab[i][j] / tot : 0; g += `<rect x="${X(i) - bw / 2}" y="${Y(acc + p)}" width="${bw}" height="${Y(acc) - Y(acc + p)}" style="fill:${col4(j)}"/>`; if (p >= 8) g += `<text class="in" x="${X(i)}" y="${(Y(acc) + Y(acc + p)) / 2}" dy=".32em" text-anchor="middle">${p.toFixed(0)}%</text>`; acc += p; }); });
        return g;
      });
      const rl = l => (/^-?\d+(\.\d+)?$/.test(l) ? `${s.r} = ${l}` : l);
      const useP = R.length === 2 && C.length === 2 && t.minExp < 5 ? fp : t.p, sig = useP < 0.05, testZh = R.length === 2 && C.length === 2 && t.minExp < 5 ? 'Fisher 精確檢定' : `χ²(${t.df}) = ${F.n(t.chi2, 2)}`;
      const zhR = or ? `${rl(R[1])} 組中 ${s.c} 為「${C[1]}」的比例為 ${tab[1][1]}/${S.sum(tab[1])}（${F.n(100 * rr.r1, 1)}%），${rl(R[0])} 組為 ${tab[0][1]}/${S.sum(tab[0])}（${F.n(100 * rr.r0, 1)}%）（${testZh}，${F.peq(useP)}）；勝算比為 ${F.n(or.est, 2)}（95% CI ${F.ci(or.lo, or.hi, 2)}）。` : `${s.r} 與 ${s.c} 之間${sig ? '有' : '未觀察到'}統計上顯著的關聯（${testZh}，${F.peq(useP)}，Cramér's V = ${F.n(t.V, 3)}）。`;
      const enR = or ? `The proportion with ${s.c} = ${C[1]} was ${tab[1][1]}/${S.sum(tab[1])} (${F.n(100 * rr.r1, 1)}%) in the ${rl(R[1])} group and ${tab[0][1]}/${S.sum(tab[0])} (${F.n(100 * rr.r0, 1)}%) in the ${rl(R[0])} group (${t.minExp < 5 ? "Fisher's exact test" : `χ²(${t.df}) = ${F.n(t.chi2, 2)}`}, ${F.peq(useP)}); the odds ratio was ${F.n(or.est, 2)} (95% CI ${F.cien(or.lo, or.hi, 2)}).` : `There was ${sig ? 'a statistically significant' : 'no statistically significant'} association between ${s.r} and ${s.c} (χ²(${t.df}) = ${F.n(t.chi2, 2)}, ${F.peq(useP)}, Cramér's V = ${F.n(t.V, 3)}).`;
      return {
        title: `${esc(s.r)} × ${esc(s.c)}`, meta: meta(idx.length, dropped),
        blocks: [{ table: { head: [`${esc(s.r)} ＼ ${esc(s.c)}`, ...C.map(esc), '合計'], rows }, foot: '括號內為列百分比。' }, { table: { head: ['', '結果', 'p 值'], rows: stats } }, { chart: ch, legend: legend(C.map((c, j) => [col4(j), esc(c)])) }], notes,
        write: {
          zh: { m: `類別變數間的關聯以卡方檢定分析${R.length === 2 && C.length === 2 ? '，期望值小於 5 時改用 Fisher 精確檢定；並計算勝算比及其 95% 信賴區間' : ''}。`, r: zhR },
          en: { m: `Associations between categorical variables were assessed with the chi-square test${R.length === 2 && C.length === 2 ? ", or Fisher's exact test when expected counts were below 5; odds ratios with 95% confidence intervals were calculated" : ''}.`, r: enR },
        },
      };
    },
  },
  corr: {
    name: '相關', when: 'Pearson 與 Spearman：兩個數值變數一起變動的程度',
    fields: [{ k: 'x', label: 'X 變數（數值）', t: 'num' }, { k: 'y', label: 'Y 變數（數值）', t: 'num' }],
    run(ds, s) {
      if (s.x === s.y) throw new Error('請選擇兩個不同的變數。');
      const xc = colOf(ds, s.x), yc = colOf(ds, s.y), { idx, dropped } = complete(ds, [s.x, s.y]); if (idx.length < 4) throw new Error('至少需要 4 筆完整資料。');
      const x = idx.map(i => xc.values[i]), y = idx.map(i => yc.values[i]), P = S.pearson(x, y), R = S.spearman(x, y), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(y);
      const ch = chart({ x: [x0, x1], y: [y0, y1], xlab: s.x, ylab: s.y, h: 340, xgrid: true }, (X, Y) => {
        let g = ''; const k = x.length > 1500 ? Math.ceil(x.length / 1500) : 1; for (let i = 0; i < x.length; i += k) g += `<circle cx="${X(x[i]).toFixed(1)}" cy="${Y(y[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.45"/>`;
        return g + `<line x1="${X(x0)}" x2="${X(x1)}" y1="${Y(P.intercept + P.slope * x0)}" y2="${Y(P.intercept + P.slope * x1)}" style="stroke:var(--c2);stroke-width:2.5"/>`;
      });
      const dir = P.r >= 0 ? '正' : '負', str = Math.abs(P.r) < 0.1 ? '幾乎沒有' : Math.abs(P.r) < 0.3 ? '弱' : Math.abs(P.r) < 0.5 ? '中等' : '強';
      return {
        title: `${esc(s.x)} 與 ${esc(s.y)}`, meta: meta(idx.length, dropped),
        blocks: [{ table: { head: ['方法', '係數', '95% CI', 'p 值'], rows: [['Pearson r', F.n(P.r, 3), F.ci(...P.ci, 3), F.p(P.p)], ['Spearman ρ', F.n(R.rho, 3), '—', F.p(R.p)], ['r²（線性解釋比例）', F.n(P.r * P.r, 3), '—', '—']] } }, { chart: ch, cap: `紅線為最小平方直線：${esc(s.y)} = ${F.n(P.intercept)} + ${F.n(P.slope)} × ${esc(s.x)}` }],
        notes: [{ k: 'info', t: `目前為${str}${Math.abs(P.r) < 0.1 ? '' : dir + '向'}線性相關。相關不等於因果；若要評估兩種測量方法的一致性，請用 Bland–Altman 分析或組內相關係數（ICC），不要用 r。` }],
        write: {
          zh: { m: `兩個連續變數之間的關聯以 Pearson 相關係數評估（信賴區間以 Fisher z 轉換計算），並以 Spearman 等級相關作為敏感度分析。`, r: `${s.x} 與 ${s.y} 呈${str}的${dir}相關（Pearson r = ${F.n(P.r, 2)}，95% CI ${F.ci(...P.ci, 2)}，${F.peq(P.p)}；Spearman ρ = ${F.n(R.rho, 2)}，n = ${idx.length}）。` },
          en: { m: `Associations between continuous variables were assessed with Pearson's correlation coefficient (confidence intervals via Fisher's z transformation), with Spearman's rank correlation as a sensitivity analysis.`, r: `${s.x} was ${P.r >= 0 ? 'positively' : 'negatively'} correlated with ${s.y} (Pearson r = ${F.n(P.r, 2)}, 95% CI ${F.cien(...P.ci, 2)}, ${F.peq(P.p)}; Spearman ρ = ${F.n(R.rho, 2)}; n = ${idx.length}).` },
        },
      };
    },
  },
  linreg: {
    name: '線性迴歸', when: '數值結果與多個預測變數，可校正干擾因子',
    fields: [{ k: 'y', label: '結果變數（數值）', t: 'num' }, { k: 'xs', label: '預測變數（第一個勾選者視為主要變數）', t: 'any', multi: true }],
    run(ds, s) {
      const xs = (s.xs || []).filter(v => v !== s.y); if (!xs.length) throw new Error('請至少勾選一個預測變數。');
      const { idx, dropped } = complete(ds, [s.y, ...xs]), yc = colOf(ds, s.y), D = design(ds, idx, xs);
      const X = D.X.map(r => [1, ...r]), y = idx.map(i => yc.values[i]);
      if (idx.length <= X[0].length + 1) throw new Error(`樣本數（${idx.length}）不足以估計 ${X[0].length} 個參數。`);
      let m; try { m = S.ols(X, y); } catch (e) { catFail(e); }
      const names = ['截距', ...D.names], notes = [];
      const rows = names.map((nm, j) => [j ? `<b>${esc(nm)}</b>` : `<span class="mut">${nm}</span>`, F.n(m.b[j]), F.ci(...m.ci[j]), F.n(m.t[j], 2), F.p(m.p[j])]);
      if (D.refs.length) notes.push({ k: 'info', t: '類別變數以虛擬變數編碼：' + D.refs.map(esc).join('；') + '。係數代表與參考組的平均差。' });
      if (idx.length / (X[0].length - 1) < 10) notes.push({ k: 'warn', t: `每個預測參數平均不到 10 筆觀察（n = ${idx.length}，參數 ${X[0].length - 1} 個），模型可能過度配適。` });
      if (Math.abs(S.skew(m.resid)) > 1) notes.push({ k: 'warn', t: '殘差明顯偏態。小樣本時信賴區間可能不準確，可考慮將結果變數取對數。' });
      const one = xs.length === 1 && colOf(ds, xs[0]).type === 'num'; let ch, cap;
      if (one) {
        const x = D.X.map(r => r[0]), [x0, x1] = S.minmax(x), [y0, y1] = S.minmax(y);
        ch = chart({ x: [x0, x1], y: [y0, y1], xlab: xs[0], ylab: s.y, h: 330 }, (Xs, Ys) => x.map((v, i) => `<circle cx="${Xs(v).toFixed(1)}" cy="${Ys(y[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.45"/>`).join('') + `<line x1="${Xs(x0)}" x2="${Xs(x1)}" y1="${Ys(m.b[0] + m.b[1] * x0)}" y2="${Ys(m.b[0] + m.b[1] * x1)}" style="stroke:var(--c2);stroke-width:2.5"/>`);
        cap = '散佈圖與迴歸直線。';
      } else {
        const [f0, f1] = S.minmax(m.fitted), [r0, r1] = S.minmax(m.resid);
        ch = chart({ x: [f0, f1], y: [Math.min(r0, -r1), Math.max(r1, -r0)], xlab: '預測值', ylab: '殘差', h: 300 }, (Xs, Ys, { M, iw }) => `<line x1="${M.l}" x2="${M.l + iw}" y1="${Ys(0)}" y2="${Ys(0)}" style="stroke:var(--c2);stroke-dasharray:5 4"/>` + m.fitted.map((v, i) => `<circle cx="${Xs(v).toFixed(1)}" cy="${Ys(m.resid[i]).toFixed(1)}" r="3" style="fill:var(--c1);fill-opacity:.45"/>`).join(''));
        cap = '殘差對預測值圖：點應隨機散布在 0 線上下、寬度大致一致；若呈曲線或喇叭形，代表線性或變異齊一假設可能不成立。';
      }
      const others = xs.slice(1), main = D.names[0], j = 1;
      return {
        title: `線性迴歸：${esc(s.y)}`, meta: meta(idx.length, dropped),
        blocks: [{ table: { head: ['變數', 'β', '95% CI', 't', 'p 值'], rows }, foot: `R² = ${F.n(m.r2, 3)}；調整後 R² = ${F.n(m.adj, 3)}；F(${m.df1}, ${m.df2}) = ${F.n(m.F, 2)}，${F.peq(m.pF)}；殘差標準誤 = ${F.n(m.sigma)}` }, { chart: ch, cap }], notes,
        write: {
          zh: { m: `以多元線性迴歸分析 ${s.y} 與 ${joinZh(xs)} 的關係${D.refs.length ? '（類別變數以虛擬變數編碼）' : ''}，結果以迴歸係數 β 及其 95% 信賴區間表示，並以殘差圖檢查模型假設。`, r: `${others.length ? `校正 ${joinZh(others)} 後，` : ''}${main} 與 ${s.y} 的迴歸係數為 β = ${F.n(m.b[j])}（95% CI ${F.ci(...m.ci[j])}，${F.peq(m.p[j])}）${colOf(ds, xs[0]).type === 'num' ? `，即 ${xs[0]} 每增加 1 單位，${s.y} 平均${m.b[j] >= 0 ? '增加' : '減少'} ${F.n(Math.abs(m.b[j]))}` : ''}。模型 R² = ${F.n(m.r2, 3)}（n = ${idx.length}）。` },
          en: { m: `Multiple linear regression was used to examine the association between ${s.y} and ${joinEn(xs)}${D.refs.length ? ' (categorical variables dummy-coded)' : ''}. Results are reported as regression coefficients (β) with 95% confidence intervals; model assumptions were checked with residual plots.`, r: `${others.length ? `After adjustment for ${joinEn(others)}, ` : ''}${main} was associated with ${s.y} (β = ${F.n(m.b[j])}, 95% CI ${F.cien(...m.ci[j])}, ${F.peq(m.p[j])}). The model explained ${F.n(m.r2 * 100, 1)}% of the variance (R² = ${F.n(m.r2, 3)}, n = ${idx.length}).` },
        },
      };
    },
  },
  logreg: {
    name: '邏輯斯迴歸', when: '二元結果（有／無），得到校正後勝算比',
    fields: [{ k: 'y', label: '結果變數（二元）', t: 'bin' }, { k: 'xs', label: '預測變數（第一個勾選者視為主要變數）', t: 'any', multi: true }],
    run(ds, s) {
      const xs = (s.xs || []).filter(v => v !== s.y); if (!xs.length) throw new Error('請至少勾選一個預測變數。');
      const { idx, dropped } = complete(ds, [s.y, ...xs]), yc = colOf(ds, s.y), B = binCode(ds, yc, idx), D = design(ds, idx, xs), X = D.X.map(r => [1, ...r]);
      const ev = S.sum(B.y), nev = idx.length - ev; if (ev < 2 || nev < 2) throw new Error('事件數或非事件數太少，無法建立模型。');
      let m; try { m = S.logistic(X, B.y); } catch (e) { catFail(e); }
      const notes = [], k = D.names.length, epv = Math.min(ev, nev) / k;
      notes.push({ k: 'info', t: `結果變數編碼：${esc(s.y)} = 「${esc(B.ev)}」視為事件（1），「${esc(B.ref)}」為非事件（0）。${D.refs.length ? '類別預測變數：' + D.refs.map(esc).join('；') + '。' : ''}` });
      if (epv < 10) notes.push({ k: 'warn', t: `每個參數的事件數（EPV）約 ${F.n(epv, 1)}，低於 10，估計可能不穩定；請減少變數或增加樣本。` });
      if (!m.conv || m.b.slice(1).some(v => Math.abs(v) > 10)) notes.push({ k: 'warn', t: '模型可能出現「完全分離」（某變數幾乎完美預測結果），OR 與 CI 不可信。' });
      const rows = D.names.map((nm, i) => { const j = i + 1, b = m.b[j], se = m.se[j]; return { label: nm, est: Math.exp(b), lo: Math.exp(b - 1.96 * se), hi: Math.exp(b + 1.96 * se), p: m.p[j] }; });
      const A = S.auc(m.mu, B.y), lr = 2 * (m.ll - m.ll0), plr = S.pchisq(lr, k), r0 = rows[0], others = xs.slice(1);
      return {
        title: `邏輯斯迴歸：${esc(s.y)} = ${esc(B.ev)}`, meta: meta(idx.length, dropped) + `；事件 ${ev} 例（${F.n(100 * ev / idx.length, 1)}%）`,
        blocks: [{ table: { head: ['變數', 'OR', '95% CI', 'p 值'], rows: rows.map(r => [`<b>${esc(r.label)}</b>`, F.n(r.est, 2), F.ci(r.lo, r.hi, 2), F.p(r.p)]) }, foot: `AUC（C 統計量）= ${F.n(A, 3)}；概似比檢定 χ²(${k}) = ${F.n(lr, 2)}，${F.peq(plr)}；McFadden pseudo-R² = ${F.n(1 - m.ll / m.ll0, 3)}` }, { chart: forestChart(rows, '勝算比 OR（對數尺度）'), cap: '森林圖：方塊為 OR，橫線為 95% CI；虛線 OR = 1 代表無關聯。' }], notes,
        write: {
          zh: { m: `以多變項邏輯斯迴歸分析 ${s.y} 的相關因子，納入 ${joinZh(xs)}；結果以勝算比（OR）及其 95% 信賴區間表示，模型辨別力以 ROC 曲線下面積（AUC）評估。`, r: `${idx.length} 位研究對象中有 ${ev} 位（${F.n(100 * ev / idx.length, 1)}%）發生 ${s.y}。${others.length ? `校正 ${joinZh(others)} 後，` : ''}${r0.label} 的勝算比為 ${F.n(r0.est, 2)}（95% CI ${F.ci(r0.lo, r0.hi, 2)}，${F.peq(r0.p)}）。模型 AUC 為 ${F.n(A, 2)}。` },
          en: { m: `Multivariable logistic regression including ${joinEn(xs)} was used to identify factors associated with ${s.y}. Results are reported as odds ratios (ORs) with 95% confidence intervals; discrimination was assessed with the area under the ROC curve (AUC).`, r: `Of ${idx.length} participants, ${ev} (${F.n(100 * ev / idx.length, 1)}%) had ${s.y} = ${B.ev}. ${others.length ? `After adjustment for ${joinEn(others)}, ` : ''}the odds ratio for ${r0.label} was ${F.n(r0.est, 2)} (95% CI ${F.cien(r0.lo, r0.hi, 2)}, ${F.peq(r0.p)}). The model AUC was ${F.n(A, 2)}.` },
        },
      };
    },
  },
  surv: {
    name: '存活分析', when: 'Kaplan–Meier、log-rank 與 Cox 迴歸：時間至事件資料',
    fields: [{ k: 'time', label: '追蹤時間（數值）', t: 'num' }, { k: 'status', label: '事件狀態（1 = 事件，0 = 設限）', t: 'bin' }, { k: 'g', label: '比較組別（可留空）', t: 'cat', opt: true }, { k: 'xs', label: 'Cox 模型的變數（可留空，留空時使用比較組別）', t: 'any', multi: true, opt: true }],
    run(ds, s) {
      const xs = (s.xs || []).filter(v => v !== s.time && v !== s.status), names = [s.time, s.status, ...(s.g ? [s.g] : []), ...xs.filter(v => v !== s.g)];
      const { idx, dropped } = complete(ds, names), tc = colOf(ds, s.time), B = binCode(ds, colOf(ds, s.status), idx);
      const time = idx.map(i => tc.values[i]); if (time.some(t => t < 0)) throw new Error('追蹤時間不能是負數。'); const st = B.y;
      let G = ['全體'], gi = idx.map(() => 0);
      if (s.g) { const gc = colOf(ds, s.g); G = levelsOf(ds, gc, idx); if (G.length > 6) throw new Error('比較組別超過 6 組。'); gi = idx.map(i => G.indexOf(lab(gc.values[i]))); }
      const curves = G.map((l, k) => { const ii = gi.map((g, i) => (g === k ? i : -1)).filter(i => i >= 0); return { label: l, ...S.km(ii.map(i => time[i]), ii.map(i => st[i])), tt: ii.map(i => time[i]) }; });
      const maxT = Math.max(...time), sc = niceScale(0, maxT, 6), tk = sc.ticks.filter(t => t > 0 && t < maxT), t1 = tk[Math.floor((tk.length - 1) / 3)], t2 = tk[Math.floor(2 * (tk.length - 1) / 3)] ?? t1;
      const sAt = (c, T) => { const x = c.at(T); return `${F.n(100 * x.S, 1)}% <span class="mut">(${F.n(100 * x.lo, 1)}–${F.n(100 * x.hi, 1)})</span>`; };
      const blocks = [{ table: { head: ['組別', 'n', '事件', '中位存活時間', `存活率 @ ${t1}`, `存活率 @ ${t2}`], rows: curves.map(c => [`<b>${esc(c.label)}</b>`, c.n, c.events, Number.isFinite(c.median) ? F.n(c.median) : '未達到', sAt(c, t1), sAt(c, t2)]) }, foot: '存活率括號內為 95% CI（log(−log) 轉換）。「未達到」表示存活率在追蹤期間未降到 50%。' }];
      const ch = chart({ x: [0, maxT], y: [0, 1], ylab: '存活機率', xlab: s.time, h: 330 }, (X, Y) => curves.map((c, i) => {
        let d = `M${X(0)} ${Y(1)}`; c.steps.slice(1).forEach(p => { d += `H${X(p.t).toFixed(1)}V${Y(p.S).toFixed(1)}`; }); d += `H${X(c.end).toFixed(1)}`;
        return `<path d="${d}" style="fill:none;stroke:${col4(i)};stroke-width:2.2"/>` + c.cens.map(z => `<line x1="${X(z.t).toFixed(1)}" x2="${X(z.t).toFixed(1)}" y1="${Y(z.S) - 4}" y2="${Y(z.S) + 4}" style="stroke:${col4(i)}"/>`).join('');
      }).join(''));
      const risk = `<div class="tbl-wrap"><table class="st risk"><thead><tr><th>風險人數</th>${sc.ticks.filter(t => t <= maxT).map(t => `<th>${tickFmt(t, sc.step)}</th>`).join('')}</tr></thead><tbody>${curves.map((c, i) => `<tr><td><i class="sw" style="background:${col4(i)}"></i>${esc(c.label)}</td>${sc.ticks.filter(t => t <= maxT).map(t => `<td>${c.tt.filter(x => x >= t).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      blocks.push({ chart: ch, legend: legend(curves.map((c, i) => [col4(i), esc(c.label)])), cap: '短直線為設限時間點。', after: risk });
      let L = null; if (G.length >= 2) { L = S.logrank(time, st, gi, G.length); blocks.push({ table: { head: ['組別', '觀察事件 O', '期望事件 E', 'O / E'], rows: G.map((l, k) => [esc(l), F.n(L.O[k], 0), F.n(L.E[k], 1), F.n(L.O[k] / L.E[k], 2)]) }, foot: `Log-rank 檢定：χ²(${L.df}) = ${F.n(L.chi2, 2)}，${F.peq(L.p)}` }); }
      const cv = xs.length ? xs : s.g ? [s.g] : []; let hr = null; const notes = [{ k: 'info', t: `事件編碼：${esc(s.status)} = 「${esc(B.ev)}」視為事件。` }];
      if (cv.length) {
        const D = design(ds, idx, cv); let m; try { m = S.cox(time, st, D.X); } catch (e) { catFail(e); }
        hr = D.names.map((nm, j) => ({ label: nm, est: Math.exp(m.b[j]), lo: Math.exp(m.b[j] - 1.96 * m.se[j]), hi: Math.exp(m.b[j] + 1.96 * m.se[j]), p: m.p[j] }));
        const lr = 2 * (m.ll - m.ll0);
        blocks.push({ table: { head: ['變數', 'HR', '95% CI', 'p 值'], rows: hr.map(r => [`<b>${esc(r.label)}</b>`, F.n(r.est, 2), F.ci(r.lo, r.hi, 2), F.p(r.p)]) }, foot: `Cox 比例風險模型（Breslow 法處理同時事件）；概似比檢定 χ²(${D.names.length}) = ${F.n(lr, 2)}，${F.peq(S.pchisq(lr, D.names.length))}` });
        if (hr.length > 1) blocks.push({ chart: forestChart(hr, '危險比 HR（對數尺度）') });
        if (D.refs.length) notes.push({ k: 'info', t: D.refs.map(esc).join('；') + '。' });
        const epv = S.sum(st) / D.names.length; if (epv < 10) notes.push({ k: 'warn', t: `每個參數的事件數約 ${F.n(epv, 1)}，低於 10，Cox 模型估計可能不穩定。` });
        notes.push({ k: 'warn', t: '本工具未檢定比例風險假設。若 KM 曲線明顯交叉，HR 可能隨時間改變，論文中應以 Schoenfeld 殘差檢查。' });
      }
      const medZh = s.g ? curves.map(c => `${c.label} 組 ${Number.isFinite(c.median) ? F.n(c.median) : '未達到'}`).join('、') : (Number.isFinite(curves[0].median) ? F.n(curves[0].median) : '未達到');
      const medEn = !s.g ? (Number.isFinite(curves[0].median) ? F.n(curves[0].median) : 'not reached') : curves.map(c => `${Number.isFinite(c.median) ? F.n(c.median) : 'not reached'} (${c.label})`).join(' vs ');
      const others = cv.slice(1), h0 = hr && hr[0];
      return {
        title: `存活分析：${esc(s.time)}${s.g ? `，依「${esc(s.g)}」` : ''}`, meta: meta(idx.length, dropped) + `；事件 ${S.sum(st)} 例`, blocks, notes,
        write: {
          zh: { m: `存活曲線以 Kaplan–Meier 法估計${L ? '，組間差異以 log-rank 檢定比較' : ''}${hr ? `；並以 Cox 比例風險模型估計危險比（HR）及其 95% 信賴區間${others.length ? `，校正 ${joinZh(others)}` : ''}` : ''}。`, r: `追蹤期間共發生 ${S.sum(st)} 例事件。中位存活時間為 ${medZh}${L ? `（log-rank χ²(${L.df}) = ${F.n(L.chi2, 2)}，${F.peq(L.p)}）` : ''}。${h0 ? `${others.length ? `校正 ${joinZh(others)} 後，` : ''}${h0.label} 的危險比為 ${F.n(h0.est, 2)}（95% CI ${F.ci(h0.lo, h0.hi, 2)}，${F.peq(h0.p)}）。` : ''}` },
          en: { m: `Survival was estimated with the Kaplan–Meier method${L ? ' and compared between groups with the log-rank test' : ''}${hr ? `. Hazard ratios (HRs) with 95% confidence intervals were estimated with Cox proportional hazards regression${others.length ? `, adjusting for ${joinEn(others)}` : ''}` : ''}.`, r: `During follow-up, ${S.sum(st)} events occurred. Median survival was ${medEn}${L ? ` (log-rank χ²(${L.df}) = ${F.n(L.chi2, 2)}, ${F.peq(L.p)})` : ''}.${h0 ? ` ${others.length ? `After adjustment for ${joinEn(others)}, the` : 'The'} hazard ratio for ${h0.label} was ${F.n(h0.est, 2)} (95% CI ${F.cien(h0.lo, h0.hi, 2)}, ${F.peq(h0.p)}).` : ''}` },
        },
      };
    },
  },
  multi: {
    name: '多重檢定', when: '一次比較大量變數（如基因），以 FDR 校正並畫火山圖',
    fields: [{ k: 'g', label: '分組變數（兩組）', t: 'cat' }, { k: 'vars', label: '要檢定的變數（數值）', t: 'num', multi: true, def: 'all' }],
    run(ds, s) {
      const gc = colOf(ds, s.g), vars = (s.vars || []).filter(v => v !== s.g); if (vars.length < 2) throw new Error('請至少勾選兩個要檢定的變數。');
      const base = [...Array(ds.n).keys()].filter(i => gc.values[i] !== null), G = levelsOf(ds, gc, base); if (G.length !== 2) throw new Error(`分組變數需要剛好兩組，「${s.g}」有 ${G.length} 組。`);
      const res = [];
      for (const v of vars) { const c = colOf(ds, v), gv = G.map(l => base.filter(i => lab(gc.values[i]) === l && c.values[i] !== null).map(i => c.values[i])); if (gv.some(a => a.length < 2)) continue; const w = S.welch(gv[0], gv[1]); if (Number.isFinite(w.p)) res.push({ v, diff: w.diff, p: w.p }); }
      if (res.length < 2) throw new Error('可檢定的變數不足。');
      const q = S.bh(res.map(r => r.p)); res.forEach((r, i) => { r.q = q[i]; r.bf = Math.min(1, r.p * res.length); }); res.sort((a, b) => a.p - b.p);
      const k0 = res.filter(r => r.p < 0.05).length, k1 = res.filter(r => r.q < 0.05).length, k2 = res.filter(r => r.bf < 0.05).length, blocks = [];
      blocks.push({ table: { head: ['方法', '控制', '判定顯著數'], rows: [['未校正 p < 0.05', '—', k0], ['Benjamini–Hochberg q < 0.05', 'FDR', `<b>${k1}</b>`], ['Bonferroni p < 0.05', 'FWER', k2]] }, foot: `共檢定 ${res.length} 個變數；各變數為 Welch t 檢定，差值 = ${esc(G[1])} − ${esc(G[0])}。` });
      if (ds.truth) {
        const T = new Set(ds.truth), sc = f => { const sg = res.filter(f); const tp = sg.filter(r => T.has(r.v)).length; return [tp, sg.length - tp]; };
        const a = sc(r => r.p < 0.05), b = sc(r => r.q < 0.05), c = sc(r => r.bf < 0.05);
        blocks.push({ table: { head: ['方法', '抓到的真差異（共 ' + T.size + ' 個）', '偽陽性'], rows: [['未校正', a[0], a[1]], ['BH (FDR)', b[0], b[1]], ['Bonferroni', c[0], c[1]]] }, foot: '這份模擬資料事先知道哪些基因真的有差，所以可以對答案。真實研究中你看不到這一欄。' });
      }
      const xs = res.map(r => r.diff), ys = res.map(r => -Math.log10(Math.max(1e-300, r.p))), [x0, x1] = S.minmax(xs), ym = Math.max(2, ...ys), ax = Math.max(Math.abs(x0), Math.abs(x1));
      const ch = chart({ x: [-ax, ax], y: [0, ym], xlab: `差值（${G[1]} − ${G[0]}）`, ylab: '−log10(p)', h: 340, xgrid: true }, (X, Y, { M, iw }) => {
        let g = `<line x1="${M.l}" x2="${M.l + iw}" y1="${Y(-Math.log10(0.05))}" y2="${Y(-Math.log10(0.05))}" style="stroke:var(--muted);stroke-dasharray:4 4"/>`;
        res.forEach((r, i) => { const sg = r.q < 0.05; g += `<circle cx="${X(r.diff).toFixed(1)}" cy="${Y(ys[i]).toFixed(1)}" r="${sg ? 4.5 : 3}" style="fill:${sg ? 'var(--c2)' : 'var(--muted)'};fill-opacity:${sg ? 0.9 : 0.45}"/>`; });
        res.filter(r => r.q < 0.05).slice(0, 10).forEach(r => { const i = res.indexOf(r); g += `<text class="pt" x="${X(r.diff) + 7}" y="${Y(ys[i])}" dy=".32em">${esc(r.v)}</text>`; });
        return g;
      });
      blocks.push({ chart: ch, legend: legend([['var(--c2)', 'BH q < 0.05'], ['var(--muted)', '不顯著']]), cap: '火山圖：虛線為未校正 p = 0.05。' });
      blocks.push({ table: { head: ['變數', '差值', 'p 值', 'BH q 值', 'Bonferroni p'], rows: res.map(r => ({ cls: r.q < 0.05 ? 'hit' : '', cells: [esc(r.v) + (ds.truth && ds.truth.includes(r.v) ? ' <span class="chip">真差異</span>' : ''), F.n(r.diff), F.p(r.p), F.p(r.q), F.p(r.bf)] })) }, scroll: true });
      return {
        title: `多重檢定：${res.length} 個變數，${esc(G[1])} vs ${esc(G[0])}`, meta: `樣本 n = ${base.length}`, blocks,
        notes: [{ k: 'warn', t: 'RNA-seq 計數資料請使用 DESeq2、edgeR 或 limma-voom 等專門方法；這裡的 Welch t + BH 用來理解多重檢定的原理，或適用於已標準化的連續資料。' }],
        write: {
          zh: { m: `各變數於兩組間以 Welch t 檢定比較，並以 Benjamini–Hochberg 法控制偽發現率（FDR），q < 0.05 視為顯著。`, r: `共檢定 ${res.length} 個變數；未校正 p < 0.05 者有 ${k0} 個，以 Benjamini–Hochberg 法將 FDR 控制於 5% 後有 ${k1} 個${k1 ? `（${res.filter(r => r.q < 0.05).slice(0, 8).map(r => r.v).join('、')}${k1 > 8 ? ' 等' : ''}）` : ''}，Bonferroni 校正後有 ${k2} 個。` },
          en: { m: `Each variable was compared between groups with Welch's t test, and the false discovery rate (FDR) was controlled with the Benjamini–Hochberg procedure; q < 0.05 was considered significant.`, r: `Of ${res.length} variables tested, ${k0} had unadjusted p < 0.05, ${k1} remained significant after Benjamini–Hochberg FDR control at 5%${k1 ? ` (${res.filter(r => r.q < 0.05).slice(0, 8).map(r => r.v).join(', ')}${k1 > 8 ? ', among others' : ''})` : ''}, and ${k2} after Bonferroni correction.` },
        },
      };
    },
  },
  power: {
    name: '樣本數計算', when: '研究開始前：需要多少受試者才能偵測到效果', fields: [], nodata: true,
    run() { return { title: '樣本數與檢定力', meta: '不需要資料集', blocks: [{ html: '<div class="widget" id="lab-power"></div>' }], mount: 'lab-power' }; },
  },
};
// ==PURE-END==
