// 立體化學：R/S 的「看方向」規則（H 在虛楔直接看、在楔形反過來）和三維向量計算的構型必須一致；費雪投影對照已知結果
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'chem', 'w', 'stereo.js'), 'utf8').split('/* ===== 1.')[0];
const { TET, POS2, chir, FV } = new Function(src.replace(/^const FV.*$/m, '') + '; const FV = { up: [0, 1, -1], down: [0, -1, -1], left: [-1, 0, 1], right: [1, 0, 1] }; return { TET, POS2, chir, FV };')();
let bad = 0, n = 0;
const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
for (const p of perms(['up', 'right', 'wedge', 'dash'])) {   // p[i] = 優先順序 i+1 的位置
  const low = p[3]; if (low !== 'dash' && low !== 'wedge') continue;
  const truth = chir(TET[p[0]], TET[p[1]], TET[p[2]]);
  const P = p.slice(0, 3).map(k => POS2[k]), area = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]);
  let vis = area < 0 ? 'R' : 'S'; if (low === 'wedge') vis = vis === 'R' ? 'S' : 'R';
  n++; if (vis !== truth) { bad++; console.log('FAIL', p.join(','), 'rule', vis, 'truth', truth); }
}
console.log(`看方向規則 vs 向量計算：${n - bad}/${n} 一致`);
// 費雪投影：酒石酸 C2 的 OH 在右 → R、C3 的 OH 在右 → S（兩個 OH 同側為內消旋）
const c2 = chir(FV.right, FV.up, FV.down), c3 = chir(FV.right, FV.down, FV.up);
console.log(`酒石酸 OH 皆在右：(2${c2},3${c3})`, c2 === 'R' && c3 === 'S' ? 'ok' : (bad++, 'FAIL'));
// (R)-甘油醛的費雪投影：CHO 在上、CH₂OH 在下、OH 在右（D-甘油醛 = R）
const gl = chir(FV.right, FV.up, FV.down); console.log('D-甘油醛（OH 在右）=', gl, gl === 'R' ? 'ok' : (bad++, 'FAIL'));
process.exit(bad ? 1 : 0);
