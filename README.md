# Mini Trello - Frontend (Next.js)

This is the **frontend application** for Mini Trello, built with **Next.js (App Router, TypeScript)**.  
It provides the web UI for authentication, boards, cards, notifications, and tasks — connecting to the NestJS backend.

---

## 📂 Project Structure
```
mini-trello-frontend/
├── public/                     # Static assets (favicon, images, etc.)
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── boards/             # Board pages
│   │   ├── github-callback/    # GitHub OAuth callback page
│   │   ├── info/               # Info page
│   │   ├── signin/             # Sign in page
│   │   ├── signup/             # Sign up page
│   │   └── verify/             # Email verification page
│   ├── components/             # Reusable UI components
│   │   ├── auth/               # Auth-related components
│   │   ├── boards/             # Board UI components
│   │   ├── cards/              # Card UI components
│   │   ├── globals/            # Layout / global components
│   │   ├── notifications/      # Notification components
│   │   └── tasks/              # Task-related components
│   ├── lib/                    # Shared utilities
│   │   ├── api.ts              # API client wrapper
│   │   ├── queryClient.ts      # React Query client setup
│   │   └── useTaskRealtime.ts  # Realtime hooks (Socket.io)
│   ├── services/               # API service layers
│   │   ├── auth.ts
│   │   ├── boards.ts
│   │   ├── cards.ts
│   │   ├── notifications.ts
│   │   └── tasks.ts
│   ├── store/                  # Global state (Redux)
│   │   ├── index.ts
│   │   └── userSlice.ts
│   ├── types/                  # Shared TypeScript types
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── providers.tsx           # Context/Providers (React Query, Redux, etc.)
├── .env                        # Environment variables
├── next.config.ts              # Next.js config
├── middleware.ts               # Next.js middleware (auth, redirects)
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables

Create `.env` file like this:

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

### 3. Run development server
```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

### 4. Build & Run production
```bash
npm run build
npm run start
```

---

## 📌 Available Scripts

- `npm run dev` → Start dev server with hot reload  
- `npm run build` → Build project  
- `npm run start` → Run production build  
- `npm run lint` → Run ESLint  

---

## ✅ Features
- Next.js **App Router** with TypeScript  
- Authentication pages (sign in, sign up, GitHub OAuth, email verification)  
- Trello-like UI for boards, cards, tasks  
- State management with **Redux Toolkit**  
- Data fetching & caching with **React Query**  
- Realtime updates via **Socket.io**  
- Modular component architecture  
