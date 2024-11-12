const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {login, loginPost} = require('../controllers/login.js')

const handleLoginRouter = (req, res) => {
    // 处理路由的逻辑

    // const method = req.method;  // 请求方式
    console.log('req.path', req.path, req.method)
    if ((req.method === 'GET' || req.method === 'OPTIONS') && req.path === '/api/login/login') {
        console.log('开始登录')
            return login(req.body).then((data) => {
                return new SuccessModel(data)
            })
    } else if (req.method === 'POST' && req.path === '/api/login/login') {
        console.log(321)
        return loginPost(req.body).then((data) => {
            return new SuccessModel(data)
        })


    }
}

module.exports = handleLoginRouter