import { http } from '@/utils/http';
interface Permission {
  id: number;
  pid: number;
  pids: string;
  menuName: string;
  menuCode: string;
  menuType: string;
  icon: string;
  router: string;
  component: string;
  permission?: any;
  visibility: boolean;
  link?: any;
  redirect: string;
  weight: number;
  menuSort: number;
  remark?: any;
  menuStatus: string;
  createTime: string;
  creator: string;
  updateTime: string;
  lastModifier?: any;
  queryRoute?: any;
}

export const queryAll = (data: object) => {
  return http.request<Permission[]>('post', 'systemMenu/queryAll', {
    data
  });
};

export const add = (data: object) => {
  return http.request<string>('post', '/systemMenu/addMenu', {
    data
  });
};

export const edit = (data: object) => {
  return http.request<string>('post', '/systemMenu/edit', {
    data
  });
};

export const deletePermission = (data: object) => {
  return http.request<string>('post', '/systemMenu/delete', {
    data
  });
};
