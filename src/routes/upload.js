const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '../..'); // 根目录路径

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(rootDir, 'src/uploads'); // 上传路径
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // 自动创建文件夹
        }
        cb(null, uploadDir); // 设置上传目录
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // 获取文件后缀
        cb(null, `${uniqueSuffix}${ext}`); // 定义文件名
    }
});

const upload = multer({ storage });  // 创建 multer 实例

module.exports = upload;
