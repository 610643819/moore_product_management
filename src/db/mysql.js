const mysql = require('mysql');

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
function execSQL(sql) {
    return new Promise((resolve, reject) => {
        const executeQuery = () => {
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error('SQL 执行失败:', err);
                    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
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
                        reject(err); // 其他错误
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
