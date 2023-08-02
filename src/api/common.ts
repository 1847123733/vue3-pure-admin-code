import { http } from '@/utils/http';

// 获取门店
export const getStoreCodesAndNames = (data?: object) => {
  return http.request('post', '/personnelSalary/getStoreCodesAndNames', { data });
};

export const getRoleList = (data?: object) => {
  return http.request('post', '/systemRole/getRoleListBox', { data });
};

//下载按钮组件使用的下载api
export const commonDownload = (data: object, url: string) => {
  return http.request('post', url, { data }, { responseType: 'blob' });
};
//上传商品数据
export const uploadExcel = (fileList, url: string, key?: string) => {
  const formData = new FormData();
  if (fileList.length == 1) {
    formData.append(key || 'file', fileList[0].raw);
  } else {
    fileList.map((item, index) => {
      formData.append(key ? key + (index + 1) : 'file' + (index + 1), item.raw);
    });
  }
  return http.request('post', url, { data: formData });
};
