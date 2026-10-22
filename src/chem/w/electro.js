/* ---------- 後中化學：電化學的互動圖 ---------- */
// 標準還原電位（V，25 °C）：[符號, 半反應, E°, 轉移電子數, 金屬（可當電極）]
const E0 = [['Li', 'Li⁺ + e⁻ → Li', -3.04, 1], ['Mg', 'Mg²⁺ + 2e⁻ → Mg', -2.37, 2], ['Al', 'Al³⁺ + 3e⁻ → Al', -1.66, 3], ['Zn', 'Zn²⁺ + 2e⁻ → Zn', -0.76, 2], ['Fe', 'Fe²⁺ + 2e⁻ → Fe', -0.44, 2],
  ['Ni', 'Ni²⁺ + 2e⁻ → Ni', -0.25, 2], ['Pb', 'Pb²⁺ + 2e⁻ → Pb', -0.13, 2], ['H₂', '2H⁺ + 2e⁻ → H₂', 0.00, 2], ['Cu', 'Cu²⁺ + 2e⁻ → Cu', 0.34, 2], ['Ag', 'Ag⁺ + e⁻ → Ag', 0.80, 1], ['Au', 'Au³⁺ + 3e⁻ → Au', 1.50, 3]];
const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => a * b / gcd(a, b);

/* ===== 1. 賈法尼電池 ===== */
W.galv = el => {
  let a = 3, c = 8;
  el.innerHTML = `<div class="w-row"><label class="sel">左邊電極 <select id="gvA">${E0.map((e, i) => `<option value="${i}">${e[1]}（${e[2]} V）</option>`).join('')}</select></label><label class="sel">右邊電極 <select id="gvC">${E0.map((e, i) => `<option value="${i}">${e[1]}（${e[2]} V）</option>`).join('')}</select></label></div><div id="gvD"></div><div class="cards" id="gvK"></div><p class="note" id="gvN"></p>`;
  function draw() {
    const L = E0[a], R = E0[c], an = L[2] < R[2] ? L : R, ca = an === L ? R : L, Ec = ca[2] - an[2], n = lcm(an[3], ca[3]), dG = -n * 96485 * Ec / 1000, K = Math.exp(n * 96485 * Ec / (8.314 * 298));
    const leftIsAnode = an === L, flow = leftIsAnode ? 1 : -1;
    $('#gvD', el).innerHTML = `<svg viewBox="0 0 520 230" class="bk" role="img" aria-label="賈法尼電池"><defs><marker id="em" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--arrow)"/></marker></defs>
<path d="M40 110L40 210L200 210L200 110" class="glass"/><path d="M320 110L320 210L480 210L480 110" class="glass"/><rect x="42" y="130" width="156" height="78" fill="var(--water)"/><rect x="322" y="130" width="156" height="78" fill="var(--water)"/>
<rect x="110" y="80" width="20" height="110" fill="var(--muted)"/><rect x="390" y="80" width="20" height="110" fill="var(--muted)"/>
<path d="M170 140L170 60L350 60L350 140" fill="none" stroke="var(--line)" stroke-width="16"/><text class="tk" x="260" y="52" text-anchor="middle">鹽橋</text>
<path d="M120 80L120 24L400 24L400 80" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="260" cy="24" r="16" fill="var(--surface)" stroke="var(--ink)"/><text class="tk" x="260" y="28" text-anchor="middle">${fx(Ec, 2)} V</text>
<line x1="${flow > 0 ? 160 : 360}" x2="${flow > 0 ? 220 : 300}" y1="14" y2="14" stroke="var(--arrow)" stroke-width="2.5" marker-end="url(#em)"/><text class="tk" x="${flow > 0 ? 190 : 330}" y="10" text-anchor="middle">e⁻</text>
<text class="tk hl" x="120" y="226" text-anchor="middle">${L[0]}｜${leftIsAnode ? '陽極（氧化）' : '陰極（還原）'}</text><text class="tk hl" x="400" y="226" text-anchor="middle">${R[0]}｜${leftIsAnode ? '陰極（還原）' : '陽極（氧化）'}</text></svg>`;
    $('#gvK', el).innerHTML = card('e', 'E°電池 = E°陰極 − E°陽極', `${fx(Ec, 2)} V`) + card('n', '轉移電子 n', n) + card('g', 'ΔG° = −nFE°', `${fx(dG, 0)} kJ`) + card('k', 'K', Ec > 0.6 ? sci(K, 1) : sci(K, 2));
    $('#gvN', el).innerHTML = a === c ? '兩邊相同，電壓為 0。' : `E° 較小的 <b>${an[0]}</b> 比較容易失去電子，當<b>陽極</b>（氧化）；E° 較大的 <b>${ca[0]}</b> 當<b>陰極</b>（還原）。電子經外電路從陽極流向陰極；鹽橋中的離子移動以維持兩杯電中性（陰離子移向陽極）。E°電池 = ${ca[2]} − (${an[2]}) = ${fx(Ec, 2)} V。<b>注意</b>：半反應係數乘幾倍，E° 都<b>不變</b>（它是強度性質），但 ΔG° 要用總電子數 n = ${n}。E° > 0 ⇔ ΔG° < 0 ⇔ K > 1：反應自發。`;
    $('#gvA', el).value = a; $('#gvC', el).value = c;
  }
  $('#gvA', el).onchange = e => { a = +e.target.value; draw(); };
  $('#gvC', el).onchange = e => { c = +e.target.value; draw(); };
  draw();
  return { set(s) { a = s.a ?? a; c = s.c ?? c; draw(); } };
};

/* ===== 2. 能斯特方程：濃度改變電壓 ===== */
W.nernst = el => {
  const st = { zn: 1, cu: 1 };
  el.innerHTML = `<p class="eq">Zn(s) + Cu²⁺ → Zn²⁺ + Cu(s)　E° = 1.10 V，n = 2</p><div class="w-row"><label class="rng">[Zn²⁺]（M）<input type="range" id="nsZ" min="-4" max="1" step="0.1"><output class="mono" id="nsZo"></output></label><label class="rng">[Cu²⁺]（M）<input type="range" id="nsC" min="-4" max="1" step="0.1"><output class="mono" id="nsCo"></output></label></div><div id="nsG"></div><div class="cards" id="nsK"></div><p class="note" id="nsN"></p>`;
  function draw() {
    const Q = st.zn / st.cu, E = 1.10 - 0.0592 / 2 * Math.log10(Q), lq = Math.log10(Q);
    $('#nsG', el).innerHTML = chart({ x: [-6, 40], y: [-0.1, 1.3], xt: [-5, 0, 10, 20, 30, 37.2], yt: [0, 0.5, 1.1], xlab: 'log Q', ylab: 'E（V）', h: 210, label: '電壓與 Q' }, (X, Y) => `<line class="mk" x1="${X(-6)}" x2="${X(40)}" y1="${Y(0)}" y2="${Y(0)}"/><line class="tline" x1="${X(-6)}" y1="${Y(1.10 + 0.0296 * 6)}" x2="${X(40)}" y2="${Y(1.10 - 0.0296 * 40)}"/><circle class="dot" cx="${X(lq)}" cy="${Y(E)}" r="7"/><text class="tk" x="${X(37.2)}" y="${Y(0) - 8}" text-anchor="end">E = 0：Q = K ≈ 10³⁷</text>`);
    $('#nsK', el).innerHTML = card('q', 'Q = [Zn²⁺] ÷ [Cu²⁺]', sci(Q, 2)) + card('e', 'E = E° − (0.0592/n) log Q', `${fx(E, 3)} V`);
    $('#nsN', el).innerHTML = `電池放電時，Zn²⁺ 變多、Cu²⁺ 變少，Q 變大，電壓慢慢下降；直到 <b>E = 0</b> 時 Q = K，達到平衡，電池「沒電」。由 E° = (0.0592/n) log K 得 K = 10^(2 × 1.10 ÷ 0.0592) ≈ 10³⁷：反應幾乎完全進行。${Math.abs(lq) < 0.05 ? '現在兩者濃度相同，Q = 1，E = E°。' : ''}`;
    $('#nsZ', el).value = Math.log10(st.zn); $('#nsC', el).value = Math.log10(st.cu); $('#nsZo', el).textContent = sci(st.zn, 1); $('#nsCo', el).textContent = sci(st.cu, 1);
  }
  $('#nsZ', el).oninput = e => { st.zn = 10 ** +e.target.value; draw(); };
  $('#nsC', el).oninput = e => { st.cu = 10 ** +e.target.value; draw(); };
  draw();
  return { set(s) { Object.assign(st, s); draw(); } };
};

/* ===== 3. 電解：法拉第定律 ===== */
W.faraday = el => {
  const M = { Cu: ['Cu²⁺ → Cu', 63.55, 2], Ag: ['Ag⁺ → Ag', 107.87, 1], Al: ['Al³⁺ → Al', 26.98, 3] };
  const st = { m: 'Cu', I: 2, t: 30 };
  el.innerHTML = `${seg('fdS', Object.entries(M).map(([k, v]) => [k, v[0]]), st.m)}<div class="w-row"><label class="rng">電流（A）<input type="range" id="fdI" min="0.5" max="10" step="0.5"><output class="mono" id="fdIo"></output></label><label class="rng">時間（分鐘）<input type="range" id="fdT" min="1" max="120" step="1"><output class="mono" id="fdTo"></output></label></div><ol class="cs" id="fdS2"></ol><p class="note">電解是把賈法尼電池「倒過來」：外加電壓強迫不自發的氧化還原發生。陰極永遠是還原、陽極永遠是氧化（電解時陰極接電源負極）。</p>`;
  function draw() {
    const [r, Mw, n] = M[st.m], q = st.I * st.t * 60, mol_e = q / 96485, mol = mol_e / n, g = mol * Mw;
    $('#fdS2', el).innerHTML = `<li>電量 Q = I × t = ${st.I} A × ${st.t * 60} s = ${fx(q, 0)} C</li><li>電子莫耳數 = Q ÷ F = ${fx(q, 0)} ÷ 96485 = ${fx(mol_e, 4)} mol</li><li>${r} 需要 ${n} 個電子：金屬莫耳數 = ${fx(mol_e, 4)} ÷ ${n} = ${fx(mol, 4)} mol</li><li>質量 = ${fx(mol, 4)} × ${Mw} = <b>${fx(g, 3)} g</b></li>`;
    $('#fdIo', el).textContent = st.I; $('#fdTo', el).textContent = st.t; $('#fdI', el).value = st.I; $('#fdT', el).value = st.t; pressSeg(el, 'fdS', st.m);
  }
  bindSeg(el, 'fdS', v => { st.m = v; draw(); });
  $('#fdI', el).oninput = e => { st.I = +e.target.value; draw(); };
  $('#fdT', el).oninput = e => { st.t = +e.target.value; draw(); };
  draw();
  return { set(s) { Object.assign(st, s); draw(); } };
};
