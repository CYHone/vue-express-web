<template>
  <div>
    <LayoutNav/>
    <LayoutHeader/>

    <!-- 地址管理 -->
    <div style="padding: 30px;">
      <el-card class="box-card" shadow="always" style="width: 93%">
        <template #header>
          <!-- 卡片标题 -->
          <div class="card-header" style="text-align: left">
            <span>管理地址</span>
            <!-- 新增按钮 -->
            <el-button class="button" type="success" @click="addAddress">新增</el-button>
          </div>
        </template>

        <!-- 地址列表 -->
        <el-table :data="addressData" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <!-- 收货人列 -->
          <el-table-column prop="adname" label="收货人" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.adname" v-if="addressEdit[scope.$index]" size="medium"></el-input>
              <span v-else>{{ scope.row.adname }}</span>
            </template>
          </el-table-column>
          <!-- 联系方式列 -->
          <el-table-column prop="adphone" label="联系方式" width="200">
            <template #default="scope">
              <el-input v-model="scope.row.adphone" v-if="addressEdit[scope.$index]" size="medium"></el-input>
              <span v-else>{{ scope.row.adphone }}</span>
            </template>
          </el-table-column>

          <!-- 详细地址列 -->
          <el-table-column prop="addetail" label="详细地址" width="250">
            <template #default="scope">
              <el-input v-model="scope.row.addetail" v-if="addressEdit[scope.$index]" size="medium"></el-input>
              <span v-else>{{ scope.row.addetail }}</span>
            </template>
          </el-table-column>

          <!-- 操作列 -->
          <el-table-column  label="操作" align="center" width="180">
            <template #default="scope">
       
              <el-button
                size="small"
                type="success"
                @click="saveAddress(scope.$index, scope.row)"
              >保存
              </el-button>
              
              <!-- 删除操作确认框 -->
              <el-popconfirm
                confirmButtonText='好的'
                cancelButtonText='不用了'
                title="确定删除该地址？"
                @confirm="deleteAddress(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                  >删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </div>

    <!-- 页脚 -->
    <LayoutFooter />
  </div>
</template>

<script setup>
import LayoutNav from '../Layout/components/LayoutNav.vue';
import LayoutHeader from '../Layout/components/LayoutHeader.vue';
import LayoutFooter from '../Layout/components/LayoutFooter.vue';
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios-config';
const id = localStorage.getItem('userId');
const addressData = ref([]);
const addressEdit = ref([]);

const addressProps = {
  label: 'name',
  children: 'children',
  value: 'code'
};



// 删除地址
const deleteAddress = (index, rowData) => {
  // 构造需要发送的数据格式
  const data = {
    id: id,
    address: JSON.stringify(rowData)
  };

  // 向服务器发送 POST 请求删除地址
  axios.post('/customer/deleteAddress', data)
    .then(response => {
      // 在前端删除该地址
      addressData.value.splice(index, 1);

      // 成功后更新地址列表数据
      getAddress();
    })
    .catch(error => {
      console.error('删除地址失败：', error);
    });
};


//新增地址
const addAddress = () => {
  //在页面的地址列表中新增一行，并显示为空白的输入框
  addressData.value.push({});
  //将刚刚添加的地址行设置为可编辑状态
  addressEdit.value[addressData.value.length - 1] = true;
};  

// 保存地址
const saveAddress = (index, rowData) => {
  // 构造需要发送的数据格式
  const data = {
    id: id, // 如果存在 id，则使用现有 id，否则设为 0
    address: JSON.stringify({
      adname: rowData.adname,
      adphone: rowData.adphone,
      addetail: rowData.addetail,
    })
  };

  // 向服务器发送 POST 请求添加或更新地址
  axios.post('/customer/addAddress', data)
    .then(response => {
      // 成功后更新地址列表数据
      getAddress();
    })
    .catch(error => {
      // 处理错误
      console.error('保存地址失败：', error);
    });
};

// 得到地址
const getAddress = () => {
  axios.get(`/customer/getAddress?id=${id}`).then(res => {
    addressData.value = res.data.data.map(detailAddress => JSON.parse(detailAddress));
  }).catch(error => {
    console.error('获取地址失败：', error);
  });
};


onMounted(() => {
  getAddress();
});

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>



