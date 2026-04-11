# ShotsByVishal — Photography Portfolio

A photography portfolio built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**. Site copy and gallery data live in the repo — edit TypeScript files directly (no hosted CMS or embedded editor).

## ✨ Features
- Dark editorial theme
- Gallery with category filters and lightbox
- Content in `content/` — site settings and photo list
- Contact form with email notifications (optional Gmail)
- Optional Cloudinary API route for programmatic image search (`/api/photos`)
- Deploy on Vercel or any Node host

---

## 🚀 Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Edit content
- **`content/site.ts`** — name, bio paragraphs, hero image URL, publications, stats, social links
- **`content/photos.ts`** — gallery images (URLs, categories, `featured` + `order` for the homepage grid)

### 3. Contact form (optional)
1. Google Account → Security → App Passwords → generate a password for Mail
2. Copy `.env.local.example` to `.env.local` and set `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`

### 4. Cloudinary (optional)
Only needed if you use `/api/photos` or host images on Cloudinary. Add credentials to `.env.local` per `.env.local.example`.

### 5. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
shotsbyvishal/
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── gallery/
│   ├── contact/
│   └── api/              # contact, photos
├── components/
├── content/              # site.ts, photos.ts, types.ts
├── lib/content.ts        # helpers that read content/
└── ...
```

---

## 🌐 Deploy on Vercel
1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables from `.env.local` if you use email or Cloudinary
4. Deploy

---

## 💰 Cost
| Service | Cost |
|---------|------|
| Vercel Hosting | Free tier available |
| Cloudinary | Free tier if used |
| Domain | ~$10–15/year |
| **Total** | **Domain only** if you skip paid add-ons |
