// 檢查課程內容的一致性：
// 1. 名詞表中每個名詞（或其他寫法）都真的出現在它標示的章節內容裡（確實有教）
// 2. 列出每一題練習題用到、但名詞表沒有收錄的常見統計術語（避免題目出現沒教過的名詞）
// 執行：node tests/content.test.js
const fs = require('fs');
const path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8');
const { CH, GLOSS } = new Function(read('core.js') + read('content.js') + '; return { CH, GLOSS };')();
const dsrc = read('demos.js');
const QD = new Function('CH', dsrc.slice(0, dsrc.indexOf('function applyDemo')) + '; return QD;')(CH);
const plain = h => h.replace(/<sub>(.*?)<\/sub>/g, '_$1').replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

let fail = 0;
const ids = new Set(CH.map(c => c.id));
for (const [term, alias, def, ch] of GLOSS) {
  if (!ids.has(ch)) { fail++; console.log(`FAIL 名詞「${term}」標示的章節 ${ch} 不存在`); continue; }
  const body = plain(CH.find(c => c.id === ch).body);
  if (![term, ...alias].some(t => body.includes(t))) { fail++; console.log(`FAIL 名詞「${term}」沒有出現在 ${ch} 的內容中`); }
}

// 內容中的 {{章節ID}} 必須指向存在的章節；每章都要有對照教科書（純數學暖身與最後的路線章除外）
for (const c of CH) {
  for (const [, id] of c.body.matchAll(/\{\{([\w-]+)\}\}/g)) if (!ids.has(id)) { fail++; console.log(`FAIL ${c.id} 內容引用了不存在的章節 ${id}`); }
  if (!c.refs && !['c0-2', 'c0-3', 'c0-4', 'c5-5'].includes(c.id)) { fail++; console.log(`FAIL ${c.id} 沒有對照教科書`); }
}

// 練習題（含示範題替換後的版本）中出現的術語，必須都在名詞表裡
const known = new Set(GLOSS.flatMap(([t, a]) => [t, ...a]));
const watch = ['NNT', 'NPV', 'PPV', 'RCT', 'SE', 'SD', 'IQR', 'OR', 'RR', 'HR', 'FDR', 'CI', 'AUC', 'EPV', 'SAP', 'DAG', 'GEE', '勝算', '設限', '偏態', '百分位', '標準誤', '效果量', '檢定力', '校正', '基線', '交互作用', '虛擬變數', '參考組', '干擾因子', '中介變數', '事後比較', '期望值', '自由度', '邏輯斯迴歸', 'Cox', '混合模型', '病例對照', '世代研究', '轉錄體', 'p-hacking', '單尾', '誤差線', '次群組'];
for (const c of CH) {
  const q = QD[c.id] || [];
  c.quiz.forEach((x, i) => {
    const d = q[i] || {}, text = [d.q || x.q, ...(d.o || x.o), d.why || x.why, d.demo && d.demo.look].filter(Boolean).join(' ');
    for (const w of watch) if (text.includes(w) && ![...known].some(k => k.includes(w) || w.includes(k) && k.length > 1)) { fail++; console.log(`FAIL ${c.id} Q${i + 1} 用了「${w}」，但名詞表沒有收錄`); }
  });
}
console.log(fail ? `\n${fail} 項失敗` : `名詞表 ${GLOSS.length} 個名詞都在對應章節教過；練習題的術語都已收錄。`);
process.exit(fail ? 1 : 0);
