const { ObjectId } = require('mongodb');
const { userModel } = require("../../../dao/model/system/user.js");
const { chatMessCateModel } = require("../../model/chat/messCate.js");
const { chatMessListModel } = require("../../model/chat/messList.js");
const client = require("../../../config/database.js").client;
const { get_base_userInfo } = require("../../../dao/controller/base").default;

// 新增消息
const chat_add_list = async (req, res) => {
  // 获取token
  let { access_token, data } = req.body;
 //这里演示查询所有用户,find不传参数为查询所有用户
  client.get(access_token, async function (err, uid) {
    console.log(data, data.uuid, uid)
    let cateData = await chatMessCateModel.findOne({ uid, 'cateList.uuid': data.uuid });
    // let chatData = await chatMessListModel.findOne({ uid, mid: cateData._id, uuid: data.uuid });
    // console.log(chatData)
    // if(!!data.loading)return;
    console.log(cateData)
    const chatData = await chatMessListModel.create({
        uid,
        mid: cateData._id,  
        ...data
    });
    res.json({
      code: 200,
      msg: "新增成功",
      data: chatData
    });
  });
};

// 修改消息种类
const chat_edit_cate = async (req, res) => {
  // 获取token
  let { access_token, data } = req.body;
  //这里演示查询所有用户,find不传参数为查询所有用户
  client.get(access_token, async function (err, uid) {
    await chatMessCateModel.updateOne(
      {
        uid: uid,
      },
      {
        $set: {
          "cateList.$[listItem].title": data.title,
        },
      },
      {
        arrayFilters: [
          {
            "listItem.uuid": data.uuid,
          },
        ],
      }
    );
    res.json({
      code: 200,
      msg: "修改成功",
    });
  });
};

// 删除消息
const chat_del_list = async (req, res) => {
  // 获取token
  let { data } = req.body;
  await chatMessListModel.remove({ _id: { $in: data._id.split(',') } });
  res.json({
      code: 200,
      msg: "删除成功"
  })
};

// 清空会话内容
const chat_clear_list = async (req, res) => {
  // 获取token
  let { data, access_token } = req.body;
  client.get(access_token, async function (err, uid) {
    await chatMessListModel.remove({ uid: ObjectId(uid), uuid: data.uuid });
    res.json({
        code: 200,
        msg: "清空成功"
    })
  });
};

exports.default = { 
  chat_add_list,
  chat_edit_cate,
  chat_add_list,
  chat_del_list,
  chat_clear_list
};