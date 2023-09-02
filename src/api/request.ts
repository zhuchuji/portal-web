import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface RequestConfig extends AxiosRequestConfig {
  onCancel?: (AbortController: AbortController) => void;
}

class ApiRequest {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/',
    })
  }

  public request<Data, Param>(config: RequestConfig) {
    const { onCancel, ...axiosConfig } = config;
    const mergedConfig: AxiosRequestConfig = axiosConfig;
    if (typeof onCancel === 'function') {
      const source = axios.CancelToken.source();
      mergedConfig.cancelToken = source.token;
    }
    return this.axiosInstance.request(mergedConfig);
  }
}

const request = new ApiRequest();

export default request;