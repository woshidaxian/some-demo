const C = require('./config')   // 在该文件内导出DB_HOST、DB_PORT、DB_DATABASE、DB_USER、DB_PASSWORD

// 引入mysql模块
const mysql = require('mysql');

// 创建数据库连接配置
const connection = mysql.createConnection({
  host: C.DB_HOST,           // 数据库主机名
  port: C.DB_PORT,           // 数据库端口号
  user: C.DB_USER,           // 数据库用户名
  password: C.DB_PASSWORD,   // 数据库密码
  database: C.DB_DATABASE    // 数据库名称
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }

  console.log('数据库已建立连接！');
});

// 操作此方法前确认数据库中已有相应表
function Q(sql, callback) {
  connection.query(sql, (error, results, fields) => {
    if (error) throw error;

    callback(results)
  });
}

module.exports = Q


// 在这里执行你的数据库操作
// 例如，查询数据库中的数据
// connection.query('SELECT * FROM your_table_name', (error, results, fields) => {
//   if (error) throw error;

//   console.log('Query results:', results);
// });

// 结束数据库连接
// connection.end((err) => {
//   if (err) {
//     console.error('Error ending the database connection: ' + err.stack);
//     return;
//   }

//   console.log('Database connection ended.');
// });
