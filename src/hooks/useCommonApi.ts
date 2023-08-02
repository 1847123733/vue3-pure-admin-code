import * as api from '@/api/common';
import { ref } from 'vue';
export const useCommonApi = () => {
  //
  const allStore = ref();
  const getStoreCodesAndNames = async () => {
    const res = await api.getStoreCodesAndNames();
    if (res.code === 200) {
      allStore.value = res.data;
    }
  };
  const allRole = ref();
  const getRoleList = async (data: object) => {
    const res = await api.getRoleList(data);
    if (res.code === 200) {
      allRole.value = res.data;
    }
  };

  return {
    getStoreCodesAndNames,
    allStore,
    getRoleList,
    allRole
  };
};
