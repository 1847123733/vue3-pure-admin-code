import { defineStore } from 'pinia';
import { store } from '@/store';
import { cacheType } from './types';
import { constantMenus } from '@/router';
import { ascending, filterTree } from '@/router/utils';
import { getKeyList } from '@pureadmin/utils';
import { useMultiTagsStoreHook } from './multiTags';
export const usePermissionStore = defineStore({
  id: 'pure-permission',
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 缓存页面keepAlive
    cachePageList: [],
    fineGritPermission: []
  }),
  actions: {
    /** 组装整体路由生成的菜单 */
    handleWholeMenus(routes: any[]) {
      this.wholeMenus = filterTree(ascending(this.constantMenus.concat(routes)));
    },
    cacheOperate({ mode, name }: cacheType) {
      switch (mode) {
        case 'add':
          this.cachePageList.push(name);
          this.cachePageList = [...new Set(this.cachePageList)];
          break;
        case 'delete':
          // eslint-disable-next-line no-case-declarations
          const delIndex = this.cachePageList.findIndex(v => v === name);
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
      /** 监听缓存页面是否存在于标签页，不存在则删除 */
      (() => {
        let cacheLength = this.cachePageList.length;
        const nameList = getKeyList(useMultiTagsStoreHook().multiTags, 'name');
        while (cacheLength > 0) {
          nameList.findIndex(v => v === this.cachePageList[cacheLength - 1]) === -1 &&
            this.cachePageList.splice(this.cachePageList.indexOf(this.cachePageList[cacheLength - 1]), 1);
          cacheLength--;
        }
      })();
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    },
    initFineGritPermission(fineGritPermission: []) {
      this.fineGritPermission = fineGritPermission;
    },
    hasFineGritPermission(permission: string) {
      return this.fineGritPermission.includes(permission);
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
