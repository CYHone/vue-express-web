<template>
  <LayoutNav />
  <LayoutHeader />
  <div class="order">
    <el-form style="display: flex;padding-left: 50px;">
      <!-- 第一个 el-card -->
      <el-card style="height: 500px; width: 500px; margin-right: 20px;">
        <el-table :data="formattedShipmentIds" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="运单号" width="200" />
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <div style="display: flex; justify-content: center;">
                <!-- 点击按钮时调用 getShipmentInfo，并传递当前行的运单 ID -->
                <el-button type="success" @click="getShipmentInfo(scope.row.id)" style="margin-right: 5px;">查询包裹</el-button>
                <el-button type="primary" @click="addPackage(scope.row.id)">添加包裹</el-button>
              </div>
            </template>

          </el-table-column>
        </el-table>
      </el-card>
      

      <el-card style="height: 500px; width: 800px;">
        <el-table :data="packages" style="width: 100%" max-height="600px">
          <el-table-column prop="id" label="包裹号" width="200" />
          <el-table-column prop="receiverPhone" label="收件人电话" width="150" />
          <el-table-column prop="receiverAddress" label="收件人地址" width="150" />
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <div style="display: flex; justify-content: center;">
              <el-button type="success" @click="open(scope.row)">查询物流</el-button>
              <el-button type="primary" @click="showProgressBox(scope.row)">物流进度</el-button>
              </div>
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
import { ElMessage,ElMessageBox} from 'element-plus';
import axios from '@/utils/axios-config';
import router from '@/router';


const shipmentIds = ref([]);
const packages = ref([]);
const userId = localStorage.getItem('userId');


const showProgressBox = (id) => {
  console.log(id);
  axios.get(`package/getPackageHistory?id=${id.id}`)
    .then(response => {
      if (response.data.code === 200) {
        ElMessage.success(response.data.message);

        // 提取并格式化所有数据
        const progressInfos = response.data.data.map(item => {
          const [time, status] = Object.entries(item)[0];
          return `${new Date(time).toLocaleString()}: ${status}`;
        });

        // 在控制台打印数据
        console.log(response.data);

        // 创建对话框内容
        const dialogTitle = '物流进度';
        const dialogContent = progressInfos.join('<br>');

        // 调用 ElMessageBox.alert 方法弹出消息框
        ElMessageBox.alert(dialogContent, {
          title: dialogTitle,
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString: true,
        });
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch(error => {
      ElMessage.error('请求失败，请稍后重试');
      console.error(error);
    });
};




const addPackage = (id) => {
  console.log(id);
  localStorage.setItem('shipmentId', id);
  router.push("/package")
  // router.push('/addPackage');
};


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
        packages.value = response.data.data.packages; // 更新 packages
        console.log(response.data);
        console.log(info);
        console.log(packages.value);
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
  router.push({ path: "/MapContainer", query: { packageId: row.id } });
};


</script>
