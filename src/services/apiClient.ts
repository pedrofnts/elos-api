import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { getCurrentProvider } from '../config/providers';

const getProxyAgent = (): HttpsProxyAgent | undefined => {
  const { PROXY_HOST, PROXY_PORT, PROXY_USER, PROXY_PASS } = process.env;
  if (!PROXY_HOST || !PROXY_PORT) return undefined;
  const auth = PROXY_USER && PROXY_PASS ? `${PROXY_USER}:${PROXY_PASS}@` : "";
  return new HttpsProxyAgent(`http://${auth}${PROXY_HOST}:${PROXY_PORT}`);
};

class ApiClient {
  private axiosInstance: AxiosInstance;
  private provider = getCurrentProvider();

  constructor() {
    const proxyAgent = getProxyAgent();
    this.axiosInstance = axios.create({
      baseURL: this.provider.baseUrl,
      timeout: 30000,
      ...(proxyAgent ? { httpsAgent: proxyAgent, proxy: false } : {}),
    });

    // Request interceptor - normalize URLs and add headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Normalize URL - remove duplicate /Login if present
        // This handles the case where Evup baseUrl already ends with /Login
        if (config.url && this.provider.baseUrl.endsWith('/Login')) {
          config.url = config.url.replace(/^\/Login/, '');
        }

        // Auto-add Origin and Referer headers if not present
        if (!config.headers['origin']) {
          config.headers['origin'] = this.provider.baseUrl;
        }
        if (!config.headers['referer']) {
          config.headers['referer'] = `${this.provider.baseUrl}/`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[ApiClient] Request failed:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
        });
        return Promise.reject(error);
      }
    );
  }

  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  // GET base URL for legacy uses
  getBaseUrl(): string {
    return this.provider.baseUrl;
  }

  // Get provider info
  getProvider() {
    return this.provider;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

// Axios instance com proxy configurado para uso direto nos controllers
export const proxiedAxios = axios.create({
  timeout: 30000,
  ...((() => { const a = getProxyAgent(); return a ? { httpsAgent: a, proxy: false } : {}; })()),
});
