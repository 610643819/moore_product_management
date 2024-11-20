const execSQL = require("../db/mysql");

// 添加厂商列表
const pushManufacturerItem = (req) => {
    const { name, boss, bossWechat, bossPhone, salesman, salesmanWeChat, salesmanPhone, address, factoryAddress } = req.body;

    // 验证必填字段
    if (!name || !boss) {
        return Promise.reject(new Error('name 和 boss 是必填字段'));
    }

    // 构建 SQL 查询
    let sql = `
        INSERT INTO manufacturer (name, boss, bossWechat, bossPhone, salesman, salesmanWeChat, salesmanPhone, address, factoryAddress) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 为SQL语句提供值
    const values = [
        name,
        boss,
        bossWechat || null, // 如果字段为空，则插入null
        bossPhone || null,
        salesman || null,
        salesmanWeChat || null,
        salesmanPhone || null,
        address || null,
        factoryAddress || null
    ];

    console.log('6.执行SQL', sql, values); // 输出生成的 SQL 语句及其值，用于调试

    // 执行SQL查询
    return execSQL(sql, values).then(result => {
        return result;
    }).catch(err => {
        console.error('SQL 执行失败:', err);
        throw new Error('数据库插入失败');
    });
};


module.exports = {
    pushManufacturerItem
}