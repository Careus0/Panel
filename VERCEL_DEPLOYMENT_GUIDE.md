# Panduan Deploy ke Vercel dan Fix Telegram Bot Domain

## 1. Deploy ke Vercel

### Frontend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy frontend
cd frontend
vercel

# Ikuti prompt:
# - Project name: sentinel-ubot (atau nama yang Anda inginkan)
# - Framework: Next.js
# - Root directory: ./
```

### Backend Deployment
```bash
# Deploy dari root directory
cd ..
vercel

# Ikuti prompt:
# - Project name: sentinel-ubot-api (atau nama yang Anda inginkan)
# - Framework: Other
# - Root directory: ./
```

## 2. Set Environment Variables di Vercel

### Frontend Environment Variables
Di Vercel Dashboard > Project > Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-project.vercel.app/api
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=Mr_Sakamotobot
NEXT_PUBLIC_APP_NAME=Sentinel Ubot
NEXT_PUBLIC_APP_URL=https://your-frontend-project.vercel.app
```

### Backend Environment Variables
```
SECRET_KEY=your-super-secret-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_BOT_USERNAME=Mr_Sakamotobot
DATABASE_URL=sqlite:///tmp/sentinel.db
VERCEL_ENV=production
```

## 3. Fix Telegram Bot Domain

### Step 1: Update Bot Domain di @BotFather
1. Buka Telegram dan chat dengan @BotFather
2. Ketik `/setdomain`
3. Pilih bot Anda: `@Mr_Sakamotobot`
4. Masukkan domain Vercel frontend Anda:
   ```
   https://your-frontend-project.vercel.app
   ```

### Step 2: Verifikasi Bot Username
1. Chat dengan @BotFather
2. Ketik `/mybots`
3. Pilih bot Anda
4. Pastikan username bot benar: `Mr_Sakamotobot`

### Step 3: Test Widget
1. Buka aplikasi di browser: `https://your-frontend-project.vercel.app`
2. Go to login page
3. Widget Telegram seharusnya muncul tanpa error "Bot domain invalid"

## 4. Troubleshooting

### Jika masih error "Bot domain invalid":

1. **Periksa Format Domain**
   - Pastikan menggunakan HTTPS
   - Tidak ada trailing slash
   - Format: `https://your-project.vercel.app`

2. **Clear Browser Cache**
   - Clear cache dan cookies
   - Refresh halaman

3. **Wait for Propagation**
   - Perubahan domain di Telegram butuh waktu 5-10 menit
   - Tunggu sebelum test ulang

4. **Periksa Bot Token**
   - Pastikan TELEGRAM_BOT_TOKEN benar di environment variables
   - Test dengan command `/getMe` di Telegram

### Jika API Error setelah login:

1. **Check Backend URL**
   - Pastikan NEXT_PUBLIC_API_URL mengarah ke backend yang benar
   - Test: `https://your-backend-project.vercel.app/api/health`

2. **Check CORS**
   - Backend sudah dikonfigurasi untuk domain Vercel
   - Verifikasi di backend/app/core/config.py

## 5. Commands untuk @BotFather

```
/start
/setdomain
[Pilih bot: @Mr_Sakamotobot]
https://your-frontend-project.vercel.app

# Untuk verifikasi:
/mybots
[Pilih bot Anda]
Bot Settings
Domain
```

## 6. Final Steps

1. **Redeploy setelah environment variables diset**
   ```bash
   vercel --prod
   ```

2. **Test Complete Flow**
   - Buka aplikasi
   - Test login dengan Telegram
   - Verifikasi redirect ke dashboard
   - Test API calls

## 7. URLs yang Perlu Dicatat

- Frontend: `https://your-frontend-project.vercel.app`
- Backend API: `https://your-backend-project.vercel.app/api`
- API Docs: `https://your-backend-project.vercel.app/api/docs`
- Health Check: `https://your-backend-project.vercel.app/api/health`

Setelah mengikuti panduan ini, aplikasi Anda akan berjalan di Vercel dan Telegram login widget akan berfungsi dengan baik.
