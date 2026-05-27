import { queryDB } from './db.js';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ code: 405, msg: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    // 检查用户名是否已存在
    const existingUsers = await queryDB('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsers && existingUsers.length > 0) {
      return new Response(JSON.stringify({ code: 400, msg: 'Username already exists' }), { status: 400 });
    }

    // 模拟写入数据库进行注册
    await queryDB('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);

    return new Response(JSON.stringify({
      code: 0,
      msg: 'Registration successful',
      data: null
    }), { headers: { 'Content-Type': 'application/json' } });
    
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { status: 500 });
  }
}