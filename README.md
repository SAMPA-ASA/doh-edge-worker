<div dir="rtl">
  
# doh-edge-worker

یک پیاده‌سازی ساده و سبک از **DNS-over-HTTPS** برای Cloudflare Workers.

این پروژه یک endpoint در مسیر زیر ایجاد می‌کند:
<div dir="ltr">
  
```text
/dns-query
```
</div>

و می‌تواند پیام‌های DNS را با فرمت استاندارد DoH دریافت کند و پاسخ مناسب را از یک upstream resolver برگرداند.

## قابلیت‌ها

-   پشتیبانی از مسیر `/dns-query`
-   فوروارد کردن پیام DNS به upstream DoH
-   مناسب برای اجرا روی Cloudflare Workers
-   بدون نیاز به سرور اختصاصی
-   بدون ذخیره‌سازی اطلاعات کاربر در خود کد

## کاربرد
بعد از deploy، endpoint شما چیزی شبیه این خواهد بود:
<div dir="ltr">
  
```text
https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/dns-query
```
</div>

برای استفاده در کلاینت‌هایی که از DNS-over-HTTPS پشتیبانی می‌کنند، کافی است آدرس بالا را به‌عنوان DoH endpoint وارد کنید.

## روش کار
این Worker پیام DNS را از کلاینت دریافت می‌کند. سپس همان پیام را با فرمت `application/dns-message` به یک upstream DoH resolver ارسال می‌کند. پاسخ upstream بدون تغییر به کلاینت برگردانده می‌شود.

این پروژه خودش یک resolver مستقل کامل نیست، بلکه یک endpoint سبک برای دریافت و فوروارد کردن درخواست‌های DNS-over-HTTPS است.

## مجوز
این پروژه می‌تواند تحت مجوز MIT منتشر شود.
<div dir="ltr">
  
```text
MIT License
```
</div>

---
- لینک کانال تلگرام: https://t.me/Sampa_Asa <br>
- راه ارتباطی: https://t.me/Sampa_Asa?direct
---

به امید روزی که همه به اینترنت آزاد واقعی دست پیدا کنیم. 🕊

</div>
