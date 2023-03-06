var express = require('express');
var router = express.Router();
var loginController = require('../../dao/controller/login.js').default
var userController = require('../../dao/controller/system/user.js').default
const { upload } = require('../../utils/upload').default
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

// 添加
router.get('/find', function (req, res, next) {
  // console.log(req, res, next)
})

/**
 * 用户登录
 *  - 获取用户信息
 */
router.get("/getUserInfo", userController.user_Info_data)

/**
 * 用户管理
 *  - 获取用户列表
 */
router.get("/getUserList", userController.user_list_data)

/**
 * 用户管理
 *  - 获取用户信息
 */
router.get("/getUserDetail/:id", userController.user_Detail_data)

/**
 * 用户管理
 *  - 新增用户
 */
router.post("/addUser", userController.user_add_controller)

/**
 * 用户管理
 *  - 修改用户
 */
router.post("/updateUser", userController.user_update_controller)
router.post("/updateUserPart", userController.user_updatePart_controller)

/**
 * 用户管理
 *  - 删除用户
 */
router.post("/deleteUsers", userController.user_del_controller)

/**
 * 用户管理
 *  - 附件导入、模板下载
 */
router.post("/importUser", upload.single("file"), userController.user_import_controller)
router.get("/downloadTemplate/:type", userController.user_download_controller)

/**
 * 用户管理
 *  - 附件导出
 */
router.post("/exportUser", userController.user_export_controller)


module.exports = router;
