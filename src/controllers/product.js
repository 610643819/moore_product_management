const execSQL = require("../db/mysql");

// 获取list
const getProductList = ({ body: { page = 1, pageSize = 10, model = '', zi_zhi = '', shi_chang = '', chang_ping = '' } }) => {
    // 初始化查询条件数组
    let conditions = [];
    let values = [];

    // 对 model 进行模糊查询
    if (model) {
        conditions.push("model LIKE ?");
        values.push(`%${model}%`);
    }

    if (zi_zhi) {
        conditions.push("zi_zhi_value LIKE ?");
        values.push(`%${zi_zhi}%`);  // 查找包含指定 value 的记录
    }

    if (shi_chang) {
        conditions.push("shi_chang_value LIKE ?");
        values.push(`%${shi_chang}%`);  // 查找包含指定 value 的记录
    }

    if (chang_ping) {
        conditions.push("chang_ping_value LIKE ?");
        values.push(`%${chang_ping}%`);  // 查找包含指定 value 的记录
    }

    // 初始化 SQL 查询
    let sql = "SELECT * FROM product_list WHERE is_deleted = 0";  // 假设有 is_deleted 字段表示是否删除
    if (conditions.length > 0) {
        sql += " AND " + conditions.join(" AND ");
    }

    // 添加排序
    sql += " ORDER BY id DESC";  // 按 id 字段倒序排序

    // 分页功能：计算分页偏移量
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;  // 添加分页

    console.log('最终生成的SQL:', sql);
    console.log('查询参数:', values);

    // 获取数据
    const dataPromise = execSQL(sql, values);

    // 获取总数的查询语句
    let totalSql = "SELECT COUNT(*) AS total FROM product_list WHERE is_deleted = 0";
    if (conditions.length > 0) {
        totalSql += " AND " + conditions.join(" AND ");
    }

    // 执行查询并返回结果
    return Promise.all([dataPromise, execSQL(totalSql, values)]).then(([result, totalResult]) => {
        // 获取 total 数量
        const total = totalResult[0]?.total || 0;

        // 转换查询结果中的 JSON 字符串字段为对象
        const processedResult = result.map(item => {
            return {
                ...item,
                chang_ping: item.chang_ping ? JSON.parse(item.chang_ping) : [],
                img_list: item.img_list ? JSON.parse(item.img_list) : [],
                shi_chang: item.shi_chang ? JSON.parse(item.shi_chang) : [],
                zi_zhi: item.zi_zhi ? JSON.parse(item.zi_zhi) : [],
            };
        });

        return {
            list: processedResult,  // 转换后的分页数据
            total,   // 总记录数
        };
    }).catch(error => {
        console.error('查询错误:', error);
        throw error;
    });
};




// 添加产品
const pushProductItem = (req) => {
    console.log('req.body===>', req.body)
    const {
        img_list, manufacturer_id, product_size, product_box_size, product_weight,
        product_box_weight, gears_joule_list, samples, tiered_pricing_1, tiered_pricing_2,
        tiered_pricing_3, model, manufacturer_model,
        shi_chang,
        chang_ping,
        zi_zhi,
        remarks, created_by, price
    } = req.body;

    // 确保 img_list 和其他数组对象字段是 JSON 字符串格式
    const formattedImgList = JSON.stringify(img_list);
    const formattedZiZhi = JSON.stringify(zi_zhi);  // 将资质数组转为 JSON 字符串
    const formattedShiChang = JSON.stringify(shi_chang); // 将市场数组转为 JSON 字符串
    const formattedChangPing = JSON.stringify(chang_ping); // 将产品相关数组转为 JSON 字符串
    const formattedGearsJoule = gears_joule_list
    const shi_chang_value = shi_chang.map(item => item.label).join(',')
    const chang_ping_value = chang_ping.map(item => item.label).join(',')
    const zi_zhi_value = zi_zhi.map(item => item.label).join(',')
    // 如果 manufacturer_id 为空字符串，将其替换为 null
    const manufacturerId = manufacturer_id || null;
    const createdBy = created_by || null;

    const sql = `
        INSERT INTO product_list (
            img_list, manufacturer_id, product_size, product_box_size, product_weight, 
            product_box_weight, gears_joule_list, zi_zhi, samples, tiered_pricing_1, 
            tiered_pricing_2, tiered_pricing_3, shi_chang, chang_ping, remarks, model, 
            manufacturer_model, created_by, price,shi_chang_value, chang_ping_value,zi_zhi_value
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 插入的值（确保正确的顺序）
    const values = [
        formattedImgList, manufacturerId, product_size, product_box_size, product_weight,
        product_box_weight, formattedGearsJoule, formattedZiZhi, samples, tiered_pricing_1,
        tiered_pricing_2, tiered_pricing_3, formattedShiChang, formattedChangPing, remarks, model,
        manufacturer_model, createdBy, price, shi_chang_value, chang_ping_value,zi_zhi_value
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

// 查看
const viewProductItem = (req) => {
    // console.log(req.body.id)
    const sql = `SELECT * FROM product_list WHERE id = ${req.body.id}`;
    return execSQL(sql).then(result => {
        const processedResult = result.map(item => {
            return {
                ...item,
                chang_ping: item.chang_ping ? JSON.parse(item.chang_ping) : [],
                img_list: item.img_list ? JSON.parse(item.img_list) : [],
                shi_chang: item.shi_chang ? JSON.parse(item.shi_chang) : [],
                zi_zhi: item.zi_zhi ? JSON.parse(item.zi_zhi) : [],
            };
        });
        return processedResult[0]
    }).catch(err => {
        console.error('SQL 执行失败:', err);
        // 处理错误
        throw new Error('数据库插入失败');
    });
}

// 编辑
const editProductItem = (req) => {
    console.log('req.body===>', req.body);
    const {
        id, // Assuming you're passing the ID to identify the product to update
        img_list, manufacturer_id, product_size, product_box_size, product_weight,
        product_box_weight, gears_joule_list, samples, tiered_pricing_1, tiered_pricing_2,
        tiered_pricing_3, model, manufacturer_model,
        shi_chang,
        chang_ping,
        zi_zhi,
        remarks, created_by, price
    } = req.body;

    // Ensure img_list and other array fields are JSON strings
    const formattedImgList = JSON.stringify(img_list);
    const formattedZiZhi = JSON.stringify(zi_zhi);  // Convert the zi_zhi array to JSON string
    const formattedShiChang = JSON.stringify(shi_chang); // Convert the shi_chang array to JSON string
    const formattedChangPing = JSON.stringify(chang_ping); // Convert the chang_ping array to JSON string
    const formattedGearsJoule = gears_joule_list

    // Join labels from arrays into comma-separated strings
    const shi_chang_value = shi_chang.map(item => item.label).join(',');
    const chang_ping_value = chang_ping.map(item => item.label).join(',');
    const zi_zhi_value = zi_zhi.map(item => item.label).join(',');

    // If manufacturer_id is an empty string, replace with null
    const manufacturerId = manufacturer_id || null;
    const createdBy = created_by || null;

    // SQL query to update the product
    const sql = `
        UPDATE product_list SET 
            img_list = ?, manufacturer_id = ?, product_size = ?, product_box_size = ?, 
            product_weight = ?, product_box_weight = ?, gears_joule_list = ?, zi_zhi = ?, 
            samples = ?, tiered_pricing_1 = ?, tiered_pricing_2 = ?, tiered_pricing_3 = ?, 
            shi_chang = ?, chang_ping = ?, remarks = ?, model = ?, manufacturer_model = ?, 
            created_by = ?, price = ?, shi_chang_value = ?, chang_ping_value = ?, zi_zhi_value = ?
        WHERE id = ?
    `;

    // Values for the SQL query (order must match placeholders in the SQL statement)
    const values = [
        formattedImgList, manufacturerId, product_size, product_box_size, product_weight,
        product_box_weight, formattedGearsJoule, formattedZiZhi, samples, tiered_pricing_1,
        tiered_pricing_2, tiered_pricing_3, formattedShiChang, formattedChangPing, remarks, model,
        manufacturer_model, createdBy, price, shi_chang_value, chang_ping_value, zi_zhi_value,
        id // This is the product ID to identify the product to update
    ];

    // Check if the number of placeholders matches the number of values
    console.log('Number of columns in SQL:', sql.match(/\?/g).length);  // Log the number of placeholders
    console.log('Number of values being inserted:', values.length);  // Log the number of values

    // Ensure the number of placeholders and values match
    if (sql.match(/\?/g).length !== values.length) {
        throw new Error("Column count and values count do not match");
    }

    console.log('Executing SQL query:', sql);  // Log the SQL query
    console.log('Values being inserted:', values);  // Log the values

    // Execute the SQL query
    return execSQL(sql, values).then(result => {
        return result;
    }).catch(err => {
        console.error('SQL execution failed:', err);
        // Handle error
        throw new Error('Database update failed');
    });
};



module.exports = {
    pushProductItem,
    getProductList,
    viewProductItem,
    editProductItem,
}
