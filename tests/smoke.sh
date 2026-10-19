#!/bin/bash
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
    const P = { table1: ['bp_trial', { g: 'group', vars: ['age', 'sex', 'bmi'] }], ttest: ['bp_trial', { y: 'sbp_wk12', g: 'group' }], paired: ['bp_trial', { a: 'sbp_base', b: 'sbp_wk12' }], onet: ['bp_trial', { y: 'sbp_base', mu0: 150 }], binomtest: ['bp_trial', { y: 'ae', p0: 0.1 }], mcnemar: ['cvd_cohort', { a: 'smoker', b: 'diabetes' }], kappa: ['cvd_cohort', { a: 'smoker', b: 'diabetes' }], gof: ['lung_surv', { y: 'stage', probs: '1:1:1' }],
      anova: ['plant_growth', { y: 'height_cm', g: 'fertilizer' }], block: ['plant_growth', { y: 'height_cm', tr: 'fertilizer', bk: 'block' }], rm: ['wound', { vars: ['day0', 'day3', 'day7', 'day14'] }], ancova: ['bp_trial', { y: 'sbp_wk12', g: 'group', x: 'sbp_base' }], anova2: ['diet_geno', { y: 'weight_gain_g', a: 'diet', b: 'genotype' }], chisq: ['cvd_cohort', { r: 'smoker', c: 'cvd_10y' }], corr: ['cvd_cohort', { x: 'age', y: 'sbp' }],
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
# 每頁開一個獨立的無頭瀏覽器，同時跑 8 頁
export CHROME PROBE TMP
run_page() {
  r=$(perl -e 'alarm 60; exec @ARGV' "$CHROME" --headless=new --disable-gpu --user-data-dir="$TMP/prof-$1" --window-size=500,900 --virtual-time-budget=8000 --dump-dom "file://$PROBE#$1" 2>/dev/null | grep -o '<title>[^<]*</title>' | tail -1 | sed 's/<[^>]*>//g')
  case "$r" in *"untaught= orphan= errors=") echo "ok   $1  $r" ;; *) echo "FAIL $1  ${r:-逾時（超過 60 秒）}" ;; esac
}
export -f run_page 2>/dev/null
CHAPTERS=$(node -e "const fs=require('fs');const r=f=>fs.readFileSync('src/'+f,'utf8');console.log(new Function(r('core.js')+r('content.js')+';return CH;')().map(c=>c.id).join(' '))")
OUT=$(printf '%s\n' home $CHAPTERS lab data | xargs -P ${SMOKE_JOBS:-4} -I{} bash -c 'run_page {}')
# 逾時的頁面（通常是電腦忙碌）單獨再跑一次
for h in $(echo "$OUT" | grep "逾時" | awk '{print $2}'); do
  OUT=$(echo "$OUT" | grep -v "^FAIL $h ")
  OUT="$OUT
$(run_page "$h")"
done
echo "$OUT" | sort -k2
case "$OUT" in *FAIL*) fail=1 ;; *) fail=0 ;; esac
rm -rf "$TMP"
exit $fail
