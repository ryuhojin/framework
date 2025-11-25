export declare const frameworkName = "framework-template";
export type AppEnv = 'local' | 'dev' | 'prod';
export declare const resolveAppEnv: (value?: string) => AppEnv;
export declare const isProd: (value?: string) => boolean;
export declare const timestamp: () => string;
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
export declare const createSuccessResponse: <T>(data: T, requestId?: string) => ApiResponse<T>;
export declare const createErrorResponse: (error: ApiError, requestId?: string) => ApiResponse<null>;
