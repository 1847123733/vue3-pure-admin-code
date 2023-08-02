import { defineStore } from 'pinia';
import { store } from '@/store';
import { userType } from './types';
import { routerArrays } from '@/layout/types';
import { router, resetRouter } from '@/router';
import { storageSession } from '@pureadmin/utils';
// import { getLogin } from '@/api/user';
// import { LoginResult } from '@/api/user';
// import { BaseResponse } from '@/model/BaseModel';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
// setToken
import { type DataInfo, removeToken, sessionKey } from '@/utils/auth';
import { logOut } from '@/api/user';
export const useUserStore = defineStore({
  id: 'pure-user',
  state: (): userType => ({
    // 用户名
    username: storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? '',
    // 页面级别权限
    roles: storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    // async loginByUsername(data) {
    //   return new Promise<BaseResponse<LoginResult>>((resolve, reject) => {
    //     getLogin(data)
    //       .then(res => {
    //         if (res.code === 200) {
    //           setToken(res.data, data.userAccount);
    //           resolve(res);
    //         } else {
    //           resolve(res);
    //         }
    //       })
    //       .catch(() => {
    //         reject('系统异常');
    //       });
    //   });
    // },
    /** 前端登出（不调用接口） */
    async logOut(needLogOut = false) {
      if (needLogOut) await logOut();
      this.username = '';
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      router.push('/login');
    }
    /** 刷新`token` */
    // async handRefreshToken(data) {
    //   return new Promise<RefreshTokenResult>((resolve, reject) => {
    //     refreshTokenApi(data)
    //       .then(data => {
    //         if (data) {
    //           setToken(data.data);
    //           resolve(data);
    //         }
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
