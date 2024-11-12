const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {login} = require('../controllers/login.js')

const handleBlogRoute = (req, res) => {
    // 处理路由的逻辑
    // const method = req.method;  // 请求方式
    // if (req.method === 'GET' && req.path === '/api/login') {
    //     const a = req.query.a || '';
    //     const b = req.query.b || '';
    //     const dataObj = getList(a, b)
    //     return new SuccessModel(dataObj)
    // }
    // 處理異步請求
    if (req.method === 'POST' && req.path === '/api/login/login') {
        // const dataObj = login()
        // // 业务逻辑在controllers模块
        // return login(req.body).then((result) => {
        //     // console.log('result=========>', result);
        //     return new SuccessModel(result)
        // })
        //
        return login(req.body).then((data) => {
            return new SuccessModel(data)
        })


    }
}

module.exports = handleBlogRoute