import { ref } from 'vue';
import { useDynamicTableHeight } from './useDynamicTableHeight';
//如果页面中使用了useAdvancedSearch的话就不需要在引入useDynamicTableHeight了,否则会导致onMounted挂载两次
export const useAdvancedSearch = () => {
  const { calcTableHeight } = useDynamicTableHeight();
  const advancedSearch = ref<boolean>(false);

  const toggleAdvancedSearch = () => {
    advancedSearch.value = !advancedSearch.value;
    calcTableHeight();
  };
  return {
    advancedSearch,
    toggleAdvancedSearch
  };
};
