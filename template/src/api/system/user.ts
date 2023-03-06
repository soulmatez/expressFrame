/*
 * @Author: Soulmate
 * @Date: 2022-06-20 09:26:42
 * @LastEditTime: 2023-02-21 14:22:40
 * @LastEditors: Soulmate
 * @Description:
 * @FilePath: \template\src\api\system\user.ts
 * 版权声明
 */
import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { UserInfo, UserPageResult, UserQueryParam, UserDetail, UserFormData, UserPart, responseDataType } from "@/types";

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getUserInfo(): AxiosPromise<UserInfo> {
  return request({
    url: "/users/getUserInfo",
    method: "get",
  });
}

/**
 * 获取用户列表
 */
export function listUsersPage(
  queryParams: UserQueryParam
): AxiosPromise<UserPageResult> {
  return request({
    url: "/users/getUserList",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取用户信息
 */
export function getUserDetail(
  userId: string
): AxiosPromise<UserDetail> {
  return request({
    url: `/users/getUserDetail/${userId}`,
    method: "get",
  });
}

/**
 * 新增用户
 */
export function addUser(
  queryParams: UserFormData
): AxiosPromise<UserDetail> {
  return request({
    url: `/users/addUser`,
    method: "post",
    data: queryParams
  });
}

/**
 * 修改用户
 */
export function updateUser(
  queryParams: UserFormData
): AxiosPromise<UserDetail> {
  return request({
    url: `/users/updateUser`,
    method: "post",
    data: queryParams
  });
}

/**
 * 修改用户状态
 */
export function updateUserPart(
  queryParams: UserPart
): AxiosPromise<UserDetail> {
  return request({
    url: `/users/updateUserPart`,
    method: "post",
    data: queryParams
  });
}

/**
 * 删除用户
 */
export function deleteUsers(
  userIds: any
): AxiosPromise<UserDetail> {
  return request({
    url: `/users/deleteUsers`,
    method: "post",
    data: userIds
  });
}

/**
 * 导入用户
 */
export function importUser(
  deptId: string,
  roleIds: string,
  excelFile: File
): AxiosPromise<responseDataType> {
  const formData = new FormData();
  formData.append('file', excelFile);
  formData.append('deptId', deptId.toString());
  formData.append('roleIds', roleIds);
  return request({
    url: '/users/importUser',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 下载模板
 */
export function downloadTemplate(
  type: string
): AxiosPromise<responseDataType> {
  return request({
    url: `/users/downloadTemplate/${type}`,
    method: 'get',
  });
}