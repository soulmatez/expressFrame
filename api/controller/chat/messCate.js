const { ObjectId } = require('mongodb');
const { userModel } = require("../../../dao/model/system/user.js");
const { chatUserModel } = require("../../model/chat/user.js");
const { chatMessCateModel } = require("../../model/chat/messCate.js");
const { chatMessListModel } = require("../../model/chat/messList.js");
const client = require("../../../config/database.js").client;
const { get_base_userInfo } = require("../../../dao/controller/base").default;

// 获取消息种类列表
const chat_cate_list = async (req, res) => {
  // 获取token
  let { access_token } = req.body;
  let active = ''
  //这里演示查询所有用户,find不传参数为查询所有用户
  client.get(access_token, async function (err, uid) {
    let data = await chatMessCateModel.findOne({ uid }).sort({ _id: -1 }).then(async doc => {
      let chat = []
      let history = []
      if (!doc) {
        let dateTime = Date.now()
        history = await chatMessCateModel.create({
          uid,
          cateList: [
            {
              uuid: dateTime,
              title: "New Chat",
              isEdit: false,
            },
          ],
        });
        chat.push({ 
          uuid: dateTime,
          data: [] 
        })

        //设置用户的active
        await chatUserModel.updateOne({uid}, { active: dateTime });
        active = dateTime
      }else{
        history = doc
        const chatList = await chatMessListModel.aggregate([
          {
            $project:{
              uuid: '$uuid',
              uid: 1,
              _id: 1,
              conversationOptions: 1,
              dateTime: 1,
              error: 1,
              inversion: 1,
              requestOptions: 1,
              text: 1,
              loading: 1
            }
          },
          {
            $match: {
              uid: ObjectId(uid)
            }
          },
          {
            $group: {
              "_id": "$uuid",
              "data": {
                $push: "$$ROOT"
              }
            }
          }
          // { $sort: { joinDate: -1 } }
        ]);
        let ids = chatList.map(item => item._id)
        doc.cateList.forEach(item => {
          if(ids.includes(item.uuid)){
            let row = chatList.filter(itfilter => itfilter._id == item.uuid)
            row[0].data.forEach(b => {
              delete b.uid
              delete b.uuid
            })
            chat.push({ 
              uuid: item.uuid,
              data: row[0].data 
            })
          }else{
            chat.push({ 
              uuid: item.uuid,
              data: [] 
            })
          }
        });

        //设置用户的active
        var chatUser = await chatUserModel.findOne({uid});
        active = chatUser.active
      }
      return {
        history,
        chat,
        active
      }
    });
    res.json({
      code: 200,
      msg: "获取成功",
      data
    });

  });
};

// 新增消息种类
const chat_add_cate = async (req, res) => {
  // 获取token
  let { access_token, data } = req.body;
  //这里演示查询所有用户,find不传参数为查询所有用户
  client.get(access_token, async function (err, uid) {
    await chatMessCateModel.updateOne(
      {
        uid: uid,
      },
      {
        $push: {
          cateList: {
            $each: [{ ...data }],
            $position: 0,
          },
        },
      }
    );
    res.json({
      code: 200,
      msg: "新增成功",
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

// 删除消息种类
const chat_del_cate = async (req, res) => {
    console.log(req.body)
  // 获取token
  let { access_token, data } = req.body;
  //这里演示查询所有用户,find不传参数为查询所有用户
  client.get(access_token, async function (err, uid) {
    await chatMessCateModel.updateOne(
      {
        uid: uid,
      },
      {
        "$pull": { 
            "cateList": {
                "uuid": data.uuid
            }
        }
      }
    );
    res.json({
      code: 200,
      msg: "删除成功",
    });
  });
};

exports.default = {
  chat_cate_list,
  chat_add_cate,
  chat_edit_cate,
  chat_del_cate,
};
