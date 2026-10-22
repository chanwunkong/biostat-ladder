/* ---------- 後中化學：相圖、晶格與核化學的互動圖 ---------- */

/* ===== 1. 相圖：水與二氧化碳 =====
   以實測的特徵點畫邊界（三相點、正常沸點或昇華點、臨界點），氣液線與昇華線在 (1/T, ln P) 上分段線性；熔化線用近似斜率。圖為示意，但特徵點數值正確。 */
W.phase = el => {
  const SUB = {
    water: { n: '水', tp: [273.16, 0.00604], bp: [373.15, 1], cp: [647.1, 217.7], subB: 6146, melt: P => 273.16 - 0.0074 * (P - 0.00604), notes: '熔化線向左傾（負斜率）：加壓會讓冰熔化，因為冰的密度比水小。' },
    co2: { n: '二氧化碳', tp: [216.6, 5.11], bp: null, sp: [194.7, 1], cp: [304.2, 72.9], melt: P => 216.6 + 0.02 * (P - 5.11), notes: '三相點壓力 5.1 atm 高於 1 atm，所以在一大氣壓下 CO₂ 不會變成液體，乾冰直接昇華（−78.5 °C）。熔化線向右傾，和大多數物質一樣。' },
  };
  const st = { s: 'water', T: 298, lp: 0 };
  el.innerHTML = `${seg('phS', Object.entries(SUB).map(([k, v]) => [k, v.n]), st.s)}<div class="w-row"><label class="rng">溫度（°C）<input type="range" id="phT" min="-120" max="420" step="1"><output class="mono" id="phTo"></output></label><label class="rng">壓力（atm，對數）<input type="range" id="phP" min="-3" max="3" step="0.05"><output class="mono" id="phPo"></output></label></div><div id="phG"></div><p class="note" id="phN"></p>`;
  const lin = (a, b, x) => a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  function curves(d) {
    const iT = T => 1 / T, L = (p, q, T) => Math.exp(lin([iT(p[0]), Math.log(p[1])], [iT(q[0]), Math.log(q[1])], iT(T)));
    const lv = T => (d.bp ? (T <= d.bp[0] ? L(d.tp, d.bp, T) : L(d.bp, d.cp, T)) : L(d.tp, d.cp, T));
    const sub = T => (d.sp ? L(d.sp, d.tp, T) : d.tp[1] * Math.exp(-d.subB * (1 / T - 1 / d.tp[0])));
    return { lv, sub, pv: T => (T < d.tp[0] ? sub(T) : lv(T)) };
  }
  function phaseAt(d, T, P) {
    const c = curves(d);
    if (T >= d.cp[0] && P >= d.cp[1]) return '超臨界流體';
    if (T >= d.cp[0]) return '氣體';
    if (P < c.pv(T)) return '氣體';
    return T < d.melt(P) ? '固體' : '液體';
  }
  function draw() {
    const d = SUB[st.s], c = curves(d), P = 10 ** st.lp, T = st.T, ph = phaseAt(d, T, P);
    const Ts = (a, b) => Array.from({ length: 80 }, (_, i) => a + (b - a) * i / 79);
    $('#phG', el).innerHTML = chart({ x: [150, 700], y: [-3, 3], xt: [173, 273, 373, 473, 573, 673], yt: [-3, -2, -1, 0, 1, 2, 3], xlab: '溫度（K）', ylab: 'log P（atm）', h: 270, label: `${d.n}的相圖` }, (X, Y) => {
      const cl = v => clamp(Math.log10(v), -3, 3);
      const sub = Ts(150, d.tp[0]).map(t => [X(t), Y(cl(c.sub(t)))]), lv = Ts(d.tp[0], d.cp[0]).map(t => [X(t), Y(cl(c.lv(t)))]);
      const melt = Array.from({ length: 40 }, (_, i) => { const lp = Math.log10(d.tp[1]) + (3 - Math.log10(d.tp[1])) * i / 39; return [X(d.melt(10 ** lp)), Y(lp)]; });
      return `<line class="mk" x1="${X(150)}" x2="${X(700)}" y1="${Y(0)}" y2="${Y(0)}"/><text class="tk" x="${X(690)}" y="${Y(0) - 5}" text-anchor="end">1 atm</text><path class="pb" d="${path(sub)}"/><path class="pb" d="${path(lv)}"/><path class="pb" d="${path(melt)}"/>
<circle class="dot2" cx="${X(d.tp[0])}" cy="${Y(Math.log10(d.tp[1]))}" r="5"/><text class="tk" x="${X(d.tp[0]) + 8}" y="${Y(Math.log10(d.tp[1])) + 14}">三相點</text><circle class="dot2" cx="${X(d.cp[0])}" cy="${Y(Math.log10(d.cp[1]))}" r="5"/><text class="tk" x="${X(d.cp[0]) + 6}" y="${Y(Math.log10(d.cp[1])) - 6}">臨界點</text>
<text class="tk hl" x="${X(st.s === 'water' ? 200 : 170)}" y="${Y(2.2)}">固</text><text class="tk hl" x="${X(st.s === 'water' ? 330 : 260)}" y="${Y(2.2)}">液</text><text class="tk hl" x="${X(450)}" y="${Y(-1.5)}">氣</text>
<circle class="dot" cx="${X(clamp(T, 150, 700))}" cy="${Y(st.lp)}" r="7"/>`;
    });
    $('#phN', el).innerHTML = `${d.n}在 ${fx(T - 273.15, 0)} °C、${P >= 0.1 ? fx(P, 2) : sci(P, 1)} atm：<b>${ph}</b>。${d.notes} 三相點：${fx(d.tp[0] - 273.15, 2)} °C、${d.tp[1]} atm；臨界點：${fx(d.cp[0] - 273.15, 1)} °C、${d.cp[1]} atm，超過臨界點後液體與氣體沒有界線（超臨界 CO₂ 用來萃取咖啡因）。`;
    $('#phT', el).value = T - 273.15; $('#phTo', el).textContent = fx(T - 273.15, 0); $('#phP', el).value = st.lp; $('#phPo', el).textContent = P >= 0.1 ? fx(P, 2) : sci(P, 1); pressSeg(el, 'phS', st.s);
  }
  bindSeg(el, 'phS', v => { st.s = v; draw(); });
  $('#phT', el).oninput = e => { st.T = +e.target.value + 273.15; draw(); };
  $('#phP', el).oninput = e => { st.lp = +e.target.value; draw(); };
  draw();
  return { set(s) { if (s.s) st.s = s.s; if (s.C != null) st.T = s.C + 273.15; if (s.P != null) st.lp = Math.log10(s.P); draw(); } };
};

/* ===== 2. 立方晶格 ===== */
W.cell = el => {
  const C = { sc: { n: '簡單立方', z: 1, cn: 6, pf: 52, rel: 'a = 2r', ex: '釙（Po）' }, bcc: { n: '體心立方', z: 2, cn: 8, pf: 68, rel: '體對角線 √3·a = 4r', ex: 'Na、K、Fe（室溫）' }, fcc: { n: '面心立方', z: 4, cn: 12, pf: 74, rel: '面對角線 √2·a = 4r', ex: 'Cu、Ag、Au、Al；NaCl 的 Cl⁻ 排列' } };
  let cur = 'fcc';
  el.innerHTML = `${seg('ceS', Object.entries(C).map(([k, v]) => [k, v.n]), cur)}<div class="bgrid"><div id="ceV"></div><div class="cards" id="ceK"></div></div><p class="note" id="ceN"></p>`;
  function draw() {
    const c = C[cur], o = [70, 150], s = 110, d = [45, -35], P = (x, y, z) => [o[0] + x * s + z * d[0], o[1] - y * s + z * d[1]];
    const corners = []; for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) corners.push([x, y, z]);
    const edges = corners.flatMap(a => corners.filter(b => (a[0] !== b[0]) + (a[1] !== b[1]) + (a[2] !== b[2]) === 1 && a < b).map(b => [a, b]));
    const pts = [...corners.map(p => [p, '1/8'])];
    if (cur === 'bcc') pts.push([[0.5, 0.5, 0.5], '1']);
    if (cur === 'fcc') [[0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]].forEach(p => pts.push([p, '1/2']));
    pts.sort((a, b) => a[0][2] - b[0][2]);
    $('#ceV', el).innerHTML = `<svg viewBox="0 0 240 210" class="bk" role="img" aria-label="${c.n}">${edges.map(([a, b]) => { const p = P(...a), q = P(...b); return `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="var(--muted)"/>`; }).join('')}${pts.map(([p, f]) => { const [x, y] = P(...p); return `<circle cx="${x}" cy="${y}" r="${f === '1' ? 15 : 11}" class="${f === '1/8' ? 'atc' : f === '1' ? 'atb' : 'atf'}"/>`; }).join('')}</svg><p class="small mut c">角落（藍）算 1/8、面心（橘）算 1/2、體心（紅）算 1</p>`;
    $('#ceK', el).innerHTML = card('z', '每個晶胞的原子數', c.z) + card('n', '配位數', c.cn) + card('p', '堆積效率', `${c.pf}%`) + card('r', '邊長與半徑', c.rel);
    $('#ceN', el).innerHTML = `<b>${c.n}</b>：${cur === 'sc' ? '8 個角 × 1/8 = 1' : cur === 'bcc' ? '8 × 1/8 + 1（體心）= 2' : '8 × 1/8 + 6 × 1/2（面心）= 4'} 個原子。例子：${c.ex}。晶體密度 = (每晶胞原子數 × 莫耳質量) ÷ (亞佛加厥數 × a³)，是常見計算題。`;
    pressSeg(el, 'ceS', cur);
  }
  bindSeg(el, 'ceS', v => { cur = v; draw(); });
  draw();
  return { set(s) { cur = s.c || cur; draw(); } };
};

/* ===== 3. 放射性衰變與半衰期 ===== */
W.decay = el => {
  const I = { f18: ['¹⁸F（PET 造影）', 109.8, '分鐘'], tc: ['⁹⁹ᵐTc（核醫造影）', 6.01, '小時'], i131: ['¹³¹I（甲狀腺治療）', 8.02, '天'], c14: ['¹⁴C（定年）', 5730, '年'] };
  const st = { i: 'c14', n: 1 };
  el.innerHTML = `${seg('dyS', Object.entries(I).map(([k, v]) => [k, v[0]]), st.i)}<div class="w-row"><label class="rng">經過幾個半衰期 <input type="range" id="dyN" min="0" max="8" step="0.05"><output class="mono" id="dyO"></output></label></div><div id="dyG"></div><div class="cards" id="dyK"></div><p class="note" id="dyN2"></p>`;
  function draw() {
    const [nm, h, u] = I[st.i], f = 0.5 ** st.n, xs = Array.from({ length: 161 }, (_, i) => i / 20);
    $('#dyG', el).innerHTML = chart({ x: [0, 8], y: [0, 1], xt: [0, 1, 2, 3, 4, 5, 6, 7, 8], yt: [0, 0.25, 0.5, 1], xlab: '半衰期數', ylab: '剩下的比例', h: 200 }, (X, Y) => `<path class="tline" d="${path(xs.map(x => [X(x), Y(0.5 ** x)]))}"/>${[1, 2, 3].map(k => `<line class="mk" x1="${X(k)}" x2="${X(k)}" y1="${Y(0)}" y2="${Y(0.5 ** k)}"/>`).join('')}<circle class="dot" cx="${X(st.n)}" cy="${Y(f)}" r="7"/>`);
    $('#dyK', el).innerHTML = card('t', '經過時間', `${fx(st.n * h, h > 100 ? 0 : 1)} ${u}`) + card('f', '剩下', `${fx(100 * f, 2)}%`) + card('k', '衰變常數 k = 0.693 ÷ t½', `${sci(Math.LN2 / h, 3)} /${u}`);
    $('#dyN2', el).innerHTML = `放射性衰變是<b>一級反應</b>：每經過一個半衰期剩下一半，和初始量無關。t = (t½ ÷ 0.693) × ln(N₀/N)。${st.i === 'c14' ? '¹⁴C 定年：活的生物體內 ¹⁴C/¹²C 比例和大氣相同，死亡後 ¹⁴C 開始衰變；測出剩下的比例就能推算年代。' : '醫用同位素要選半衰期適中的：太長會讓病人長時間受輻射，太短則來不及送到醫院使用。'}`;
    $('#dyN', el).value = st.n; $('#dyO', el).textContent = fx(st.n, 2); pressSeg(el, 'dyS', st.i);
  }
  bindSeg(el, 'dyS', v => { st.i = v; draw(); });
  $('#dyN', el).oninput = e => { st.n = +e.target.value; draw(); };
  draw();
  return { set(s) { Object.assign(st, s); draw(); } };
};
