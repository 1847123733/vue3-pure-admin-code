import Axios, { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from 'axios';
import { PureHttpError, RequestMethods, PureHttpResponse, PureHttpRequestConfig } from './types.d';
import { BaseResponse } from '@/model/BaseModel';
import { stringify } from 'qs';
import NProgress from '../progress';
import { getToken, formatToken } from '@/utils/auth';
import { useUserStoreHook } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { getConfig } from '@/config';
import { downloadByData } from '@pureadmin/utils';
const { VITE_IP } = import.meta.env;
const baseURL = VITE_IP;
// if (window.location.port === '8849') {
//   baseURL = 'http://192.168.20.95:9876/manager/';
// }
// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 15000,
  headers: {
    // Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded'
    // 'X-Requested-With': 'XMLHttpRequest'
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  },
  baseURL
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push((token: string) => {
        config.headers['Authorization'] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig) => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ['/authApi/queryIdentificationInfo', '/auth/getToken'];
        return whiteList.some(v => config.url.indexOf(v) > -1)
          ? config
          : new Promise(resolve => {
              const data = getToken();
              if (data) {
                config.headers['Authorization'] = formatToken(data.token);
                resolve(config);
              } else {
                setTimeout(() => {
                  useUserStoreHook().logOut(true);
                }, 1000);
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        if (response.data.code === getConfig()?.LostConnectionCode) {
          ElMessage({ message: '登录超时', type: 'error' });
          setTimeout(() => {
            useUserStoreHook().logOut();
          }, 1000);
        }
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        //文件下载
        if ($config.responseType === 'blob') {
          const disposition = response.headers['content-disposition'];
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          let filename = '';
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
            downloadByData(<BlobPart>(<unknown>response.data), decodeURI(filename));
          }
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 处理 HTTP 网络错误
        let message = '';
        // HTTP 状态码
        const status = error.response?.status;
        switch (status) {
          case 403:
            message = `拒绝访问-${status}`;
            break;
          case 404:
            message = `请求地址错误-${status}`;
            break;
          case 500:
            message = `服务器错误-${status}`;
            break;
          default:
            message = `网络开小差了-${status}`;
        }
        ElMessage.error(message);
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<BaseResponse<T>> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // /** 单独抽离的post工具函数 */
  // public post<T, P>(url: string, params?: AxiosRequestConfig<T>, config?: PureHttpRequestConfig): Promise<P> {
  //   return this.request<P>('post', url, params, config);
  // }

  // /** 单独抽离的get工具函数 */
  // public get<T, P>(url: string, params?: AxiosRequestConfig<T>, config?: PureHttpRequestConfig): Promise<P> {
  //   return this.request<P>('get', url, params, config);
  // }
}

export const http = new PureHttp();
