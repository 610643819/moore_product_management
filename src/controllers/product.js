const execSQL = require("../db/mysql");

// 添加产品
const pushProductItem = (req) => {
    const {
        img_list, manufacturer_id, product_size, joule, tiered_pricing_1,
        tiered_pricing_2, tiered_pricing_3, model, manufacturer_model,
        product_box_size, product_weight, product_box_weight, gears,
        zi_zhi, samples, shi_chang, remarks, created_by, price
    } = req.body;

    // 检查必填字段
    if (!img_list || !manufacturer_id || !product_size || !joule ||
        !tiered_pricing_1 || !tiered_pricing_2 || !tiered_pricing_3 ||
        !model || !manufacturer_model) {
        throw new Error('必填字段为空');
    }

    const sql = `
        INSERT INTO product_list (
            img_list, manufacturer_id, product_size, product_box_size, product_weight, 
            product_box_weight, joule, gears, zi_zhi, samples, tiered_pricing_1, 
            tiered_pricing_2, tiered_pricing_3, shi_chang, remarks, model, 
            manufacturer_model, created_by, price
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 提供的插入值（可以处理为可选字段）
    const values = [
        img_list, manufacturer_id, product_size, product_box_size, product_weight,
        product_box_weight, joule, gears, zi_zhi, samples, tiered_pricing_1,
        tiered_pricing_2, tiered_pricing_3, shi_chang, remarks, model,
        manufacturer_model, created_by, price
    ];

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