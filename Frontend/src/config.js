// In demo mode: use relative paths - no real API calls, all intercepted by mock layer
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || (isDemoMode ? '/api/v1' : 'http://localhost:4000/api/v1');
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || (isDemoMode ? '/public/img' : 'http://localhost:4000/public/img');
