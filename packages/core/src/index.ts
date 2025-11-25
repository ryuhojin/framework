export const frameworkName = 'framework-template';

export type AppEnv = 'local' | 'dev' | 'prod';

export const resolveAppEnv = (value?: string): AppEnv => {
  if (value === 'dev' || value === 'prod') {
    return value;
  }
  return 'local';
};

export const isProd = (value?: string): boolean => resolveAppEnv(value) === 'prod';

export const timestamp = (): string => new Date().toISOString();
