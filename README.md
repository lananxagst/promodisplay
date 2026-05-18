# PromoDisplay - MERN Stack

Website satu page untuk menampilkan promosi dengan panel admin.

## Struktur Proyek

```
PromoDisplay/
├── backend/
│   ├── models/Image.js
│   ├── routes/images.js
│   ├── uploads/         (auto-created)
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/Carousel.jsx
    │   ├── pages/CustomerPage.jsx
    │   ├── pages/AdminPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Cara Menjalankan

### Prasyarat
- Node.js v18+
- MongoDB (running di localhost:27017)

### 1. Install & Jalankan Backend
```bash
cd backend
npm install
npm run dev
```
Server berjalan di: http://localhost:5000

### 2. Install & Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di: http://localhost:3000

## Halaman
- **Customer**: http://localhost:3000/
- **Admin**: http://localhost:3000/admin

## API Endpoints
| Method | Endpoint                    | Keterangan                    |
|--------|-----------------------------|-------------------------------|
| GET    | /api/images                 | Semua gambar (admin)          |
| GET    | /api/images/active          | Hanya gambar aktif (customer) |
| POST   | /api/images                 | Upload gambar baru            |
| PATCH  | /api/images/:id/toggle      | Toggle aktif/nonaktif         |
| DELETE | /api/images/:id             | Hapus gambar                  |
