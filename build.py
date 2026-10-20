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
SCRIPTS = ["core.js", "content.js", "app.js", "widgets.js", "terms.js", "demos.js", "i18n.js", "lang-en.js", "cloud.js", "start.js"]

HEAD = """<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="從國中數學到可投稿論文的互動式生物統計課程，含不需寫程式的分析實驗室。">
<meta name="app-site" content="pages">
<meta name="theme-color" content="#2F3B99">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
<style>
:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; font: 14px system-ui, sans-serif; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
"""


def phrase_tables():
    """src/lang/<語言>/*.tsv：每行「中文片語<TAB>譯文」，數字已換成 {0}、{1}…；轉成片語字典。"""
    import json
    out = []
    for d in sorted((SRC / "lang").glob("*")):
        ph = {}
        for t in sorted(d.glob("*.tsv")):
            for n, line in enumerate(t.read_text(encoding="utf-8").splitlines(), 1):
                if not line.strip() or line.startswith("#"):
                    continue
                if "\t" not in line:
                    raise SystemExit(f"{t.name}:{n} 缺少 TAB：{line[:40]}")
                k, v = line.split("\t", 1)
                ph[k] = v
        if ph:
            out.append(f"Object.assign(I18N.packs[{json.dumps(d.name)}].ph, {json.dumps(ph, ensure_ascii=False)});")
    return "\n".join(out)


def png_icon(size):
    """App 圖示：靛藍底、白色四階樓梯（純 Python 產生 PNG，不需影像套件）。"""
    import struct, zlib
    bg, fg = (0x2F, 0x3B, 0x99), (0xFF, 0xFF, 0xFF)
    m, steps = size * 0.22, 4  # 邊界留給 maskable 安全區
    w = (size - 2 * m) / steps
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            k = int((x - m) // w) if m <= x < size - m else -1
            top = size - m - (k + 1) * w
            row += bytes(fg if 0 <= k < steps and top <= y < size - m else bg)
        rows.append(bytes(row))
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(b"".join(rows), 9)) + chunk(b"IEND", b""))


def pwa(full):
    """PWA：manifest、圖示、service worker（快取版本＝頁面內容的雜湊，內容一改就換新快取）。"""
    import hashlib, json
    docs = ROOT / "docs"
    for n in (192, 512):
        (docs / f"icon-{n}.png").write_bytes(png_icon(n))
    man = {"name": "生統階梯 Biostat Ladder", "short_name": "生統階梯", "start_url": "./", "scope": "./",
           "display": "standalone", "background_color": "#F3F4F0", "theme_color": "#2F3B99",
           "icons": [{"src": f"icon-{n}.png", "sizes": f"{n}x{n}", "type": "image/png", "purpose": "any maskable"} for n in (192, 512)]}
    (docs / "manifest.webmanifest").write_text(json.dumps(man, ensure_ascii=False, indent=1), encoding="utf-8")
    ver = hashlib.sha1(full.encode()).hexdigest()[:10]
    (docs / "sw.js").write_text((SRC / "sw.js").read_text(encoding="utf-8").replace("__VERSION__", ver), encoding="utf-8")


def build():
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    files = []
    for f in SCRIPTS:
        files.append(SRC / f)
        if f.startswith("lang-"):  # 語言包的分檔：src/lang/<語言>/*.js
            files += sorted((SRC / "lang" / f[5:-3]).glob("*.js"))
    # 片語字典要在 start.js（啟動翻譯）之前載入
    js = "\n".join(p.read_text(encoding="utf-8") for p in files[:-1])
    js += "\n" + phrase_tables() + "\n" + files[-1].read_text(encoding="utf-8")
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
    pwa(full)
    print(f"docs/index.html  {len(full.encode()) // 1024} KB")
    print(f"dist/artifact.html  {len(page.encode()) // 1024} KB")


if __name__ == "__main__":
    build()
