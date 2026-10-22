/* ---------- 後中化學：酸鹼平衡計算引擎 ----------
   不用近似：直接解電荷平衡 [H⁺] + [Na⁺] = [OH⁻] + [A⁻] + [Cl⁻]，其中 [A⁻] = C·Ka/(Ka + [H⁺])（強酸則 [A⁻] = C）。
   左邊減右邊隨 [H⁺] 單調遞增，所以在 log[H⁺] 上二分法一定收斂。濃度 M、體積 mL、量 mmol。 */
const KW = 1e-14;
function solveH({ Ca = 0, Ka = 1e-5, strong = false, Na = 0, Cl = 0 }) {
  const f = h => h + Na - KW / h - (strong ? Ca : Ca * Ka / (Ka + h)) - Cl;
  let lo = -15, hi = 1.5;
  for (let i = 0; i < 90; i++) { const m = (lo + hi) / 2; if (f(10 ** m) > 0) hi = m; else lo = m; }
  return 10 ** ((lo + hi) / 2);
}
const ACID = {
  weak: { name: '醋酸 CH₃COOH', short: 'HA', pKa: 4.74, strong: false },
  strong: { name: '鹽酸 HCl', short: 'HCl', pKa: -7, strong: true },
};
// 滴定：Va mL 的 Ca0 M 酸，加入 Vb mL 的 Cb M NaOH
function titr({ Va = 25, Ca0 = 0.1, Cb = 0.1, Vb = 0, pKa = 4.74, strong = false }) {
  const V = Va + Vb, Ca = Ca0 * Va / V, Na = Cb * Vb / V, Ka = 10 ** -pKa, h = solveH({ Ca, Ka, strong, Na });
  const fHA = strong ? 0 : h / (Ka + h);
  return { V, h, pH: -Math.log10(h), nHA: Ca * V * fHA, nA: Ca * V * (1 - fHA), nOH: KW / h * V, nH: h * V, nNa: Cb * Vb, Veq: Ca0 * Va / Cb };
}
// 緩衝溶液：V mL 中各含 C M 的 HA 與 NaA，再加入 addH mmol 強酸或 addOH mmol 強鹼（以濃溶液加入，體積變化忽略）
function buffer({ C = 0.1, V = 100, pKa = 4.74, addH = 0, addOH = 0 }) {
  const Ka = 10 ** -pKa, h = solveH({ Ca: 2 * C, Ka, Na: (C * V + addOH) / V, Cl: addH / V }), f = h / (Ka + h);
  return { pH: -Math.log10(h), nHA: 2 * C * V * f, nA: 2 * C * V * (1 - f) };
}
function water({ V = 100, addH = 0, addOH = 0 }) { const h = solveH({ Ca: 0, Na: addOH / V, Cl: addH / V }); return { pH: -Math.log10(h) }; }
// 指示劑：變色範圍與兩端顏色（低 pH → 高 pH）
const IND = {
  none: { name: '不加指示劑' },
  pp: { name: '酚酞', lo: 8.2, hi: 10.0, c0: [248, 246, 240], c1: [214, 51, 132], txt: '無色 → 粉紅' },
  mo: { name: '甲基橙', lo: 3.1, hi: 4.4, c0: [214, 60, 50], c1: [240, 196, 60], txt: '紅 → 黃' },
  btb: { name: '溴瑞香草酚藍', lo: 6.0, hi: 7.6, c0: [226, 200, 60], c1: [52, 104, 196], txt: '黃 → 藍' },
};
function indColor(key, pH) {
  const d = IND[key]; if (!d || !d.c0) return 'var(--water)';
  const t = clamp((pH - d.lo) / (d.hi - d.lo), 0, 1), c = d.c0.map((v, i) => Math.round(v + (d.c1[i] - v) * t));
  return `rgb(${c.join(',')})`;
}
