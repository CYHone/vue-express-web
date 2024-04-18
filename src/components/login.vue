<template>
  <div>
    <header class="login-header">
      <div class="container">
        <h1 class="logo">
          <RouterLink to="/">卓越快递</RouterLink>
        </h1>
        <!-- <RouterLink class="entry" to="/">
          进入网站首页
        </RouterLink> -->
      </div>
    </header>

    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a href="javascript:;">用户登录</a>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form ref="formRef" :model="userInfo" :rules="rules" status-icon>
              <el-form-item prop="email" label="账号">
                <el-input v-model="userInfo.email" placeholder="请输入账号" />
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input v-model="userInfo.password" placeholder="请输入密码" show-password />
              </el-form-item>
              <el-form-item prop="agree" label-width="22px">
                <el-checkbox v-model="userInfo.agree" size="large">
                  我已同意隐私条款和服务条款
                </el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-button type="success" @click="doLogin" style="width: 150px; height: 40px; font-size: 18px;">登录</el-button>
                <el-button type="primary" @click="doRegister" style="width: 150px; height: 40px; font-size: 18px;">注册</el-button>
              </el-form-item>

            </el-form>
          </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">售后服务</a>
          <a href="javascript:;">配送与验收</a>
          <a href="javascript:;">商务合作</a>
          <a href="javascript:;">搜索推荐</a>
          <a href="javascript:;">友情链接</a>
        </p>
        <p>CopyRight &copy; 卓越快递</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
  // 引入Vue相关库和组件
  import { ref, defineExpose } from 'vue';
  // import { loginAPI,useAuthStore } from '@/apis/user'; // 使用pinia 就不导入登录请求的API方法
  import { ElMessage } from 'element-plus'; // 导入Element Plus的消息组件
  import 'element-plus/theme-chalk/el-message.css'; // 导入Element Plus的消息组件样式
  import { useRouter } from 'vue-router'; // 导入Vue Router的路由实例
  import axios from '@/utils/axios-config' // 导入全局配置的 axios 实例

  // 使用ref创建响应式数据对象，用于存储用户输入的账户信息、密码信息和同意协议的状态
  const userInfo = ref({
    email: '',
    password: '', // 初始值为空字符串
    agree: true,
  });

  // 定义表单验证规则，使用对象字面量方式，包含账户、密码和同意协议的规则
  const rules = {
    email: [{ required: true, message: '用户名不能为空' }], 
    password: [
      { required: true, message: '密码不能为空' }, 
      { min: 6, max: 14, message: '密码长度要求6-14个字符' } 
    ],
    agree: [
      {
        // 同意协议规则，使用自定义校验器
        validator: (rule, val, callback) => {
          return val ? callback() : callback(new Error('请先同意协议')); // 如果同意协议，回调成功函数，否则回调失败函数
        }
      }
    ]
  };

  // 使用ref创建一个响应式对象，用于存储表单实例的引用
  const formRef = ref(null); // 表单实例引用，默认为null
  const router = useRouter(); // 获取Vue Router的路由实例
  // const authStore = useAuthStore(); //存储的tokrn

  const doRegister = () =>{
    router.push({ path: '/register' }); // 使用router.push跳转页面
  }

  const doLogin = () => {
    formRef.value.validate(async (valid) => {
      if (valid) {
        const { email, password } = userInfo.value;
        const requestData = {
          email: email, // 使用正确的变量名
          password: password,
        };

        axios.post('customer/login', requestData)
          .then(response => {
            console.log(response.data);
            if (response.data.code === 200) {
              console.log('登录成功', response.data);

              // 存储 JWT 到前端
              const token = response.data.data.token;
              const userId = response.data.data.userId;
              localStorage.setItem('token', token);
              localStorage.setItem('userId', userId);
              // 在前端发出的所有请求的请求头中添加 JWT
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

              router.push('/');
            } else {
              console.error('登录失败', response.data.message);
            }
          })
          .catch(error => {
            console.error('登录失败', error);
            // 在请求失败时给用户一个提示或者进行其他适当的处理
            ElMessage.error('登录失败，请稍后重试');
          });
      }
    });
  }

  defineExpose({ userInfo, rules, formRef, doLogin, doRegister }); // 取消注释以暴露数据和方法
</script>

  

<style scoped lang='scss'>
.login-header {
  // background: url('src/assets/images/up.jpg');
  background-color: skyblue;
  background-size: cover;
  background-repeat: no-repeat;
  border-bottom: 1px solid #e4e4e4;

  .container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .logo {
    width: 200px;

    a {
      display: block;
      height: 140px;
      width: 100%;
      text-indent: -9999px;
      background: url('src/assets/logo.png') no-repeat center 18px / contain;
    }
  }

  .entry {
    width: 250px;
    margin-bottom: 5px;
    font-size: 30px;
    color:bisque;

  }
}

.login-section {
 // background: url('src/assets/images/down.jpg') no-repeat center / cover;
  height: 500px;
  position: relative;

  .wrapper {
    width: 400px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    nav {
      font-size: 14px;
      height: 55px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
      }
    }
  }
}

.login-footer {
  padding: 30px 0 50px;
  background: #fff;

  p {
    text-align: center;
    color: #999;
    padding-top: 20px;

    a {
      line-height: 1;
      padding: 0 10px;
      color: #999;
      display: inline-block;

      ~a {
        border-left: 1px solid #ccc;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: skyblue;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: skyblue;
          }

          &.active,
          &:focus {
            border-color: skyblue;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: skyblue;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: skyblue;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}


</style>



 <!-- // 调用登录API发送登录请求，传入账户和密码信息，使用await等待返回结果
      //    const res = await loginAPI({ account, password});
      //    console.log(res); // 打印登录请求返回的结果
      //    // 存储 token
      //    authStore.setToken(res.data.token);
      //    // 存储 account
      //    authStore.setAccount(userInfo.value.account);

      //    console.log(authStore.token)
      //    console.log(authStore.account)

      //  // 存储 token（这里简单地存储在 localStorage 中，实际应用中可根据需求进行调整）
      //  //localStorage.setItem('token', res.data.token);
      //    //console.log(res.data.token);
         -->