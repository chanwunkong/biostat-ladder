/* ---------- 後中化學：烯烴與炔烴的互動圖 ---------- */

/* ===== 1. 丙烯 + HBr：兩條路徑比較（馬可尼可夫規則） ===== */
W.hbr = el => {
  let path2 = 'M', pl;
  el.innerHTML = `${seg('hbS', [['M', 'H 加到 CH₂（生成二級碳陽離子）'], ['A', 'H 加到 CH（生成一級碳陽離子）']], path2)}<div id="hbP"></div>`;
  const frames = () => {
    const M = path2 === 'M';
    const base = { C1: { x: -0.65, y: 0, t: 'CH₂' }, C2: { x: 0.65, y: 0, t: 'CH' }, C3: { x: 1.75, y: -0.65, t: 'CH₃' } };
    const hx = M ? -0.65 : 0.65;
    const F0 = { atoms: { ...base, H: { x: hx, y: 1.55, t: 'H' }, Br: { x: hx, y: 2.75, t: 'Br', lp: [0, 90, 180] } }, bonds: [['C1', 'C2', 'd'], ['C2', 'C3', 's'], ['H', 'Br', 's']],
      arrows: [{ f: { b: ['C1', 'C2'] }, t: { a: 'H' }, bend: M ? 0.5 : -0.5 }, { f: { b: ['H', 'Br'] }, t: { a: 'Br' }, bend: -0.8 }], notes: [{ x: 0, y: -1.6, t: '丙烯 + HBr' }] };
    const cat = M ? { C1: { ...base.C1, t: 'CH₃' }, C2: { ...base.C2, c: '+' } } : { C1: { ...base.C1, c: '+' }, C2: { ...base.C2, t: 'CH₂' } };
    const bx = M ? 1.55 : -1.55;
    const F1 = { atoms: { ...base, ...cat, H: { x: hx, y: 1.05, t: 'H', hide: true }, Br: { x: bx, y: 1.9, t: 'Br', c: '−', lp: [0, 90, 180, 270] } }, bonds: [['C1', 'C2', 's'], ['C2', 'C3', 's']],
      arrows: [{ f: { lp: ['Br', M ? 270 : 270] }, t: { a: M ? 'C2' : 'C1' }, bend: M ? 0.3 : -0.3 }], notes: [{ x: 0, y: -1.6, t: M ? '二級碳陽離子（較穩定）' : '一級碳陽離子（很不穩定）' }] };
    const F2 = { atoms: { ...base, ...cat, C1: { ...cat.C1, c: '' }, C2: { ...cat.C2, c: '' }, H: { x: hx, y: 1.05, t: 'H', hide: true }, Br: { x: M ? 0.65 : -0.65, y: 1.25, t: 'Br', lp: [0, 90, 180] } }, bonds: [['C1', 'C2', 's'], ['C2', 'C3', 's'], [M ? 'C2' : 'C1', 'Br', 's']], notes: [{ x: 0, y: -1.6, t: M ? '2-溴丙烷（主產物）' : '1-溴丙烷（幾乎不生成）' }] };
    return [
      { sc: F0, at: 0, cap: 'C=C 的 π 電子是分子裡最容易被拿到的電子。它們去攻擊 HBr 上帶部分正電的 H（親電子），同時 H–Br 的電子對移到 Br 上。' },
      { sc: F1, at: 0.42, cap: M ? 'H 加到 CH₂ 上，正電荷留在中間的碳：<b>二級碳陽離子</b>，兩邊各有一個碳幫忙穩定（超共軛）。這一步最慢，但過渡狀態比另一條路低。' : 'H 加到中間的 CH 上，正電荷落在末端：<b>一級碳陽離子</b>，只有一個碳相鄰，很不穩定。這條路的過渡狀態高得多（看綠色虛線比較）。' },
      { sc: F2, at: 1, cap: M ? 'Br⁻ 很快加到碳陽離子上，得到 2-溴丙烷。<b>馬可尼可夫規則</b>：H 加到原本 H 較多的碳上——真正的原因是這樣會生成較穩定的碳陽離子。' : '理論上會得到 1-溴丙烷，但因為一級碳陽離子太難生成，實際上幾乎不走這條路。' }];
  };
  const prof = { M: [[0, 0.35], [0.22, 0.78], [0.42, 0.55], [0.6, 0.6], [1, 0.12]], A: [[0, 0.35], [0.22, 0.95], [0.42, 0.78], [0.6, 0.82], [1, 0.14]] };
  pl = mechPlayer($('#hbP', el), { frames, energy: () => ({ pts: prof[path2], alt: prof[path2 === 'M' ? 'A' : 'M'], labels: [[0.42, path2 === 'M' ? '二級碳陽離子' : '一級碳陽離子', 14]] }), w: 460, h: 290, s: 54, cy: 190, label: 'HBr 加成' });
  bindSeg(el, 'hbS', v => { path2 = v; pressSeg(el, 'hbS', v); pl.reset(); });
  return { set(s) { if (s.path) { path2 = s.path; pressSeg(el, 'hbS', path2); pl.reset(); } pl.go(s.step || 0, false); } };
};

/* ===== 2. 碳陽離子重排：1,2-氫移位 ===== */
W.shift = el => {
  el.innerHTML = '<div id="shP"></div>';
  const frames = () => {
    const base = { C1: { x: -1.95, y: 0, t: 'CH₃' }, C2: { x: -0.65, y: 0, t: 'CH', c: '+' }, C3: { x: 0.65, y: 0, t: 'C' }, H3: { x: 0.65, y: 1.05, t: 'H', hl: 1 }, M1: { x: 1.4, y: -0.9, t: 'CH₃' }, M2: { x: 1.9, y: 0.35, t: 'CH₃' } };
    const bonds = [['C1', 'C2', 's'], ['C2', 'C3', 's'], ['C3', 'M1', 's'], ['C3', 'M2', 's']];
    const F0 = { atoms: base, bonds: [...bonds, ['C3', 'H3', 's']], arrows: [{ f: { b: ['C3', 'H3'] }, t: { a: 'C2' }, bend: 0.5 }], notes: [{ x: 0, y: -1.7, t: '3-甲基-1-丁烯 + H⁺ → 二級碳陽離子' }] };
    const F1 = { atoms: { ...base, C2: { ...base.C2, t: 'CH', c: '' }, C3: { ...base.C3, c: '+' }, H3: { x: -0.65, y: 1.05, t: 'H', hl: 1 }, Br: { x: 0.5, y: 2.1, t: 'Br', c: '−', lp: [0, 90, 180, 270] } }, bonds: [...bonds, ['C2', 'H3', 's']], arrows: [{ f: { lp: ['Br', 270] }, t: { a: 'C3' }, bend: 0.2 }], notes: [{ x: 0, y: -1.7, t: '三級碳陽離子（更穩定）' }] };
    const F2 = { atoms: { ...F1.atoms, C3: { ...base.C3, c: '' }, Br: { x: 0.65, y: 1.2, t: 'Br', lp: [0, 90, 180] } }, bonds: [...bonds, ['C2', 'H3', 's'], ['C3', 'Br', 's']], notes: [{ x: 0, y: -1.7, t: '2-溴-2-甲基丁烷（主產物）' }] };
    return [
      { sc: F0, cap: 'H⁺ 先加到末端，生成<b>二級</b>碳陽離子。但隔壁的碳是三級的：它上面的 H 可以<b>帶著 C–H 鍵的兩個電子</b>（氫負離子）移過來。' },
      { sc: F1, cap: '<b>1,2-氫移位</b>完成：正電荷移到三級碳上，更穩定。碳陽離子只要能變得更穩定，就會重排（也可能是甲基移位）。' },
      { sc: F2, cap: 'Br⁻ 加到三級碳上。主產物是 2-溴-2-甲基丁烷，而不是直接加成的 2-溴-3-甲基丁烷。<b>凡是經過碳陽離子的反應（SN1、E1、HX 加成、酸催化水合）都要檢查會不會重排。</b>' }];
  };
  const pl = mechPlayer($('#shP', el), { frames, w: 460, h: 230, s: 54, label: '碳陽離子重排' });
  return { set(s) { pl.go(s.step || 0, false); } };
};

/* ===== 3. 溴的加成：溴鎓離子與反式加成 ===== */
W.brom = el => {
  el.innerHTML = '<div id="brP"></div>';
  const frames = () => {
    const sub = (dy1, dy2) => ({ R1: { x: -1.6, y: 0.35 + dy1, t: 'R' }, H1: { x: -1.45, y: -0.55 + dy1, t: 'H' }, R2: { x: 1.6, y: 0.35 + dy2, t: 'R' }, H2: { x: 1.45, y: -0.55 + dy2, t: 'H' } });
    const sb = [['C1', 'R1', 's'], ['C1', 'H1', 's'], ['C2', 'R2', 's'], ['C2', 'H2', 's']];
    const F0 = { atoms: { C1: { x: -0.65, y: 0, t: 'C' }, C2: { x: 0.65, y: 0, t: 'C' }, ...sub(0, 0), Ba: { x: 0, y: 1.45, t: 'Br', lp: [0, 180] }, Bb: { x: 0, y: 2.7, t: 'Br', lp: [0, 90, 180] } }, bonds: [['C1', 'C2', 'd'], ['Ba', 'Bb', 's'], ...sb], arrows: [{ f: { b: ['C1', 'C2'] }, t: { a: 'Ba' }, bend: -0.3 }, { f: { b: ['Ba', 'Bb'] }, t: { a: 'Bb' }, bend: 0.8 }], notes: [{ x: 0, y: -1.6, t: 'R 代表環或其他碳鏈' }] };
    const F1 = { atoms: { C1: { x: -0.65, y: 0, t: 'C' }, C2: { x: 0.65, y: 0, t: 'C' }, ...sub(0, 0), Ba: { x: 0, y: 1.05, t: 'Br', c: '+', lp: [90] }, Bb: { x: 0.95, y: -1.75, t: 'Br', c: '−', lp: [0, 180, 270, 90] } }, bonds: [['C1', 'C2', 's'], ['Ba', 'C1', 's'], ['Ba', 'C2', 's'], ...sb], arrows: [{ f: { lp: ['Bb', 90] }, t: { a: 'C2' }, bend: 0.25 }, { f: { b: ['Ba', 'C2'] }, t: { a: 'Ba' }, bend: -0.6 }], notes: [{ x: -1.9, y: -1.6, t: '溴鎓離子' }] };
    const F2 = { atoms: { C1: { x: -0.65, y: 0, t: 'C' }, C2: { x: 0.65, y: 0, t: 'C' }, ...sub(-0.15, 0.55), Ba: { x: -0.65, y: 1.25, t: 'Br', lp: [0, 90, 180] }, Bb: { x: 0.65, y: -1.25, t: 'Br', lp: [0, 180, 270] } }, bonds: [['C1', 'C2', 's'], ['Ba', 'C1', 's'], ['Bb', 'C2', 's'], ...sb], notes: [{ x: 0, y: -2.1, t: '一個 Br 在上、一個在下：反式（anti）加成' }] };
    return [
      { sc: F0, cap: 'Br₂ 靠近富含電子的 π 鍵時被極化：靠近的 Br 帶部分正電。π 電子攻擊它，Br–Br 鍵斷開。' },
      { sc: F1, cap: '生成三元環的<b>溴鎓離子</b>（不是開放的碳陽離子），它從上方把雙鍵的一面整個擋住。Br⁻ 只能從<b>下方（背面）</b>進攻，像 SN2 一樣把環打開。' },
      { sc: F2, cap: '結果兩個 Br 分別在雙鍵的兩側：<b>反式加成</b>。環己烯加 Br₂ 只得到 trans-1,2-二溴環己烷。因為沒有自由的碳陽離子，這個反應也<b>不會重排</b>。' }];
  };
  const pl = mechPlayer($('#brP', el), { frames, w: 440, h: 300, s: 54, cy: 175, label: '溴加成機構' });
  return { set(s) { pl.go(s.step || 0, false); } };
};

/* ===== 4. 烯烴加成反應總整理 ===== */
W.addn = el => {
  const R = [
    ['HBr', 'HX', '2-溴丙烷', '馬可尼可夫', '—（經碳陽離子，可能重排）', '碳陽離子'],
    ['H₂O, H₂SO₄（催化）', '酸催化水合', '2-丙醇', '馬可尼可夫', '—（可能重排）', '碳陽離子'],
    ['Br₂', '鹵化', '1,2-二溴丙烷', '—', '反式（anti）', '溴鎓離子'],
    ['Br₂, H₂O', '鹵醇', '1-溴-2-丙醇（OH 在較多取代的碳）', '馬可尼可夫', '反式', '溴鎓離子'],
    ['H₂, Pt／Pd', '氫化', '丙烷', '—', '同側（syn）', '金屬表面'],
    ['① BH₃ ② H₂O₂, NaOH', '硼氫化–氧化', '1-丙醇', '<b>反馬可尼可夫</b>', '同側（syn）', '四中心過渡狀態（無碳陽離子）'],
    ['HBr, ROOR（過氧化物）', '自由基加成', '1-溴丙烷', '<b>反馬可尼可夫</b>', '—', '自由基（較穩定的二級自由基）'],
    ['OsO₄ 或冷稀 KMnO₄', '雙羥基化', '1,2-丙二醇', '—', '同側（syn）', '環狀酯中間物'],
    ['① O₃ ② Zn 或 (CH₃)₂S', '臭氧分解', '乙醛 + 甲醛（雙鍵斷開）', '—', '—', '臭氧化物'],
  ];
  let cur = 0;
  el.innerHTML = `<p class="small mut">以丙烯 CH₂=CH–CH₃ 為例。點一列看重點。</p><div class="tscroll"><table class="tbl sel-tbl" id="adT"><thead><tr><th>試劑</th><th>反應</th><th>產物</th><th>區域選擇</th><th>立體</th><th>關鍵中間物</th></tr></thead><tbody>${R.map((r, i) => `<tr data-i="${i}" tabindex="0"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join('')}</tbody></table></div><p class="note" id="adN"></p>`;
  const WHY = [
    'π 電子攻擊 H⁺，生成較穩定的二級碳陽離子，Br⁻ 再加上去。',
    '和 HBr 同一個道理，只是加上來的是水，再失去 H⁺。這是 E1 的逆反應：加熱、去除水則平衡偏向烯。',
    '經過溴鎓離子，Br⁻ 從背面打開，所以兩個 Br 在相反兩側。',
    '溴鎓離子被大量存在的水打開；水攻擊「比較能承受正電荷」的較多取代碳，所以 OH 在中間的碳。',
    '兩個 H 從金屬表面同一側加上去。',
    'B 加到取代較少的碳（立體較空、B 也偏好那裡），之後 B 被換成 OH，位置與構型不變。結果 OH 在末端：和酸催化水合相反。',
    '過氧化物產生 Br 自由基，Br· 先加到末端，生成較穩定的二級自由基。只有 HBr 有這個效果（HCl、HI 不行）。',
    'OsO₄ 從同一側同時接上兩個 O，所以兩個 OH 在同側。',
    'C=C 完全斷開，每個碳變成 C=O。用產物的羰基位置可以反推原本雙鍵在哪裡。',
  ];
  function draw() { $$('#adT tbody tr', el).forEach((t, i) => t.classList.toggle('on', i === cur)); $('#adN', el).innerHTML = `<b>${R[cur][1]}</b>：${WHY[cur]}`; }
  $$('#adT tbody tr', el).forEach(t => { t.onclick = t.onkeydown = e => { if (e.type === 'keydown' && e.key !== 'Enter') return; cur = +t.dataset.i; draw(); }; });
  draw();
  return { set(s) { cur = s.i ?? cur; draw(); } };
};
