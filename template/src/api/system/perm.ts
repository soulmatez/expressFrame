/*
 * @Author: Soulmate
 * @Date: 2023-02-21 15:47:11
 * @LastEditTime: 2023-02-27 16:54:20
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\api\system\perm.ts
 * 版权声明
 */
import {
    PermFormData,
    PermItem,
    PermPageResult,
    PermQueryParam,
  } from '@/types';
  import request from '@/utils/request';
  import { AxiosPromise } from 'axios';
  
  /**
   * 获取权限分页列表
   *
   * @param queryParamss
   */
  export function listPermPages(
    queryParams: PermQueryParam
  ): AxiosPromise<PermPageResult> {
    return request({
      url: '/menus/perm',
      method: 'post',
      data: queryParams,
    });
  }
  
  /**
   * 获取权限列表
   *
   * @param queryParams
   */
  export function listPerms(
    queryParams: PermQueryParam
  ): AxiosPromise<PermItem[]> {
    return request({
      url: '/menus/listPerms',
      method: 'post',
      data: queryParams,
    });
  }
  
  /**
   * 获取权限详情
   *
   * @param id
   */
  export function getPermFormDetail(id: string, menuId:string): AxiosPromise<PermFormData> {
    return request({
      url: `/menus/getPerm/${menuId}/${id}`,
      method: 'get',
    });
  }
  
  /**
   * 添加权限
   *
   * @param data
   */
  export function addPerm(data: PermFormData) {
    return request({
      url: '/menus/addPerm',
      method: 'post',
      data,
    });
  }
  
  /**
   * 更新权限
   *
   * @param id
   * @param data
   */
  export function updatePerm(data: PermFormData) {
    return request({
      url: `/menus/updatePerm`,
      method: 'put',
      data: data,
    });
  }
  
  /**
   * 批量删除权限，多个以英文逗号(,)分割
   *
   * @param ids
   */
  export function deletePerms(ids: string, menuId: string) {
    return request({
      url: `/menus/delPerm/${menuId}/${ids}`,
      method: 'delete',
    });
  }
  