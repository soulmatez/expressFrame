/*
 * @Author: Soulmate
 * @Date: 2023-02-17 14:26:25
 * @LastEditTime: 2023-02-22 09:55:22
 * @LastEditors: Soulmate
 * @Description:
 * @FilePath: \template\src\types\api\system\role.d.ts
 * 版权声明
 */
/**
 * 登录用户类型声明
 */
import { PageQueryParam, PageResult } from "../base";

/**
 * 角色查询参数类型声明
 */
export interface RoleQueryParam extends PageQueryParam {
  roleName?: string;
}

/**
 * 角色管理类型声明
 */
export interface RoleItem {
  permissions: Array;
  role: string;
  roleName: string;
  _id: string;
}

/**
 * 角色分页检索条件
 */
export interface RolesQueryParam extends PageQueryParam {}

/**
 * 角色分页项类型声明
 */
export type RolePageResult = PageResult<RoleItem[]>;

/**
 * 角色表单类型声明
 */
export interface RoleFormData {
  _id: string | undefined;
  roleName: string;
  role: string;
  sort: number;
  status: string;
  permissions: Array
}


