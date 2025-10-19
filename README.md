# Full-Stack Blog Platform# Full-Stack Blog Platform



A production-ready, full-stack blogging platform built with modern web technologies. This project demonstrates end-to-end TypeScript type safety, scalable architecture patterns, and a polished user experience suitable for real-world deployment.A production-ready, full-stack blogging platform built with modern web technologies. This project demonstrates end-to-end TypeScript type safety, scalable architecture patterns, and a polished user experience suitable for real-world deployment.



## 📋 Table of Contents## 📋 Table of Contents



1. [Features Implemented](#features-implemented)1. [Features Implemented](#features-implemented)

2. [Tech Stack](#tech-stack)2. [Tech Stack](#tech-stack)

3. [Architecture & Design Decisions](#architecture--design-decisions)3. [Architecture & Design Decisions](#architecture--design-decisions)

4. [Setup Instructions](#setup-instructions)4. [Setup Instructions](#setup-instructions)

5. [Project Structure](#project-structure)5. [Project Structure](#project-structure)

6. [API Documentation](#api-documentation)6. [API Documentation](#api-documentation)

7. [Development Notes](#development-notes)7. [Development Notes](#development-notes)

8. [Time Investment](#time-investment)

---

---

## ✅ Features Implemented

## ✅ Features Implemented

### Priority 1: Core Functionality (100% Complete)

### Priority 1: Core Functionality (100% Complete)

- [x] **User Authentication**

- [x] **User Authentication**  - Clerk-based authentication with social login support

  - Clerk-based authentication with social login support  - Protected routes and middleware-based authorization

  - Protected routes and middleware-based authorization  - Session management and user context

  - Session management and user context  

  - [x] **Post Management (Full CRUD)**

- [x] **Post Management (Full CRUD)**  - Create, read, update, and delete blog posts

  - Create, read, update, and delete blog posts  - Rich text editor with TipTap (formatting, lists, headings)

  - Rich text editor with TipTap (formatting, lists, headings)  - Auto-generated SEO-friendly slugs

  - Auto-generated SEO-friendly slugs  - Draft/publish status management

  - Draft/publish status management  - Author attribution and timestamps

  - Author attribution and timestamps  

  - [x] **Category System**

- [x] **Category System**  - Full CRUD operations for categories

  - Full CRUD operations for categories  - Many-to-many relationship (posts ↔ categories)

  - Many-to-many relationship (posts ↔ categories)  - Category-based filtering and navigation

  - Category-based filtering and navigation  - Unique slug generation with collision handling

  - Unique slug generation with collision handling  

  - [x] **Type-Safe API Layer**

- [x] **Type-Safe API Layer**  - End-to-end type safety with tRPC

  - End-to-end type safety with tRPC  - Input validation using Zod schemas

  - Input validation using Zod schemas  - Automatic type inference across client/server boundary

  - Automatic type inference across client/server boundary  - Error handling with proper TypeScript types

  - Error handling with proper TypeScript types

### Priority 2: Enhanced User Experience (100% Complete)

### Priority 2: Enhanced User Experience (100% Complete)

- [x] **Search & Filtering**

- [x] **Search & Filtering**  - Real-time search across post titles and content

  - Real-time search across post titles and content  - Multi-category filtering with URL state management

  - Multi-category filtering with URL state management  - Debounced search for performance optimization

  - Debounced search for performance optimization  

  - [x] **Responsive UI/UX**

- [x] **Responsive UI/UX**  - Mobile-first, fully responsive design

  - Mobile-first, fully responsive design  - Loading states with skeleton loaders

  - Loading states with skeleton loaders  - Error boundaries with recovery mechanisms

  - Error boundaries with recovery mechanisms  - Optimistic UI updates with React Query

  - Optimistic UI updates with React Query  - Toast notifications for user feedback

  - Toast notifications for user feedback  

  - [x] **Content Features**

- [x] **Content Features**  - Post preview extraction with intelligent truncation

  - Post preview extraction with intelligent truncation  - Reading time estimation (WPM-based calculation)

  - Reading time estimation (WPM-based calculation)  - Word count and character count analytics

  - Word count and character count analytics  - Featured post capability

  - Featured post capability  

  - [x] **State Management**

- [x] **State Management**  - Zustand stores for global state (filters, editor)

  - Zustand stores for global state (filters, editor)  - Persistent filter state across navigation

  - Persistent filter state across navigation  - Optimized re-rendering with selector-based subscriptions

  - Optimized re-rendering with selector-based subscriptions

### Priority 3: Developer Experience & Quality (90% Complete)

### Priority 3: Developer Experience & Quality (90% Complete)

- [x] **Code Quality**

- [x] **Code Quality**  - Full TypeScript strict mode enabled

  - Full TypeScript strict mode enabled  - Consistent code organization and naming conventions

  - Consistent code organization and naming conventions  - Comprehensive utility library with JSDoc

  - Comprehensive utility library with JSDoc  - Reusable UI component library

  - Reusable UI component library  

  - [x] **Database Layer**

- [x] **Database Layer**  - PostgreSQL with Drizzle ORM

  - PostgreSQL with Drizzle ORM  - Type-safe database queries

  - Type-safe database queries  - Migration system with version control

  - Migration system with version control  - Indexed columns for query optimization

  - Indexed columns for query optimization  

  - [x] **Performance Optimizations**

- [x] **Performance Optimizations**  - React Query caching and deduplication

  - React Query caching and deduplication  - Server-side rendering for SEO

  - Server-side rendering for SEO  - Code splitting and lazy loading

  - Code splitting and lazy loading  - Debounced/throttled event handlers

  - Debounced/throttled event handlers  

  - [ ] **Testing** (Not implemented due to time constraints)

- [ ] **Testing** (Not implemented due to time constraints)  - Unit tests for utility functions

  - Unit tests for utility functions  - Integration tests for tRPC routes

  - Integration tests for tRPC routes  - E2E tests for critical user flows

  - E2E tests for critical user flows

### Additional Features

### Additional Features

- [x] Error recovery with user-friendly messages

- [x] Error recovery with user-friendly messages- [x] Relative time formatting ("2 hours ago")

- [x] Relative time formatting ("2 hours ago")- [x] Search term highlighting in results

- [x] Search term highlighting in results- [x] Empty state components with clear CTAs

- [x] Empty state components with clear CTAs

---

---

## 🛠️ Tech Stack

## 🛠️ Tech Stack

### Core Framework & Language

### Core Framework & Language- **Next.js 15** – React framework with App Router, Server Components, and streaming SSR

- **Next.js 15** – React framework with App Router, Server Components, and streaming SSR- **TypeScript 5.6** – Strict mode enabled for maximum type safety

- **TypeScript 5.6** – Strict mode enabled for maximum type safety- **React 18.3** – Latest concurrent features and suspense boundaries

- **React 18.3** – Latest concurrent features and suspense boundaries

### Backend & Database

### Backend & Database- **PostgreSQL** – Production-grade relational database

- **PostgreSQL** – Production-grade relational database- **Drizzle ORM 0.36** – Type-safe, SQL-like query builder with zero runtime overhead

- **Drizzle ORM 0.36** – Type-safe, SQL-like query builder with zero runtime overhead- **tRPC (next)** – End-to-end typesafe APIs without code generation

- **tRPC (next)** – End-to-end typesafe APIs without code generation- **Zod 3.23** – Runtime schema validation with TypeScript inference

- **Zod 3.23** – Runtime schema validation with TypeScript inference

### Frontend & Styling

### Frontend & Styling- **Tailwind CSS 3.4** – Utility-first CSS framework with custom configuration

- **Tailwind CSS 3.4** – Utility-first CSS framework with custom configuration- **Lucide React** – Consistent icon library (400+ icons)

- **Lucide React** – Consistent icon library (400+ icons)- **TipTap 2.8** – Extensible rich text editor built on ProseMirror

- **TipTap 2.8** – Extensible rich text editor built on ProseMirror- **clsx + tailwind-merge** – Conditional className utilities with conflict resolution

- **clsx + tailwind-merge** – Conditional className utilities with conflict resolution

### State Management & Data Fetching

### State Management & Data Fetching- **Zustand 5.0** – Lightweight, hook-based state management

- **Zustand 5.0** – Lightweight, hook-based state management- **TanStack Query 5.56** (React Query) – Server state management with caching, prefetching, and optimistic updates

- **TanStack Query 5.56** (React Query) – Server state management with caching, prefetching, and optimistic updates- **Immer 9.0** – Immutable state updates with mutable syntax

- **Immer 9.0** – Immutable state updates with mutable syntax

### Authentication & Security

### Authentication & Security- **Clerk 6.33** – Complete authentication solution with social login, session management, and webhooks

- **Clerk 6.33** – Complete authentication solution with social login, session management, and webhooks

### Developer Tools

### Developer Tools- **ESLint 8** + **TypeScript ESLint 8.11** – Code linting with TypeScript-aware rules

- **ESLint 8** + **TypeScript ESLint 8.11** – Code linting with TypeScript-aware rules- **Drizzle Kit 0.28** – Database migration generator and introspection tool

- **Drizzle Kit 0.28** – Database migration generator and introspection tool- **PostCSS + Autoprefixer** – CSS processing and vendor prefixing

- **PostCSS + Autoprefixer** – CSS processing and vendor prefixing

---

---

## 🏛️ Architecture & Design Decisions

## 🏛️ Architecture & Design Decisions

### 1. **tRPC Over REST/GraphQL**

### 1. **tRPC Over REST/GraphQL****Decision:** Use tRPC for API layer  

**Decision:** Use tRPC for API layer  **Rationale:** 

**Rationale:** - Full type safety without code generation or schema duplication

- Full type safety without code generation or schema duplication- Automatic type inference reduces boilerplate by ~60%

- Automatic type inference reduces boilerplate by ~60%- Better DX with IDE autocomplete across client/server boundary

- Better DX with IDE autocomplete across client/server boundary- Smaller bundle size compared to GraphQL clients

- Smaller bundle size compared to GraphQL clients

**Trade-off:** Less suitable for public APIs or non-TypeScript consumers

**Trade-off:** Less suitable for public APIs or non-TypeScript consumers

### 2. **Zustand Over Redux/Context**

### 2. **Zustand Over Redux/Context****Decision:** Zustand for client-side state management  

**Decision:** Zustand for client-side state management  **Rationale:**

**Rationale:**- Minimal boilerplate (no actions, reducers, providers)

- Minimal boilerplate (no actions, reducers, providers)- Hook-based API aligns with React patterns

- Hook-based API aligns with React patterns- Built-in devtools and middleware support

- Built-in devtools and middleware support- ~1KB bundle size vs Redux's ~15KB

- ~1KB bundle size vs Redux's ~15KB

**Trade-off:** Less opinionated structure may require discipline in larger teams

**Trade-off:** Less opinionated structure may require discipline in larger teams

### 3. **Drizzle ORM Over Prisma/TypeORM**

### 3. **Drizzle ORM Over Prisma/TypeORM****Decision:** Drizzle for database layer  

**Decision:** Drizzle for database layer  **Rationale:**

**Rationale:**- SQL-like syntax with full type safety

- SQL-like syntax with full type safety- Zero runtime dependencies (migrations only)

- Zero runtime dependencies (migrations only)- Better performance (no query engine overhead)

- Better performance (no query engine overhead)- Direct PostgreSQL feature support

- Direct PostgreSQL feature support

**Trade-off:** Smaller ecosystem and fewer third-party integrations

**Trade-off:** Smaller ecosystem and fewer third-party integrations

### 4. **App Router Over Pages Router**

### 4. **App Router Over Pages Router****Decision:** Next.js 15 App Router with Server Components  

**Decision:** Next.js 15 App Router with Server Components  **Rationale:**

**Rationale:**- Server Components reduce client bundle by ~30%

- Server Components reduce client bundle by ~30%- Streaming SSR improves perceived performance

- Streaming SSR improves perceived performance- Better data fetching patterns (async components)

- Better data fetching patterns (async components)- Future-proof architecture (Pages Router in maintenance mode)

- Future-proof architecture (Pages Router in maintenance mode)

**Trade-off:** Steeper learning curve and some ecosystem incompatibilities

**Trade-off:** Steeper learning curve and some ecosystem incompatibilities

### 5. **Clerk Over NextAuth/Auth0**

### 5. **Clerk Over NextAuth/Auth0****Decision:** Clerk for authentication  

**Decision:** Clerk for authentication  **Rationale:**

**Rationale:**- Drop-in React components reduce implementation time

- Drop-in React components reduce implementation time- Built-in user management UI

- Built-in user management UI- Middleware-based protection with edge runtime support

- Middleware-based protection with edge runtime support- Generous free tier for MVP

- Generous free tier for MVP

**Trade-off:** Vendor lock-in and potential migration complexity

**Trade-off:** Vendor lock-in and potential migration complexity

### 6. **Monorepo Structure (Single Package)**

### 6. **Monorepo Structure (Single Package)****Decision:** Keep backend/frontend in one Next.js app  

**Decision:** Keep backend/frontend in one Next.js app  **Rationale:**

**Rationale:**- Simplified deployment (single build/deploy target)

- Simplified deployment (single build/deploy target)- Shared types without package linking

- Shared types without package linking- Faster iteration during development

- Faster iteration during development

**Trade-off:** Harder to scale to multiple frontend clients (mobile app, etc.)

**Trade-off:** Harder to scale to multiple frontend clients (mobile app, etc.)

---

---

## 🚀 Setup Instructions

## 🚀 Setup Instructions

### Prerequisites

### Prerequisites- **Node.js** 18.x or higher ([Download](https://nodejs.org/))

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))- **PostgreSQL** 14.x or higher (local install or cloud service)

- **PostgreSQL** 14.x or higher (local install or cloud service)- **npm** or **yarn** package manager

- **npm** or **yarn** package manager- **Clerk Account** ([Sign up free](https://clerk.com))

- **Clerk Account** ([Sign up free](https://clerk.com))

### Step-by-Step Setup

### Step-by-Step Setup

#### 1. Clone the Repository

#### 1. Clone the Repository```bash

```bashgit clone <repository-url>

git clone <repository-url>cd BLOGGG

cd BLOGGG```

```

#### 2. Install Dependencies

#### 2. Install Dependencies```bash

```bashnpm install

npm install# or

# oryarn install

yarn install```

```

#### 3. Configure Environment Variables

#### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

Create a `.env.local` file in the project root:

```env

```env# Database Configuration

# Database Configuration# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASEDATABASE_URL="postgresql://postgres:password@localhost:5432/blog_platform"

DATABASE_URL="postgresql://postgres:password@localhost:5432/blog_platform"

# Clerk Authentication

# Clerk Authentication# Get these from https://dashboard.clerk.com

# Get these from https://dashboard.clerk.comNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."CLERK_SECRET_KEY="sk_test_..."

CLERK_SECRET_KEY="sk_test_..."

# Optional: Clerk Redirect URLs

# Optional: Clerk Redirect URLsNEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"

NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"```

```

#### 4. Set Up PostgreSQL Database

#### 4. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**

**Option A: Local PostgreSQL**```bash

```bash# Create database

# Create databasecreatedb blog_platform

createdb blog_platform

# Or via psql

# Or via psqlpsql -U postgres

psql -U postgresCREATE DATABASE blog_platform;

CREATE DATABASE blog_platform;\q

\q```

```

**Option B: Cloud PostgreSQL** (Supabase, Neon, Railway)

**Option B: Cloud PostgreSQL** (Supabase, Neon, Railway)- Create a new PostgreSQL instance

- Create a new PostgreSQL instance- Copy the connection string to `DATABASE_URL`

- Copy the connection string to `DATABASE_URL`

#### 5. Configure Clerk Authentication

#### 5. Configure Clerk Authentication

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)2. Create a new application

2. Create a new application3. Navigate to **API Keys** and copy:

3. Navigate to **API Keys** and copy:   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   - Secret Key → `CLERK_SECRET_KEY`

   - Secret Key → `CLERK_SECRET_KEY`4. (Optional) Configure allowed redirect URLs in Clerk dashboard

4. (Optional) Configure allowed redirect URLs in Clerk dashboard

#### 6. Generate and Run Database Migrations

#### 6. Generate and Run Database Migrations

```bash

```bash# Generate migration files from schema

# Generate migration files from schemanpm run db:generate

npm run db:generate

# Apply migrations to database

# Apply migrations to databasenpm run db:migrate

npm run db:migrate

# (Optional) Open Drizzle Studio to verify tables

# (Optional) Open Drizzle Studio to verify tablesnpm run db:studio

npm run db:studio```

```

#### 7. Start Development Server

#### 7. Start Development Server

```bash

```bashnpm run dev

npm run dev```

```

The application will be available at **http://localhost:3000**

The application will be available at **http://localhost:3000**

#### 8. Verify Installation

#### 8. Verify Installation

1. Navigate to http://localhost:3000

1. Navigate to http://localhost:30002. Click "Sign In" and create an account via Clerk

2. Click "Sign In" and create an account via Clerk3. Navigate to `/dashboard` to create your first post

3. Navigate to `/dashboard` to create your first post4. Test search and filtering on the home page

4. Test search and filtering on the home page

### Troubleshooting

### Troubleshooting

**Database Connection Issues**

**Database Connection Issues**- Verify PostgreSQL is running: `pg_isready`

- Verify PostgreSQL is running: `pg_isready`- Check credentials in `DATABASE_URL`

- Check credentials in `DATABASE_URL`- Ensure database exists: `psql -l`

- Ensure database exists: `psql -l`

**Clerk Authentication Errors**

**Clerk Authentication Errors**- Verify environment variables are set

- Verify environment variables are set- Clear Next.js cache: `rm -rf .next`

- Clear Next.js cache: `rm -rf .next`- Check Clerk dashboard for allowed domains

- Check Clerk dashboard for allowed domains

**TypeScript Errors**

**TypeScript Errors**- Clear node_modules: `rm -rf node_modules && npm install`

- Clear node_modules: `rm -rf node_modules && npm install`- Restart TS server in VSCode: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

- Restart TS server in VSCode: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

---

---

## 📁 Project Structure

## 📁 Project Structure

```

```BLOGGG/

BLOGGG/├── src/

├── src/│   ├── app/                      # Next.js App Router

│   ├── app/                      # Next.js App Router│   │   ├── api/trpc/[trpc]/     # tRPC endpoint handler

│   │   ├── api/trpc/[trpc]/     # tRPC endpoint handler│   │   ├── posts/               # Post pages (list, detail, edit, create)

│   │   ├── posts/               # Post pages (list, detail, edit, create)│   │   ├── categories/          # Category management

│   │   ├── categories/          # Category management│   │   ├── dashboard/           # Protected user dashboard

│   │   ├── dashboard/           # Protected user dashboard│   │   ├── layout.tsx           # Root layout with providers

│   │   ├── layout.tsx           # Root layout with providers│   │   ├── page.tsx             # Home page (public post list)

│   │   ├── page.tsx             # Home page (public post list)│   │   └── globals.css          # Global styles and Tailwind imports

│   │   └── globals.css          # Global styles and Tailwind imports│   │

│   ││   ├── components/              # React components

│   ├── components/              # React components│   │   ├── ui/                  # Reusable UI primitives

│   │   ├── ui/                  # Reusable UI primitives│   │   │   ├── Button.tsx

│   │   │   ├── Button.tsx│   │   │   ├── Card.tsx

│   │   │   ├── Card.tsx│   │   │   ├── Input.tsx

│   │   │   ├── Input.tsx│   │   │   └── LoadingSpinner.tsx

│   │   │   └── LoadingSpinner.tsx│   │   ├── PostCard.tsx         # Post display component

│   │   ├── PostCard.tsx         # Post display component│   │   ├── FilterBar.tsx        # Search and category filters

│   │   ├── FilterBar.tsx        # Search and category filters│   │   ├── Navbar.tsx           # Navigation with auth state

│   │   ├── Navbar.tsx           # Navigation with auth state│   │   ├── RichTextEditor.tsx   # TipTap editor wrapper

│   │   ├── RichTextEditor.tsx   # TipTap editor wrapper│   │   └── ErrorBoundary.tsx    # Error handling component

│   │   └── ErrorBoundary.tsx    # Error handling component│   │

│   ││   ├── server/                  # Backend (tRPC & database)

│   ├── server/                  # Backend (tRPC & database)│   │   ├── api/

│   │   ├── api/│   │   │   ├── root.ts          # tRPC app router

│   │   │   ├── root.ts          # tRPC app router│   │   │   ├── trpc.ts          # tRPC context and middleware

│   │   │   ├── trpc.ts          # tRPC context and middleware│   │   │   └── routers/         # Feature-based routers

│   │   │   └── routers/         # Feature-based routers│   │   │       ├── post.ts      # Post CRUD operations

│   │   │       ├── post.ts      # Post CRUD operations│   │   │       ├── category.ts  # Category CRUD operations

│   │   │       ├── category.ts  # Category CRUD operations│   │   │       ├── tag.ts       # Tag management (future)

│   │   │       ├── tag.ts       # Tag management (future)│   │   │       └── user.ts      # User profile operations

│   │   │       └── user.ts      # User profile operations│   │   └── db/

│   │   └── db/│   │       └── index.ts         # Drizzle client instance

│   │       └── index.ts         # Drizzle client instance│   │

│   ││   ├── lib/                     # Shared utilities

│   ├── lib/                     # Shared utilities│   │   ├── schema.ts            # Drizzle schema definitions

│   │   ├── schema.ts            # Drizzle schema definitions│   │   ├── validations.ts       # Zod validation schemas

│   │   ├── validations.ts       # Zod validation schemas│   │   ├── utils.ts             # General utility functions

│   │   ├── utils.ts             # General utility functions│   │   ├── db-utils.ts          # Database helper functions

│   │   ├── db-utils.ts          # Database helper functions│   │   └── error-handling.ts    # Error formatting utilities

│   │   └── error-handling.ts    # Error formatting utilities│   │

│   ││   ├── stores/                  # Zustand state stores

│   ├── stores/                  # Zustand state stores│   │   ├── filterStore.ts       # Search and filter state

│   │   ├── filterStore.ts       # Search and filter state│   │   ├── editorStore.ts       # Rich text editor state

│   │   ├── editorStore.ts       # Rich text editor state│   │   └── appStore.ts          # Global app state

│   │   └── appStore.ts          # Global app state│   │

│   ││   ├── trpc/

│   ├── trpc/│   │   └── react.tsx            # tRPC React Query client setup

│   │   └── react.tsx            # tRPC React Query client setup│   │

│   ││   ├── types/

│   ├── types/│   │   └── index.ts             # Shared TypeScript types

│   │   └── index.ts             # Shared TypeScript types│   │

│   ││   ├── contexts/

│   ├── contexts/│   │   └── ThemeContext.tsx     # Theme provider (future dark mode)

│   │   └── ThemeContext.tsx     # Theme provider (future dark mode)│   │

│   ││   └── middleware.ts            # Next.js middleware (auth protection)

│   └── middleware.ts            # Next.js middleware (auth protection)│

│├── drizzle.config.ts            # Drizzle ORM configuration

├── drizzle.config.ts            # Drizzle ORM configuration├── next.config.js               # Next.js configuration

├── next.config.js               # Next.js configuration├── tailwind.config.ts           # Tailwind CSS configuration

├── tailwind.config.ts           # Tailwind CSS configuration├── tsconfig.json                # TypeScript configuration

├── tsconfig.json                # TypeScript configuration└── package.json                 # Dependencies and scripts

└── package.json                 # Dependencies and scripts```

```

### Database Schema (PostgreSQL)

### Database Schema (PostgreSQL)

```sql

```sql-- Posts table

-- Posts tableCREATE TABLE posts (

CREATE TABLE posts (  id SERIAL PRIMARY KEY,

  id SERIAL PRIMARY KEY,  title VARCHAR(255) NOT NULL,

  title VARCHAR(255) NOT NULL,  slug VARCHAR(255) UNIQUE NOT NULL,

  slug VARCHAR(255) UNIQUE NOT NULL,  content TEXT NOT NULL,

  content TEXT NOT NULL,  excerpt TEXT,

  excerpt TEXT,  published BOOLEAN DEFAULT false NOT NULL,

  published BOOLEAN DEFAULT false NOT NULL,  featured BOOLEAN DEFAULT false NOT NULL,

  featured BOOLEAN DEFAULT false NOT NULL,  author_id VARCHAR(255) NOT NULL,  -- Clerk user ID

  author_id VARCHAR(255) NOT NULL,  -- Clerk user ID  created_at TIMESTAMP DEFAULT NOW() NOT NULL,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,  updated_at TIMESTAMP DEFAULT NOW() NOT NULL

  updated_at TIMESTAMP DEFAULT NOW() NOT NULL);

);

CREATE INDEX posts_slug_idx ON posts(slug);

CREATE INDEX posts_slug_idx ON posts(slug);CREATE INDEX posts_published_idx ON posts(published);

CREATE INDEX posts_published_idx ON posts(published);CREATE INDEX posts_author_idx ON posts(author_id);

CREATE INDEX posts_author_idx ON posts(author_id);

-- Categories table

-- Categories tableCREATE TABLE categories (

CREATE TABLE categories (  id SERIAL PRIMARY KEY,

  id SERIAL PRIMARY KEY,  name VARCHAR(100) UNIQUE NOT NULL,

  name VARCHAR(100) UNIQUE NOT NULL,  slug VARCHAR(100) UNIQUE NOT NULL,

  slug VARCHAR(100) UNIQUE NOT NULL,  description TEXT,

  description TEXT,  created_at TIMESTAMP DEFAULT NOW() NOT NULL,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,  updated_at TIMESTAMP DEFAULT NOW() NOT NULL

  updated_at TIMESTAMP DEFAULT NOW() NOT NULL);

);

CREATE INDEX categories_slug_idx ON categories(slug);

CREATE INDEX categories_slug_idx ON categories(slug);

-- Post-Category junction (many-to-many)

-- Post-Category junction (many-to-many)CREATE TABLE posts_to_categories (

CREATE TABLE posts_to_categories (  id SERIAL PRIMARY KEY,

  id SERIAL PRIMARY KEY,  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,

  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,  created_at TIMESTAMP DEFAULT NOW() NOT NULL,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,  UNIQUE(post_id, category_id)

  UNIQUE(post_id, category_id));

);

CREATE INDEX posts_to_categories_post_idx ON posts_to_categories(post_id);

CREATE INDEX posts_to_categories_post_idx ON posts_to_categories(post_id);CREATE INDEX posts_to_categories_category_idx ON posts_to_categories(category_id);

CREATE INDEX posts_to_categories_category_idx ON posts_to_categories(category_id);```

```

---

---

## 📝 Available Scripts

## 📝 Available Scripts

### Development

### Development```bash

```bashnpm run dev          # Start Next.js dev server (http://localhost:3000)

npm run dev          # Start Next.js dev server (http://localhost:3000)npm run type-check   # Run TypeScript compiler in check mode

npm run type-check   # Run TypeScript compiler in check modenpm run lint         # Run ESLint with Next.js config

npm run lint         # Run ESLint with Next.js config```

```

### Production

### Production```bash

```bashnpm run build        # Build optimized production bundle

npm run build        # Build optimized production bundlenpm run start        # Start production server

npm run start        # Start production server```

```

### Database

### Database```bash

```bashnpm run db:generate  # Generate migration files from schema changes

npm run db:generate  # Generate migration files from schema changesnpm run db:migrate   # Apply pending migrations to database

npm run db:migrate   # Apply pending migrations to databasenpm run db:push      # Push schema directly (dev only, skips migrations)

npm run db:push      # Push schema directly (dev only, skips migrations)npm run db:studio    # Launch Drizzle Studio (GUI at http://localhost:4983)

npm run db:studio    # Launch Drizzle Studio (GUI at http://localhost:4983)```

```

---

---

## 📡 API Documentation

## 📡 API Documentation

The application uses **tRPC** for type-safe API communication. All routes are defined in `src/server/api/routers/`.

The application uses **tRPC** for type-safe API communication. All routes are defined in `src/server/api/routers/`.

### tRPC Endpoints

### tRPC Endpoints

#### Post Router (`post.*`)

#### Post Router (`post.*`)

| Procedure | Type | Input | Description |

| Procedure | Type | Input | Description ||-----------|------|-------|-------------|

|-----------|------|-------|-------------|| `getAll` | Query | `{ limit?, cursor?, search?, categoryId? }` | Paginated post list with optional filters |

| `getAll` | Query | `{ limit?, cursor?, search?, categoryId? }` | Paginated post list with optional filters || `getBySlug` | Query | `{ slug: string }` | Single post with categories and author |

| `getBySlug` | Query | `{ slug: string }` | Single post with categories and author || `getById` | Query | `{ id: number }` | Single post by ID |

| `getById` | Query | `{ id: number }` | Single post by ID || `create` | Mutation | `CreatePostInput` | Create new post (auth required) |

| `create` | Mutation | `CreatePostInput` | Create new post (auth required) || `update` | Mutation | `UpdatePostInput` | Update existing post (auth required) |

| `update` | Mutation | `UpdatePostInput` | Update existing post (auth required) || `delete` | Mutation | `{ id: number }` | Soft delete post (auth required) |

| `delete` | Mutation | `{ id: number }` | Soft delete post (auth required) |

#### Category Router (`category.*`)

#### Category Router (`category.*`)

| Procedure | Type | Input | Description |

| Procedure | Type | Input | Description ||-----------|------|-------|-------------|

|-----------|------|-------|-------------|| `getAll` | Query | `{ includePostCount?: boolean }` | All categories with optional post counts |

| `getAll` | Query | `{ includePostCount?: boolean }` | All categories with optional post counts || `getBySlug` | Query | `{ slug: string }` | Single category with details |

| `getBySlug` | Query | `{ slug: string }` | Single category with details || `create` | Mutation | `CreateCategoryInput` | Create category (auth required) |

| `create` | Mutation | `CreateCategoryInput` | Create category (auth required) || `update` | Mutation | `UpdateCategoryInput` | Update category (auth required) |

| `update` | Mutation | `UpdateCategoryInput` | Update category (auth required) || `delete` | Mutation | `{ id: number }` | Delete category (auth required) |

| `delete` | Mutation | `{ id: number }` | Delete category (auth required) |

### Input Schemas (Zod)

### Input Schemas (Zod)

```typescript

```typescript// CreatePostInput

// CreatePostInput{

{  title: string;

  title: string;  content: string;

  content: string;  slug?: string;        // Auto-generated if omitted

  slug?: string;        // Auto-generated if omitted  published?: boolean;  // Default: false

  published?: boolean;  // Default: false  featured?: boolean;   // Default: false

  featured?: boolean;   // Default: false  categoryIds?: number[];

  categoryIds?: number[];}

}

// UpdatePostInput

// UpdatePostInput{

{  id: number;

  id: number;  title?: string;

  title?: string;  content?: string;

  content?: string;  slug?: string;

  slug?: string;  published?: boolean;

  published?: boolean;  featured?: boolean;

  featured?: boolean;  categoryIds?: number[];

  categoryIds?: number[];}

}```

```

### Usage Example

### Usage Example

```typescript

```typescript// Client-side usage with full type safety

// Client-side usage with full type safetyimport { api } from "~/trpc/react";

import { api } from "~/trpc/react";

function PostList() {

function PostList() {  // Query with autocomplete and type inference

  // Query with autocomplete and type inference  const { data, isLoading } = api.post.getAll.useQuery({

  const { data, isLoading } = api.post.getAll.useQuery({    limit: 10,

    limit: 10,    search: "typescript",

    search: "typescript",    categoryId: 5,

    categoryId: 5,  });

  });

  // Mutation with optimistic updates

  // Mutation with optimistic updates  const createPost = api.post.create.useMutation({

  const createPost = api.post.create.useMutation({    onSuccess: () => {

    onSuccess: () => {      // Type-safe cache invalidation

      // Type-safe cache invalidation      api.useUtils().post.getAll.invalidate();

      api.useUtils().post.getAll.invalidate();    },

    },  });

  });

  return (/* ... */);

  return (/* ... */);}

}```

```

## 💡 What I Learned

---

**Type Safety is Amazing**

## 🧪 Development NotesUsing tRPC means I get autocomplete and type checking all the way from the database to the frontend. If I change something on the backend, TypeScript immediately tells me what broke on the frontend. Game changer!



### Code Quality Practices**State Management**

I used Zustand for managing things like filter settings and editor state. It's way simpler than Redux and perfect for projects like this where you don't need super complex state logic.

- **TypeScript Strict Mode**: Enabled for maximum type safety

- **ESLint Configuration**: Extended from `next/core-web-vitals` with TypeScript-aware rules**Modern React Patterns**

- **Consistent Naming**: Server Components, client components, proper data fetching with React Query (through tRPC), and handling loading/error states properly.

  - Components: PascalCase (`PostCard.tsx`)

  - Utilities: camelCase (`formatDate()`)## 🚀 Deployment

  - Constants: UPPER_SNAKE_CASE

- **Import Organization**: Absolute imports with `~` alias for `src/`I deployed this to Vercel since it works seamlessly with Next.js:



### Performance Optimizations1. Push your code to GitHub

2. Import the repo in Vercel

1. **React Query Caching**: 3. Add your environment variables (DATABASE_URL and Clerk keys)

   - Default stale time: 60s4. Deploy!

   - Cache time: 5 minutes

   - Automatic background refetchingYou can also use Railway, Netlify, or any platform that supports Node.js.



2. **Database Indexing**:## 📝 Future Improvements

   - Slug columns for O(1) lookups

   - Foreign keys for efficient joinsSome things I'm planning to add:

   - Published/featured flags for filtering- Tags for posts (in addition to categories)

- Comments system

3. **Bundle Optimization**:- User profiles and author pages

   - Dynamic imports for rich text editor (~200KB)- Image upload for post featured images

   - Server Components for initial render- Dark mode toggle

   - Code splitting by route- Better SEO with metadata



### Security Considerations## � Credits



- **Authentication**: Middleware-based route protectionBig thanks to the open-source community and these awesome tools:

- **Input Validation**: Zod schemas on all mutations- Next.js and Vercel team

- **SQL Injection**: Parameterized queries via Drizzle- tRPC for making APIs fun to work with

- **XSS Prevention**: React's built-in escaping + DOMPurify (planned)- Drizzle for a TypeScript-first ORM

- **CSRF**: Next.js SameSite cookie defaults- Clerk for authentication that just works



### Known Limitations & Future Work---



#### Not Implemented (Due to Time Constraints)**Note**: This is a learning project I built while studying full-stack development. Feel free to fork it, break it, improve it, or use it as a reference for your own projects!
- [ ] Unit/integration test suite
- [ ] Image upload with CDN integration
- [ ] Comment system with moderation
- [ ] User profiles and author pages
- [ ] Tag system (separate from categories)
- [ ] Dark mode implementation
- [ ] Advanced SEO (Open Graph, JSON-LD)
- [ ] Email notifications
- [ ] Rate limiting on API routes

#### Technical Debt
- Pagination could use cursor-based approach for larger datasets
- Error handling could be more granular (distinguish network vs validation errors)
- Rich text editor needs sanitization before render (XSS risk)
- Consider implementing optimistic locking for concurrent edits

---

## 🚀 Deployment

### Recommended: Vercel (Zero-Config)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
# DATABASE_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
```

### Alternative: Docker

```dockerfile
# Dockerfile (example)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Database Hosting Options
- **Neon** (recommended): Serverless PostgreSQL with autoscaling
- **Supabase**: PostgreSQL + additional tools (auth, storage, realtime)
- **Railway**: Simple deployment with PostgreSQL addon
- **AWS RDS/Digital Ocean**: Traditional managed PostgreSQL

---

## ⏱️ Time Investment

**Estimated Development Time: ~40-50 hours** (over 2 weeks)

| Phase | Hours | Details |
|-------|-------|---------|
| Planning & Design | 4h | Schema design, tech stack research, wireframes |
| Setup & Configuration | 3h | Project initialization, tool configuration, environment setup |
| Database & Backend | 12h | Schema definition, tRPC routers, validation, migrations |
| Frontend Components | 10h | UI components, layouts, routing, responsive design |
| Authentication & Auth | 4h | Clerk integration, middleware, protected routes |
| State Management | 5h | Zustand stores, React Query integration, optimistic updates |
| Search & Filtering | 6h | Filter logic, URL state, debouncing, performance tuning |
| Polish & Refinement | 8h | Error handling, loading states, UX improvements, documentation |

**Key Learning Outcomes:**
- End-to-end TypeScript in a production setting
- Modern React patterns (Server Components, Suspense)
- tRPC's benefits and limitations
- PostgreSQL query optimization
- State management trade-offs (Zustand vs Redux)

---

## 🙏 Acknowledgments

This project was built as part of a B.Tech final year curriculum to demonstrate full-stack development proficiency.

**Technologies & Tools:**
- [Next.js](https://nextjs.org/) by Vercel
- [tRPC](https://trpc.io/) by Alex Johansson
- [Drizzle ORM](https://orm.drizzle.team/) by Drizzle Team
- [Clerk](https://clerk.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [TanStack Query](https://tanstack.com/query) by Tanner Linsley
- [Zustand](https://github.com/pmndrs/zustand) by Poimandres

**Inspiration & References:**
- [T3 Stack](https://create.t3.gg/) for project structure
- Next.js documentation and examples
- tRPC example projects

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**B.Tech Final Year Student**  
Built with ❤️ using Next.js, TypeScript, and tRPC

*For educational purposes and portfolio demonstration.*
