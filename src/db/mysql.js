// 链接mysql
const mysql = require('mysql');
// const config = {
//     host: 'localhost',
//     user: 'root',
//     password: 'ting.1996',
//     port: 3306,
//     database: 'data',
// }
const config = {
    host: '47.254.18.251',
    user: 'management_data',
    password: 'management_data',
    port: 3306,
    database: 'management_data',
    connectTimeout: 10000,
    timeout: 30000,  // 查询超时设置为30秒
}
const connection = mysql.createConnection(config)
// 执行连接
connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }
    console.log('已连接到数据库，连接ID: ' + connection.threadId);
});
// 包装返回promise
function execSQL(sql) {
    console.log('7.execSQL 执行:', sql);
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                console.log('SQL 执行失败:', err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    // 连接丢失的错误
                    reject(new Error('数据库连接丢失，尝试重新连接'));
                } else if (err.code === 'ECONNREFUSED') {
                    // 连接被拒绝
                    reject(new Error('数据库连接被拒绝，请检查网络连接'));
                } else if (err.code === 'ETIMEDOUT') {
                    // 超时错误
                    reject(new Error('数据库连接超时，请检查网络或数据库配置'));
                } else {
                    // 其他错误
                    reject(err);
                }
                return;
            }
            resolve(result);
        });
    });
}
module.exports = execSQL