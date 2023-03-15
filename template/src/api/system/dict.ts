/*
 * @Author: Soulmate
 * @Date: 2023-02-24 16:37:58
 * @LastEditTime: 2023-03-15 10:24:08
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\api\system\dict.ts
 * 版权声明
 */
import {
  DictFormData,
  DictItemFormData,
  DictItemPageResult,
  DictItemQueryParam,
  DictPageResult,
  DictQueryParam,
  Option,
  DeptResult
} from '@/types';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 获取字典分页列表
 *
 * @param queryParams
 */
export function listDictPages(
  queryParams: DictQueryParam
): AxiosPromise<DictPageResult> {
  return request({
    url: '/dicts/page',
    method: 'get',
    params: queryParams,
  });
}

/**
 * 获取字典详情
 *
 * @param id
 */
export function getDictFormDetail(id: number): AxiosPromise<DictFormData> {
  return request({
    url: `/dicts/${id}`,
    method: 'get',
  });
}

/**
 * 新增字典
 *
 * @param data
 */
export function addDict(data: DictFormData) {
  return request({
    url: '/dicts/addDict',
    method: 'post',
    data: data,
  });
}

/**
 * 修改字典
 *
 * @param id
 * @param data
 */
export function updateDict(id: number, data: DictFormData) {
  return request({
    url: `/dicts/updateDict/${id}`,
    method: 'put',
    data: data,
  });
}

/**
 * 批量删除字典
 * @param ids 字典ID，多个以英文逗号(,)分割
 */
export function deleteDict(ids: string) {
  return request({
    url: `/dicts/delDict/${ids}`,
    method: 'delete',
  });
}

/**
 * 获取字典项分页列表
 *
 * @param queryParams
 */
export function listDictItemPages(
  queryParams: DictItemQueryParam
): AxiosPromise<DictItemPageResult> {
  return request({
    url: '/dicts/items/page',
    method: 'post',
    data: queryParams,
  });
}

/**
 * 获取字典项详情
 *
 * @param id
 */
export function getDictItemDetail(id: number): AxiosPromise<DictItemFormData> {
  return request({
    url: '/youlai-admin/api/v2/dict/items/' + id,
    method: 'get',
  });
}

/**
 * 新增字典项
 *
 * @param data
 */
export function addDictItem(data: any) {
  return request({
    url: `/dicts/addDictItems`,
    method: 'post',
    data: data,
  });
}

/**
 * 修改字典项
 *
 * @param id
 * @param data
 */
export function updateDictItem({ dictItemId, dictCode }: any, data: any) {
  Object.assign(data, { dictCode })
  return request({
    url: `/dicts/updateDictItems/${dictItemId}`,
    method: 'put',
    data: data,
  });
}

/**
 * 批量删除字典项
 * @param ids 字典项ID，多个以英文逗号(,)分割
 */
export function deleteDictItem(dictCode: string, ids: string) {
  return request({
    url: `/dicts/delDictItems/${ids}`,
    method: 'delete',
    data: {
      dictCode
    }
  });
}


/**
 * 根据字典code获取详情
 */
export function listDictsByCode(code: string): AxiosPromise<DeptResult> {
  return request({
    url: `/dicts/getDict/${code}`,
    method: "get",
  });
}


