import { PageQueryParam, PageResult } from '../base';

/**
 * 字典查询参数类型声明
 */
export interface DictQueryParam extends PageQueryParam {
  /**
   * 字典名称
   */
  name: string | undefined;
}

/**
 * 字典分页列表项声明
 */
export interface Dict {
  id: number;
  code: string;
  name: string;
  status: number;
  remark: string;
}

/**
 * 字典分页项类型声明
 */
export type DictPageResult = PageResult<Dict[]>;

/**
 * 字典表单类型声明
 */
export interface DictFormData {
  _id: number | undefined;
  name: string;
  code: string;
  status: number;
  remark: string;
}

/**
 * 字典项查询参数类型声明
 */
export interface DictItemQueryParam extends PageQueryParam {
  /**
   * 字典项名称
   */
  name: string | undefined;
  /**
   * 字典编码
   */
  dictCode: string | undefined;
}

/**
 * 字典分页列表项声明
 */
export interface DictItem {
  id: number;
  name: string;
  value: string;
  dictCode: string;
  sort: number;
  status: number;
  defaulted: number;
  remark?: string;
}

/**
 * 字典分页项类型声明
 */
export type DictItemPageResult = PageResult<DictItem[]>;

/**
 * 字典表单类型声明
 */
export interface DictItemFormData {
  _id?: number;
  dictCode?: string;
  dictName?: string;
  name: string;
  code: string;
  value: string;
  status: number;
  sort: number;
  remark: string;
}
