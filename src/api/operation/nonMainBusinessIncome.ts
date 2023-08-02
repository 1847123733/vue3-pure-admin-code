import { http } from '@/utils/http';
import { BasePageResponse } from '@/model/BaseModel';

export interface TotalAmount {
  totalPowerBank: string;
  totalPrinter: string;
  totalOther: string;
}

export interface TotalAmountPersonnel {
  totalSalary: string;
  totalSocialInsurance: string;
  totalWelfare: string;
}
// 非主营业务有-页面查询
export const queryList = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/storeOtherIncome/queryList', { data });
};

// 非主营业务有-统计合计金额
export const getTotalAmount = (data?: object) => {
  return http.request<TotalAmount>('post', '/storeOtherIncome/getTotalAmount', { data });
};

// 人事薪酬统计页面查询
export const queryListPersonnel = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/personnelSalary/queryList', { data });
};

// 人事薪酬统计合计金额
export const getTotalAmountPersonnel = (data?: object) => {
  return http.request<TotalAmountPersonnel>('post', '/personnelSalary/getTotalAmount', { data });
};

// 门店工装统计 页面查询
export const queryListFrock = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/storeFrock/queryList', { data });
};

// 门店工装统计 新增工装
export const addStoreFrock = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/storeFrock/addStoreFrock', { data });
};

// 门店工装统计 查询明细
export const queryDetail = (data?: object) => {
  return http.request<any>('post', '/storeFrock/queryDetail', { data });
};

// 修改 房租
export const updateRentInfo = (data?: object) => {
  return http.request<any>('post', '/storeRent/updateRentInfo', { data });
};

//房租  页面查询
export const queryListRent = (data?: object) => {
  return http.request<BasePageResponse<[]>>('post', '/storeRent/queryList', { data });
};
