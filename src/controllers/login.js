const execSQL = require("../db/mysql");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;
const login = (body) => {
    console.log('执行SQL', body);
    let data = {}
    const sql = `select * from user where username = '${body.name}' and userPassword = '${body.password}'`
    // execSQL(sql, (err, result) => {
    //     console.log(1)
    //     if (err) return console.log(err);
    //     console.log(2)
    //     console.log('result=======>', result)
    //     data = result
    // })

    return execSQL(sql).then(result => {
        console.log('sql获取完毕')
        const obj = result[0]
        const token = jwt.sign(
            { id: obj.id, username: obj.name, userPassword: obj.password }, // payload
            JWT_SECRET, // 秘密密钥
            { expiresIn: '12h' } // 设置 token 的有效期
        );
        // console.log('token', jwt.verify(token, JWT_SECRET))
        return {
            id: obj.id,
            name: obj.userName,
            nick: obj.userNickName,
            permission: obj.permission,
            token: token,
        }
    }).catch(err => {
        console.log('sql执行失败：' + err)
    })
}


module.exports = {login}
