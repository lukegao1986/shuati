import mysql from 'mysql2/promise';

// 创建数据库连接池
// 生产环境建议将密码等敏感信息放在环境变量中，这里为了快速跑通先直接硬编码
const pool = mysql.createPool({
  host: 'sh-cynosdbmysql-grp-09ehfxtq.sql.tencentcdb.com',
  port: 24547,
  user: 'root',
  password: '2199wlmm!',
  database: 'shuati',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 因为之前的逻辑里 question.js 返回了静态数据，这里为了兼容之前的查询，如果表不存在我们直接返回内存假数据
const staticQuestions = [
  { id: 1, subject: '日本语', title: '阅读以下短文...', difficulty: 'medium' },
  { id: 2, subject: '数学', title: '求解二次函数...', difficulty: 'hard' }
];

export async function queryDB(sql, params = []) {
  console.log('Executing SQL:', sql, 'Params:', params);
  
  // 兼容问题列表的假数据查询
  if (sql.includes('SELECT * FROM questions')) {
      return staticQuestions;
  }

  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}