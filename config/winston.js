const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const {
  combine, timestamp, label, printf,
} = format;

const config = {
  level: process.env.LOG_LEVEL || 'debug',
  filename: 'log_%DATE%.log',
  maxSize: '20m',
  maxFiles: '14d',
};

const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFormat = printf(({
  // eslint-disable-next-line no-shadow
  level, message, label, timestamp,
}) => `${timestamp} [${label}] ${level}: ${message}`);

const logger = createLogger({
  level: config.level,
  format: combine(
    label({ label: 'main' }),
    timestamp(),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: `${logDir}/${config.filename}`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: config.maxSize,
      maxFiles: config.maxFiles,
    }),
  ],
});

module.exports = logger;
