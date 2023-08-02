import { reactive } from 'vue';
export const useQueryParam = initialQueryParam => {
  //主要是为了重置查询参数
  const setQueryParam = () => {
    return {
      pageNo: 1,
      pageSize: 20,
      ...initialQueryParam
    };
  };
  const queryParam = reactive(setQueryParam());
  const handleResetQueryParam = () => {
    Object.assign(queryParam, setQueryParam());
  };
  return {
    queryParam,
    handleResetQueryParam
  };
};
