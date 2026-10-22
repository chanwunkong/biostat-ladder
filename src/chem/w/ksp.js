/* ---------- 後中化學：溶解度平衡的互動圖 ----------
   Ksp（25 °C，常見教科書數值；不同教科書略有差異） */
const KSP = {
  AgCl: { n: 'AgCl', k: 1.8e-10, x: 1, y: 1, c: 'Ag⁺', a: 'Cl⁻' },
  AgBr: { n: 'AgBr', k: 5.0e-13, x: 1, y: 1, c: 'Ag⁺', a: 'Br⁻' },
  AgI: { n: 'AgI', k: 8.3e-17, x: 1, y: 1, c: 'Ag⁺', a: 'I⁻' },
  BaSO4: { n: 'BaSO₄', k: 1.1e-10, x: 1, y: 1, c: 'Ba²⁺', a: 'SO₄²⁻' },
  CaF2: { n: 'CaF₂', k: 3.9e-11, x: 1, y: 2, c: 'Ca²⁺', a: 'F⁻' },
  Ag2CrO4: { n: 'Ag₂CrO₄', k: 1.1e-12, x: 2, y: 1, c: 'Ag⁺', a: 'CrO₄²⁻' },
};
const solub = d => (d.k / (d.x ** d.x * d.y ** d.y)) ** (1 / (d.x + d.y));

/* ===== 1. Ksp 與莫耳溶解度 ===== */
W.ksp = el => {
  let cur = 'AgCl';
  el.innerHTML = `${seg('kpS', Object.entries(KSP).map(([k, v]) => [k, v.n]), cur)}<ol class="cs" id="kpC"></ol><div class="bars pk" id="kpB"></div><p class="small mut">各鹽類在純水中的莫耳溶解度 s（對數長度）</p><p class="note" id="kpN"></p>`;
  function draw() {
    const d = KSP[cur], s = solub(d), co = d.x === 1 ? 's' : `${d.x}s`, an = d.y === 1 ? 's' : `${d.y}s`;
    $('#kpC', el).innerHTML = `<li>${d.n}(s) ⇌ ${d.x > 1 ? d.x : ''}${d.c} + ${d.y > 1 ? d.y : ''}${d.a}</li><li>設溶解度為 s（M）：[${d.c}] = ${co}、[${d.a}] = ${an}</li><li>Ksp = (${co})${d.x > 1 ? '²' : ''}(${an})${d.y > 1 ? '²' : ''} = ${d.x ** d.x * d.y ** d.y === 1 ? '' : d.x ** d.x * d.y ** d.y}s${d.x + d.y > 2 ? '³' : '²'} = ${sci(d.k)}</li><li>s = <b>${sci(s)} M</b></li>`;
    const ls = Object.values(KSP).map(solub), lo = Math.log10(Math.min(...ls)), hi = Math.log10(Math.max(...ls));
    $('#kpB', el).innerHTML = Object.entries(KSP).map(([k, v]) => { const sv = solub(v); return `<div class="${k === cur ? 'on' : ''}"><span>${v.n}（Ksp ${sci(v.k, 1)}）</span><i class="ba" style="width:${8 + 92 * (Math.log10(sv) - lo) / (hi - lo)}%"></i><b class="mono">${sci(sv, 1)} M</b></div>`; }).join('');
    $('#kpN', el).innerHTML = cur === 'Ag2CrO4' ? '注意：Ag₂CrO₄ 的 Ksp（1.1 × 10⁻¹²）比 AgCl（1.8 × 10⁻¹⁰）小，但溶解度反而<b>比較大</b>。因為 Ksp 的式子次方不同（s³ 對 s²），<b>只有化學式類型相同的鹽才能直接用 Ksp 比較溶解度</b>。'
      : `${d.n}：Ksp 是飽和溶液中離子濃度乘積（各取係數次方），固體不寫入。${d.x + d.y === 2 ? '1:1 型的鹽 s = √Ksp。' : `${d.x}:${d.y} 型的鹽 Ksp = 4s³，s = ∛(Ksp/4)。`} 鹵化銀的溶解度 AgCl > AgBr > AgI，這是用沉澱顏色（白、淡黃、黃）鑑定鹵離子的基礎。`;
    pressSeg(el, 'kpS', cur);
  }
  bindSeg(el, 'kpS', v => { cur = v; draw(); });
  draw();
  return { set(s) { cur = s.salt || cur; draw(); } };
};

/* ===== 2. 同離子效應 ===== */
W.commonion = el => {
  let c = 0.01; const K = KSP.AgCl.k;
  el.innerHTML = `<p class="eq">AgCl(s) ⇌ Ag⁺ + Cl⁻　　加入 NaCl（提供額外的 Cl⁻）</p><div class="w-row"><label class="rng">加入的 [Cl⁻]（M）<input type="range" id="ciC" min="-8" max="0" step="0.1"><output class="mono" id="ciO"></output></label></div><div id="ciG"></div><div class="cards" id="ciK"></div><p class="note" id="ciN"></p>`;
  const s = cl => (-cl + Math.sqrt(cl * cl + 4 * K)) / 2;
  function draw() {
    const xs = Array.from({ length: 81 }, (_, i) => -8 + i * 0.1), v = s(c);
    $('#ciG', el).innerHTML = chart({ x: [-8, 0], y: [-11, -4], xt: [-8, -6, -4, -2, 0], yt: [-10, -8, -6, -4], xlab: 'log 加入的 [Cl⁻]', ylab: 'log 溶解度 s', h: 220, label: '同離子效應' }, (X, Y) => `<path class="tline" d="${path(xs.map(x => [X(x), Y(Math.log10(s(10 ** x)))]))}"/><circle class="dot" cx="${X(Math.log10(c))}" cy="${Y(Math.log10(v))}" r="7"/><line class="mk" x1="${X(-8)}" x2="${X(0)}" y1="${Y(Math.log10(Math.sqrt(K)))}" y2="${Y(Math.log10(Math.sqrt(K)))}"/><text class="tk" x="${X(-7.9)}" y="${Y(Math.log10(Math.sqrt(K))) - 6}">純水中 1.3 × 10⁻⁵ M</text>`);
    $('#ciK', el).innerHTML = card('s', 'AgCl 溶解度', `${sci(v)} M`) + card('r', '是純水中的', `${sci(v / Math.sqrt(K), 2)} 倍`);
    $('#ciN', el).innerHTML = `溶液中已經有 Cl⁻，Ksp = [Ag⁺][Cl⁻] 要維持不變，能溶解的 Ag⁺ 就變少：勒沙特列原理。當加入的 Cl⁻ 遠大於 s 時，s ≈ Ksp ÷ [Cl⁻] = ${sci(K / c)} M。這就是為什麼鹵化銀沉澱要用含同離子的溶液清洗，損失較少。`;
    $('#ciC', el).value = Math.log10(c); $('#ciO', el).textContent = sci(c, 1);
  }
  $('#ciC', el).oninput = e => { c = 10 ** +e.target.value; draw(); };
  draw();
  return { set(st) { c = st.c ?? c; draw(); } };
};

/* ===== 3. 會不會沉澱：比較 Q 與 Ksp ===== */
W.precip = el => {
  const st = { ca: 1e-4, va: 50, cb: 1e-4, vb: 50 }, K = KSP.AgCl.k;
  el.innerHTML = `<p class="eq">AgNO₃ 溶液 + NaCl 溶液 → 混合後是否生成 AgCl 沉澱？</p><div class="w-row"><label class="rng">[AgNO₃]（M）<input type="range" id="ppA" min="-7" max="-1" step="0.1"><output class="mono" id="ppAo"></output></label><label class="rng">[NaCl]（M）<input type="range" id="ppB" min="-7" max="-1" step="0.1"><output class="mono" id="ppBo"></output></label></div><ol class="cs" id="ppC"></ol><p class="note" id="ppN"></p>`;
  function draw() {
    const V = st.va + st.vb, ag = st.ca * st.va / V, cl = st.cb * st.vb / V, Q = ag * cl, ppt = Q > K;
    $('#ppC', el).innerHTML = `<li>混合後體積加倍，濃度各減半：[Ag⁺] = ${sci(ag)} M、[Cl⁻] = ${sci(cl)} M</li><li>Q = [Ag⁺][Cl⁻] = ${sci(Q)}</li><li>Ksp(AgCl) = ${sci(K)}　→　Q ${ppt ? '&gt;' : '≤'} Ksp</li>`;
    $('#ppN', el).innerHTML = ppt ? `<span class="bad">會沉澱</span>：離子濃度乘積超過 Ksp，溶液過飽和，AgCl 會析出，直到剩下的離子濃度乘積降回 Ksp。` : `<span class="ok">不會沉澱</span>：Q 還沒達到 Ksp，溶液未飽和，離子都留在溶液中。`;
    $('#ppA', el).value = Math.log10(st.ca); $('#ppB', el).value = Math.log10(st.cb); $('#ppAo', el).textContent = sci(st.ca, 1); $('#ppBo', el).textContent = sci(st.cb, 1);
  }
  $('#ppA', el).oninput = e => { st.ca = 10 ** +e.target.value; draw(); };
  $('#ppB', el).oninput = e => { st.cb = 10 ** +e.target.value; draw(); };
  draw();
  return { set(s) { Object.assign(st, s); draw(); } };
};
