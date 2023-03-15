const { logModel } = require('../../model/system/log.js');
const { menuModel } = require('../../model/system/menu.js');
const { userModel } = require('../../model/system/user.js');
const { commonArrayReSort } = require('../../../utils/index').default

/**
 * 获取日志
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const get_log_page = async(req, res) => {
    let { pageNum, pageSize, postType, handleUser, handleType, systemCode } = req.query;
    const limitNum = parseInt(pageSize);
    const skipNum = (parseInt(pageNum) - 1) * limitNum;
    const findParams = {}
    if(handleType) Object.assign(findParams, { handleType: handleType })
    if(postType) Object.assign(findParams, { postType: postType })
    if(systemCode) Object.assign(findParams, { systemCode: systemCode })
    if(handleUser) Object.assign(findParams, { handleUser: { $regex: handleUser } })
    const data = await logModel.find(findParams).skip(skipNum).limit(limitNum).sort("-handleTime");
    const dataLength = await logModel.find(findParams);
    res.json({
        code: 200,
        msg: "获取成功",
        data: {
            list: data,
            total: dataLength.length
        }
    })
}

/**
 * 新增日志记录
 * @param {*} req 
 * @param {*} res 
 */
const log_add_controller = (res, isOtherHandle = false) => {
    var HookInfo = [];
    var $handleType = 1;
    return new Promise(async (resolve, reject) => {
        let userInfo = await userModel.findById(res.uid);
        // 如果是登录退出操作
        if(isOtherHandle || res.requestUrl == 'logout'){
            $handleType = 2;
            HookInfo = [{
                meta: {
                    permissions: [{
                        name: res.requestUrl == 'logout' ? '退出登录' : '登录',
                        btnPerm: '',
                        requestMethod: res.requestUrl == 'logout' ? res.requestMethod : 'post',
                        serviceName: 'loginSevice',
                        requestPath: ''
                    }]
                }
            }];
        }else{
            HookInfo = await menuModel.find({ 
                'meta.permissions.requestPath': { $regex: res.requestUrl},
                // 'meta.permissions.requestMethod': res.requestMethod,
            },{
                "_id": 0,
                "meta.permissions.name": 1,
                "meta.permissions.btnPerm": 1,
                "meta.permissions.requestMethod": 1,
                "meta.permissions.serviceName": 1,
                "meta.permissions.requestPath": 1,
                "meta.permissions._id.$": 1
              });
            //   if(HookInfo.length > 0 && HookInfo[0].meta.permissions[0].requestMethod == res.requestMethod){
            //     console.log(HookInfo[0].meta.permissions, 'console.log(HookInfo)')
            //     console.log(res.requestUrl, 'console.log(res.requestUrl)')
            //     console.log(res.requestMethod, 'console.log(res.requestMethod)')
            //   }
            //   return;
        }
        
        
          if(HookInfo.length && Object.keys(userInfo).length && HookInfo[0].meta.permissions[0].requestMethod == res.requestMethod){
            data = await logModel.create({
                systemCode: HookInfo[0].meta.permissions[0].serviceName,
                handleType: $handleType,
                postType: HookInfo[0].meta.permissions[0].requestMethod,
                handleUserId: userInfo._id,
                handleUser: userInfo.user.userName,
                handleHost: res.requestHost,
                handleLocal: res.requestHost == 'localhost' ? '本地' : '线上',
                handleStatus: res.status,
                handleDesc: `${userInfo.user.userName}进行了${HookInfo[0].meta.permissions[0].name}操作`,
                handBody: Object.keys(res.requestBody).length > 0 ? res.requestBody : {}
            });
              resolve(true)
          }else{
            resolve(false)
          }
    })

}

/**
 * 删除日志内容
 * @param {*} req 
 * @param {*} res 
 */
const log_del_controller = async (req,res) => {
    let { ids } = req.params;
    data = await logModel.remove({ _id: { $in: ids.split(',') } });
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

exports.default = {
    get_log_page, log_add_controller, log_del_controller
}