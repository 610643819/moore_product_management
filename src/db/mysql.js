// 链接mysql
const mysql = require('mysql');
console.log('mysql', mysql)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ting.1996',
    port: 3306,
    database: 'data',
})

connection.connect()

// const sql = `select * from user where username = 13424010835`;
// connection.query(sql, (err, res) => {
//     if (err) {
//         console.log('err', err)
//         return;
//     }
//     console.log('res------>', res)
// })

// 链接关闭


// function execSQL(sql, callback) {
//     connection.query(sql, callback)
//     connection.end()
// }
// 包装返回promise
function execSQL(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
}
module.exports = execSQL