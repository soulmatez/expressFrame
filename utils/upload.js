const fs = require('fs'); 
var multer = require('multer');
const path = require('path')
// 此操作会创建uploads文件夹，也可理解为最终存储的目标文件夹,服务启动就会自动创建
// var upload = multer({ dest: 'Simulation_Model/' });
// 此操作理解为，将文件暂时储存在这个文件夹中

const resolve = (dir) => {
    return path.join(__dirname, `../${dir}`)
}

var storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        let dateString = new Date().toLocaleDateString();
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            const imagePath = `/public/static/upload/image/${dateString}`
            await isFileExisted(imagePath)
            cb(null, resolve(imagePath))
        } else if (file.mimetype === 'application/json') {
            const imagePath = `/public/static/upload/json/${dateString}`
            await isFileExisted(imagePath)
            cb(null, resolve(imagePath))
        } else {
            // 3.1.2 限制其他文件上传类型
            cb({ error: 'Mime type not supported' })
        }
    },
    filename: function (req, file, cb) {
        let dateString = new Date().getTime();
        cb(null, `${dateString}_${file.originalname}`)
    }
})
var upload = multer({ storage: storage })

/* 判断文件是否存在的函数
*@path_way, 文件路径
 */
function isFileExisted(path_way) {
    path_way = path.resolve(__dirname, `../${path_way}`);
    console.log(fs.existsSync(path_way), path_way)
    return new Promise(async (resolve, reject) => {
        if(fs.existsSync(path_way)){
            resolve(true)
        }else{
            fs.mkdirSync(path_way, { recursive: true })
            resolve(true)
        }
    })
};

exports.default = { upload, isFileExisted }