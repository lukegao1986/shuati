import { queryDB } from './db.js';

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ code: 405, msg: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    // 模拟从 MySQL 获取题库
    const questions = [
      { id: 1, subject: '日本语', title: '阅读以下短文...', difficulty: 'medium' },
      { id: 2, subject: '数学', title: '求解二次函数...', difficulty: 'hard' }
    ];

    return new Response(JSON.stringify({
      code: 0,
      msg: 'success',
      data: questions
    }), { headers: { 'Content-Type': 'application/json' } });
    
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { status: 500 });
  }
}