<template>
  <div>
    <LayoutNav/>
    <LayoutHeader/>

    <div style="padding: 30px;">
      <el-card class="box-card" shadow="always" style="width: 93%">
        <template #header>
          <div class="card-header" style="text-align: left">
            <span>管理地址</span>
            <el-button class="button" type="text" @click="addAddress">新增</el-button>
          </div>
        </template>

        <el-table :data="addressData" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="adname" label="收货人" width="100">
            <template #default="scope">
              <el-input v-model="scope.row.adname" v-if="addressEdit[scope.$index]" size="medium"></el-input>
              <span v-else>{{ scope.row.adname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="adphone" label="联系方式" width="140">
            <template #default="scope">
              <el-input v-model="scope.row.adphone" v-if="addressEdit[scope.$index]" size="medium"></el-input>
              <span v-else>{{ scope.row.adphone }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="addetail" label="详细地址" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.addetail" v-if="addressEdit[scope.$index]" size="medium"></el-input>
              <span v-else>{{ scope.row.addetail }}</span>
            </template>
          </el-table-column>

          

          <el-table-column prop="adisdefault" label="默认地址" width="100">
            <template #default="scope">
              <div v-if="addressEdit[scope.$index]">
                <el-checkbox v-model="scope.row.adisdefault" :true-label="1" :false-label="0" @change="changetest">设为默认</el-checkbox>
              </div>
              <div v-else>
                <el-tag v-if="scope.row.adisdefault == 1" type="success" size="mini">默认</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template #default="scope">
              <el-button
                size="small"
                icon="el-icon-edit"
                v-if="!addressEdit[scope.$index]"
                @click="editAddress(scope.$index)"
              >编辑
              </el-button>
              <el-button
                size="small"
                icon="el-icon-check"
                v-else
                @click="saveAddress(scope.$index, scope.row)"
              >保存
              </el-button>
              <el-popconfirm
                confirmButtonText='好的'
                cancelButtonText='不用了'
                icon="el-icon-info"
                title="确定删除该地址？"
                @confirm="deleteAddress(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    icon="el-icon-delete"
                  >删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <LayoutFooter />
  </div>
</template>

<script setup>
import LayoutNav from '../Layout/components/LayoutNav.vue';
import LayoutHeader from '../Layout/components/LayoutHeader.vue';
import LayoutFooter from '../Layout/components/LayoutFooter.vue';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from '@/utils/axios-config';

const addressData = ref([]);
const addressEdit = ref([]);
// const pcaOptions = pca;
const addressProps = {
  label: 'name',
  children: 'children',
  value: 'code'
};



const addAddress = () => {
  addressData.value.push({}); //3.3 新增地址
  addressEdit.value[addressData.value.length - 1] = true;
};

const editAddress = (index) => {
  addressEdit.value[index] = !addressEdit.value[index];
};

const saveAddress = (index, value) => {
  addressEdit.value[index] = !addressEdit.value[index];
};

const deleteAddress = (index, value) => {
  addressData.value.splice(index, 1);
};


const changetest = (val) => {
  console.log(typeof (val));
  console.log(val);
};

const id = localStorage.getItem('userId');

const getAddress = () => {
  axios.get(`/customer/getAddress?id=${id}`).then(res => {
    addressData.value = res.data.data.map(detailAddress => ({
      addetail: detailAddress // 假设详细地址存储在 addetail 属性中
    }));
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
