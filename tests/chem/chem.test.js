// 後中化學：酸鹼計算引擎對照教科書典型值（0.100 M 醋酸 25.0 mL，以 0.100 M NaOH 滴定）
const fs = require('fs'), path = require('path');
const src = ['ui.js', 'chem.js'].map(f => fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'chem', f), 'utf8')).join('\n').replace(/^const \$ = .*$/m, '');
const { titr, buffer, water } = new Function(src + '; return { titr, buffer, water };')();
let bad = 0;
const near = (name, got, want, tol = 0.015) => { const ok = Math.abs(got - want) <= tol; if (!ok) bad++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${got.toFixed(3)}（應為 ${want}）`); };
near('起點 pH', titr({ Vb: 0 }).pH, 2.87);
near('10.0 mL pH（緩衝）', titr({ Vb: 10 }).pH, 4.56);
near('半當量點 pH = pKa', titr({ Vb: 12.5 }).pH, 4.74);
near('當量點 pH', titr({ Vb: 25 }).pH, 8.72);
near('30.0 mL pH（鹼過量）', titr({ Vb: 30 }).pH, 11.96);
near('強酸起點 pH', titr({ Vb: 0, strong: true }).pH, 1.00);
near('強酸當量點 pH', titr({ Vb: 25, strong: true }).pH, 7.00);
near('練習題：20.0 mL 醋酸 + 15.0 mL NaOH', titr({ Va: 20, Vb: 15 }).pH, 5.22);
near('1:1 緩衝 pH', buffer({}).pH, 4.74);
near('緩衝 + 1 mmol HCl', buffer({ addH: 1 }).pH, 4.65);
near('純水 + 1 mmol HCl（100 mL）', water({ addH: 1 }).pH, 2.00);
console.log(bad ? `${bad} 項不符` : '全部通過'); process.exit(bad ? 1 : 0);
