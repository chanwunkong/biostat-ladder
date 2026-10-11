#!/usr/bin/env python3
"""把 src/ 組成單一網頁。

產出：
  docs/index.html      完整 HTML，給 GitHub Pages
  dist/artifact.html   不含 <html>/<head> 外殼，給 Claude Artifact（發佈時會自動補上）
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
# 載入順序有相依性：core（統計、圖表、分析）→ content（課程）→ app（介面）→ widgets（互動圖）→ demos（練習題示範，最後啟動）
SCRIPTS = ["core.js", "content.js", "app.js", "widgets.js", "demos.js"]

HEAD = """<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="從國中數學到可投稿論文的互動式生物統計課程，含不需寫程式的分析實驗室。">
<style>
:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; font: 14px system-ui, sans-serif; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
"""


def build():
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    js = "\n".join((SRC / f).read_text(encoding="utf-8") for f in SCRIPTS)
    if "</script" in js.lower():
        raise SystemExit("原始碼中出現 </script>，會提早結束 script 標籤")
    if "�" in shell + js:
        raise SystemExit("原始碼中有 U+FFFD 替換字元，請改寫成 \\uFFFD")
    page = shell.replace("/*PURE*/\n/*CONTENT*/\n/*APP*/", js)
    if page == shell:
        raise SystemExit("shell.html 找不到 /*PURE*/ /*CONTENT*/ /*APP*/ 佔位符")

    (ROOT / "dist").mkdir(exist_ok=True)
    (ROOT / "dist" / "artifact.html").write_text(page, encoding="utf-8")
    title_end = page.index("</title>") + len("</title>")
    style_end = page.index("</style>") + len("</style>")
    full = HEAD + page[:style_end] + "\n</head>\n<body>\n" + page[style_end:] + "\n</body>\n</html>\n"
    assert title_end < style_end
    (ROOT / "docs").mkdir(exist_ok=True)
    (ROOT / "docs" / "index.html").write_text(full, encoding="utf-8")
    (ROOT / "docs" / ".nojekyll").write_text("", encoding="utf-8")
    print(f"docs/index.html  {len(full.encode()) // 1024} KB")
    print(f"dist/artifact.html  {len(page.encode()) // 1024} KB")


if __name__ == "__main__":
    build()
