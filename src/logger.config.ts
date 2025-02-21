import * as fs from 'fs';
import * as path from 'path';

const logDir = path.join(__dirname, '../logs');

// Ensure 'logs' directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const pinoConfig = {
  pinoHttp: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined, // JSON for production
    level: process.env.LOG_LEVEL || 'info', // Default level
  },
  file: path.join(logDir, 'app.log'),
};
