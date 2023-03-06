/*
 * @Author: Soulmate
 * @Date: 2022-06-20 09:15:52
 * @LastEditTime: 2023-02-21 13:45:51
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\types\common.d.ts
 * 版权声明
 */
export interface responseDataType {
    code: string;
    data: string;
    mes: string;
    width: Number;
    background: string;
    children: ComponentTreeMenu[];
}