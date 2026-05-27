import { queryDB } from './db.js';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ code: 405, msg: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    // 模拟数据库验证
    const users = await queryDB('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    return new Response(JSON.stringify({
      code: 0,
      msg: 'Login successful',
      data: { token: 'mock-token-12345', userId: 1 }
    }), { headers: { 'Content-Type': 'application/json' } });
    
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { status: 500 });
  }
}