/**
 * Logger utility for consistent logging across the application
 * Supports different log levels and context tagging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = 'app' | 'api' | 'chat' | 'ui' | 'canvas' | 'auth' | string;

interface LogOptions {
  level?: LogLevel;
  context?: LogContext;
}

// Controls which log levels are displayed in different environments
const LOG_LEVEL_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Current environment log level
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Format the log message with timestamp and context
const formatLogMessage = (
  message: string,
  data?: any,
  level: LogLevel = 'info',
  context: LogContext = 'app'
): string => {
  const timestamp = new Date().toISOString();
  const contextTag = context ? `[${context}]` : '';
  const levelTag = `[${level.toUpperCase()}]`;
  
  let formattedMessage = `${timestamp} ${levelTag} ${contextTag} ${message}`;
  
  if (data) {
    try {
      // Format data nicely if it's an object, otherwise just append
      if (typeof data === 'object' && data !== null) {
        formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
      } else {
        formattedMessage += ` ${data}`;
      }
    } catch (error) {
      formattedMessage += ` [Failed to stringify data]`;
    }
  }
  
  return formattedMessage;
};

// Check if the log should be displayed based on priority
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVEL_PRIORITIES[level] >= LOG_LEVEL_PRIORITIES[CURRENT_LOG_LEVEL as LogLevel];
};

// Core log function
const log = (
  level: LogLevel,
  message: string,
  data?: any,
  context: LogContext = 'app'
): void => {
  if (!shouldLog(level)) return;
  
  const formattedMessage = formatLogMessage(message, data, level, context);
  
  switch (level) {
    case 'debug':
      console.debug(formattedMessage);
      break;
    case 'info':
      console.info(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'error':
      console.error(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
};

// Public logger API
export const logger = {
  debug: (message: string, data?: any, context: LogContext = 'app') => 
    log('debug', message, data, context),
    
  info: (message: string, data?: any, context: LogContext = 'app') => 
    log('info', message, data, context),
    
  warn: (message: string, data?: any, context: LogContext = 'app') => 
    log('warn', message, data, context),
    
  error: (message: string, data?: any, context: LogContext = 'app') => 
    log('error', message, data, context),
};

// Also export the raw log function
export { log }; 