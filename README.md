# RAVP Political Party Management Platform

Welcome to the Rashtriya Adarsh Vikas Party (RAVP) Political Party Management Platform! This robust enterprise-grade system handles the entire lifecycle of political party membership, from public awareness to digital identity generation, membership upgrades, and an integrated support ticketing system.

## 🚀 Features

- **Public Landing & Policy Pages**: Beautiful, highly-converting, framer-motion powered pages outlining the party's vision, mission, and policies.
- **Member Registration**: A fully comprehensive registration flow with Email OTP authentication via Resend.
- **Member Dashboard**: A premium, secure member portal built with a clean, government-style aesthetic.
- **Digital Identity Generation**: Automatically generate highly detailed, downloadable Digital Membership Cards (vertical ID) and Membership Certificates (A4 Landscape) using React and HTML2Canvas.
- **Membership Upgrades**: Built-in pathways for users to upgrade from Primary to Lifetime Primary or Lifetime Active memberships using Razorpay.
- **Complaint & Suggestion System**: An integrated ticketing module allowing members to raise concerns, upload attachments (local storage), and communicate with the admin team via a chat interface.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & shadcn/ui
- **Animations**: Framer Motion & Lenis Scroll
- **Database**: PostgreSQL (NeonDB)
- **ORM**: Prisma 7 (with `@prisma/adapter-pg`)
- **Authentication**: Better Auth (Email OTP via Resend)
- **Forms & Validation**: React Hook Form + Zod
- **Utilities**: `qrcode.react`, `html2canvas`

## ⚙️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/aaryavtechnologies-tech/party-member-platform.git
cd party-member-platform
```

### 2. Install dependencies
```bash
npm install
# Note: if you encounter peer dependency issues with Lenis, we have already added legacy-peer-deps=true to .npmrc
```

### 3. Set up environment variables
Create a `.env` file in the root directory and add the following:
```env
# Database (NeonDB)
DATABASE_URL="postgresql://user:password@hostname/neondb?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-string"
BETTER_AUTH_URL="http://localhost:3000"

# Resend (For Email OTPs)
RESEND_API_KEY="re_123456789"

# Razorpay (For Membership Upgrades)
RAZORPAY_KEY_ID="rzp_test_12345"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

### 4. Database Setup (Prisma)
Ensure your Prisma schema is synced and the client is generated:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the development server
```bash
npm run dev
```

Your platform will now be running at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `/src/app/[locale]` - Next.js App Router (Internationalization ready)
- `/src/components` - Reusable UI components (shadcn/ui, custom layouts)
- `/src/lib` - Utility functions, Prisma initialization, Auth configuration
- `/prisma` - Database schema and migration settings
- `/public` - Static assets, images, and localized file uploads (`/public/uploads`)

## 🤝 Contribution Guidelines
When contributing to this repository, please ensure:
1. You are working off a new branch originating from `main`.
2. UI components follow the existing premium design system (Glassmorphism, gradients, smooth transitions).
3. All new database models are reflected in `schema.prisma`.

---
*Built for the Rashtriya Adarsh Vikas Party to drive national development and political transparency.*
