import Cookies from 'js-cookie';
import { storageSession } from '@pureadmin/utils';
import { useUserStoreHook } from '@/store/modules/user';

export interface DataInfo<T> {
  /** token */
  token: string;
  /** `token`的过期时间（时间戳） */
  expires: T;
  /** 用于调用刷新token的接口时所需的token */
  refreshToken: string;
  /** 用户名 */
  username?: string;
  /** 用户id */
  userId?: string;
  /** 当前登陆用户的角色 */
  roles?: Array<string>;
}

export const sessionKey = 'user-info';
export const TokenKey = 'authorized-token';

/** 获取`token` */
export function getToken(): DataInfo<number> {
  return storageSession().getItem(sessionKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`token`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`token`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`token`的过期时间（比如2小时））、`expires`（`token`的过期时间）
 * 将`token`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export async function setToken<T>(token: T, username: string, userId: string) {
  useUserStoreHook().SET_USERNAME(username);
  await storageSession().setItem(sessionKey, {
    token,
    username,
    userId
  });
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};
