# Misurata Center for Entrepreneurship & Business Incubators

**Affiliated with Misurata College of Industrial Technology**

---

<p align="center">
  <img src="./public/assets/icons/college.png" alt="Misurata College Logo" width="150" />
  <img src="./public/assets/icons/logo.svg" alt="Misurata Center for Entrepreneurship & Business Incubators Logo" width="150" />
</p>

## Table of Contents
1. [Overview](#overview)
2. [Features & Core Services](#features--core-services)
3. [Tech Stack & Architecture](#tech-stack--architecture)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Usage](#usage)
8. [Administrator Dashboard](#administrator-dashboard)
9. [Enhancements & Roadmap](#enhancements--roadmap)
10. [Email Workflow](#email-workflow)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview
This is the official web platform for the Misurata Center for Entrepreneurship and Business Incubators. It empowers students, innovators, collaborators, and administrators by providing:
- Real‑time news and event updates
- Publication of strategic plans and milestones
- An interactive Q&A module
- Submission portals for innovators and creators
- A sponsorship channel for collaborators and supporters
- **Automatic Arabic-English translation** for all user-facing content

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma, the platform emphasizes performance, modularity, and comprehensive internationalization (i18n) with real-time translation capabilities.
---

## Features & Core Services
1. **News & Activities**: Curated channel for the latest news and events.
2. **Strategic Plan**: Detailed publication of college and center strategies.
3. **Quick Q&A**: Instant answers for FAQs and knowledge base.
4. **Innovators & Creators**: Project submission and approval workflow.
5. **Collaborators & Supporters**: Registration for sponsors, experts, and donors.
6. **Automatic Translation**: Seamless real-time translation between Arabic and English for all platform content.

---

## Tech Stack & Architecture
- **Frontend**: Next.js (React) + TypeScript + Tailwind CSS
- **Backend**: Hono.js API Routes + tRPC (RPC patterns) + Prisma ORM
- **Database**: MySql (managed via Prisma migrations)
- **Authentication**: NextAuth.js (Credential & OAuth support)
- **Email & Queue**: BullMQ (Redis) + Nodemailer / SendGrid
- **i18n**: Next.js built-in internationalization with automatic translation routing
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions

### Project Structure
```
src/
├── app/                # Next.js App Router (layouts & pages)
├── features/           # Domain modules (news, innovators, collaborators)
├── components/         # Reusable UI & layout components
├── lib/                # Utilities (db, rpc, email, utils)
├── prisma/             # Schema & migrations
├── public/             # Static assets (images, fonts, icons)
├── i18n/               # Localization setup
└── middleware.ts       # Route guards & RBAC
```

---

## Prerequisites
- Node.js (v18+)
- bun or npm
- Mysql
- Redis (for queue workers)

---

## Installation & Setup
1. **Clone repository**
   ```bash
   git clone https://github.com/mohammed3200/website.git
   cd website
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or bun install
   ```
3. **Generate Prisma client**
   ```bash
   npx prisma generate
   # or bunx prisma generate
   ```
4. **Run migrations**
   ```bash
   npx prisma migrate deploy
   # or bunx prisma migrate deploy
   ```
5. **Seed database** (optional)
   ```bash
   npm run seed
   # or bun run seed
   ```

---

## Usage
- **Development**
  ```bash
  npm run dev
  # or bun run dev
  ```
- **Production Build**
  ```bash
  npm run build
  npm start
  # or bun run build
  # or bun start
  ```
- **Running Dashboard Worker**
  ```bash
  npm run worker
  # or bun run worker
  ```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the dashboard.

---

## Administrator Dashboard
Protected under `/admin/*`, the dashboard offers:
- **Analytics**: Overview of pending approvals, user stats
- **Content Management**: CRUD interfaces for News, Strategic Plan, FAQs
- **Submission Review**: Approve or reject innovators and collaborators
- **User Management**: Create/Edit admin accounts and roles

### Dashboard Structure
```
/pages/admin/
├── login.tsx
├── dashboard.tsx
├── news/        # Manage articles
├── strategic/   # Strategic plan entries
├── faq/         # FAQs moderation
├── innovators/  # Projects review
└── collaborators/ # Sponsors management
```

---

## Enhancements & Roadmap
- **Full‑Text Search**: Integrate Algolia or Elasticsearch
- **Real‑Time Q&A**: Socket.io for live chat support
- **Audit Logs**: Immutable logs of admin actions
- **Mobile App API**: GraphQL endpoint for React Native companion apps
- **Accessibility**: Automated ARIA and color-contrast audits

---

## Email Workflow
Transactional emails for approval/rejection:
1. Admin triggers action in dashboard
2. Frontend calls `/api/admin/notifications`
3. BullMQ enqueues email job
4. Worker sends localized email via SendGrid/Nodemailer

Templates are stored in `src\app\admin\settings\email-templates` using Handlebars.

---

## Contributing
1. Fork the repo and create a feature branch
2. Follow code style and testing guidelines
3. Submit a pull request with descriptive details

Please review `CONTRIBUTING.md` for more details.

---

## License
Distributed under the MIT License. See `LICENSE` for details.
