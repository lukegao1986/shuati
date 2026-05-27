<template>
  <view class="container">
    <view class="title">注册新账号</view>
    <view class="form">
      <input class="input" type="text" v-model="username" placeholder="请输入用户名" />
      <input class="input" type="password" v-model="password" placeholder="请输入密码" />
      <input class="input" type="password" v-model="confirmPassword" placeholder="请再次输入密码" />
      <button class="btn" @click="handleRegister">注册</button>
      <view class="login-link" @click="goToLogin">
        <text>已有账号？点击登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import env from '../../env.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    handleRegister() {
      if (!this.username || !this.password) {
        uni.showToast({ title: '请输入完整的注册信息', icon: 'none' });
        return;
      }
      if (this.password !== this.confirmPassword) {
        uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
        return;
      }
      
      uni.showLoading({ title: '注册中' });
      uni.request({
        url: `${env.API_BASE_URL}/register`,
        method: 'POST',
        data: {
          username: this.username,
          password: this.password
        },
        success: (res) => {
          if (res.data && res.data.code === 0) {
            uni.showToast({ title: '注册成功' });
            uni.setStorageSync('token', 'mock-token-12345');
            uni.setStorageSync('userId', 1);
            setTimeout(() => {
              uni.redirectTo({ url: '/pages/index/index' });
            }, 1000);
          } else {
            uni.showToast({ title: res.data.msg || '注册失败', icon: 'none' });
          }
        },
        fail: () => {
          uni.showToast({ title: '网络错误', icon: 'none' });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
    goToLogin() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.container {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f7fa;
  min-height: 100vh;
}
.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
  margin-top: 60px;
}
.form {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.input {
  width: 100%;
  height: 50px;
  background: #fff;
  border-radius: 8px;
  padding: 0 15px;
  margin-bottom: 20px;
  box-sizing: border-box;
  font-size: 16px;
  border: 1px solid #e0e0e0;
}
.btn {
  width: 100%;
  height: 50px;
  background: #007aff;
  color: #fff;
  border-radius: 8px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  border: none;
}
.btn:active {
  background: #0062cc;
}
.login-link {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #007aff;
}
.login-link:active {
  opacity: 0.7;
}
</style>