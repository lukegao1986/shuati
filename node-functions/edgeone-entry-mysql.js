import mysql from 'mysql2/promise';

// 1. 创建数据库连接池
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

// 2. 模拟静态题库数据
const staticQuestions = [
  { id: 1, subject: '日本语', title: '阅读以下短文...', difficulty: 'medium' },
  { id: 2, subject: '数学', title: '求解二次函数...', difficulty: 'hard' }
];

// 3. 通用数据库查询封装
async function queryDB(sql, params = []) {
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

// 4. API 路由处理逻辑
async function handleLogin(request) {
  const { username, password } = await request.json();
  const users = await queryDB('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  
  if (users && users.length > 0) {
    return new Response(JSON.stringify({
      code: 0, msg: 'Login successful', data: { token: 'mock-token-12345', userId: users[0].id }
    }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } else {
    return new Response(JSON.stringify({ code: 400, msg: 'Invalid username or password' }), {
      status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}

async function handleRegister(request) {
  const { username, password } = await request.json();
  const existingUsers = await queryDB('SELECT id FROM users WHERE username = ?', [username]);
  
  if (existingUsers && existingUsers.length > 0) {
    return new Response(JSON.stringify({ code: 400, msg: 'Username already exists' }), { 
      status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  await queryDB('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
  return new Response(JSON.stringify({
    code: 0, msg: 'Registration successful', data: null
  }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}

async function handleQuestion(request) {
  return new Response(JSON.stringify({
    code: 0, msg: 'success', data: staticQuestions
  }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}

async function handleSubmit(request) {
  const { questionId, answer, userId } = await request.json();
  await queryDB('INSERT INTO history (user_id, question_id, answer) VALUES (?, ?, ?)', [userId, questionId, answer]);
  return new Response(JSON.stringify({
    code: 0, msg: 'Answer submitted successfully', data: { correct: true }
  }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}

// 5. 核心入口与分发
async function handleRequest(request) {
  // CORS 预检请求处理
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    } });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path.endsWith('/api/login') && request.method === 'POST') {
      return await handleLogin(request);
    } else if (path.endsWith('/api/register') && request.method === 'POST') {
      return await handleRegister(request);
    } else if (path.endsWith('/api/question') && request.method === 'GET') {
      return await handleQuestion(request);
    } else if (path.endsWith('/api/submit') && request.method === 'POST') {
      return await handleSubmit(request);
    } else {
      return new Response(JSON.stringify({ code: 404, msg: 'API Route Not Found' }), { 
        status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { 
      status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}

// 6. 绑定事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});