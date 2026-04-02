import winston from 'winston';
import axios from 'axios';
import { config } from '../config/environment';

const { combine, timestamp, json, colorize, errors } = winston.format;

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  ),
  defaultMeta: { service: 'zappy-backend' },
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), json())
    })
  ]
});

// Morgan stream adapter for HTTP logging
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};
