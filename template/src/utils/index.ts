import moment from 'moment'; //时间插件
import { Option } from '@/types';
/*
 * @Author: Soulmate
 * @Date: 2023-03-06 11:10:45
 * @LastEditTime: 2023-03-14 15:55:33
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\utils\index.ts
 * 版权声明
 */
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

export function mix(color1: string, color2: string, weight: number) {
  weight = Math.max(Math.min(Number(weight), 1), 0);
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);
  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  const rStr = ('0' + (r || 0).toString(16)).slice(-2);
  const gStr = ('0' + (g || 0).toString(16)).slice(-2);
  const bStr = ('0' + (b || 0).toString(16)).slice(-2);
  return '#' + rStr + gStr + bStr;
}

/**
 * 时间格式修改
 * @param formType 
 * @returns 
 */
export function format(formType: string, date = Date.now()){
  var current_time = moment(date).format(formType)
  return current_time;
}

/**
 * 过滤字典数据渲染在html上
 * @param systemCode 
 * @param dictArr
 * @returns 
 */
export function filterDictText(systemCode: string, dictArr: Array<Option>) {
  return dictArr.filter((item: Option) => item.value == systemCode)[0].name
}