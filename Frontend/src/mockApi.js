/**
 * Mock API layer for Eye-HMS Demo Mode
 * Intercepts fetch and axios to return mock data when backend is not running
 */

import axios from 'axios';
import api from './api-interceptor';
import { BASE_URL } from './config';
import { getMockResponse } from './mockData';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isApiUrl = (url) => {
  const u = typeof url === 'string' ? url : (url?.url || url?.href || '');
  return u.includes('/api/v1') || u.startsWith(BASE_URL) || u.includes(BASE_URL);
};

const createMockFetchResponse = (data, url = '') => {
  const isBackup = typeof url === 'string' && url.includes('/backup/download');
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(typeof data === 'object' ? data : { data }),
    text: () => Promise.resolve(JSON.stringify(data)),
    blob: () => Promise.resolve(isBackup ? new Blob(['demo-backup'], { type: 'application/octet-stream' }) : new Blob([JSON.stringify(data)], { type: 'application/json' })),
    headers: new Headers({ 'Content-Type': isBackup ? 'application/octet-stream' : 'application/json' }),
  };
};

const addAxiosMockInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    if (!isApiUrl(fullUrl)) return config;

    const mockData = getMockResponse(
      { baseURL: config.baseURL, url: config.url },
      (config.method || 'get').toUpperCase(),
      config.data
    );
    await delay(150);
    return Promise.reject({
      __mockResponse: true,
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    });
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.__mockResponse) {
        return Promise.resolve({
          data: err.data,
          status: err.status,
          statusText: err.statusText,
          headers: err.headers,
          config: err.config,
        });
      }
      return Promise.reject(err);
    }
  );
};

export const initDemoMode = () => {
  if (!DEMO_MODE) return;

  // Intercept fetch (handles both url string and Request object)
  const originalFetch = window.fetch;
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : (input?.url || input?.href || '');
    if (!isApiUrl(url)) {
      return originalFetch(input, init);
    }
    await delay(150);
    const options = typeof input === 'object' && input instanceof Request ? input : init;
    const method = (options?.method || 'GET').toUpperCase();
    let body;
    try {
      const bodyRaw = options?.body ?? (input?.body);
      body = bodyRaw ? (typeof bodyRaw === 'string' ? JSON.parse(bodyRaw) : bodyRaw) : null;
    } catch {
      body = null;
    }
    const mockData = getMockResponse(url, method, body);
    return createMockFetchResponse(mockData, url);
  };

  // Intercept both api instance (used by some components) and default axios (used by Header, etc.)
  addAxiosMockInterceptors(api);
  addAxiosMockInterceptors(axios);

  console.info('[Eye-HMS] Demo mode active - using mock data');
};

export default DEMO_MODE;
