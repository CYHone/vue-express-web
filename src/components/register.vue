<script setup>
import { ref } from 'vue';
//import axios from 'axios';
import { useRouter } from 'vue-router';
//import { register } from '@/apis/user';
import axios from '@/utils/axios-config' // 导入全局配置的 axios 实例

const router = useRouter();

const ruleForm = ref({
  Email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
});

// 清空表单数据
const clearForm = () => {
  ruleForm.value.Email = '';
  ruleForm.value.password = '';
  ruleForm.value.confirmPassword = '';
  ruleForm.value.verificationCode = '';
};

// 验证密码
const checkPasswordConfirmation = (rule, value, callback) => {
  if (value === ruleForm.value.password) {
    callback(); // 密码匹配，验证通过
  } else {
    callback(new Error('两次输入的密码不一致')); // 密码不匹配，验证失败
  }
};

const rules = {
  Email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: checkPasswordConfirmation, trigger: 'blur' }
  ],
};


// 取消
const doReturn = () => {
  router.push('/');
};

// 发送验证码
const sendVerificationCode = () => {
  const email = ruleForm.value.Email;

  // axios.post('http://139.196.211.123:8081/customer/sendEmailVerifyCode',  { email })
  axios.post('customer/sendEmailVerifyCode',  { email })
  .then(response => {
    console.log(email);
    console.log(response.data);
    console.log(response.data.message);
    // if (response.data.message === 0) {
    //   console.log('验证码发送成功', response.data);
    // } else {
    //   console.error('验证码发送失败1', response.data.message);
    // }
  })
  .catch(error => {
    console.error('验证码发送失败', error);
  });


};

// 注册功能
const doRegister = () => {
  const { Email, password, verificationCode } = ruleForm.value;
  const requestData = {
    email: Email,
    password: password,
    code: verificationCode
  };
// 注册是json吗
 //axios.post('http://139.196.211.123:8081/customer/register', requestData)
   //register(requestData)
   axios.post('customer/register', requestData)
    .then(response => {
      console.log(response.data)


      if (response.data.code === 200) {
        console.log('注册成功', response.data);
        // 存储 JWT 到前端
        const jwt = response.data.jwt;
        localStorage.setItem('jwt', jwt);
        // 在前端发出的所有请求的请求头中添加 JWT
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
        // 跳转
       // router.push('/login');
       router.replace({ path: '/' });

      } else {
        console.error('注册失败', response.data.message);
      }
    })
    .catch(error => {
      console.error('注册失败', error);
    });
};
</script>   

<template>
  <div>
    <el-container>
      <el-header style="background-color: skyblue; height: 100px;">
        <div style="text-align: center; font-size: 40px; font-weight: bolder">卓越快递</div>
      </el-header>

      <el-main>
        <el-card class="register-module">
          <template v-slot:header>
            <div class="clearfix">
              <span style="text-align: center; font-size: 30px; font-family: 'Microsoft YaHei'">
                <p>注册</p>
              </span>
            </div>
          </template>

          <div>
            <el-form :model="ruleForm" :rules="rules" label-width="100px">
              <el-form-item label="邮箱" prop="Email">
                <el-input v-model="ruleForm.Email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="ruleForm.confirmPassword" placeholder="请确认密码" show-password></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="verificationCode">
                <el-input v-model="ruleForm.verificationCode" :style="{ width: '120px' }" placeholder="请输入验证码"></el-input>
                <el-button type="primary" @click="sendVerificationCode">发送验证码</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" style="width: 100px; height: 40px; font-size: 18px;" @click="doRegister">注册</el-button>
                <el-button type="danger" style="width: 100px; height: 40px; font-size: 18px;" @click="doReturn">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.register-module {
  max-width: 600px;
  height: 500px;
  margin: 50px auto;
}
</style>