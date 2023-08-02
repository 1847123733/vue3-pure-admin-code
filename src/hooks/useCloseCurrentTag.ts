import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { handleAliveRoute } from '@/router/utils';
const multiTags: any = useMultiTagsStoreHook().multiTags;
export const closeCurrentTag = item => {
  deleteDynamicTag(item);
};
function deleteDynamicTag(obj: any) {
  // 存放被删除的缓存路由
  const valueIndex: number = multiTags.findIndex((item: any) => {
    if (item.query) {
      if (item.path === obj.path) {
        return item.query === obj.query;
      }
    } else if (item.params) {
      if (item.path === obj.path) {
        return item.params === obj.params;
      }
    } else {
      return item.path === obj.path;
    }
  });
  const spliceRoute = (startIndex?: number, length?: number): void => {
    useMultiTagsStoreHook().handleTags('splice', '', {
      startIndex,
      length
    }) as any;
  };
  // 从当前匹配到的路径中删除
  spliceRoute(valueIndex, 1);
  handleAliveRoute(obj.matched, 'delete');
}
