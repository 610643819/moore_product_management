const execSQL = require("../db/mysql");

const pushLabelItem = (body) => {
    // console.log('执行SQL', body);
    console.log('获取到的数据', body);
    // body的值：data: [
    //     { label: 'test1', value: 'test1', color: '#000000', type: '产品' },
    //     { label: 'test2', value: 'test2', color: '#000000', type: '产品' },
    //     { label: 'test3', value: 'test3', color: '#000000', type: '产品' },
    //     { label: 'test4', value: 'test4', color: '#000000', type: '产品' }
    // ]

    const values = body.data.map(
        item => `('${item.label}', '${item.value}', '${item.color}', '${item.type}')`
    ).join(', ');
    console.log('values', values)
    // 输出('test1', 'test1', '#000000', '产品'), ('test2', 'test2', '#000000', '产品'), ('test3', 'test3', '#000000', '产品'), ('test4', 'test4', '#000000', '产品')
    // 插入数据的 SQL
    let sql = `
        INSERT IGNORE INTO label_list (label, value, color, type)
        VALUES ${values};
        `;




    console.log('执行SQL', sql); // 输出生成的 SQL 语句用于调试
    return execSQL(sql).then(result => {
        // 根据需要处理执行结果
        return result;
    });
}

module.exports = {
    pushLabelItem
}