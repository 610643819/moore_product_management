const execSQL = require("../db/mysql");

// 添加厂商列表
const pushManufacturerItem = (req) => {
    const { name, boss, bossWechat, bossPhone, salesman, salesmanWeChat, salesmanPhone, address, factoryAddress } = req.body;

    // 检查必填字段
    if (!name || !boss) {
        throw new Error('必填字段 厂商名称 或 老板名称 为空');
    }

    const sql = `
        INSERT INTO manufacturer (name, boss, bossWechat, bossPhone, salesman, salesmanWeChat, salesmanPhone, address, factoryAddress) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [name, boss, bossWechat, bossPhone, salesman, salesmanWeChat, salesmanPhone, address, factoryAddress];

    console.log('执行SQL语句:', sql);  // 打印 SQL 语句
    console.log('插入的值:', values);  // 打印插入的值

    return execSQL(sql, values).then(result => {
        return result;
    }).catch(err => {
        console.error('2.SQL 执行失败:', err);
        // 处理错误
        throw new Error('数据库插入失败');
    });
};

// 获取产商列表
const getLabelList = ({ body: { page = 1, pageSize = 10, name = '' } }) => {
    // 构建查询条件
    let sql = `SELECT name, boss, bossWechat, bossPhone, salesman, salesmanWeChat, salesmanPhone, address, factoryAddress FROM manufacturer WHERE is_deleted = 0`;
    const conditions = [];

    // 添加查询条件
    if (name) {
        conditions.push(`name LIKE '%${name}%'`);
    }

    // 如果有查询条件，拼接到SQL中
    if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY id DESC';  // 按 id 字段倒序排序
    // 添加分页功能
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;

    console.log('6.最终生成的SQL:', sql);

    // 获取数据和总数
    const dataPromise = execSQL(sql);

    // 获取总数的查询语句
    let totalSql = `SELECT COUNT(*) AS total FROM manufacturer WHERE is_deleted = 0`;
    if (conditions.length > 0) {
        totalSql += ' AND ' + conditions.join(' AND ');
    }

    // 执行查询并返回结果
    return Promise.all([dataPromise, execSQL(totalSql)]).then(([result, totalResult]) => {
        // 获取 total 数量
        const total = totalResult[0]?.total || 0;

        return {
            list: result,  // 分页数据
            total,   // 总记录数
        };
    }).catch(error => {
        console.error('查询错误:', error);
        throw error;
    });
};

module.exports = {
    pushManufacturerItem,
    getLabelList
}