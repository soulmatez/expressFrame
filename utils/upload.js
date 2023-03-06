var multer = require('multer');
const path = require('path')
// 此操作会创建uploads文件夹，也可理解为最终存储的目标文件夹,服务启动就会自动创建
// var upload = multer({ dest: 'Simulation_Model/' });
// 此操作理解为，将文件暂时储存在这个文件夹中
var storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/static/upload'),
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

exports.default = { upload }