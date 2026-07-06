# Addis Electric — Ethiopian Electrical Goods Online Shop

A full-stack monorepo for **Addis Electric**, an online shop for electrical goods in Addis Abeba, Ethiopia.

## Project Structure

```
├── server/          # Node.js + Express API
├── frontend/        # React + Vite storefront & admin dashboard
```

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Node.js, Express, PostgreSQL (Neon), JWT        |
| Frontend | React, Vite, Tailwind CSS, Redux Toolkit        |
| Images   | Cloudinary                                      |
| Deploy   | Vercel (frontend), Railway/Render (backend)     |

---

## Environment Variables

### Server (`server/.env`)

| Variable               | Description                                      | Example                              |
|------------------------|--------------------------------------------------|--------------------------------------|
| `PORT`                 | API server port                                  | `5000`                               |
| `DATABASE_URL`         | Neon PostgreSQL connection string                | `postgresql://user:pass@host/db`     |
| `JWT_SECRET`           | Secret for signing admin JWT tokens              | `your_secret_key`                    |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name                            | `your_cloud`                         |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                               | `123456789012345`                    |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret                            | `your_api_secret`                    |
| `ADMIN_EMAIL`          | Admin login email                                | `admin@addiselectric.com`            |
| `ADMIN_PASSWORD`       | Admin login password (hashed in DB on init)      | `your_secure_password`               |
| `NODE_ENV`             | `development` or `production`                    | `production`                         |
| `CORS_ORIGIN`          | Allowed frontend origins (comma-separated)       | `https://app.vercel.app,https://example.com,https://www.example.com` |

### Frontend (`frontend/.env`)

| Variable            | Description                          | Example                          |
|---------------------|--------------------------------------|----------------------------------|
| `VITE_API_URL`      | Backend API base URL                 | `http://localhost:5000/api`      |
| `VITE_SITE_URL`     | Public site URL (SEO, sitemap)       | `https://addiselectricshop.online` |
| `VITE_CONTACT_PHONE`| Shop contact number for modal        | `+251 91 000 0000`               |

### Frontend Production (`frontend/.env.production`)

| Variable       | Description              | Example                              |
|----------------|--------------------------|--------------------------------------|
| `VITE_API_URL` | Production API base URL  | `https://your-backend.onrender.com/api` |
| `VITE_SITE_URL` | Canonical public site URL | `https://addiselectricshop.online` |

---

## Local Development

### 1. Database Setup

1. Create a free PostgreSQL database on [Neon](https://neon.tech).
2. Copy the connection string into `server/.env` as `DATABASE_URL`.
3. Initialize tables and seed data:

```bash
cd server
npm install
npm run db:init
```

### 2. Start Backend

```bash
cd server
npm start
# API runs at http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### Default Admin Credentials

Set in `server/.env`, then run `npm run db:init` to create the admin account:
- Email: `ADMIN_EMAIL` (e.g. `admin@addiselectric.com`)
- Password: `ADMIN_PASSWORD`

Login returns a JWT (8h expiry). Passwords are stored bcrypt-hashed in the `admins` table.

---

## API Endpoints

| Method | Endpoint                        | Auth   | Description                |
|--------|---------------------------------|--------|----------------------------|
| GET    | `/health`                       | No     | Health check               |
| POST   | `/api/auth/login`               | No     | Admin login (email + password) → JWT |
| GET    | `/api/items`                    | No     | List items                 |
| POST   | `/api/items`                    | JWT    | Create item                |
| PUT    | `/api/items/:id`                | JWT    | Update item                |
| DELETE | `/api/items/:id`                | JWT    | Delete item                |
| POST   | `/api/items/upload-image`       | JWT    | Upload image to Cloudinary |
| GET    | `/api/categories`               | No     | List categories            |
| GET    | `/api/categories/search?q=`     | No     | Search categories          |
| GET    | `/api/orders`                   | JWT    | List orders (admin)        |
| POST   | `/api/orders`                   | No     | Place order (public)       |
| DELETE | `/api/orders/:id`               | JWT    | Delete order (admin)       |

---

## Deployment

### Frontend — Vercel

1. Connect the `frontend/` directory to Vercel.
2. Set environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
3. `vercel.json` is included for SPA routing.

### Backend — Railway / Render

1. Connect the `server/` directory.
2. Set all server environment variables (see table above).
3. Set `NODE_ENV=production` and `CORS_ORIGIN` to your Vercel URL.
4. Start command: `npm start`
5. Health check path: `/health`

### Database — Neon

Use the Neon connection string as `DATABASE_URL`. Run `npm run db:init` once after first deploy (or run SQL manually).

---

## Scripts

### Server

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm start`     | Start production server        |
| `npm run dev`   | Start with file watch          |
| `npm run db:init` | Create tables + seed data    |

### Frontend

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Development server       |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

---

## License

Private project — Addis Electric.
