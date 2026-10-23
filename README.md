# CALL OF MARKET — Frontend (ریپوی عمومی)

سایت و پنل ادمین (HTML/CSS/JS ساده). هیچ رمز یا کلیدی در این ریپو نیست؛
رمز ادمین فقط روی سرور بک‌اند (ریپوی خصوصی) نگهداری می‌شود.

## راه‌اندازی
1. در `config.js` آدرس بک‌اند Railway را بنویسید:
   `window.CODM_API = "https://xxxx.up.railway.app";`
2. GitHub → Settings → Pages → Source: *Deploy from a branch* → Branch `main`، Folder `/ (root)` → Save.
3. سایت: `https://USERNAME.github.io/REPO/`  — پنل ادمین: `.../admin.html`
4. در Railway متغیر `ALLOWED_ORIGIN` را `https://USERNAME.github.io` بگذارید.

## فایل‌ها
`index.html` فروشگاه · `admin.html` پنل ادمین · `config.js` آدرس سرور · `css/` · `js/` · `favicon.jpg`
