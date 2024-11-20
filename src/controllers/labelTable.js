const execSQL = require("../db/mysql");

// 添加标签列表
const pushLabelItem = (req) => {
    const values = req.body.map(
        item => `('${item.label}', '${item.value}', '${item.color}', '${item.type}')`
    ).join(', ');
    let sql = `
        INSERT IGNORE INTO label_list (label, value, color, type)
        VALUES ${values};
        `;
    console.log('6.执行SQL', sql); // 输出生成的 SQL 语句用于调试
    return execSQL(sql).then(result => {
        return result;
    })
}
// 获取标签类别列表
const getLabelTypeList = () => {
    let sql = `
       SELECT label, value FROM label_list_type WHERE is_deleted = 0;
        `;
    console.log('6.执行SQL', sql); // 输出生成的 SQL 语句用于调试
    return execSQL(sql).then(result => {
        return result;
    });
}
// 获取标签列表
// page 分页
// pageSize 数量
// label 标签名称
// type 标签类型
const getLabelList = ({ body: { page = 1, pageSize = 10, label = '', type = '' } }) => {
    // 构建查询条件
    let sql = `SELECT label, type, color, id, time, value FROM label_list WHERE is_deleted = 0`;
    const conditions = [];

    // 添加查询条件
    if (label) {
        conditions.push(`label LIKE '%${label}%'`);
    }
    if (type) {
        conditions.push(`type = '${type}'`);
    }

    // 如果有查询条件，拼接到SQL中
    if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
    }

    // 添加分页功能
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;

    console.log('6.最终生成的SQL:', sql);

    // 获取数据和总数
    const dataPromise = execSQL(sql);

    // 获取总数的查询语句
    let totalSql = `SELECT COUNT(*) AS total FROM label_list WHERE is_deleted = 0`;
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
    pushLabelItem,
    getLabelList,
    getLabelTypeList
}