/*
 * @Author: Soulmate
 * @Date: 2023-02-17 15:50:12
 * @LastEditTime: 2023-03-05 10:19:32
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\api\system\dept.ts
 * 版权声明
 */
import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { DeptFormData, DeptItem, DeptQueryParam, Option, DeptResult } from '@/types';

/**
 * 部门树形表格
 *
 * @param queryParams
 */
export function listTableDepartments(
  queryParams?: DeptQueryParam
): AxiosPromise<DeptItem[]> {
  return request({
    url: '/depts/getDeptTreeData',
    method: 'post',
    data: queryParams,
  });
}

/**
 * 获取部门列表
 */
export function listSelectDepartments(): AxiosPromise<Option[]> {
  return request({
    url: "/depts/getDeptList",
    method: "get",
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
 * 删除部门
 *
 * @param ids
 */
export function deleteDept(ids: string) {
  return request({
    url: `/depts/${ids}`,
    method: 'delete',
  });
}

