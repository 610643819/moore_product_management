// 处理博客相关的接口
const handleBlogRoute = (req, res) => {
    // 处理路由的逻辑
    // const method = req.method;  // 请求方式
    if (req.method === 'GET' && req.path === '/api/blog/list') {
        return {
            message: '获取博客列表接口',
        }
    }
}

module.exports = handleBlogRoute