import { http } from '@/utils/http';
import { BasePageResponse } from '@/model/BaseModel';

export const getAccountList = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/systemUser/queryPage', { data });
};

export const updateStatus = (data?: object) => {
  return http.request('post', '/systemUser/updateStatus', { data });
};

export const add = (data?: object) => {
  return http.request('post', '/systemUser/createUser', { data });
};

export const edit = (data?: object) => {
  return http.request('post', '/systemUser/updateUser', { data });
};

export const queryUserName = () => {
  return http.request<[]>('post', '/dingTalkUser/queryUserName', {});
};

export const bindUserCode = (data?: object) => {
  return http.request<[]>('post', '/systemUser/bindUserCode', { data });
};
