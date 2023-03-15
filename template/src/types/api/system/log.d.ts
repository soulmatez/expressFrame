/*
 * @Author: Soulmate
 * @Date: 2023-02-17 15:48:57
 * @LastEditTime: 2023-03-15 16:05:37
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\types\api\system\log.d.ts
 * 版权声明
 */
/**
 * 登录用户类型声明
 */
import { PageQueryParam, PageResult } from "../base";

/**
 * 日志管理类型声明
 */
export interface LogItem {
    systemCode: string,
    handleType: number,
    postType: string,
    handleUserId: string,
    handleUser: string,
    handleHost: string,
    handleLocal: string,
    handleStatus: number,
    handleTime: string,
    handleDesc: string,
    handBody: PostBody
}

export interface PostBody {
    body: string;
    params: object;
    query: string;
    url: string;
}

export interface LogResult {
  list: DeptItem<any>
}

/**
 * 日志查询参数类型声明
 */
export interface LogQueryParam extends PageQueryParam {
    handleType: Number | undefined;
    handleUser: string | undefined;
    postType: string | undefined;
    systemCode: string | undefined;
}

/**
 * 日志表单类型声明
 */
export interface LogFormData {
  _id?: string;
  parentId: string;
  deptName: string;
  sort: number;
  status: number;
  handleDesc: string;
  handBody: string;
  handleDesc: string;
}

