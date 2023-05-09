const { userModel } = require("../../../dao/model/system/user.js");
const { chatUserModel } = require("../../model/chat/user.js");
const { setCaptcha } = require("../../../utils/index").default;
const client = require("../../../config/database.js").client;
const { get_base_userInfo } = require("../../../dao/controller/base").default;
const { isFileExisted } = require("../../../utils/upload.js").default;
const fs = require('fs'); 
const path = require('path')

// 修改用户信息
const chat_update_user = async (req, res) => {
  // 获取token
  let { access_token } = req.body;
  let userMemo = req.body;
  delete userMemo.access_token;
  //这里演示查询所有用户,find不传参数为查询所有用户
  client.get(access_token, async function (err, uid) {
    let userQuery = {};
    let chatUserQuery = {};
    for (var prop in userMemo) {
      if (["avatar", "name"].includes(prop)) {
        let str = `user.${prop == "name" ? "nickName" : prop}`;
        userQuery[str] = userMemo[prop];
      } else {
        Object.assign(chatUserQuery, { [prop]: userMemo[prop] });
      }
    }
    await userModel.updateOne({ _id: uid }, { $set: userQuery });
    await chatUserModel.updateOne({ uid }, { $set: { ...chatUserQuery } });
    res.json({
      code: 200,
      msg: "修改成功",
    });
  });
};

/**
 * 附件导入
 * @param {*} req 请求数据
 * @param {*} res 相应数据
 */
const chat_uploads = async (req, res) => {
    // 获取json数据进行解析
    fs.readFile(req.file.path, async function (err, json_str) {
        if(err) res.json({
            code: 500,
            msg: "上传失败"
        })
        res.json({
            code: 200,
            msg: "上传成功",
            data: {
                base64: `data:image/png;base64,${fs.readFileSync(req.file.path, 'base64')}`,
                avatar: req.file.path
            }
        });
    })
};

// chatCateList
exports.default = {
  chat_update_user,
  chat_uploads,
};
