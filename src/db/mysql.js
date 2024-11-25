const mysql = require('mysql');
const {SuccessModel, ErrorModel} = require("../model/responseModel");

// 配置数据库连接
const config = {
    host: '47.254.18.251',
    user: 'management_data',
    password: 'management_data',
    port: 3306,
    database: 'management_data',
    connectTimeout: 10000, // 连接超时
    timeout: 30000,  // 查询超时
};

// 创建数据库连接
let connection = mysql.createConnection(config);

// 执行SQL查询
function execSQL(sql, values) {
    return new Promise((resolve, reject) => {
        // 定义执行查询的函数
        const executeQuery = () => {
            connection.query(sql, values, (err, result) => {
                if (err) {
                    console.error('1.SQL 执行失败:', err);
                    // 检查是否是连接丢失或拒绝的错误PROTOCOL_ENQUEUE_AFTER_FATAL_ERRO
                    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.fatal === false) {
                        console.log('连接丢失或被拒绝，尝试重新连接...');
                        // 重新连接数据库
                        connection = mysql.createConnection(config);
                        connection.connect((err) => {
                            if (err) {
                                console.error('重新连接失败:', err);
                                reject(new Error('数据库连接失败'));
                            } else {
                                console.log('重新连接成功');
                                executeQuery(); // 重新执行查询
                            }
                        });
                    } else {
                        resolve(err); // 其他错误直接拒绝
                    }
                } else {
                    resolve(result); // 查询成功，返回结果
                }
            });
        };

        // 初次执行查询
        executeQuery();
    });
}

// 监听连接错误并重新连接
connection.on('error', (err) => {
    console.error('数据库连接错误:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('连接丢失，重新连接...');
        connection = mysql.createConnection(config); // 重新创建连接
        connection.connect();
    }
});

module.exports = execSQL;
