// utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogDetails {
  message: string;
  data?: any;
  source?: string;
  timestamp?: Date;
  userId?: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, details: LogDetails) {
    const timestamp = details.timestamp || new Date();
    const formattedMessage = `[${timestamp.toISOString()}] [${level.toUpperCase()}] ${details.source ? `[${details.source}]` : ''} ${details.message}`;
    
    // In development, log to console with color coding
    if (this.isDevelopment) {
      const colors = {
        debug: '\x1b[34m', // blue
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m'  // red
      };
      
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${colors[level]}${formattedMessage}\x1b[0m`,
        details.data ? details.data : ''
      );
    } else {
      // In production, you might want to send logs to a service
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        formattedMessage,
        details.data ? details.data : ''
      );
    }
  }

  debug(message: string, data?: any, source?: string) {
    this.log('debug', { message, data, source });
  }

  info(message: string, data?: any, source?: string) {
    this.log('info', { message, data, source });
  }

  warn(message: string, data?: any, source?: string) {
    this.log('warn', { message, data, source });
  }

  error(message: string, data?: any, source?: string) {
    this.log('error', { message, data, source });
  }
}

export const logger = Logger.getInstance(); 