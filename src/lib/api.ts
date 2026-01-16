/**
 * Central API export file
 * - Re-exports each modular API client
 * - Provides default Axios instance with interceptors
 */

// Modular APIs
export * from './api/auth.api';
export * from './api/payment.api';

// Default Axios Instance
export { default } from './api/index';

