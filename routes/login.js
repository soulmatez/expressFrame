var express = require("express")
var router = express.Router()
var loginController = require('../dao/controller/login.js').default

/** 登录操作 */
router.post("/login", loginController.employee_login)

/** 注册操作 */
router.post("/sign", loginController.employee_sign)

/** 注销操作 */
router.delete("/logout", loginController.employee_logout)

/** 获取验证码 */
router.get("/captchaImage", loginController.employee_captcha)

//另外访问http://localhost:3000/users/34/books/8989，可以这样提取信息（使用 userId 和 bookId 路径参数）：
router.get('/users/:userId/lib/:bookId', (req, res) => {
  // 通过 req.params.userId 访问 userId
  // 通过 req.params.bookId 访问 bookId
  res.send(req.params);
});



//导出router
module.exports = router;