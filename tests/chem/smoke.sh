#!/bin/bash
# 後中化學：無頭 Chrome 打開每一章，操作每個互動圖（按鈕、滑桿、選單、機構逐步播放）與每題練習題，回報錯誤。
# 用法：bash tests/chem/smoke.sh（需先 python3 build.py）
cd "$(dirname "$0")/../.." || exit 1
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP=$(mktemp -d)
cat > "$TMP/probe.js" <<'JS'
window.__errs = []; addEventListener('error', e => __errs.push(e.message)); const _ce = console.error; console.error = (...a) => { __errs.push(a.map(String).join(' ')); _ce(...a); };
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms)), fire = (e, t) => e.dispatchEvent(new Event(t, { bubbles: true }));
  await sleep(400);
  const rep = { widgets: 0, frames: 0, quiz: 0, shows: 0, failed: [...document.querySelectorAll('.widget .note.bad')].length };
  for (const w of document.querySelectorAll('.widget')) {
    rep.widgets++;
    for (const b of [...w.querySelectorAll('.seg button')]) {
      b.click(); await sleep(5);
      for (let k = 0; k < 6; k++) { const nx = w.querySelector('.mech-ctl [data-m="1"]'); if (!nx || nx.disabled) break; nx.click(); await sleep(950); rep.frames++; }
    }
    for (const r of w.querySelectorAll('input[type=range]')) for (const v of [r.min, r.max, (+r.min + +r.max) / 2]) { r.value = v; fire(r, 'input'); }
    for (const s of w.querySelectorAll('select')) for (const o of [...s.options]) { s.value = o.value; fire(s, 'change'); }
    for (const c of w.querySelectorAll('input[type=checkbox]')) { c.click(); c.click(); }
    for (const b of [...w.querySelectorAll('button.btn')]) { if (!b.closest('.mech-ctl')) b.click(); }
    if (/NaN|undefined|Infinity/.test(w.textContent)) __errs.push(`${w.dataset.w}: 文字中出現 NaN/undefined`);
  }
  for (const q of document.querySelectorAll('.q')) {
    rep.quiz++;
    for (const o of [...q.querySelectorAll('.opt')]) { if (!o.disabled) o.click(); const s = q.querySelector('[data-show]'); if (s) { s.click(); rep.shows++; } }
    if (!q.querySelector('.opt.right')) __errs.push('練習題沒有正解：' + q.querySelector('.qt').textContent.slice(0, 30));
  }
  const p = document.createElement('pre'); p.id = '__out'; p.textContent = JSON.stringify({ ...rep, errs: __errs }); document.body.appendChild(p);
})();
JS
sed 's#<script>#<script src="probe.js"></script><script>#' docs/chem/index.html | sed 's#src="probe.js"></script><script>#src="probe.js" defer></script><script>#' > "$TMP/p.html"
CHAPTERS=$(node -e "const fs=require('fs');console.log(new Function(fs.readFileSync('src/chem/content.js','utf8')+';return CH;')().map(c=>c.id).join(' '))")
fail=0
for c in home $CHAPTERS; do
  "$CHROME" --headless=new --disable-gpu --user-data-dir="$TMP/prof-$c" --window-size=1100,900 --virtual-time-budget=120000 --dump-dom "file://$TMP/p.html#$c" 2>/dev/null > "$TMP/out-$c" &
  pid=$!; ( sleep 240; kill -9 $pid ) >/dev/null 2>&1 & w=$!; disown $w; wait $pid 2>/dev/null; kill $w 2>/dev/null
  r=$(python3 -c "import re,sys,html;s=open(sys.argv[1]).read();m=re.search(r'<pre id=\"__out\">(.*?)</pre>',s,re.S);print(html.unescape(m.group(1)) if m else 'NO OUTPUT')" "$TMP/out-$c")
  if echo "$r" | grep -q '"errs":\[\]' && echo "$r" | grep -q '"failed":0'; then echo "ok   $c  $r"; else echo "FAIL $c  $r"; fail=1; fi
done
rm -rf "$TMP"; exit $fail
