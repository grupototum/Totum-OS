module.exports = {
  apps: [{
    name: 'stark-api',
    script: './dist/index.js',
    cwd: '/opt/stark-api',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/stark-api/err.log',
    out_file: '/var/log/stark-api/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};