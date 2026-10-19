/* ---------- 練習題示範：把題目情境帶入同一章的互動圖 ----------
   每題的 demo：set = 設定輸入元件（id → 值）；click = 依序點擊的按鈕；custom = 交給互動圖自己的 _demo()；look = 示範時的觀察提示。
   有 q 的項目會整題替換（原題無法在圖上示範時）。 */
const QD = {
  'exp-design': [
    { demo: { click: ['#wx-a [data-a="pick"]'], set: { 'wx-b': true, 'wx-e': 0, 'wx-n': 10 }, look: '藥效設為 0、改成研究者挑選。看橘色虛線（估計值的平均）離黑線（真值）多遠，以及紅色（p < 0.05）的比例。' } },
    { demo: { click: ['#wx-a [data-a="pick"]'], set: { 'wx-b': true, 'wx-e': 0, 'wx-n': 40 }, look: '每組 40 隻：分佈變窄了，但仍然整個偏離黑線。再切回「隨機分派」比較。' } },
    { demo: { click: ['#wx-a [data-a="rand"]'], set: { 'wx-b': false, 'wx-e': 0, 'wx-n': 10 }, look: '隨機分派但沒有盲化：分佈仍然往右偏，偏差來自量測。把「量測者盲化」勾回來比較。' } },
  ],
  'c0-1': [
    { demo: { set: { 'wr-a': 4, 'wr-b': 2 }, look: '對照組 4 人、治療組 2 人有副作用。比較「絕對差」與「相對變化」兩格。' } },
    { q: '對照組事件率 30%、治療組 20%，需治療人數（NNT）是多少？', o: ['10 人', '3 人', '20 人', '50 人'], why: '絕對差 = 10 個百分點，NNT = 100 ÷ 10 = 10：每治療 10 人，可以少 1 人發生事件。', demo: { set: { 'wr-a': 30, 'wr-b': 20 }, look: '看小人圖中兩組相差幾個紅色，以及 NNT 那一格。' } },
  ],
  'c0-2': [
    { q: '資料 2、4、6、8、10 的 Σ(x_i − x̄) 是多少？', o: ['0', '30', '6', '要看資料，不一定'], why: '離均差的總和永遠是 0：圖中綠線（正）和紅線（負）的長度剛好抵消。這就是計算變異時要先平方的原因。', demo: { set: { 'ws-0': 2, 'ws-1': 4, 'ws-2': 6, 'ws-3': 8, 'ws-4': 10 }, look: '看每根長條旁的離均差，以及公式最後一行的加總。' } },
    { q: '資料 3、5、10、6、8 的平均數 x̄ 是多少？', o: ['6.4', '6', '32', '5'], why: 'Σx = 32，x̄ = 32 ÷ 5 = 6.4。', demo: { set: { 'ws-0': 3, 'ws-1': 5, 'ws-2': 10, 'ws-3': 6, 'ws-4': 8 }, look: '紅色虛線就是平均數 x̄。' } },
  ],
  'c0-3': [
    { demo: { set: { 'wl-a': 50, 'wl-b': 200 }, look: '處理組 50、對照組 200，就是「1/4 倍」。看 log₂FC 與 log₂ 尺度上橘色箭頭的位置。' } },
    { q: '處理組表現量 400、對照組 50，log₂ fold change 是多少？', o: ['3', '8', '350', '0.125'], why: '400 ÷ 50 = 8 倍 = 2³，所以 log₂FC = 3：倍增了三次。', demo: { set: { 'wl-a': 400, 'wl-b': 50 }, look: '在 log₂ 尺度上，橘色箭頭落在 3 的位置。' } },
  ],
  'c0-4': [
    { demo: { set: { 'wn-a': 8, 'wn-b': -0.5 }, look: '斜率為負時，x 每增加 1，直線就往下掉（這裡是 0.5）。' } },
    { demo: { set: { 'wn-a': 2, 'wn-b': 0.85 }, look: '截距是直線在 x = 0 碰到 y 軸的高度。劑量 0 在這裡有意義（沒給藥），但「0 歲的成人」就沒有。' } },
  ],
  'c1-1': [
    { demo: { custom: { k: 5 }, look: '圖上換成「疼痛程度」這張卡片，先自己分類看看。' } },
    { q: '「診斷到死亡的月數：14、32+、8、60+」是哪一種變數？', o: ['時間至事件', '連續', '計數', '順序'], why: '有些人追蹤結束時還沒發生事件（標成 +），這是設限，要用存活分析處理。', demo: { custom: { k: 7 }, look: '圖上換成這個變數，注意數字後面的「+」。' } },
  ],
  'c1-2': [
    { demo: { set: { 'wm-in': '1, 2, 3, 4, 100' }, look: '比較紅線（平均）與綠色虛線（中位數）的位置。' } },
    { demo: { set: { 'wm-in': '2, 3, 3, 4, 5, 6, 30, 45' }, look: '右邊有長尾時，平均被拉向右邊的大數。' } },
  ],
  'c1-3': [
    { q: '乙組加入一個 200 mmHg 的極端值後，哪個數字變化比較大？', o: ['SD 明顯增加，IQR 幾乎不變', 'IQR 明顯增加，SD 不變', '兩者都不變', '兩者增加一樣多'], why: 'SD 用到每個值與平均的距離平方，一個極端值影響很大；IQR 只看中間 50% 的資料。', demo: { set: { 'wv-s': 12, 'wv-o': true }, look: '比較下方乙組 SD 與 IQR 兩格，以及紅點的位置。' } },
    { demo: { set: { 'wv-s': 4, 'wv-o': false }, look: '深色帶就是平均 ± 1 SD：它描述的是「個體之間」的分散程度。' } },
  ],
  'c1-4': [
    { demo: { set: { 'wz-m': 120, 'wz-s': 15, 'wz-x': 150 }, look: '紅線落在平均右邊第幾條虛線（每條是 1 個 SD）？' } },
    { demo: { set: { 'wz-m': 100, 'wz-s': 10, 'wz-x': 120 }, look: 'x 比平均多 2 個 SD，即 z = 2。看「百分位」那一格。' } },
  ],
  'c1-5': [
    { demo: { click: ['#wt1-g [data-g="group"]'], set: { 'wt1-p': true }, look: '這是隨機試驗的 Table 1，最右邊有 p 值欄。把「顯示 p 值欄」關掉，看看表格是否仍然完整。' } },
  ],
  'c2-1': [
    { demo: { set: { 'wd-se': 99, 'wd-sp': 99, 'wd-pr': 0.1 }, look: '看陽性那一列：偽陽性（紅）比真陽性（綠）多，PPV 只有約 9%。' } },
    { demo: { set: { 'wd-se': 99, 'wd-sp': 80, 'wd-pr': 5 }, look: '敏感度 99% 時，陰性預測值 NPV 非常高：陰性結果很可靠。' } },
  ],
  'c2-2': [
    { q: '每次抽樣人數 n 從 10 增加到 40，樣本平均數的標準差（標準誤）會？', o: ['減半', '變成 1/4', '不變', '加倍'], why: '標準誤 = σ ÷ √n，√40 ÷ √10 = 2，所以減半。', demo: { set: { 'wc-p': 'exp', 'wc-n': 40 }, look: '比較「理論標準誤」與 n = 10 時相比；可以把 n 拉回 10 對照。' } },
    { demo: { set: { 'wc-p': 'exp', 'wc-n': 30 }, look: '左邊母體仍然右偏，但右邊 2,000 個平均數已經是鐘形。' } },
  ],
  'c2-3': [
    { demo: { set: { 'wi-n': 80, 'wi-c': '0.95' }, look: 'n = 80 是 20 的 4 倍。和 n = 20 比較，區間大約短了一半。' } },
    { demo: { set: { 'wi-n': 20, 'wi-c': '0.99' }, look: '換成 99% 後，每條區間都變長了，紅色（沒涵蓋到）的區間變少。' } },
  ],
  'c2-4': [
    { demo: { set: { 'wp-d': 0, 'wp-n': 20 }, look: '兩組其實沒差（H₀ 為真），p 值仍然散布在 0 到 1；p 值是在「假設 H₀ 為真」的前提下算出來的。' } },
    { demo: { set: { 'wp-d': 0, 'wp-n': 50 }, look: '效果量為 0 時，看紅色長條（p < 0.05）占全部的比例。' } },
  ],
  'c3-1': [
    { q: '平均差 6、SD 12、每組 20 人時，p 約為 0.12。若每組增加到 80 人，p 值會？', o: ['變小：標準誤縮小，t 變大', '變大', '不變', '變成 0.12 × 4'], why: '標準誤 = SD × √(2/n)，n 變 4 倍時標準誤減半，t 加倍，p 值變小。', demo: { set: { 'wtv-d': 6, 'wtv-s': 12, 'wtv-n': 80 }, look: '先看 n = 80 的 t 與 p，再把 n 拉回 20 比較。' } },
    { demo: { set: { 'wtv-d': 10, 'wtv-s': 5, 'wtv-n': 30 }, look: '訊號大、雜訊小時，t 遠在尾巴外，紅色面積（p 值）幾乎看不見。' } },
  ],
  'c3-2': [
    { q: '組間差距固定為 4，把組內標準差從 3 調到 8，F 值會？', o: ['變小', '變大', '不變', '變成負數'], why: 'F = 組間變異 ÷ 組內變異；分母變大，F 就變小，三組變得難以區分。', demo: { set: { 'wa-g': 4, 'wa-s': 8 }, look: '看灰色的組內變異長條變長，F 值下降。' } },
    { demo: { set: { 'wa-g': 4, 'wa-s': 3 }, look: '點「總平方和」「組間平方和」「組內平方和」三張卡，看每一段距離怎麼加起來；η² 就是組間占總和的比例。' } },
    { demo: { set: { 'wa-g': 8, 'wa-s': 3 }, look: '三組平均明顯分開時 p 很小，但 A 與 C 的差距比 A 與 B 小：ANOVA 不會告訴你是哪幾組不同。' } },
  ],
  'c3-3': [
    { demo: { set: { 'w2-a': 25, 'w2-b': 70, 'w2-c': 45, 'w2-d': 260 }, look: 'OR 只用到 a、b、c、d 的交叉相乘，不需要知道族群中真正的事件率；病例對照研究只能算這個。' } },
    { q: '2×2 表為 4、3／1、8，最小的期望值約 2.2。應該怎麼做？', o: ['改用 Fisher 精確檢定', '照樣用卡方', '刪除那一格', '合併成 1×2 表'], why: '期望值小於 5 時卡方近似不準確，改用 Fisher 精確檢定。', demo: { set: { 'w2-a': 4, 'w2-b': 3, 'w2-c': 1, 'w2-d': 8 }, look: '注意出現的黃色提醒，以及卡方 p 與 Fisher p 的差別。' } },
  ],
  'c3-4': [
    { demo: { set: { 'wc2-r': -0.8, 'wc2-n': 40, 'wc2-o': false, 'wc2-u': false }, look: '點沿著一條往下的直線緊密排列。' } },
    { demo: { set: { 'wc2-r': 0.6, 'wc2-n': 40, 'wc2-o': true, 'wc2-u': false }, look: '加入一個極端值後，比較 Pearson r 與 Spearman ρ 各變了多少。' } },
  ],
  'c3-5': [
    { demo: { custom: { path: [0, 2] }, look: '數值結果、三組以上：看建議方法下方的偏態備註。' } },
    { demo: { custom: { path: [1, 1] }, look: '二元結果、需要校正其他變數。' } },
  ],
  'c4-1': [
    { demo: { set: { 'wf-g': 12 }, click: ['#wf-m [data-m="1"]'], look: '兩條平行線之間的垂直距離就是「group」的係數：同樣年齡下兩組的差。' } },
    { demo: { set: { 'wf-g': 0 }, click: ['#wf-m [data-m="1"]'], look: '兩組年齡相同時，校正前後的估計接近；放入相關的基線變數主要是讓估計更精確。' } },
  ],
  'c4-2': [
    { demo: { set: { 'wg-0': -6, 'wg-1': 0.07, 'wg-x': 60 }, look: '看「OR（每多 10 歲）」約為 2：勝算變成 2 倍，但「機率」不一定變成 2 倍。拖動年齡比較。' } },
    { q: 'β₁ = 0.07 時，年齡每多 10 歲的勝算比約是多少？', o: ['2.0', '0.7', '7', '1.07'], why: 'OR = e^(10 × 0.07) = e^0.7 ≈ 2.0。', demo: { set: { 'wg-0': -6, 'wg-1': 0.07 }, look: '看「OR（每多 10 歲）」那一格。' } },
  ],
  'c4-3': [
    { demo: { custom: { st: [1, 1, 0, 1, 1, 0, 1, 0, 1, 0] }, look: '病人 8 在第 18 個月失聯，標成藍色 ＋（設限）。KM 曲線在那裡不往下掉，但之後的風險人數少了一人。' } },
    { q: '如果把所有設限的病人都當成死亡，KM 中位存活時間會？', o: ['變短', '變長', '不變', '無法計算'], why: '設限的人其實還活著；當成死亡會讓曲線提早下降，低估存活。', demo: { custom: { st: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }, look: '所有人都變成紅點後，比較中位存活與原本的數字。點病人可以改回設限。' } },
  ],
  'c4-4': [
    { demo: { set: { 'wm-m': 1000, 'wm-t': 0, 'wm-e': 3 }, look: '1,000 個基因都沒有真效果。看「未校正」那一列的偽陽性數，約為 1,000 × 5% = 50。' } },
    { demo: { set: { 'wm-m': 500, 'wm-t': 10, 'wm-e': 3 }, look: '比較三種方法抓到的真差異與偽陽性；BH 讓「偽發現比例」維持在約 5% 以下。' } },
  ],
  'c4-5': [
    { demo: { click: ['#ww-mode [data-m="m"]'], set: { 'ww-delta': 2.5, 'ww-sd': 10, 'ww-a': '0.05', 'ww-pw': '0.8' }, look: '差異從 5 減半為 2.5。和 Δ = 5 時的「每組所需」（64 人）比較。' } },
    { demo: { click: ['#ww-mode [data-m="m"]'], set: { 'ww-delta': 5, 'ww-sd': 10, 'ww-a': '0.05', 'ww-pw': '0.8' }, look: '樣本數應該在研究開始前就決定，計算依據列在下方的「數字的標準寫法」。' } },
  ],
  'c4-6': [
    { demo: { set: { 'wps-m': 3, 'wps-c': 50, 'wps-b': 1 }, look: '每組只有 3 隻小鼠。看「細胞當 n」的偽陽性率遠超過 5%。' } },
    { demo: { set: { 'wps-m': 3, 'wps-c': 20, 'wps-b': 1.5 }, look: '小鼠之間差異越大，把細胞當獨立樣本的偽陽性率越高。' } },
  ],
  'c5-1': [
    { demo: { set: { 'wdg-s': 0.4, 'wdg-t': 1 }, click: ['#wdg-m [data-m="1"]'], look: '吸菸同時指向咖啡與肺癌。校正吸菸之後，OR 回到 1 附近。' } },
    { q: '咖啡其實無效（真實 OR = 1），不校正吸菸時，估計的 OR 會？', o: ['大於 1，咖啡看起來有害', '等於 1', '小於 1', '無法估計'], why: '吸菸者較常喝咖啡又較常得肺癌，這條後門路徑讓咖啡看起來有害。', demo: { set: { 'wdg-s': 0.4, 'wdg-t': 1 }, click: ['#wdg-m [data-m="0"]'], look: '看紅色「未校正 OR」的位置。' } },
  ],
  'c5-2': [
    { demo: { click: ['#wh-re', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go'], look: '一次試了 8 種分析，數數看有沒有碰巧顯著的。可以繼續按「換一種分析試試」。' } },
    { q: '虛無假設為真時，嘗試 10 種彼此獨立的分析，至少一次 p < 0.05 的機率約是？', o: ['40%', '5%', '10%', '95%'], why: '1 − 0.95¹⁰ ≈ 0.40。', demo: { click: ['#wh-re', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go', '#wh-go'], look: '看曲線上紅點對應的機率（第 10 次）。' } },
  ],
  'c5-3': [
    { demo: { click: ['#wfg-m [data-m="ci"]'], look: '平均 ± 95% CI 同時呈現效果大小與不確定性，和好的結果寫法一樣。' } },
    { demo: { click: ['#wfg-m [data-m="se"]'], look: '先看 SE 版本，再按「長條 ± SD」：同一份資料，誤差線差很多。' } },
  ],
  'c5-4': [
    { demo: { focus: '#wck-7', look: '檢查表第 8 項：次群組分析要標明是否事先規劃，並檢定交互作用。' } },
  ],
};
for (const [id, list] of Object.entries(QD)) {
  const c = CH.find(x => x.id === id);
  list.forEach((d, i) => { c.quiz[i] = d.q ? { q: d.q, o: d.o, why: d.why, demo: d.demo } : { ...c.quiz[i], demo: d.demo }; });
}

function applyDemo(el, d) {
  if (d.custom && el._demo) el._demo(d.custom);
  for (const [id, v] of Object.entries(d.set || {})) {
    const n = document.getElementById(id); if (!n) continue;
    if (n.type === 'checkbox') n.checked = !!v; else n.value = v;
    n.dispatchEvent(new Event('input', { bubbles: true })); n.dispatchEvent(new Event('change', { bubbles: true }));
  }
  for (const s of d.click || []) { const b = $(s, el); if (b) b.click(); }
  if (d.focus) { const f = $(d.focus, el); if (f) { const l = f.closest('label') || f; l.classList.add('flash'); setTimeout(() => l.classList.remove('flash'), 1600); } }
}
function bindDemos(c) {
  const box = $('.widget-box'), el = $('#widget'); if (!box || !el) return;
  $$('[data-demo]').forEach(b => {
    b.onclick = () => {
      const qi = +b.dataset.demo, d = c.quiz[qi].demo, note = $('#demoNote');
      applyDemo(el, d);
      note.hidden = false; note.innerHTML = `<p><b>示範 Q${qi + 1}</b>${esc(d.look || '')}</p><button type="button" class="btn sm" id="demoBack">回到 Q${qi + 1} ↓</button>`;
      $('#demoBack').onclick = () => $(`.q[data-q="${qi}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  });
}
boot();
