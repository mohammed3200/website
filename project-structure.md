```
├── .agent
│   ├── commands
│   │   ├── speckit.analyze.md
│   │   ├── speckit.checklist.md
│   │   ├── speckit.clarify.md
│   │   ├── speckit.constitution.md
│   │   ├── speckit.implement.md
│   │   ├── speckit.plan.md
│   │   ├── speckit.specify.md
│   │   ├── speckit.tasks.md
│   │   └── speckit.taskstoissues.md
│   ├── skills
│   │   ├── speckit-analyze
│   │   │   └── SKILL.md
│   │   ├── speckit-checklist
│   │   │   └── SKILL.md
│   │   ├── speckit-clarify
│   │   │   └── SKILL.md
│   │   ├── speckit-constitution
│   │   │   └── SKILL.md
│   │   ├── speckit-implement
│   │   │   └── SKILL.md
│   │   ├── speckit-plan
│   │   │   └── SKILL.md
│   │   ├── speckit-specify
│   │   │   └── SKILL.md
│   │   ├── speckit-tasks
│   │   │   └── SKILL.md
│   │   └── speckit-taskstoissues
│   │       └── SKILL.md
│   ├── specs
│   │   ├── features
│   │   │   ├── admin.md
│   │   │   ├── collaborators.md
│   │   │   ├── faqs.md
│   │   │   └── innovators.md
│   │   ├── integration
│   │   │   ├── auth.md
│   │   │   ├── email.md
│   │   │   ├── i18n.md
│   │   │   └── s3-storage.md
│   │   ├── system
│   │   │   ├── architecture.md
│   │   │   ├── data-flow.md
│   │   │   ├── security-model.md
│   │   │   └── system-overview.md
│   │   ├── testing
│   │   │   ├── testing-strategy.md
│   │   │   └── validation-checklist.md
│   │   └── ui
│   │       ├── design-system.md
│   │       ├── error-handling.md
│   │       ├── form-validation-ux.md
│   │       └── skeleton-loading.md
│   └── rules.yaml
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
├── .claude
│   └── commands
│       ├── speckit.analyze.md
│       ├── speckit.checklist.md
│       ├── speckit.clarify.md
│       ├── speckit.constitution.md
│       ├── speckit.implement.md
│       ├── speckit.plan.md
│       ├── speckit.specify.md
│       ├── speckit.tasks.md
│       └── speckit.taskstoissues.md
├── .github
│   └── workflows
│       └── ci.yml
├── .specify
│   ├── integrations
│   │   ├── claude
│   │   │   └── scripts
│   │   │       └── update-context.ps1
│   │   ├── claude.manifest.json
│   │   └── speckit.manifest.json
│   ├── memory
│   │   └── constitution.md
│   ├── scripts
│   │   ├── bash
│   │   └── powershell
│   │       └── update-agent-context.ps1
│   ├── templates
│   │   ├── agent-file-template.md
│   │   ├── checklist-template.md
│   │   ├── constitution-template.md
│   │   ├── constitution-workflow.md
│   │   ├── plan-template.md
│   │   ├── spec-template.md
│   │   └── tasks-template.md
│   ├── init-options.json
│   └── integration.json
├── antigravity
│   └── rules.yaml
├── deploy
├── docs
│   ├── decisions
│   │   ├── 0001-whatsapp-provider.md
│   │   └── auth-notify-dashboard-receipt.md
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
│   ├── Git_History_Purge_Guide.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── PROJECT_ANALYSIS_PHASE1.md.resolved
│   ├── Production_Secrets.md
│   ├── S3 Migration Implementation Progress.md
│   ├── S3_Migration_Verification_and_Testing.md
│   ├── STRATEGIC_PLAN_MIGRATION.md
│   ├── TASK2_IMPLEMENTATION_SUMMARY.md
│   ├── TASK3_ADMIN_NOTIFICATIONS.md
│   ├── TASK3_UI_COMPLETE.md
│   ├── Virtuozzo Deployment Analysis & Implementation Plan.md
│   ├── WARP.md
│   ├── deployment_guide.md.resolved
│   ├── implementation_plan.md
│   ├── implementation_plan.md.resolved
│   └── naming-conventions.md
├── messages
│   ├── ar.json
│   └── en.json
├── nginx
│   └── default.conf
├── prisma
│   ├── migrations
│   │   ├── 20260305122534_add_legal_content_model
│   │   ├── 20260305125022_refine_legal_content_model
│   │   └── 20260401214702_remove_progress_priority_from_strategic_plan
│   ├── schema.prisma
│   ├── seed-ebic-page-content.ts
│   ├── seed-news-latc.ts
│   ├── seed-rbac.ts
│   ├── seed-templates.ts
│   └── seed.ts
├── public
│   ├── assets
│   │   ├── fonts
│   │   │   └── SpaceMono-Regular.ttf
│   │   ├── icons
│   │   │   ├── Industrial-Technology-College-Logo-Arabic-For-the-big-screen.svg
│   │   │   ├── Industrial-Technology-College-Logo-Arabic-For-the-small-screen.svg
│   │   │   ├── Industrial-Technology-College-Logo-English-For-the-big-screen.svg
│   │   │   ├── Industrial-Technology-College-Logo-English-For-the-small-screen.svg
│   │   │   ├── Leadership-Center-Logo-Arabic-For-the-big-screen.svg
│   │   │   ├── Leadership-Center-Logo-Arabic-For-the-small-screen.svg
│   │   │   ├── Leadership-Center-Logo-English-For-the-big-screen.svg
│   │   │   ├── Leadership-Center-Logo-English-For-the-small-screen.svg
│   │   │   ├── college.svg
│   │   │   ├── collegeWithEffect.png
│   │   │   ├── email.svg
│   │   │   ├── file-audio.svg
│   │   │   ├── file-csv.svg
│   │   │   ├── file-doc.svg
│   │   │   ├── file-document.svg
│   │   │   ├── file-docx.svg
│   │   │   ├── file-image.svg
│   │   │   ├── file-other.svg
│   │   │   ├── file-pdf.svg
│   │   │   ├── file-txt.svg
│   │   │   ├── file-video.svg
│   │   │   ├── file.svg
│   │   │   ├── location.svg
│   │   │   ├── logo.svg
│   │   │   ├── logoWithEffect.png
│   │   │   ├── menu.svg
│   │   │   ├── send.svg
│   │   │   ├── site.svg
│   │   │   ├── text.svg
│   │   │   ├── trash.svg
│   │   │   ├── upload.svg
│   │   │   └── user.svg
│   │   └── images
│   │       ├── 404Error.svg
│   │       ├── AnalysisBro.svg
│   │       ├── AnalysisPana.svg
│   │       ├── CardCurve.svg
│   │       ├── ComputerError.svg
│   │       ├── DataExtraction.svg
│   │       ├── DataExtraction2.svg
│   │       ├── Form.svg
│   │       ├── GlassBack.png
│   │       ├── Innovation-bro.svg
│   │       ├── Innovation-rafiki.svg
│   │       ├── Innovation.svg
│   │       ├── News-rafiki.svg
│   │       ├── NoData.svg
│   │       ├── Office.svg
│   │       ├── Online-world-bro.svg
│   │       ├── TransparentCircle.svg
│   │       ├── Uploading-files.svg
│   │       ├── Warning.svg
│   │       └── noise.webp
│   └── images
│       └── placeholders
│           └── news-placeholder.jpg
├── scratch
│   ├── apply-python-fixes.cjs
│   └── fix-typo.cjs
├── scripts
│   ├── archive
│   │   ├── migrate-blobs-to-s3.ts
│   │   └── verify-s3-migration.ts
│   ├── migrations
│   ├── smoke
│   │   ├── dashboard-queues-smoke.ts
│   │   ├── email-queue-smoke.ts
│   │   ├── email-smoke.ts
│   │   ├── email-template-preview.ts
│   │   ├── two-factor-issue-smoke.ts
│   │   ├── two-factor-seed.ts
│   │   ├── two-factor-verify-smoke.ts
│   │   └── whatsapp-smoke.ts
│   ├── bun-test.ps1
│   ├── setup-minio-bucket.ts
│   ├── test-admin-notifications.ts
│   ├── test-admin-templates-direct.ts
│   ├── test-db-connection.ts
│   ├── test-email-templates.ts
│   ├── test-s3-integration.ts
│   ├── test-whatsapp.ts
│   ├── tsconfig.json
│   └── verify-rbac.ts
├── src
│   ├── app
│   │   ├── (dashboard)
│   │   │   ├── admin
│   │   │   │   ├── content
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── faqs
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── news
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── notifications
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings
│   │   │   │   │   ├── legal-content
│   │   │   │   │   │   ├── client.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── notifications
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── strategic-plans
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── submissions
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── admin-submission-footer.tsx
│   │   │   │   │   │   └── submissions-content.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── templates
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── new
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── users
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── auth
│   │   │   │   ├── callback
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── error
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── verify
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
│   │   │   │   └── layout.tsx
│   │   │   ├── about
│   │   │   │   ├── components
│   │   │   │   │   ├── about-hero.tsx
│   │   │   │   │   ├── about-news.tsx
│   │   │   │   │   ├── center-goals.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── platform-intro.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
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
│   │   │   │   │   ├── entrepreneurship-client.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── faq
│   │   │   │   └── page.tsx
│   │   │   ├── incubators
│   │   │   │   ├── components
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
│   │   │   ├── privacy
│   │   │   │   └── page.tsx
│   │   │   ├── terms
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── [[...route]]
│   │   │   │   └── route.ts
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth]
│   │   │   │   │   └── route.ts
│   │   │   │   ├── resend-2fa
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify-2fa
│   │   │   │       └── route.ts
│   │   │   └── health
│   │   │       └── route.ts
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
│   │   ├── skeletons
│   │   │   ├── collaborator-card-skeleton.tsx
│   │   │   ├── dashboard-stats-skeleton.tsx
│   │   │   ├── detail-page-skeleton.tsx
│   │   │   ├── faq-skeleton.tsx
│   │   │   ├── home-faq-skeleton.tsx
│   │   │   ├── home-news-skeleton.tsx
│   │   │   ├── home-strategic-plan-skeleton.tsx
│   │   │   ├── index.ts
│   │   │   ├── innovator-card-skeleton.tsx
│   │   │   ├── invitation-table-skeleton.tsx
│   │   │   ├── news-card-skeleton.tsx
│   │   │   ├── strategic-plan-card-skeleton.tsx
│   │   │   └── table-skeleton.tsx
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── animated-modal.tsx
│   │   │   ├── background-beams.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
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
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
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
│   │   ├── home-collaborators.tsx
│   │   ├── home-cta.tsx
│   │   ├── home-hero.tsx
│   │   ├── home-stats.tsx
│   │   ├── image-upload.tsx
│   │   ├── index.ts
│   │   ├── news.tsx
│   │   ├── responsive-modal.tsx
│   │   ├── separator-gradients.tsx
│   │   ├── strategic-plan.tsx
│   │   ├── thumbnail.tsx
│   │   └── upload-files.tsx
│   ├── constants
│   │   ├── icons
│   │   │   └── index.ts
│   │   ├── images
│   │   │   └── index.ts
│   │   ├── index.ts
│   │   └── permissions.ts
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
│   │   │   │   ├── activity
│   │   │   │   │   └── use-get-activity.ts
│   │   │   │   ├── notifications
│   │   │   │   │   ├── use-delete-notification.ts
│   │   │   │   │   ├── use-get-notification-preferences.ts
│   │   │   │   │   ├── use-get-notifications.ts
│   │   │   │   │   ├── use-get-unread-count.ts
│   │   │   │   │   ├── use-patch-notification-read.ts
│   │   │   │   │   ├── use-patch-notifications-mark-all-read.ts
│   │   │   │   │   └── use-put-notification-preferences.ts
│   │   │   │   ├── queues
│   │   │   │   │   └── use-get-queue-health.ts
│   │   │   │   ├── reports
│   │   │   │   │   ├── use-delete-report.ts
│   │   │   │   │   ├── use-get-reports.ts
│   │   │   │   │   └── use-post-report.ts
│   │   │   │   ├── stats
│   │   │   │   │   ├── use-get-dashboard-stats.ts
│   │   │   │   │   ├── use-get-stats-breakdown.ts
│   │   │   │   │   └── use-get-stats-trends.ts
│   │   │   │   ├── submissions
│   │   │   │   │   └── use-get-submissions.ts
│   │   │   │   └── templates
│   │   │   │       ├── use-delete-template.ts
│   │   │   │       ├── use-get-template.ts
│   │   │   │       ├── use-get-templates.ts
│   │   │   │       ├── use-patch-template.ts
│   │   │   │       └── use-post-template.ts
│   │   │   ├── components
│   │   │   │   ├── dashboard
│   │   │   │   │   ├── dashboard-date-filter.tsx
│   │   │   │   │   ├── queue-health-card.tsx
│   │   │   │   │   ├── recent-activity-feed.tsx
│   │   │   │   │   ├── status-breakdown-chart.tsx
│   │   │   │   │   └── submission-trends-chart.tsx
│   │   │   │   ├── templates
│   │   │   │   │   ├── template-editor.tsx
│   │   │   │   │   ├── template-list.tsx
│   │   │   │   │   └── template-skeleton.tsx
│   │   │   │   ├── notification-bell.tsx
│   │   │   │   ├── page-header.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   ├── constants
│   │   │   │   └── settings.ts
│   │   │   ├── hooks
│   │   │   │   ├── templates
│   │   │   │   │   └── use-template-id.ts
│   │   │   │   ├── use-admin-auth.ts
│   │   │   │   ├── use-notification-settings.ts
│   │   │   │   └── use-submissions-logic.ts
│   │   │   ├── queries
│   │   │   │   └── queue-health.ts
│   │   │   ├── schemas
│   │   │   │   ├── activity-schema.ts
│   │   │   │   ├── notifications-schema.ts
│   │   │   │   ├── reports-schema.ts
│   │   │   │   ├── stats-schema.ts
│   │   │   │   └── templates-schema.ts
│   │   │   ├── server
│   │   │   │   ├── middleware.ts
│   │   │   │   └── route.ts
│   │   │   ├── constant.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── auth
│   │   │   ├── actions
│   │   │   │   ├── login.ts
│   │   │   │   └── resend-two-factor.ts
│   │   │   ├── components
│   │   │   │   ├── callback-component.tsx
│   │   │   │   ├── card-wrapper.tsx
│   │   │   │   ├── code-input.tsx
│   │   │   │   ├── error-card.tsx
│   │   │   │   ├── form-error.tsx
│   │   │   │   ├── form-success.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── social.tsx
│   │   │   │   └── verify-form.tsx
│   │   │   ├── two-factor
│   │   │   │   ├── bypass-token.ts
│   │   │   │   ├── email.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── issue.ts
│   │   │   │   ├── pending-cookie.ts
│   │   │   │   ├── store.ts
│   │   │   │   └── verify.ts
│   │   │   ├── auth.ts
│   │   │   └── schemas.ts
│   │   ├── collaborators
│   │   │   ├── api
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-delete-collaborator.ts
│   │   │   │   ├── use-get-public-collaborators.ts
│   │   │   │   ├── use-joining-collaborator.ts
│   │   │   │   ├── use-update-collaborator-status.ts
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
│   │   │   ├── api
│   │   │   │   ├── use-create-faq.ts
│   │   │   │   ├── use-delete-faq.ts
│   │   │   │   ├── use-get-faqs.ts
│   │   │   │   ├── use-get-public-faqs.ts
│   │   │   │   └── use-update-faq.ts
│   │   │   ├── components
│   │   │   │   ├── admin-faq-form.tsx
│   │   │   │   ├── admin-faq-list.tsx
│   │   │   │   ├── faq-item.tsx
│   │   │   │   ├── faqs.tsx
│   │   │   │   └── index.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── index.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── innovators
│   │   │   ├── api
│   │   │   │   ├── use-delete-innovator.ts
│   │   │   │   ├── use-get-public-innovators.ts
│   │   │   │   ├── use-joining-innovators.ts
│   │   │   │   └── use-update-innovator-status.ts
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
│   │   ├── legal-content
│   │   │   ├── api
│   │   │   │   ├── use-get-legal-content.ts
│   │   │   │   └── use-patch-legal-content.ts
│   │   │   ├── components
│   │   │   │   ├── legal-content-editor.tsx
│   │   │   │   └── legal-content-viewer.tsx
│   │   │   ├── constants
│   │   │   │   └── legal-content-constants.ts
│   │   │   ├── schemas
│   │   │   │   └── legal-content-schema.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── types
│   │   │   │   └── legal-content-type.ts
│   │   │   └── index.ts
│   │   ├── news
│   │   │   ├── api
│   │   │   │   ├── use-create-news.ts
│   │   │   │   ├── use-delete-news.ts
│   │   │   │   ├── use-get-latest-news.ts
│   │   │   │   ├── use-get-new.ts
│   │   │   │   ├── use-get-news.ts
│   │   │   │   └── use-update-news.ts
│   │   │   ├── components
│   │   │   │   ├── admin-news-form.tsx
│   │   │   │   └── admin-news-list.tsx
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
│   │   │   ├── api
│   │   │   │   ├── use-create-page-content.ts
│   │   │   │   ├── use-delete-page-content.ts
│   │   │   │   ├── use-get-page-content-stats.ts
│   │   │   │   ├── use-get-page-content.ts
│   │   │   │   └── use-update-page-content.ts
│   │   │   ├── components
│   │   │   │   ├── about-hero.tsx
│   │   │   │   ├── content-form-dialog.tsx
│   │   │   │   └── delete-content-dialog.tsx
│   │   │   ├── schemas
│   │   │   │   └── page-content-schema.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── types
│   │   │   │   └── page-content-type.ts
│   │   │   └── index.ts
│   │   ├── strategic-plan
│   │   │   ├── api
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-delete-strategic-plan.ts
│   │   │   │   ├── use-get-all-strategic-plans.ts
│   │   │   │   ├── use-get-strategic-plan.ts
│   │   │   │   ├── use-get-strategic-plans.ts
│   │   │   │   ├── use-patch-strategic-plan.ts
│   │   │   │   └── use-post-strategic-plan.ts
│   │   │   ├── components
│   │   │   │   ├── create_strategic_plan_dialog.tsx
│   │   │   │   ├── edit_strategic_plan_dialog.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   └── use-strategic-id.ts
│   │   │   ├── schemas
│   │   │   │   └── strategic-plan-schema.ts
│   │   │   ├── server
│   │   │   │   └── route.ts
│   │   │   ├── utils
│   │   │   │   └── slug.ts
│   │   │   └── index.ts
│   │   └── users
│   │       ├── api
│   │       │   ├── use-delete-invitation.ts
│   │       │   ├── use-get-invitations.ts
│   │       │   ├── use-get-roles.ts
│   │       │   ├── use-get-users.ts
│   │       │   ├── use-invite-user.ts
│   │       │   └── use-update-user.ts
│   │       ├── components
│   │       │   ├── edit-user-dialog.tsx
│   │       │   ├── invitation-table.tsx
│   │       │   ├── invite-user-dialog.tsx
│   │       │   └── user-table.tsx
│   │       ├── schemas
│   │       │   └── user-schema.ts
│   │       ├── server
│   │       │   └── route.ts
│   │       ├── types
│   │       │   └── user-type.ts
│   │       └── index.ts
│   ├── hooks
│   │   ├── use-confirm.tsx
│   │   ├── use-language.ts
│   │   ├── use-media-query.ts
│   │   ├── use-navigation.ts
│   │   ├── use-share-link.ts
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
│   │   ├── messaging
│   │   │   └── send.ts
│   │   ├── notifications
│   │   │   └── admin-notifications.ts
│   │   ├── queue
│   │   │   ├── email-queue.ts
│   │   │   ├── email-worker.ts
│   │   │   ├── queue-utils.ts
│   │   │   ├── report-queue.ts
│   │   │   ├── report-worker.ts
│   │   │   ├── token-cleanup.ts
│   │   │   ├── whatsapp-queue.ts
│   │   │   └── whatsapp-worker.ts
│   │   ├── storage
│   │   │   └── s3-service.ts
│   │   ├── whatsapp
│   │   │   ├── transports
│   │   │   │   └── wapi.ts
│   │   │   └── service.ts
│   │   ├── auth.ts
│   │   ├── cache.ts
│   │   ├── config.ts
│   │   ├── db.ts
│   │   ├── env-utils.ts
│   │   ├── rate-limit.ts
│   │   ├── rbac-base.ts
│   │   ├── rbac.ts
│   │   ├── redis.ts
│   │   ├── relative-time.ts
│   │   ├── rpc.ts
│   │   ├── sanitizer.ts
│   │   ├── security.ts
│   │   ├── tokens.ts
│   │   └── utils.ts
│   ├── types
│   │   └── next-auth.d.ts
│   ├── auth.ts
│   ├── proxy.ts
│   ├── routes.ts
│   └── worker.ts
├── tests
│   ├── backend
│   │   ├── collaborator-api.test.ts
│   │   └── innovator-api.test.ts
│   ├── components
│   │   ├── entrepreneurship-client.test.tsx
│   │   ├── incubators-client.test.tsx
│   │   └── sidebar.test.tsx
│   ├── e2e
│   │   ├── collaborator-registration.test.tsx
│   │   ├── innovator-registration.test.tsx
│   │   └── two-factor.test.ts
│   ├── email
│   │   └── email-service.test.ts
│   ├── features
│   │   ├── legal-content
│   │   │   └── sanitization.test.ts
│   │   └── page-content
│   │       ├── api-routes.test.ts
│   │       └── schemas.test.ts
│   ├── frontend
│   │   ├── navigation
│   │   ├── schemas
│   │   │   ├── collaborator-schemas.test.ts
│   │   │   └── innovator-schemas.test.ts
│   │   └── store
│   │       └── form-store.test.ts
│   ├── lib
│   │   └── rbac.test.ts
│   ├── notifications
│   │   ├── README.md
│   │   └── admin-notifications.test.ts
│   ├── prisma
│   │   ├── seed-ebic-page-content.test.ts
│   │   └── seed.test.ts
│   ├── setup-happy-dom.ts
│   ├── setup.ts
│   └── tsconfig.json
├── testsprite_tests
│   ├── registration
│   │   ├── TC001_collaborator_public_list.py
│   │   ├── TC002_collaborator_registration_happy_path.py
│   │   ├── TC003_collaborator_registration_duplicate_email.py
│   │   ├── TC004_collaborator_registration_duplicate_phone.py
│   │   ├── TC005_collaborator_registration_validation_missing_fields.py
│   │   ├── TC006_collaborator_registration_invalid_email.py
│   │   ├── TC007_collaborator_registration_invalid_phone.py
│   │   ├── TC008_innovator_public_list.py
│   │   ├── TC009_innovator_registration_happy_path.py
│   │   ├── TC010_innovator_registration_duplicate_email.py
│   │   ├── TC011_innovator_registration_duplicate_phone.py
│   │   ├── TC012_innovator_registration_validation_missing_fields.py
│   │   ├── TC013_innovator_registration_max_length_violations.py
│   │   ├── TC014_innovator_registration_project_description_too_long.py
│   │   ├── TC015_innovator_registration_invalid_stage_development.py
│   │   ├── TC016_collaborator_registration_xss_injection.py
│   │   ├── TC017_innovator_registration_sql_injection.py
│   │   ├── TC018_collaborator_registration_arabic_unicode.py
│   │   ├── standard_prd.json
│   │   └── testsprite_backend_test_plan.json
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
├── .env.example
├── .env.production.example
├── .env.test.example
├── .eslintrc.json
├── .gitignore
├── .hintrc
├── .prettierrc
├── CHANGELOG.md
├── CONTRIBUTING.md
├── DEPLOYMENT.md
├── Dockerfile
├── Dockerfile.worker
├── LICENSE
├── README.md
├── bun.lock
├── bunfig.toml
├── components.json
├── docker-compose.yml
├── ecosystem.config.cjs
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── project-structure.md
├── tailwind.config.ts
├── tsconfig.json
└── tsconfig.test.json
```
