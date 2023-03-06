const { roleModel } = require('../../model/system/role.js')
const { menuModel } = require('../../model/system/menu.js');
const { ObjectID } = require('bson');
const { noRepeat } = require("../../../utils/index").default
var bulkOps = menuModel.collection.initializeOrderedBulkOp();

/**
 * 获取角色列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_list_data = async(req, res) => {
    const data = await roleModel.find({});
    res.json({
        code: 200,
        msg: "获取成功",
        data
    })
}

/**
 * 获取用户列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_list_data_page = async(req, res) => {
    let { pageNum, pageSize, roleName } = req.query;
    const limitNum = parseInt(pageSize);
    const skipNum = (parseInt(pageNum) - 1) * limitNum;
    const findParams = {}
    const orParams = []
    if(roleName) Object.assign(findParams, {roleName: roleName})
    const data = await roleModel.find(findParams).or(orParams).skip(skipNum).limit(limitNum).sort("-sort");
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
 * 获取角色详情
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_detail_data = async(req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    let { id } = req.params;
    const data = await roleModel.findById(id)
    res.json({
        code: 200,
        msg: "获取成功",
        data
    })
}

/**
 * 新增角色
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_add_controller = async(req, res) => {
    let roleObj = req.body;
    const data = await roleModel.create(roleObj);
    res.json({
        code: 200,
        msg: "新增成功",
        data
    })
}

/**
 * 修改角色详情
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const role_update_controller = async(req, res) => {
    let { id } = req.params;
    let roleObj = req.body;
    const data = await roleModel.updateOne({ _id: id }, roleObj);
    res.json({
        code: 200,
        msg: "修改成功",
        data
    })
}

/**
 * 删除角色操作
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */ 
const role_del_controller = async(req, res) => {
    let { roleIds } = req.params;
    const data = await roleModel.remove({ _id: { $in: roleIds.split(',') } });
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

/**
 * 根据角色id查找菜单
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */ 
const role_getMenu_controller = async(req, res) => {
    let { id } = req.params;
    const arr = await menuModel.find();
    const result = arr.filter(item => item.meta.roleIds.includes(id))
    const data = result.map(item => item._id)
    res.json({
        code: 200,
        msg: "获取成功",    
        data
    })
}

/**
 * 根据角色id修改对应菜单权限
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */ 
const role_updateMenu_controller = async(req, res) => {
    let { id } = req.params;
    let { menuIds } = req.body;
    // mount是主键  mountArr，addressArr
    const allMenu = await menuModel.find();
    const allMenuId = allMenu.map(item => item._id.toString())
    await menuModel.updateMany({
        _id: { $in: menuIds }
    },{
        $addToSet: { "meta.roleIds": id }
    });
    const noMenuIds = allMenuId.filter(v => !menuIds.some((item) => item === v))
    const data = await menuModel.updateMany({
        _id: { $in: noMenuIds }
    },{
        $pull: { "meta.roleIds": id }
    });
    // const data = await menuModel.find({}, function(err, row){
    //     for (let i = 0; i < row.length; i++) {
    //         // 如果是选中状态
    //         if(!row[i].meta.roleIds.includes(id) && menuIds.includes(row[i]._id)){
    //             row[i].meta.roleIds.push(id)
    //         }
    
    //         // 如果是缺省状态
    //         if(row[i].meta.roleIds.includes(id) && !menuIds.includes(row[i]._id.toString())){
    //             const a = JSON.parse(JSON.stringify(row[i].meta.roleIds))
    //             a.remove(id)
    //             console.log(row[i].meta.roleIds)
    //             row[i].meta.roleIds = a
    //             console.log(row[i].meta.roleIds)
    //         }
    //     }
    // });
    res.json({
        code: 200,
        msg: "更新成功",    
        data
    })
}

/**
 * 根据角色id获取对应按钮权限
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */ 
const role_getPermission_controller = async(req, res) => {
    //这里演示查询所有用户,find不传参数为查询所有用户
    let { roleId, menuId } = req.params;
    const data = await roleModel.findById(roleId);
    res.json({
        code: 200,
        msg: "获取成功",
        data: data.permissions
    })
   
}

/**
 * 根据角色id修改对应按钮权限
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */ 
const role_updatePer_controller = async(req, res) => {
    let { id } = req.params;
    let { menuId, permIds } = req.body;
    const role = await roleModel.findById(id);
    const roleIdNorept = role.permissions;
    permIds.map(item => {
        // 如果是选中状态
        if(item.checked && !roleIdNorept.includes(item._id)){
            roleIdNorept.push(item._id)
        }
        // 如果是缺省状态
        if(!item.checked && roleIdNorept.includes(item._id)){
            roleIdNorept.remove(item._id)
        }
    })
    const data = await roleModel.updateMany({
        _id: id
    },{
        $set: { "permissions": roleIdNorept }
    });
    res.json({
        code: 200,
        msg: "更新成功",    
        data
    })
}

exports.default = {
    role_list_data, role_list_data_page, role_detail_data, role_update_controller, role_add_controller,
    role_del_controller, role_getMenu_controller, role_updateMenu_controller, role_getPermission_controller,
    role_updatePer_controller
}