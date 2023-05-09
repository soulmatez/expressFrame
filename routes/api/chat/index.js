var express = require("express")
var router = express.Router()
var chatLoginController = require('../../../api/controller/chat/login.js').default
var chatUserController = require('../../../api/controller/chat/user.js').default
var chatMessCateController = require('../../../api/controller/chat/messCate.js').default
var chatMessListController = require('../../../api/controller/chat/messList.js').default
const { upload } = require('../../../utils/upload').default

/** 登录操作 */
router.post("/login", chatLoginController.chat_login)

/** 注销操作 */
router.post("/logout", chatLoginController.chat_logout)

/** 获取用户信息 */
router.post("/userInfo", chatLoginController.chat_user_info)

/** 修改用户信息 */
router.post("/updateUser", chatUserController.chat_update_user)

/** 获取用户消息种类 */
router.post("/chatCateList", chatMessCateController.chat_cate_list)

/** 新增用户消息种类 */
router.post("/addChatCate", chatMessCateController.chat_add_cate)


/** 修改用户消息种类 */
router.post("/editChatCate", chatMessCateController.chat_edit_cate)

/** 删除用户消息种类 */
router.post("/delChatCate", chatMessCateController.chat_del_cate)

/** 新增消息 */
router.post("/addChatList", chatMessListController.chat_add_list)

/** 删除消息 */
router.post("/delChatList", chatMessListController.chat_del_list)

/** 清空会话内容 */
router.post("/clearChatList", chatMessListController.chat_clear_list)

/** 上传图片 */
router.post("/uploads", upload.single('file'), chatUserController.chat_uploads)

//导出router
module.exports = router;