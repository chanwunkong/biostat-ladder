/* ---------- 後中化學：化學動力學的互動圖 ---------- */

/* ===== 1. 初速率法：自己做實驗找出反應級數 ===== */
W.ratelaw = el => {
  const RX = {
    no: { n: '2NO + O₂ → 2NO₂', A: 'NO', B: 'O₂', m: 2, n2: 1 },
    sn1: { n: '(CH₃)₃CBr + OH⁻ → (CH₃)₃COH + Br⁻', A: '(CH₃)₃CBr', B: 'OH⁻', m: 1, n2: 0 },
    sn2: { n: 'CH₃Br + OH⁻ → CH₃OH + Br⁻', A: 'CH₃Br', B: 'OH⁻', m: 1, n2: 1 },
  };
  let cur = 'no', A = 0.1, B = 0.1, rows = [], gm = null, gn = null;
  el.innerHTML = `${seg('rlS', Object.entries(RX).map(([k, v]) => [k, v.n]), cur)}<div class="w-row" id="rlC"></div><div class="w-row"><button class="btn sm pri" type="button" id="rlGo">做實驗：量初速率</button><button class="btn sm ghost" type="button" id="rlR">清除紀錄</button></div><div id="rlT"></div><div class="w-row" id="rlG"></div><p class="note" id="rlN"></p>`;
  const rate = (a, b) => { const r = RX[cur]; return a ** r.m * b ** r.n2; };
  function draw() {
    const r = RX[cur];
    $('#rlC', el).innerHTML = [['A', r.A, A], ['B', r.B, B]].map(([k, lab, v]) => `<span class="small">[${lab}] = <b class="mono">${fx(v, 2)}</b> M</span><button class="btn sm" type="button" data-c="${k}" data-f="0.5">÷2</button><button class="btn sm" type="button" data-c="${k}" data-f="2">×2</button><span class="sp"></span>`).join('');
    $$('[data-c]', el).forEach(b => { b.onclick = () => { const f = +b.dataset.f; if (b.dataset.c === 'A') A = clamp(A * f, 0.0125, 0.8); else B = clamp(B * f, 0.0125, 0.8); draw(); }; });
    const r0 = rows[0];
    $('#rlT', el).innerHTML = rows.length ? `<table class="tbl"><thead><tr><th>實驗</th><th>[${r.A}]（M）</th><th>[${r.B}]（M）</th><th>初速率（相對）</th></tr></thead><tbody>${rows.map((x, i) => `<tr><td>${i + 1}</td><td>${fx(x.a, 3)}</td><td>${fx(x.b, 3)}</td><td class="mono">${fx(x.r / r0.r, 2)}</td></tr>`).join('')}</tbody></table>` : '<p class="small mut">還沒有實驗紀錄。調整濃度後按「做實驗」。技巧：每次只改變一種反應物的濃度。</p>';
    $('#rlG', el).innerHTML = `<span class="small">你的猜測：rate = k[${r.A}]</span>${[0, 1, 2].map(v => `<button class="btn sm${gm === v ? ' pri' : ''}" type="button" data-gm="${v}">${v}</button>`).join('')}<span class="small">[${r.B}]</span>${[0, 1, 2].map(v => `<button class="btn sm${gn === v ? ' pri' : ''}" type="button" data-gn="${v}">${v}</button>`).join('')}`;
    $$('[data-gm]', el).forEach(b => { b.onclick = () => { gm = +b.dataset.gm; draw(); }; });
    $$('[data-gn]', el).forEach(b => { b.onclick = () => { gn = +b.dataset.gn; draw(); }; });
    let msg = '先做至少三次實驗：一次當基準，一次只把第一種反應物加倍，一次只把第二種加倍。';
    if (gm != null && gn != null) msg = gm === r.m && gn === r.n2 ? `<span class="ok">✓ 正確</span>：rate = k[${r.A}]${r.m > 1 ? `<sup>${r.m}</sup>` : r.m ? '' : '⁰'}[${r.B}]${r.n2 > 1 ? `<sup>${r.n2}</sup>` : r.n2 ? '' : '⁰'}，總級數 ${r.m + r.n2}。${cur === 'sn1' ? '速率和 OH⁻ 無關：這正是 SN1，最慢的一步只有鹵烷參與。' : cur === 'sn2' ? '兩者都是一級：SN2 的過渡狀態同時包含兩者。' : '注意級數不等於方程式的係數也可以；這裡剛好相同，但必須由實驗決定。'}`
      : `<span class="bad">還不對</span>。找兩次「只有 [${r.A}] 不同」的實驗：濃度變 2 倍時速率變幾倍？2¹ = 2 → 一級；2² = 4 → 二級；不變 → 零級。`;
    $('#rlN', el).innerHTML = msg; pressSeg(el, 'rlS', cur);
  }
  bindSeg(el, 'rlS', v => { cur = v; rows = []; gm = gn = null; A = B = 0.1; draw(); });
  $('#rlGo', el).onclick = () => { rows.push({ a: A, b: B, r: rate(A, B) }); if (rows.length > 8) rows.shift(); draw(); };
  $('#rlR', el).onclick = () => { rows = []; draw(); };
  draw();
  return { set(s) { if (s.rx) { cur = s.rx; rows = []; } (s.rows || []).forEach(([a, b]) => rows.push({ a, b, r: rate(a, b) })); gm = s.gm ?? gm; gn = s.gn ?? gn; draw(); } };
};

/* ===== 2. 積分速率式：哪一種圖是直線 ===== */
W.order = el => {
  const st = { n: 1, k: 0.2 }, A0 = 1, T = 20;
  el.innerHTML = `${seg('orS', [['0', '零級'], ['1', '一級'], ['2', '二級']], '1')}<div class="w-row"><label class="rng">速率常數 k <input type="range" id="ork" min="0.02" max="0.5" step="0.01"><output class="mono" id="oro"></output></label></div><div class="og" id="orG"></div><div class="cards" id="orK"></div><p class="note" id="orN"></p>`;
  const Af = t => st.n === 0 ? Math.max(1e-4, A0 - st.k * t * 0.1) : st.n === 1 ? A0 * Math.exp(-st.k * t) : 1 / (1 / A0 + st.k * t);
  function draw() {
    const ts = Array.from({ length: 101 }, (_, i) => i * T / 100), k = st.n === 0 ? st.k * 0.1 : st.k;
    const half = st.n === 0 ? A0 / (2 * k) : st.n === 1 ? Math.LN2 / k : 1 / (k * A0);
    const hs = []; let a = A0, t = 0; for (let i = 0; i < 4; i++) { const h = st.n === 0 ? a / (2 * k) : st.n === 1 ? Math.LN2 / k : 1 / (k * a); t += h; a /= 2; if (t > T) break; hs.push([t, h]); }
    const plots = [['[A]', v => v, [0, 1], '[A] 對時間'], ['ln[A]', v => Math.log(v), [-5, 0], 'ln[A] 對時間'], ['1/[A]', v => 1 / v, [0, 12], '1/[A] 對時間']];
    $('#orG', el).innerHTML = plots.map(([lab, f, yr, ttl], i) => {
      const straight = i === st.n;
      return `<div class="${straight ? 'og-on' : ''}"><p class="lbl">${ttl}${straight ? '　← 直線' : ''}</p>${chart({ x: [0, T], y: yr, xt: [0, 10, 20], yt: yr, xlab: '時間', ylab: lab, h: 190, w: 300 }, (X, Y) => `<path class="${straight ? 'tline' : 'tline2'}" d="${path(ts.map(t => [X(t), Y(clamp(f(Af(t)), yr[0], yr[1]))]))}"/>${i === 0 ? hs.map(([tt]) => `<line class="mk" x1="${X(tt)}" x2="${X(tt)}" y1="${Y(0)}" y2="${Y(1)}"/>`).join('') : ''}`)}</div>`;
    }).join('');
    $('#orK', el).innerHTML = card('h', '第一個半生期', fx(half, 2)) + card('h2', '連續半生期', hs.map(h => fx(h[1], 1)).join('、') || '—');
    $('#orN', el).innerHTML = [
      `<b>零級</b>：rate = k，速率和濃度無關，[A] 隨時間<b>直線</b>下降：[A] = [A]₀ − kt。半生期 t½ = [A]₀ ÷ 2k，濃度越低半生期越短。常見於酵素飽和、表面催化。`,
      `<b>一級</b>：rate = k[A]，<b>ln[A] 對時間是直線</b>，斜率 −k：ln[A] = ln[A]₀ − kt。半生期 <b>t½ = 0.693 ÷ k</b>，和起始濃度無關，所以連續的半生期都一樣長（左圖的虛線等間隔）。放射性衰變、多數藥物排除都是一級。`,
      `<b>二級</b>：rate = k[A]²，<b>1/[A] 對時間是直線</b>，斜率 k：1/[A] = 1/[A]₀ + kt。半生期 t½ = 1 ÷ (k[A]₀)，濃度越低半生期越長。`][st.n] + ' 判斷級數的方法：把數據畫成三種圖，哪一種是直線，就是幾級。';
    $('#oro', el).textContent = fx(st.k); $('#ork', el).value = st.k; pressSeg(el, 'orS', String(st.n));
  }
  bindSeg(el, 'orS', v => { st.n = +v; draw(); });
  $('#ork', el).oninput = e => { st.k = +e.target.value; draw(); };
  draw();
  return { set(s) { if (s.n != null) st.n = s.n; draw(); } };
};

/* ===== 3. 活化能與溫度：能量分佈的尾巴 ===== */
W.arrh = el => {
  const st = { T: 298, Ea: 50, cat: false };
  el.innerHTML = `<div class="w-row"><label class="rng">溫度（K）<input type="range" id="arT" min="250" max="450" step="1"><output class="mono" id="arTo"></output></label><label class="rng">活化能 Ea（kJ/mol）<input type="range" id="arE" min="10" max="120" step="1"><output class="mono" id="arEo"></output></label></div><label class="chk"><input type="checkbox" id="arC"> 加入催化劑（活化能降低 30 kJ/mol）</label><div class="bgrid"><div id="arD"></div><div id="arP"></div></div><div class="cards" id="arK"></div><p class="note" id="arN"></p>`;
  const R = 8.314e-3, dens = (E, T) => 2 / Math.sqrt(Math.PI) * (R * T) ** -1.5 * Math.sqrt(E) * Math.exp(-E / (R * T));
  function draw() {
    const Ea = Math.max(5, st.Ea - (st.cat ? 30 : 0)), Emax = 140, es = Array.from({ length: 141 }, (_, i) => i * Emax / 140 + 0.01);
    const lg = v => Math.max(-14, Math.log10(v));
    $('#arD', el).innerHTML = chart({ x: [0, Emax], y: [-14, 0], xt: [0, 20, 40, 60, 80, 100, 120, 140], yt: [-12, -8, -4, 0], xlab: '分子的動能（kJ/mol）', ylab: '分子比例（對數刻度）', h: 230, label: '能量分佈' }, (X, Y) =>
      `<path class="area" d="${path([[X(Ea), Y(-14)], ...es.filter(e => e >= Ea).map(e => [X(e), Y(lg(dens(e, st.T)))]), [X(Emax), Y(-14)]])}Z"/><path class="tline2" d="${path(es.map(e => [X(e), Y(lg(dens(e, 298)))]))}"/><path class="tline" d="${path(es.map(e => [X(e), Y(lg(dens(e, st.T)))]))}"/><line class="cur" x1="${X(Ea)}" x2="${X(Ea)}" y1="${Y(-14)}" y2="${Y(0)}"/><text class="tk" x="${X(Ea) + 4}" y="${Y(-1)}">Ea</text><text class="tk" x="${X(Emax) - 4}" y="${Y(-0.6)}" text-anchor="end">藍：${st.T} K　灰虛線：298 K</text>`);
    $('#arP', el).innerHTML = energySVG([[0, 0.3], [0.5, Math.min(0.97, 0.3 + st.Ea / 180)], [1, 0.12]], null, { labels: [[0.5, `Ea = ${st.Ea}${st.cat ? '（綠：有催化劑）' : ''}`]], alt: st.cat ? [[0, 0.3], [0.5, Math.min(0.97, 0.3 + Ea / 180)], [1, 0.12]] : null }) + '<p class="small mut c">反應能量圖</p>';
    const f = Math.exp(-Ea / (R * st.T)), f0 = Math.exp(-st.Ea / (R * 298)), ratio = f / f0, r10 = Math.exp(Ea / R * (1 / st.T - 1 / (st.T + 10)));
    $('#arK', el).innerHTML = card('f', '能越過 Ea 的比例 ≈ e<sup>−Ea/RT</sup>', sci(f)) + card('r', '速率是 298 K 無催化劑的', `${ratio >= 100 ? sci(ratio, 1) : fx(ratio, 2)} 倍`) + card('r10', '再升溫 10 K，速率變為', `${fx(r10, 2)} 倍`);
    $('#arN', el).innerHTML = `阿瑞尼斯方程式 k = A e<sup>−Ea/RT</sup>：只有能量超過 Ea 的碰撞才能反應。這些分子在分佈的<b>尾巴</b>上，所以溫度稍微升高，尾巴就抬高很多（縱軸是對數刻度）。Ea = ${Ea} kJ/mol 時，在 ${st.T} K 每升溫 10 K，速率約變為 ${fx(r10, 1)} 倍。${st.cat ? '催化劑提供另一條活化能較低的路徑，速率大增；但它同時加快正逆反應，<b>不改變平衡常數</b>。' : ''}`;
    $('#arTo', el).textContent = st.T; $('#arEo', el).textContent = st.Ea; $('#arT', el).value = st.T; $('#arE', el).value = st.Ea; $('#arC', el).checked = st.cat;
  }
  $('#arT', el).oninput = e => { st.T = +e.target.value; draw(); };
  $('#arE', el).oninput = e => { st.Ea = +e.target.value; draw(); };
  $('#arC', el).onchange = e => { st.cat = e.target.checked; draw(); };
  draw();
  return { set(s) { Object.assign(st, s); draw(); } };
};

/* ===== 4. 多步驟反應：速率決定步驟 ===== */
W.rds = el => {
  const st = { h1: 0.85, h2: 0.65 };
  el.innerHTML = `<p class="eq">步驟 1：A ⇌ I（中間物）　　步驟 2：I + B → P</p><div class="w-row"><label class="rng">過渡狀態 1 的高度 <input type="range" id="rd1" min="0.62" max="0.95" step="0.01"></label><label class="rng">過渡狀態 2 的高度 <input type="range" id="rd2" min="0.62" max="0.95" step="0.01"></label></div><div class="bgrid"><div id="rdE"></div><div><div class="verdict" id="rdV"></div></div></div><p class="note" id="rdN"></p>`;
  function draw() {
    const one = st.h1 >= st.h2;
    $('#rdE', el).innerHTML = energySVG([[0, 0.3], [0.25, st.h1], [0.5, 0.55], [0.75, st.h2], [1, 0.1]], null, { labels: [[0.25, '過渡狀態 1'], [0.5, '中間物 I', 14], [0.75, '過渡狀態 2']], w: 320, h: 170 });
    $('#rdV', el).innerHTML = `<span class="lbl">速率決定步驟</span><b class="big">步驟 ${one ? 1 : 2}</b><span class="lbl">速率式</span><b>${one ? 'rate = k₁[A]' : 'rate = k₂K₁[A][B]'}</b>`;
    $('#rdN', el).innerHTML = one ? '過渡狀態 1 最高，第一步最慢：中間物一生成就被很快消耗，整體速率由第一步決定，<b>只和 A 有關</b>，B 的濃度不影響速率。SN1 就是這種情況（RX 先解離，親核基再快速加上）。'
      : '過渡狀態 2 最高，第二步最慢：第一步很快達到平衡（[I] = K₁[A]），整體速率 = k₂[I][B] = k₂K₁[A][B]，<b>A 和 B 都出現在速率式中</b>。快速平衡之後的慢步驟，速率式會包含它之前所有步驟的反應物。';
    $('#rd1', el).value = st.h1; $('#rd2', el).value = st.h2;
  }
  $('#rd1', el).oninput = e => { st.h1 = +e.target.value; draw(); };
  $('#rd2', el).oninput = e => { st.h2 = +e.target.value; draw(); };
  draw();
  return { set(s) { Object.assign(st, s); draw(); } };
};
