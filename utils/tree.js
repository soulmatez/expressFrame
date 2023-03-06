const svgCaptcha = require("svg-captcha")  // 加载图片验证码模块+
const moment = require('moment');  //时间戳插件
var mongoose = require('mongoose');


/**
 * 查找树
 * 
 * @params array 目标数组
 * @params Obj 要添加的节点
 * @params filterId 挂载树的节点Id
 * @params parentIdLst 统计出祖宗节点的id
 * @params isStop 统计锁，如果true，说明统计结束
 * @params type 1新增 2修改
 * 
 */
var public = '';
function treeFilter(array, Obj, filterId, type, parentIdLst='') {
    array.forEach((item, index) => {
        if(item.parentId == '0')parentIdLst=item._id;
        if(type == 3){
            if(item._id == filterId){
                array.splice(index, 1)
                public = parentIdLst;
                return;
            }
        }else{
            if(item._id == filterId){
                if(!item.children){
                    Object.assign(item, {
                        children: []
                    })
                }
                if(type == 2){
                    let limitArr = JSON.parse(JSON.stringify(item.children)); 
                    const isBoolean = arrDelete(limitArr, (itemq)=>itemq._id == Obj._id);
                    return;
                    if(!isBoolean){
                        limitArr = removeNode(array, filterId)
                    }
                    item.children = JSON.parse(JSON.stringify(limitArr));
                }
                
                item.children.push(Obj);
                public = parentIdLst;
                return;
            }
        }
        
        if(item.children){
            item.children = treeFilter(item.children, Obj, filterId, type, parentIdLst)
        }
    })
    return array;
}

/**
 * 查找树、新增节点
 * 
 * @params array 目标数组
 * @params Obj 要添加的节点
 * @params filterId 挂载树的节点Id
 * @params parentIdLst 统计出祖宗节点的id
 * @params isStop 统计锁，如果true，说明统计结束
 * 
 */

function treeAddNode(array, Obj, filterId) {
    let arrayA = treeFilter(array, Obj, filterId, 1)
    const resultArr = arrayA.filter(item => {
        return item._id == public
    })[0]
    return { resultArr, public };
}

/**
 * 查找树、替换节点
 * 
 * @params array 目标数组
 * @params Obj 要添加的节点
 * @params filterId 挂载树的节点Id
 * @params parentIdLst 统计出祖宗节点的id
 * @params isStop 统计锁，如果true，说明统计结束
 * 
 */
function treeUpdateNode(array, Obj, filterId) {
    let arrayA = treeFilter(array, Obj, filterId, 2)
    const resultArr = arrayA.filter(item => {
        return item._id == public
    })[0]
    return { resultArr, public };
}

/**
 * 查找树、删除节点
 * 
 * @params array 目标数组
 * @params Obj 要添加的节点
 * @params filterId 挂载树的节点Id
 * @params parentIdLst 统计出祖宗节点的id
 * @params isStop 统计锁，如果true，说明统计结束
 * 
 */
function treeDelNode(array, Obj, filterId) {
    let arrayA = treeFilter(array, Obj, filterId, 3)
    const resultArr = arrayA.filter(item => {
        return item._id == public
    })[0]
    return { resultArr, public };
}

exports.default = {
    treeAddNode, treeUpdateNode, treeDelNode
}