const execSQL = require("../db/mysql");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '../..');
// 配置 multer，用于处理图片上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(rootDir, 'src/uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // 自动创建文件夹
        }
        cb(null, uploadDir); // 保存到文件夹
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // 获取文件后缀
        cb(null, `${uniqueSuffix}${ext}`); // 定义文件名
    }
});

const upload = multer({ storage: storage });

const pushImageItem = async (req, res) => {
    const uploadSingle = upload.single('image'); // 'image' 是前端传递的字段名
    const values = req.body; // 获取其他表单数据

    // 将 multer 的 `uploadSingle` 包装为 Promise
    const uploadPromise = () => new Promise((resolve, reject) => {
        uploadSingle(req, res, (err) => {
            if (err) {
                return reject(err); // 上传失败
            }
            resolve(req.file); // 上传成功返回文件信息
        });
    });

    try {
        // 等待文件上传完成
        const file = await uploadPromise();
        const imagePath = `/uploads/${file.filename}`; // 获取文件路径
        const { tagName } = values; // 假设表单中有一个 tagName 字段
        console.log('values====>', values)

        // 构造 SQL 语句
        const sql = `
            INSERT INTO image (tagName, imagePath)
            VALUES ('${tagName}', '${imagePath}');
        `;
        console.log('6.执行SQL:', sql); // 调试 SQL 语句

        // 执行 SQL 并返回结果
        const result = await execSQL(sql);
        console.log('SQL 执行结果:', result);

        // 返回结果
        return {
            result,
            tagName,
            imagePath
        };

    } catch (error) {
        console.error('上传或数据库操作失败:', error);

        // 抛出错误，调用者可以捕获
        throw error;
    }
};

module.exports = { pushImageItem };
