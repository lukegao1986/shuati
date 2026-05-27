// 环境配置
const ENV = 'development'; // 'development' | 'production'

const config = {
  development: {
    // 本地调试时的后端接口地址
    API_BASE_URL: 'http://localhost:3000/api'
  },
  production: {
    // EdgeOne 线上边缘函数接口地址
    API_BASE_URL: 'https://test-eju-ppow4mv7.edgeone.cool/api'
  }
};

export default config[ENV];