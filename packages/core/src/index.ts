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

export interface ApiError {
  code: string;
  message: string;
  detail?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId?: string;
}

export const createSuccessResponse = <T>(data: T, requestId?: string): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: timestamp(),
  requestId,
});

export const createErrorResponse = (
  error: ApiError,
  requestId?: string,
): ApiResponse<null> => ({
  success: false,
  error,
  timestamp: timestamp(),
  requestId,
});
