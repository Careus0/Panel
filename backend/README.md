# Sentinel Ubot Backend

Backend sistem yang aman untuk mengelola webapp Sentinel Ubot dengan prioritas utama keamanan dan sistem login menggunakan Telegram yang terintegrasi dengan bot Telegram.

## 🚀 Fitur Utama

### 🔐 Keamanan Tingkat Tinggi
- **Autentikasi Telegram**: Login menggunakan akun Telegram dengan verifikasi bot
- **JWT Token**: Sistem token yang aman dengan refresh token
- **Rate Limiting**: Pembatasan request untuk mencegah abuse
- **Security Headers**: Header keamanan lengkap (CORS, XSS Protection, dll)
- **IP Whitelisting**: Pembatasan akses untuk endpoint admin
- **Request Logging**: Monitoring semua request untuk keamanan

### 🤖 Manajemen Bot
- **CRUD Bot**: Buat, baca, update, dan hapus bot
- **Status Management**: Kontrol status bot (online/offline/restarting/error)
- **Multi-user Support**: Setiap user dapat mengelola multiple bot

### 💳 Sistem Subscription
- **Pricing Plans**: Multiple paket berlangganan
- **Payment Integration**: Sistem pembayaran terintegrasi
- **Payment History**: Riwayat pembayaran lengkap
- **Auto-renewal**: Perpanjangan otomatis subscription

## 🏗️ Arsitektur

```
backend/
├── app/
│   ├── api/                 # API endpoints
│   │   ├── auth.py         # Autentikasi Telegram
│   │   ├── users.py        # Manajemen user
│   │   ├── bots.py         # Manajemen bot
│   │   └── subscriptions.py # Sistem subscription
│   ├── core/               # Konfigurasi inti
│   │   ├── config.py       # Pengaturan aplikasi
│   │   ├── database.py     # Koneksi database
│   │   └── security.py     # Utilitas keamanan
│   ├── middleware/         # Middleware keamanan
│   │   ├── auth.py         # Middleware autentikasi
│   │   ├── rate_limiter.py # Rate limiting
│   │   └── security.py     # Security headers
│   ├── models/             # Database models
│   │   ├── user.py         # Model user
│   │   ├── bot.py          # Model bot
│   │   ├── subscription.py # Model subscription
│   │   └── session.py      # Model session
│   └── schemas/            # Pydantic schemas
│       ├── auth.py         # Schema autentikasi
│       ├── user.py         # Schema user
│       ├── bot.py          # Schema bot
│       └── subscription.py # Schema subscription
├── alembic/                # Database migrations
├── main.py                 # Entry point aplikasi
└── requirements.txt        # Dependencies
```

## 🛠️ Teknologi

- **FastAPI**: Framework web modern dan cepat
- **SQLAlchemy**: ORM untuk database
- **Alembic**: Database migration tool
- **Pydantic**: Validasi data
- **JWT**: Token autentikasi
- **SQLite**: Database (dapat diganti dengan PostgreSQL/MySQL)
- **Uvicorn**: ASGI server

## 📦 Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd sentinel/backend
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Setup environment variables**
```bash
# Buat file .env
SECRET_KEY=your-secret-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
DATABASE_URL=sqlite:///./sentinel.db
```

4. **Initialize database**
```bash
python -m app.initial_data
```

5. **Run aplikasi**
```bash
uvicorn main:app --reload
```

## 🔧 Konfigurasi

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Secret key untuk JWT | - |
| `TELEGRAM_BOT_TOKEN` | Token bot Telegram | - |
| `DATABASE_URL` | URL database | `sqlite:///./sentinel.db` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Durasi token akses | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Durasi refresh token | 7 |

### Telegram Bot Setup

1. Buat bot baru dengan @BotFather di Telegram
2. Dapatkan bot token
3. Set domain yang diizinkan untuk login widget
4. Update `TELEGRAM_BOT_TOKEN` di environment

## 📚 API Documentation

Setelah menjalankan aplikasi, akses dokumentasi API di:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoint Utama

#### Autentikasi
- `POST /api/v1/auth/telegram` - Login dengan Telegram
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh-token` - Refresh token

#### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete user account
- `GET /api/v1/users/me` - Get current user info

#### Bots
- `GET /api/v1/bots` - Get user bots
- `POST /api/v1/bots` - Create new bot
- `GET /api/v1/bots/{bot_id}` - Get specific bot
- `PUT /api/v1/bots/{bot_id}` - Update bot
- `DELETE /api/v1/bots/{bot_id}` - Delete bot
- `PUT /api/v1/bots/{bot_id}/status` - Update bot status

#### Subscriptions
- `GET /api/v1/subscriptions/plans` - Get pricing plans
- `GET /api/v1/subscriptions/current` - Get current subscription
- `POST /api/v1/subscriptions/subscribe` - Subscribe to plan
- `POST /api/v1/subscriptions/cancel` - Cancel subscription
- `GET /api/v1/subscriptions/payments` - Get payment history

## 🔒 Keamanan

### Fitur Keamanan

1. **Telegram Authentication**: Verifikasi autentik melalui Telegram
2. **JWT Tokens**: Token yang aman dengan expiration
3. **Rate Limiting**: Pembatasan request per IP
4. **CORS Protection**: Konfigurasi CORS yang aman
5. **Security Headers**: Header keamanan standar
6. **Input Validation**: Validasi input menggunakan Pydantic
7. **SQL Injection Protection**: Menggunakan ORM SQLAlchemy
8. **Request Logging**: Log semua request untuk monitoring

### Best Practices

- Gunakan HTTPS di production
- Set SECRET_KEY yang kuat dan unik
- Backup database secara berkala
- Monitor log untuk aktivitas mencurigakan
- Update dependencies secara berkala

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
```bash
SECRET_KEY=your-production-secret-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
DATABASE_URL=postgresql://user:password@localhost/sentinel
ENVIRONMENT=production
```

2. **Database Migration**
```bash
alembic upgrade head
```

3. **Run with Gunicorn**
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## 📝 Database Schema

### Users
- `id`: Primary key
- `telegram_id`: Telegram user ID
- `username`: Telegram username
- `first_name`: First name
- `last_name`: Last name
- `photo_url`: Profile photo URL
- `is_active`: Account status
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### Bots
- `id`: Primary key
- `user_id`: Foreign key to users
- `name`: Bot name
- `token`: Bot token
- `status`: Bot status (online/offline/restarting/error)
- `config`: Bot configuration (JSON)
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

### Subscriptions
- `id`: Primary key
- `user_id`: Foreign key to users
- `plan_id`: Foreign key to pricing plans
- `status`: Subscription status
- `started_at`: Start date
- `expires_at`: Expiration date
- `auto_renew`: Auto renewal flag

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🆘 Support

Untuk bantuan dan support:
- Buat issue di GitHub
- Hubungi tim development
- Baca dokumentasi API

---

**Sentinel Ubot Backend** - Sistem backend yang aman dan scalable untuk manajemen bot Telegram.
