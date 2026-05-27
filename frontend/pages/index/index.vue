<template>
  <view class="container">
    <view class="header">
      <text class="title">题库</text>
    </view>
    <scroll-view scroll-y class="list">
      <view class="card" v-for="item in questions" :key="item.id">
        <view class="card-header">
          <text class="subject">{{ item.subject }}</text>
          <text class="difficulty" :class="item.difficulty">{{ item.difficulty === 'hard' ? '困难' : (item.difficulty === 'medium' ? '中等' : '简单') }}</text>
        </view>
        <view class="card-body">
          <text class="question-title">{{ item.title }}</text>
          <input class="answer-input" type="text" v-model="item.userAnswer" placeholder="请输入答案" />
        </view>
        <view class="card-footer">
          <button class="submit-btn" @click="submitAnswer(item)">提交答案</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import env from '../../env.js';

export default {
  data() {
    return {
      questions: [],
      userId: null
    };
  },
  onLoad() {
    this.userId = uni.getStorageSync('userId');
    if (!this.userId) {
      uni.redirectTo({ url: '/pages/login/login' });
      return;
    }
    this.fetchQuestions();
  },
  methods: {
    fetchQuestions() {
      uni.showLoading({ title: '加载中' });
      uni.request({
        url: `${env.API_BASE_URL}/question`,
        method: 'GET',
        success: (res) => {
          if (res.data && res.data.code === 0) {
            this.questions = res.data.data.map(q => ({ ...q, userAnswer: '' }));
          } else {
            uni.showToast({ title: res.data.msg || '获取题库失败', icon: 'none' });
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
    submitAnswer(item) {
      if (!item.userAnswer) {
        uni.showToast({ title: '请输入答案', icon: 'none' });
        return;
      }
      uni.showLoading({ title: '提交中' });
      uni.request({
        url: `${env.API_BASE_URL}/submit`,
        method: 'POST',
        data: {
          questionId: item.id,
          answer: item.userAnswer,
          userId: this.userId
        },
        success: (res) => {
          if (res.data && res.data.code === 0) {
            uni.showToast({ title: '提交成功' });
            item.userAnswer = '';
          } else {
            uni.showToast({ title: res.data.msg || '提交失败', icon: 'none' });
          }
        },
        fail: () => {
          uni.showToast({ title: '网络错误', icon: 'none' });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  padding: 20px 20px 10px;
  background: #f5f7fa;
}
.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.list {
  flex: 1;
  padding: 10px 15px;
  box-sizing: border-box;
}
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.subject {
  font-size: 16px;
  font-weight: bold;
  color: #007aff;
}
.difficulty {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
}
.difficulty.medium {
  background: #fff3e0;
  color: #f57c00;
}
.difficulty.hard {
  background: #ffebee;
  color: #d32f2f;
}
.difficulty.easy {
  background: #e8f5e9;
  color: #388e3c;
}
.card-body {
  margin-bottom: 20px;
}
.question-title {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  display: block;
  margin-bottom: 15px;
}
.answer-input {
  width: 100%;
  height: 44px;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 0 12px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid #eee;
}
.submit-btn {
  width: 100%;
  height: 44px;
  background: #007aff;
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  line-height: 44px;
  border: none;
}
.submit-btn:active {
  background: #0062cc;
}
</style>