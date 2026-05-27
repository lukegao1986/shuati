// 本地调试时，我们使用 JSON 文件模拟数据库
import fs from 'fs';
import path from 'path';

// 确保在本地运行时获取正确的 db.json 路径
const DB_FILE = path.join(process.cwd(), 'db.json');

// 初始化数据库文件
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], history: [] }, null, 2));
}

// 模拟的查询器（本地 JSON 版）
export async function queryDB(sql, params = []) {
  console.log('Executing SQL:', sql, 'Params:', params);
  
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

  // 1. 模拟: SELECT * FROM users WHERE username = ? AND password = ?
  if (sql.includes('SELECT * FROM users WHERE username') && sql.includes('password')) {
    const user = data.users.find(u => u.username === params[0] && u.password === params[1]);
    return user ? [user] : [];
  }
  
  // 2. 模拟: SELECT id FROM users WHERE username = ?
  if (sql.includes('SELECT id FROM users WHERE username')) {
    const user = data.users.find(u => u.username === params[0]);
    return user ? [{ id: user.id }] : [];
  }

  // 3. 模拟: INSERT INTO users (username, password) VALUES (?, ?)
  if (sql.includes('INSERT INTO users')) {
    const newUser = {
      id: data.users.length + 1,
      username: params[0],
      password: params[1]
    };
    data.users.push(newUser);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return { insertId: newUser.id };
  }

  // 4. 模拟: INSERT INTO history (user_id, question_id, answer) VALUES (?, ?, ?)
  if (sql.includes('INSERT INTO history')) {
    data.history.push({
      id: data.history.length + 1,
      user_id: params[0],
      question_id: params[1],
      answer: params[2],
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return { insertId: data.history.length };
  }

  return [];
}