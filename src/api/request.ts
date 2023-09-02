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
    return this.axiosInstance.request(config);
  }
}

const apiRequest = new ApiRequest();

export default apiRequest;