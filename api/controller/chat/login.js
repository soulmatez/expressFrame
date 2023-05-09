const { userModel } = require("../../../dao/model/system/user.js");
const { chatUserModel } = require("../../model/chat/user.js");
// const { chatMessCateModel } = require("../../model/chat/messCate.js");
const { deptModel } = require("../../../dao/model/system/dept.js");
const { setToken } = require("../../../utils/authotoken.js").default;
const { setCaptcha, avatarCheck } = require("../../../utils/index").default;
const { _pubkey, _prikey, decrypt } =
  require("../../../utils/keyStore.js").default;
const client = require("../../../config/database.js").client;
var logController = require("../../../dao/controller/system/log.js").default;
const { get_base_userInfo } = require("../../../dao/controller/base").default;

//处理登录操作
const employee_login = async (req, res) => {
  let { username, password } = req.body;
  const data = await userModel.findOne({
    "user.userName": username,
    "user.password": decrypt(_prikey, password),
  });
  if (data != null) {
    if (data.user.status == "0") {
      res.json({
        code: 500,
        msg: "账户被管理员禁止登录，请联系管理员解除",
      });
    }
    // 生成token
    setToken(username, data._id).then(async (token) => {
      // 将token存储到redis
      client.set(token, data._id.toString(), function (err, res) {
        client.expire(token, 60 * 60);
      });
      // 公共写入日志
      // await logController.log_add_controller({
      //     uid: data._id,
      //     requestUrl: '/oauth/login',
      //     status: 200,
      //     requestMethod: req.method.toLowerCase(),
      //     requestHost: req.host,
      //     requestBody: {}
      // }, true)

      res.json({
        code: 200,
        msg: "登录成功",
        data: {
          access_token: token,
          token_type: "token",
        },
      });
    });
  } else {
    res.json({
      code: 500,
      msg: "用户名或密码不正确",
    });
  }
};

//chatGPT注册服务
const chat_login = async (req, res) => {
  //这里演示查询所有用户,find不传参数为查询所有用户
  let { userName, passWord, remark } = req.body;
  var data = await userModel.findOne({
    "user.userName": userName,
    "user.password": passWord,
  });
  var textName = "";
  if (data != null) {
    if (data.user.status == "0") {
      res.json({
        code: 500,
        msg: "账户被管理员禁止登录，请联系管理员解除",
      });
    }
    textName = "登入";
  } else {
    let userMo = {};
    let userObj = {};
    let deptId = "643f5d5afd7cdd0e40b02e1a";
    let userDeptObj = await deptModel.findById(deptId);
    // 获取创建者
    Object.assign(userObj, {
      createBy: "admin",
      updateBy: "admin",
      deptId,
      userName,
      nickName: userName,
      password: passWord,
      email: "",
      sex: "1",
      phonenumber: "chatgptPhone",
      status: "1",
      loginIp: "127.0.0.1",
      dept: userDeptObj,
      remark,
    });
    Object.assign(userMo, {
      roleIds: "643f5e463dec79ec58677c5b",
      user: userObj,
    });
    data = await userModel.create(userMo);
    textName = "注册并登入";

    //chatUser表
    chatData = await chatUserModel.create({ uid: data._id });
  }
  // 生成token
  setToken(userName, data._id).then(async (token) => {
    // 将token存储到redis
    client.set(token, data._id.toString(), function (err, res) {
      client.expire(token, 60 * 60 * 24 * 10);
    });
    // 公共写入日志
    await logController.log_add_controller(
      {
        uid: data._id,
        name: textName,
        requestUrl: `${req.baseUrl}${req.url}`,
        status: 200,
        requestMethod: req.method.toLowerCase(),
        requestHost: req.host,
        requestBody: {},
        serviceName: "chatGPTSevice",
      },
      3
    );
    res.json({
      code: 200,
      msg: `${textName}成功`,
      data: {
        access_token: token,
      },
    });
  });
};

//处获用户信息并校验token
const chat_user_info = (req, res) => {
  // 获取token
  let { access_token } = req.body;
  if (access_token == undefined) {
    res.status(401).json({
      code: 401,
    });
  } else {
    client.get(access_token, async function (err, data) {
      if (data != null) {
        // 延期token
        client.set(access_token, data, function (err, suc) {
          client.expire(access_token, 60 * 60 * 24 * 10);
        });
        // 获取当前用户
        const user = await chatUserModel
          .find({ uid: data })
          .populate("uid")
          .then(async (doc) => {
            let userInfo = {};
            let appInfo = {};
            let settingInfo = {};
            if (doc.length > 0) {
              Object.assign(userInfo, {
                uid: doc[0]["uid"]._id.toString(),
                name: doc[0]["uid"].user.nickName,
                avatar: avatarCheck(doc[0]["uid"].user.avatar),
              });
              const keys = await chatUserModel.aggregate([
                { $project: { arrayofkeyvalue: { $objectToArray: "$$ROOT" } } },
                { $unwind: "$arrayofkeyvalue" },
                {
                  $group: {
                    _id: null,
                    allkeys: { $addToSet: "$arrayofkeyvalue.k" },
                  },
                },
              ]);
              keys[0].allkeys.forEach((item) => {
                if (item != "_id" && item != "uid" && !!doc[0][item] && item != '__v') {
                  if(item == 'description')
                    Object.assign(userInfo, {
                      [item]: doc[0][item],
                    });
                  else if(['email', 'gitHub', 'language', 'theme', 'siderCollapsed'].includes(item))
                    Object.assign(appInfo, {
                      [item]: doc[0][item],
                    });
                  else
                    Object.assign(settingInfo, {
                      [item]: doc[0][item],
                    });
                }
              });
            }
            return {
              userInfo,
              appInfo,
              settingInfo
            };
          });
        res.json({
          code: 200,
          msg: `用户信息获取成功`,
          data: user,
        });
      } else {
        res.status(401).json({
          code: 402,
          msg: "用户状态异常，请重新登录！",
        });
      }
    });
  }
};

//用户登出操作
const chat_logout = async (req, res) => {
  // 获取token
  let { access_token } = req.body;
  client.get(access_token, async function(err, uid){
    // 公共写入日志
    await logController.log_add_controller(
      {
        uid: uid,
        name: '登出',
        requestUrl: `${req.baseUrl}${req.url}`,
        status: 200,
        requestMethod: req.method.toLowerCase(),
        requestHost: req.host,
        requestBody: {},
        serviceName: "chatGPTSevice",
      },
      3
    );
    client.set(access_token, '', function(err, rs){
        client.expire(access_token, 0)
        res.json({
            code: 200,
            msg: "注销成功"
        })
    })
})
};


exports.default = {
  chat_login,
  chat_user_info,
  chat_logout,
};
