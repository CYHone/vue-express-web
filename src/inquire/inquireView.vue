 <script setup>
 import { ref } from 'vue';
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout//components/LayoutHeader.vue'
import LayoutFooter from '../Layout//components/LayoutFooter.vue'
import { ElMessage,ElMessageBox } from 'element-plus';
import axios from '@/utils/axios-config' // 导入全局配置的 axios 实例

const shipmentId = ref(''); // 使用 ref 来声明响应式变量
const id = ref('');
const packageId = ref('');
const packageId1 = ref('');
const email = ref('');

const getShipmentIds = () => {
  axios.get(`shipment/getShipmentIds?id=${id.value}`)
    .then(response => {
      // 处理获取到的运单ID列表
      console.log(response.data);
      if (response.data.code === 200) {
        ElMessage.success(response.data.message); // 成功获取消息
        const shipmentIds = response.data.data; // 获取成功时的运单 ID 列表
        showShipmentIdsDialog(shipmentIds); // 调用展示运单 ID 列表的弹窗函数
      } else {
        ElMessage.error(response.data.message); // 获取失败消息
      }
    })
    .catch(error => {
      // 处理错误
      console.error('获取运单ID列表失败：', error);
      ElMessage.error('获取运单ID列表失败，请重试');
   });
};
// 展示运单 ID 列表的弹窗
const showShipmentIdsDialog = (shipmentIds) => {
  ElMessageBox.alert(
    `
      <div>
        <p>以下是您的运单 ID 列表：</p>
        <ul>
          ${shipmentIds.map(id => `<li>${id}</li>`).join('')}
        </ul>
      </div>
    `,
    '运单 ID 列表',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定',
    }
  );
};

const getShipmentInfo = () => {
  axios.get(`shipment/getShipmentInfo?id=${shipmentId.value}`)
    .then(response => {
      // 处理获取到的运单信息
      const shipmentInfo = response.data.data.shipment; // 获取成功时的运单信息
      if (response.data.code === 200) {
        ElMessage.success('成功获取运单信息'); // 成功获取消息
        console.log(shipmentInfo); // 输出运单信息到控制台
        console.log(shipmentInfo.id); // 输出运单ID到控制台
        showShipmentInfoDialog(shipmentInfo); // 调用展示运单信息的弹窗函数
      } else {
        ElMessage.error('未找到该运单信息'); // 获取失败消息
      }
    })
    .catch(error => {
      // 处理错误
      console.error('获取运单信息失败：', error);
      ElMessage.error('获取运单信息失败，请重试');
    });
};
const showShipmentInfoDialog = (shipmentInfo) => {
  ElMessageBox.alert(
    `
      <div>
        <p>以下是您的包裹ID信息：</p>
        <ul>
          <li>包裹ID: ${shipmentInfo.id}</li>
          <li>创建日期: ${shipmentInfo.createDate}</li>
          <li>始发地: ${shipmentInfo.origin}</li>
          <li>目的地: ${shipmentInfo.destination}</li>
          <li>价格: ${shipmentInfo.price}</li>
          <li>状态: ${shipmentInfo.status}</li>
          <li>顾客ID: ${shipmentInfo.customerId}</li>
          <li>类型: ${shipmentInfo.type}</li>
        </ul>
      </div>
    `,
    '运单信息',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定',
    }
  );
};
const getCustomerByEmail = () => {
  axios.get(`customer/getCustomerByEmail?email=${email.value}`)

    .then(response => {
      if (response.data.code === 200){
        const customerInfo = response.data.data; 
        console.log(customerInfo);
        // 处理获取到的用户信息
        console.log(response.data);
        console.log(response.data.data.id);
        showCustomerIdDialog(response.data.data.id)
        localStorage.setItem('customerId', response.data.data.id);

      }else {
        ElMessage.error('查询用户信息失败'); // 获取失败消息
      }
    })
    .catch(error => {
      // 处理错误
      console.error('查询用户信息失败：', error);
    });
};
const showCustomerIdDialog = (customerId) => {
  ElMessageBox.alert(`您需要的用户ID是：${customerId}`, '用户ID信息', {
    confirmButtonText: '确定',
  });
};
const getPackageById = () => {
  axios.get(`package/getPackageById?id=${packageId1.value}`)
    .then(response => {
      // 处理获取到的包裹信息
      const packageInfo = response.data.data; // 获取成功时的包裹信息
      if (response.data.code === 200) {
        ElMessage.success('成功获取包裹信息'); // 成功获取消息
        console.log(packageInfo); // 输出包裹信息到控制台
        showPackageDialog(packageInfo)
      }
      else {
        ElMessage.error('未找到该包裹信息'); // 获取失败消息
      }
    })
    .catch(error => {
      // 处理错误
      console.error('获取包裹信息失败：', error);
      ElMessage.error('获取包裹信息失败，请重试');
    });
};

const showPackageDialog = (packageInfo) =>{
  ElMessageBox.alert(
    `
      <div>
        <p>以下是您的包裹信息：</p>
        <ul>
          <li>收货人: ${packageInfo.receiverName}</li>
          <li>收货人电话: ${packageInfo.receiverPhone}</li>
          <li>运单ID: ${packageInfo.shipmentId}</li>
          <li>尺寸: ${packageInfo.size}</li>
          <li>付款方式: ${packageInfo.status}</li>
          <li>重量: ${packageInfo.weight}</li>
        </ul>
      </div>
    `,
    '运单信息',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定',
    }
  );
}

const getPackageLocation = () => {
  axios.get(`package/getPackageLocation?id=${packageId.value}`)
    .then(response => {
      // 处理获取到的包裹位置历史信息
      const locationHistory = response.data.data; // 获取成功时的位置历史信息
      if (response.data.code === 200) {
        ElMessage.success('成功获取包裹地理位置历史信息'); // 成功获取消息
        console.log(locationHistory); // 输出位置历史信息到控制台
        // 在此处处理位置历史信息，例如展示在页面上或者其他操作
      } else {
        ElMessage.error('未找到该包裹地理位置历史信息'); // 获取失败消息
      }
    })
    .catch(error => {
      // 处理错误
      console.error('获取包裹地理位置历史信息失败：', error);
      ElMessage.error('获取包裹地理位置历史信息失败，请重试');
    });
};



</script>

<template>
  <LayoutNav />
  <LayoutHeader />
  <div class="order">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >

    <el-form-item label="获取运单ID" prop="id">
        <div class="input-button-container">
          <el-input v-model="id" placeholder="请输入用户ID" />
          <el-button type="primary" @click="getShipmentIds">查询</el-button>
        </div>
      </el-form-item>

    <el-form-item label="获取运单和附属包裹信息" prop="shipmentId">
        <div class="input-button-container">
          <el-input v-model="shipmentId" placeholder="请输入运单ID" />
          <el-button type="primary" @click="getShipmentInfo">查询</el-button>
        </div>
      </el-form-item>

      <el-form-item label="获取包裹信息" prop="packageId1">
        <div class="input-button-container">
          <el-input v-model="packageId1" placeholder="请输入包裹ID" />
          <el-button type="primary" @click="getPackageById">查询</el-button>
        </div>
      </el-form-item>

      <el-form-item label="获取包裹位置" prop="packageId">
        <div class="input-button-container">
          <el-input v-model="packageId" placeholder="请输入包裹ID"/>
          <el-button type="primary" @click="getPackageLocation">查询</el-button>
        </div>
      </el-form-item>

      <el-form-item label="根据邮箱查询用户ID" prop="email">
        <div class="input-button-container">
          <el-input v-model="email" placeholder="请输入用户邮箱" ref="emailInput" />
          <el-button type="primary" @click="getCustomerByEmail">查询</el-button>
        </div>
      </el-form-item>

    </el-form>
  </div>
  <LayoutFooter />
</template>

<style scoped lang="scss">
.order {
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-bottom: 1px solid #e4e4e4;
  padding: 20px;
}

.input-button-container {
  display: flex;
  align-items: center;
}

.input-button-container el-input {
  margin-right: 10px; /* 调整 input 和 button 之间的间距 */
}
</style>
