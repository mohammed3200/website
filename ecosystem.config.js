// PM2 Ecosystem Configuration for cPanel / VPS Deployment
// Usage: pm2 start ecosystem.config.js
// Docs: https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'ebic-web',
      script: 'server.js',
      cwd: './.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      // Logging
      error_file: './logs/ebic-error.log',
      out_file: './logs/ebic-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Crash protection
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],
};
