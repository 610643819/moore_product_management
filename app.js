const handleBlogRoute = require('./src/routes/blog');

const serverHandler = (req, res) => {

    // res.setHeader('Access-Control-Allow-Origin', '*');
    // 设置路由格式
    res.setHeader('Content-Type', 'application/json');


    // const method = req.method;  // 请求方式
    const url = req.url;    // 请求url
    req.path  = url.split('?')[0];  // 请求的路径

    const blogData = handleBlogRoute(req, res)
    if (blogData) {
       return res.end(JSON.stringify(blogData))
    }

    // 在没有命中路由的之后进行404处理
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 not found');
    return res.end()
}

module.exports = serverHandler;