/*
 * @Author: Soulmate
 * @Date: 2022-06-20 09:39:35
 * @LastEditTime: 2023-02-28 16:54:21
 * @LastEditors: Soulmate
 * @Description:
 * @FilePath: \template\src\types\api\system\user.d.ts
 * 版权声明
 */
/**
 * 登录用户类型声明
 */
import { PageQueryParam, PageResult } from '../base';

export interface UserInfo {
  user: Infos<object>;
  permissions: string[];
  roles: string[];
}

export interface Infos {
  nickname: string;
  avatar: string;
}

export interface UserItem {
  nickName: string;
  avatar: string;
  userName: string
}

/**
 * 用户管理类型声明
 */

export interface UserPart {
  _id: string;
  value: string;
  key:string;
}

export interface UserDetail {
  user: UserFormData;
  admin: boolean;
  permissions: Array;
  postIds: string;
  roleIds: string;
  roles: Array;
  _id: string;
}

export interface UserFormData {
  _id: string,
  deptId: string,
  userName: string,
  nickName: string;
  avatar: string;
  phonenumber: string;
  email: string;
  sex: string;
  status: string;
  roleIds: Array;
}


/**
 * 用户列表检索条件
 */
export interface UserQueryParam extends PageQueryParam {
  keywords: string;
  status: string;
  deptId: string;
}

/**
 * 用户分页项类型声明
 */
export type UserPageResult = PageResult<UserItem[]>;



/**
 * Excel文件上传类型声明
 */
export interface UserImportFormData {
  deptId: string;
  roleIds: Array;
}