const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {login, register} = require('../controllers/login.js')

const handleLoginRouter = (req, res) => {
    // 处理路由的逻辑

    // const method = req.method;  // 请求方式
    console.log('req.path', req.path, req.method)
    if ((req.method === 'GET' || req.method === 'OPTIONS') && req.path === '/api/login/login') {
        console.log('开始登录')
            return login(req.body).then((data) => {
                return new SuccessModel(data)
            }).catch((err) => {
                return new ErrorModel(err)
            })
    } else if (req.method === 'POST' && req.path === '/api/login/login') {
        return login(req.body).then((data) => {
            return new SuccessModel(data)
        }).catch((err) => {
            return new ErrorModel(err)
        })
    } else if (req.method === 'POST' && req.path === '/api/login/register') {
        return register(req.body).then((data) => {
            return new SuccessModel(data)
        }).catch((err) => {
            return new ErrorModel(err)
        })
    }
}

module.exports = handleLoginRouter