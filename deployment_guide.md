# 🚀 Deployment Guide: MarketAI

Panduan untuk deploy aplikasi MarketAI ke **Render (Free Tier)** dengan custom domain dari **Hostinger**.

## 1. Persiapan Repository
Pastikan project lu sudah di-push ke **GitHub** (Private/Public).
Pastikan file `.gitignore` lu sudah benar (tidak meng-upload `.env`).

## 2. Setup Database (Render)
1. Buka [Render Dashboard](https://dashboard.render.com/).
2. Klik **New** -> **PostgreSQL**.
3. Beri nama `marketai-db`.
4. Pilih **Free Tier**.
5. Klik **Create Database**.
6. Simpan **Internal Database URL** dan **External Database URL** untuk nanti.

## 3. Setup Web Service (Render)
1. Klik **New** -> **Web Service**.
2. Hubungkan akun GitHub lu dan pilih repository `marketai`.
3. Atur konfigurasi berikut:
   - **Environment:** `PHP`
   - **Build Command:**
     ```bash
     composer install --no-dev && npm install && npm run build
     ```
   - **Start Command:**
     ```bash
     php artisan migrate --force && apache2-foreground
     ```
     *(Atau sesuaikan dengan server default Render untuk Laravel).*
4. Buka tab **Environment** dan tambahkan:
   - `APP_KEY`: (Ambil dari `.env` lokal lu)
   - `APP_ENV`: `production`
   - `APP_DEBUG`: `false`
   - `APP_URL`: `https://marketai-lu.onrender.com`
   - `DB_CONNECTION`: `pgsql`
   - `DB_URL`: (Masukkan **Internal Database URL** dari langkah sebelumnya)
   - `GEMINI_API_KEY`: (API Key lu)

## 4. Hubungkan Domain Hostinger
1. Buka **Hostinger Panel** -> **Domain** -> **DNS / Nameservers**.
2. Di Dashboard **Render**, buka menu **Settings** -> **Custom Domains**.
3. Klik **Add Custom Domain** dan masukkan domain lu (misal: `marketai.id`).
4. Render bakal ngasih info **CNAME** atau **IP Address**.
5. Di Hostinger, buat record baru:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `marketai-lu.onrender.com`
   - **Type:** `A` (untuk domain utama tanpa www)
   - **Name:** `@`
   - **Points to:** (IP Address yang dikasih Render)

## 5. Optimasi Production
Jangan lupa jalankan ini di server (biasanya otomatis lewat build script):
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## ⚠️ Catatan Free Tier Render
- **Spin Down:** Kalau nggak ada traffic selama 15 menit, server bakal "tidur". Pas dibuka lagi butuh waktu ~30 detik buat bangun.
- **DB Lifetime:** Database Free Tier di Render biasanya expired setelah 90 hari, jadi rajin-rajin backup atau upgrade ke berbayar ($7/mo) kalau udah dipake serius.

---
Selamat deploy, bro! Kalau ada error pas build, langsung kabari gw. 🚀🔥
