const execSQL = require("../db/mysql");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;
const login = (userName, userPassword) => {
    console.log('执行SQL', userName);
    let data = {}
    const sql = `select * from user where username = ${userName}`
    // execSQL(sql, (err, result) => {
    //     console.log(1)
    //     if (err) return console.log(err);
    //     console.log(2)
    //     console.log('result=======>', result)
    //     data = result
    // })

    return execSQL(sql).then(result => {
        const obj = result[0]
        const token = jwt.sign(
            { id: obj.id, username: obj.userName, userPassword: obj.userPassWord }, // payload
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
    })
}

module.exports = {login}
