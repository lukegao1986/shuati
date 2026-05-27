import { queryDB } from './db.js';

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    } });
  }

  if (request.method !== 'POST') {
     return new Response(JSON.stringify({ code: 405, msg: `Method ${request.method} Not Allowed` }), { 
       status: 405,
       headers: { 'Access-Control-Allow-Origin': '*' }
     });
  }

  try {
    const body = await request.json();
    const { questionId, answer, userId } = body;

    // 模拟写入错题本/历史记录
    await queryDB('INSERT INTO history (user_id, question_id, answer) VALUES (?, ?, ?)', [userId, questionId, answer]);

    return new Response(JSON.stringify({
      code: 0,
      msg: 'Answer submitted successfully',
      data: { correct: true }
    }), { headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    } });
    
  } catch (error) {
    return new Response(JSON.stringify({ code: 500, msg: error.message }), { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}