const client = require('../../config/database').client
const { userModel } = require('../model/system/user.js')

/**
 * 通过token获取用户信息
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const get_base_userInfo = async(_token) => {
  return new Promise((resolve, reject) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    client.get(_token, async function(err, uid){
      // 如果redis不存在token，登录失效
      if(err) res.status(401).json({
          code: 402,
          msg: '用户状态异常，请重新登录！'
      })
      const data = await userModel.findById(uid)
      resolve(data)
    })
  })
}

exports.default = {
  get_base_userInfo
}