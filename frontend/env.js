// 环境配置
const ENV = 'production'; // 'development' | 'production'

const config = {
  development: {
    // 本地调试时的后端接口地址
    API_BASE_URL: 'http://localhost:3000/api'
  },
  production: {
    // 一体化部署后，前端和后端 API 是同源的（都在同一个域名下）
    // 所以这里直接使用相对路径，让浏览器自动补全当前域名
    API_BASE_URL: '/api'
  }
};

export default config[ENV];