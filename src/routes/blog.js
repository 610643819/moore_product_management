// 处理博客相关的接口
const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {getList, getDetail} = require('../controllers/blog')
const handleBlogRoute = (req, res) => {
    // 处理路由的逻辑
    // const method = req.method;  // 请求方式
    if (req.method === 'GET' && req.path === '/api/blog/list') {
        const a = req.query.a || '';
        const b = req.query.b || '';
        const dataObj = getList(a, b)
        return new SuccessModel(dataObj)
    }
    // 處理異步請求
    if (req.method === 'POST' && req.path === '/api/blog/detail') {
        const dataObj = getDetail()
        return new SuccessModel('这是一个post的请求')
    }
}

module.exports = handleBlogRoute