/*
 * @Author: Soulmate
 * @Date: 2022-06-20 09:26:42
 * @LastEditTime: 2023-02-28 16:59:54
 * @LastEditors: Soulmate
 * @Description:
 * @FilePath: \template\src\api\system\role.ts
 * 版权声明
 */
import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { RolesQueryParam, RolePageResult, RoleItem, RoleFormData } from "@/types";

/**
 * 获取角色列表
 */
export function listRoles(): AxiosPromise<RoleItem[]> {
  return request({
    url: "/roles/getRoleList",
    method: "get",
  });
}

/**
 * 获取角色列表 - 分页
 */
export function listRolesPage(
  queryParams: RolesQueryParam
): AxiosPromise<RolePageResult> {
  return request({
    url: "/roles/getRoleListPage",
    method: "get",
    params: queryParams
  });
}

/**
 * 获取角色详情
 *
 * @param roleId
 */
export function getRoleFormDetail(roleId: number): AxiosPromise<RoleFormData> {
  return request({
    url: `/roles/getRoleDetail/${roleId}`,
    method: 'get',
  });
}

/**
 * 添加角色
 *
 * @param data
 */
export function addRole(data: RoleFormData) {
  return request({
    url: '/roles/addRole',
    method: 'post',
    data: data,
  });
}

/**
 * 更新角色
 *
 * @param id
 * @param data
 */
export function updateRole(id: number, data: RoleFormData) {
  return request({
    url: '/roles/updateRole/' + id,
    method: 'put',
    data: data,
  });
}

/**
 * 批量删除角色，多个以英文逗号(,)分割
 *
 * @param ids
 */
export function deleteRoles(ids: string) {
  return request({
    url: '/roles/deleteRoles/' + ids,
    method: 'delete',
  });
}

/**
 * 获取角色的菜单列表
 *
 * @param roleId
 */
export function listRoleMenuIds(roleId: number): AxiosPromise<number[]> {
  return request({
    url: `/roles/${roleId}/menu_ids`,
    method: 'get',
  });
}

/**
 * 修改角色的菜单
 *
 * @param roleId
 * @param menuIds
 */
export function updateRoleMenu(roleId: number, menuIds: Array<number>) {
  return request({
    url: `/roles/${roleId}/menu_ids`,
    method: 'put',
    data: { menuIds: menuIds },
  });
}

/**
 * 获取角色的权限列表
 *
 * @param roleId
 */
export function listRolePerms(roleId: number, menuId: number) {
  return request({
    url: `/roles/${roleId}/permissions/${menuId}`,
    method: 'get',
  });
}

/**
 * 保存角色权限
 *
 * @param menuId 菜单ID，归类权限
 * @param roleId
 * @param permIds
 */
export function saveRolePerms(
  roleId: number,
  menuId: number,
  permIds: Array<number>
) {
  return request({
    url: `/roles/${roleId}/role_ids`,
    method: 'put',
    data: { menuId: menuId, permIds: permIds },
  });
}


