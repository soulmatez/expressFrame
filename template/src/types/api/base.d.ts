/*
 * @Author: Soulmate
 * @Date: 2023-02-13 17:29:50
 * @LastEditTime: 2023-02-21 11:22:48
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\types\api\base.d.ts
 * 版权声明
 */
export interface PageQueryParam {
  pageNum: number;
  pageSize: number;
}

export interface PageResult<T> {
  list: T;
  total: number;
}

export interface Dialog {
  title: string;
  visible: boolean;
}

/**
 * 通用组件选择项类型声明
 */
export interface Option {
  value: string;
  label: string;
  children?: Option[];
}