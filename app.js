const handleBlogRoute = require('./src/routes/blog');
const querystring = require('querystring');
const serverHandler = (req, res) => {

    // res.setHeader('Access-Control-Allow-Origin', '*');
    // 设置路由格式
    res.setHeader('Content-Type', 'application/json');
    // 获取path
    const url = req.url;
    req.path = url.split('?')[0];

    // 解析 query
    req.query = querystring.parse(url.split('?')[1]);

    // 异步处理请求
    const getPostData = (req) => {
        return new Promise((resolve, reject) => {
            // POST 请求处理
            if (req.method === 'POST') {
                console.log('1');
                if (req.headers['content-type'] === 'application/json') {
                    console.log('2');
                    let postData = ''
                    req.on('data', (chunk) => {
                        console.log('chunk');
                        postData += chunk;
                    })
                    req.on('end', () => {
                        console.log('postData-1', postData)
                        if (!postData) {
                            console.log('postData-2', postData)
                            return resolve({})
                        }
                        try {
                            return resolve(JSON.parse(postData));
                        } catch (error) {
                            return reject(error); // 捕获 JSON 解析错误
                        }
                    })
                } else {
                    reject('发送了未知错误')
                }
            } else if (req.method === 'GET') {
                resolve(req.query);
            } else {
                resolve({});
            }
        })

    }

    getPostData(req).then(data => {
        // 请求到数据放在响应对象中的body
        req.body = data;

        // 博客相关的路由
        const blogData = handleBlogRoute(req, res)
        if (blogData) {
            return res.end(JSON.stringify(blogData))
        } else {
            // 在没有命中路由的之后进行404处理
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 not found');
            return res.end()
        }
    }).catch(err => {
        // 处理 JSON 解析或未知错误
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    })


}

module.exports = serverHandler;