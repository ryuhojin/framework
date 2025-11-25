"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = exports.timestamp = exports.isProd = exports.resolveAppEnv = exports.frameworkName = void 0;
exports.frameworkName = 'framework-template';
const resolveAppEnv = (value) => {
    if (value === 'dev' || value === 'prod') {
        return value;
    }
    return 'local';
};
exports.resolveAppEnv = resolveAppEnv;
const isProd = (value) => (0, exports.resolveAppEnv)(value) === 'prod';
exports.isProd = isProd;
const timestamp = () => new Date().toISOString();
exports.timestamp = timestamp;
const createSuccessResponse = (data, requestId) => ({
    success: true,
    data,
    timestamp: (0, exports.timestamp)(),
    requestId,
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (error, requestId) => ({
    success: false,
    error,
    timestamp: (0, exports.timestamp)(),
    requestId,
});
exports.createErrorResponse = createErrorResponse;
