# enStudy — 英文每日練習系統

每日英文單字、片語、文法、閱讀的學習系統，內建間隔重複（Spaced Repetition）與多種練習模式。

## 功能

- **每日學習** — 自動分配新單字/片語 + 間隔複習，搭配例句對話
- **測驗** — 選擇題與聽力測驗，根據學習天數漸進增加題數
- **文法** — TOEIC Part 5 風格填空題，含獨立熟練度追蹤
- **閱讀** — 短篇故事搭配理解問答（中英對照）
- **聽力播放** — 瀏覽已學單字並播放發音
- **遊戲** — 配對、拼字、計時挑戰、單字接龍
- **輪次系統** — 自訂每輪學習節奏（每日單字/片語數量）
- **統計** — 學習進度、錯誤追蹤、輪次進度總覽

## 快速開始

### 需求

- Node.js 16+

### 安裝與執行

```bash
# 安裝所有依賴
npm run install:all

# 啟動開發環境（前端 :3000 + 後端 :3001）
npm run dev
```

Windows 使用者可直接執行 `start.bat`。

### 其他指令

```bash
npm run server    # 僅啟動後端
npm run client    # 僅啟動前端
npm run build     # 打包前端到 client/dist
```

## 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | React 18 + Vite + React Router |
| 後端 | Node.js + Express |
| 資料庫 | SQLite（sql.js，記憶體內運行，自動存檔） |
| 語音 | Web Speech API（瀏覽器內建 TTS） |

## 專案結構

```
client/src/
  pages/        — 9 個頁面元件（Dashboard、Learn、Quiz、Grammar…）
  components/   — 共用元件（WordCard、SpellingGame、MatchGame…）
  hooks/        — useApi（API 請求）、useTTS（語音播放）

server/
  routes/       — 8 組 API 路由
  services/     — 核心邏輯（每日排程、間隔重複、對話生成、遊戲…）
  data/         — 字庫（words 1-18）、片語、文法題、故事
  db/           — SQLite 連線、Schema、查詢工具

enstudy.db      — SQLite 資料庫檔案
```

## 學習機制

**間隔重複：** 6 級熟練度，複習間隔為 1 → 3 → 7 → 14 → 30 → 90 天。答錯歸零重來。

**漸進節奏：** 前 7 天每日 5 字，7-21 天每日 10 字，21 天後每日 15 字。輪次系統可自訂。

**字庫規模：** 2000+ 單字、200+ 片語、100+ 文法題、多篇閱讀故事。
