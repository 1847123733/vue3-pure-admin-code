import { http } from '@/utils/http';

interface permissionTreeVO {
  total: number;
  rows: rows[];
}

interface rows {
  id: number;
  functionName: string;
  type: string;
  parentId: number;
  sort: number;
  url: string;
  selected: boolean;
  icon: string;
  visibility: boolean;
}
interface UserInfo {
  name: string;
  roleName: string;
  permissionTreeVO: permissionTreeVO;
}

export const getAsyncRoutes = (data?: object) => {
  return http.request<UserInfo>('post', '/auth/getLoginUser', { data });
};
