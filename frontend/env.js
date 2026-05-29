// 环境配置
const ENV = 'production'; // 'development' | 'production'

const config = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api'
  },
  production: {
    // 等你在网页端部署完边缘函数后，把它分配给你的域名填在这里
    // 例如：'https://eju-api-xxxx.edgeone.cool/api'
    API_BASE_URL: 'https://填写你的边缘函数分配域名/api'
  }
};

export default config[ENV];