<script setup>
// import { useAuthStore } from '@/apis/user'; 
import { useRouter } from 'vue-router';
// import { doLogin } from '@/components/login.vue'


const router = useRouter(); // 将 useRouter 移至 setup 外部，确保在 setup 内正确使用
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId');
const email = localStorage.getItem('email');
 // 获取本地存储
 const name = localStorage.getItem('username');
console.log('用户名' + name);
console.log(email);
console.log(token);
console.log(userId);
const confirm = () => {
  console.log('用户要退出登录了');
  // 退出登录业务实现
  // 1. 清除用户信息 触发 action
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  // 2. 跳转到登录页
  router.push('/login'); // 确保 router 对象正确解析
}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      
      <!-- 将列表样式设置为无，这样就不会显示小圆点了 -->
      <ul  style="list-style-type: none;">
<!-- 多模板渲染 区分登录状态和非登录状态-->
        <!-- <template v-if="authStore.token"> -->
        <template v-if="token">  

          <!-- 设置字体颜色 -->
          <li  style="color: skyblue; font-size: 15px; margin-right: 10px;">
            用户
          </li>
          <li><a >{{ name }}</a></li>

            <!-- 用户名 -->
          <li><a >{{ email }}</a></li>

          <li>
            <!-- Vue 组件，用于显示确认框 -->
            <el-popconfirm @confirm="confirm" title="确认退出吗?" confirm-button-text="确认" cancel-button-text="取消">
              <template #reference>
                <a>退出登录</a>
              </template>
            </el-popconfirm>
          </li>


          <li><a>地址簿</a></li>
          <li><router-link to="/user">用户中心</router-link></li>

<!-- 
          <li><a href="javascript:;">地址簿</a></li>
          <li><a href="javascript:;">会员中心</a></li> -->

        </template>

        <template v-else>
          <li><a  @click="$router.push('/login')">请先登录</a></li>
          <li><a >帮助中心</a></li>
          <li><a>关于我们</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.app-topnav {
  background: #333;
  ul {
    display: flex;
    height: 60px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        text-decoration: none; /* 取消下划线 */

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: skyblue;
        }
      }

      ~li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
</style>
