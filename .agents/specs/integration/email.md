# Email Systems & Background Integrations

## Architecture Flow
- Transactional messages (e.g., Application Approved, Password Reset) are rendered using React Email layouts found in `src/lib/email/templates/`. 
- Transport protocol invokes Nodemailer targeting standard `SMTP_HOST` configured environments within `.env`.
- Heavy, broadcast-level messages or bulk operations must pass assignments to the background.
- Local implementation uses BullMQ connected synchronously relying on standard `Redis` connection (`REDIS_URL`). Work logic is processed outside the standard Node thread blocking the web-interface to avoid Vercel edge/Hono timeout bounds.
