import { http } from '@/utils/http';
export type LoginResult = {
  data: string;
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    token: string;
    /** 用于调用刷新`token`的接口时所需的`token` */
    refreshToken: string;
    /** `token`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<LoginResult>('post', '/auth/login', {
    data
  });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>('post', '/refreshToken', { data });
};

export const logOut = (data?: object) => {
  return http.request<LoginResult>('post', '/auth/logout', {
    data
  });
};

interface AppObject {
  appKey: string;
  appSecret: string;
  agentId: string;
  loginCallbackUrl: string;
}

/** 获取 appid */
export const queryIdentificationInfo = () => {
  return http.request<AppObject>('post', '/authApi/queryIdentificationInfo', {});
};

/** 获取token */
export const getToken = (data?: object) => {
  return http.request<any>('post', '/auth/getToken', { data });
};
