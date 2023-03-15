/*
 * @Author: Soulmate
 * @Date: 2023-02-17 15:50:12
 * @LastEditTime: 2023-03-14 16:26:58
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\api\system\log.ts
 * 版权声明
 */
import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DeptFormData, LogQueryParam, LogPageResult } from '@/types';


/**
 * 获取日志列表
 *
 * @param queryParams
 */
export function listLogPages(
    queryParams: LogQueryParam
  ): AxiosPromise<LogPageResult> {
    return request({
      url: '/logs/page',
      method: 'get',
      params: queryParams,
    });
  }

/**
 * 获取部门详情
 *
 * @param id
 */
export function getDeptDetail(id: string): AxiosPromise<DeptFormData> {
  return request({
    url: `/depts/getDeptDetail/${id}`,
    method: 'get',
  });
}

/**
 * 新增部门
 *
 * @param data
 */
export function addDept(data: DeptFormData) {
  return request({
    url: `/depts/addDept`,
    method: 'post',
    data: data,
  });
}

/**
 *  修改部门
 *
 * @param id
 * @param data
 */
export function updateDept(id: string, data: DeptFormData) {
  return request({
    url: `/depts/${id}`,
    method: 'put',
    data: data,
  });
}

/**
 * 删除日志
 *
 * @param ids
 */
export function deleteLog(ids: string) {
  return request({
    url: `/logs/${ids}`,
    method: 'delete',
  });
}

