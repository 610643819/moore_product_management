const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const routerModel = require('./src/model/routerModel')

// 设置上传路径  D:\moore\moore_product_management\src\uploads
const rootDir = path.join(__dirname,); // 根目录
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(rootDir, 'src/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});
const uploadSingle = multer({ storage }).single('image'); // 接受上传的单个文件

const serverHandler = (req, res) => {
    // 设置路由格式
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 获取 path
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析 query
    req.query = querystring.parse(url.split('?')[1]);

    // 异步处理请求
    const getPostData = (req) => {
        console.log(`1.接受到${req.method}请求`);
        return new Promise((resolve, reject) => {
            // 处理 OPTIONS 请求，直接返回
            if (req.method === 'OPTIONS') {
                res.writeHead(204); // No content
                res.end();
                return;
            }
            // POST 请求处理
            if (req.method === 'POST') {
                console.log('2.开始POST请求处理');
                // console.log('req.headers[\'content-type\']', req.headers['content-type'])
                if (req.headers['content-type'] === 'application/json; charset=UTF-8') {
                    let postData = '';
                    req.on('data', (chunk) => {
                        postData += chunk;
                    });
                    req.on('end', () => {
                        if (!postData) {
                            return resolve({});
                        }
                        try {
                            console.log('3.post接受到的数据==>', JSON.parse(postData));
                            return resolve(JSON.parse(postData));
                        } catch (error) {
                            return resolve(error);
                        }
                    });
                } else {
                    resolve('发送了未知错误');
                }
            } else if (req.method === 'GET') {
                console.log('2.开始GET请求处理');
                resolve(req.query);
            } else {
                resolve({});
            }
        });
    };

    getPostData(req).then(data => {
        req.body = data; // 将解析到的数据挂载到 req.body

        // 处理上传请求
        if (req.path === '/upload' && req.method === 'POST') {
            console.log('处理文件上传...');
            uploadSingle(req, res, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: '文件上传失败', details: err }));
                }

                // 获取上传的文件路径
                const imagePath = `/uploads/${req.file.filename}`;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: '文件上传成功', filePath: imagePath }));
            });
        }
        // 处理静态文件请求
        else if (req.path.startsWith('/uploads')) {
            const filePath = path.join(rootDir, 'src', req.path); // 获取图片的绝对路径
            const extname = path.extname(filePath);
            const mimeTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml'
            };
            console.log('filePath', filePath)
            fs.exists(filePath, (exists) => {
                if (exists) {
                    res.writeHead(200, { 'Content-Type': mimeTypes[extname] || 'application/octet-stream' });
                    const readStream = fs.createReadStream(filePath);
                    readStream.pipe(res);
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('文件未找到');
                }
            });
        }
        else {
            // 获取路由模块并执行
            const routeModel = req.path.split('/')[2];
            console.log(`4.进入${routeModel}模块`, req.path);
            routerModel[routeModel](req, res)
                .then((data) => {
                    if (data) {
                        return res.end(JSON.stringify(data));
                    }
                });
        }
    }).catch(err => {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: err.message}));
    });
};

module.exports = serverHandler;
