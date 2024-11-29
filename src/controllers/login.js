const execSQL = require("../db/mysql");
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;
const login = (body) => {
    console.log('执行SQL', body);
    const sql = `select * from user where username = '${body.name}' and userPassword = '${body.password}'`
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

const register = (body) => {
    const { name, password, enterprise, nickName } = body;

    if (enterprise !== 'mooresz') {
        return Promise.reject('企业代码错误');
    }

    // Check if username or password is missing
    if (!name || !password) {
        return Promise.reject('用户名或密码不能为空');
    }

    // Check if user already exists
    const checkUserSQL = `SELECT * FROM user WHERE username = '${name}'`;
    return execSQL(checkUserSQL).then((result) => {
        if (result.length > 0) {
            return Promise.reject('用户名已存在');
        }

        // Insert new user into the database
        const insertSQL = `
            INSERT INTO user (username, userPassword, userNickName) 
            VALUES ('${name}', '${password}', '${nickName}')
        `;
        return execSQL(insertSQL);
    }).then(() => {
        // Fetch newly registered user to generate a token
        const fetchUserSQL = `SELECT * FROM user WHERE username = '${name}'`;
        return execSQL(fetchUserSQL);
    }).then((result) => {
        if (result.length === 0) {
            return Promise.reject('注册失败，请稍后重试');
        }

        const obj = result[0];
        const token = jwt.sign(
            { id: obj.id, username: obj.username },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        return {
            id: obj.id,
            name: obj.username,
            nick: obj.userNickName || '',
            permission: obj.permission || 'user', // default permission
            token: token,
        };
    })
};



module.exports = {login, register}
