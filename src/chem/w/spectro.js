/* ---------- 後中化學：光譜分析的互動圖 ----------
   譜圖為依典型吸收位置合成的示意圖（位置與相對強弱依教科書數值），不是實測原始資料。 */

/* ===== 1. 紅外光譜 ===== */
W.ir = el => {
  // [中心 cm⁻¹, 深度 0–1, 寬度, 標籤]
  const C = {
    hexane: { n: '己烷', p: [[2930, 0.85, 40, 'C–H（sp³）'], [1465, 0.4, 15, ''], [1378, 0.3, 10, '']] },
    butanol: { n: '1-丁醇', p: [[3330, 0.8, 140, 'O–H（寬，氫鍵）'], [2930, 0.8, 40, 'C–H'], [1060, 0.6, 25, 'C–O']] },
    butanone: { n: '2-丁酮', p: [[2970, 0.5, 30, 'C–H'], [1715, 0.95, 18, 'C=O 酮'], [1170, 0.4, 20, '']] },
    butanal: { n: '丁醛', p: [[2960, 0.6, 30, 'C–H'], [2820, 0.35, 10, ''], [2720, 0.35, 10, '醛 C–H（兩根）'], [1730, 0.95, 18, 'C=O 醛']] },
    acid: { n: '丁酸', p: [[2950, 0.75, 330, 'O–H（極寬 2500–3300）'], [1710, 0.95, 20, 'C=O 酸'], [1280, 0.5, 25, 'C–O']] },
    ester: { n: '乙酸乙酯', p: [[2980, 0.45, 30, 'C–H'], [1740, 0.95, 18, 'C=O 酯'], [1240, 0.85, 25, 'C–O（強）']] },
    alkyne: { n: '1-己炔', p: [[3310, 0.8, 15, '≡C–H（尖）'], [2930, 0.75, 40, 'C–H'], [2120, 0.35, 12, 'C≡C']] },
    amine: { n: '丁胺', p: [[3370, 0.45, 25, ''], [3290, 0.45, 25, 'N–H（一級胺兩根）'], [2930, 0.8, 40, 'C–H'], [1600, 0.4, 25, '']] },
  };
  let cur = 'butanone';
  el.innerHTML = `${seg('irS', Object.entries(C).map(([k, v]) => [k, v.n]), cur)}<div id="irG"></div><table class="tbl"><thead><tr><th>波數（cm⁻¹）</th><th>鍵</th><th>辨認重點</th></tr></thead><tbody><tr><td>3200–3550</td><td>O–H（醇）</td><td>寬而圓</td></tr><tr><td>2500–3300</td><td>O–H（羧酸）</td><td>非常寬，蓋住 C–H</td></tr><tr><td>3300–3500</td><td>N–H</td><td>一級胺兩根、二級胺一根</td></tr><tr><td>約 3300</td><td>≡C–H</td><td>尖</td></tr><tr><td>3000–3100／2850–3000</td><td>C–H（sp²／sp³）</td><td>以 3000 為界</td></tr><tr><td>2100–2260</td><td>C≡C、C≡N</td><td>這一區很少有其他吸收</td></tr><tr><td>1680–1750</td><td>C=O</td><td>最強、最尖，最重要</td></tr><tr><td>1600–1680</td><td>C=C</td><td>較弱</td></tr></tbody></table>`;
  function draw() {
    const c = C[cur], T = x => 1 - c.p.reduce((s, [m, d, w]) => s + d * Math.exp(-((x - m) ** 2) / (2 * w * w)), 0);
    const xs = Array.from({ length: 721 }, (_, i) => 4000 - i * 5);
    $('#irG', el).innerHTML = chart({ x: [-4000, -500], y: [0, 1.05], xt: [], yt: [0, 0.5, 1], xlab: '波數（cm⁻¹）：左高右低', ylab: '穿透率', h: 220, label: `${c.n} 的紅外光譜` }, (X, Y) => `${[4000, 3000, 2000, 1500, 1000, 500].map(v => `<text class="tk" x="${X(-v)}" y="${Y(0) + 16}" text-anchor="middle">${v}</text>`).join('')}<path class="tline" d="${path(xs.map(x => [X(-x), Y(clamp(T(x), 0, 1))]))}"/>${c.p.filter(p => p[3]).map(([m, d, , l]) => `<text class="tk hl" x="${X(-m)}" y="${Y(clamp(1 - d, 0, 1)) + 14}" text-anchor="middle">${l}</text>`).join('')}`);
    pressSeg(el, 'irS', cur);
  }
  bindSeg(el, 'irS', v => { cur = v; draw(); });
  draw();
  return { set(s) { cur = s.c || cur; draw(); } };
};

/* ===== 2. ¹H NMR：化學位移、積分、分裂 ===== */
W.nmr = el => {
  // [δ, 氫數, 分裂（鄰近 H 數 n → n+1 峰）, 名稱, 說明]
  const M = {
    ea: { n: '乙酸乙酯 CH₃COOCH₂CH₃', s: [[4.12, 2, 3, 'O–CH₂', '接在酯的 O 上，被拉電子，往低磁場（左）移。鄰近 CH₃ 有 3 個 H → 四重峰。'], [2.04, 3, 0, 'CO–CH₃', '在羰基旁邊，δ 約 2。鄰碳（羰基 C）沒有 H → 單峰。'], [1.26, 3, 2, 'CH₂–CH₃', '一般烷基 H。鄰近 CH₂ 有 2 個 H → 三重峰。']] },
    mek: { n: '2-丁酮 CH₃COCH₂CH₃', s: [[2.44, 2, 3, 'CO–CH₂', '羰基旁，鄰近 CH₃ → 四重峰。'], [2.14, 3, 0, 'CO–CH₃', '羰基旁、鄰碳無 H → 單峰。'], [1.06, 3, 2, 'CH₂–CH₃', '鄰近 CH₂ → 三重峰。']] },
    ipcl: { n: '2-氯丙烷 (CH₃)₂CHCl', s: [[4.14, 1, 6, 'CH–Cl', '接在 Cl 上，δ 大。兩邊共 6 個 H → 七重峰。'], [1.52, 6, 1, '2 × CH₃', '兩個甲基等價（6 H）。鄰近 CH 有 1 個 H → 雙重峰。']] },
    tol: { n: '甲苯 C₆H₅CH₃', s: [[7.2, 5, -1, '芳香 H', '苯環的 π 電子環流使環上 H 去遮蔽，δ 約 7–8。五個 H 化學環境相近，重疊成多重峰。'], [2.35, 3, 0, 'Ar–CH₃', '苯甲基 H，δ 約 2.3；鄰碳（環碳）無 H → 單峰。']] },
    benz: { n: '苯甲醛 C₆H₅CHO', s: [[10.0, 1, 0, 'CHO', '醛基 H 被羰基強烈去遮蔽，δ 9–10，非常有辨識度。'], [7.7, 5, -1, '芳香 H', '芳香區 7.5–7.9。']] },
    aa: { n: '乙酸 CH₃COOH', s: [[11.4, 1, 0, 'COOH', '羧酸 H 最去遮蔽，δ 10–12，常是寬峰（會和 D₂O 交換而消失）。'], [2.10, 3, 0, 'CH₃', '羰基旁，單峰。']] },
  };
  let cur = 'ea', pick = 0;
  el.innerHTML = `${seg('nmS', Object.entries(M).map(([k, v]) => [k, v.n]), cur)}<div id="nmG"></div><div class="w-row" id="nmP"></div><p class="note" id="nmN"></p>`;
  const pascal = n => { let r = [1]; for (let i = 0; i < n; i++) r = r.map((v, j) => v + (r[j - 1] || 0)).concat(1); return r; };
  function draw() {
    const m = M[cur], tot = m.s.reduce((s, x) => s + x[1], 0), sp = 0.07;
    $('#nmG', el).innerHTML = chart({ x: [-12, 0], y: [0, 1.15], xt: [], yt: [], xlab: 'δ（ppm）：左邊去遮蔽（低磁場）', h: 230, label: `${m.n} 的氫譜` }, (X, Y) => {
      let g = [12, 10, 8, 6, 4, 2, 0].map(v => `<text class="tk" x="${X(-v)}" y="${Y(0) + 16}" text-anchor="middle">${v}</text>`).join('') + `<line class="ax" x1="${X(-12)}" x2="${X(0)}" y1="${Y(0)}" y2="${Y(0)}"/>`;
      m.s.forEach(([d, h, n, lab], i) => {
        const pk = n < 0 ? [1, 2, 3, 2, 1] : pascal(n), mx = Math.max(...pk), hgt = 0.25 + 0.6 * h / Math.max(...m.s.map(x => x[1]));
        pk.forEach((v, j) => { const x = d + (j - (pk.length - 1) / 2) * sp; g += `<line class="${i === pick ? 'nmon' : 'nmpk'}" x1="${X(-x)}" x2="${X(-x)}" y1="${Y(0)}" y2="${Y(hgt * v / mx)}"/>`; });
        g += `<text class="tk${i === pick ? ' hl' : ''}" x="${X(-d)}" y="${Y(hgt) - 8}" text-anchor="middle">${h}H</text>`;
      });
      return g;
    });
    $('#nmP', el).innerHTML = m.s.map((x, i) => `<button class="btn sm${i === pick ? ' pri' : ''}" type="button" data-i="${i}">δ ${x[0]}　${x[3]}</button>`).join('');
    $$('[data-i]', el).forEach(b => { b.onclick = () => { pick = +b.dataset.i; draw(); }; });
    const [d, h, n, lab, why] = m.s[pick], mult = n < 0 ? '多重峰' : ['單峰（s）', '雙重峰（d）', '三重峰（t）', '四重峰（q）', '五重峰', '六重峰', '七重峰'][n];
    $('#nmN', el).innerHTML = `<b>δ ${d}，${lab}</b>：積分 ${h} H（佔 ${h}/${tot}），${mult}。${why}<br>讀氫譜的三個資訊：<b>位置 δ</b>（環境：越靠近電負度大的原子、羰基、苯環越往左）、<b>積分</b>（幾個 H）、<b>分裂</b>（鄰近碳上有 n 個等價 H → n + 1 根峰，高度比依巴斯卡三角形）。`;
    pressSeg(el, 'nmS', cur);
  }
  bindSeg(el, 'nmS', v => { cur = v; pick = 0; draw(); });
  draw();
  return { set(s) { if (s.m) cur = s.m; pick = s.i ?? 0; draw(); } };
};

/* ===== 3. 質譜：同位素峰 ===== */
W.ms = el => {
  const M = { ch3cl: ['氯乙烷 C₂H₅Cl', [[64, 100], [66, 32]], '³⁵Cl : ³⁷Cl ≈ 3 : 1，所以 M 和 M+2 峰高約 3 : 1：分子中有一個 Cl 的特徵。'], br: ['溴乙烷 C₂H₅Br', [[108, 100], [110, 97]], '⁷⁹Br : ⁸¹Br ≈ 1 : 1，所以 M 和 M+2 幾乎一樣高：分子中有一個 Br 的特徵。'], hex: ['己烷 C₆H₁₄', [[86, 100], [87, 6.6]], '沒有 Cl、Br，M+1 峰來自 ¹³C（每個碳約 1.1%），6 個碳 → M+1 約 6.6%。可以反推碳數。'], pyr: ['吡啶 C₅H₅N', [[79, 100], [80, 5.9]], '分子量為奇數：<b>氮規則</b>，含奇數個 N 的化合物分子量為奇數。'] };
  let cur = 'ch3cl';
  el.innerHTML = `${seg('msS', Object.entries(M).map(([k, v]) => [k, v[0]]), cur)}<div id="msG"></div><p class="note" id="msN"></p>`;
  function draw() {
    const [n, pk, why] = M[cur], lo = pk[0][0] - 3, hi = pk[pk.length - 1][0] + 3;
    $('#msG', el).innerHTML = chart({ x: [lo, hi], y: [0, 110], xt: pk.map(p => p[0]), yt: [0, 50, 100], xlab: 'm/z（分子離子區）', ylab: '相對強度', h: 190 }, (X, Y) => pk.map(([m, v], i) => `<line x1="${X(m)}" x2="${X(m)}" y1="${Y(0)}" y2="${Y(v)}" class="nmon"/><text class="tk" x="${X(m)}" y="${Y(v) - 6}" text-anchor="middle">${i === 0 ? 'M' : i === 1 && pk[1][0] - pk[0][0] === 2 ? 'M+2' : 'M+1'}</text>`).join(''));
    $('#msN', el).innerHTML = `<b>${n}</b>：${why} 質譜先把分子打成帶正電的分子離子（M⁺），由 m/z 得到分子量；碎片峰則顯示分子容易斷裂的位置。`;
    pressSeg(el, 'msS', cur);
  }
  bindSeg(el, 'msS', v => { cur = v; draw(); });
  draw();
  return { set(s) { cur = s.c || cur; draw(); } };
};
