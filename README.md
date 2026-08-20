# 🎬 Memeify - Interactive Meme Generator & Editor

Memeify is a premium Next.js-based web application that allows users to discover, upload, and customize meme templates using an advanced, interactive Canvas editor. 

Built with modern web standards, Memeify offers rich micro-interactions, an intuitive meme canvas editor, and serverless backend storage.

---

## ✨ Features

- **🎨 Advanced Canvas Editor (Fabric.js)**:
  - Custom text manipulation (add, resize, color, and customize text font, stroke, and outline).
  - Drawing Mode: Freehand pen tool with canvas interactions.
  - History State Tracking (Undo / Redo).
  - Canvas utilities: Horizontal / Vertical flipping, object copying, and Zoom In/Out.
  - Direct download of generated memes.
- **🔍 Template Discovery**:
  - Live query search for filtering templates instantly.
  - Category tabs (`Top` vs. `Trendy`) to explore popular meme layouts.
- **📁 Cloud-Powered Template Uploads**:
  - Upload custom blank layouts directly via a public upload page.
  - Secured image storage backed by **Cloudinary**.
- **🔒 Admin Portal & Moderation**:
  - Secure admin route powered by **NextAuth**.
  - Access controlled template uploading.
- **⚡ Fully Database-Driven (Neon & Drizzle)**:
  - Persistent user and template metadata hosted on a Neon Serverless Postgres DB.
  - Typesafe database queries with Drizzle ORM.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Canvas Rendering**: [Fabric.js](http://fabricjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Hosting**: [Neon Serverless Postgres](https://neon.tech/)
- **Image Hosting & Processing**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: Vanilla CSS & Tailwind CSS v4
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```bash
├── drizzle/              # Drizzle migrations and generated SQL schemas
├── src/
│   ├── app/              # Next.js App Router (pages, api routes, layout)
│   │   ├── admin/        # Admin portal page
│   │   ├── api/          # Serverless API routes (auth, templates)
│   │   ├── upload/       # Template upload portal
│   │   ├── layout.tsx    # App root layout & providers
│   │   └── page.tsx      # Landing page / template gallery
│   ├── components/       # Reusable React components (MemeEditor, AuthProvider)
│   ├── db/               # Database client config and Schema definitions
│   └── lib/              # Client libraries & configs (Auth, Cloudinary client)
├── package.json          # Node dependencies and scripts
└── drizzle.config.ts     # Drizzle config file
```

---

## ⚙️ Configuration & Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Database Configuration (Neon Postgres)
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"

# Cloudinary Integration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Authentication & Security
ADMIN_PASSWORD="your_admin_secret_password"
NEXTAUTH_SECRET="your_nextauth_signing_secret"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🚀 Getting Started

### 1. Install Dependencies

Use `pnpm` to install all necessary packages:

```bash
pnpm install
```

### 2. Prepare the Database

Generate and push schemas to your database:

```bash
# Push schema changes to Neon DB
pnpm exec drizzle-kit push
```

### 3. Run the Development Server

Start the local server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start meme-ing!

### 4. Build for Production

Compile a production-ready build:

```bash
pnpm build
pnpm start
```
