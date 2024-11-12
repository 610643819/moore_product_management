const fs = require('fs');
const path = require('path');

const routerModel = {};
// 获取路由模块的目录
const routesDir = path.join(__dirname, '../routes');
// console.log('routesDir', routesDir)
//
// // 动态加载所有路由模块
fs.readdirSync(routesDir).forEach(file => {
    // 判断是否是 JavaScript 文件
    if (file.endsWith('.js')) {
        // 获取路由模块的名称（去掉文件扩展名）
        const routeName = file.replace('.js', '');
        // 动态导入路由模块
        routerModel[routeName] = require(path.join(routesDir, file));
    }
});

module.exports = routerModel;