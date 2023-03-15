const { deptModel } = require('../../model/system/dept.js');
const { userModel } = require('../../model/system/user.js');
const { commonArrayReSort } = require('../../../utils/index').default
/**
 * 获取部门树形结构
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const dept_tree_data = async(req, res) => {
    let { deptName, status } = req.body;
    const findParams = {}
    if(deptName) Object.assign(findParams, { deptName })
    if(status != undefined) Object.assign(findParams, { status })
    const data = await deptModel.find(findParams);
    res.json({
        code: 200,
        msg: "获取成功",
        data: Object.keys(findParams).length > 0 ? data : commonArrayReSort(data.toTree('0'), 'sort')
    })
}

/**
 * 获取部门列表
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const dept_list_data = async(req, res) => {
    const data = await deptModel.find({});
    let list = [];
    data.forEach(item => {
        list.push({
            value: item._id,
            _id: item._id,
            label: item.deptName,
            children: [],
            parentId: item.parentId,
            meta: {
                sort: item.sort
            }
        })
    })
    const array = list.toTree('0')
    res.json({
        code: 200,
        msg: "获取成功",
        data: array
    })
}

/**
 * 获取部门详情
 * @param {*} req 
 * @param {*} res 
 */
const dept_detail_data = async (req,res) => {
    let { id } = req.params;
    let data = await deptModel.findById(id);
    res.json({
        code: 200,
		msg: "获取成功",
        data: data
	})
}

/**
 * 新增部门
 * @param {*} req 
 * @param {*} res 
 */
const dept_add_controller = async (req,res) => {
    let deptMo = req.body;
    data = await deptModel.create(deptMo);
    res.json({
        code: 200,
		msg: "新增成功",
        data
	})
}

/**
 * 修改部门内容
 * @param {*} req 
 * @param {*} res 
 */
const dept_update_controller = async (req,res) => {
    let { id } = req.params;
    let deptMo = req.body;
    const data = await deptModel.updateOne({ _id: id }, deptMo);
    await userModel.updateMany({
        'user.deptId': id
    },{ "$set": { 
        "user.dept": deptMo
    }});
    res.json({
        code: 200,
		msg: "修改成功",
        data: data
	})
}

/**
 * 删除部门内容
 * @param {*} req 
 * @param {*} res 
 */
const dept_del_controller = async (req,res) => {
    let { ids } = req.params;
    let deptRow = await deptModel.find({ parentId: { $in: ids.split(',') } });
    if(deptRow.length){
        res.json({
            code: 500,
            msg: "删除失败，该部门下面还存在其他子部门"
        })
        return;
    }
    let userRow = await userModel.find({ 'user.deptId': { $in: ids.split(',') } });
    if(userRow.length){
        res.json({
            code: 500,
            msg: "删除失败，该部门下面还存在员工"
        })
        return;
    }
    data = await deptModel.remove({ _id: { $in: ids.split(',') } });
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

exports.default = {
    dept_list_data, dept_tree_data, dept_detail_data, dept_update_controller, dept_add_controller,
    dept_del_controller
}