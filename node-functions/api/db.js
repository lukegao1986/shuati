// 简单的内存数据库（在 serverless 容器的短暂生命周期中临时有效）
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

  if (sql.includes('SELECT * FROM users WHERE username') && sql.includes('password')) {
    const user = mockDB.users.find(u => u.username === params[0] && u.password === params[1]);
    return user ? [user] : [];
  }
  
  if (sql.includes('SELECT id FROM users WHERE username')) {
    const user = mockDB.users.find(u => u.username === params[0]);
    return user ? [{ id: user.id }] : [];
  }

  if (sql.includes('INSERT INTO users')) {
    const newUser = { id: mockDB.users.length + 1, username: params[0], password: params[1] };
    mockDB.users.push(newUser);
    return { insertId: newUser.id };
  }

  if (sql.includes('INSERT INTO history')) {
    mockDB.history.push({ id: mockDB.history.length + 1, user_id: params[0], question_id: params[1], answer: params[2] });
    return { insertId: mockDB.history.length };
  }

  if (sql.includes('SELECT * FROM questions')) {
      return mockDB.questions;
  }

  return [];
}