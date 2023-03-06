var express = require('express');
var router = express.Router();
var deptController = require('../../dao/controller/system/dept.js').default
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resources');
});

/**
 * 部门管理
 *  - 获取部门列表
 */
router.get("/getDeptList", deptController.dept_list_data)

/**
 * 部门管理
 *  - 获取部门树形结构
 */
router.post("/getDeptTreeData", deptController.dept_tree_data)

/**
 * 部门管理
 *  - 获取部门信息详情
 */
router.get("/getDeptDetail/:id", deptController.dept_detail_data)

/**
 * 部门管理
 *  - 增加部门信息
 */
router.post("/addDept", deptController.dept_add_controller)

/**
 * 部门管理
 *  - 修改部门信息
 */
router.put("/:id", deptController.dept_update_controller)

/**
 * 部门管理
 *  - 删除部门
 */
router.delete("/:ids", deptController.dept_del_controller)



module.exports = router;
