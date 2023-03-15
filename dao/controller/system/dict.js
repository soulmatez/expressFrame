const { ObjectId } = require('mongodb');
const { dictModel } = require('../../model/system/dict.js')
const { compare } = require('../../../utils/index').default

/**
 * 获取字典列表 - 分页
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const get_dict_page = async(req, res) => {
    let { pageNum, pageSize, name } = req.query;
    const limitNum = parseInt(pageSize);
    const skipNum = (parseInt(pageNum) - 1) * limitNum;
    const findParams = {}
    const orParams = []
    if(name) Object.assign(findParams, { name })
    const data = await dictModel.find(findParams).or(orParams).skip(skipNum).limit(limitNum);
    console.log('请求接口', 1)
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
 * 获取字典详情
 * @param {*} req 
 * @param {*} res 
 */
const get_dict_Info = async (req,res) => {
    let { id } = req.params;
    let data = await dictModel.findById(id);
    res.json({
        code: 200,
		msg: "获取成功",
        data
	})
}

/**
 * 获取字典详情
 * @param {*} req 
 * @param {*} res 
 */
const get_dict_detail = async (req,res) => {
    let { code } = req.params;
    let data = await dictModel.find({ code: code });
    res.json({
        code: 200,
		msg: "获取成功",
        data: data[0].list
	})
}

/**
 * 新增字典
 * @param {*} req 
 * @param {*} res 
 */
const dict_add_controller = async (req,res) => {
    let dictMo = req.body;
    data = await dictModel.create(dictMo);
    res.json({
        code: 200,
		msg: "新增成功",
        data
	})
}

/**
 * 修改字典内容
 * @param {*} req 
 * @param {*} res 
 */
const dict_update_controller = async (req,res) => {
    let { id } = req.params;
    let { status, name, remark } = req.body;
    const data = await dictModel.updateOne({ _id: id }, {
        $set: { status, name, remark }
    });
    res.json({
        code: 200,
		msg: "修改成功",
        data: data
	})
}

/**
 * 删除字典
 * @param {*} req 
 * @param {*} res 
 */
const dict_del_controller = async (req,res) => {
    let { ids } = req.params;
    data = await dictModel.remove({ _id: { $in: ids.split(',') } });
    res.json({
        code: 200,
        msg: "删除成功",
        data
    })
}

/**
 * 获取字典列表List - 分页
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const get_dict_item_page = async(req, res) => {
    let { dictCode, pageNum, pageSize } = req.body;
    let data = await dictModel.find({ code: dictCode });
    res.json({
        code: 200,
		msg: "获取成功",
        data: {
            list: data[0].list.sort(compare('sort')),
            total: data[0].list.length
        }
	})
}

/**
 * 增加字典内容List
 * @param {*} req 
 * @param {*} res 
 */
const dict_item_add_controller = async (req,res) => {
    let { dictCode, name, sort, status, value, remark } = req.body;
    const data = await dictModel.updateOne({
        code: dictCode
    },{ 
        $addToSet: { 
            "list": {
                _id: ObjectId(), name, sort, status, value, remark
            }
        }
    });
    res.json({
        code: 200,
		msg: "新增成功",
        data: data
	})
}

/**
 * 修改字典内容List
 * @param {*} req 
 * @param {*} res 
 */
const dict_item_update_controller = async (req,res) => {
    let { id } = req.params;
    let { name, sort, status, value, remark, dictCode } = req.body;
    const data = await dictModel.updateOne({
        code: dictCode
    },{ 
        $set: { 
            "list.$[listItem].name": name,
            "list.$[listItem].sort": sort,
            "list.$[listItem].status": status,
            "list.$[listItem].value": value,
            "list.$[listItem].remark": remark
        }
    },{
        arrayFilters: [{ 
            "listItem._id": ObjectId(id)
        }]
    });
    res.json({
        code: 200,
		msg: "修改成功",
        data: data
	})
}

/**
 * 删除字典
 * @param {*} req 
 * @param {*} res 
 */
const dict_item_del_controller = async (req,res) => {
    let { ids } = req.params;
    let { dictCode } = req.params;
    const data = await dictModel.updateOne({
        code: dictCode
    },{ 
        "$pull": { 
            "list": {
                "_id": {
                    $in: ids.split(',')
                }
            }
        }
    });
    res.json({
        code: 200,
		msg: "删除成功"
	})
}

exports.default = {
    get_dict_detail, get_dict_page, get_dict_Info, dict_update_controller, dict_add_controller,
    dict_del_controller, get_dict_item_page, dict_item_update_controller, dict_item_add_controller,
    dict_item_del_controller
}