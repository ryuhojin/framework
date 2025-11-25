export declare const frameworkName = "framework-template";
export type AppEnv = 'local' | 'dev' | 'prod';
export declare const resolveAppEnv: (value?: string) => AppEnv;
export declare const isProd: (value?: string) => boolean;
export declare const timestamp: () => string;
