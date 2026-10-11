#!/bin/sh
# 用無頭 Chrome 載入每一章，並按下所有「在上方圖表示範這題」按鈕，回報 JavaScript 錯誤。
# 執行：sh tests/smoke.sh（需先 python3 build.py）
cd "$(dirname "$0")/.." || exit 1
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP=$(mktemp -d)
PROBE="$TMP/probe.html"
{
  printf '<script>window.__e=[];addEventListener("error",e=>__e.push(e.message));</script>'
  sed 's#</body>#<script>setTimeout(()=>{let n=0;document.querySelectorAll("[data-demo]").forEach(b=>{try{b.click();n++}catch(x){__e.push(x.message)}});document.title="demos="+n+" errors="+__e.join("|");},1200)</script></body>#' docs/index.html
} > "$PROBE"
fail=0
for h in home c0-1 c0-2 c0-3 c0-4 c1-1 c1-2 c1-3 c1-4 c1-5 c2-1 c2-2 c2-3 c2-4 c3-1 c3-2 c3-3 c3-4 c3-5 c4-1 c4-2 c4-3 c4-4 c4-5 c4-6 c5-1 c5-2 c5-3 c5-4 c5-5 lab data; do
  r=$("$CHROME" --headless=new --disable-gpu --window-size=500,900 --virtual-time-budget=6000 --dump-dom "file://$PROBE#$h" 2>/dev/null | grep -o '<title>[^<]*</title>' | tail -1 | sed 's/<[^>]*>//g')
  case "$r" in *"errors=") echo "ok   $h  $r" ;; *) echo "FAIL $h  $r"; fail=1 ;; esac
done
rm -rf "$TMP"
exit $fail
