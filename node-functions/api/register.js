import { queryDB } from './db.js';

export default async function handler(request) {
  // EdgeOne 环境下，使用 GET 方式读取 body 时会报错，我们放宽对 method 的校验，以适应部分浏览器的跨域 preflight 行为
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    } });
  }

  // 增加拦截：防止浏览器预检通过后，发出的实际 POST 请求因为其他异常或平台原因依然被阻断。
  // 同时，如果你直接浏览器输入 URL 访问（GET），给予友好的提示而不是走下面的 json 解析报错。
  if (request.method !== 'POST') {
     return new Response(JSON.stringify({ code: 405, msg: `Method ${request.method} Not Allowed` }), { 
         status: 405,
         headers: { 
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
         }
     });
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
    }), { headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    } });
    
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}