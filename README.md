# ShotsByVishal — Photography Portfolio

A fully dynamic, professional photography portfolio built with **Next.js 14**, **Sanity CMS**, **Cloudinary**, and **Tailwind CSS**.

## ✨ Features
- 🎨 Dark editorial theme
- 📸 Dynamic gallery with category filters & lightbox
- ✏️ Full CMS — edit everything without touching code
- 📧 Contact form with email notifications
- 🖼️ Cloudinary for optimized image delivery
- 🚀 Deployed free on Vercel

---

## 🚀 Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Sanity CMS (Free)
1. Go to [sanity.io](https://sanity.io) → create account → new project
2. Copy your **Project ID**
3. Run: `npx sanity init --env` to link the project

### 3. Set up Cloudinary (Free)
1. Go to [cloudinary.com](https://cloudinary.com) → create free account
2. Go to Dashboard → copy Cloud Name, API Key, API Secret

### 4. Set up Gmail for contact form
1. Go to Google Account → Security → App Passwords
2. Generate an app password for "Mail"

### 5. Add environment variables
```bash
cp .env.local.example .env.local
# Fill in all values
```

### 6. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 7. Access CMS
Open [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 📁 Project Structure
```
shotsbyvishal/
├── app/
│   ├── page.tsx          # Home (dynamic)
│   ├── about/            # About (dynamic)
│   ├── gallery/          # Gallery (dynamic)
│   ├── contact/          # Contact form
│   ├── studio/           # Sanity CMS
│   └── api/              # API routes
├── components/           # React components
├── sanity/
│   ├── schemas/          # CMS content types
│   └── lib/client.ts     # Sanity queries
└── sanity.config.ts      # Sanity config
```

---

## 🌐 Deploy on Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Add all `.env.local` variables in Vercel dashboard
4. Deploy! 🎉

---

## 💰 Cost
| Service | Cost |
|---------|------|
| Vercel Hosting | Free |
| Sanity CMS | Free (up to 10k docs) |
| Cloudinary | Free (25GB) |
| Domain | ~$10-15/year |
| **Total** | **~$10-15/year** |
