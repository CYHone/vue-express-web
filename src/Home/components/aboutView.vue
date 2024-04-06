
<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="新闻动态" name="first">新闻动态</el-tab-pane>
    <el-tab-pane label="客户评价" name="second">客户评价</el-tab-pane>
    <el-tab-pane label="寄件规则" name="third">寄件规则</el-tab-pane>
    <el-tab-pane label="意见反馈" name="fourth">意见反馈</el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style>


.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 40px;
  font-weight: 600;
}
</style>
