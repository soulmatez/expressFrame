var express = require('express');
var router = express.Router();
var dictController = require('../../dao/controller/system/dict.js').default

/**
 * 部门管理
 *  - 获取部门列表
 */
router.get("/page", dictController.get_dict_page)

/**
 * 字典管理
 *  - 获取字典详情 / 通过id
 */
router.get("/:id", dictController.get_dict_Info)

/**
 * 字典管理
 *  - 获取字典详情 / 通过code
 */
router.get("/getDict/:code", dictController.get_dict_detail)

/**
 * 字典管理
 *  - 获取字典详情 / 通过code
 */
router.post("/addDict", dictController.dict_add_controller)

/**
 * 字典管理
 *  - 修改字典详情
 */
router.put("/updateDict/:id", dictController.dict_update_controller)

/**
 * 字典管理
 *  - 删除字典
 */
router.delete("/delDict/:ids", dictController.dict_del_controller)

/**
 * 字典管理
 *  - 获取字典内容列表
 */
router.post("/items/page", dictController.get_dict_item_page)

/**
 * 字典管理
 *  - 新增字典内容列表
 */
router.post("/addDictItems", dictController.dict_item_add_controller)

/**
 * 字典管理
 *  - 修改字典内容列表
 */
router.put("/updateDictItems/:id", dictController.dict_item_update_controller)

/**
 * 字典管理
 *  - 删除字典内容列表
 */
router.delete("/delDictItems/:ids", dictController.dict_item_del_controller)


module.exports = router;
