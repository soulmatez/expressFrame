const fs = require("fs");
const path = require('path')
const { userModel } = require('../../model/system/user.js')
const { deptModel } = require('../../model/system/dept.js')
const { roleModel } = require('../../model/system/role.js');
const { menuModel } = require("../../model/system/menu.js");
const { setToken } = require("../../../utils/authotoken").default
const { setCaptcha, format, noRepeat } = require("../../../utils/index").default
const { _pubkey, _prikey, decrypt } = require('../../../utils/keyStore').default
const client = require('../../../config/database').client
const { get_base_userInfo } = require('../base').default



/**
 * 获取用户列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_list_data = async(req, res) => {
    let { pageNum, pageSize, keywords, status, deptId } = req.query;
    const limitNum = parseInt(pageSize);
    const skipNum = (parseInt(pageNum) - 1) * limitNum;
    const findParams = {}
    const orWhere = ['userName', 'nickName', 'phonenumber']
    const orParams = []
    if(status) Object.assign(findParams, {'user.status': status})
    if(deptId) Object.assign(findParams, {'user.deptId': deptId})
    if(keywords) orWhere.forEach(item => {
        if(item == 'nickName'){
            orParams.push({[`user.${item}`]: {
                $regex: keywords
            }})
        }else{
            orParams.push({[`user.${item}`]: keywords})
        }
    })
    const data = await userModel.find(findParams).or(orParams).select('user').skip(skipNum).limit(limitNum);
    let list = [];
    data.forEach((item, index) => {
        list.push({...item.user, _id: item._id})
    })
    res.json({
        code: 200,
        msg: "获取成功",
        data: {
            list: list,
            total: data.length
        }
    })
}

/**
 * 登录成功获取用户信息
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */

const asyncFunc = (roleIdArray) => {
    return new Promise(async (resolve, reject) => {
        let permissArray = []; //定义临时存放的用户权限结构
        let roleArray = [];  //定义临时存放的用户权限结构
        for(var i=0; i<roleIdArray.length; i++){
            const data = await roleModel.findById(roleIdArray[i]);
            permissArray = permissArray.concat(data.permissions)
            roleArray.push(data.role)
        }
        resolve({ permissArray, roleArray }) 
    })
}

const user_Info_data = (req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    client.get(req.headers['authorization'], async function(err, uid){
        // console.log(err, uid)
        // 如果redis不存在token，登录失效
        if(err) res.status(401).json({
            code: 402,
            msg: '用户状态异常，请重新登录！'
        })
        const data = await userModel.findById(uid)
        const user = JSON.parse(JSON.stringify(data))
        let roleIdArray = data.roleIds.split(','); 
        if(roleIdArray.length > 0){
            const { permissArray, roleArray } = await asyncFunc(roleIdArray);
            //通过菜单数据去匹配对应的按钮权限
            const menuData = await menuModel.find({});
            var menuPerArray = [];
            menuData.filter(item => {
                if(item.meta.permissions != undefined){
                    menuPerArray = menuPerArray.concat(item.meta.permissions)
                }
            })
            Object.assign(user, {
                permissions: menuPerArray.filter(item => noRepeat(permissArray).includes(item._id.toString())).map(item => item.btnPerm),
                roles: roleArray
            })
            res.json({
                code: 200,
                msg: "登录成功",
                data: user
            })
        }
       
    })
}
    

/**
 * 通过Uid获取用户信息
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_Detail_data = async(req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    let { id } = req.params;
    const data = await userModel.findById(id)
    res.json({
        code: 200,
        msg: "获取成功",
        data
    })
}

/**
 * 新增用户操作
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_add_controller = async(req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    let { deptId, roleIds, userName, nickName, email, sex, phonenumber, status } = req.body;
    let userMo = {};
    let userObj = {};
    let userDeptObj = {};
    if(!!deptId){
        userDeptObj = await deptModel.findById(deptId);
    }
    // 获取创建者
    const createUser = await get_base_userInfo(req.headers['authorization']);
    Object.assign(userObj, {
        createBy: createUser.user.userName,
        updateBy: createUser.user.userName,
        deptId,
        userName,
        nickName,
        email, 
        sex, 
        phonenumber,
        status,
        loginIp: '127.0.0.1',
        dept: userDeptObj
    })
    Object.assign(userMo, {
        roleIds: roleIds.join(','),
        user: userObj
    })
    const data = await userModel.create(userMo);
    res.json({
        code: 200,
        msg: "新增成功",
        data
    })
}

/**
 * 修改用户操作
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_update_controller = async(req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    let { deptId, roleIds, userName, nickName, email, sex, phonenumber, status, _id, key, value } = req.body;
    let userMo = {};
    let userObj = {};
    let userDeptObj = {};
    if(!!deptId){   
        userDeptObj = await deptModel.findById(deptId);
        // 获取创建者
        const updateUser = await get_base_userInfo(req.headers['authorization']);
        Object.assign(userObj, {
            roleIds: roleIds.join(','),
            'user.updateBy': updateUser.user.userName,
            'user.deptId': deptId,
            'user.userName': userName,
            'user.nickName': nickName,
            'user.email': email,
            'user.sex': sex,
            'user.phonenumber': phonenumber,
            'user.status': status,
            'user.dept': userDeptObj
        })
        Object.assign(userMo, {
            ...userObj
        })
        const data = await userModel.updateOne({_id}, userMo);
        res.json({
            code: 200,
            msg: "修改成功",
            data
        })
    }
}

/**
 * 修改用户操作 - 某一属性
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_updatePart_controller = async(req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    let {  _id, key, value } = req.body;
    const userObj = await userModel.findById(_id);
    // 获取创建者
    const updateUser = await get_base_userInfo(req.headers['authorization']);
    userObj.user.updateBy = updateUser.user.userName;
    userObj.user[key] = value;
    const data = await userModel.updateOne({_id}, userObj);
    res.json({
        code: 200,
        msg: "修改成功",
        data
    })
}

/**
 * 删除用户操作
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_del_controller = async(req, res) => {
    let { userIds } = req.body;
    const data = await userModel.remove({ _id: { $in: userIds.split(',') } });;
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

/**
 * 附件导入
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_import_controller = async(req, res) => {
    if (req.file === undefined) {
        res.json({
            code: 500,
            msg: "模型上传失败"
        })
    }
    let { deptId, roleIds } = req.body; 
    if(!!deptId){   
        userDeptObj = await deptModel.findById(deptId);
    }
    // 获取json数据进行解析
    fs.readFile(req.file.path, 'utf8', async function (err, json_str) {
        if(err) res.json({
            code: 500,
            msg: "读取失败"
        })
        if(!!!json_str) res.json({
            code: 500,
            msg: "文件内容为空"
        })
        let JsonArr = [];
        var json_arr = JSON.parse(json_str);
        let allTotal = 0; //设置导入的总条数
        let successTotal = 0; //设置成功的总条数
        if(json_arr.length > 0){
            const allUser = await userModel.find();
            let allUserUserNames = allUser.map(item => {
                return item.user.userName;
            })
            json_arr.forEach(item => {
                if(!allUserUserNames.includes(item.user.userName)){
                    let userObj = Object.assign(item.user, {
                        dept: userDeptObj,
                        deptId: deptId
                    })
                    JsonArr.push({
                        roleIds: roleIds,
                        user: userObj
                    })
                    ++successTotal;
                }
                ++allTotal;
            })
        }
        const data = await userModel.create(JsonArr);
        res.json({
            code: 200,
            msg: `数据导入成功,共计${allTotal}条数据，成功${successTotal},失败${allTotal-successTotal}`,
            data
        })
    })
    // fs.renameSync(oldpath, newpath);新路径和旧路径都要存在
    // 将文件从旧文件夹剪切到新文件夹中，由于我们只需要一个文件夹，所以新路径与旧路径相同，
    // fs.renameSync('./Simulation_Model/' + req.file.filename, "./Simulation_Model/" + req.file.originalname); 
}

/**
 * 模板下载
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_download_controller = async(req, res) => {
    let { type } = req.params;
    // 获取json数据进行解析
    fs.readFile(path.join(__dirname, `../../../public/static/tmp/${type}.json`), 'utf8', async function (err, json_str) {
        if(json_str){
            res.json({
                code: 200,
                msg: "下载成功",
                data: json_str
            })
        }
    })
}


/**
 * 附件导出
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const user_export_controller = async(req, res) => {
    let { userIds } = req.body;
    const data = await userModel.remove({ _id: { $in: userIds.split(',') } });;
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

exports.default = {
    user_list_data, user_Info_data, user_Detail_data, user_add_controller, user_update_controller, 
    user_updatePart_controller, user_del_controller, user_import_controller, user_export_controller,
    user_download_controller
}