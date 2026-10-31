# Marketplace Backend API (TypeScript)

RESTful API untuk aplikasi Online Marketplace (Group 7 Project).
Dibangun dengan **Node.js + Express + TypeScript + MongoDB (Mongoose)** dengan autentikasi **JWT**.

## Fitur

- Autentikasi JWT: register, login, dan endpoint terproteksi (`/me`)
- CRUD produk dengan validasi input (`express-validator`)
- CRUD pengguna (khusus admin) dengan validasi input
- Password di-hash dengan `bcryptjs`
- Route produk (create/update/delete) hanya bisa diakses user yang sudah login
- Route manajemen pengguna hanya bisa diakses user dengan role `admin`
- CORS dikonfigurasi untuk frontend web & mobile

## Prasyarat

- Node.js 18+
- MongoDB berjalan lokal (`mongodb://127.0.0.1:27017`) atau MongoDB Atlas

## Instalasi Lokal

```bash
cd backend
npm install
```

Salin konfigurasi environment:

```bash
cp .env.example .env
```

Sesuaikan isi `.env` (minimal `MONGO_URI` dan `JWT_SECRET`).

## Menjalankan

```bash
# Mode development (auto-reload)
npm run dev

# Isi database dengan data contoh (opsional)
npm run seed

# Build ke JavaScript (output ke dist/)
npm run build

# Jalankan hasil build
npm start
```

Server berjalan di `http://localhost:5000`. Semua endpoint ada di bawah prefix `/api`.

Setelah `npm run seed`, tersedia akun demo:

- Email: `admin@marketplace.com`
- Password: `password123`

## Daftar Endpoint

### Auth

| Method | Endpoint             | Akses     | Deskripsi                  |
| ------ | -------------------- | --------- | -------------------------- |
| POST   | `/api/auth/register` | Public    | Registrasi user baru       |
| POST   | `/api/auth/login`    | Public    | Login, mengembalikan token |
| GET    | `/api/auth/me`       | Protected | Data user dari token       |

### Produk

| Method | Endpoint            | Akses     | Deskripsi                                 |
| ------ | ------------------- | --------- | ----------------------------------------- |
| GET    | `/api/products`     | Public    | Daftar produk (`?search=` & `?category=`) |
| GET    | `/api/products/:id` | Public    | Detail satu produk                        |
| POST   | `/api/products`     | Protected | Buat produk baru                          |
| PUT    | `/api/products/:id` | Protected | Perbarui produk                           |
| DELETE | `/api/products/:id` | Protected | Hapus produk                              |

### Pengguna (khusus admin)

| Method | Endpoint         | Akses | Deskripsi               |
| ------ | ---------------- | ----- | ----------------------- |
| GET    | `/api/users`     | Admin | Daftar seluruh pengguna |
| GET    | `/api/users/:id` | Admin | Detail satu pengguna    |
| POST   | `/api/users`     | Admin | Buat pengguna baru      |
| PUT    | `/api/users/:id` | Admin | Perbarui pengguna       |
| DELETE | `/api/users/:id` | Admin | Hapus pengguna          |

Untuk endpoint protected, sertakan header:

```
Authorization: Bearer <token>
```

## Struktur Folder

```
backend/
├── src/
│   ├── config/db.ts            # Koneksi MongoDB
│   ├── controllers/            # Logika auth, produk & pengguna
│   ├── middleware/             # Verifikasi JWT, guard admin & validasi input
│   ├── models/                 # Skema Mongoose (User, Product)
│   ├── routes/                 # Definisi route + aturan validasi
│   ├── seed.ts                 # Script data contoh
│   └── server.ts               # Entry point aplikasi
├── .env.example
├── tsconfig.json
└── package.json
```
