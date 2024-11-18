const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {pushLabelItem, getLabelTypeList, getLabelList} = require('../controllers/labelTable.js')

const pathHandlers = {
    '/api/labelTable/list': getLabelList, // 获取标签type
    '/api/labelTable/type': getLabelTypeList, // 获取标签type
    '/api/labelTable/push': {
        POST: pushLabelItem,  // POST请求的处理函数
        GET: pushLabelItem    // GET请求的处理函数
    },
};

const handleLoginRouter = (req, res) => {
    const handler = pathHandlers[req.path];  // 获取当前路径的处理对象
    // 请求处理
    if (handler) {
        // 如果 handler 是函数，直接调用
        console.log(`5.开始处理：${req.method}请求`);
        if (typeof handler === 'function') {
            return handler(req, res).then(res => {
                return new SuccessModel(res);
            })
        }
        // 如果 handler 是对象，按请求方法分发
        if (handler[req.method]) {
            return handler[req.method](req, res).then(res => {
                return new SuccessModel(res);  // 调用对应请求方法的处理函数
            })
        } else {
            // 如果没有对应的请求方法处理函数
            new ErrorModel(res.status(405).send('Method Not Allowed'))
        }
    } else {
        // 如果路径没有找到

        new ErrorModel(res.status(404).send('Not Found'))
    }
}

module.exports = handleLoginRouter