import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

interface Response<Data> {
  code: number;
  message: string;
  data: Data;
}

class ApiRequest {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/',
    })
  }

  public request<Data = any, Params = any>(config: AxiosRequestConfig): Promise<Data | void> {
    return this.axiosInstance.request<Data, AxiosResponse<Response<Data>, Params>, Params>(config).then((response) => {
      if (response && response.data && response.data.code === 200) {
        return response.data.data;
      } else {
        throw new AxiosError('API error', response?.data?.code.toString(), response?.config, response?.request, response || undefined);
      }
    }).catch((error) => {
      if (!axios.isCancel(error)) {
        throw error;
      }
    });

  }
}

const apiRequest = new ApiRequest();

export default apiRequest;