const execSQL = require("../db/mysql");

const pushLabelItem = (body) => {
    // console.log('执行SQL', body);
    console.log('获取到的数据', JSON.stringify(data));
    // console.log('获取到的数据', )
    // let sql = ''
    // return execSQL(sql).then(result => {})
}

module.exports = {
    pushLabelItem
}