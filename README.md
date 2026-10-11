# 生統階梯

從國中數學到可投稿論文的互動式生物統計課程，以手機操作為主要設計。

**線上版**：https://chanwunkong.github.io/biostat-ladder/

## 內容

- **課程**：6 個階段、29 章，從比例與 Σ 符號，到迴歸、存活分析、多重檢定、研究設計與論文寫作。
  每章開頭都有可操作的互動圖；練習題可以一鍵把題目情境帶入同一張圖示範。
- **分析實驗室**：不寫程式的統計分析。支援描述統計／Table 1、t 檢定、配對比較、ANOVA、卡方與 Fisher、相關、線性迴歸、邏輯斯迴歸、Kaplan–Meier／log-rank／Cox、多重檢定（BH）、樣本數計算。
  每項分析都會產生統計表、圖，以及中英文的「統計方法／結果」段落初稿。
- **資料集**：5 份模擬資料（臨床試驗、世代研究、存活資料、基因表現、植物實驗），附編碼簿；
  也可以上傳自己的 CSV／TSV（UTF-8 或 Big5），或從 Excel 直接貼上。資料只在瀏覽器中處理，不會上傳。

## 開發

整個網站是一個不需要伺服器的靜態網頁。

```sh
python3 build.py            # 產生 docs/index.html（GitHub Pages）與 dist/artifact.html
node tests/stats.test.js    # 統計函式對照 R 的參考值，並跑過所有分析
sh tests/smoke.sh           # 無頭 Chrome 載入每一章、按下所有示範按鈕
```

| 檔案 | 內容 |
|---|---|
| `src/core.js` | 統計函式、圖表、模擬資料集、實驗室的各項分析 |
| `src/content.js` | 課程章節與練習題 |
| `src/app.js` | 介面、導覽、實驗室、基本互動圖 |
| `src/widgets.js` | 各章的互動圖 |
| `src/demos.js` | 練習題的圖表示範設定 |
| `src/shell.html` | 頁面樣板與樣式 |

統計結果已對照 R 驗證（t 檢定、Mann–Whitney、log-rank、Fisher 等）。
Cox 模型以 Breslow 法處理同時事件，與 R 預設的 Efron 法在小數點後會有些微差異。

## 限制

- 內建資料皆為模擬資料，僅供學習，不可當成真實研究結果引用。
- 尚未支援混合模型、交互作用項、缺失值插補與比例風險假設檢定。
- 本站可以幫助理解與初步分析，但不能取代統計專業諮詢。

## 授權

程式碼採 [MIT](LICENSE)；課程內容採 [CC BY 4.0](LICENSE-CONTENT.md)。
