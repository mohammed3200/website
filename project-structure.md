# File Tree: website

**Generated:** 1/3/2026, 4:57:18 PM
**Root Path:** `c:\Users\iG\Documents\Next.JS\website`

```
├── .brv
│   ├── blobs
│   │   └── storage.db
│   ├── context-tree
│   │   ├── code_style
│   │   │   └── conventions
│   │   │       └── naming_and_ui_standards.md
│   │   ├── compliance
│   │   │   └── project_rules
│   │   │       └── authoritative_project_rules.md
│   │   ├── structure
│   │   │   └── roadmap
│   │   │       └── implementation_status_and_roadmap.md
│   │   └── .snapshot.json
│   ├── sessions
│   │   ├── active.json
│   │   ├── session-2026-01-09T15-47-29-agent-se.json
│   │   ├── session-2026-01-09T16-30-20-agent-se.json
│   │   ├── session-2026-01-09T20-57-56-agent-se.json
│   │   ├── session-2026-01-09T20-59-13-agent-se.json
│   │   ├── session-2026-01-09T20-59-14-agent-se.json
│   │   └── session-2026-01-10T09-03-58-agent-se.json
│   └── config.json
├── .github
│   └── workflows
│       └── ci.yml
├── antigravity
│   └── rules.yaml
├── docs
│   ├── email
│   │   ├── TASK1_COMPLETE.md
│   │   ├── TASK1_PROGRESS.md
│   │   ├── TESTING_GUIDE.md
│   │   ├── discovery_summary.json
│   │   ├── email_integration_plan.md
│   │   └── email_readme.md
│   ├── Alternative_Deployment_Strategies.md
│   ├── Complete BLOB to S3 Migration Implementation Guide.md
│   ├── DOCKER.md
│   ├── Final_Production_Deployment_Checklist.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── Production_Secrets.md
│   ├── S3 Migration Implementation Progress.md
│   ├── S3_Migration_Verification_and_Testing.md
│   ├── STRATEGIC_PLAN_MIGRATION.md
│   ├── TASK2_IMPLEMENTATION_SUMMARY.md
│   ├── TASK3_ADMIN_NOTIFICATIONS.md
│   ├── TASK3_UI_COMPLETE.md
│   ├── Virtuozzo Deployment Analysis & Implementation Plan.md
│   └── WARP.md
├── messages
│   ├── ar.json
│   └── en.json
├── prisma
│   ├── schema.prisma
│   ├── seed-rbac.ts
│   └── seed.ts
├── public
│   └── assets
│       ├── corporateLogos
│       │   ├── afterpay.svg
│       │   ├── amplitude.svg
│       │   ├── drips.svg
│       │   ├── maze.svg
│       │   └── sonos.svg
│       ├── fonts
│       │   ├── DINNEXTLTARABIC-LIGHT-2-2.ttf
│       │   ├── DINNextLTArabic-Bold-4.ttf
│       │   ├── DINNextLTArabic-Regular-4.ttf
│       │   └── SpaceMono-Regular.ttf
│       ├── icons
│       │   ├── Industrial-Technology-College-Logo-Arabic-For-the-big-screen.svg
│       │   ├── Industrial-Technology-College-Logo-Arabic-For-the-small-screen.svg
│       │   ├── Industrial-Technology-College-Logo-English-For-the-big-screen.svg
│       │   ├── Industrial-Technology-College-Logo-English-For-the-small-screen.svg
│       │   ├── Leadership-Center-Logo-Arabic-For-the-big-screen.svg
│       │   ├── Leadership-Center-Logo-Arabic-For-the-small-screen.svg
│       │   ├── Leadership-Center-Logo-English-For-the-big-screen.svg
│       │   ├── Leadership-Center-Logo-English-For-the-small-screen.svg
│       │   ├── arrow-up.svg
│       │   ├── calendar.svg
│       │   ├── college.png
│       │   ├── collegeWithEffect.png
│       │   ├── email.svg
│       │   ├── file-audio.svg
│       │   ├── file-csv.svg
│       │   ├── file-doc.svg
│       │   ├── file-document.svg
│       │   ├── file-docx.svg
│       │   ├── file-image.svg
│       │   ├── file-loader.gif
│       │   ├── file-other.svg
│       │   ├── file-pdf.svg
│       │   ├── file-svg.svg
│       │   ├── file-txt.svg
│       │   ├── file-video.svg
│       │   ├── file.svg
│       │   ├── location.svg
│       │   ├── logo-english-full.svg
│       │   ├── logo-full.svg
│       │   ├── logo.svg
│       │   ├── logoWithEffect.png
│       │   ├── logout.svg
│       │   ├── menu.svg
│       │   ├── send.svg
│       │   ├── site.svg
│       │   ├── text.svg
│       │   ├── trash.svg
│       │   ├── upload.svg
│       │   └── user.svg
│       └── images
│           ├── 404Error.svg
│           ├── AnalysisBro.svg
│           ├── AnalysisPana.svg
│           ├── CardCurve.svg
│           ├── ComputerError.svg
│           ├── DataExtraction.svg
│           ├── DataExtraction2.svg
│           ├── Form.svg
│           ├── GlassBack.png
│           ├── Innovation-bro.svg
│           ├── Innovation-rafiki.svg
│           ├── Innovation.svg
│           ├── News-rafiki.svg
│           ├── NoData.svg
│           ├── Office.svg
│           ├── Online-world-bro.svg
│           ├── TransparentCircle.svg
│           ├── Uploading-files.svg
│           ├── Warning.svg
│           ├── backgroundHeader.svg
│           └── noise.webp
├── scripts
│   ├── archive
│   │   ├── migrate-blobs-to-s3.ts
│   │   └── verify-s3-migration.ts
│   ├── setup-minio-bucket.ts
│   ├── test-admin-notifications.ts
│   ├── test-admin-templates-direct.ts
│   ├── test-db-connection.ts
│   ├── test-email-templates.ts
│   ├── test-s3-integration.ts
│   └── verify-rbac.ts
├── src
│   ├── app
│   │   ├── (dashboard)
│   │   │   ├── auth
│   │   │   │   ├── callback
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── error
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── [locale]
│   │   │   ├── (standalone)
│   │   │   │   ├── News
│   │   │   │   │   └── [newsId]
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── StrategicPlan
│   │   │   │   │   └── [StrategicPlanId]
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── admin
│   │   │   │   │   ├── content
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── notifications
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── reports
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── settings
│   │   │   │   │   │   └── notifications
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── strategic-plans
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── submissions
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── collaborators
│   │   │   │   ├── registration
│   │   │   │   │   ├── [step]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── complete
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── contact
│   │   │   │   ├── components
│   │   │   │   │   ├── Hero.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── entrepreneurship
│   │   │   │   ├── components
│   │   │   │   │   ├── Hero.tsx
│   │   │   │   │   ├── entrepreneurship-client.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── faq
│   │   │   │   └── page.tsx
│   │   │   ├── incubators
│   │   │   │   ├── components
│   │   │   │   │   ├── Hero.tsx
│   │   │   │   │   ├── incubators-client.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── innovators
│   │   │   │   ├── registration
│   │   │   │   │   ├── [step]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── complete
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── [[...route]]
│   │   │   │   └── route.ts
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]
│   │   │   │       └── route.ts
│   │   │   ├── health
│   │   │   │   └── route.ts
│   │   │   └── test
│   │   │       └── auth
│   │   │           └── route.ts
│   │   ├── favicon.ico
│   │   ├── global-error.tsx
│   │   └── globals.css
│   ├── components
│   │   ├── admin
│   │   │   ├── admin-header.tsx
│   │   │   └── admin-sidebar.tsx
│   │   ├── buttons
│   │   │   ├── active-button.tsx
│   │   │   ├── back.tsx
│   │   │   ├── index.ts
│   │   │   ├── read-more.tsx
│   │   │   ├── submit-button.tsx
│   │   │   └── translate-button.tsx
│   │   ├── motion-primitives
│   │   │   └── text-shimmer.tsx
│   │   ├── navigation
│   │   │   ├── constants.ts
│   │   │   ├── desktop-menu.tsx
│   │   │   ├── index.ts
│   │   │   ├── mobile-sidebar.tsx
│   │   │   ├── responsive-navbar.tsx
│   │   │   └── types.ts
│   │   ├── providers
│   │   │   ├── app-providers.tsx
│   │   │   ├── index.ts
│   │   │   └── query-provider.tsx
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── animated-modal.tsx
│   │   │   ├── background-beams.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── infinite-moving-cards.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── map.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── placeholders-and-vanish-input.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── wobble-card.tsx
│   │   ├── animated-list.tsx
│   │   ├── custom-form-field.tsx
│   │   ├── faq.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── home-hero.tsx
│   │   ├── image-upload.tsx
│   │   ├── index.ts
│   │   ├── news.tsx
│   │   ├── separator-gradients.tsx
│   │   ├── strategic-plan.tsx
│   │   ├── thumbnail.tsx
│   │   └── upload-files.tsx
│   ├── constants
│   │   ├── icons
│   │   │   └── index.ts
│   │   ├── images
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── data
│   │   ├── account.ts
│   │   ├── password-reset-token.ts
│   │   ├── two-factor-confirmation.ts
│   │   ├── two-factor-token.ts
│   │   ├── user.ts
│   │   └── verification-token.ts
│   ├── features
│   │   ├── admin
│   │   │   ├── api
│   │   │   │   └── use-notifications.ts
│   │   │   ├── components
│   │   │   │   ├── notification-bell.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   └── constant.ts
│   │   ├── auth
│   │   │   ├── actions
│   │   │   │   ├── login.ts
│   │   │   │   └── resend-two-factor.ts
│   │   │   ├── components
│   │   │   │   ├── callback-component.tsx
│   │   │   │   ├── card-wrapper.tsx
│   │   │   │   ├── credentials-signin.tsx
│   │   │   │   ├── error-card.tsx
│   │   │   │   ├── form-error.tsx
│   │   │   │   ├── form-success.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── social.tsx
│   │   │   ├── auth.ts
│   │   │   └── schemas.ts
│   │   ├── collaborators
│   │   │   ├── api
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-get-public-collaborators.ts
│   │   │   │   ├── use-joining-collaborator.ts
│   │   │   │   └── use-update-status-collaborator.ts
│   │   │   ├── components
│   │   │   │   ├── card-companies.tsx
│   │   │   │   ├── collaborator-form-wizard.tsx
│   │   │   │   ├── hero.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── introduction.tsx
│   │   │   ├── hooks
│   │   │   │   └── use-collaborator-id.ts
│   │   │   ├── schemas
│   │   │   │   └── step-schemas.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── steps
│   │   │   │   ├── capabilities-step.tsx
│   │   │   │   ├── company-info-step.tsx
│   │   │   │   ├── industry-info-step.tsx
│   │   │   │   └── review-submit-step.tsx
│   │   │   ├── types
│   │   │   │   ├── multi-step-types.ts
│   │   │   │   └── types.ts
│   │   │   ├── constants.ts
│   │   │   ├── form-config.ts
│   │   │   └── store.ts
│   │   ├── email
│   │   │   └── api
│   │   │       └── use-email-hooks.ts
│   │   ├── faqs
│   │   │   ├── components
│   │   │   │   ├── faq-item.tsx
│   │   │   │   ├── faqs.tsx
│   │   │   │   └── index.ts
│   │   │   ├── index.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── innovators
│   │   │   ├── api
│   │   │   │   └── use-joining-innovators.ts
│   │   │   ├── components
│   │   │   │   ├── card-innovators.tsx
│   │   │   │   ├── hero.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── innovator-form-wizard.tsx
│   │   │   │   └── proem.tsx
│   │   │   ├── constants
│   │   │   │   └── constants.ts
│   │   │   ├── schemas
│   │   │   │   └── step-schemas.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── steps
│   │   │   │   ├── personal-info-step.tsx
│   │   │   │   ├── project-details-step.tsx
│   │   │   │   ├── project-overview-step.tsx
│   │   │   │   └── review-submit-step.tsx
│   │   │   ├── types
│   │   │   │   ├── multi-step-types.ts
│   │   │   │   └── types.ts
│   │   │   ├── form-config.ts
│   │   │   └── store.ts
│   │   ├── news
│   │   │   ├── api
│   │   │   │   ├── use-get-latest-news.ts
│   │   │   │   └── use-get-new.ts
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   └── use-news-id.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── constants.ts
│   │   │   ├── index.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── page-content
│   │   │   ├── schemas
│   │   │   │   └── page-content-schema.ts
│   │   │   └── server
│   │   │       └── route.ts
│   │   └── strategic-plan
│   │       ├── api
│   │       │   ├── index.ts
│   │       │   ├── use-delete-strategic-plan.ts
│   │       │   ├── use-get-all-strategic-plans.ts
│   │       │   ├── use-get-strategic-plan.ts
│   │       │   ├── use-get-strategic-plans.ts
│   │       │   ├── use-patch-strategic-plan.ts
│   │       │   └── use-post-strategic-plan.ts
│   │       ├── components
│   │       │   ├── create_strategic_plan_dialog.tsx
│   │       │   ├── edit_strategic_plan_dialog.tsx
│   │       │   └── index.ts
│   │       ├── hooks
│   │       │   ├── index.ts
│   │       │   └── use-strategic-id.ts
│   │       ├── schemas
│   │       │   └── strategic-plan-schema.ts
│   │       ├── server
│   │       │   └── route.ts
│   │       ├── utils
│   │       │   └── slug.ts
│   │       └── index.ts
│   ├── hooks
│   │   ├── use-language.ts
│   │   ├── use-navigation.ts
│   │   └── use-toast.ts
│   ├── i18n
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── lib
│   │   ├── email
│   │   │   ├── templates
│   │   │   │   ├── AdminNotification.tsx
│   │   │   │   ├── BaseLayout.tsx
│   │   │   │   ├── EmailVerification.tsx
│   │   │   │   ├── PasswordReset.tsx
│   │   │   │   ├── StatusUpdate.tsx
│   │   │   │   ├── SubmissionConfirmation.tsx
│   │   │   │   ├── TwoFactorAuth.tsx
│   │   │   │   ├── Welcome.tsx
│   │   │   │   └── index.ts
│   │   │   ├── transports
│   │   │   │   └── nodemailer.ts
│   │   │   └── service.ts
│   │   ├── forms
│   │   │   ├── components
│   │   │   │   ├── fields
│   │   │   │   │   ├── checkbox-field.tsx
│   │   │   │   │   ├── date-picker-field.tsx
│   │   │   │   │   ├── form-field-wrapper.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── phone-number-input.tsx
│   │   │   │   │   ├── radio-group-field.tsx
│   │   │   │   │   ├── select-field.tsx
│   │   │   │   │   ├── text-area.tsx
│   │   │   │   │   └── text-input.tsx
│   │   │   │   ├── layout
│   │   │   │   │   ├── FormContentArea.tsx
│   │   │   │   │   ├── RegistrationLayout.tsx
│   │   │   │   │   └── StepsSidebar.tsx
│   │   │   │   ├── shared
│   │   │   │   │   └── StepLayout.tsx
│   │   │   │   ├── file-upload.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── progress-indicator.tsx
│   │   │   │   └── step-navigation.tsx
│   │   │   ├── create-form-store.ts
│   │   │   ├── types.ts
│   │   │   └── use-form-controller.ts
│   │   ├── notifications
│   │   │   └── admin-notifications.ts
│   │   ├── queue
│   │   │   ├── report-queue.ts
│   │   │   └── report-worker.ts
│   │   ├── storage
│   │   │   └── s3-service.ts
│   │   ├── auth.ts
│   │   ├── cache.ts
│   │   ├── db.ts
│   │   ├── rbac.ts
│   │   ├── redis.ts
│   │   ├── rpc.ts
│   │   ├── security.ts
│   │   ├── tokens.ts
│   │   └── utils.ts
│   ├── mock
│   │   └── index.ts
│   ├── types
│   │   └── next-auth.d.ts
│   ├── auth.ts
│   ├── proxy.ts
│   └── routes.ts
├── tests
│   ├── components
│   │   ├── entrepreneurship-client.test.tsx
│   │   ├── incubators-client.test.tsx
│   │   └── sidebar.test.tsx
│   ├── email
│   │   └── email-service.test.ts
│   ├── features
│   │   └── page-content
│   │       ├── api-routes.test.ts
│   │       └── schemas.test.ts
│   ├── notifications
│   │   ├── README.md
│   │   └── admin-notifications.test.ts
│   ├── prisma
│   │   └── seed.test.ts
│   ├── setup-happy-dom.ts
│   └── setup.ts
├── testsprite_tests
│   ├── TC001_get_all_active_published_strategic_plans.py
│   ├── TC002_get_strategic_plan_by_id_or_slug.py
│   ├── TC003_admin_get_all_strategic_plans.py
│   ├── TC004_admin_create_strategic_plan_with_validation_and_slug_uniqueness.py
│   ├── TC005_admin_update_strategic_plan_with_validation_and_slug_uniqueness.py
│   ├── TC006_admin_delete_strategic_plan.py
│   ├── standard_prd.json
│   ├── testsprite-mcp-test-report.html
│   ├── testsprite-mcp-test-report.md
│   └── testsprite_backend_test_plan.json
├── tools
│   ├── disable-defender.ps1
│   └── fix-permissions.ps1
├── .dockerignore
├── .env.production.template
├── .eslintrc.json
├── .hintrc
├── .prettierrc
├── CHANGELOG.md
├── CONTRIBUTING.md
├── Dockerfile
├── LICENSE
├── PROJECT_ANALYSIS.md
├── PROJECT_TASKS_ROADMAP.md
├── README.md
├── bun.lock
├── bunfig.toml
├── components.json
├── docker-compose.yml
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── project-structure.json
├── project-structure.md
├── tailwind.config.ts
└── tsconfig.json
```

---

_Generated by FileTree Pro Extension_
