#!/bin/bash
# 收集介面與互動圖上會出現的中文片語（不含內容包已處理的章節內文、練習題、名詞），供翻譯片語字典使用。
# 用法：bash tests/collect_phrases.sh > /tmp/phrases.json（需先 python3 build.py）
# UI_LANG=en：改為檢查英文模式翻譯後仍殘留的中文（輸出殘留片語；空陣列＝通過）
cd "$(dirname "$0")/.." || exit 1
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP=$(mktemp -d)
cat > "$TMP/probe.js" <<'EOF'
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms)), CJK = /[㐀-鿿、-〿＀-￯]/, NUM = /[−-]?\d+(?:[.,]\d+)*|[A-Za-z_][A-Za-z0-9_]*/g, out = new Set();
  const EN = location.search.includes('lang=');
  const skipText = EN ? new Set() : new Set([...CH.flatMap(c => [c.title, c.wtitle]), ...GLOSS.flatMap(g => [g[0], g[2]]), ...LEVELS.flatMap(l => [l.name, l.desc, l.title])].filter(Boolean));
  const SKIP = EN ? '[data-notr], script, style' : '.prose, .q-t, .opts, .why, .tchip, .tline, #demoNote, .wr[data-lang="zh"], script, style';
  const add = s => { const k = s.trim().replace(NUM, () => '#'); if (k && CJK.test(k) && !skipText.has(s.trim())) out.add(s.trim().replace(NUM, (() => { let i = 0; return () => `{${i++}}`; })())); };
  const collect = root => {
    if (!root || (EN && !collect.final)) return;  // 英文模式：互動中的漏譯由 trPhrase 記在 __i18nMiss
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const p = n.parentElement; if (p && !p.closest(SKIP) && CJK.test(n.nodeValue)) add(n.nodeValue); }
    root.querySelectorAll('[aria-label], [title], [placeholder]').forEach(e => ['aria-label', 'title', 'placeholder'].forEach(a => { const v = e.getAttribute(a); if (v && CJK.test(v) && !e.closest(SKIP)) add(v); }));
  };
  const fire = (e, t) => e.dispatchEvent(new Event(t, { bubbles: true }));
  await sleep(600);
  collect(document.body);
  const h = location.hash.slice(1), wg = document.getElementById('widget');
  if (wg) {
    for (const b of [...document.querySelectorAll('[data-demo]')]) { try { b.click(); await sleep(30); collect(wg); } catch (e) {} }
    const each = async (sel, f) => { for (const e of [...wg.querySelectorAll(sel)]) { try { await f(e); } catch (x) {} } };
    for (let round = 0; round < 2; round++) {
      await each('.seg button, [data-m], [data-d], [data-a], [data-s], [data-r], [data-p], [data-g], [data-t]', async b => { b.click(); await sleep(20); collect(wg); });
      await each('select', async s => { for (const o of [...s.options]) { s.value = o.value; fire(s, 'input'); fire(s, 'change'); await sleep(20); collect(wg); } });
      await each('input[type=checkbox]', async c => { c.checked = !c.checked; fire(c, 'input'); fire(c, 'change'); await sleep(20); collect(wg); c.checked = !c.checked; fire(c, 'change'); });
      await each('input[type=range]', async r => { for (const v of [r.min, r.max, (+r.min + +r.max) / 2]) { r.value = v; fire(r, 'input'); await sleep(10); collect(wg); } });
      await each('button.btn', async b => { b.click(); await sleep(30); collect(wg); });
      await each('[data-card]', async c => { c.click(); collect(wg); c.click(); });
    }
    for (const c of [...document.querySelectorAll('#wterms .tchip')]) { c.click(); collect(document.getElementById('wterms')); c.click(); }
    for (const q of [...document.querySelectorAll('.q')]) { const b = q.querySelector('.opt[data-k="0"]'), wr = q.querySelector('.opt:not([data-k="0"])'); if (wr) { wr.click(); collect(q.querySelector('.why')); } if (b) b.click(); }
    collect(document.body);
  }
  if (h === 'lab') {
    const P = { table1: ['bp_trial', { g: 'group', vars: ['age', 'sex', 'bmi'] }], ttest: ['bp_trial', { y: 'sbp_wk12', g: 'group' }], paired: ['bp_trial', { a: 'sbp_base', b: 'sbp_wk12' }], onet: ['bp_trial', { y: 'sbp_base', mu0: 150 }], binomtest: ['bp_trial', { y: 'ae', p0: 0.1 }], mcnemar: ['cvd_cohort', { a: 'smoker', b: 'diabetes' }], kappa: ['cvd_cohort', { a: 'smoker', b: 'diabetes' }], gof: ['lung_surv', { y: 'stage', probs: '1:1:1' }], anova: ['plant_growth', { y: 'height_cm', g: 'fertilizer' }], block: ['plant_growth', { y: 'height_cm', tr: 'fertilizer', bk: 'block' }], rm: ['wound', { vars: ['day0', 'day3', 'day7', 'day14'] }], ancova: ['bp_trial', { y: 'sbp_wk12', g: 'group', x: 'sbp_base' }], poisreg: ['ward_inf', { y: 'infections', xs: ['period', 'icu'], pt: 'patient_days' }], bland: ['bp_trial', { a: 'sbp_base', b: 'sbp_wk12' }], mh: ['cvd_cohort', { r: 'smoker', c: 'cvd_10y', z: 'sex' }], anova2: ['diet_geno', { y: 'weight_gain_g', a: 'diet', b: 'genotype' }], chisq: ['cvd_cohort', { r: 'smoker', c: 'cvd_10y' }], corr: ['cvd_cohort', { x: 'age', y: 'sbp' }], linreg: ['bp_trial', { y: 'sbp_wk12', xs: ['group', 'sbp_base'] }], logreg: ['cvd_cohort', { y: 'cvd_10y', xs: ['smoker', 'age'] }], surv: ['lung_surv', { time: 'time_months', status: 'status', g: 'treatment', xs: ['treatment', 'stage'] }], multi: ['gene_expr', { g: 'tissue' }], power: ['bp_trial', {}] };
    for (const [an, [ds, sel]] of Object.entries(P)) { try { state.dsId = ds; state.an = an; state.sels = { [an]: sel }; renderLab(); collect(document.body); runAnalysis(); await sleep(30); collect(document.body); document.querySelectorAll('#result details').forEach(d => { d.open = true; }); collect(document.body); } catch (e) {} }
    for (const d of DATASETS) { try { state.dsId = d.id; renderLab(); collect(document.body); } catch (e) {} }
  }
  if (EN) { await sleep(50); collect.final = true; collect(document.body); (window.__i18nMiss || []).forEach(k => out.add(k)); }
  const pre = document.createElement('pre'); pre.id = '__out'; pre.textContent = JSON.stringify([...out]); document.body.appendChild(pre);
})();
EOF
sed 's#</body>#<script src="probe.js"></script></body>#' docs/index.html > "$TMP/p.html"
export CHROME TMP UI_LANG
one() {
  # Chrome 會忽略 SIGALRM，改用看門狗在逾時後強制結束
  "$CHROME" --headless=new --disable-gpu --user-data-dir="$TMP/prof-$1" --window-size=500,900 --virtual-time-budget=60000 --dump-dom "file://$TMP/p.html${UI_LANG:+?lang=$UI_LANG}#$1" > "$TMP/out-$1" 2>/dev/null & local p=$!
  ( sleep "${TMO:-240}"; kill -9 $p ) >/dev/null 2>&1 & local w=$!
  wait $p 2>/dev/null; kill $w 2>/dev/null
  python3 -c "import sys,re,json,html;s=open(sys.argv[1]).read();m=re.search(r'<pre id=\"__out\">(.*?)</pre>',s,re.S);print(json.dumps(json.loads(html.unescape(m.group(1))) if m else ['__FAIL__ $1'],ensure_ascii=False))" "$TMP/out-$1"
}
export -f one
PAGES=${PAGES:-"home lab data $(node -e "const fs=require('fs');const r=f=>fs.readFileSync('src/'+f,'utf8');console.log(new Function(r('core.js')+r('content.js')+';return CH;')().map(c=>c.id).join(' '))")"}
printf '%s\n' $PAGES | xargs -P ${JOBS:-4} -I{} bash -c 'one {} 2>/dev/null' | python3 -c "import sys,json;s=set();f=[];[ (f.append(x) if x.startswith('__FAIL__') else s.add(x)) for l in sys.stdin if l.strip() for x in json.loads(l)];print(json.dumps(sorted(s),ensure_ascii=False,indent=0));sys.stderr.write('phrases %d, failed %s\n'%(len(s),f))"
rm -rf "$TMP"
