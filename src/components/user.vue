<template>
    <LayoutNav />
    <LayoutHeader />
    <div >
      <el-container style="padding-left: 500px;" >
        <el-main>
          <el-card style="width: 500px;">
            <div>
              <el-form :model="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
  
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
  
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
  
              
  
                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="ruleForm.password"
                    placeholder="请输入密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="ruleForm.confirmPassword"
                    placeholder="请确认密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="submitForm">修改</el-button>
                  <el-button type="primary" @click="resetForm">重置</el-button>
                  <el-button @click="goBack">返回</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </div>
    <LayoutFooter />
  </template>
  
  <script setup>
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout/components/LayoutHeader.vue'
import LayoutFooter from '../Layout/components/LayoutFooter.vue'
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '@/utils/axios-config';

const email = localStorage.getItem('email');

const getCustomerByEmail = () => {
  axios.get(`/customer/getCustomerByEmail?email=${email}`)
    .then(response => {
      console.log(response.data);
      if (response.data.code === 200) {
        const userData = response.data.data;
        console.log(userData);
        
        ruleForm.value.name = userData.username;
        ruleForm.value.phone = userData.phone;
        ruleForm.value.email = userData.email;

        
       
         // 设置本地存储
         localStorage.setItem('username', userData.username);
         
    
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch(error => {
      console.error('获取用户信息失败：', error);
      ElMessage.error('获取用户信息失败，请重试');
    });
}

const submitForm = () => {
    // 构造只包含部分字段的用户信息对象
    const userData = {
      id: localStorage.getItem('userId'),
      username: ruleForm.value.name, // 使用表单中的姓名字段
      phone: ruleForm.value.phone, // 使用表单中的手机号字段
      email: ruleForm.value.email // 使用表单中的邮箱字段
    };
    axios
    .post('/customer/updateCustomer', userData, {
    })
    .then((response) => {
      console.log(response.data)

      if (response.data.code === 200) {
        ElMessage.success(response.data.message);
    
      } 
    })
    .catch((error) => {
      console.error(error)
    })
};


const ruleForm = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: '' // 添加 address 属性
})

onMounted(() => {
  getCustomerByEmail();
  // 手动触发一次响应性更新
  ruleForm.value = { ...ruleForm.value };
});
</script>


