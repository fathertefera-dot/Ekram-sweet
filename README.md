# Iku Sweet Cake

A complete production-ready cake ordering ecommerce website built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

### Public Website
- **Home Page** - Hero banner, featured products, categories, about preview, contact info
- **Products** - Product grid with category filter, search, and pagination
- **Product Details** - Image gallery, variant selection, cake message, add to cart
- **Cart** - Add/remove items, update quantities, cart summary
- **Checkout** - Guest checkout, customer information, payment method selection
- **Order Success** - Order confirmation with order number
- **Track Order** - Track order status without login
- **About Us** - Business story and values
- **Contact Us** - Contact information and social links
- **Auth** - Login and registration with Supabase Auth

### Admin Dashboard
- **Dashboard** - Overview stats (total orders, pending, delivered, products)
- **Orders** - View orders, update status, cancel with reason
- **Products** - CRUD operations, image management, variant management
- **Categories** - CRUD operations with images
- **Banners** - Homepage banner management
- **Settings** - Business info, payment toggles, SEO, Telegram notifications

### Technical Features
- Next.js 15 App Router with Server Components
- TypeScript with strict mode
- Tailwind CSS + shadcn/ui components
- Supabase PostgreSQL database
- Row Level Security (RLS) policies
- Telegram notifications for new orders
- SEO optimized (sitemap, robots.txt, dynamic metadata)
- Mobile-first responsive design
- Guest cart with session management
- Form validation with Zod

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Notifications**: Telegram Bot API
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
cd iku-sweet-cake
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to the SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. Run the seed file: `supabase/seed.sql`
5. Enable Email provider in Authentication > Providers
6. Create storage buckets: `products`, `banners`, `branding`, `about`

### 4. Set Admin User

After registering your first user, run this SQL to make them admin:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## Database Schema

### Tables
- `profiles` - User profiles with roles
- `categories` - Product categories
- `products` - Cake products
- `product_images` - Product image gallery
- `product_variants` - Size/price variants
- `carts` - Shopping carts
- `cart_items` - Cart items with cake messages
- `orders` - Customer orders
- `order_items` - Order line items
- `banners` - Homepage banners
- `settings` - Business settings

### Storage Buckets
- `products` - Product images
- `banners` - Banner images
- `branding` - Logo and favicon
- `about` - About page image

## Deployment

### Vercel
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── (public)/     # Public website pages
│   │   ├── api/          # API routes
│   │   └── layout.tsx    # Root layout
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── public/       # Public components
│   │   └── admin/        # Admin components
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seed.sql          # Seed data
├── public/
│   └── images/           # Static images
└── package.json
```

## License

MIT
