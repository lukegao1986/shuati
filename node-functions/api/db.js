// 简单的内存数据库（在 serverless 容器的短暂生命周期中临时有效）
// 在最后一步中，我们将把它替换为真实的 MySQL 连接逻辑
const mockDB = {
  users: [],
  history: [],
  questions: [
    { id: 1, subject: '日本语', title: '阅读以下短文...', difficulty: 'medium' },
    { id: 2, subject: '数学', title: '求解二次函数...', difficulty: 'hard' }
  ]
};

export async function queryDB(sql, params = []) {
  console.log('Executing SQL:', sql, 'Params:', params);

  // 1. 模拟: SELECT * FROM users WHERE username = ? AND password = ?
  if (sql.includes('SELECT * FROM users WHERE username') && sql.includes('password')) {
    const user = mockDB.users.find(u => u.username === params[0] && u.password === params[1]);
    return user ? [user] : [];
  }
  
  // 2. 模拟: SELECT id FROM users WHERE username = ?
  if (sql.includes('SELECT id FROM users WHERE username')) {
    const user = mockDB.users.find(u => u.username === params[0]);
    return user ? [{ id: user.id }] : [];
  }

  // 3. 模拟: INSERT INTO users (username, password) VALUES (?, ?)
  if (sql.includes('INSERT INTO users')) {
    const newUser = {
      id: mockDB.users.length + 1,
      username: params[0],
      password: params[1]
    };
    mockDB.users.push(newUser);
    return { insertId: newUser.id };
  }

  // 4. 模拟: INSERT INTO history (user_id, question_id, answer) VALUES (?, ?, ?)
  if (sql.includes('INSERT INTO history')) {
    mockDB.history.push({
      id: mockDB.history.length + 1,
      user_id: params[0],
      question_id: params[1],
      answer: params[2],
      created_at: new Date().toISOString()
    });
    return { insertId: mockDB.history.length };
  }

  // 5. 模拟: 题库查询 (在 question.js 中虽然没用到 sql，但为了完整性)
  if (sql.includes('SELECT * FROM questions')) {
      return mockDB.questions;
  }

  return [];
}