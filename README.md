# EBIC Website - Misurata Entrepreneurship Center

**Center for Entrepreneurship & Business Incubators - Misurata**  
**Affiliated with Misurata College of Industrial Technology**

<p align="center">
  <img src="./public/assets/icons/college.svg" alt="Misurata College Logo" width="120" />
  <img src="./public/assets/icons/logo.svg" alt="EBIC Logo" width="120" />
</p>

<p align="center">
  <strong>Production-Ready | Bilingual (AR/EN) | Cost-Optimized | Secure</strong>
</p>

---

## 🎯 Highlights

### ✨ Production Ready (v2.1)

- **100% deployment-ready** for Virtuozzo Application Platform
- Comprehensive deployment documentation
- Production secrets generated and secured
- **40% infrastructure cost reduction** achieved

### 🚀 Key Achievements

- **97% storage cost savings** - S3 migration complete (AWS/Cloudflare R2)
- **High Performance** - Redis caching + BullMQ queues for email/WhatsApp
- **Enterprise-grade security** - RBAC with automated integrity verification
- **Professional UX** - Multi-page forms with validation and persistence
- **Bilingual platform** - Full Arabic (RTL) / English (LTR) support

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Getting Started](#-getting-started)
4. [Production Deployment](#-production-deployment)
5. [Project Structure](#-project-structure)
6. [Development](#-development)
7. [Testing](#-testing)
8. [Documentation](#-documentation)
9. [License](#-license)

---

## 🌟 Features

### User-Facing Features

#### **Multi-Page Registration Forms** ✅

Professional 4-step workflows with smart validation and auto-save:

**Innovators & Creators:**

1. Personal Information (name, contact, location)
2. Project Overview (title, description, category)
3. Project Details (goals, stage, funding)
4. Review & Submit

**Collaborators & Supporters:**

1. Company Information (name, contact, website)
2. Industry & Expertise (sector, capabilities)
3. Resources & Support (services, funding)
4. Review & Submit

**Features:**

- ✅ Form state persistence (localStorage)
- ✅ Step-by-step validation (React Hook Form + Zod)
- ✅ Progress indicators
- ✅ File uploads (images, documents) → S3
- ✅ Bilingual forms (Arabic/English)
- ✅ Mobile-responsive design

#### **Content Management**

- **News & Activities** - Latest updates and events
- **Strategic Plans** - College and center goals/milestones
- **FAQ Section** - Quick answers and knowledge base
- **About Pages** - Entrepreneurship center, Business incubators

#### **Internationalization (i18n)** 🌍

- Full bilingual support (Arabic default, English)
- **RTL (Right-to-Left)** layout for Arabic
- **LTR (Left-to-Right)** layout for English
- Automatic locale detection
- URL-based routing (`/ar/*`, `/en/*`)

### Admin Features

#### **Dashboard** 📊

- Analytics overview (pending approvals, user stats)
- Quick actions and shortcuts
- Notification center

#### **Content Management**

- **News Management** ✅ - Create, edit, publish articles with S3 image support
- **FAQ Management** - Organize Q&A content
- **Strategic Plans** - Publish goals and strategies

#### **Submission Review**

- **Innovators** - Review and approve/reject projects
- **Collaborators** - Review and approve/reject sponsors
- Status updates with email notifications

#### **User Management**

- Role-Based Access Control (RBAC)
- User invitations
- Permission management
- **4 System Roles:**
  - Super Admin (full access)
  - Admin (content + submissions)
  - Editor (content only)
  - Viewer (read-only)

#### **Email Templates**

- Customizable email templates
- Bilingual support
- Preview before send

### Security Features 🔒

#### **Authentication & Authorization**

- NextAuth.js v5 with database sessions
- Credentials authentication
- OAuth providers (Google, GitHub)
- Two-factor authentication (2FA)
- Password reset flow

#### **RBAC System**

- Resource-action permission model
- Role inheritance
- Middleware-based route protection
- **RBAC Integrity Verification** ✅
  - Automated verification script
  - 6 security checks
  - Command: `bun run rbac:verify`

### Infrastructure Features 🏗️

#### **S3 Storage System** ✅ (v2.0)

- **97% cost reduction** vs database BLOBs
- AWS S3 support (Free Tier Year 1)
- Cloudflare R2 support (Free 10GB forever)
- MinIO support (local development)
- Automatic image optimization
- CDN-ready URLs

#### **Email System**

- Transactional emails (submission confirmations, status updates)
- React Email templates
- SMTP configuration (Gmail, SendGrid)
- Email logging and tracking

#### **Database**

- **MySQL 8.0** (production)
- Prisma ORM with type safety
- Automated migrations
- Seed scripts for development

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 16.1.1 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **State:** Zustand + TanStack Query
- **i18n:** next-intl (bilingual support)

### Backend

- **API:** Hono.js (lightweight, fast)
- **ORM:** Prisma (type-safe database access)
- **Database:** MySQL 8.0
- **Auth:** NextAuth.js v5 (Credentials + OAuth + 2FA)
- **Storage:** AWS S3 / Cloudflare R2 / MinIO (Replaced DB BLOBs)
- **Email:** Nodemailer + React Email (Direct SMTP)
- **Cache:** Redis (Caching Layer)
- **i18n:** next-intl (Arabic/English with RTL support)

### DevOps

- **Containerization:** Docker (multi-stage builds)
- **Deployment:** Virtuozzo Application Platform
- **CI/CD:** GitHub Actions (ready)
- **Testing:** Jest + React Testing Library

### **Tech Stack Evolution (v2.0)**

| Component         | Before         | After v2.0     | Impact                          |
| ----------------- | -------------- | -------------- | ------------------------------- |
| **Storage**       | Database BLOBs | S3 (AWS/R2)    | **-97% cost**                   |
| **Database**      | MariaDB 10.11  | MySQL 8.0      | Production compatible           |
| **Email Queue**   | Direct SMTP    | Redis + BullMQ | Restored for queues and caching |
| **Total Savings** | -              | -              | **-40% infrastructure cost**    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v20 recommended)
- **Package Manager:** bun (recommended) or npm
- **Database:** MySQL 8.0
- **S3 Provider:** AWS S3, Cloudflare R2, or MinIO

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/mohammed3200/website.git
cd website
```

#### 2. Install Dependencies

```bash
# Using bun (recommended)
bun install

# OR using npm
npm install
```

#### 3. Configure Environment

```bash
# Copy template
cp .env.example .env

# Edit .env with your configuration
# See "Environment Variables" section below
```

#### 4. Set Up Database

```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy

# Seed database (optional)
bun run seed

# Seed RBAC system (required)
bun run seed:rbac

# Verify RBAC integrity
bun run rbac:verify
```

#### 5. Set Up S3 (Choose one)

**Option A: MinIO (Local Development)**

```bash
# Start MinIO with docker-compose
docker-compose up -d minio

# Create bucket
bun run setup:minio
```

**Option B: AWS S3 (Production)**

```bash
# Create S3 bucket in AWS Console
# Get access credentials
# Add to .env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
```

**Option C: Cloudflare R2 (Production)**

```bash
# Create R2 bucket in Cloudflare Dashboard
# Get access credentials
# Add to .env with S3_ENDPOINT
```

#### 6. Run Development Server

```bash
bun run dev
# Visit http://localhost:3000
```

### Environment Variables

Create `.env` file with the following (see `.env.production.template` for all options):

```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/citcoder_eitdc"

# Auth
NEXTAUTH_SECRET="your-secret-here"  # Generate: bunx tsx -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
NEXTAUTH_URL="http://localhost:3000"

# Admin
INIT_ADMIN_EMAIL="ebic@cit.edu.ly"
INIT_ADMIN_PASSWORD="SecurePassword123!"

# Email (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-specific-password"  # Not your Gmail password!
EMAIL_FROM="your-email@gmail.com"

# S3 Storage (MinIO for development)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET_NAME="ebic-media"
S3_PUBLIC_ACCESS="true"

# Redis (required)
REDIS_URL="redis://localhost:6379"

# WhatsApp (required for messaging)
WHATSAPP_API_URL="http://wapi:3000"
WHATSAPP_API_TOKEN="secret"
WHATSAPP_SENDER_NUMBER="1234567890"
```

---

## 🌐 Production Deployment

### Quick Deploy (Recommended: Git-Based)

1. **Push to Git Repository**

   ```bash
   git push origin main
   ```

2. **Deploy via Virtuozzo**
   - New Environment → Docker → "From Git"
   - Repository: Your GitHub repo URL
   - Branch: `main`
   - Dockerfile: `./Dockerfile`
   - Auto-rebuild: Enable

3. **Add Services**
   - MySQL 8.0 database node
   - (Optional) MinIO or configure external S3

4. **Configure Environment Variables**
   - Copy from `.env.production.template`
   - Set production secrets
   - Configure S3 credentials

5. **Initialize Database**

   ```bash
   # SSH into container
   bunx prisma migrate deploy
   bunx tsx prisma/seed-rbac.ts
   bunx tsx scripts/verify-rbac.ts
   ```

6. **Configure Domain & SSL**
   - Point DNS to Virtuozzo IP
   - Enable Let's Encrypt SSL

### Documentation

- **Complete Deployment Guide:** `docs/Final_Production_Deployment_Checklist.md`
- **Alternative Strategies:** `docs/Alternative_Deployment_Strategies.md`
- **Secrets Management:** `docs/Production_Secrets.md`

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes (ar/en)
│   │   ├── (public)/        # Public pages (home, news, faq)
│   │   ├── (standalone)/admin/  # Admin dashboard (primary)
│   │   ├── innovators/      # Innovator registration
│   │   └── collaborators/   # Collaborator registration
│   └── api/                 # API routes (Hono.js)
├── features/                # Domain modules
│   ├── auth/               # Authentication & RBAC
│   ├── collaborators/      # Collaborator submissions
│   ├── innovators/         # Innovator projects
│   ├── admin/              # Admin features (notifications, sidebar)
│   ├── email/              # Email service
│   ├── news/               # News articles
│   ├── strategic-plan/     # Strategic plans
│   ├── page-content/       # Dynamic page content
│   └── faqs/               # FAQ management
├── components/              # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/                     # Utilities
│   ├── db.ts              # Database client
│   ├── auth/              # Auth utilities
│   ├── email/             # Email templates & service
│   ├── s3/                # S3 storage service
│   ├── forms/             # Form utilities
│   ├── notifications/     # Admin notifications
│   └── rbac.ts            # RBAC definitions
├── i18n/                    # Internationalization
│   ├── routing.ts          # i18n configuration
│   └── request.ts          # Server-side i18n
├── middleware.ts            # Route protection & i18n
└── prisma/                  # Database
    ├── schema.prisma       # Database schema
    ├── migrations/         # Migration history
    └── seed-rbac.ts        # RBAC initialization
```

---

## 💻 Development

### Available Scripts

```bash
# Development
bun run dev              # Start dev server (http://localhost:3000)
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:push          # Push schema changes (dev)
bun run db:migrate       # Create migration
bun run db:studio        # Open Prisma Studio
bun run db:seed          # Seed sample data
bun run seed:rbac        # Seed RBAC system (required)

# Verification
bun run rbac:verify      # Verify RBAC integrity

# S3 Setup
bun run setup:minio      # Create MinIO bucket (local)

# Testing
bun test                 # Run tests
bun test:watch           # Run tests in watch mode
bun test:coverage        # Generate coverage report

# Code Quality
bun run lint             # Run ESLint
bun run format           # Format code with Prettier
```

### Docker Development

```bash
# Start all services (MySQL + MinIO)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run specific test file
bun test src/features/auth/__tests__/rbac.test.ts

# Watch mode
bun test:watch

# Coverage report
bun test:coverage
```

### Test Structure

```
src/features/
└── [feature]/
    ├── __tests__/
    │   ├── components.test.tsx
    │   ├── api.test.ts
    │   └── utils.test.ts
    └── ...
```

---

## 📚 Documentation

### Key Documents

- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes
- **[PROJECT_TASKS_ROADMAP.md](./PROJECT_TASKS_ROADMAP.md)** - Development roadmap (27+ tasks)
- **[PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)** - Architecture analysis

### Deployment Guides

- **[Final Production Deployment Checklist](./docs/Final_Production_Deployment_Checklist.md)**
- **[Alternative Deployment Strategies](./docs/Alternative_Deployment_Strategies.md)**
- **[Production Secrets](./docs/Production_Secrets.md)**

### Feature Documentation

- **[Email System](./docs/email/)** - Email templates and configuration
- More documentation in `docs/` folder

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Test coverage for new features
- Documentation for significant changes

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 📞 Contact & Support

**Center for Entrepreneurship & Business Incubators**  
Misurata College of Industrial Technology  
Misurata, Libya

- **Email:** <ebic@cit.edu.ly>
- **Website:** <https://ebic.cit.edu.ly>

---

## 🙏 Acknowledgments

- Misurata College of Industrial Technology
- Next.js and Vercel teams
- All open-source contributors

---

<p align="center">
  Made with ❤️ for entrepreneurs and innovators in Libya
</p>
