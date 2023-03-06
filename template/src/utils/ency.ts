/*
 * @Author: Soulmate
 * @Date: 2023-02-07 13:06:57
 * @LastEditTime: 2023-02-07 13:08:44
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \vue3-store\src\utils\ency.ts
 * 版权声明
 */
import { JSEncrypt } from 'jsencrypt'


/**
 * 加密
 * @param string 加密的内容
 * @returns 
 */
export function encryption (publicKey: string, text: string) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  const encrypted = encrypt.encrypt(text)
  return encrypted
}

// 解密（一般不在前端解密，都是后端进行解密）
export function decrypt (privateKey: string, string: string) {
  let decrypt = new JSEncrypt()
  decrypt.setPrivateKey(privateKey)
  var decryptMsg = decrypt.decrypt(string)
  return decryptMsg
}