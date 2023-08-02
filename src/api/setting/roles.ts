import { http } from '@/utils/http';
import { BasePageResponse } from '@/model/BaseModel';
export const getRoleList = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/systemRole/getRoleList', { data });
};

export const deleteRole = (data?: object) => {
  return http.request('post', '/systemRole/delete', { data });
};

export const add = (data?: object) => {
  return http.request('post', '/systemRole/createRole', { data });
};

export const edit = (data?: object) => {
  return http.request('post', '/systemRole/updateRole', { data });
};

export const getBindPermission = (data?: object) => {
  return http.request<[]>('post', '/systemMenu/getMenuList', { data });
};

export const grantMenu = (data?: object) => {
  return http.request('post', '/systemRole/grantMenu', { data });
};
