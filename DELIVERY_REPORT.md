# 交付報告

## 檔案清單

- `index.html`
- `css/style.css`
- `js/main.js`
- `README.md`
- `index_before-redesign.html`
- `DELIVERY_REPORT.md`

## 自動檢核

- ✅ **連結對照**：原檔 67 個、新檔 67 個；遺漏 0 個。
- ✅ **逐日項目數**：Day 1 4→4；Day 2 11→11；Day 3 12→12；Day 4 9→9；Day 5 8→8；Day 6 3→3
- ✅ **關鍵字與六日結構**：關鍵字遺漏 0；day-section=6。
- ✅ **Day 2 順序與預約**：順序為返回旭川 → 大黑屋 → 常磐公園；16:00、已預約與抵達備註均存在，舊提醒已移除。
- ✅ **新分頁連結安全**：target=_blank 共 67 個，全部含 rel=noopener。
- ✅ **拆檔與 inline style**：CSS/JS 外部檔案存在；inline style=0。
- ✅ **統一 SVG 圖示**：必要 symbol 遺漏 0；emoji tl-icon=0；emoji tl-tag=0。
- ✅ **減少動態模式**：CSS 停用 animation/transition/花瓣，JS 將 smooth scroll 改為 auto 並停用視差。
- ✅ **375px / 430px 版面防溢位**：100% 寬度、430px 上限、border-box、橫向裁切與長交通 pill 換行規則均已啟用。
- ✅ **正文對比度**：#272A2D / #FDFAF5 = 13.86:1；#4F4F4F / #FFFFFF = 8.19:1；#244B72 / #EBF4FF = 8.14:1；#286B31 / #EFF8EC = 5.96:1
- ✅ **字體與互動技術規格**：三套字體、六級字級變數、Observer、rAF、scroll-spy 與 localStorage 均存在。

## 結論

✅ 全部程式化檢核通過，可直接本地開啟或部署至 GitHub Pages。

---

## 修復驗收附錄：sticky／揭示節奏／跳轉貼齊

驗收日期：2026-07-19

- ✅ **Fix A — sticky 恢復**：已移除 `html` 的 `overflow-x:hidden`；`body` 保留既有橫向防溢位。掃描確認 `html` 與 sticky 祖先鏈沒有 `hidden / auto / scroll` overflow，`.today-banner` 與 `.day-header` 的 sticky 宣告仍存在。
- ✅ **Fix B — 揭示預載**：目標已縮減為 `.tl-item, .season-banner`；延遲為 `0 / 60 / 120ms`；Observer 使用 `threshold:0` 與正向 `rootMargin: 0px 0px 12% 0px`；transition 已縮短為 `.4s`，減少動態模式維持停用。
- ✅ **Fix C — 動態貼齊**：`.day-section` 與 `.toc` 均改用 `var(--sticky-offset, 0px)`；banner 狀態變更、初始化及 rAF 節流的 resize／scroll 更新均會同步實際高度。
- ✅ **內容防呆**：`index.html` SHA-256 修改前後皆為 `2575CDA9153A62CAA2BE59D9AC3CFA5C404A363DD90C250F2F9FBE06C1307587`；67 個 `<a href>` 保持原樣；JavaScript 語法檢查通過。
- ✅ **375px／430px 防溢位回歸**：本次未變更任何寬度或內容規則；`body` 的 430px 上限、`border-box` 與 `overflow-x:hidden` 防線均保留。
- ⚠️ **390×844／430px 瀏覽器互動驗收**：已嘗試啟動本機預覽，但本次工作環境沒有可用的內建瀏覽器執行個體，因此無法執行實際捲動、FAB／TOC 點擊與像素幾何量測。上述結果為程式化規則與不變性驗收；待瀏覽器執行個體可用時仍需補做視覺互動回歸。

---

## 修正驗收附錄：時間軸圖示類別配色

驗收日期：2026-07-19

- ✅ **移除按天配色**：`.day-1`–`.day-6` 搭配 `.tl-icon` 的背景與線條色規則數量為 0；天數識別仍由 day-strip、sticky 標題與進度條負責。
- ✅ **七類配色完整**：transport、food、stay、sightseeing、optional、shopping、activity 的 `:has()` 規則皆存在，並保留中性 fallback `#F3F1EC / #6B6B6B`。
- ✅ **同類跨日一致**：類別顏色只由 `.tl-item:has(.tag-*)` 決定，不含任何 `.day-*` 條件；例如各日住宿均為 `#F5F0FF / #7E58B8`。
- ✅ **同日類別可辨識**：Day 1 含交通／餐飲／住宿三色；Day 2 含交通／餐飲／住宿／景點／購物／活動六色；其餘各日亦依既有 tag 套用固定類別色。
- ✅ **與 tag 同色系**：七類背景色均與對應 tag 完全相同；transport、food、stay、shopping 的文字色亦完全相同，sightseeing、optional、activity 使用同色相的加深版本。
- ✅ **檔案不變性**：`index.html` SHA-256 維持 `2575CDA9153A62CAA2BE59D9AC3CFA5C404A363DD90C250F2F9FBE06C1307587`；`js/main.js` SHA-256 維持 `2426A4AD1A3DE21BE7B85560D96A2902A4B92562B6100E7E5218FF26507DDE00`；67 個行程連結未變。
- ✅ **行為與版面回歸**：本次 CSS 只替換背景色與文字色，未修改尺寸、定位、overflow、sticky、scroll-margin、reveal 或 transition 規則，因此 375px／430px 版面與既有互動邏輯不受影響。
- ✅ **瀏覽器策略**：採用原生 `:has()` 與中性 CSS fallback，不新增 JavaScript fallback。
- ⚠️ **視覺瀏覽器抽查**：已嘗試啟動本機預覽，但本次工作環境仍沒有可用的內建瀏覽器執行個體；配色與不變性已以程式化方式逐類驗證，實際像素畫面待瀏覽器執行個體可用時補測。

---

## 新增驗收附錄：背景配樂「薰衣草微風」

驗收日期：2026-07-19

- ✅ **HTML 僅新增兩行**：移除 `bgmToggle` 按鈕與 `js/bgm.js` script 兩行後，`index.html` SHA-256 回復為原值 `2575CDA9153A62CAA2BE59D9AC3CFA5C404A363DD90C250F2F9FBE06C1307587`。
- ✅ **內容與既有腳本不變**：67 個 `<a href>` 維持不變；Day 1–6 `.tl-item` 數量仍為 4／11／12／9／8／3；`js/main.js` SHA-256 維持 `2426A4AD1A3DE21BE7B85560D96A2902A4B92562B6100E7E5218FF26507DDE00`。
- ✅ **核可程式逐字比對**：統一換行格式後，`js/bgm.js` 與任務第 3 節程式碼完全一致；JavaScript 語法檢查通過。
- ✅ **音色參數凍結**：Chorus `0.15 / 3.5 / 0.18`、spread `8`、pad envelope `3.2 / 5.5`、Filter `1300`、pad 力度 `0.45`、音量 `-17 / -19 / -15 / -21 / -33`、Reverb `5.2 / .35`、Delay `'8n.' / 0.28 / .18` 均逐項存在。
- ✅ **懶載入與無自動播放**：HTML 不含 Tone.js 或 cdnjs URL；CDN script 只由音符鈕 click handler 的 `loadTone()` 動態建立。上次播放狀態只加入 `had-on` 提示，不會呼叫播放。
- ✅ **安靜降級**：CDN 載入失敗時會解除 busy／播放狀態並以按鈕 `title` 提示，不會顯示錯誤視窗。
- ✅ **狀態與分頁邏輯**：播放／停止、`aria-pressed`、本機偏好、背景分頁暫停與回前景續播邏輯均存在；`prefers-reduced-motion` 會停用按鈕及提示光圈動畫。
- ✅ **手機定位規則**：音符鈕 `44px`、`right:14px`、`bottom:88px`，與 `54px` FAB 的右緣對齊且保留 `12px` 垂直間距；桌面置中算法與 FAB 相同。音符鈕 `z-index:39`，低於 FAB 遮罩 `55`。
- ✅ **文件**：README 已加入背景音樂操作、懶載入、不自動播放與 iPhone 靜音鍵限制說明。
- ⚠️ **瀏覽器音訊／Network／375px／430px 實測**：已啟動本機預覽並嘗試連接，但本次工作環境沒有可用的內建瀏覽器執行個體，故無法實際點擊五輪、監看 Console／Network、切換分頁或量測手機畫面；上述項目已完成程式化規則檢核，仍需在可用瀏覽器補測。
- ⚠️ **GitHub Pages HTTPS 實測**：目前工作目錄不是已連結遠端的 Git repository（remote 數量為 0），因此無法推送或取得 Pages HTTPS 網址；需先提供／設定 GitHub repository 後才能完成線上播放驗收。

### 配樂控制位置修正

- ✅ 已移除右下角獨立 fixed 音符鈕，右下區域只保留原有地圖 FAB。
- ✅ 同一個 `#bgmToggle` 已移入置頂今日橫條，位於「回到今天／看行程／重溫」右側；點擊會停止事件冒泡，不會誤觸橫條跳轉。
- ✅ 按鈕縮為 30px 半透明圓鈕；播放中切換為白底深紫音符與輕微白色光暈，減少動態模式仍會停用動畫。
- ✅ `js/bgm.js` 與 `js/main.js` 均未修改，音色、懶載入、播放狀態與分頁暫停邏輯維持不變。
