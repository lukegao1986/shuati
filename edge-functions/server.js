import http from 'http';
import url from 'url';

// 注入全局的 Response 对象，以便兼容 EdgeOne 边缘函数中的原生 Response 用法
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.headers = init.headers || {};
    }
    async text() {
      return this.body;
    }
    async json() {
      return JSON.parse(this.body);
    }
  };
}

// 导入你的 API 逻辑
import loginHandler from './api/login.js';
import registerHandler from './api/register.js';
import questionHandler from './api/question.js';
import submitHandler from './api/submit.js';

const PORT = 3000;

// 简单封装 request.json() 模拟 EdgeOne 环境的 Request 对象
const createMockRequest = (req) => {
  return {
    method: req.method,
    json: () => new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (e) {
          reject(e);
        }
      });
    })
  };
};

const server = http.createServer(async (req, res) => {
  // 设置跨域 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  let handler;
  // 路由匹配
  if (path === '/api/login') handler = loginHandler;
  else if (path === '/api/register') handler = registerHandler;
  else if (path === '/api/question') handler = questionHandler;
  else if (path === '/api/submit') handler = submitHandler;

  if (handler) {
    try {
      const mockRequest = createMockRequest(req);
      const edgeResponse = await handler(mockRequest);
      
      // 兼容 EdgeOne Response 对象的读取
      const responseData = typeof edgeResponse.text === 'function' ? await edgeResponse.text() : edgeResponse.body;
      const status = edgeResponse.status || 200;
      
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(responseData);
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      res.end(JSON.stringify({ code: 500, msg: 'Internal Server Error' }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ code: 404, msg: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`本地测试服务已启动: http://localhost:${PORT}`);
  console.log('数据将保存在当前目录的 db.json 文件中');
});