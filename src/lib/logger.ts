/**
 * Logger utilitário — silencioso em produção, verboso em dev.
 * Substitui console.log/warn/error espalhados no código.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  log:   (...args: unknown[]) => { if (isDev) console.log(...args); },
  info:  (...args: unknown[]) => { if (isDev) console.info(...args); },
  warn:  (...args: unknown[]) => { if (isDev) console.warn(...args); },
  error: (...args: unknown[]) => { if (isDev) console.error(...args); },
  debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
};

export default logger;
