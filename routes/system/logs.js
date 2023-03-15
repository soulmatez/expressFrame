var express = require('express');
var router = express.Router();
var logController = require('../../dao/controller/system/log.js').default

/**
 * 部门管理
 *  - 获取部门列表
 */
router.get("/page", logController.get_log_page)

/**
 * 字典管理
 *  - 获取字典详情 / 通过code
 */
router.post("/log", logController.log_add_controller)

/**
 * 字典管理
 *  - 删除字典
 */
router.delete("/:ids", logController.log_del_controller)


module.exports = router;
