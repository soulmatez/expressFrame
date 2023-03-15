var express = require("express")
var router = express.Router()
var menuController = require('../../dao/controller/system/menu.js').default

/**
 * 获取菜单路由
 */
router.get("/route", menuController.get_menu_router)

/**
 * 角色管理
 *  - 菜单列表
 */
router.get("/select", menuController.get_menu_select)

/**
 * 菜单管理
 *  - 菜单列表
 */
router.post("/table", menuController.get_menu_table)

/**
 * 菜单管理
 *  - 菜单详情
 */
router.get("/:id/:pid", menuController.get_menu_detail)

/**
 * 菜单管理
 *  - 新增菜单
 */
router.post("/addMenu/:pid", menuController.menu_add_controller)

/**
 * 菜单管理
 *  - 修改菜单
 */
router.put("/updateMenu/:id/:pid", menuController.menu_update_controller)

/**
 * 菜单管理
 *  - 删除菜单
 */
router.delete("/delMenu/:id/:pid", menuController.menu_del_controller)

/**
 * 菜单管理
 *  - 获取操作权限
 */
router.post("/perm", menuController.menu_getPerm_controller)

/**
 * 菜单管理
 *  - 获取菜单详情
 */
router.get("/getPerm/:menuId/:id", menuController.menu_getPermInfo_controller)


/**
 * 菜单管理
 *  - 新增操作权限
 */
router.post("/addPerm", menuController.menu_addPerm_controller)

/**
 * 菜单管理
 *  - 修改操作权限
 */
router.put("/updatePerm", menuController.menu_updatePerm_controller)

/**
 * 菜单管理
 *  - 新增操作权限
 */
router.delete("/delPerm/:menuId/:ids", menuController.menu_delPerm_controller)

/**
 * 角色管理
 *  - 获取权限列表
 */
router.post("/listPerms", menuController.menu_listPerms_controller)



//导出router
module.exports = router;