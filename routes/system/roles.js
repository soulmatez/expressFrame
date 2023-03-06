var express = require('express');
var router = express.Router();
var roleController = require('../../dao/controller/system/role.js').default
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

/**
 * 角色管理
 *  - 获取角色列表
 */
router.get("/getRoleList", roleController.role_list_data)
router.get("/getRoleListPage", roleController.role_list_data_page)  //分页

/**
 * 角色管理
 *  - 获取角色详情
 */
router.get("/getRoleDetail/:id", roleController.role_detail_data)

/**
 * 角色管理
 *  - 添加角色信息
 */
router.post("/addRole", roleController.role_add_controller)

/**
 * 角色管理
 *  - 修改角色信息
 */
router.put("/updateRole/:id", roleController.role_update_controller)

/**
 * 角色管理
 *  - 删除角色
 */
router.delete("/deleteRoles/:roleIds", roleController.role_del_controller)

/**
 * 角色管理
 *  - 根据角色id查找菜单
 */
router.get("/:id/menu_ids", roleController.role_getMenu_controller)

/**
 * 角色管理
 *  - 根据角色id修改菜单权限
 */
router.put("/:id/menu_ids", roleController.role_updateMenu_controller)

/**
 * 角色管理
 *  - 根据角色id获取菜单权限
 */
router.get("/:roleId/permissions/:menuId", roleController.role_getPermission_controller)

/**
 * 角色管理
 *  - 根据角色id修改按钮权限
 */
router.put("/:id/role_ids", roleController.role_updatePer_controller)

module.exports = router;
