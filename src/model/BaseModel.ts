//基类

/**
 *返回信息基类
 *
 * @export
 * @interface BaseCodeMsg
 */
export interface BaseCodeMsg {
  code: number;
  message: string;
}

/**
 *返回信息基类
 *
 * @export
 * @interface BaseResponse
 * @template T
 */
export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 *请求信息基类
 *
 * @export
 * @interface BasePageRequest
 */
export interface BasePageRequest {
  pageNo?: number;
  pageSize?: number;
}

/**
 *分页信息基类
 *
 * @export
 * @interface BasePageResponse
 * @template T
 */
export interface BasePageResponse<T> {
  totalCount: number;
  list: T;
  pageNo: number;
  pageSize: number;
  size: number;
  totalPage: number;
}

/**
 *数据基类
 *
 * @export
 * @interface BaseData
 */
export interface BaseData {
  createNo?: string;
  createTime?: string;
  updateNo?: string;
  updateTime?: string;
}
