"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = exports.isProd = exports.resolveAppEnv = exports.frameworkName = void 0;
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
