/*
 * @Author: Soulmate
 * @Date: 2022-06-20 09:22:51
 * @LastEditTime: 2023-02-07 11:33:28
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \vue3-store\src\types\api\system\login.d.ts
 * 版权声明
 */
/**
 * 登录表单类型声明
 */
 export interface LoginFormData {
    username: string;
    password: string;
    grant_type: string;
    code: string;
    uuid: string;
  }
  
  /**
   * 登录响应类型声明
   */
  export interface LoginResponseData {
    access_token: string;
    token_type: string;
  }
  
  /**
   * 验证码类型声明
   */
  export interface Captcha {
    img: string;
    uuid: string;
    text: string;
  }
  