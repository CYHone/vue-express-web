<template>
  <LayoutNav />
  <LayoutHeader />
  <div class="order">
    <el-form style="display: flex;padding-left: 50px;">
      <!-- 第一个 el-card -->
      <el-card style="height: 500px; width: 600px; margin-right: 20px;">
        <el-table :data="formattedShipmentIds" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="运单号" width="300" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <!-- 点击按钮时调用 getShipmentInfo，并传递当前行的运单 ID -->
              <el-button type="primary" @click="getShipmentInfo(scope.row.id)">查询包裹</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 第二个 el-card -->
      <el-card style="height: 500px; width: 800px;">
        <el-table :data="shipmentInfo" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="包裹号" width="150" />
          <el-table-column prop="createDate" label="创建时间" width="300" />
          <el-table-column prop="price" label="价格" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="success" @click="open(scope.row)">查询物流</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
  </div>
  <LayoutFooter />
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout//components/LayoutHeader.vue'
import LayoutFooter from '../Layout//components/LayoutFooter.vue'
import { ElMessage } from 'element-plus';
import axios from '@/utils/axios-config';
import router from '@/router';

const shipmentIds = ref([]);
const shipmentInfo = ref([]);
const userId = localStorage.getItem('userId');

const getShipmentIds = () => {
  axios.get(`shipment/getShipmentIds?id=${userId}`)
    .then(response => {
      console.log(response.data);
      if (response.data.code === 200) {
        ElMessage.success(response.data.message);
        shipmentIds.value = response.data.data; // 更新 shipmentIds
        console.log("运单数据"+shipmentIds.value);
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch(error => {
      console.error('获取运单ID列表失败：', error);
      ElMessage.error('获取运单ID列表失败，请重试');
    });
};

const getShipmentInfo = (id) => {
  axios.get(`shipment/getShipmentInfo?id=${id}`)
    .then(response => {
      if (response.data.code === 200) {
        ElMessage.success('成功获取运单信息');
        const info = response.data.data.shipment;
        shipmentInfo.value = [info]; // 转换为数组格式
        console.log(info);
        console.log(info.id);
      } else {
        ElMessage.error('未找到该运单信息');
      }
    })
    .catch(error => {
      console.error('获取运单信息失败：', error);
      ElMessage.error('获取运单信息失败，请重试');
    });
};

onMounted(() => {
  // 当组件挂载时调用获取运单ID的函数
  getShipmentIds();
});

// 将每个运单号包装成对象，以符合表格的数据格式要求
const formattedShipmentIds = ref([]);

watchEffect(() => {
  formattedShipmentIds.value = shipmentIds.value.map(id => ({ id }));
});


const open = (row) => {
  // 编程式导航到目标页面，并传递参数 packageId
  router.push({ path: "/inquire/MapContainer", query: { packageId: row.id } });
};

</script>




<!-- <script setup>
import { ref, onMounted } from 'vue';
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout//components/LayoutHeader.vue'
import LayoutFooter from '../Layout//components/LayoutFooter.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '@/utils/axios-config';
import router from '@/router';
const shipmentId = ref('');
const userId = localStorage.getItem('userId');



const getShipmentIds = () => {
  axios.get(`shipment/getShipmentIds?id=${userId}`)
    .then(response => {
      console.log(response.data);
      if (response.data.code === 200) {
        ElMessage.success(response.data.message);
        shipmentId.value = response.data.data; // 直接更新 shipmentId

        console.log("运单数据"+shipmentId.value);
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch(error => {
      console.error('获取运单ID列表失败：', error);
      ElMessage.error('获取运单ID列表失败，请重试');
    });
};

onMounted(() => {
  // 当组件挂载时调用获取运单ID的函数
  getShipmentIds();
});

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
    <el-card style="height: 300px; width: 800px;">
        <el-table :data="[shipmentId]" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="运单号" width="300" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" @click="open(scope.row)">查询物流</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
  </div>
  <LayoutFooter />
</template> -->



<!-- 
<script setup>
import { ref } from 'vue';
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout//components/LayoutHeader.vue'
import LayoutFooter from '../Layout//components/LayoutFooter.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from '@/utils/axios-config';
import router from '@/router';

const shipmentId = ref('');
const id = ref('');
const shipmentInfo = ref([]); // 改为数组格式

const getShipmentIds = () => {
  axios.get(`shipment/getShipmentIds?id=${id.value}`)
    .then(response => {
      console.log(response.data);
      if (response.data.code === 200) {
        ElMessage.success(response.data.message);
        const shipmentIds = response.data.data;
        showShipmentIdsDialog(shipmentIds);
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch(error => {
      console.error('获取运单ID列表失败：', error);
      ElMessage.error('获取运单ID列表失败，请重试');
    });
};

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
      if (response.data.code === 200) {
        ElMessage.success('成功获取运单信息');
        const info = response.data.data.shipment;
        shipmentInfo.value = [info]; // 转换为数组格式
        console.log(info);
        console.log(info.id);
      } else {
        ElMessage.error('未找到该运单信息');
      }
    })
    .catch(error => {
      console.error('获取运单信息失败：', error);
      ElMessage.error('获取运单信息失败，请重试');
    });
};

const open = (row) => {
  // 编程式导航到目标页面，并传递参数 packageId
  router.push({ path: "/inquire/MapContainer", query: { packageId: row.id } });
};

</script> -->



<!-- <template>
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

      <el-form-item label="获取包裹信息" prop="shipmentId">
        <div class="input-button-container">
          <el-input v-model="shipmentId" placeholder="请输入运单ID" />
          <el-button type="primary" @click="getShipmentInfo">查询</el-button>
        </div>
      </el-form-item>

      <el-card  style="height: 300px; width: 800px;">  
        <el-table :data="shipmentInfo" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="包裹号" width="150" />
          <el-table-column prop="createDate" label="创建时间" width="300" />
          <el-table-column prop="price" label="价格" width="120" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              
               <el-button type="primary" @click="open(scope.row)">查询物流</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
  </div>
  <LayoutFooter />
</template> -->

<!-- <style scoped lang="scss">
.order {
  background: url('src/assets/background.jpg');
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
  
  margin-right: 10px;
}
</style> -->
