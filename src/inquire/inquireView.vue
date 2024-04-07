 <script setup>
import LayoutNav from '../Layout/components/LayoutNav.vue'
import LayoutHeader from '../Layout//components/LayoutHeader.vue'
import LayoutFooter from '../Layout//components/LayoutFooter.vue'
</script>

<template>
  <LayoutNav />
  <LayoutHeader />
  <div class="contain">
    查询
    <div style="display: flex;flex-direction: row; width: 80%;">
          <el-input
              v-model="expressId"
              class="w-50 m-2"
              placeholder="请输入快递单号"
              style="margin-right: 20px"
          />
          <el-button type="primary" @click="showProgressBox">查询</el-button>
          <el-button type="primary" @click="showMap">物流路线</el-button>
        </div>
  </div>
  <LayoutFooter />
</template> 

<style coped lang='scss'>
.contain{
  height: 400px;
}
</style>