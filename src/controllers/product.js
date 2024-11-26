const execSQL = require("../db/mysql");

// 添加产品
const pushProductItem = (req) => {
    console.log('req.body==========>', req.body)
    const {
        img_list, manufacturer_id, product_size, product_box_size, product_weight,
        product_box_weight, gears_joule_list, samples, tiered_pricing_1, tiered_pricing_2,
        tiered_pricing_3, model, manufacturer_model, shi_chang, chang_ping,
        zi_zhi, remarks, created_by, price
    } = req.body;

    // 确保 img_list 和其他数组对象字段是 JSON 字符串格式
    const formattedImgList = JSON.stringify(img_list);
    const formattedZiZhi = JSON.stringify(zi_zhi);  // 将资质数组转为 JSON 字符串
    const formattedShiChang = JSON.stringify(shi_chang); // 将市场数组转为 JSON 字符串
    const formattedChangPing = JSON.stringify(chang_ping); // 将产品相关数组转为 JSON 字符串
    const formattedGearsJoule = JSON.stringify(gears_joule_list); // 如果 gears_joule_list 是数字列表，保持其原始格式

    // 如果 manufacturer_id 为空字符串，将其替换为 null
    const manufacturerId = manufacturer_id || null;
    const createdBy = created_by || null;

    const sql = `
        INSERT INTO product_list (
            img_list, manufacturer_id, product_size, product_box_size, product_weight, 
            product_box_weight, gears_joule_list, zi_zhi, samples, tiered_pricing_1, 
            tiered_pricing_2, tiered_pricing_3, shi_chang, chang_ping, remarks, model, 
            manufacturer_model, created_by, price
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 插入的值（确保正确的顺序）
    const values = [
        formattedImgList, manufacturerId, product_size, product_box_size, product_weight,
        product_box_weight, formattedGearsJoule, formattedZiZhi, samples, tiered_pricing_1,
        tiered_pricing_2, tiered_pricing_3, formattedShiChang, formattedChangPing, remarks, model,
        manufacturer_model, createdBy, price
    ];

    // 检查一下列数和值的数量是否匹配
    console.log('列数:', sql.match(/\?/g).length);  // 打印 SQL 中占位符的数量
    console.log('插入的值数量:', values.length);  // 打印插入的值的数量

    // 这两者数量应该一致，否则会抛出错误
    if (sql.match(/\?/g).length !== values.length) {
        throw new Error("列数和插入值的数量不匹配");
    }

    console.log('执行SQL语句:', sql);  // 打印 SQL 语句
    console.log('插入的值:', values);  // 打印插入的值

    return execSQL(sql, values).then(result => {
        return result;
    }).catch(err => {
        console.error('SQL 执行失败:', err);
        // 处理错误
        throw new Error('数据库插入失败');
    });
};

module.exports = {
    pushProductItem
}
