# 2026 北海道夏日之旅

以手機瀏覽為主的六天五夜北海道靜態行程網站。內容包含航班抵達資訊、每日時間軸、交通、景點、餐飲、住宿、預約資訊與地圖連結，並加入今日偵測、快速跳轉、閱讀進度、捲動揭示、Hero 視差與長清單收合功能。

## 檔案結構

```text
北海道行程/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ main.js
│  └─ bgm.js
├─ README.md
├─ DELIVERY_REPORT.md
└─ index_before-redesign.html
```

`index_before-redesign.html` 是改版前備份與內容比對基準，不會影響網站部署。

## 本地預覽

- 直接雙擊 `index.html` 即可離線瀏覽；Google Fonts 需要網路連線才會載入，未連線時會使用系統字體。
- 或在此資料夾執行 `npx serve`，再開啟終端機顯示的本機網址。

## 背景音樂

置頂今日橫條右側的音符按鈕可播放或停止背景配樂「薰衣草微風」。Tone.js（cdnjs 14.8.49）只會在第一次點擊時載入，不影響頁面初次載入速度。網站會記住上次的開關狀態，但絕不自動播放；若上次為播放狀態，只會顯示提示光圈等待使用者再次點擊。

iPhone 實體靜音鍵開啟時可能沒有聲音，這是 iOS 系統限制；關閉靜音即可播放。

## 部署到 GitHub Pages

### 網頁操作

1. 在 GitHub 建立新的 repository。
2. 將本資料夾內所有檔案與子資料夾上傳到 repository 根目錄。
3. 進入 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 的 Source 選擇 **Deploy from a branch**。
5. Branch 選擇 `main`，資料夾選擇 `/(root)`，按下 **Save**。
6. 等待 GitHub 完成部署後，Pages 畫面會顯示公開網址。

### 指令操作

```bash
git init
git add .
git commit -m "Publish Hokkaido summer itinerary"
git branch -M main
git remote add origin <repo>
git push -u origin main
```

推送完成後，再到 **Settings → Pages → Deploy from a branch → main / (root)** 啟用 Pages。

## 素材與授權

本專案沒有下載或熱連結第三方圖片、SVG 素材。所有線稿圖示均直接內嵌於 `index.html`，不需要額外素材授權。
