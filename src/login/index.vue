<script setup>
  // 引入Vue相关库和组件
  import { ref, defineExpose } from 'vue';
  import { loginAPI,useAuthStore } from '@/apis/user'; // 使用pinia 就不导入登录请求的API方法
  import { ElMessage } from 'element-plus'; // 导入Element Plus的消息组件
  import 'element-plus/theme-chalk/el-message.css'; // 导入Element Plus的消息组件样式
  import { useRouter } from 'vue-router'; // 导入Vue Router的路由实例

  // 使用ref创建响应式数据对象，用于存储用户输入的账户信息、密码信息和同意协议的状态
  const userInfo = ref({
    account: '1311111111',
    password: '123456',    
    agree: true,
  });

  // 定义表单验证规则，使用对象字面量方式，包含账户、密码和同意协议的规则
  const rules = {
    account: [{ required: true, message: '用户名不能为空' }], 
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
  const authStore = useAuthStore(); //存储的tokrn

  // 定义登录函数，用于处理登录逻辑
  const doLogin = () => {
    // 调用表单实例的validate方法进行表单验证，传入一个回调函数
    formRef.value.validate(async (valid) => {
      // 在回调函数中处理表单验证结果
      if (valid) { // 如果表单验证通过
        
        // 获取用户输入的账户信息和密码信息
        const { account, password } = userInfo.value;

          // 调用登录API发送登录请求，传入账户和密码信息，使用await等待返回结果
         const res = await loginAPI({ account, password});
         console.log(res); // 打印登录请求返回的结果
         // 存储 token
         authStore.setToken(res.data.token);
         // 存储 account
         authStore.setAccount(userInfo.value.account);

         console.log(authStore.token)
         console.log(authStore.account)

       // 存储 token（这里简单地存储在 localStorage 中，实际应用中可根据需求进行调整）
       //localStorage.setItem('token', res.data.token);
         //console.log(res.data.token);
        
        ElMessage({ type: 'success', message: '登录成功' });
        router.replace({ path: '/' });
      }
    });
  };

  // // 使用defineExpose方法暴露响应式数据和方法，以便在模板中使用
  // defineExpose({ userInfo, rules, formRef, doLogin });
</script>



<template>
    <div>
      <header class="login-header">
        <div class="container m-top-20">
          <h1 class="logo">
            <RouterLink to="/">卓越快递</RouterLink>
          </h1>
          <RouterLink class="entry" to="/">
            进入网站首页
            <i class="iconfont icon-angle-right"></i>
            <i class="iconfont icon-angle-right"></i>
          </RouterLink>
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
                <el-form-item prop="account" label="账户">
                  <el-input v-model="userInfo.account" />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                  <el-input v-model="userInfo.password" />
                </el-form-item>
                <el-form-item prop="agree" label-width="22px">
                  <el-checkbox v-model="userInfo.agree" size="large">
                    我已同意隐私条款和服务条款
                  </el-checkbox>
                </el-form-item>
                <el-button size="large" class="subBtn" @click="doLogin" >点击登录</el-button>
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
  
  

<style scoped lang='scss'>
.login-header {
  background: url('src/assets/images/up.jpg');
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

  .sub {
    flex: 1;
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 38px;
    margin-left: 20px;
    color: #666;
  }

  .entry {
    width: 250px;
    margin-bottom: 5px;
    font-size: 30px;
    color:bisque;

    i {
      font-size: 14px;
      color: skyblue;
      letter-spacing: -5px;
    }
  }
}

.login-section {
  background: url('src/assets/images/down.jpg') no-repeat center / cover;
  height: 600px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
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

.subBtn {
  background: skyblue;
  width: 100%;
  color: #fff;
}
</style>