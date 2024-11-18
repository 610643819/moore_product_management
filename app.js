const routerModel = require('./src/model/routerModel')
const querystring = require('querystring');
const serverHandler = (req, res) => {
    // 设置路由格式
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify specific origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token'); // 允许 Content-Type 和 x-access-token 头
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    // 获取path
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析 query
    req.query = querystring.parse(url.split('?')[1]);

    // 异步处理请求
    const getPostData = (req) => {
        console.log(`1.接受到${req.method}请求`)
        return new Promise((resolve, reject) => {
            // 处理 OPTIONS 请求，直接返回
            if (req.method === 'OPTIONS') {
                res.writeHead(204); // No content
                res.end();
                return;
            }
            // POST 请求处理
            if (req.method === 'POST') {
                console.log('2.开始POST请求处理')
                // console.log('req.headers[\'content-type\']', req.headers['content-type'])
                if (req.headers['content-type'] === 'application/json; charset=UTF-8') {
                    let postData = ''
                    req.on('data', (chunk) => {
                        postData += chunk;
                    })
                    req.on('end', () => {
                        if (!postData) {
                            return resolve({})
                        }
                        try {
                            console.log('3.post接受到的数据==>', JSON.parse(postData))
                            return resolve(JSON.parse(postData));
                        } catch (error) {
                            return reject(error); // 捕获 JSON 解析错误
                        }
                    })
                } else {
                    reject('发送了未知错误')
                }
            } else if (req.method === 'GET') {
                console.log('2.开始GET请求处理')
                resolve(req.query);
            } else {
                resolve({});
            }
        })

    }

    getPostData(req).then(data => {
        // 请求到数据放在响应对象中的body
        req.body = data;
        // 获取对应路由模块
        const routeModel = req.path.split('/')[2];
        console.log(`4.进入${routeModel}模块`, req.path)
        routerModel[routeModel](req, res)
            .then((data) => {
                if (data) {
                    return res.end(JSON.stringify(data))
                }
            })
    }).catch(err => {
        // 处理 JSON 解析或未知错误
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: err.message}));
    })


}

module.exports = serverHandler;