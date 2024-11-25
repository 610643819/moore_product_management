const {SuccessModel, ErrorModel} = require("../model/responseModel");
const {pushImageItem} = require('../controllers/image.js')

const pathHandlers = {
    '/api/image/push': pushImageItem, // 获取标签type
};

const handleRouter = (req, res) => {
    const handler = pathHandlers[req.path];  // 获取当前路径的处理对象
    // 请求处理
    if (handler) {
        // 如果 handler 是函数，直接调用
        console.log(`5.开始处理：${req.method}请求`);
        if (typeof handler === 'function') {
            return handler(req, res).then(res => {
                return new SuccessModel(res);
            }).catch(err => new ErrorModel(err))
        }
        // 如果 handler 是对象，按请求方法分发
        if (handler[req.method]) {
            return handler[req.method](req, res).then(res => {
                return new SuccessModel(res);  // 调用对应请求方法的处理函数
            }).catch(err => new ErrorModel(err))
        } else {
            // 如果没有对应的请求方法处理函数
            return new Promise(() => new ErrorModel(res.status(405).send('Method Not Allowed')))
        }
    } else {
        // 如果路径没有找到
        return new Promise(() => new ErrorModel(res.status(404).send('Not Found')))
    }
}

module.exports = handleRouter