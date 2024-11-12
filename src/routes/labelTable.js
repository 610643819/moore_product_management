const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {pushLabelItem} = require('../controllers/labelTable.js')

const handleLoginRouter = (req, res) => {
    // 处理路由的逻辑
    // const method = req.method;  // 请求方式
    if ((req.method === 'GET' || req.method === 'OPTIONS') && req.path === '/api/labelTable/push') {
        // return login(req.body).then((data) => {
        //     return new SuccessModel(data)
        // })
        return pushLabelItem(req.body).then(data => {
            return new SuccessModel(data)
        })
    }
    // 處理異步請求
    // if (req.method === 'get' && req.path === '/api/login/login') {
    //     console.log(321)
    //     // const dataObj = login()
    //     // // 业务逻辑在controllers模块
    //     // return login(req.body).then((result) => {
    //     //     // console.log('result=========>', result);
    //     //     return new SuccessModel(result)
    //     // })
    //     //
    //     return login(req.body).then((data) => {
    //         return new SuccessModel(data)
    //     })
    //
    //
    // }
}

module.exports = handleLoginRouter