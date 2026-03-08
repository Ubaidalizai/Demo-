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
  const u = typeof url === 'string' ? url : '';
  return u.includes('/api/v1') || u.startsWith(BASE_URL) || u.includes(BASE_URL);
};

const createMockFetchResponse = (data) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(typeof data === 'object' ? data : { data }),
  text: () => Promise.resolve(JSON.stringify(data)),
  headers: new Headers({ 'Content-Type': 'application/json' }),
});

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

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async (url, options = {}) => {
    if (!isApiUrl(url)) {
      return originalFetch(url, options);
    }
    await delay(150);
    const method = (options.method || 'GET').toUpperCase();
    let body;
    try {
      body = options.body ? JSON.parse(options.body) : null;
    } catch {
      body = null;
    }
    const mockData = getMockResponse(url, method, body);
    return createMockFetchResponse(mockData);
  };

  // Intercept both api instance (used by some components) and default axios (used by Header, etc.)
  addAxiosMockInterceptors(api);
  addAxiosMockInterceptors(axios);

  console.info('[Eye-HMS] Demo mode active - using mock data');
};

export default DEMO_MODE;
