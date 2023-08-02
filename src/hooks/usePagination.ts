import { ref } from 'vue';
export const usePagination = (queryParam, callback?: Function) => {
  const handleCurrentChange = val => {
    queryParam.pageNo = val;
    if (callback) callback();
  };

  const handleSizeChange = (val: number) => {
    queryParam.pageSize = val;
    if (callback) callback();
  };

  const pageSizes = [20, 50, 100];
  const dataTotal = ref<number>(0);
  const paginationLayout = 'total, sizes, prev, pager, next, jumper';
  return { pageSizes, paginationLayout, dataTotal, handleCurrentChange, handleSizeChange };
};
