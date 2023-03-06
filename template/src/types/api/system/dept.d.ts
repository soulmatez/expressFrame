/*
 * @Author: Soulmate
 * @Date: 2023-02-17 15:48:57
 * @LastEditTime: 2023-03-02 13:55:06
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\types\api\system\dept.d.ts
 * 版权声明
 */
/**
 * 登录用户类型声明
 */
import { PageQueryParam, PageResult } from "../base";

/**
 * 部门管理类型声明
 */
export interface DeptItem {
  remark: String,
  parentId: String,
  deptName: String,
  orderNum: String,
  status: String,
  parentName: String,
  children: Array
}

export interface DeptResult {
  list: DeptItem<any>
}

/**
 * 部门查询参数类型声明
 */
export interface DeptQueryParam {
  deptName: string | undefined;
  status: number | undefined;
}

/**
 * 部门表单类型声明
 */
export interface DeptFormData {
  _id?: string;
  parentId: string;
  deptName: string;
  sort: number;
  status: number;
}