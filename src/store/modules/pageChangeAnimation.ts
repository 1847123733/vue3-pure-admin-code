import { store } from '@/store';
import { defineStore } from 'pinia';
import { getConfig } from '@/config';
import { storageLocal } from '@pureadmin/utils';

export const usePageChangeAnimationStore = defineStore({
  id: 'pure-pageTransition',
  state: () => ({
    pageChangeAnimation:
      storageLocal().getItem<StorageConfigs>('responsive-layout')?.pageChangeAnimation ??
      getConfig().PageChangeAnimation
  }),
  getters: {
    getPageChangeAnimation() {
      return this.pageChangeAnimation;
    }
  },
  actions: {
    setPageChangeAnimation(): void {
      const configure = storageLocal().getItem<StorageConfigs>('responsive-configure');
      this.pageChangeAnimation = configure?.pageChangeAnimation;
      storageLocal().setItem('responsive-configure', configure);
    }
  }
});

export function usePageChangeAnimationStoreHook() {
  return usePageChangeAnimationStore(store);
}
