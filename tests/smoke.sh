#!/bin/sh
# 用無頭 Chrome 載入每一章：按下所有「在上方圖表示範這題」按鈕與所有數字卡；
# 在實驗室頁跑過每一種分析並按遍數字卡。回報 JavaScript 錯誤，以及沒有對應圖上元素的數字卡。
# 執行：sh tests/smoke.sh（需先 python3 build.py）
cd "$(dirname "$0")/.." || exit 1
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP=$(mktemp -d)
PROBE="$TMP/probe.html"
cat > "$TMP/probe.js" <<'EOF'
setTimeout(() => {
  let demos = 0, cards = 0; const orphan = [], untaught = [];
  const clickCards = root => $$('[data-card]', root).forEach(c => {
    c.click(); cards++;
    const k = c.dataset.card, hit = [...root.querySelectorAll('[data-k]')].some(e => (e.getAttribute('data-k') || '').split(' ').includes(k));
    const v = (c.querySelector('b') || c).textContent.trim();
    if (!hit && !/^0(\s|\/|$)/.test(v)) orphan.push(k);
    c.click();
  });
  if (location.hash === '#lab') {
    const P = { table1: ['bp_trial', { g: 'group', vars: ['age', 'sex', 'bmi'] }], ttest: ['bp_trial', { y: 'sbp_wk12', g: 'group' }], paired: ['bp_trial', { a: 'sbp_base', b: 'sbp_wk12' }],
      anova: ['plant_growth', { y: 'height_cm', g: 'fertilizer' }], chisq: ['cvd_cohort', { r: 'smoker', c: 'cvd_10y' }], corr: ['cvd_cohort', { x: 'age', y: 'sbp' }],
      linreg: ['bp_trial', { y: 'sbp_wk12', xs: ['group', 'sbp_base'] }], logreg: ['cvd_cohort', { y: 'cvd_10y', xs: ['smoker', 'age'] }],
      surv: ['lung_surv', { time: 'time_months', status: 'status', g: 'treatment', xs: ['treatment', 'stage'] }], multi: ['gene_expr', { g: 'tissue' }], power: ['bp_trial', {}] };
    for (const [an, [ds, sel]] of Object.entries(P)) {
      try { state.dsId = ds; state.an = an; state.sels = { [an]: sel }; renderLab(); runAnalysis(); if ($('#result .err')) __e.push(an + ': ' + $('#result .err').textContent); clickCards($('#result')); }
      catch (x) { __e.push(an + ': ' + x.message); }
    }
  } else {
    $$('[data-demo]').forEach(b => { try { b.click(); demos++; } catch (x) { __e.push(x.message); } });
    const w = $('#widget'); if (w) clickCards(w);
    // 數字卡上的名詞必須在本章或前面的章節教過（名詞表 GLOSS）
    const ci = CH.findIndex(c => c.id === location.hash.slice(1));
    if (ci >= 0 && w) {
      const body = CH[ci].body.replace(/<sub>(.*?)<\/sub>/g, '_$1').replace(/<[^>]+>/g, '');
      const ALLOW = [/^n$/, /^事件$/, /^每組所需$/, /^考量流失後每組$/, /^總收案數$/, /^區間平均寬度$/, /^\d+ 歲的機率 p$/];
      $$('[data-card]:not(tr)', w).forEach(c => {
        const lab = (c.querySelector('span') || c).textContent.trim();
        if (ALLOW.some(r => r.test(lab))) return;
        // 找出卡片上所有符合的名詞寫法；被更長寫法包含的（例如「對數」在「對數概似」裡）不算
        const hits = GLOSS.flatMap(g => [g[0], ...g[1]].filter(f => lab.includes(f)).map(f => ({ f, g })));
        const kept = hits.filter(h => !hits.some(o => o.f !== h.f && o.f.includes(h.f)));
        const taught = h => CH.findIndex(x => x.id === h.g[3]) <= ci || [h.g[0], ...h.g[1]].some(f => body.includes(f));
        if (!kept.length || !kept.every(taught)) untaught.push(lab);
      });
    }
  }
  document.title = `demos=${demos} cards=${cards} untaught=${untaught.join(',')} orphan=${orphan.join(',')} errors=${__e.join('|')}`;
}, 1200);
EOF
{
  printf '<script>window.__e=[];addEventListener("error",e=>__e.push(e.message));</script>'
  sed 's#</body>#<script src="probe.js"></script></body>#' docs/index.html
} > "$PROBE"
fail=0
for h in home c0-1 c0-2 c0-3 c0-4 c1-1 c1-2 c1-3 c1-4 c1-5 c2-1 c2-2 c2-3 c2-4 c3-1 c3-2 c3-3 c3-4 c3-5 c4-1 c4-2 c4-3 c4-4 c4-5 c4-6 c5-1 c5-2 c5-3 c5-4 c5-5 lab data; do
  r=$("$CHROME" --headless=new --disable-gpu --window-size=500,900 --virtual-time-budget=8000 --dump-dom "file://$PROBE#$h" 2>/dev/null | grep -o '<title>[^<]*</title>' | tail -1 | sed 's/<[^>]*>//g')
  case "$r" in *"untaught= orphan= errors=") echo "ok   $h  $r" ;; *) echo "FAIL $h  $r"; fail=1 ;; esac
done
rm -rf "$TMP"
exit $fail
