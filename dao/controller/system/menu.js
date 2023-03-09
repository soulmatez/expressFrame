const { ObjectId } = require('mongodb');
const { menuModel } = require('../../model/system/menu.js')
const { roleModel } = require('../../model/system/role.js')
const { recursionOtherArray, recursionRoleArray } = require('../../../utils/index').default


/**
 * 处理登录操作
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_router = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find();
    const role = await roleModel.find({});
    res.json({
        code: 200,
		msg:"获取成功",
        data: recursionRoleArray(data.toTree('0'), role)
	})
}  

/**
 * 获取菜单下拉列表
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_select = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    const data = await menuModel.find(req.body);
    res.json({
        code: 200,
		msg: "获取成功",
        data: recursionOtherArray(data.toTree("0"))
	})
}

/**
 * 获取菜单表格
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_table = async (req,res) => {
	//这里演示查询所有用户,find不传参数为查询所有用户
    let { name } = req.body;
    const findParams = {}
    if(name) Object.assign(findParams, { 'meta.title': name })
    const data = await menuModel.find(findParams);
    console.log(data)
    // data: recursionOtherArray(data.length == 1 && data[0].parentId != '0' ? data : data.toTree("0"))
    res.json({
        code: 200,
		msg: "获取成功",
        data
	})
}

/**
 * 获取菜单详情
 * @param {*} req 
 * @param {*} res 
 */
const get_menu_detail = async (req,res) => {
    let { id, pid } = req.params;
    let data = await menuModel.findById(id);
    res.json({
        code: 200,
		msg: "获取成功",
        data: data
	})
}

/**
 * 新增菜单
 * @param {*} req 
 * @param {*} res 
 */
const menu_add_controller = async (req,res) => {
    let menuMo = req.body;
    data = await menuModel.create(menuMo);
    res.json({
        code: 200,
		msg: "新增成功",
        data
	})
}

/**
 * 修改菜单内容
 * @param {*} req 
 * @param {*} res 
 */
const menu_update_controller = async (req,res) => {
    let { id } = req.params;
    let menuMo = req.body;
    const data = await menuModel.updateOne({ _id: id }, menuMo);
    res.json({
        code: 200,
		msg: "修改成功",
        data: data
	})
}

/**
 * 删除菜单内容
 * @param {*} req 
 * @param {*} res 
 */
const menu_del_controller = async (req,res) => {
    let { id } = req.params;
    let menuRow = await menuModel.find({ parentId: id });
    if(menuRow.length){
        res.json({
            code: 500,
            msg: "删除失败，该菜单下面还存在其他子菜单"
        })
        return;
    }
    data = await menuModel.remove({ _id: { $in: id.split(',') } });
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

/**
 * 获取菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_getPerm_controller = async (req,res) => {
    let { pageNum, pageSize, menuId, name } = req.body;
    let data = await menuModel.findById(menuId).then(res => {
        if(res.meta.permissions){
            let array = res.meta.permissions.filter(item => {
                if(name){
                    return item.name == name
                }else{
                    return item
                }
            });
            return array.splice((parseInt(pageNum)-1)*parseInt(pageSize), parseInt(pageSize));
        }else{
            return []
        }
    });
    res.json({
        code: 200,
		msg: "获取成功",
        data: {
            list: data,
            total: data.length
        }
	})
}

/**
 * 获取菜单权限详情
 * @param {*} req 
 * @param {*} res 
 */
const menu_getPermInfo_controller = async (req,res) => {
    let { menuId, id } = req.params;
    let data = await menuModel.find({
        'meta.permissions._id': ObjectId(id)
    },{
        "_id": 0,
        "meta.permissions.name": 1,
        "meta.permissions.btnPerm": 1,
        "meta.permissions.urlPerm": 1,
        "meta.permissions.requestMethod": 1,
        "meta.permissions.serviceName": 1,
        "meta.permissions.requestPath": 1,
        "meta.permissions.isWriteLog": 1,
        "meta.permissions._id.$": 1
      })
    console.log(data)
    let per = data[0].meta.permissions[0]
    res.json({
        code: 200,
		msg: "获取成功",
        data: per
	})
}

/**
 * 新增菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_addPerm_controller = async (req,res) => {
    let { btnPerm, name, menuId, urlPerm, requestMethod, serviceName, requestPath, isWriteLog } = req.body;
    const data = await menuModel.updateOne({
        _id: menuId
    },{
        $addToSet: { "meta.permissions": {
            isWriteLog, btnPerm, name, urlPerm, _id: ObjectId(), requestMethod, serviceName, requestPath
        }}
    });
    res.json({
        code: 200,
		msg: "获取成功",
        data: data
	})
}

/**
 * 修改菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_updatePerm_controller = async (req,res) => {
    let { btnPerm, name, urlPerm, requestMethod, serviceName, requestPath, menuId, _id, isWriteLog } = req.body;
    const data = await menuModel.updateOne({
        _id: ObjectId(menuId)
    },{ "$set": { 
        "meta.permissions.$[permissionId].btnPerm": btnPerm,
        "meta.permissions.$[permissionId].name": name,
        "meta.permissions.$[permissionId].urlPerm": urlPerm,
        "meta.permissions.$[permissionId].requestMethod": requestMethod,
        "meta.permissions.$[permissionId].serviceName": serviceName,
        "meta.permissions.$[permissionId].requestPath": requestPath,
        "meta.permissions.$[permissionId].requestPath": requestPath,
        "meta.permissions.$[permissionId].isWriteLog": isWriteLog  
    }},
    {"arrayFilters": [
        { "permissionId._id": ObjectId(_id) } 
    ]});
    res.json({
        code: 200,
		msg: "修改成功",
        data: data
	})
}

/**
 * 删除菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_delPerm_controller = async (req,res) => {
    let { menuId, ids } = req.params;
    const data =  await menuModel.updateOne({ _id: menuId }, 
        { 
            $pull: { 
                'meta.permissions': { 
                    _id: {
                        $in: ids.split(',').map(item => ObjectId(item))
                    }
                } 
            } 
        });
    res.json({
        code: 200,
		msg: "获取成功",
        data: data
	})
}

/**
 * 角色属性
 *  - 获取菜单权限
 * @param {*} req 
 * @param {*} res 
 */
const menu_listPerms_controller = async (req,res) => {
    let { menuId } = req.body;
    let data = await menuModel.findById(ObjectId(menuId)).then(res => {
        return res.meta.permissions ? res.meta.permissions : [];
    });
    res.json({
        code: 200,
		msg: "获取成功",
        data
	})
}

exports.default = {
    get_menu_router, get_menu_select, get_menu_table, get_menu_detail,
    menu_add_controller, menu_update_controller, menu_del_controller,
    menu_getPerm_controller, menu_addPerm_controller, menu_updatePerm_controller, 
    menu_delPerm_controller, menu_getPermInfo_controller, menu_listPerms_controller
}